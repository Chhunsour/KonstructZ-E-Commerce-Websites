// Repair existing Supabase product rows that still point at external image URLs.
//
// Usage:
//   SUPABASE_URL=... SERVICE_KEY=... node scripts/repair-product-images.mjs
//
// Run db/migrations/0007_product_image_imports.sql before using this if you
// want thumbnail_image, image_import_warnings, and image_imports persisted.

import { createClient } from "@supabase/supabase-js";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  importProductImages,
  isExternalHttpUrl,
  loadImageImportCache,
  saveImageImportCache,
} = require("./product-image-importer.cjs");

const { SUPABASE_URL, SERVICE_KEY } = process.env;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SERVICE_KEY env vars.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const shouldRepairUrl = (url) =>
  typeof url === "string" && isExternalHttpUrl(url) && /supabase\.co|supabase\.in/i.test(url);

const replaceUrl = (url, bySource) => {
  if (!shouldRepairUrl(url)) return url;
  const hit = bySource.get(url);
  return hit?.localPath && hit.status !== "failed" ? hit.localPath : url;
};

const rowsResult = await supabase
  .from("products")
  .select("id, slug, name, featured_image, thumbnail_image, gallery_images")
  .order("updated_at", { ascending: false });

if (rowsResult.error) {
  console.error("Product scan failed:", rowsResult.error.message);
  process.exit(1);
}

const rows = rowsResult.data ?? [];
const targets = rows
  .map((row) => {
    const gallery = Array.isArray(row.gallery_images) ? row.gallery_images : [];
    const urls = [
      row.featured_image,
      ...gallery,
    ].filter(shouldRepairUrl);
    return { row, urls: [...new Set(urls)] };
  })
  .filter((target) => target.urls.length > 0);

if (!targets.length) {
  console.log("No products with Supabase image URLs found.");
  process.exit(0);
}

const cache = loadImageImportCache();
let done = 0;
const total = targets.reduce((sum, target) => sum + target.urls.length, 0);
let repaired = 0;
let failed = 0;
let metadataRows = [];

for (const target of targets) {
  const { row, urls } = target;
  const results = await importProductImages({
    productSlug: row.slug || row.id,
    productId: row.id,
    urls,
    cache,
    progress: (result) => {
      done += 1;
      const label =
        result.status === "failed"
          ? "Failed"
          : result.status === "skipped duplicate"
            ? "Skipped duplicate"
            : "Imported";
      console.log(`Downloading images ${done}/${total}: ${label} — ${row.slug}`);
    },
  });

  const bySource = new Map(results.map((result) => [result.sourceUrl, result]));
  const featured = replaceUrl(row.featured_image, bySource);
  const gallery = Array.isArray(row.gallery_images)
    ? row.gallery_images.map((url) => replaceUrl(url, bySource))
    : [];
  const featureResult = row.featured_image ? bySource.get(row.featured_image) : null;
  const warnings = results.filter((result) => result.warning).map((result) => result.warning);

  const update = {
    featured_image: featured || row.featured_image,
    thumbnail_image:
      featureResult?.thumbnailPath && featureResult.status !== "failed"
        ? featureResult.thumbnailPath
        : row.thumbnail_image || featured || row.featured_image,
    gallery_images: gallery,
    image_import_warnings: warnings,
  };

  const { error } = await supabase.from("products").update(update).eq("id", row.id);
  if (error) {
    failed += 1;
    console.error(`Product update failed for ${row.slug}: ${error.message}`);
    continue;
  }

  metadataRows = metadataRows.concat(
    results
      .filter((result) => result.localPath && result.localPath !== result.sourceUrl && result.fileSize)
      .map((result) => ({
        source_url: result.sourceUrl,
        local_path: result.localPath,
        product_id: row.id,
        file_size: result.fileSize,
        mime_type: result.mimeType,
        imported_at: new Date().toISOString(),
      })),
  );

  if (warnings.length) failed += 1;
  else repaired += 1;
}

saveImageImportCache(cache);

if (metadataRows.length) {
  const { error } = await supabase
    .from("image_imports")
    .upsert(metadataRows, { onConflict: "source_url" });
  if (error) {
    console.warn(`Image import metadata was not persisted: ${error.message}`);
  }
}

console.log(`Done. Repaired ${repaired} products; ${failed} products have image import warnings.`);
