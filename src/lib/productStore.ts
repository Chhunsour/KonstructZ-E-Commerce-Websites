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

const PRODUCTS_SOURCE = (import.meta.env.VITE_PRODUCTS_SOURCE as string | undefined) ?? "supabase";
const LOCAL_CATALOG_URL =
  (import.meta.env.VITE_PRODUCTS_LOCAL_URL as string | undefined) ?? "/data/products.json";

const useLocal = PRODUCTS_SOURCE === "local";

/* ── local JSON source (synced catalog on this site) ───────────────────── */

interface LocalCatalog {
  products?: LocalProduct[];
  updated_at?: string | null;
}
interface LocalProduct {
  id: string;
  slug: string;
  name?: string;
  brand?: string | null;
  category?: string | null;
  category_slug?: string | null;
  product_line?: string;
  product_type?: string;
  short_description?: string | null;
  full_description?: string | null;
  price?: string | null;
  sale_price?: string | null;
  sku?: string | null;
  stock_status?: string | null;
  condition?: string | null;
  status?: string;
  featured_image?: string | null;
  gallery_images?: string[];
  specs?: Record<string, string | null>;
  extra_specs?: { label: string; value: string }[];
  compatible_attachments?: unknown[];
  warranty_info?: string | null;
  shipping_info?: string | null;
  financing_info?: string | null;
  button_text?: string | null;
  button_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  updated_at?: string;
}

/** Map a synced local product back onto the DbProduct shape the UI expects. */
const toDbProduct = (p: LocalProduct): DbProduct => {
  const specs = p.specs ?? {};
  return {
    id: p.id,
    slug: p.slug,
    name: p.name ?? p.slug,
    brand: p.brand ?? null,
    category_id: null,
    product_line: (p.product_line as DbProduct["product_line"]) ?? "konstructz",
    product_type: (p.product_type as DbProduct["product_type"]) ?? "equipment",
    short_description: p.short_description ?? null,
    full_description: p.full_description ?? "",
    featured_image: p.featured_image ?? null,
    gallery_images: Array.isArray(p.gallery_images) ? p.gallery_images : [],
    price: p.price ?? null,
    sale_price: p.sale_price ?? null,
    sku: p.sku ?? null,
    gtin: null,
    stock_status: p.stock_status ?? null,
    condition: p.condition ?? null,
    engine: specs.engine ?? null,
    horsepower: specs.horsepower ?? null,
    operating_weight: specs.operating_weight ?? null,
    lift_capacity: specs.lift_capacity ?? null,
    digging_depth: specs.digging_depth ?? null,
    width: specs.width ?? null,
    height: specs.height ?? null,
    length: specs.length ?? null,
    fuel_type: specs.fuel_type ?? null,
    machine_type: specs.machine_type ?? null,
    extra_specs: Array.isArray(p.extra_specs) ? p.extra_specs : [],
    compatible_attachments: Array.isArray(p.compatible_attachments)
      ? (p.compatible_attachments as DbProduct["compatible_attachments"])
      : [],
    warranty_info: p.warranty_info ?? null,
    shipping_info: p.shipping_info ?? null,
    financing_info: p.financing_info ?? null,
    button_text: p.button_text ?? null,
    button_url: p.button_url ?? null,
    seo_title: p.seo_title ?? null,
    seo_description: p.seo_description ?? null,
    seo_keywords: p.seo_keywords ?? null,
    status: (p.status as DbProduct["status"]) ?? "published",
    sort_order: 0,
    created_at: p.updated_at ?? new Date().toISOString(),
    updated_at: p.updated_at ?? new Date().toISOString(),
    published_at: p.updated_at ?? null,
    created_by: null,
    updated_by: null,
    category:
      p.category || p.category_slug
        ? { slug: p.category_slug ?? "", name: p.category ?? "" }
        : null,
  };
};

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
