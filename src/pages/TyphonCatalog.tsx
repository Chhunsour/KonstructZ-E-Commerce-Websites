import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  TyphonProduct,
  typhonProducts,
} from "../data/typhonProducts";
import { TyphonProductCard } from "../components/ui/TyphonProductCard";

/* ─── Value extractors (derive filter facets from the real CSV data) ──────── */

const getWeightTons = (p: TyphonProduct): number => {
  const raw = (
    p.weight ||
    p.specs.find((s) => /weight/i.test(s.label))?.value ||
    ""
  ).toLowerCase();
  const num = parseFloat(raw.replace(/,/g, ""));
  if (Number.isNaN(num)) return 0;
  if (raw.includes("lb") || raw.includes("pound")) return num / 2000;
  return num;
};

const getHorsepower = (p: TyphonProduct): number => {
  const power = p.specs.find((s) => /engine power|power/i.test(s.label))?.value;
  const fromPower = power?.match(/(\d+(?:\.\d+)?)\s*HP/i);
  if (fromPower) return parseFloat(fromPower[1]);
  for (const s of p.specs) {
    const m = s.value.match(/(\d+(?:\.\d+)?)\s*HP/i);
    if (m) return parseFloat(m[1]);
  }
  const fromText = `${p.rawCategory || ""} ${p.description || ""} ${p.tagline || ""}`.match(
    /(\d+(?:\.\d+)?)\s*HP/i
  );
  return fromText ? parseFloat(fromText[1]) : 0;
};

type Powertrain = "Diesel" | "Gasoline" | "Electric";

type ProductKind = "equipment" | "attachment";

/** Category facets with live counts, derived from a product subset. */
const buildCategoryOptions = (items: TyphonProduct[]): FacetOption[] => {
  const map = new Map<string, { label: string; count: number }>();
  for (const p of items) {
    const entry = map.get(p.category) ?? { label: p.categoryLabel || p.category, count: 0 };
    entry.count += 1;
    map.set(p.category, entry);
  }
  return [...map.entries()]
    .map(([value, { label, count }]) => ({ value, label, count }))
    .sort((a, b) => b.count - a.count);
};

// Classify by scanning every field that may name the engine (spec values, the
// description, tagline, raw category, series, name) — not just one spec, since
// the brand often lives in the description rather than a dedicated field.
const getPowertrain = (p: TyphonProduct): Powertrain | null => {
  const hay = [
    ...p.specs.map((s) => s.value),
    p.description,
    p.tagline,
    p.rawCategory,
    p.series,
    p.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (/electric|battery/.test(hay)) return "Electric";
  if (/diesel|kubota|yanmar|perkins|cummins|kohler kdw/.test(hay)) return "Diesel";
  if (/petrol|gasoline|\bgas\b|b&s|b & s|briggs|\bhonda\b|vanguard|lifan|loncin|kohler/.test(hay))
    return "Gasoline";
  return null;
};

/* ─── Facet buckets ───────────────────────────────────────────────────────── */

const WEIGHT_BUCKETS: { label: string; test: (w: number) => boolean }[] = [
  { label: "Under 1.5 Tons", test: (w) => w > 0 && w < 1.5 },
  { label: "1.5 – 3 Tons", test: (w) => w >= 1.5 && w <= 3 },
  { label: "Over 3 Tons", test: (w) => w > 3 },
];

const HP_BUCKETS: { label: string; test: (hp: number) => boolean }[] = [
  { label: "Under 25 HP", test: (hp) => hp > 0 && hp < 25 },
  { label: "25 – 50 HP", test: (hp) => hp >= 25 && hp <= 50 },
  { label: "Over 50 HP", test: (hp) => hp > 50 },
];

const POWERTRAINS: Powertrain[] = ["Diesel", "Gasoline", "Electric"];

interface FacetOption {
  value: string;
  label: string;
  count: number;
}

/* ─── Typhon-styled collapsible filter group (single-select) ─────────────── */

const FilterGroup: React.FC<{
  title: string;
  options: FacetOption[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}> = ({ title, options, selected, onSelect }) => {
  const [open, setOpen] = useState(true);
  if (options.length === 0) return null;

  return (
    <div className="border border-white/10 bg-[#232323]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 font-googleSans text-sm font-bold uppercase tracking-wide text-white"
      >
        <span>{title}</span>
        <svg width="12" height="8" viewBox="0 0 10 7" fill="none" className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
          <path d="M1 1L5 5L9 1" stroke="#d8c79a" strokeWidth="1.6" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all ${open ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"}`}>
        <ul className="flex flex-col gap-1 px-3 pb-3">
          {options.map((opt) => {
            const isChecked = selected === opt.value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => onSelect(isChecked ? null : opt.value)}
                  className={`flex w-full items-center gap-2.5 px-2.5 py-2 text-left font-glonimove text-sm transition ${
                    isChecked
                      ? "bg-[#d8c79a]/12 text-[#d8c79a]"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                      isChecked ? "border-[#d8c79a] bg-[#d8c79a] text-[#153d28]" : "border-white/30 text-transparent"
                    }`}
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="flex-1">{opt.label}</span>
                  <span className={`font-googleSans text-xs ${isChecked ? "text-[#d8c79a]" : "text-white/40"}`}>
                    {opt.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

/* ─── Catalog page ────────────────────────────────────────────────────────── */

const PAGE_SIZE = 12;

export const TyphonCatalog: React.FC = () => {
  const location = useLocation();

  const parseType = (search: string): ProductKind => {
    const t = new URLSearchParams(search).get("type")?.toLowerCase();
    return t === "attachment" || t === "attachments" ? "attachment" : "equipment";
  };

  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ProductKind>(() =>
    parseType(location.search)
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => new URLSearchParams(location.search).get("category")
  );
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [selectedPowertrain, setSelectedPowertrain] = useState<string | null>(null);
  const [selectedHp, setSelectedHp] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Keep type + category in sync when arriving via a navbar link
  // (?type=attachments&category=…).
  useEffect(() => {
    setSelectedType(parseType(location.search));
    setSelectedCategory(new URLSearchParams(location.search).get("category"));
  }, [location.search]);

  // Products of the currently selected kind (machine vs attachment). All facet
  // counts and the grid derive from this so the two worlds never mix.
  const base = useMemo(
    () => typhonProducts.filter((p) => p.productType === selectedType),
    [selectedType]
  );

  const typeCounts = useMemo(
    () => ({
      equipment: typhonProducts.filter((p) => p.productType === "equipment").length,
      attachment: typhonProducts.filter((p) => p.productType === "attachment").length,
    }),
    []
  );

  const switchType = (next: ProductKind) => {
    if (next === selectedType) return;
    setSelectedType(next);
    setSelectedCategory(null);
    setSelectedWeight(null);
    setSelectedPowertrain(null);
    setSelectedHp(null);
    setQuery("");
  };

  /* Facet options with live counts derived from the real catalog. Options that
     match zero products are dropped so a filter never has a dead choice. */
  const categoryOptions = useMemo<FacetOption[]>(
    () => buildCategoryOptions(base),
    [base]
  );
  const weightOptions = useMemo<FacetOption[]>(
    () =>
      WEIGHT_BUCKETS.map((b) => ({
        value: b.label,
        label: b.label,
        count: base.filter((p) => b.test(getWeightTons(p))).length,
      })).filter((o) => o.count > 0),
    [base]
  );
  const powertrainOptions = useMemo<FacetOption[]>(
    () =>
      POWERTRAINS.map((pt) => ({
        value: pt,
        label: pt,
        count: base.filter((p) => getPowertrain(p) === pt).length,
      })).filter((o) => o.count > 0),
    [base]
  );
  const hpOptions = useMemo<FacetOption[]>(
    () =>
      HP_BUCKETS.map((b) => ({
        value: b.label,
        label: b.label,
        count: base.filter((p) => b.test(getHorsepower(p))).length,
      })).filter((o) => o.count > 0),
    [base]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return base.filter((p) => {
      if (
        q &&
        !`${p.name} ${p.categoryLabel} ${p.series} ${p.sku}`.toLowerCase().includes(q)
      )
        return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedWeight) {
        const b = WEIGHT_BUCKETS.find((x) => x.label === selectedWeight);
        if (b && !b.test(getWeightTons(p))) return false;
      }
      if (selectedPowertrain && getPowertrain(p) !== selectedPowertrain) return false;
      if (selectedHp) {
        const b = HP_BUCKETS.find((x) => x.label === selectedHp);
        if (b && !b.test(getHorsepower(p))) return false;
      }
      return true;
    });
  }, [base, query, selectedCategory, selectedWeight, selectedPowertrain, selectedHp]);

  useEffect(() => {
    setPage(1);
  }, [selectedType, query, selectedCategory, selectedWeight, selectedPowertrain, selectedHp]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilters =
    (selectedCategory ? 1 : 0) +
    (selectedWeight ? 1 : 0) +
    (selectedPowertrain ? 1 : 0) +
    (selectedHp ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    setSelectedCategory(null);
    setSelectedWeight(null);
    setSelectedPowertrain(null);
    setSelectedHp(null);
  };

  return (
    <main className="min-h-screen bg-[#282828] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-10 lg:pt-36">
      <div className="mx-auto max-w-[1480px]">
        <div className="max-w-4xl">
          <p className="font-googleSans text-sm font-bold uppercase text-[#d8c79a]">
            Typhon Machinery
          </p>
          <h1 className="mt-3 font-clofieBold text-5xl font-bold leading-none sm:text-6xl">
            Typhon Machinery catalog
          </h1>
          <p className="mt-5 max-w-2xl font-glonimove text-lg leading-8 text-white/72">
            {selectedType === "equipment"
              ? "Browse Typhon machines — mini excavators, skid steer loaders, forklifts, road rollers, scissor lifts and wheel loaders built for jobsite work."
              : "Browse Typhon attachments, grouped by the machine they fit — skid steer, mini excavator, wheel loader and forklift attachments."}
          </p>
        </div>

        {/* Machines vs Attachments */}
        <div
          role="tablist"
          aria-label="Product type"
          className="mt-8 inline-flex border border-white/15 bg-[#232323] p-1"
        >
          {([
            ["equipment", "Machines", typeCounts.equipment],
            ["attachment", "Attachments", typeCounts.attachment],
          ] as const).map(([value, label, count]) => {
            const active = selectedType === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchType(value)}
                className={`px-5 py-2.5 font-googleSans text-sm font-bold uppercase tracking-wide transition ${
                  active
                    ? "bg-[#d8c79a] text-[#153d28]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {label}
                <span className={`ml-2 text-xs ${active ? "text-[#153d28]/70" : "text-white/40"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + result count */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-[440px]">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={selectedType === "equipment" ? "Search Typhon machines…" : "Search Typhon attachments…"}
              aria-label={selectedType === "equipment" ? "Search Typhon machines" : "Search Typhon attachments"}
              className="h-12 w-full border border-white/15 bg-[#232323] pl-11 pr-4 font-googleSans text-sm text-white placeholder:text-white/40 focus:border-[#d8c79a] focus:outline-none"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-glonimove text-white/64">
            <strong className="font-googleSans text-white">{filtered.length}</strong> of {base.length}{" "}
            {selectedType === "equipment" ? "machines" : "attachments"}
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          className="mt-4 flex w-full items-center justify-center gap-2 bg-[#d8c79a] py-3 font-googleSans text-sm font-bold uppercase tracking-wide text-[#153d28] lg:hidden"
        >
          {filtersOpen ? "Hide filters" : "Show filters"}
          {activeFilters > 0 && <span className="bg-[#153d28] px-1.5 py-0.5 text-xs text-white">{activeFilters}</span>}
          <span aria-hidden>{filtersOpen ? "▲" : "▼"}</span>
        </button>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
          {/* Filters */}
          <aside aria-label="Filters" className={`flex-col gap-4 ${filtersOpen ? "flex" : "hidden"} lg:flex`}>
            <div className="flex items-center justify-between">
              <span className="font-clofieBold text-lg text-white">Filters</span>
              {activeFilters > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="font-googleSans text-xs font-bold uppercase tracking-wide text-[#d8c79a] hover:text-white"
                >
                  Clear all ({activeFilters})
                </button>
              )}
            </div>
            <FilterGroup
              title={selectedType === "attachment" ? "Fits machine" : "Category"}
              options={categoryOptions}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
            <FilterGroup title="Weight Class" options={weightOptions} selected={selectedWeight} onSelect={setSelectedWeight} />
            <FilterGroup title="Engine" options={powertrainOptions} selected={selectedPowertrain} onSelect={setSelectedPowertrain} />
            <FilterGroup title="Horsepower" options={hpOptions} selected={selectedHp} onSelect={setSelectedHp} />
          </aside>

          {/* Grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="border border-dashed border-white/15 bg-[#232323] px-6 py-16 text-center">
                <p className="font-clofieBold text-2xl text-[#d8c79a]">
                  No {selectedType === "equipment" ? "machines" : "attachments"} match your filters
                </p>
                <p className="mt-2 font-glonimove text-white/60">Try removing a filter or clearing your search.</p>
                {activeFilters > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-6 inline-flex items-center justify-center bg-[#d8c79a] px-5 py-2.5 font-googleSans text-sm font-bold uppercase tracking-wide text-[#153d28] transition hover:bg-white"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] items-start gap-5 sm:gap-6">
                {pageItems.map((product) => (
                  <TyphonProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="border border-white/20 px-3 py-2 font-googleSans text-sm text-white transition enabled:hover:border-[#d8c79a] disabled:opacity-40"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`min-w-[40px] border px-3 py-2 font-googleSans text-sm font-bold ${
                      p === page
                        ? "border-[#d8c79a] bg-[#d8c79a] text-[#153d28]"
                        : "border-white/20 text-white hover:border-[#d8c79a]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="border border-white/20 px-3 py-2 font-googleSans text-sm text-white transition enabled:hover:border-[#d8c79a] disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TyphonCatalog;
