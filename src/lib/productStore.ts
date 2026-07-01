/**
 * Public product data adapter.
 *
 * Two sources, chosen at build time by VITE_PRODUCTS_SOURCE:
 *
 *   • "local"    — read the synced catalog from /data/products.json (written by
 *                  the receiver) and use the site's own /product-images paths.
 *                  No live Supabase reads, no Supabase image bandwidth. This is
 *                  what a deployed e-commerce framework site uses.
 *   • (default)  — read **published** products / categories from Supabase, as on
 *                  the master/admin site. RLS enforces published-only.
 *
 * Either way, if the source yields nothing, `ProductsContext` falls back to the
 * static `src/data/*` catalogs so the public site always renders.
 */
import { DbProduct, DbProductCategory, supabase, supabaseConfigured } from "./supabase";

// NOTE: intentionally NOT keyed off VITE_PRODUCTS_SOURCE. Hostinger sets that
// variable in its dashboard, where it overrides .env.production at build time and
// silently forced the public storefront back to Supabase — making it ignore the
// KiuQ-synced /data/products.json that the receiver writes. (Same Hostinger
// override trap the blog system hit; see VITE_BLOG_SOURCE in blogStore.ts.)
// Default to the synced local catalog so KiuQ + Sync actually drives the site;
// only an explicit VITE_PRODUCTS_MODE=supabase opts back out (admin/master use).
const PRODUCTS_SOURCE =
  (import.meta.env.VITE_PRODUCTS_MODE as string | undefined) ?? "local";
// The catalog is served from public Supabase Storage (written by the product-sync
// Edge Function), NOT the git-deployed /data/products.json. Hostinger git deploys
// overwrite files under the site and were reverting every synced price/product;
// Storage is immune to deploys, so a synced change stays put. Falls back to the
// local file if an env override is set.
const CATALOG_STORAGE_URL =
  "https://kaaekveaaoriacwzzrnf.supabase.co/storage/v1/object/public/site-catalog/konstructz.com/products.json";
const LOCAL_CATALOG_URL =
  (import.meta.env.VITE_PRODUCTS_LOCAL_URL as string | undefined) ?? CATALOG_STORAGE_URL;

const useLocal = PRODUCTS_SOURCE !== "supabase";

/* ── local JSON source (synced catalog on this site) ───────────────────── */

interface LocalCatalog {
  products?: LocalProduct[];
  updated_at?: string | null;
}
/**
 * Canonical "synced product" shape written by the receiver. The KiuQ master
 * (product-sync Edge Function) emits these camelCase fields; the receiver
 * localizes featuredImage + galleryImages to this site's own image paths.
 */
interface LocalProduct {
  id: string;
  slug: string;
  sku?: string | null;
  name?: string;
  category?: string | null;
  productType?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  price?: number | string | null;
  salePrice?: number | string | null;
  stockStatus?: string | null;
  status?: string;
  featuredImage?: string | null;
  galleryImages?: string[];
  specs?: { label: string; value: string }[];
  relatedProducts?: unknown[];
  buttonUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  updatedAt?: string;
}

const asStr = (v: unknown): string | null =>
  v === null || v === undefined || v === "" ? null : String(v);

/** Map a synced local product back onto the DbProduct shape the UI expects. */
const toDbProduct = (p: LocalProduct): DbProduct => ({
  id: p.id,
  slug: p.slug,
  name: p.name ?? p.slug,
  brand: null,
  category_id: null,
  product_line: "konstructz",
  product_type: (p.productType as DbProduct["product_type"]) ?? "equipment",
  short_description: p.shortDescription ?? null,
  full_description: p.fullDescription ?? "",
  featured_image: p.featuredImage ?? null,
  gallery_images: Array.isArray(p.galleryImages) ? p.galleryImages : [],
  price: asStr(p.price),
  sale_price: asStr(p.salePrice),
  sku: p.sku ?? null,
  gtin: null,
  stock_status: p.stockStatus ?? null,
  condition: null,
  engine: null,
  horsepower: null,
  operating_weight: null,
  lift_capacity: null,
  digging_depth: null,
  width: null,
  height: null,
  length: null,
  fuel_type: null,
  machine_type: null,
  // The master sends a flat label/value spec list — surface it as extra_specs.
  extra_specs: Array.isArray(p.specs) ? p.specs : [],
  compatible_attachments: Array.isArray(p.relatedProducts)
    ? (p.relatedProducts as DbProduct["compatible_attachments"])
    : [],
  warranty_info: null,
  shipping_info: null,
  financing_info: null,
  button_text: null,
  button_url: p.buttonUrl ?? null,
  seo_title: p.seoTitle ?? null,
  seo_description: p.seoDescription ?? null,
  seo_keywords: null,
  status: (p.status as DbProduct["status"]) ?? "published",
  sort_order: 0,
  created_at: p.updatedAt ?? new Date().toISOString(),
  updated_at: p.updatedAt ?? new Date().toISOString(),
  published_at: p.updatedAt ?? null,
  created_by: null,
  updated_by: null,
  category: p.category ? { slug: "", name: p.category } : null,
});

let localCache: DbProduct[] | null = null;

const loadLocalProducts = async (): Promise<DbProduct[]> => {
  if (localCache) return localCache;
  try {
    const res = await fetch(LOCAL_CATALOG_URL, { cache: "no-cache" });
    if (!res.ok) return [];
    const data = (await res.json()) as LocalCatalog;
    const rows = (data.products ?? []).map(toDbProduct);
    localCache = rows;
    return rows;
  } catch {
    return [];
  }
};

/* ── public API (unchanged signatures) ─────────────────────────────────── */

/** All published products (both Konstructz and Typhon lines). */
export const listPublishedProducts = async (): Promise<DbProduct[]> => {
  if (useLocal) {
    const rows = await loadLocalProducts();
    return rows.filter((p) => p.status === "published");
  }
  if (!supabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*,category:product_categories(slug,name)")
    .eq("status", "published");
  if (error || !data) return [];
  return data as unknown as DbProduct[];
};

/** All product categories (public-readable). */
export const listProductCategories = async (): Promise<DbProductCategory[]> => {
  if (useLocal) {
    // Derive a lightweight category list from the synced catalog.
    const rows = await loadLocalProducts();
    const seen = new Map<string, DbProductCategory>();
    rows.forEach((p, i) => {
      const slug = p.category?.slug;
      if (slug && !seen.has(slug)) {
        seen.set(slug, {
          id: slug,
          slug,
          name: p.category?.name ?? slug,
          singular: null,
          brand: null,
          description: null,
          image: null,
          sort_order: i,
        });
      }
    });
    return [...seen.values()];
  }
  if (!supabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as DbProductCategory[];
};
