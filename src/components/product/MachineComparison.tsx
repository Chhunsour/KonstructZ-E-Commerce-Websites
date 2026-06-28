import React, { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../context/I18nContext";

/**
 * A single machine normalised into the shape the comparison UI understands.
 * Both Konstructz ({@link Product}) and Typhon ({@link TyphonProduct}) data are
 * mapped into this shape by the product single pages before being passed in.
 */
export interface ComparableMachine {
  id: string;
  name: string;
  categoryLabel: string;
  image: string;
  fallbackImage?: string;
  specs: { label: string; value: string }[];
  /** Optional headline price (Typhon machines carry one). */
  priceLabel?: string;
  /** Optional weight class shown as a quick fact. */
  weightLabel?: string;
  /** Optional list of features / attachments for the comparison table. */
  features?: string[];
  /**
   * Optional purchase / "View Product" link. For Typhon this is the CSV button
   * URL — never constructed or guessed. Konstructz machines leave this unset so
   * no CTA is added (their links stay exactly as they are elsewhere).
   */
  buyUrl?: string;
}

type Variant = "typhon" | "konstructz";

interface MachineComparisonProps {
  /** The machine whose single page is being viewed. */
  current: ComparableMachine;
  /**
   * Other machines allowed to be compared. The parent guarantees every
   * candidate is from the SAME category as `current` — never cross-category.
   */
  candidates: ComparableMachine[];
  /** Human readable category label (e.g. "Mini Excavator"). */
  categoryLabel: string;
  /** Visual theme so the section blends into each brand's page. */
  variant: Variant;
  /** CTA label for machines that expose a buy URL (e.g. "View Product"). */
  buyLabel?: string;
}

interface Tokens {
  section: string;
  kicker: string;
  heading: string;
  subtitle: string;
  rule: string;
  accentText: string;
  panel: string;
  panelHead: string;
  panelLabel: string;
  imageWrap: string;
  chip: string;
  machineName: string;
  price: string;
  factLabel: string;
  factValue: string;
  cta: string;
  select: string;
  emptyPanel: string;
  emptyText: string;
  tableWrap: string;
  theadRow: string;
  theadSpec: string;
  theadMachine: string;
  theadMachineAccent: string;
  groupRow: string;
  rowBorder: string;
  rowLabel: string;
  rowValue: string;
  rowValueMissing: string;
  diffRow: string;
  diffValue: string;
  featureItem: string;
}

const TOKENS: Record<Variant, Tokens> = {
  typhon: {
    section: "bg-[#fafafc] text-neutral-800",
    kicker: "text-[#153d28] font-bold",
    heading: "font-clofieBold text-neutral-900",
    subtitle: "text-neutral-500",
    rule: "bg-[#153d28]",
    accentText: "text-[#153d28]",
    panel: "bg-white border border-neutral-200 shadow-sm rounded-sm",
    panelHead: "border-b border-neutral-200 bg-neutral-50",
    panelLabel: "text-neutral-400",
    imageWrap: "bg-white",
    chip: "bg-[#153d28]/10 text-[#153d28]",
    machineName: "font-googleSans text-neutral-900 font-bold",
    price: "text-[#153d28] font-bold",
    factLabel: "text-neutral-400",
    factValue: "text-neutral-700",
    cta: "bg-[#d8c79a] text-[#153d28] hover:bg-[#153d28] hover:text-white font-bold transition-colors",
    select:
      "bg-white border border-neutral-300 text-neutral-800 focus:border-[#153d28] focus:outline-none rounded-sm",
    emptyPanel: "bg-white border border-dashed border-neutral-300 rounded-sm",
    emptyText: "text-neutral-400",
    tableWrap: "border border-neutral-200 bg-white shadow-sm rounded-sm",
    theadRow: "bg-neutral-50",
    theadSpec: "text-neutral-400 font-bold",
    theadMachine: "text-neutral-800",
    theadMachineAccent: "text-[#153d28] font-bold",
    groupRow: "bg-[#153d28]/10 text-[#153d28] font-bold",
    rowBorder: "border-neutral-100",
    rowLabel: "text-neutral-500",
    rowValue: "text-neutral-800",
    rowValueMissing: "text-neutral-400 italic",
    diffRow: "bg-[#153d28]/[0.06] border-l-2 border-l-[#153d28]",
    diffValue: "text-[#153d28]",
    featureItem: "text-neutral-600",
  },
  konstructz: {
    section: "bg-theme-bg text-theme-text",
    kicker: "text-theme-accent",
    heading: "font-heading uppercase tracking-wide text-theme-heading",
    subtitle: "text-theme-muted",
    rule: "bg-theme-accent",
    accentText: "text-theme-accent",
    panel: "bg-theme-sec border border-theme-border/20",
    panelHead: "border-b border-theme-border/20 bg-theme-bg/40",
    panelLabel: "text-theme-muted",
    imageWrap: "bg-theme-bg",
    chip: "bg-theme-accent/15 text-theme-accent",
    machineName: "font-heading uppercase tracking-wide text-theme-heading",
    price: "text-theme-accent",
    factLabel: "text-theme-muted",
    factValue: "text-theme-text",
    cta: "bg-theme-accent text-theme-bg hover:bg-brand-green",
    select:
      "bg-theme-bg border border-theme-border/30 text-theme-text focus:border-theme-accent focus:outline-none",
    emptyPanel: "bg-theme-sec border border-dashed border-theme-border/30",
    emptyText: "text-theme-muted",
    tableWrap: "border border-theme-border/20 bg-theme-sec",
    theadRow: "bg-theme-bg/40",
    theadSpec: "text-theme-muted",
    theadMachine: "text-theme-text",
    theadMachineAccent: "text-theme-accent",
    groupRow: "bg-theme-bg/60 text-theme-accent",
    rowBorder: "border-theme-border/15",
    rowLabel: "text-theme-muted",
    rowValue: "text-theme-text",
    rowValueMissing: "text-theme-muted/50 italic",
    diffRow: "bg-theme-accent/[0.06] border-l-2 border-l-theme-accent",
    diffValue: "text-theme-accent",
    featureItem: "text-theme-text/85",
  },
};

const MISSING = "Not listed";

/* ── Spec grouping ──────────────────────────────────────────────────────── */

type GroupKey = "basic" | "engine" | "size" | "performance";

const GROUP_ORDER: { key: GroupKey; title: string }[] = [
  { key: "basic", title: "Basic Info" },
  { key: "engine", title: "Engine & Power" },
  { key: "size", title: "Size & Weight" },
  { key: "performance", title: "Performance" },
];

const categorize = (label: string): GroupKey => {
  const l = label.toLowerCase();
  if (/(sku|gtin|category|series|price|model|brand|warranty|year)/.test(l))
    return "basic";
  if (
    /(engine|power|hydraulic|flow|horsepower|\bhp\b|torque|fuel|motor|transmission|drive|rpm)/.test(
      l
    )
  )
    return "engine";
  if (/(weight|class|feed opening|clearance|footprint|wheelbase|mast|dimension)/.test(l))
    return "size";
  return "performance";
};

const specValue = (machine: ComparableMachine | null, label: string): string =>
  machine?.specs.find((s) => s.label === label)?.value ?? "";

/** A spec counts as "listed" only when the machine has a non-empty value for it. */
const hasSpec = (machine: ComparableMachine, label: string): boolean =>
  specValue(machine, label).trim().length > 0;

/**
 * Only the specs that BOTH machines actually list, in the current machine's
 * order. Specs missing from either side are dropped entirely — we never copy,
 * autofill, or guess a value from the other product. Each machine keeps only
 * its own real data.
 */
const sharedLabels = (
  current: ComparableMachine,
  compared: ComparableMachine | null
): string[] => {
  if (!compared) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  current.specs.forEach((s) => {
    if (!seen.has(s.label) && hasSpec(current, s.label) && hasSpec(compared, s.label)) {
      seen.add(s.label);
      out.push(s.label);
    }
  });
  return out;
};

/* ── Quick facts (header) ───────────────────────────────────────────────── */

const findSpec = (machine: ComparableMachine, re: RegExp): string =>
  machine.specs.find((s) => re.test(s.label))?.value ?? "";

const extractPower = (machine: ComparableMachine): string => {
  for (const spec of machine.specs) {
    const match = spec.value.match(/([\d.,]+)\s*HP/i);
    if (match) return `${match[1]} HP`;
  }
  return findSpec(machine, /power/i);
};

const quickFacts = (machine: ComparableMachine, t: any): { label: string; value: string }[] => [
  { label: t("equipment.categories", { fallback: "Category" }), value: t(`category.${machine.categoryLabel.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}`, { fallback: machine.categoryLabel }) },
  {
    label: t("catalog.filters.weight", { fallback: "Weight Class" }),
    value: machine.weightLabel || findSpec(machine, /weight/i) || t("product.comparison.notListed", { fallback: MISSING }),
  },
  { label: t("spec.power", { fallback: "Power" }), value: extractPower(machine) || t("product.comparison.notListed", { fallback: MISSING }) },
  {
    label: t("spec.engine", { fallback: "Engine" }),
    value:
      findSpec(machine, /^engine$/i) || findSpec(machine, /engine/i) || t("product.comparison.notListed", { fallback: MISSING }),
  },
];

const sameCategory = (a: ComparableMachine, b: ComparableMachine): boolean =>
  a.categoryLabel.trim().toLowerCase() === b.categoryLabel.trim().toLowerCase();

const readableId = (id: string): string =>
  id
    .split("-")
    .filter(Boolean)
    .slice(0, 6)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const displayName = (machine: ComparableMachine): string =>
  machine.name.trim() || readableId(machine.id) || machine.categoryLabel || "Machine";

/* ── Sub-components ─────────────────────────────────────────────────────── */

const MachineBody: React.FC<{
  machine: ComparableMachine;
  tokens: Tokens;
  buyLabel: string;
}> = ({ machine, tokens, buyLabel }) => {
  const { t } = useI18n();
  const facts = quickFacts(machine, t);
  const name = displayName(machine);
  return (
    <div className="p-5">
      <div className="flex gap-4">
        <div
          className={`h-24 w-28 shrink-0 overflow-hidden ${tokens.imageWrap}`}
        >
          <img
            src={machine.image}
            alt={name}
            className="h-full w-full object-contain p-2"
            loading="lazy"
            onError={(event) => {
              if (!machine.fallbackImage || event.currentTarget.dataset.fallbackApplied === "true") return;
              event.currentTarget.dataset.fallbackApplied = "true";
              event.currentTarget.src = machine.fallbackImage;
            }}
          />
        </div>
        <div className="min-w-0">
          <span
            className={`inline-block px-2 py-0.5 font-googleSans text-[11px] font-bold uppercase tracking-wide ${tokens.chip}`}
          >
            {t(`category.${machine.categoryLabel.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}`, { fallback: machine.categoryLabel })}
          </span>
          <h3 className={`mt-1.5 text-lg leading-tight ${tokens.machineName}`}>
            {name}
          </h3>
          {machine.priceLabel && (
            <p className={`mt-1 font-googleSans text-base font-bold ${tokens.price}`}>
              {machine.priceLabel}
            </p>
          )}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        {facts.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <dt
              className={`font-googleSans text-[10px] font-bold uppercase tracking-wide ${tokens.factLabel}`}
            >
              {fact.label}
            </dt>
            <dd
              className={`truncate font-glonimove text-sm ${tokens.factValue}`}
              title={fact.value}
            >
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      {machine.buyUrl && (
        <a
          href={machine.buyUrl}
          className={`mt-5 flex min-h-[42px] w-full items-center justify-center px-4 font-googleSans text-sm font-bold transition ${tokens.cta}`}
        >
          {buyLabel}
        </a>
      )}
    </div>
  );
};

/* ── Main ───────────────────────────────────────────────────────────────── */

export const MachineComparison: React.FC<MachineComparisonProps> = ({
  current,
  candidates,
  categoryLabel,
  variant,
  buyLabel = "View Product",
}) => {
  const { t } = useI18n();
  const themeTokens = TOKENS[variant];
  const [comparedId, setComparedId] = useState<string>("");
  const sameCategoryCandidates = useMemo(
    () =>
      candidates.filter(
        (candidate) => candidate.id !== current.id && sameCategory(candidate, current)
      ),
    [candidates, current]
  );

  useEffect(() => {
    setComparedId("");
  }, [current.id]);

  useEffect(() => {
    if (
      comparedId &&
      !sameCategoryCandidates.some((candidate) => candidate.id === comparedId)
    ) {
      setComparedId("");
    }
  }, [comparedId, sameCategoryCandidates]);

  const compared = useMemo(
    () => sameCategoryCandidates.find((c) => c.id === comparedId) ?? null,
    [sameCategoryCandidates, comparedId]
  );

  const grouped = useMemo(() => {
    const labels = sharedLabels(current, compared);
    const buckets: Record<GroupKey, string[]> = {
      basic: [],
      engine: [],
      size: [],
      performance: [],
    };
    labels.forEach((label) => buckets[categorize(label)].push(label));
    return buckets;
  }, [current, compared]);

  const hasSharedSpecs = useMemo(
    () => Object.values(grouped).some((labels) => labels.length > 0),
    [grouped]
  );

  const hasCandidates = sameCategoryCandidates.length > 0;
  // Features are only comparable when BOTH machines list their own features.
  // We never borrow a feature list from the other product.
  const showFeatures =
    !!compared &&
    (current.features?.length ?? 0) > 0 &&
    (compared.features?.length ?? 0) > 0;

  return (
    <section
      className={`${themeTokens.section} transition-colors duration-200`}
      aria-labelledby="machine-comparison-title"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        {/* ── Title ── */}
        <p
          className={`font-googleSans text-xs font-bold uppercase tracking-[0.18em] ${themeTokens.kicker}`}
        >
          {t("product.comparison.kicker", { fallback: "Comparison" })}
        </p>
        <h2
          id="machine-comparison-title"
          className={`mt-2 text-3xl md:text-4xl font-bold ${themeTokens.heading}`}
        >
          {t("product.comparison.title", { fallback: "Compare Similar Machines" })}
        </h2>
        <div className={`mt-4 h-1 w-16 ${themeTokens.rule}`} />
        <p className={`mt-4 max-w-xl font-glonimove text-base ${themeTokens.subtitle}`}>
          {t("product.comparison.description", { fallback: "Compare this machine with other machines in the same category." })}
        </p>

        {!hasCandidates ? (
          <div className={`mt-8 ${themeTokens.emptyPanel} px-6 py-10 text-center`}>
            <p className={`font-glonimove ${themeTokens.emptyText}`}>
              {t("product.comparison.noCandidates", { fallback: "No other machines available for comparison in this category." })}
            </p>
          </div>
        ) : (
          <>
            {/* ── Two-panel comparison header ── */}
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {/* Current machine */}
              <div className={themeTokens.panel}>
                <div
                  className={`flex items-center px-5 py-3 ${themeTokens.panelHead}`}
                >
                  <span
                    className={`font-googleSans text-[11px] font-bold uppercase tracking-wide ${themeTokens.panelLabel}`}
                  >
                    {t("product.comparison.currentlyViewing", { fallback: "Currently viewing" })}
                  </span>
                </div>
                <MachineBody machine={current} tokens={themeTokens} buyLabel={buyLabel} />
              </div>

              {/* Compared machine + selector */}
              <div className={themeTokens.panel}>
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 px-5 py-3 ${themeTokens.panelHead}`}
                >
                  <label
                    htmlFor="compare-select"
                    className={`font-googleSans text-[11px] font-bold uppercase tracking-wide ${themeTokens.panelLabel}`}
                  >
                    {compared ? t("product.comparison.changeComparison", { fallback: "Change comparison machine" }) : t("product.comparison.selectCategory", { values: { category: categoryLabel }, fallback: `Select a ${categoryLabel}` })}
                  </label>
                  <select
                    id="compare-select"
                    value={comparedId}
                    onChange={(event) => setComparedId(event.target.value)}
                    className={`max-w-[55%] truncate px-3 py-1.5 font-googleSans text-xs ${themeTokens.select}`}
                  >
                    <option value="">{t("product.comparison.chooseMachine", { fallback: "Choose a machine…" })}</option>
                    {sameCategoryCandidates.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {displayName(candidate)}
                      </option>
                    ))}
                  </select>
                </div>
                {compared ? (
                  <MachineBody machine={compared} tokens={themeTokens} buyLabel={buyLabel} />
                ) : (
                  <div className="flex min-h-[180px] items-center justify-center p-6 text-center">
                    <p className={`font-glonimove text-sm ${themeTokens.emptyText}`}>
                      {t("product.comparison.pickPrompt", { values: { category: categoryLabel }, fallback: `Pick another ${categoryLabel} from the dropdown above to see a full side-by-side specification comparison.` })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── No shared specs to compare ── */}
            {compared && !hasSharedSpecs && !showFeatures && (
              <div className={`mt-6 ${themeTokens.emptyPanel} px-6 py-8 text-center`}>
                <p className={`font-glonimove ${themeTokens.emptyText}`}>
                  {t("product.comparison.noSharedSpecs", { fallback: "These two machines don't list any directly comparable specifications." })}
                </p>
              </div>
            )}

            {/* ── Specification table (shared specs only) ── */}
            {compared && (hasSharedSpecs || showFeatures) && (
              <div className={`mt-6 overflow-hidden ${themeTokens.tableWrap}`}>
                <table className="w-full table-fixed border-collapse text-left">
                  <caption className="sr-only">
                    {t("product.comparison.caption", { values: { current: displayName(current), compared: displayName(compared) }, fallback: `Specification comparison between ${displayName(current)} and ${displayName(compared)}` })}
                  </caption>
                  <thead>
                    <tr className={`sticky top-0 z-10 ${themeTokens.theadRow}`}>
                      <th
                        scope="col"
                        className={`w-[34%] px-4 py-3 font-googleSans text-[11px] font-bold uppercase tracking-wide ${themeTokens.theadSpec}`}
                      >
                        {t("product.comparison.specification", { fallback: "Specification" })}
                      </th>
                      <th
                        scope="col"
                        className={`px-4 py-3 font-googleSans text-sm font-bold ${themeTokens.theadMachine}`}
                      >
                        {displayName(current)}
                      </th>
                      <th
                        scope="col"
                        className={`px-4 py-3 font-googleSans text-sm font-bold ${themeTokens.theadMachineAccent}`}
                      >
                        {displayName(compared)}
                      </th>
                    </tr>
                  </thead>

                  {GROUP_ORDER.map(
                    (group) =>
                      grouped[group.key].length > 0 && (
                        <tbody key={group.key}>
                          <tr>
                            <th
                              scope="colgroup"
                              colSpan={3}
                              className={`px-4 py-2 text-left font-googleSans text-[11px] font-bold uppercase tracking-[0.12em] ${themeTokens.groupRow}`}
                            >
                              {t(`product.comparison.group.${group.key}`, { fallback: group.title })}
                            </th>
                          </tr>
                          {grouped[group.key].map((label) => {
                            // Both values are guaranteed present — only specs
                            // listed by BOTH machines reach this point.
                            const a = specValue(current, label);
                            const b = specValue(compared, label);
                            const isDiff = a.trim() !== b.trim();
                            const translatedLabel = t(`spec.${label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}`, { fallback: label });
                            return (
                              <tr
                                key={label}
                                className={`border-t ${themeTokens.rowBorder} ${
                                  isDiff ? themeTokens.diffRow : ""
                                }`}
                              >
                                <th
                                  scope="row"
                                  className={`px-4 py-3 align-top font-glonimove text-[13px] font-normal ${themeTokens.rowLabel}`}
                                >
                                  {translatedLabel}
                                </th>
                                <td
                                  className={`px-4 py-3 align-top font-googleSans text-sm ${
                                    isDiff ? themeTokens.diffValue : themeTokens.rowValue
                                  }`}
                                >
                                  {a}
                                </td>
                                <td
                                  className={`px-4 py-3 align-top font-googleSans text-sm ${
                                    isDiff ? themeTokens.diffValue : themeTokens.rowValue
                                  }`}
                                >
                                  {b}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      )
                  )}

                  {showFeatures && (
                    <tbody>
                      <tr>
                        <th
                          scope="colgroup"
                          colSpan={3}
                          className={`px-4 py-2 text-left font-googleSans text-[11px] font-bold uppercase tracking-[0.12em] ${themeTokens.groupRow}`}
                        >
                          {t("product.comparison.featuresGroup", { fallback: "Attachments / Features" })}
                        </th>
                      </tr>
                      <tr className={`border-t ${themeTokens.rowBorder}`}>
                        <th
                          scope="row"
                          className={`px-4 py-3 align-top font-glonimove text-[13px] font-normal ${themeTokens.rowLabel}`}
                        >
                          {t("product.comparison.keyFeatures", { fallback: "Key Features" })}
                        </th>
                        {[current, compared].map((machine, idx) => (
                          <td
                            key={idx}
                            className="px-4 py-3 align-top"
                          >
                            {machine.features && machine.features.length > 0 ? (
                              <ul className="space-y-1.5">
                                {machine.features.map((feature, fi) => (
                                  <li
                                    key={fi}
                                    className={`flex gap-2 font-glonimove text-[13px] leading-snug ${themeTokens.featureItem}`}
                                  >
                                    <span
                                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 ${themeTokens.rule}`}
                                    />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span
                                className={`font-googleSans text-sm ${themeTokens.rowValueMissing}`}
                              >
                                {t("product.comparison.notListed", { fallback: MISSING })}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MachineComparison;
