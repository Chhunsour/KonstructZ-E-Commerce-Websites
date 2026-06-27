const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const STATIC_ROOT = path.join(process.cwd(), "static");
const UPLOAD_ROOT = path.join(STATIC_ROOT, "uploads", "products");
const PUBLIC_UPLOAD_BASE = "/uploads/products";
const CACHE_PATH = path.join(process.cwd(), "scripts", "image-imports.json");
const MAX_IMAGE_BYTES = Number(process.env.PRODUCT_IMAGE_MAX_BYTES || 12 * 1024 * 1024);
const REQUEST_TIMEOUT_MS = Number(process.env.PRODUCT_IMAGE_TIMEOUT_MS || 15000);
const ALLOWED_MIME = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function safeSlug(value) {
  const slug = normalizeText(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  return slug || "product";
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonAtomic(file, data) {
  ensureDir(path.dirname(file));
  const tmp = `${file}.tmp.${process.pid}`;
  fs.writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`);
  fs.renameSync(tmp, file);
}

function loadImageImportCache() {
  const cache = readJson(CACHE_PATH, { version: 1, byUrl: {}, byHash: {} });
  return {
    version: 1,
    byUrl: cache.byUrl && typeof cache.byUrl === "object" ? cache.byUrl : {},
    byHash: cache.byHash && typeof cache.byHash === "object" ? cache.byHash : {},
  };
}

function saveImageImportCache(cache) {
  writeJsonAtomic(CACHE_PATH, cache);
}

function isExternalHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function splitImageUrls(value) {
  return normalizeText(value)
    .split(/,\s*/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function publicPathExists(publicPath) {
  if (!publicPath || !publicPath.startsWith(PUBLIC_UPLOAD_BASE)) return false;
  const rel = publicPath.slice(PUBLIC_UPLOAD_BASE.length).replace(/^\/+/, "");
  return fs.existsSync(path.join(UPLOAD_ROOT, rel));
}

function mimeFromMagic(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

function extensionFromUrl(url) {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname).replace(/^\./, "").toLowerCase();
  if (ext === "jpeg") return "jpg";
  if (["jpg", "png", "webp"].includes(ext)) return ext;
  return "";
}

function samePathWithoutExtension(file, ext) {
  return file.replace(/\.[a-z0-9]+$/i, `.${ext}`);
}

function commandExists(command) {
  const result = spawnSync("sh", ["-c", `command -v ${command}`], { stdio: "ignore" });
  return result.status === 0;
}

function maybeConvertToWebp(sourcePath, mimeType) {
  if (process.env.PRODUCT_IMAGE_CONVERT_WEBP !== "1") return sourcePath;
  if (mimeType !== "image/jpeg" && mimeType !== "image/png") return sourcePath;
  if (!commandExists("cwebp")) return sourcePath;

  const webpPath = samePathWithoutExtension(sourcePath, "webp");
  const result = spawnSync("cwebp", ["-quiet", "-q", "84", sourcePath, "-o", webpPath], {
    stdio: "ignore",
  });
  if (result.status !== 0 || !fs.existsSync(webpPath)) return sourcePath;
  return webpPath;
}

function maybeCreateThumbnail(sourcePath, mimeType) {
  if (mimeType !== "image/jpeg" && mimeType !== "image/png") return null;
  if (!commandExists("sips")) return null;

  const ext = path.extname(sourcePath);
  const thumbPath = sourcePath.replace(new RegExp(`${ext}$`), `-thumb${ext}`);
  const result = spawnSync("sips", ["-Z", "720", sourcePath, "--out", thumbPath], {
    stdio: "ignore",
  });
  if (result.status !== 0 || !fs.existsSync(thumbPath)) return null;
  return thumbPath;
}

function toPublicPath(filePath) {
  const relative = path.relative(UPLOAD_ROOT, filePath).replace(/\\/g, "/");
  return `${PUBLIC_UPLOAD_BASE}/${relative}`;
}

async function readResponseWithLimit(response) {
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_IMAGE_BYTES) {
    throw new Error(`image exceeds ${MAX_IMAGE_BYTES} byte limit`);
  }

  if (!response.body || typeof response.body.getReader !== "function") {
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > MAX_IMAGE_BYTES) {
      throw new Error(`image exceeds ${MAX_IMAGE_BYTES} byte limit`);
    }
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = Buffer.from(value);
    size += chunk.length;
    if (size > MAX_IMAGE_BYTES) {
      throw new Error(`image exceeds ${MAX_IMAGE_BYTES} byte limit`);
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function downloadImage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": "KonstructzProductImageImporter/1.0" },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const headerMime = normalizeText(response.headers.get("content-type")).split(";")[0].toLowerCase();
    if (headerMime && !ALLOWED_MIME.has(headerMime)) {
      throw new Error(`blocked non-image content-type ${headerMime}`);
    }

    const buffer = await readResponseWithLimit(response);
    const magicMime = mimeFromMagic(buffer);
    if (!magicMime || !ALLOWED_MIME.has(magicMime)) {
      throw new Error("downloaded content is not a supported image");
    }
    if (headerMime && headerMime !== magicMime) {
      throw new Error(`content-type mismatch: ${headerMime} vs ${magicMime}`);
    }

    return {
      buffer,
      mimeType: magicMime,
      extension: ALLOWED_MIME.get(magicMime),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function cacheRow({ sourceUrl, localPath, thumbnailPath, productId, fileSize, mimeType, status }) {
  return {
    source_url: sourceUrl,
    local_path: localPath,
    thumbnail_path: thumbnailPath || localPath,
    product_id: productId || null,
    file_size: fileSize,
    mime_type: mimeType,
    status,
    imported_at: new Date().toISOString(),
  };
}

async function importOneImage({ sourceUrl, productSlug, productId, order, cache }) {
  if (!isExternalHttpUrl(sourceUrl)) {
    return {
      sourceUrl,
      localPath: sourceUrl,
      thumbnailPath: sourceUrl,
      status: "local",
      warning: null,
    };
  }

  const cached = cache.byUrl[sourceUrl];
  if (cached?.local_path && publicPathExists(cached.local_path)) {
    return {
      sourceUrl,
      localPath: cached.local_path,
      thumbnailPath: cached.thumbnail_path || cached.local_path,
      status: "skipped duplicate",
      warning: null,
      fileSize: cached.file_size,
      mimeType: cached.mime_type,
    };
  }

  try {
    const downloaded = await downloadImage(sourceUrl);
    const hash = require("node:crypto").createHash("sha1").update(downloaded.buffer).digest("hex");
    const hashed = cache.byHash[hash];
    if (hashed?.local_path && publicPathExists(hashed.local_path)) {
      const row = cacheRow({
        sourceUrl,
        localPath: hashed.local_path,
        thumbnailPath: hashed.thumbnail_path || hashed.local_path,
        productId,
        fileSize: downloaded.buffer.length,
        mimeType: downloaded.mimeType,
        status: "skipped duplicate",
      });
      cache.byUrl[sourceUrl] = row;
      return {
        sourceUrl,
        localPath: row.local_path,
        thumbnailPath: row.thumbnail_path,
        status: "skipped duplicate",
        warning: null,
        fileSize: row.file_size,
        mimeType: row.mime_type,
      };
    }

    const extFromUrl = extensionFromUrl(sourceUrl);
    const ext = extFromUrl && extFromUrl === downloaded.extension ? extFromUrl : downloaded.extension;
    const dir = path.join(UPLOAD_ROOT, safeSlug(productSlug));
    ensureDir(dir);

    const basename = `${safeSlug(productSlug)}-${String(order + 1).padStart(2, "0")}`;
    let dest = path.join(dir, `${basename}.${ext}`);
    fs.writeFileSync(dest, downloaded.buffer, { flag: "w" });
    dest = maybeConvertToWebp(dest, downloaded.mimeType);
    const thumbnail = maybeCreateThumbnail(dest, downloaded.mimeType) || dest;

    const row = cacheRow({
      sourceUrl,
      localPath: toPublicPath(dest),
      thumbnailPath: toPublicPath(thumbnail),
      productId,
      fileSize: fs.statSync(dest).size,
      mimeType: path.extname(dest).toLowerCase() === ".webp" ? "image/webp" : downloaded.mimeType,
      status: "imported",
    });
    cache.byUrl[sourceUrl] = row;
    cache.byHash[hash] = row;

    return {
      sourceUrl,
      localPath: row.local_path,
      thumbnailPath: row.thumbnail_path,
      status: "imported",
      warning: null,
      fileSize: row.file_size,
      mimeType: row.mime_type,
    };
  } catch (error) {
    return {
      sourceUrl,
      localPath: sourceUrl,
      thumbnailPath: sourceUrl,
      status: "failed",
      warning: `${sourceUrl}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function importProductImages({ productSlug, productId, urls, cache, progress }) {
  const uniqueUrls = [...new Set((urls || []).map((url) => normalizeText(url)).filter(Boolean))];
  const results = [];
  for (let index = 0; index < uniqueUrls.length; index += 1) {
    const result = await importOneImage({
      sourceUrl: uniqueUrls[index],
      productSlug,
      productId,
      order: index,
      cache,
    });
    results.push(result);
    if (progress) progress(result);
  }
  return results;
}

module.exports = {
  CACHE_PATH,
  PUBLIC_UPLOAD_BASE,
  UPLOAD_ROOT,
  importProductImages,
  isExternalHttpUrl,
  loadImageImportCache,
  saveImageImportCache,
  splitImageUrls,
};
