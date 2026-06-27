// One-time seed: import the existing static catalogs into the new product
// tables. Idempotent (upsert on slug) so it's safe to re-run after edits.
//
// Prereq: run db/migrations/0005_product_schema.sql in the Supabase SQL editor.
//
// Usage:
//   SUPABASE_URL=... SERVICE_KEY=... node scripts/seed-products.mjs
//
// SERVICE_KEY = Supabase → Project Settings → API → service_role (secret).

import { createClient } from "@supabase/supabase-js";
import esbuild from "esbuild";
import { pathToFileURL } from "node:url";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const { SUPABASE_URL, SERVICE_KEY } = process.env;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SERVICE_KEY env vars.");
  process.exit(1);
}

// ── 1. Bundle the TS data modules so Node can import them ──────────────────
const tmp = path.join(os.tmpdir(), `kz-seed-${Date.now()}.mjs`);
await esbuild.build({
  stdin: {
    contents: `
      export { products } from "./src/data/products";
      export { typhonProducts } from "./src/data/typhonProducts";
      export { productCategories } from "./src/data/productCategories";
    `,
    resolveDir: process.cwd(),
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: tmp,
  logLevel: "error",
});
const { products, typhonProducts, productCategories } = await import(
  pathToFileURL(tmp).href
);
fs.rmSync(tmp, { force: true });

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── 2. Categories — collect every slug used, upsert, build slug→id map ─────
const catBySlug = new Map();
const addCat = (slug, name, singular) => {
  if (!slug || catBySlug.has(slug)) return;
  catBySlug.set(slug, { slug, name: name || slug, singular: singular || null });
};
for (const c of productCategories) addCat(c.slug, c.name, c.singular);
for (const p of products) addCat(p.category, p.categoryLabel);
for (const p of typhonProducts) addCat(p.category, p.categoryLabel);

const catRows = [...catBySlug.values()].map((c, i) => ({ ...c, sort_order: i }));
{
  const { error } = await supabase
    .from("product_categories")
    .upsert(catRows, { onConflict: "slug" });
  if (error) {
    console.error("Category upsert failed:", error.message);
    if (/relation .*product_categories.* does not exist/i.test(error.message)) {
      console.error("→ Run db/migrations/0005_product_schema.sql in Supabase first.");
    }
    process.exit(1);
  }
}
const { data: savedCats } = await supabase
  .from("product_categories")
  .select("id,slug");
const catId = new Map((savedCats ?? []).map((c) => [c.slug, c.id]));

// ── 3. Map products ────────────────────────────────────────────────────────
const now = new Date().toISOString();

const konstructzRows = products.map((p) => ({
  slug: p.id,
  name: p.name,
  brand: "Konstructz",
  category_id: catId.get(p.category) ?? null,
  product_line: "konstructz",
  product_type: "equipment",
  short_description: p.tagline ?? null,
  full_description: p.description ?? "",
  featured_image: p.image ?? null,
  thumbnail_image: p.image ?? null,
  gallery_images: Array.isArray(p.gallery) ? p.gallery : [],
  image_import_warnings: [],
  operating_weight: p.weight ?? null,
  extra_specs: Array.isArray(p.specs) ? p.specs : [],
  status: "published",
  published_at: now,
}));

const typhonRows = typhonProducts.map((p) => ({
  slug: p.id,
  name: p.name,
  brand: "Typhon",
  category_id: catId.get(p.category) ?? null,
  product_line: "typhon",
  product_type: p.productType === "attachment" ? "attachment" : "equipment",
  short_description: p.tagline ?? null,
  full_description: p.description ?? "",
  featured_image: p.image ?? null,
  thumbnail_image: p.thumbnailImage ?? p.image ?? null,
  gallery_images: Array.isArray(p.gallery) ? p.gallery : [],
  image_import_warnings: Array.isArray(p.imageImportWarnings) ? p.imageImportWarnings : [],
  price: p.currentPrice || p.price || null,
  sale_price: p.originalPrice && p.currentPrice && p.originalPrice !== p.currentPrice ? p.currentPrice : null,
  sku: p.sku || null,
  gtin: p.gtin || null,
  operating_weight: p.weight ?? null,
  extra_specs: Array.isArray(p.specs) ? p.specs : [],
  compatible_attachments: Array.isArray(p.applications) ? p.applications : [],
  button_text: p.buttonUrl ? "Buy on Typhon Store" : null,
  button_url: p.buttonUrl || null,
  status: "published",
  published_at: now,
}));

// ── 4. Upsert in chunks (PostgREST caps payload size) ──────────────────────
const all = [...konstructzRows, ...typhonRows];
let inserted = 0;
for (let i = 0; i < all.length; i += 200) {
  const chunk = all.slice(i, i + 200);
  const { error } = await supabase
    .from("products")
    .upsert(chunk, { onConflict: "slug" });
  if (error) {
    console.error(`Product upsert failed (chunk @${i}):`, error.message);
    process.exit(1);
  }
  inserted += chunk.length;
}

console.log(`✓ Categories: ${catRows.length}`);
console.log(`✓ Products:   ${inserted}  (Konstructz ${konstructzRows.length}, Typhon ${typhonRows.length})`);
console.log("Done. Published products are now live via the product system.");
