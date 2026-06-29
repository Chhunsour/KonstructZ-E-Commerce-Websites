import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { type TyphonProduct } from "../data/typhonProducts";
import { TyphonProductCard } from "../components/ui/TyphonProductCard";
import { FilterGroup, PriceFilter } from "../components/ui/ProductFilter";
import { useI18n } from "../context/I18nContext";
import { useTyphonProducts } from "../context/ProductsContext";

const PAGE_SIZE = 12;

type ProductKind = "equipment" | "attachment";

const parseKind = (search: string): ProductKind => {
  const t = new URLSearchParams(search).get("type")?.toLowerCase();
  return t === "attachment" || t === "attachments" ? "attachment" : "equipment";
};

/** Category tabs (id/label/count) derived from a product subset. */
const categoriesFor = (items: TyphonProduct[]) => {
  const map = new Map<string, { id: string; label: string; count: number }>();
  for (const p of items) {
    const e = map.get(p.category) ?? {
      id: p.category,
      label: p.categoryLabel || p.category,
      count: 0,
    };
    e.count += 1;
    map.set(p.category, e);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
};

/**
 * Build one lowercase string holding every searchable field of a product so a
 * single query can match by name, category, model/series, SKU, marketing copy,
 * key features, applications, or any spec value (e.g. engine HP, weight).
 */
const searchHaystack = (p: TyphonProduct): string =>
  [
    p.name,
    p.categoryLabel,
    p.category,
    p.series,
    p.sku,
    p.tagline,
    p.description,
    p.weight,
    ...p.features,
    ...p.applications,
    ...p.specs.flatMap((s) => [s.label, s.value]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

/* ── Faceted-filter helpers (Konstructz product-filter parity) ──
   These read structured values out of a Typhon product so the Price,
   Operation Weight, Engine and Horsepower facets can filter the catalog. */

const WEIGHT_FILTERS = ["1.0 - 2.5 Tons", "2.6 - 4.5 Tons", "4.6+ Tons"];
const ENGINE_FILTERS = ["Diesel Powertrain", "Gasoline Powertrain", "Electric Drive"];
const HORSEPOWER_FILTERS = ["Under 25 HP", "25 - 50 HP", "Over 50 HP"];

/** Numeric price from the display string, e.g. "$6,508.95" → 6508.95. */
const parsePriceNumber = (p: TyphonProduct): number => {
  const raw = (p.currentPrice || p.price || "").replace(/[^0-9.]/g, "");
  const n = parseFloat(raw);
  return isNaN(n) ? 0 : n;
};

/** Operation weight normalised to metric tons (handles lb / kg / ton). */
const getWeightTons = (p: TyphonProduct): number => {
  const normalized = (p.weight || "").toLowerCase();
  const num = parseFloat(normalized.replace(/,/g, ""));
  if (isNaN(num)) return 0;
  if (normalized.includes("lb") || normalized.includes("pound")) return num / 2000;
  if (normalized.includes("kg")) return num / 1000;
  return num;
};

const getEngineType = (p: TyphonProduct): string => {
  const txt = [p.name, p.tagline, p.description, ...p.features, ...p.specs.map((s) => `${s.label} ${s.value}`)]
    .join(" ")
    .toLowerCase();
  if (txt.includes("electric") || txt.includes("battery")) return "Electric Drive";
  if (txt.includes("gasoline") || txt.includes("petrol") || txt.includes("honda gx") || /\bgas\b/.test(txt))
    return "Gasoline Powertrain";
  return "Diesel Powertrain";
};

const getHorsepower = (p: TyphonProduct): number => {
  const txt = [p.name, p.tagline, p.description, ...p.specs.map((s) => s.value)].join(" ");
  const m = txt.match(/(\d+(?:\.\d+)?)\s*HP/i);
  return m ? parseFloat(m[1]) : 0;
};

const matchesWeight = (p: TyphonProduct, bucket: string): boolean => {
  const w = getWeightTons(p);
  if (bucket === "1.0 - 2.5 Tons") return w <= 2.5;
  if (bucket === "2.6 - 4.5 Tons") return w > 2.5 && w <= 4.5;
  if (bucket === "4.6+ Tons") return w > 4.5;
  return true;
};

const matchesHorsepower = (p: TyphonProduct, bucket: string): boolean => {
  const hp = getHorsepower(p);
  if (bucket === "Under 25 HP") return hp < 25;
  if (bucket === "25 - 50 HP") return hp >= 25 && hp <= 50;
  if (bucket === "Over 50 HP") return hp > 50;
  return true;
};

/**
 * All Equipment — Typhon listing page.
 * Rendered at /equipment. Shows all Typhon products with category filters,
 * search, and pagination. Uses the same premium card design as Konstructz.
 */
export const AllEquipment: React.FC = () => {
  const { t } = useI18n();
  const typhonProducts = useTyphonProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const selectedKind = parseKind(`?${searchParams.toString()}`);

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Faceted-filter state (Konstructz product-filter parity).
  // Seed the price ceiling from the dearest product so the grid isn't filtered
  // to empty on the first render before the sync effect below runs.
  const [priceMax, setPriceMax] = useState(() => {
    const kind = parseKind(`?${searchParams.toString()}`);
    const prices = typhonProducts
      .filter((p) => p.productType === kind)
      .map(parsePriceNumber)
      .filter((n) => n > 0);
    return prices.length ? Math.ceil(Math.max(...prices) / 1000) * 1000 : 69999;
  });
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);
  const [selectedHorsepower, setSelectedHorsepower] = useState<string | null>(null);

  useEffect(() => {
    document.title =
      selectedKind === "attachment"
        ? `${t("nav.attachments", { fallback: "Attachments" })} | ${t("nav.typhonMachinery", { fallback: "Typhon" })}`
        : `${t("nav.typhonAllEquipment", { fallback: "All Equipment" })} | ${t("nav.typhonMachinery", { fallback: "Typhon" })}`;
  }, [selectedKind, t]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedKind, selectedCategory, query, priceMax, selectedWeight, selectedEngine, selectedHorsepower]);

  // Everything of the selected kind — category tabs and the grid derive from
  // this so machines and attachments never mix.
  const base = useMemo(
    () => typhonProducts.filter((p) => p.productType === selectedKind),
    [selectedKind, typhonProducts]
  );
  const categories = useMemo(() => categoriesFor(base), [base]);

  // Slider ceiling = the dearest product in the current kind (rounded up).
  const maxPrice = useMemo(() => {
    const prices = base.map(parsePriceNumber).filter((n) => n > 0);
    if (!prices.length) return 69999;
    return Math.ceil(Math.max(...prices) / 1000) * 1000;
  }, [base]);

  // When the kind (machines/attachments) changes, reset the facet filters and
  // snap the price slider back to the full range of the new product set.
  useEffect(() => {
    setPriceMax(maxPrice);
    setSelectedWeight(null);
    setSelectedEngine(null);
    setSelectedHorsepower(null);
  }, [maxPrice, selectedKind]);

  const selectCategory = (id: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (id) next.set("category", id);
    else next.delete("category");
    setSearchParams(next);
  };

  const resetAllFilters = () => {
    setQuery("");
    setPriceMax(maxPrice);
    setSelectedWeight(null);
    setSelectedEngine(null);
    setSelectedHorsepower(null);
    selectCategory(null);
  };

  // Category facet options for the Konstructz-style FilterGroup: translated
  // labels shown to the user, mapped back to the internal category id.
  const categoryLabels = categories.map((c) => t(`category.${c.id}`, { fallback: c.label }));
  const categoryValueMapping = Object.fromEntries(
    categories.map((c) => [t(`category.${c.id}`, { fallback: c.label }), c.id])
  );
  const typeCounts = useMemo(
    () => ({
      equipment: typhonProducts.filter((p) => p.productType === "equipment").length,
      attachment: typhonProducts.filter((p) => p.productType === "attachment").length,
    }),
    [typhonProducts]
  );

  // Precompute the searchable text once per kind so typing stays snappy.
  const haystacks = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of base) map.set(p.id, searchHaystack(p));
    return map;
  }, [base]);

  // Split the query into words; a product must match every word (in any field).
  const searchTokens = useMemo(
    () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [query]
  );

  const filteredProducts: TyphonProduct[] = useMemo(() => {
    return base
      .filter((p) => !selectedCategory || p.category === selectedCategory)
      .filter((p) => {
        if (searchTokens.length === 0) return true;
        const hay = haystacks.get(p.id) ?? "";
        return searchTokens.every((token) => hay.includes(token));
      })
      .filter((p) => parsePriceNumber(p) <= priceMax)
      .filter((p) => !selectedWeight || matchesWeight(p, selectedWeight))
      .filter((p) => !selectedEngine || getEngineType(p) === selectedEngine)
      .filter((p) => !selectedHorsepower || matchesHorsepower(p, selectedHorsepower));
  }, [base, selectedCategory, searchTokens, haystacks, priceMax, selectedWeight, selectedEngine, selectedHorsepower]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const selectedCategoryLabel =
    categories.find((cat) => cat.id === selectedCategory)
      ? t(`category.${selectedCategory}`, { fallback: categories.find((cat) => cat.id === selectedCategory)?.label })
      : null;
  const productTypeLabel =
    selectedKind === "attachment"
      ? t("nav.attachments", { fallback: "Typhon Attachments" })
      : t("nav.typhonAllEquipment", { fallback: "Typhon Machines" });
  const activeListingLabel =
    selectedCategoryLabel ??
    (selectedKind === "attachment"
      ? t("catalog.allAttachments", { fallback: "All Typhon Attachments" })
      : t("catalog.allEquipment", { fallback: "All Typhon Equipment" }));
  const hasActiveFilters = Boolean(
    selectedCategory ||
      query.trim() ||
      selectedWeight ||
      selectedEngine ||
      selectedHorsepower ||
      priceMax < maxPrice
  );

  return (
    <div className="bg-[#fafafc] dark:bg-[#282828] min-h-screen text-neutral-800 dark:text-white transition-colors duration-200">
      {/* ── Hero ── */}
      <section className="relative bg-[#f0f2f5] dark:bg-[#1a1a1a] overflow-hidden pt-28 lg:pt-36 pb-14 lg:pb-20">
        {/* Decorative glow */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-[60%] w-[70%] max-w-[700px] h-[200px] bg-[#153d28]/5 dark:bg-[#d8c79a]/8 rounded-[50%] blur-[100px] pointer-events-none"
        />

        <div className="relative max-w-[1480px] mx-auto px-5 sm:px-8 lg:px-10">
          <p className="font-googleSans text-sm font-bold uppercase tracking-[0.25em] text-[#153d28] dark:text-[#d8c79a]">
            {t("nav.typhonMachinery", { fallback: "Typhon" })}
          </p>
          <h1 className="mt-4 font-clofieBold text-4xl sm:text-5xl lg:text-6xl font-bold leading-none text-neutral-900 dark:text-white">
            {selectedKind === "attachment" ? t("nav.attachments", { fallback: "Attachments" }) : t("nav.typhonAllEquipment", { fallback: "All Equipment" })}
          </h1>
          <p className="mt-5 max-w-2xl font-glonimove text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-white/65">
            {selectedKind === "attachment"
              ? t("catalog.desc.attachments", { fallback: "Typhon attachments, grouped by the machine they fit — skid steer, mini excavator, wheel loader and forklift attachments." })
              : t("catalog.desc.machines", { fallback: "Browse our full Typhon catalog. Heavy-duty mini excavators, skid steer loaders, forklifts, road rollers, scissor lifts, and wheel loaders built for the job site." })}
          </p>
        </div>
      </section>

      {/* ── Filters + Grid ── */}
      <section className="relative bg-[#fafafc] dark:bg-[#282828] py-12 lg:py-20 transition-colors duration-200">
        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[292px_minmax(0,1fr)] lg:items-start lg:gap-10">
            <aside
              aria-label={t("equipment.filters", { fallback: "Typhon product filters" })}
              className="flex flex-col gap-4 lg:sticky lg:top-28"
            >
              {/* Title + search */}
              <div className="bg-theme-sec text-theme-text p-4 border border-theme-border/10 rounded transition-colors">
                <p className="font-googleSans text-[11px] font-bold uppercase tracking-[0.22em] text-theme-accent">
                  {t("catalog.productFilters", { fallback: "Product Filters" })}
                </p>
                <h2 className="mt-1 font-clofieBold text-2xl leading-tight text-theme-text">
                  {productTypeLabel}
                </h2>

                <form role="search" className="mt-4" onSubmit={(e) => e.preventDefault()}>
                  <label htmlFor="typhon-search" className="sr-only">
                    {t("action.searchEquipment", { fallback: "Search equipment" })}
                  </label>
                  <div className="relative">
                    <input
                      id="typhon-search"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t("equipment.searchPlaceholder", { fallback: "Search by name, model or spec…" })}
                      className={`h-12 w-full border-2 border-theme-border/30 bg-theme-card text-theme-text pl-4 ${query ? "pr-20" : "pr-12"} font-googleSans text-sm placeholder:text-theme-muted/70 transition-colors focus:border-theme-accent focus:outline-none rounded [&::-webkit-search-cancel-button]:appearance-none`}
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label={t("action.clearSearch", { fallback: "Clear search" })}
                        className="absolute right-12 top-0 flex h-12 w-8 items-center justify-center text-theme-muted transition-colors hover:text-theme-accent"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="submit"
                      aria-label={t("action.searchEquipment", { fallback: "Search equipment" })}
                      className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center bg-theme-accent text-theme-bg transition-colors hover:bg-brand-green hover:text-white rounded-r"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M21 21L16.65 16.65" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  {query.trim() && (
                    <p className="mt-2 font-googleSans text-xs text-theme-muted">
                      {t("catalog.searchResultCount", {
                        values: { count: filteredProducts.length },
                        fallback: `${filteredProducts.length} match${filteredProducts.length === 1 ? "" : "es"} for “${query.trim()}”`,
                      })}
                    </p>
                  )}
                </form>

                {/* Product Type */}
                <p className="mt-5 font-googleSans text-[11px] font-bold uppercase tracking-[0.16em] text-theme-muted">
                  {t("catalog.productType", { fallback: "Product Type" })}
                </p>
                <div className="mt-3 space-y-2">
                  {([
                    ["equipment", t("catalog.allEquipment", { fallback: "All Typhon Equipment" }), typeCounts.equipment, "/equipment"],
                    ["attachment", t("nav.attachments", { fallback: "Typhon Attachments" }), typeCounts.attachment, "/equipment?type=attachments"],
                  ] as const).map(([value, label, count, href]) => {
                    const active = selectedKind === value;
                    return (
                      <Link
                        key={value}
                        to={href}
                        className={`flex items-center justify-between gap-3 border px-3 py-2.5 transition-all rounded-md ${
                          active
                            ? "bg-theme-accent/10 border-theme-accent/30 text-theme-accent"
                            : "bg-theme-card/30 border-theme-border/20 text-theme-text hover:bg-brand-dark/40 hover:border-theme-accent/30"
                        }`}
                      >
                        <span className="font-glonimove text-sm font-bold leading-snug">{label}</span>
                        <span className={`font-googleSans text-xs font-bold ${active ? "text-theme-accent" : "text-theme-muted"}`}>
                          {count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Konstructz-style faceted filters */}
              <FilterGroup
                title={t("equipment.categories", { fallback: "Categories" })}
                options={categoryLabels}
                selectedOption={selectedCategory}
                onOptionSelect={selectCategory}
                optionValueMapping={categoryValueMapping}
              />
              <PriceFilter value={priceMax} max={maxPrice} onChange={setPriceMax} />
              <FilterGroup
                title={t("equipment.operationWeight", { fallback: "Operation Weight" })}
                options={WEIGHT_FILTERS}
                selectedOption={selectedWeight}
                onOptionSelect={setSelectedWeight}
              />
              <FilterGroup
                title={t("equipment.engine", { fallback: "Engine" })}
                options={ENGINE_FILTERS}
                selectedOption={selectedEngine}
                onOptionSelect={setSelectedEngine}
              />
              <FilterGroup
                title={t("equipment.horsepower", { fallback: "Horsepower" })}
                options={HORSEPOWER_FILTERS}
                selectedOption={selectedHorsepower}
                onOptionSelect={setSelectedHorsepower}
              />

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex h-11 items-center justify-center border border-theme-border/30 px-4 font-googleSans text-sm font-bold uppercase tracking-wide text-theme-text bg-theme-card/30 transition-colors hover:border-theme-accent hover:text-theme-accent rounded"
                >
                  {t("catalog.clearAllFilters", { fallback: "Clear filters" })}
                </button>
              )}
            </aside>

            <div className="min-w-0">
              <div className="flex flex-col gap-4 border-b border-neutral-200 dark:border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-googleSans text-sm font-bold uppercase tracking-[0.12em] text-[#153d28] dark:text-[#d8c79a]">
                    {t("catalog.productsFoundCount", { values: { count: filteredProducts.length }, fallback: `${filteredProducts.length} product(s) found` })}
                  </p>
                  <h2 className="mt-2 font-clofieBold text-3xl leading-tight text-neutral-900 dark:text-white sm:text-4xl">
                    {activeListingLabel}
                  </h2>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex h-11 items-center justify-center border border-neutral-300 dark:border-white/15 px-4 font-googleSans text-sm font-bold uppercase tracking-wide text-neutral-600 dark:text-white/80 bg-white dark:bg-[#232323] shadow-sm transition-colors hover:border-[#153d28] dark:hover:border-[#d8c79a] hover:text-[#153d28] dark:hover:text-[#d8c79a] rounded-sm"
                  >
                    {t("catalog.clearAllFilters", { fallback: "Clear filters" })}
                  </button>
                )}
              </div>

              <div className="mt-8">
                {paginatedProducts.length === 0 ? (
                  <div className="border border-dashed border-neutral-300 dark:border-white/10 bg-white dark:bg-[#232323] px-6 py-16 text-center shadow-sm rounded-sm">
                    <p className="font-clofieBold text-2xl text-[#153d28] dark:text-[#d8c79a]">
                      {t("catalog.noMachinesFound", { fallback: "No equipment found" })}
                    </p>
                    <p className="mx-auto mt-2 max-w-md font-glonimove text-sm text-neutral-500 dark:text-white/60">
                      {t("catalog.noResultsSub", { fallback: "Try adjusting your search or selected category." })}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,293px))] items-start justify-center gap-5 sm:gap-6 xl:justify-start">
                    {paginatedProducts.map((product) => (
                      <div key={product.id} className="animate-fade-up self-start">
                        <TyphonProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label={t("allProducts.pagination", { fallback: "Pagination" })}
                  className="mt-12 flex flex-wrap items-center justify-center gap-2"
                >
                  {currentPage > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      aria-label={t("product.prevPage", { fallback: "Previous page" })}
                      className="flex h-12 w-12 cursor-pointer items-center justify-center border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#232323] text-xl text-neutral-600 dark:text-white/80 transition-colors hover:border-[#153d28] dark:hover:border-[#d8c79a] hover:text-[#153d28] dark:hover:text-[#d8c79a] rounded-sm shadow-sm"
                    >
                      ‹
                    </button>
                  )}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    const isCurrent = n === currentPage;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCurrentPage(n)}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`flex h-12 w-12 cursor-pointer items-center justify-center border font-googleSans text-lg font-bold transition-colors rounded-sm shadow-sm ${
                          isCurrent
                            ? "border-[#153d28] dark:border-[#d8c79a] bg-[#153d28] dark:bg-[#d8c79a] text-white dark:text-[#153d28]"
                            : "border-neutral-300 dark:border-white/15 bg-white dark:bg-[#232323] text-neutral-600 dark:text-white/80 hover:border-[#153d28] dark:hover:border-[#d8c79a] hover:text-[#153d28] dark:hover:text-[#d8c79a]"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                  {currentPage < totalPages && (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      aria-label={t("product.nextPage", { fallback: "Next page" })}
                      className="flex h-12 w-12 cursor-pointer items-center justify-center border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#232323] text-xl text-neutral-600 dark:text-white/80 transition-colors hover:border-[#153d28] dark:hover:border-[#d8c79a] hover:text-[#153d28] dark:hover:text-[#d8c79a] rounded-sm shadow-sm"
                    >
                      ›
                    </button>
                  )}
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllEquipment;
