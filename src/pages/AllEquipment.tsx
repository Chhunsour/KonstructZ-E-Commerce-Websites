import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  typhonProducts,
  type TyphonProduct,
} from "../data/typhonProducts";
import { TyphonProductCard } from "../components/ui/TyphonProductCard";
import { useI18n } from "../context/I18nContext";

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
  const location = useLocation();
  const selectedCategory = new URLSearchParams(location.search).get("category");
  const selectedKind = parseKind(location.search);

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title =
      selectedKind === "attachment"
        ? "Attachments | Typhon Machinery"
        : "All Equipment | Typhon Machinery";
  }, [selectedKind]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedKind, selectedCategory, query]);

  // Everything of the selected kind — category tabs and the grid derive from
  // this so machines and attachments never mix.
  const base = useMemo(
    () => typhonProducts.filter((p) => p.productType === selectedKind),
    [selectedKind]
  );
  const categories = useMemo(() => categoriesFor(base), [base]);
  const typeCounts = useMemo(
    () => ({
      equipment: typhonProducts.filter((p) => p.productType === "equipment").length,
      attachment: typhonProducts.filter((p) => p.productType === "attachment").length,
    }),
    []
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
    categories.find((cat) => cat.id === selectedCategory)?.label ?? null;
  const productTypeLabel =
    selectedKind === "attachment" ? "Typhon Attachments" : "Typhon Machines";
  const activeListingLabel =
    selectedCategoryLabel ??
    (selectedKind === "attachment" ? "All Typhon Attachments" : "All Typhon Equipment");
  const hasActiveFilters = Boolean(selectedCategory || query.trim());

  return (
    <div className="bg-theme-bg min-h-screen text-theme-text transition-colors duration-200">
      {/* ── Hero ── */}
      <section className="relative bg-[#1a1a1a] overflow-hidden pt-28 lg:pt-36 pb-14 lg:pb-20">
        {/* Decorative glow */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-[60%] w-[70%] max-w-[700px] h-[200px] bg-[#d8c79a]/8 rounded-[50%] blur-[100px] pointer-events-none"
        />

        <div className="relative max-w-[1480px] mx-auto px-5 sm:px-8 lg:px-10">
          <p className="font-googleSans text-sm font-bold uppercase tracking-[0.25em] text-[#d8c79a]">
            Typhon Machinery
          </p>
          <h1 className="mt-4 font-clofieBold text-4xl sm:text-5xl lg:text-6xl font-bold leading-none text-white">
            {selectedKind === "attachment" ? "Attachments" : "All Equipment"}
          </h1>
          <p className="mt-5 max-w-2xl font-glonimove text-base sm:text-lg leading-relaxed text-white/65">
            {selectedKind === "attachment"
              ? "Typhon attachments, grouped by the machine they fit — skid steer, mini excavator, wheel loader and forklift attachments."
              : "Browse our full Typhon Machinery catalog. Heavy-duty mini excavators, skid steer loaders, forklifts, road rollers, scissor lifts, and wheel loaders — built for the job site."}
          </p>
        </div>
      </section>

      {/* ── Filters + Grid ── */}
      <section className="relative bg-theme-bg py-12 lg:py-20 transition-colors duration-200">
        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[292px_minmax(0,1fr)] lg:items-start lg:gap-10">
            <aside
              aria-label="Typhon product filters"
              className="border border-theme-border/15 bg-theme-sec p-4 shadow-[0_16px_40px_rgba(0,0,0,0.08)] lg:sticky lg:top-28 lg:p-5"
            >
              <div className="border-b border-theme-border/15 pb-4">
                <p className="font-googleSans text-[11px] font-bold uppercase tracking-[0.22em] text-theme-accent">
                  Product Filters
                </p>
                <h2 className="mt-2 font-clofieBold text-2xl leading-tight text-theme-text">
                  {productTypeLabel}
                </h2>
              </div>

              <form
                role="search"
                className="mt-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="typhon-search" className="sr-only">
                  {t("action.searchEquipment")}
                </label>
                <div className="relative">
                  <input
                    id="typhon-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products"
                    className="h-12 w-full border border-theme-border/25 bg-theme-card px-4 pr-12 font-googleSans text-sm text-theme-text placeholder:text-theme-muted/60 transition-colors focus:border-theme-accent focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label={t("action.searchEquipment")}
                    className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center bg-theme-accent text-theme-bg transition-colors hover:bg-brand-green hover:text-white"
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
                <p className="font-googleSans text-[11px] font-bold uppercase tracking-[0.16em] text-theme-muted">
                  Product Type
                </p>
                <div className="mt-3 space-y-2">
                  {([
                    ["equipment", "All Typhon Equipment", typeCounts.equipment, "/equipment"],
                    ["attachment", "Typhon Attachments", typeCounts.attachment, "/equipment?type=attachments"],
                  ] as const).map(([value, label, count, href]) => {
                    const active = selectedKind === value;
                    return (
                      <Link
                        key={value}
                        to={href}
                        className={`flex min-h-[56px] items-center gap-3 border px-3 py-2 transition-colors ${
                          active
                            ? "border-theme-accent bg-theme-accent text-theme-bg"
                            : "border-theme-border/15 bg-theme-card text-theme-text hover:border-theme-accent"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                            active ? "bg-theme-bg/10" : "bg-[#111]"
                          }`}
                        >
                          <img
                            src={`${EQUIPMENT_ICON_PATH}/all-equipment.svg`}
                            alt=""
                            aria-hidden="true"
                            className="h-5 w-5"
                          />
                        </span>
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <span className="font-googleSans text-sm font-bold leading-snug">
                            {label}
                          </span>
                          <span className="font-googleSans text-xs font-bold opacity-70">
                            {count}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7">
                <p className="font-googleSans text-[11px] font-bold uppercase tracking-[0.16em] text-theme-muted">
                  Categories
                </p>
                <div className="mt-3 space-y-2">
                  <Link
                    to={allHref}
                    className={`flex min-h-[58px] items-center gap-3 border px-3 py-2 transition-colors ${
                      !selectedCategory
                        ? "border-theme-accent bg-theme-accent text-theme-bg"
                        : "border-theme-border/15 bg-theme-card text-theme-text hover:border-theme-accent"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                        !selectedCategory ? "bg-theme-bg/10" : "bg-[#111]"
                      }`}
                    >
                      <img
                        src={`${EQUIPMENT_ICON_PATH}/all-equipment.svg`}
                        alt=""
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </span>
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <span className="font-googleSans text-sm font-bold leading-snug">
                        All {selectedKind === "attachment" ? "Attachments" : "Machines"}
                      </span>
                      <span className="font-googleSans text-xs font-bold opacity-70">
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
                        className={`flex min-h-[58px] items-center gap-3 border px-3 py-2 transition-colors ${
                          active
                            ? "border-theme-accent bg-theme-accent text-theme-bg"
                            : "border-theme-border/15 bg-theme-card text-theme-text hover:border-theme-accent"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                            active ? "bg-theme-bg/10" : "bg-[#111]"
                          }`}
                        >
                          <img
                            src={categoryIcon(cat.id)}
                            alt=""
                            aria-hidden="true"
                            className="h-5 w-5"
                          />
                        </span>
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <span className="font-googleSans text-sm font-bold leading-snug">
                            {cat.label}
                          </span>
                          <span className="font-googleSans text-xs font-bold opacity-70">
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
              <div className="flex flex-col gap-4 border-b border-theme-border/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-googleSans text-sm font-bold uppercase tracking-[0.12em] text-theme-accent">
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""} found
                  </p>
                  <h2 className="mt-2 font-clofieBold text-3xl leading-tight text-theme-text sm:text-4xl">
                    {activeListingLabel}
                  </h2>
                </div>
                {hasActiveFilters && (
                  <Link
                    to={allHref}
                    onClick={() => setQuery("")}
                    className="inline-flex h-11 items-center justify-center border border-theme-border/25 px-4 font-googleSans text-sm font-bold uppercase tracking-wide text-theme-text transition-colors hover:border-theme-accent hover:text-theme-accent"
                  >
                    Clear filters
                  </Link>
                )}
              </div>

              <div className="mt-8">
                {paginatedProducts.length === 0 ? (
                  <div className="border border-dashed border-theme-border/20 bg-theme-sec px-6 py-16 text-center">
                    <p className="font-clofieBold text-2xl text-theme-accent">
                      No equipment found
                    </p>
                    <p className="mx-auto mt-2 max-w-md font-glonimove text-sm text-theme-muted/70">
                      Try adjusting your search or selected category.
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
                  aria-label="Pagination"
                  className="mt-12 flex flex-wrap items-center justify-center gap-2"
                >
                  {currentPage > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                      className="flex h-12 w-12 cursor-pointer items-center justify-center border border-theme-border/20 bg-theme-sec text-xl text-theme-text transition-colors hover:bg-theme-accent/20"
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
                        className={`flex h-12 w-12 cursor-pointer items-center justify-center border font-googleSans text-lg font-bold transition-colors ${
                          isCurrent
                            ? "border-theme-accent bg-theme-accent text-theme-bg"
                            : "border-theme-border/20 bg-theme-sec text-theme-text hover:bg-theme-accent/20"
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
                      aria-label="Next page"
                      className="flex h-12 w-12 cursor-pointer items-center justify-center border border-theme-border/20 bg-theme-sec text-xl text-theme-text transition-colors hover:bg-theme-accent/20"
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
