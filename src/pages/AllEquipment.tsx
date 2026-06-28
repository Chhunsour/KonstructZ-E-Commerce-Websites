import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { type TyphonProduct } from "../data/typhonProducts";
import { TyphonProductCard } from "../components/ui/TyphonProductCard";
import { useI18n } from "../context/I18nContext";
import { useTyphonProducts } from "../context/ProductsContext";

const PAGE_SIZE = 12;
const EQUIPMENT_ICON_PATH = "/icons/equipment";

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

const categoryIcon = (id: string) => {
  const icons: Record<string, string> = {
    forklifts: "forklift.svg",
    "mini-excavators": "mini-excavator.svg",
    "road-rollers": "road-roller.svg",
    "scissor-lifts": "scissor-lift.svg",
    "skid-steer-loaders": "skid-steer.svg",
    "wheel-loaders": "wheel-loader.svg",
  };
  return `${EQUIPMENT_ICON_PATH}/${icons[id] ?? "all-equipment.svg"}`;
};

/**
 * All Equipment — Typhon Machinery listing page.
 * Rendered at /equipment. Shows all Typhon products with category filters,
 * search, and pagination. Uses the same premium card design as Konstructz.
 */
export const AllEquipment: React.FC = () => {
  const { t } = useI18n();
  const typhonProducts = useTyphonProducts();
  const location = useLocation();
  const selectedCategory = new URLSearchParams(location.search).get("category");
  const selectedKind = parseKind(location.search);

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title =
      selectedKind === "attachment"
        ? `${t("nav.attachments", { fallback: "Attachments" })} | ${t("nav.typhonMachinery", { fallback: "Typhon Machinery" })}`
        : `${t("nav.typhonAllEquipment", { fallback: "All Equipment" })} | ${t("nav.typhonMachinery", { fallback: "Typhon Machinery" })}`;
  }, [selectedKind, t]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedKind, selectedCategory, query]);

  // Everything of the selected kind — category tabs and the grid derive from
  // this so machines and attachments never mix.
  const base = useMemo(
    () => typhonProducts.filter((p) => p.productType === selectedKind),
    [selectedKind, typhonProducts]
  );
  const categories = useMemo(() => categoriesFor(base), [base]);
  const typeCounts = useMemo(
    () => ({
      equipment: typhonProducts.filter((p) => p.productType === "equipment").length,
      attachment: typhonProducts.filter((p) => p.productType === "attachment").length,
    }),
    [typhonProducts]
  );

  // Build hrefs that preserve the active kind.
  const kindQuery = selectedKind === "attachment" ? "type=attachments" : "";
  const allHref = kindQuery ? `/equipment?${kindQuery}` : "/equipment";
  const categoryHref = (id: string) =>
    `/equipment?${[kindQuery, `category=${id}`].filter(Boolean).join("&")}`;

  const filteredProducts: TyphonProduct[] = useMemo(() => {
    return base
      .filter((p) => !selectedCategory || p.category === selectedCategory)
      .filter(
        (p) => !query || p.name.toLowerCase().includes(query.toLowerCase())
      );
  }, [base, selectedCategory, query]);

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
  const hasActiveFilters = Boolean(selectedCategory || query.trim());

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
            {t("nav.typhonMachinery", { fallback: "Typhon Machinery" })}
          </p>
          <h1 className="mt-4 font-clofieBold text-4xl sm:text-5xl lg:text-6xl font-bold leading-none text-neutral-900 dark:text-white">
            {selectedKind === "attachment" ? t("nav.attachments", { fallback: "Attachments" }) : t("nav.typhonAllEquipment", { fallback: "All Equipment" })}
          </h1>
          <p className="mt-5 max-w-2xl font-glonimove text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-white/65">
            {selectedKind === "attachment"
              ? t("catalog.desc.attachments", { fallback: "Typhon attachments, grouped by the machine they fit — skid steer, mini excavator, wheel loader and forklift attachments." })
              : t("catalog.desc.machines", { fallback: "Browse our full Typhon Machinery catalog. Heavy-duty mini excavators, skid steer loaders, forklifts, road rollers, scissor lifts, and wheel loaders — built for the job site." })}
          </p>
        </div>
      </section>

      {/* ── Filters + Grid ── */}
      <section className="relative bg-[#fafafc] dark:bg-[#282828] py-12 lg:py-20 transition-colors duration-200">
        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[292px_minmax(0,1fr)] lg:items-start lg:gap-10">
            <aside
              aria-label={t("equipment.filters", { fallback: "Typhon product filters" })}
              className="border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#232323] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded lg:sticky lg:top-28 lg:p-5 transition-colors"
            >
              <div className="border-b border-neutral-200 dark:border-white/10 pb-4">
                <p className="font-googleSans text-[11px] font-bold uppercase tracking-[0.22em] text-[#153d28] dark:text-[#d8c79a]">
                  {t("catalog.productFilters", { fallback: "Product Filters" })}
                </p>
                <h2 className="mt-2 font-clofieBold text-2xl leading-tight text-neutral-900 dark:text-white">
                  {productTypeLabel}
                </h2>
              </div>

              <form
                role="search"
                className="mt-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="typhon-search" className="sr-only">
                  {t("action.searchEquipment", { fallback: "Search equipment" })}
                </label>
                <div className="relative">
                  <input
                    id="typhon-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("equipment.searchPlaceholderShort", { fallback: "Search..." })}
                    className="h-12 w-full border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#1a1a1a] px-4 pr-12 font-googleSans text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/40 transition-colors focus:border-[#153d28] dark:focus:border-[#d8c79a] focus:outline-none rounded-sm"
                  />
                  <button
                    type="submit"
                    aria-label={t("action.searchEquipment", { fallback: "Search equipment" })}
                    className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center bg-[#153d28] dark:bg-[#d8c79a] text-white dark:text-[#153d28] transition-colors hover:bg-neutral-800 dark:hover:bg-white rounded-r-sm"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21L16.65 16.65" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <p className="font-googleSans text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-455 dark:text-white/40">
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
                        className={`flex min-h-[56px] items-center gap-3 border px-3 py-2 transition-colors rounded-sm ${
                          active
                            ? "border-[#153d28] dark:border-[#d8c79a] bg-[#153d28] dark:bg-[#d8c79a] text-white dark:text-[#153d28]"
                            : "border-neutral-200 dark:border-white/10 bg-white dark:bg-[#232323] text-neutral-700 dark:text-white/80 hover:border-[#153d28] dark:hover:border-[#d8c79a]"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm transition-colors ${
                            active ? "bg-white/10 dark:bg-black/10" : "bg-neutral-100 dark:bg-[#111]"
                          }`}
                        >
                          <img
                            src={`${EQUIPMENT_ICON_PATH}/all-equipment.svg`}
                            alt=""
                            aria-hidden="true"
                            className={`h-5 w-5 ${active ? "brightness-0 invert dark:brightness-[0.2] dark:invert-0" : ""}`}
                          />
                        </span>
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <span className="font-googleSans text-sm font-bold leading-snug">
                            {label}
                          </span>
                          <span className={`font-googleSans text-xs font-bold ${active ? "text-white/80 dark:text-[#153d28]/70" : "text-neutral-400 dark:text-white/40"}`}>
                            {count}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7">
                <p className="font-googleSans text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-455 dark:text-white/40">
                  {t("equipment.categories", { fallback: "Categories" })}
                </p>
                <div className="mt-3 space-y-2">
                  <Link
                    to={allHref}
                    className={`flex min-h-[58px] items-center gap-3 border px-3 py-2 transition-colors rounded-sm ${
                      !selectedCategory
                        ? "border-[#153d28] dark:border-[#d8c79a] bg-[#153d28] dark:bg-[#d8c79a] text-white dark:text-[#153d28]"
                        : "border-neutral-200 dark:border-white/10 bg-white dark:bg-[#232323] text-neutral-700 dark:text-white/80 hover:border-[#153d28] dark:hover:border-[#d8c79a]"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm transition-colors ${
                        !selectedCategory ? "bg-white/10 dark:bg-black/10" : "bg-neutral-100 dark:bg-[#111]"
                      }`}
                    >
                      <img
                        src={`${EQUIPMENT_ICON_PATH}/all-equipment.svg`}
                        alt=""
                        aria-hidden="true"
                        className={`h-5 w-5 ${!selectedCategory ? "brightness-0 invert dark:brightness-[0.2] dark:invert-0" : ""}`}
                      />
                    </span>
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <span className="font-googleSans text-sm font-bold leading-snug">
                        {t("catalog.allType", { values: { type: selectedKind === "attachment" ? t("nav.attachments", { fallback: "Attachments" }) : t("catalog.type.machines", { fallback: "Machines" }) }, fallback: `All ${selectedKind === "attachment" ? "Attachments" : "Machines"}` })}
                      </span>
                      <span className={`font-googleSans text-xs font-bold ${!selectedCategory ? "text-white/80 dark:text-[#153d28]/70" : "text-neutral-400 dark:text-white/40"}`}>
                        {base.length}
                      </span>
                    </span>
                  </Link>

                  {categories.map((cat) => {
                    const active = selectedCategory === cat.id;
                    return (
                      <Link
                        key={cat.id}
                        to={categoryHref(cat.id)}
                        className={`flex min-h-[58px] items-center gap-3 border px-3 py-2 transition-colors rounded-sm ${
                          active
                            ? "border-[#153d28] dark:border-[#d8c79a] bg-[#153d28] dark:bg-[#d8c79a] text-white dark:text-[#153d28]"
                            : "border-neutral-200 dark:border-white/10 bg-white dark:bg-[#232323] text-neutral-700 dark:text-white/80 hover:border-[#153d28] dark:hover:border-[#d8c79a]"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm transition-colors ${
                            active ? "bg-white/10 dark:bg-black/10" : "bg-neutral-100 dark:bg-[#111]"
                          }`}
                        >
                          <img
                            src={categoryIcon(cat.id)}
                            alt=""
                            aria-hidden="true"
                            className={`h-5 w-5 ${active ? "brightness-0 invert dark:brightness-[0.2] dark:invert-0" : ""}`}
                          />
                        </span>
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <span className="font-googleSans text-sm font-bold leading-snug">
                            {t(`category.${cat.id}`, { fallback: cat.label })}
                          </span>
                          <span className={`font-googleSans text-xs font-bold ${active ? "text-white/80 dark:text-[#153d28]/70" : "text-neutral-400 dark:text-white/40"}`}>
                            {cat.count}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
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
                  <Link
                    to={allHref}
                    onClick={() => setQuery("")}
                    className="inline-flex h-11 items-center justify-center border border-neutral-300 dark:border-white/15 px-4 font-googleSans text-sm font-bold uppercase tracking-wide text-neutral-600 dark:text-white/80 bg-white dark:bg-[#232323] shadow-sm transition-colors hover:border-[#153d28] dark:hover:border-[#d8c79a] hover:text-[#153d28] dark:hover:text-[#d8c79a] rounded-sm"
                  >
                    {t("catalog.clearAllFilters", { fallback: "Clear filters" })}
                  </Link>
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
