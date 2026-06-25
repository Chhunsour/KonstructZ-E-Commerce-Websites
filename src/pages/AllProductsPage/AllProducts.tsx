import React, { useState, useRef, useEffect } from "react";
import { products as ALL_PRODUCTS, type Product } from "../../data/products";
import { useI18n } from "../../context/I18nContext";
import { categoryNameKey } from "../../i18n/keys";
import { ProductCard } from "../../components/ui/ProductCard";
import { EquipmentBanner } from "../../components/sections/EquipmentBanner";
import { MachineLogoSlider } from "../../components/sections/MachineLogoSlider";

/* ─────────────────────────────────────────────────────────────────────
   Helpers
────────────────────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────────────────── */

const BEFORE_AFTER_THUMBS = [
  "/all-products/img/chatgpt-image-jun-10-2026-01-24-24-pm-3.png",
  "/all-products/img/chatgpt-image-jun-10-2026-01-24-16-pm-3.png",
  "/all-products/img/chatgpt-image-jun-10-2026-01-24-31-pm-3.png",
  "/all-products/img/chatgpt-image-jun-10-2026-11-18-24-am-4.png",
];

/* Real products from /data/products.ts drive the cards directly. */
const EQUIPMENT_LIST: Product[] = ALL_PRODUCTS;


/* ─────────────────────────────────────────────────────────────────────
   Reusable bits
────────────────────────────────────────────────────────────────────── */

const Stars: React.FC<{ filled?: number; total?: number }> = ({ filled = 3, total = 5 }) => {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-[3px]" aria-label={t("allProducts.reviewLabel", { values: { filled, total } })}>
      {Array.from({ length: total }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < filled ? "#d8c79a" : "#cccccc"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

const FilterGroup: React.FC<{
  title: string;
  options: string[];
  defaultOpen?: boolean;
  translateOptions?: boolean;
  selectedOption?: string | null;
  onOptionSelect?: (option: string | null) => void;
  optionValueMapping?: { [key: string]: string };
  disabled?: boolean;
}> = ({
  title,
  options,
  defaultOpen = true,
  translateOptions = false,
  selectedOption,
  onOptionSelect,
  optionValueMapping,
  disabled = false,
}) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`bg-theme-sec text-theme-text p-4 border border-theme-border/10 rounded transition-all duration-200 ${disabled ? "opacity-50" : ""}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between w-full font-clofieBold text-theme-text text-lg sm:text-xl pb-3 border-b-[3px] border-theme-border ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {disabled && (
            <span className="text-[10px] font-googleSans font-bold uppercase tracking-wider bg-theme-border/20 px-1.5 py-0.5 rounded text-theme-muted">
              Locked
            </span>
          )}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 10 7"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all ${
          open ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1.5">
          {options.map((opt) => {
            const val = optionValueMapping ? optionValueMapping[opt] : opt;
            const isChecked = selectedOption === val;
            const labelText = translateOptions ? t(categoryNameKey(opt), { fallback: opt }) : opt;

            return (
              <li key={opt}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled && onOptionSelect) {
                      onOptionSelect(isChecked ? null : val);
                    }
                  }}
                  className={`flex items-center gap-3 w-full text-left py-2.5 px-3 rounded-md border transition-all ${
                    disabled
                      ? "bg-theme-card/10 border-theme-border/10 cursor-not-allowed opacity-70"
                      : isChecked
                        ? "bg-theme-accent/10 border-theme-accent/30 cursor-pointer animate-fade-in"
                        : "bg-theme-card/30 border-theme-border/20 hover:bg-brand-dark/40 hover:border-theme-accent/30 cursor-pointer"
                  }`}
                >
                  {/* Custom Checkbox */}
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    isChecked
                      ? "bg-theme-accent border-theme-accent text-brand-dark"
                      : "border-theme-border/40 text-transparent"
                  }`}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className={`font-glonimove text-sm sm:text-base transition-colors ${
                    isChecked ? "text-theme-accent font-bold" : "text-theme-text"
                  }`}>
                    {labelText}
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

const PriceFilter: React.FC<{
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled = false }) => {
  const { t } = useI18n();
  return (
    <div className={`bg-theme-sec text-theme-text p-4 border border-theme-border/10 rounded transition-all duration-200 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between pb-3 border-b-[3px] border-theme-border">
        <span className="font-clofieBold text-theme-text text-lg sm:text-xl flex items-center gap-2">
          <span>{t("equipment.price")}</span>
          {disabled && (
            <span className="text-[10px] font-googleSans font-bold uppercase tracking-wider bg-theme-border/20 px-1.5 py-0.5 rounded text-theme-muted">
              Locked
            </span>
          )}
        </span>
      </div>
      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={69999}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full accent-theme-accent ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          aria-label={t("equipment.price")}
        />
        <div className="mt-2 flex items-center justify-between font-glonimove text-theme-text text-xs sm:text-sm">
          <span>0–${value.toLocaleString()}.00</span>
          <span>{t("equipment.max")}: $69,999.00</span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   PAGE SECTIONS
────────────────────────────────────────────────────────────────────── */

const HeroSection: React.FC = () => {
  const { t } = useI18n();

  const HERO_PRODUCTS = [
    { src: "/all-products/img/new-project-18-2.png", alt: t("auto.allproducts.compact.skid.steer"), size: "side" as const },
    { src: "/all-products/img/stomp-v980-4-3.png", alt: t("auto.allproducts.kuvuo.4.0"), size: "main" as const },
    { src: "/all-products/img/new-project-15-2-5.png", alt: t("auto.allproducts.skid.steer.attachment"), size: "side" as const },
  ];

  const HERO_SPECS = [
    { icon: "/all-products/img/car-service-parts-warning-error-electric-refueling.svg", value: "Setup", label: "Varies" },
    { icon: "/all-products/img/car-service-parts-speedometer.svg", value: "Fit", label: "Confirmed" },
    { icon: "/all-products/img/car-service-parts-car-time-timer.svg", value: "Power", label: "Configured" },
  ];

  return (
  <section className="relative bg-theme-bg overflow-hidden pt-28 lg:pt-32 pb-12 lg:pb-20 transition-colors duration-200">
    {/* Decorative glow */}
    <div
      aria-hidden="true"
      className="absolute left-1/2 -translate-x-1/2 top-[55%] w-[80%] max-w-[838px] h-[230px] bg-theme-accent/10 rounded-[50%] blur-[100px] pointer-events-none"
    />

    <div className="relative max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10">
      <h1 className="text-center font-[Malking-Regular] text-theme-heading leading-[0.95] tracking-[-0.02em] text-[clamp(64px,14vw,210px)]">
        {t("allProducts.heroTitle")}
      </h1>

      {/* Product trio */}
      <div className="mt-6 sm:mt-10 lg:mt-12 grid grid-cols-3 gap-3 sm:gap-6 lg:gap-10 items-end">
        {HERO_PRODUCTS.map((p, i) => (
          <div
            key={i}
            className={`relative flex items-end justify-center ${
              p.size === "main" ? "h-[180px] sm:h-[280px] lg:h-[420px]" : "h-[110px] sm:h-[200px] lg:h-[320px]"
            }`}
          >
            <img
              src={p.src}
              alt={p.alt}
              className="max-h-full max-w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
            />
          </div>
        ))}
      </div>

      {/* Selector dot */}
      <div className="mt-4 flex justify-center">
        <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-theme-sec border-2 border-theme-border" />
      </div>

      {/* Info bar */}
      <div className="mt-8 lg:mt-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10">
        <div className="flex items-stretch gap-4 sm:gap-6">
          <span className="w-1 self-stretch bg-theme-accent" aria-hidden="true" />
          <div>
            <h2 className="font-clofieBold text-theme-text text-2xl sm:text-3xl lg:text-[42px] leading-tight">{t("auto.allproducts.kuvuo.4.0")}</h2>
            <p className="mt-2 font-glonimove text-theme-muted text-sm sm:text-base lg:text-lg max-w-md">
              {t("allProducts.heroDescription")}
            </p>
          </div>
        </div>

        <ul className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8 lg:gap-10">
          {HERO_SPECS.map((s, i) => (
            <React.Fragment key={s.label}>
              <li className="flex flex-col items-center gap-2 sm:gap-3">
                <img src={s.icon} alt="" aria-hidden="true" className="w-7 h-7 sm:w-10 sm:h-10 dark:invert-0 invert opacity-80 dark:opacity-100" />
                <div className="flex items-baseline gap-2">
                  <span className="font-[Cal_Sans] text-theme-text text-xl sm:text-2xl lg:text-[28px]">{s.value}</span>
                  <span className="font-[Roboto_Flex] text-theme-muted text-xs sm:text-sm lg:text-base">{s.label}</span>
                </div>
              </li>
              {i < HERO_SPECS.length - 1 && (
                <li aria-hidden="true" className="w-px h-10 bg-theme-border/30" />
              )}
            </React.Fragment>
          ))}
        </ul>

        <button
          type="button"
          className="self-start sm:self-center bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white transition-all px-5 py-3 lg:px-6 lg:py-4 flex items-center gap-3 border border-theme-accent"
        >
          <span className="font-googleSans font-medium text-inherit text-base lg:text-2xl tracking-[-0.02em]">
            {t("action.exploreMore")}
          </span>
          <span aria-hidden="true" className="text-inherit text-lg">→</span>
        </button>
      </div>
    </div>
  </section>
  );
};

const BrandStrip: React.FC = () => {
  return <MachineLogoSlider className="bg-theme-sec" />;
};

const BeforeAfterSection: React.FC = () => {
  const { t } = useI18n();
  const [pos, setPos] = useState(50);
  const titleLines = t("allProducts.beforeAfterTitle").split("\n");

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(newPos);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <section className="bg-theme-bg pt-20 lg:pt-32 pb-10 lg:pb-12 transition-colors duration-200 relative overflow-hidden">
      {/* Backdrop Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,199,154,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[10px] sm:text-xs uppercase tracking-[0.25em] font-googleSans font-bold text-theme-accent bg-theme-accent/10 border border-theme-accent/20 rounded-full mb-4 animate-fade-in shadow-[0_0_15px_rgba(216,199,154,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
            VISUAL PROOF
          </span>

          <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
            <h2 className="font-[Malking-Regular] text-white text-3xl sm:text-4xl lg:text-[54px] xl:text-[62px] tracking-tight leading-none text-center uppercase">
              {titleLines[0]}
            </h2>
            {titleLines[1] && (
              <span className="font-[Malking-Regular] text-theme-accent text-2xl sm:text-3xl lg:text-[46px] xl:text-[52px] tracking-wide text-center uppercase">
                {titleLines[1]}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 mt-6 opacity-80">
            <div className="w-12 h-[1px] bg-theme-accent/30" />
            <div className="w-1.5 h-1.5 rotate-45 border border-theme-accent bg-theme-accent/20" />
            <div className="w-12 h-[1px] bg-theme-accent/30" />
          </div>
        </div>

        {/* Compare slider */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative mt-12 lg:mt-16 w-full max-w-[1740px] aspect-[2.29] rounded-xl lg:rounded-2xl border border-[#DDC49A]/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden select-none group cursor-ew-resize touch-none"
        >
          {/* Glassmorphic Labels */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 pointer-events-none select-none">
            <span className="bg-brand-dark/80 backdrop-blur-md border border-[#DDC49A]/20 text-[#DDC49A] px-3.5 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-md shadow-lg flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              BEFORE
            </span>
          </div>
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 pointer-events-none select-none">
            <span className="bg-brand-dark/80 backdrop-blur-md border border-[#DDC49A]/20 text-[#DDC49A] px-3.5 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-md shadow-lg flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              AFTER
            </span>
          </div>

          {/* AFTER Image (Background) */}
          <img
            src="/all-products/img/chatgpt-image-jun-10-2026-11-18-24-am-1-1.png"
            alt={t("allProducts.afterSiteTransformation")}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            loading="eager"
          />
          {/* BEFORE Image (Hardware-Accelerated Clipped Overlay) */}
          <img
            src="/all-products/img/before 4th image.png"
            alt={t("allProducts.beforeSiteTransformation")}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            loading="eager"
          />
          
          {/* Divider Line */}
          <div
            className="absolute inset-y-0 w-[4px] bg-[#DDC49A] shadow-[0_0_15px_rgba(221,196,154,0.6)] group-hover:bg-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-[background-color,box-shadow] duration-200 pointer-events-none"
            style={{ left: `calc(${pos}% - 2px)` }}
            aria-hidden="true"
          />
          
          {/* Handle Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand-dark border-2 border-[#DDC49A] flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.6),0_0_15px_rgba(221,196,154,0.3)] group-hover:scale-110 group-hover:border-white group-hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-[transform,border-color,box-shadow] duration-200 pointer-events-none"
            style={{ left: `calc(${pos}% - 24px)` }}
            aria-hidden="true"
          >
            <svg
              className="w-5 h-5 text-[#DDC49A] group-hover:text-white transition-colors duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18L3 12L9 6M15 6L21 12L15 18" />
            </svg>
          </div>
          
          {/* Accessible hidden range input */}
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(pos)}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label={t("allProducts.beforeAfterPosition")}
            className="sr-only"
          />
        </div>
      </div>
    </section>
  );
};

const getCountLabel = (count: number, t: any) => {
  const isFR = t("allProducts.categoriesTitle") === "Catégories";
  const isES = t("allProducts.categoriesTitle") === "Categorías";
  const isJA = t("allProducts.categoriesTitle") === "カテゴリー";
  const isKO = t("allProducts.categoriesTitle") === "카테고리";
  const isZH = t("allProducts.categoriesTitle") === "分类";
  const isIT = t("allProducts.categoriesTitle") === "Categorie";
  const isDE = t("allProducts.categoriesTitle") === "Kategorien";

  if (isFR) return `${count} ${count === 1 ? "Machine" : "Machines"}`;
  if (isES) return `${count} ${count === 1 ? "Máquina" : "Máquinas"}`;
  if (isJA) return `${count} 台`;
  if (isKO) return `${count} 대`;
  if (isZH) return `${count} 台`;
  if (isIT) return `${count} ${count === 1 ? "Macchina" : "Macchine"}`;
  if (isDE) return `${count} ${count === 1 ? "Maschine" : "Maschinen"}`;
  return `${count} ${count === 1 ? "Machine" : "Machines"}`;
};

interface CategoriesSectionProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ selectedCategory, setSelectedCategory }) => {
  const { t } = useI18n();

  const CATEGORIES = [
    { slug: "skid-steer-loaders", translationKey: "category.skid-steer", label: "Skid Steer", count: 2, src: "/img/banner/banner-stomp-v980.png", display: { scale: 1.09, yOffset: 0 } },
    { slug: "mini-excavators", translationKey: "category.mini-excavator", label: "Mini Excavator", count: 2, src: "/img/banner/banner-kuvuo.png", display: { scale: 1.33, yOffset: 6 } },
    { slug: "wheel-loaders", translationKey: "category.wheel-loader", label: "Wheel Loader", count: 1, src: "/img/banner/banner-skoop-ii.png", display: { scale: 1.36, yOffset: 9 } },
    { slug: "backhoe-loaders", translationKey: "category.backhoe-loader", label: "Backhoe Loader", count: 1, src: "/img/banner/banner-scoopydig.png", display: { scale: 1.42, yOffset: 15 } },
    { slug: "dumpers", translationKey: "category.dumper", label: "Dumper", count: 2, src: "/img/banner/banner-thunderdump.png", display: { scale: 1.15, yOffset: 0 } },
    { slug: "trenchers", translationKey: "category.trencher", label: "Trencher", count: 1, src: "/img/banner/banner-trencher.png", display: { scale: 1.57, yOffset: 24 } },
    { slug: "towable-excavators", translationKey: "category.towable-excavator", label: "Towable Excavator", count: 1, src: "/img/banner/banner-spider-one.png", display: { scale: 1.15, yOffset: 9 } },
    { slug: "stone-crushers", translationKey: "category.stone-crusher", label: "Stone Crusher", count: 3, src: "/img/banner/banner-stone-crusher.png", display: { scale: 1.36, yOffset: 12 } },
  ];

  return (
  <section className="bg-theme-bg pt-10 lg:pt-12 pb-24 lg:pb-36 transition-colors duration-200 relative overflow-hidden">
    {/* Backdrop Ambient Spotlight Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,199,154,0.03)_0%,transparent_75%)] pointer-events-none" />

    <div className="max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
      <h2 className="text-center font-[Malking-Regular] text-theme-heading text-3xl sm:text-5xl lg:text-[75px] tracking-[-0.02em] uppercase">
        {t("allProducts.categoriesTitle")}
      </h2>

      <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          const scale = cat.display?.scale || 1.0;
          const yOffset = cat.display?.yOffset || 0;
          const categoryName = t(cat.translationKey, { fallback: cat.label });

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => {
                setSelectedCategory(isActive ? null : cat.slug);
                setTimeout(() => {
                  const el = document.getElementById("equipment-list-section");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }, 50);
              }}
              className={`group relative flex flex-col justify-between aspect-[4/5] rounded-2xl overflow-hidden border transition-all duration-500 select-none cursor-pointer p-6 lg:p-8 ${
                isActive
                  ? "bg-gradient-to-b from-[#222720] to-[#151813] border-theme-accent shadow-[0_0_35px_rgba(216,199,154,0.22),inset_0_0_20px_rgba(216,199,154,0.08)]"
                  : "bg-gradient-to-b from-[#181C16] to-[#0F120E] border-theme-border/20 hover:border-theme-accent/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(221,196,154,0.15)]"
              }`}
              aria-label={categoryName}
            >
              {/* Framing Corner Brackets */}
              <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 transition-all duration-500 pointer-events-none ${
                isActive ? "border-theme-accent opacity-100" : "border-transparent opacity-0 group-hover:border-theme-accent/60 group-hover:opacity-100"
              }`} />
              <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 transition-all duration-500 pointer-events-none ${
                isActive ? "border-theme-accent opacity-100" : "border-transparent opacity-0 group-hover:border-theme-accent/60 group-hover:opacity-100"
              }`} />

              {/* Top active tag */}
              {isActive && (
                <div className="absolute top-4 right-4 z-20 bg-theme-accent text-brand-dark px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md animate-fade-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                  SELECTED
                </div>
              )}

              {/* Top text area */}
              <div className="relative z-20 text-left w-full">
                <h3 className="font-clofieBold text-xl sm:text-2xl text-white tracking-wide uppercase transition-colors group-hover:text-theme-accent">
                  {categoryName}
                </h3>
              </div>

              {/* Background spotlight pod */}
              <div className={`absolute inset-x-0 bottom-4 mx-auto w-36 h-36 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${
                isActive
                  ? "bg-theme-accent/12 scale-110"
                  : "bg-theme-accent/4 group-hover:bg-brand-green/15 group-hover:scale-125"
              }`} />

              {/* Centered Image Area */}
              <div className="relative z-10 w-full flex-1 flex items-center justify-center min-h-0 py-4 my-2 transition-transform duration-500 ease-out group-hover:-translate-y-2.5 group-hover:scale-105">
                <img
                  src={cat.src}
                  alt={categoryName}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                  style={{ transform: `scale(${scale}) translateY(${yOffset}px)` }}
                />
              </div>

              {/* Bottom Explore Tray */}
              <div className="relative z-20 mt-4 flex items-center justify-between border-t border-white/5 pt-4 w-full">
                <span className={`font-googleSans text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive ? "text-[#DDC49A]" : "text-theme-muted group-hover:text-white"
                }`}>
                  {isActive ? "ACTIVE FILTER" : "EXPLORE RANGE"}
                </span>
                <div className="w-8 h-8 rounded-full bg-brand-green/20 border border-[#DDC49A]/10 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-brand-dark group-hover:scale-110 transition-all duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </section>
  );
};

/* Deterministic pricing map for client-side filters */
const PRODUCT_PRICES: Record<string, number> = {
  "stomp-v980": 42500,
  "kuvuo-2-5": 28900,
  "skoop-ii": 48000,
  "scoopydig": 59500,
  "thunderdump-1": 14200,
  "stone-crusher-1": 34000,
  "group-ripper-grx": 18500,
  "kuvuo-2-7": 32400,
  "spider-one": 8900,
  "stone-crusher-2": 49000,
  "thunderdump-2": 22800,
  "stomp-v950": 39500,
  "stone-crusher-3": 68500,
};

const getProductWeightInTons = (product: Product): number => {
  const normalized = product.weight.toLowerCase();
  const num = parseFloat(normalized.replace(/,/g, ""));
  if (isNaN(num)) return 0;
  if (normalized.includes("lb") || normalized.includes("pound")) {
    return num / 2000;
  }
  return num;
};

const getProductEngineType = (product: Product): string => {
  const engineSpec = product.specs.find(s => s.label.toLowerCase().includes("engine"));
  const textToSearch = (engineSpec?.value || "") + " " + product.description + " " + product.tagline;
  const normalized = textToSearch.toLowerCase();
  
  if (normalized.includes("electric") || normalized.includes("battery")) {
    return "Electric Drive";
  }
  if (normalized.includes("petrol") || normalized.includes("gasoline") || normalized.includes("gas engine") || normalized.includes("honda gx")) {
    return "Gasoline Powertrain";
  }
  return "Diesel Powertrain";
};

const getProductHorsepower = (product: Product): number => {
  for (const spec of product.specs) {
    const val = spec.value;
    const match = val.match(/(\d+(?:\.\d+)?)\s*HP/i);
    if (match) {
      return parseFloat(match[1]);
    }
  }
  const text = product.description + " " + product.tagline;
  const match = text.match(/(\d+(?:\.\d+)?)\s*HP/i);
  if (match) {
    return parseFloat(match[1]);
  }
  return 0;
};

interface EquipmentSectionProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
}

const EquipmentSection: React.FC<EquipmentSectionProps> = ({ selectedCategory, setSelectedCategory }) => {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Lifted states for side filters
  const [priceMax, setPriceMax] = useState(69999);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);
  const [selectedHorsepower, setSelectedHorsepower] = useState<string | null>(null);

  const CATEGORY_LABELS = [
    "Skid Steer",
    "Mini Excavator",
    "Wheel Loader",
    "Backhoe Loader",
    "Dumper",
    "Trencher",
    "Towable Excavator",
    "Stone Crusher"
  ];

  const categoryValueMapping: { [key: string]: string } = {
    "Skid Steer": "skid-steer-loaders",
    "Mini Excavator": "mini-excavators",
    "Wheel Loader": "wheel-loaders",
    "Backhoe Loader": "backhoe-loaders",
    "Dumper": "dumpers",
    "Trencher": "trenchers",
    "Towable Excavator": "towable-excavators",
    "Stone Crusher": "stone-crushers"
  };

  const WEIGHT_FILTERS = ["1.0 - 2.5 Tons", "2.6 - 4.5 Tons", "4.6+ Tons"];

  const ENGINE_FILTERS = ["Diesel Powertrain", "Gasoline Powertrain", "Electric Drive"];

  const HORSEPOWER_FILTERS = ["Under 25 HP", "25 - 50 HP", "Over 50 HP"];

  const filteredList = EQUIPMENT_LIST
    .filter((e) => !query || e.name.toLowerCase().includes(query.toLowerCase()))
    .filter((e) => !selectedCategory || e.category === selectedCategory)
    .filter((e) => {
      const price = PRODUCT_PRICES[e.id] ?? 0;
      return price <= priceMax;
    })
    .filter((e) => {
      if (!selectedWeight) return true;
      const w = getProductWeightInTons(e);
      if (selectedWeight === "1.0 - 2.5 Tons") return w <= 2.5;
      if (selectedWeight === "2.6 - 4.5 Tons") return w > 2.5 && w <= 4.5;
      if (selectedWeight === "4.6+ Tons") return w > 4.5;
      return true;
    })
    .filter((e) => {
      if (!selectedEngine) return true;
      return getProductEngineType(e) === selectedEngine;
    })
    .filter((e) => {
      if (!selectedHorsepower) return true;
      const hp = getProductHorsepower(e);
      if (selectedHorsepower === "Under 25 HP") return hp < 25;
      if (selectedHorsepower === "25 - 50 HP") return hp >= 25 && hp <= 50;
      if (selectedHorsepower === "Over 50 HP") return hp > 50;
      return true;
    });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, query, priceMax, selectedWeight, selectedEngine, selectedHorsepower]);

  const PAGE_SIZE = 8;
  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  return (
    <section id="equipment-list-section" className="relative bg-theme-bg py-12 lg:py-20 overflow-hidden transition-colors duration-200">
      {/* Decorative polygon (desktop) */}
      <img
        src="/all-products/img/polygon.svg"
        alt=""
        aria-hidden="true"
        className="hidden lg:block absolute left-0 top-1/3 w-[260px] h-auto opacity-50 pointer-events-none dark:invert-0 invert"
      />

      <div className="max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10">
        <h2 className="text-center font-[Malking-Regular] text-theme-heading text-3xl sm:text-5xl lg:text-[75px] tracking-[-0.02em] uppercase">
          {t("equipment.equipments")}
        </h2>

        {/* Search + result count */}
        <div className="mt-8 lg:mt-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <form
            role="search"
            className="relative w-full lg:max-w-[443px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="eq-search" className="sr-only">{t("equipment.searchLabel")}</label>
            <input
              id="eq-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("equipment.searchPlaceholderShort")}
              className="w-full h-14 lg:h-16 border-4 border-theme-border/30 bg-theme-card text-theme-text font-googleSans text-lg lg:text-2xl px-5 pr-20 placeholder:text-theme-muted/70 focus:outline-none focus:border-theme-accent transition-colors"
            />
            <button
              type="submit"
              aria-label={t("action.searchEquipment")}
              className="absolute right-0 top-0 h-14 w-14 lg:h-16 lg:w-16 bg-theme-accent text-theme-bg flex items-center justify-center hover:bg-brand-green hover:text-white transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21L16.65 16.65" strokeLinecap="round" />
              </svg>
            </button>
          </form>
          <p className="font-clofie text-theme-text text-base lg:text-xl transition-colors">
            {t("equipment.resultSummary", { values: { count: filteredList.length } })}
          </p>
        </div>

        {/* Mobile filter toggle */}
        <div className="lg:hidden mt-4">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="w-full bg-theme-accent text-theme-bg font-googleSans font-bold py-3 flex items-center justify-center gap-2"
          >
            {filtersOpen ? t("action.hideFilters") : t("action.showFilters")}
            <span aria-hidden>{filtersOpen ? "▲" : "▼"}</span>
          </button>
        </div>

        <div className="mt-6 lg:mt-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-6 lg:gap-10">
          {/* Filters */}
          <aside
            aria-label={t("equipment.filters")}
            className={`flex flex-col gap-4 ${filtersOpen ? "block" : "hidden"} lg:flex`}
          >
            <FilterGroup
              title={t("equipment.categories")}
              options={CATEGORY_LABELS}
              translateOptions
              selectedOption={selectedCategory}
              onOptionSelect={setSelectedCategory}
              optionValueMapping={categoryValueMapping}
            />
            <PriceFilter value={priceMax} onChange={setPriceMax} />
            <FilterGroup
              title={t("equipment.operationWeight")}
              options={WEIGHT_FILTERS}
              selectedOption={selectedWeight}
              onOptionSelect={setSelectedWeight}
            />
            <FilterGroup
              title={t("equipment.engine")}
              options={ENGINE_FILTERS}
              selectedOption={selectedEngine}
              onOptionSelect={setSelectedEngine}
            />
            <FilterGroup
              title={t("equipment.horsepower")}
              options={HORSEPOWER_FILTERS}
              selectedOption={selectedHorsepower}
              onOptionSelect={setSelectedHorsepower}
            />
          </aside>

          {/* Grid */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 place-items-center">
              {filteredList.length === 0 ? (
                <div className="col-span-full py-16 text-center w-full bg-theme-sec border border-theme-border/10 rounded-xl px-4 animate-fade-in">
                  <p className="font-clofieBold text-2xl text-theme-accent mb-2">
                    {t("equipment.noMachineryFound", { fallback: "No products found" })}
                  </p>
                  <p className="font-glonimove text-sm text-theme-muted/60 max-w-md mx-auto">
                    {t("equipment.noMachineryText", { fallback: "Try adjusting your search filters or selected category." })}
                  </p>
                </div>
              ) : (
                paginatedList.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label={t("allProducts.pagination")}
                className="mt-10 flex items-center justify-center gap-2 flex-wrap"
              >
                {currentPage > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-label={t("product.prevPage", { fallback: "Previous page" })}
                    className="w-12 h-12 lg:w-14 lg:h-14 bg-theme-sec text-theme-text border border-theme-border/20 hover:bg-theme-accent/20 transition-colors text-xl rounded flex items-center justify-center cursor-pointer"
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
                      aria-label={t("product.page", { values: { page: n } })}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`w-12 h-12 lg:w-14 lg:h-14 font-googleSans font-bold text-xl rounded transition-colors cursor-pointer ${
                        isCurrent
                          ? "bg-[#153d28] text-white border border-[#153d28]"
                          : "bg-theme-sec text-theme-text border border-theme-border/20 hover:bg-theme-accent/20"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
                {currentPage < totalPages && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    aria-label={t("product.nextPage")}
                    className="w-12 h-12 lg:w-14 lg:h-14 bg-theme-accent text-theme-bg flex items-center justify-center hover:bg-brand-green hover:text-white transition-colors text-xl rounded border border-theme-accent cursor-pointer"
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
  );
};

const TestimonialsSection: React.FC = () => {
  const { t } = useI18n();

  const TESTIMONIALS = [
    {
      id: 1,
      bg: "bg-[#f3f3f4]",
      title: t("auto.allproducts.good.offer.dealer"),
      body: t("auto.allproducts.it.is.a"),
      author: t("auto.allproducts.jhon.mirkant"),
      role: "Manager",
      avatar: "/all-products/img/image-72.png",
    },
    {
      id: 2,
      bg: "bg-[#e2e2e2]",
      title: t("auto.allproducts.good.offer.dealer"),
      body: t("auto.allproducts.it.is.a"),
      author: t("auto.allproducts.jhon.mirkant"),
      role: "Manager",
      avatar: "/all-products/img/image-72.png",
    },
    {
      id: 3,
      bg: "bg-[#f3f3f4]",
      title: t("auto.allproducts.good.offer.dealer"),
      body: t("auto.allproducts.it.is.a"),
      author: t("auto.allproducts.jhon.mirkant"),
      role: "Manager",
      avatar: "/all-products/img/image-72.png",
    },
  ];

  return (
  <section
    aria-labelledby="ap-testimonials-heading"
    className="bg-theme-bg py-12 lg:py-20 transition-colors duration-200"
  >
    <div className="max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10">
      <h2
        id="ap-testimonials-heading"
        className="text-center font-[Malking-Regular] text-theme-heading text-3xl sm:text-5xl lg:text-[75px] xl:text-[90px] leading-tight"
      >
        {t("allProducts.testimonialsTitle")}
      </h2>
      <div className="mt-6 lg:mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="font-glonimove text-theme-text text-base sm:text-lg lg:text-2xl">
          {t("allProducts.reviewSummary")}
        </p>
        <img
          src="/all-products/img/group-29.png"
          alt={t("auto.allproducts.review.platform.rating")}
          className="h-7 lg:h-8 w-auto self-start sm:self-auto dark:opacity-100 opacity-80"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {TESTIMONIALS.map((testimonial, idx) => (
          <article
            key={testimonial.id}
            className={`${idx % 2 === 0 ? "bg-theme-card border-theme-border/20" : "bg-theme-sec border-theme-border/10"} border p-5 lg:p-6 flex gap-4 items-start rounded shadow-sm`}
          >
            <img
              src={testimonial.avatar}
              alt=""
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover bg-theme-border/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Stars filled={4} />
                <span className="font-[Outfit] text-theme-muted text-xs lg:text-sm">
                  {t("allProducts.reviewRating")}
                </span>
              </div>
              <h3 className="mt-2 font-[Outfit] font-bold text-theme-text text-base lg:text-lg">
                {testimonial.title}
              </h3>
              <p className="mt-1 font-[Outfit] text-theme-text text-sm lg:text-base leading-snug">
                {testimonial.body}
              </p>
              <p className="mt-2 font-[Outfit] text-theme-muted text-sm lg:text-base font-semibold">
                – {testimonial.author} · {testimonial.role}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
  );
};

const AppointmentCTA: React.FC = () => {
  const { t } = useI18n();

  return (
  <section className="relative bg-[#153d28] py-10 lg:py-12 overflow-hidden">
    <img
      src="/all-products/img/house.svg"
      alt=""
      aria-hidden="true"
      className="hidden lg:block absolute right-0 top-0 w-[260px] opacity-40 pointer-events-none"
    />
    <img
      src="/all-products/img/house-1.svg"
      alt=""
      aria-hidden="true"
      className="hidden lg:block absolute left-0 top-0 w-[200px] opacity-40 pointer-events-none"
    />

    <div className="relative max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6 lg:gap-16">
      <div className="flex items-center gap-5 lg:gap-8 justify-center lg:justify-start">
        <img
          src="/all-products/img/call.png"
          alt=""
          aria-hidden="true"
          className="w-16 h-16 lg:w-[98px] lg:h-[98px] object-contain"
        />
        <p className="font-[Readex_Pro] font-semibold text-2xl lg:text-4xl leading-tight">
          <span className="text-white">{t("allProducts.appointment")}</span>
          <br className="hidden sm:block" />
          <span className="text-white">{t("allProducts.thisCallNow")} </span>
          <a href="tel:+12132142203" className="text-[#d8c79a] underline">
            +1 213-214-2203
          </a>
        </p>
      </div>
      <a
        href="tel:+12132142203"
        aria-label={t("action.callUsNow")}
        className="self-center lg:self-auto flex items-center justify-center gap-3 border-4 border-solid border-[#d8c79a] text-[#d8c79a] hover:bg-[#d8c79a]/10 transition-colors h-[60px] lg:h-[75px] px-8 lg:px-10 [font-family:'Google_Sans_Flex',Helvetica] font-bold text-lg lg:text-xl btn rounded-[3px]"
      >
        {t("action.callUsNow")}
        <img
          className="w-[10px] h-[16px] object-contain"
          alt=""
          aria-hidden="true"
          src="/img/vector-9.svg"
        />
      </a>
    </div>
  </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────────────────── */

export const AllProducts = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <main className="bg-theme-bg text-theme-text transition-colors duration-200 pt-20 lg:pt-24">
      {/* Featured equipment showcase banner (8 category carousel) */}
      <EquipmentBanner />

      <BrandStrip />
      <BeforeAfterSection />
      <CategoriesSection selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <EquipmentSection selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <TestimonialsSection />
      <AppointmentCTA />
    </main>
  );
};

export default AllProducts;
