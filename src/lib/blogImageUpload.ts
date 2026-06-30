/**
 * Shared blog image uploader for the admin editor.
 *
 * Used by both the Featured Image drop zone and the article body editor so
 * pasted / dropped / picked images travel the same safe path:
 *
 *   1. validate the MIME type (jpg, png, webp, avif),
 *   2. optionally convert/compress to WebP via <canvas> (best-effort, never fatal),
 *   3. generate a safe, collision-resistant filename,
 *   4. upload to the existing `blog-images` bucket under
 *      `blog/konstructz/{post-slug}/…`,
 *   5. return the stored path plus its public CDN URL.
 *
 * Supabase Storage's JS client does not surface upload progress events, so
 * callers should show an indeterminate "Uploading…" state rather than a %.
 */
import {
  BLOG_IMAGE_BUCKET,
  BLOG_STORAGE_MIGRATION,
  blogImagePublicUrl,
  isMissingBlogImageBucket,
  supabase,
} from "./supabase";

/** MIME types the bucket accepts (mirrors 0003_blog_storage_bucket.sql). */
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const EXT_FOR_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export interface UploadedImage {
  /** Storage path saved on the post (e.g. blog/konstructz/my-slug/abc.webp). */
  path: string;
  /** Public CDN URL for immediate preview / insertion. */
  url: string;
}

/** Lowercase-kebab a string for use in storage paths and filenames. */
const slugifyPart = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** A short, collision-resistant token: time + random, base36. */
const shortToken = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/**
 * Best-effort WebP conversion/compression. Returns the original blob/type when
 * conversion is unsupported, unhelpful (already webp/avif), or fails for any
 * reason — so an odd image never blocks the upload.
 */
const toWebpIfPossible = async (
  file: File
): Promise<{ blob: Blob; type: string }> => {
  if (file.type === "image/webp" || file.type === "image/avif") {
    return { blob: file, type: file.type };
  }
  if (
    typeof document === "undefined" ||
    typeof createImageBitmap === "undefined"
  ) {
    return { blob: file, type: file.type };
  }
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { blob: file, type: file.type };
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close?.();
    const webp = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/webp", 0.85)
    );
    // Only keep the WebP if it actually came back and is not larger.
    if (webp && webp.size > 0 && webp.size <= file.size) {
      return { blob: webp, type: "image/webp" };
    }
  } catch {
    /* fall through to original */
  }
  return { blob: file, type: file.type };
};

/**
 * Upload an image file for a blog post. Throws an `Error` with a friendly
 * message on validation/bucket/upload failure.
 */
export const uploadBlogImage = async (
  file: File,
  postSlug?: string
): Promise<UploadedImage> => {
  if (!supabase) {
    throw new Error("Supabase is not configured, so images can't be uploaded.");
  }
  if (!file.type || !ALLOWED_TYPES.has(file.type)) {
    throw new Error(
      "Unsupported image type. Use a JPG, PNG, WebP or AVIF file."
    );
  }

  const { blob, type } = await toWebpIfPossible(file);
  const ext = EXT_FOR_TYPE[type] ?? "img";
  const base =
    slugifyPart(file.name.replace(/\.[^.]+$/, "")).slice(0, 60) || "image";
  const folder = `blog/konstructz/${slugifyPart(postSlug || "") || "unsorted"}`;
  const path = `${folder}/${base}-${shortToken()}.${ext}`;

  const { error } = await supabase.storage
    .from(BLOG_IMAGE_BUCKET)
    .upload(path, blob, {
      cacheControl: "31536000",
      contentType: type,
      upsert: false,
    });

  if (error) {
    throw new Error(
      isMissingBlogImageBucket(error.message)
        ? `Upload failed: Supabase Storage bucket "${BLOG_IMAGE_BUCKET}" does not exist. Run ${BLOG_STORAGE_MIGRATION} in the Supabase SQL editor, then try again.`
        : `Upload failed: ${error.message}`
    );
  }

  const url = blogImagePublicUrl(path);
  if (!url) throw new Error("Upload succeeded but no public URL was returned.");
  return { path, url };
};

/** True when a pasted/typed string looks like a usable image URL. */
export const looksLikeImageUrl = (value: string): boolean => {
  const v = value.trim();
  if (!/^https?:\/\//i.test(v)) return false;
  return (
    /\.(jpe?g|png|webp|avif|gif)(\?.*)?$/i.test(v) ||
    /(supabase\.co|cloudinary|imgix|googleusercontent|cdn)/i.test(v)
  );
};
