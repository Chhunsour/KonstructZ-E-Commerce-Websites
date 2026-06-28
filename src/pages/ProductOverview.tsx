import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  productCategories,
  getCategoryProductCount,
} from "../data/productCategories";
import { Reveal } from "../components/Reveal";
import { Stagger } from "../components/Stagger";
import { EquipmentBanner } from "../components/sections/EquipmentBanner";
import {
  BeforeAfterSection,
  EquipmentSection,
} from "./AllProductsPage/AllProducts";
import { useI18n } from "../context/I18nContext";

/**
 * Konstructz equipment category overview — /categories
 *
 * Premium WooCommerce-style category grid. Each of the 8 categories renders
 * as a large industrial tile with a real machine image, category icon, name,
 * short description, and product count.
 */
export const ProductOverview: React.FC = () => {
  const { t } = useI18n();
  // Shared category selection for the EQUIPMENTS filter grid below.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${t("equipment.title", { fallback: "Equipment Categories" })} | Konstructz`;
  }, [t]);

  return (
    <div className="bg-theme-bg text-theme-text transition-colors duration-200">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative overflow-hidden bg-[#0e0e0e] pt-32 lg:pt-40 pb-20 lg:pb-28">
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-[55%] w-[80%] max-w-[900px] h-[280px] bg-[#d8c79a]/10 rounded-[50%] blur-[120px] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <Reveal variant="rise">
            <p className="font-googleSans text-sm font-bold uppercase tracking-[0.28em] text-[#d8c79a]">
              {t("equipment.eyebrow", { fallback: "Konstructz Depot" })}
            </p>
            <h1 className="mt-5 font-heading uppercase tracking-wide text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
              {t("equipment.title", { fallback: "Equipment Categories" })}
            </h1>
            <div className="mt-6 h-1 w-16 bg-[#d8c79a] mx-auto" />
            <p className="mt-7 max-w-2xl mx-auto font-glonimove text-base sm:text-lg leading-relaxed text-white/75">
              {t("categories.subtitle", { fallback: "Eight machine types, configured for real worksites. Pick a category to see the available models, the jobs they handle, and how to spec the right one for your crew." })}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────── FEATURED MACHINE BANNER ─────────────── */}
      <EquipmentBanner />

      {/* ───────────────── CATEGORY TILES ───────────────── */}
      <section className="bg-theme-bg py-16 lg:py-24 transition-colors duration-200">
        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 lg:px-10">
          <Stagger
            as="div"
            step={90}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
          >
            {productCategories.map((category) => {
              const count = getCategoryProductCount(category);
              const hasModels = count > 0;
              const catName = t(`category.${category.slug}`, { fallback: category.name });
              return (
                <Reveal key={category.slug} variant="rise" className="h-full">
                  <Link
                    to={`/product/${category.slug}`}
                    className="k-card-hover group relative flex h-full flex-col overflow-hidden border border-theme-border/20 bg-theme-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-accent"
                  >
                    {/* Image */}
                    <div className="relative aspect-[5/4] overflow-hidden bg-theme-sec k-image-zoom">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-br from-theme-accent/10 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-50"
                      />
                      <img
                        src={category.heroImage}
                        alt={catName}
                        loading="lazy"
                        className="k-image absolute inset-0 m-auto h-[90%] w-[90%] object-contain"
                      />

                      {/* Product count badge */}
                      <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#153d28] text-[#d9d9d9] border border-[#d8c79a]/40 px-2.5 py-1 font-googleSans text-[10px] font-bold uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 bg-[#d8c79a]" />
                        {hasModels
                          ? t("categories.modelCount", { values: { count }, fallback: `${count} model(s)` })
                          : t("categories.newSeries", { fallback: "New series" })}
                      </span>

                      {/* Icon badge */}
                      <span className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center border border-theme-border/30 bg-theme-bg/85 backdrop-blur-sm">
                        <img
                          src={category.iconPath}
                          alt=""
                          aria-hidden="true"
                          className="h-7 w-7"
                        />
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-heading uppercase tracking-wide text-xl text-theme-heading group-hover:text-theme-accent transition-colors leading-tight">
                        {catName}
                      </h3>
                      <div className="mt-3 h-px w-8 bg-theme-accent/60" />
                      <p className="mt-3 font-glonimove text-sm leading-relaxed text-theme-muted line-clamp-3">
                        {t(`category.desc.${category.slug}`, { fallback: category.shortDescription })}
                      </p>

                      <div className="mt-auto pt-5 flex items-center justify-between gap-3 border-t border-theme-border/15">
                        <span className="font-googleSans text-[11px] font-bold uppercase tracking-[0.18em] text-theme-muted">
                          {t("categories.browseCategory", { values: { name: catName }, fallback: `Browse ${catName}` })}
                        </span>
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 items-center justify-center border border-theme-accent/50 bg-theme-accent/10 text-theme-accent transition-all duration-300 group-hover:bg-theme-accent group-hover:text-theme-bg group-hover:translate-x-1"
                        >
                          <svg width="12" height="9" viewBox="0 0 14 10" fill="none">
                            <path
                              d="M1 5h12m0 0L9 1m4 4l-4 4"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ─────────── BEFORE & AFTER + EQUIPMENTS FILTER GRID ─────────── */}
      <BeforeAfterSection />
      <EquipmentSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* ───────────────── INFO STRIP ───────────────── */}
      <section className="bg-theme-sec py-14 lg:py-20 border-y border-theme-border/15 transition-colors duration-200">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10">
          <Stagger as="div" step={100} className="grid sm:grid-cols-3 gap-5">
            {[
              {
                title: t("categories.info.1.title", { fallback: "Configured to your jobsite" }),
                body: t("categories.info.1.body", { fallback: "Every quote starts with access, ground type, attachments and transport — not a stock catalog number." }),
              },
              {
                title: t("categories.info.2.title", { fallback: "Real machine guidance" }),
                body: t("categories.info.2.body", { fallback: "The Konstructz team helps you size the machine to the work — not the other way around." }),
              },
              {
                title: t("categories.info.3.title", { fallback: "Support after the sale" }),
                body: t("categories.info.3.body", { fallback: "Maintenance schedules, parts lookups and operator guidance keep the machine productive past day one." }),
              },
            ].map((card, i) => (
              <Reveal key={i} variant="rise" className="h-full">
                <article className="k-card-hover h-full bg-theme-card border border-theme-border/20 p-6 flex flex-col gap-3">
                  <span className="font-googleSans text-[10px] font-bold uppercase tracking-[0.22em] text-theme-accent">
                    0{i + 1}
                  </span>
                  <h3 className="font-heading uppercase tracking-wide text-lg text-theme-heading leading-tight">
                    {card.title}
                  </h3>
                  <div className="h-px w-8 bg-theme-accent/60" />
                  <p className="font-glonimove text-sm leading-relaxed text-theme-muted">
                    {card.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <section className="relative bg-[#153d28] text-white overflow-hidden py-16 lg:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-[1080px] mx-auto px-5 sm:px-8 lg:px-10 grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <Reveal variant="left">
            <p className="font-googleSans text-xs font-bold uppercase tracking-[0.22em] text-[#d8c79a]">
              {t("categories.cta.pretitle", { fallback: "Not sure which machine fits?" })}
            </p>
            <h2 className="mt-3 font-heading uppercase tracking-wide text-3xl md:text-4xl text-white leading-[1.1]">
              {t("categories.cta.title", { fallback: "Talk to a Konstructz specialist." })}
            </h2>
            <p className="mt-5 font-glonimove text-base md:text-lg leading-relaxed text-white/75 max-w-xl">
              {t("categories.cta.body", { fallback: "Describe the work — access, ground, repeat tasks and transport — and the Konstructz team will recommend the right category and configuration." })}
            </p>
          </Reveal>
          <Reveal variant="right">
            <div className="flex flex-col gap-3">
              <Link
                to="/contact"
                className="k-btn-lift inline-flex items-center justify-center gap-2 bg-[#d8c79a] px-6 py-4 font-googleSans text-sm font-bold uppercase tracking-wider text-[#153d28] hover:bg-white transition-colors"
              >
                {t("action.getAQuote", { fallback: "Get a Quote" })}
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M1 5h12m0 0L9 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                to="/support/machine-guidance"
                className="k-btn-lift inline-flex items-center justify-center gap-2 border border-white/40 px-6 py-4 font-googleSans text-sm font-bold uppercase tracking-wider text-white hover:border-[#d8c79a] hover:text-[#d8c79a] transition-colors"
              >
                {t("auto.machineguidance.machine.guidance", { fallback: "Machine Guidance" })}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ProductOverview;
