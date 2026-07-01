/**
 * ProductsProvider — bridges the new Supabase product system to the existing
 * public pages without rewriting them into async/loading screens.
 *
 * On mount it fetches **published** products (RLS guarantees published-only)
 * and merges them over the static `src/data` catalogs:
 *   • a static product whose DB row is draft/hidden is removed from the public
 *     list (admin "unpublish" actually hides it);
 *   • a static product whose DB row is published is merged (DB fields win, e.g.
 *     a richer description), keeping static-only extras like features/applications;
 *   • a brand-new admin product (no static twin) is added to the list.
 *
 * If Supabase is unconfigured/unreachable the static catalogs render unchanged,
 * so the public site never depends on the backend being up.
 *
 * Consumers keep using the existing `Product` / `TyphonProduct` shapes — they
 * just read them from `useProducts()` instead of importing the static arrays.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DbProduct, SpecRow } from "../lib/supabase";
import { listPublishedProducts } from "../lib/productStore";
import { products as staticKonstructz, Product } from "../data/products";
import { typhonProducts as staticTyphon, TyphonProduct } from "../data/typhonProducts";

interface ProductsContextValue {
  loading: boolean;
  /** Merged, published-only Konstructz equipment (existing `Product` shape). */
  konstructz: Product[];
  /** Merged, published-only Typhon catalog (existing `TyphonProduct` shape). */
  typhon: TyphonProduct[];
  /** Raw published DB row by `${line}:${slug}` — for rich-description rendering. */
  dbBySlug: Map<string, DbProduct>;
  getDbProduct: (line: "konstructz" | "typhon", slug: string) => DbProduct | undefined;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

/** Build a {label,value}[] from a DB row's typed spec columns + extra_specs. */
const specsFromDb = (p: DbProduct): SpecRow[] => {
  const typed: [string, string | null][] = [
    ["Engine", p.engine],
    ["Horsepower", p.horsepower],
    ["Operating Weight", p.operating_weight],
    ["Lift Capacity", p.lift_capacity],
    ["Digging Depth", p.digging_depth],
    ["Width", p.width],
    ["Height", p.height],
    ["Length", p.length],
    ["Fuel Type", p.fuel_type],
    ["Machine Type", p.machine_type],
  ];
  const out = typed
    .filter(([, v]) => v)
    .map(([label, value]) => ({ label, value: value as string }));
  return out.concat(Array.isArray(p.extra_specs) ? p.extra_specs : []);
};

const dbToTyphon = (p: DbProduct): TyphonProduct => ({
  id: p.slug,
  name: p.name,
  productType: p.product_type,
  rawProductType: p.product_type,
  category: p.category?.slug ?? "equipment",
  categoryLabel: p.category?.name ?? "",
  rawCategory: "",
  sku: p.sku ?? "",
  gtin: p.gtin ?? "",
  price: p.price ?? "",
  originalPrice: p.price ?? undefined,
  currentPrice: p.sale_price ?? p.price ?? undefined,
  sourceUrl: "",
  buttonUrl: p.button_url ?? "",
  importConfidence: "",
  series: "",
  weight: p.operating_weight ?? "",
  tagline: p.short_description ?? "",
  description: p.full_description ?? "",
  image: p.featured_image ?? "",
  thumbnailImage: p.thumbnail_image ?? p.featured_image ?? "",
  gallery: Array.isArray(p.gallery_images) ? p.gallery_images : [],
  imageImportWarnings: Array.isArray(p.image_import_warnings) ? p.image_import_warnings : [],
  specs: specsFromDb(p),
  features: [],
  applications: [],
  imageMatch: "",
});

const dbToKonstructz = (p: DbProduct): Product => ({
  id: p.slug,
  name: p.name,
  category: p.category?.slug ?? "equipment",
  categoryLabel: p.category?.name ?? "",
  weight: p.operating_weight ?? "",
  tagline: p.short_description ?? "",
  description: p.full_description ?? "",
  image: p.featured_image ?? "",
  gallery: Array.isArray(p.gallery_images) ? p.gallery_images : [],
  specs: specsFromDb(p),
  features: [],
});

/** Merge a published DB row over its static twin — DB content wins, static extras kept. */
const mergeTyphon = (s: TyphonProduct, p: DbProduct): TyphonProduct => ({
  ...s,
  name: p.name || s.name,
  description: p.full_description || s.description,
  tagline: p.short_description || s.tagline,
  image: p.featured_image || p.thumbnail_image || s.image || s.originalImageSource || "",
  thumbnailImage:
    p.thumbnail_image || p.featured_image || s.thumbnailImage || s.image || s.originalImageSource || "",
  gallery:
    p.gallery_images?.length
      ? p.gallery_images
      : s.gallery.length
        ? s.gallery
        : s.originalGallerySources?.length
          ? s.originalGallerySources
          : [],
  imageImportWarnings: p.image_import_warnings?.length ? p.image_import_warnings : s.imageImportWarnings,
  // The Typhon card + single page display currentPrice/originalPrice, so the
  // synced price MUST flow into those too — otherwise a synced price update
  // silently keeps the old static price on the page.
  price: p.price || s.price,
  originalPrice: p.price || s.originalPrice,
  currentPrice: p.sale_price || p.price || s.currentPrice,
  buttonUrl: p.button_url || s.buttonUrl,
  specs: specsFromDb(p).length ? specsFromDb(p) : s.specs,
});

const mergeKonstructz = (s: Product, p: DbProduct): Product => ({
  ...s,
  name: p.name || s.name,
  description: p.full_description || s.description,
  tagline: p.short_description || s.tagline,
  image: p.featured_image || s.image,
  gallery: p.gallery_images?.length ? p.gallery_images : s.gallery,
  specs: specsFromDb(p).length ? specsFromDb(p) : s.specs,
});

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dbRows, setDbRows] = useState<DbProduct[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listPublishedProducts()
      .then((rows) => {
        if (active) setDbRows(rows);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<ProductsContextValue>(() => {
    // Index DB rows. `null` = not yet loaded → pure static.
    //
    // The synced catalog (from the KiuQ Image Dashboard) doesn't share slugs
    // with the static catalog, but it DOES share the SKU — the static data was
    // generated from the same source. So we match a static product to its DB
    // twin by normalized SKU (falling back to line+slug), then overlay DB
    // fields (name, price, description, images) onto it.
    const normSku = (s?: string | null): string =>
      (s ?? "").replace(/^\s*sku\s*[:#-]?\s*/i, "").trim().toUpperCase();

    const dbBySlug = new Map<string, DbProduct>();
    const dbBySku = new Map<string, DbProduct>();
    if (dbRows) {
      for (const r of dbRows) {
        dbBySlug.set(`${r.product_line}:${r.slug}`, r);
        const k = normSku(r.sku);
        if (k && !dbBySku.has(k)) dbBySku.set(k, r);
      }
    }
    // DB rows already claimed by a static twin (by row id) — so a row matched
    // into the Typhon catalog isn't also dumped into the Konstructz catalog.
    const usedDbIds = new Set<string>();

    const twinFor = (line: "konstructz" | "typhon", id: string, sku?: string): DbProduct | undefined => {
      const bySlug = dbBySlug.get(`${line}:${id}`);
      if (bySlug) return bySlug;
      const k = normSku(sku);
      return k ? dbBySku.get(k) : undefined;
    };

    const buildTyphon = (): TyphonProduct[] => {
      if (!dbRows) return staticTyphon;
      const merged: TyphonProduct[] = [];
      for (const s of staticTyphon) {
        const hit = twinFor("typhon", s.id, s.sku);
        if (hit) {
          usedDbIds.add(hit.id);
          dbBySlug.set(`typhon:${s.id}`, hit); // so detail pages resolve by slug too
          merged.push(mergeTyphon(s, hit));
        } else {
          merged.push(s); // no DB twin → keep static
        }
      }
      // Brand-new synced products with no static twin (TYPHON-branded).
      for (const r of dbRows) {
        if (usedDbIds.has(r.id)) continue;
        if (r.product_line === "typhon" || /typhon/i.test(r.name)) {
          usedDbIds.add(r.id);
          merged.push(dbToTyphon(r));
        }
      }
      return merged;
    };

    const buildKonstructz = (): Product[] => {
      if (!dbRows) return staticKonstructz;
      const merged: Product[] = [];
      for (const s of staticKonstructz) {
        const hit = twinFor("konstructz", s.id, s.sku);
        if (hit) {
          usedDbIds.add(hit.id);
          dbBySlug.set(`konstructz:${s.id}`, hit);
          merged.push(mergeKonstructz(s, hit));
        } else {
          merged.push(s);
        }
      }
      for (const r of dbRows) {
        if (usedDbIds.has(r.id)) continue;
        usedDbIds.add(r.id);
        merged.push(dbToKonstructz(r));
      }
      return merged;
    };

    // Typhon first so it claims its SKU matches before Konstructz sweeps leftovers.
    const typhon = buildTyphon();
    const konstructz = buildKonstructz();

    return {
      loading,
      konstructz,
      typhon,
      dbBySlug,
      getDbProduct: (line, slug) => dbBySlug.get(`${line}:${slug}`),
    };
  }, [dbRows, loading]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = (): ProductsContextValue => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
};

/** Convenience hooks mirroring the old static imports. */
export const useTyphonProducts = (): TyphonProduct[] => useProducts().typhon;
export const useKonstructzProducts = (): Product[] => useProducts().konstructz;
