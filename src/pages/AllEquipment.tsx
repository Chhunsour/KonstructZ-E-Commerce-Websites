import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  typhonProducts,
  type TyphonProduct,
} from "../data/typhonProducts";
import { TyphonProductCard } from "../components/ui/TyphonProductCard";
import { useI18n } from "../context/I18nContext";

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

          {/* Machines vs Attachments */}
          <div className="mt-8 inline-flex border border-white/15 bg-[#232323] p-1">
            {([
              ["equipment", "Machines", typeCounts.equipment, "/equipment"],
              ["attachment", "Attachments", typeCounts.attachment, "/equipment?type=attachments"],
            ] as const).map(([value, label, count, href]) => {
              const active = selectedKind === value;
              return (
                <Link
                  key={value}
                  to={href}
                  className={`px-5 py-2.5 font-googleSans text-sm font-bold uppercase tracking-wide transition ${
                    active ? "bg-[#d8c79a] text-[#153d28]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {label}
                  <span className={`ml-2 text-xs ${active ? "text-[#153d28]/70" : "text-white/40"}`}>
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Filters + Grid ── */}
      <section className="relative bg-theme-bg py-12 lg:py-20 transition-colors duration-200">
        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 lg:px-10">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              to={allHref}
              className={`border px-4 py-2 font-googleSans text-sm font-bold transition-colors ${
                !selectedCategory
                  ? "border-[#d8c79a] bg-[#d8c79a] text-[#153d28]"
                  : "border-theme-border/40 text-theme-muted hover:border-[#d8c79a] hover:text-theme-text"
              }`}
            >
              All ({base.length})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={categoryHref(cat.id)}
                className={`border px-4 py-2 font-googleSans text-sm font-bold transition-colors ${
                  selectedCategory === cat.id
                    ? "border-[#d8c79a] bg-[#d8c79a] text-[#153d28]"
                    : "border-theme-border/40 text-theme-muted hover:border-[#d8c79a] hover:text-theme-text"
                }`}
              >
                {cat.label} ({cat.count})
              </Link>
            ))}
          </div>

          {/* Search bar */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <form
              role="search"
              className="relative w-full sm:max-w-[420px]"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="typhon-search" className="sr-only">
                {t("action.searchEquipment")}
              </label>
              <input
                id="typhon-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search equipment..."
                className="w-full h-12 lg:h-14 border-2 border-theme-border/30 bg-theme-card text-theme-text font-googleSans text-base lg:text-lg px-5 pr-14 placeholder:text-theme-muted/60 focus:outline-none focus:border-theme-accent transition-colors"
              />
              <button
                type="submit"
                aria-label={t("action.searchEquipment")}
                className="absolute right-0 top-0 h-12 w-12 lg:h-14 lg:w-14 bg-theme-accent text-theme-bg flex items-center justify-center hover:bg-brand-green hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21L16.65 16.65" strokeLinecap="round" />
                </svg>
              </button>
            </form>
            <p className="font-clofie text-theme-muted text-sm lg:text-base transition-colors">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Product grid */}
          <div className="mt-10">
            {paginatedProducts.length === 0 ? (
              <div className="py-20 text-center bg-theme-sec border border-theme-border/10 rounded-xl px-4">
                <span className="text-4xl">🔍</span>
                <p className="font-clofieBold text-2xl text-theme-accent mt-4">
                  No equipment found
                </p>
                <p className="font-glonimove text-sm text-theme-muted/60 max-w-md mx-auto mt-2">
                  Try adjusting your search or selected category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,293px))] items-start justify-center gap-5 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="animate-fade-up self-start">
                    <TyphonProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-12 flex items-center justify-center gap-2 flex-wrap"
            >
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                  className="w-12 h-12 bg-theme-sec text-theme-text border border-theme-border/20 hover:bg-theme-accent/20 transition-colors text-xl rounded flex items-center justify-center cursor-pointer"
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
                    className={`w-12 h-12 border text-lg rounded flex items-center justify-center cursor-pointer transition-colors font-googleSans font-bold ${
                      isCurrent
                        ? "bg-theme-accent text-theme-bg border-theme-accent"
                        : "bg-theme-sec text-theme-text border-theme-border/20 hover:bg-theme-accent/20"
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
                  className="w-12 h-12 bg-theme-sec text-theme-text border border-theme-border/20 hover:bg-theme-accent/20 transition-colors text-xl rounded flex items-center justify-center cursor-pointer"
                >
                  ›
                </button>
              )}
            </nav>
          )}
        </div>
      </section>
    </div>
  );
};

export default AllEquipment;
