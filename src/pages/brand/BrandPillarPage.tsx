import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────────────
   Shared layout for the four brand-pillar detail pages:
   - Quality Equipment
   - Trusted Support
   - Job-Site Ready
   - Long-Term Value
────────────────────────────────────────────────────────────────────── */

export interface BrandPillarStat {
  value: string;
  label: string;
}

export interface BrandPillarBlock {
  /** Short uppercase number/letter shown in the green badge. */
  badge: string;
  title: string;
  body: string;
}

export interface BrandPillarPageProps {
  eyebrow: string;          // e.g. "Brand pillar"
  title: string;            // hero title
  intro: string;            // hero subtitle / 1–2 sentence intro
  heroImage: string;        // background image
  stats?: BrandPillarStat[]; // optional KPI row
  lead: string;             // longer intro paragraph
  blocks: BrandPillarBlock[]; // 3–4 content blocks
  callouts?: string[];      // optional bullet list (right column)
  ctaTitle?: string;
  ctaBody?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Tab/page title shown in the browser tab. */
  documentTitle: string;
  /** Meta description for SEO. */
  metaDescription: string;
}

const setMeta = (name: string, content: string) => {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

export const BrandPillarPage: React.FC<BrandPillarPageProps> = ({
  eyebrow,
  title,
  intro,
  heroImage,
  stats,
  lead,
  blocks,
  callouts,
  ctaTitle,
  ctaBody,
  primaryCta,
  secondaryCta,
  documentTitle,
  metaDescription,
}) => {
  const { t } = useI18n();
  const activeCtaTitle = ctaTitle ?? t("auto.brandpillarpage.ready.to.put");
  const activeCtaBody = ctaBody ?? t("auto.brandpillarpage.talk.to.our");
  const activePrimaryCta = primaryCta ?? { label: t("auto.brandpillarpage.view.equipment"), href: "/equipment/konstructz-machine" };
  const activeSecondaryCta = secondaryCta ?? { label: t("auto.brandpillarpage.request.a.quote"), href: "/contact" };

  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = documentTitle;
    setMeta("description", metaDescription);
    return () => {
      document.title = prev;
    };
  }, [documentTitle, metaDescription]);

  return (
    <main className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      {/* ─── Hero ─── */}
      <section
        aria-labelledby="pillar-hero-heading"
        className="relative isolate overflow-hidden bg-theme-sec transition-colors duration-200"
      >
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-theme-sec/30 via-theme-bg/85 to-theme-bg transition-colors duration-200"
        />

        <div className="relative max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 pt-32 lg:pt-40 pb-14 lg:pb-20">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 font-googleSans text-sm text-theme-muted"
          >
            <Link to="/" className="hover:text-theme-accent transition-colors">{t("auto.brandpillarpage.home")}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-theme-accent">{title}</span>
          </nav>
          <span className="inline-block font-googleSans font-bold text-[#68825B] text-xs uppercase tracking-[0.25em]">
            {eyebrow}
          </span>
          <h1
            id="pillar-hero-heading"
            className="mt-4 font-clofieBold text-theme-text text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] max-w-4xl transition-colors"
          >
            {title}
          </h1>
          <p className="mt-5 lg:mt-6 font-glonimove text-theme-text/90 text-lg sm:text-xl lg:text-2xl max-w-3xl leading-relaxed transition-colors">
            {intro}
          </p>

          <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              to={activePrimaryCta.href}
              className="inline-flex items-center justify-center gap-2 bg-[#d8c79a] text-[#153d28] hover:bg-[#68825B] hover:text-white transition-colors font-googleSans font-bold text-sm sm:text-base uppercase tracking-wider px-6 py-3.5 shadow-[3px_3px_0_rgba(0,0,0,0.25)] cursor-pointer"
            >
              {activePrimaryCta.label} →
            </Link>
            <Link
              to={activeSecondaryCta.href}
              className="inline-flex items-center justify-center gap-2 border-2 border-theme-border text-theme-text hover:bg-theme-border hover:text-theme-bg transition-colors font-googleSans font-bold text-sm sm:text-base uppercase tracking-wider px-6 py-3.5 cursor-pointer"
            >
              {activeSecondaryCta.label}
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d8c79a]/30 to-transparent"
        />
      </section>

      {/* ─── KPI stats strip (optional) ─── */}
      {stats && stats.length > 0 && (
        <section
          aria-label="Highlights"
          className="bg-theme-card border-y border-theme-border/20 transition-colors duration-200"
        >
          <div className="max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-[Cal_Sans] text-theme-heading text-3xl sm:text-4xl lg:text-5xl leading-tight transition-colors">
                  {s.value}
                </p>
                <p className="mt-1 font-googleSans text-theme-muted text-xs sm:text-sm uppercase tracking-wider transition-colors">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Lead + content blocks ─── */}
      <section className="bg-theme-bg py-12 lg:py-20 transition-colors duration-200">
        <div className="max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 lg:gap-14">
          {/* Left column — lead + blocks */}
          <div className="flex flex-col gap-10 lg:gap-12">
            <p className="font-glonimove text-theme-text/85 text-lg sm:text-xl leading-relaxed max-w-3xl transition-colors">
              {lead}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {blocks.map((b) => (
                <article
                  key={b.title}
                  className="bg-theme-card border border-theme-border/20 p-5 sm:p-6 lg:p-7 hover:border-theme-accent/50 transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center w-10 h-10 bg-[#153d28] text-[#d8c79a] font-[Cal_Sans] text-xl"
                  >
                    {b.badge}
                  </span>
                  <h2 className="mt-4 font-clofieBold text-theme-text text-xl sm:text-2xl leading-tight transition-colors">
                    {b.title}
                  </h2>
                  <p className="mt-3 font-glonimove text-theme-muted text-sm sm:text-base leading-relaxed transition-colors">
                    {b.body}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Right column — callouts + secondary CTA */}
          <aside className="flex flex-col gap-6 lg:gap-8 lg:sticky lg:top-32 self-start">
            {callouts && callouts.length > 0 && (
              <section
                aria-labelledby="what-you-get-heading"
                className="bg-[#153d28] text-white p-5 sm:p-6 lg:p-7"
              >
                <h2
                  id="what-you-get-heading"
                  className="font-clofieBold text-[#d8c79a] text-xl sm:text-2xl pb-3 border-b-2 border-[#d8c79a]/60"
                >{t("auto.brandpillarpage.what.you.get")}</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {callouts.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-3 font-glonimove text-white/90 text-sm sm:text-base leading-relaxed"
                    >
                      <svg
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#d8c79a"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-1 shrink-0"
                      >
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section
              aria-labelledby="pillar-cta-heading"
              className="bg-theme-card border border-theme-border/20 p-5 sm:p-6 lg:p-7 transition-colors duration-200"
            >
              <h2
                id="pillar-cta-heading"
                className="font-clofieBold text-theme-text text-xl sm:text-2xl transition-colors"
              >
                {activeCtaTitle}
              </h2>
              <p className="mt-3 font-glonimove text-theme-muted text-sm sm:text-base leading-relaxed transition-colors">
                {activeCtaBody}
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Link
                  to={activePrimaryCta.href}
                  className="inline-flex items-center justify-center gap-2 bg-[#d8c79a] text-[#153d28] hover:bg-[#68825B] hover:text-white transition-colors font-googleSans font-bold text-sm uppercase tracking-wider px-5 py-3 cursor-pointer"
                >
                  {activePrimaryCta.label} →
                </Link>
                <Link
                  to={activeSecondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 border-2 border-theme-border text-theme-text hover:bg-theme-border hover:text-theme-bg transition-colors font-googleSans font-bold text-sm uppercase tracking-wider px-5 py-3 cursor-pointer"
                >{activeSecondaryCta.label}</Link>
                <a
                  href="tel:+12132142203"
                  className="mt-1 text-center font-googleSans text-theme-muted hover:text-theme-accent transition-colors text-sm"
                >{t("auto.brandpillarpage.or.call.1")}</a>
              </div>
            </section>
          </aside>
        </div>
      </section>

      {/* ─── Final CTA band ─── */}
      <section className="relative bg-[#153d28] py-10 lg:py-12 overflow-hidden">
        <div className="relative max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6 lg:gap-16">
          <div className="flex items-center gap-5 lg:gap-8 justify-center lg:justify-start">
            <div className="w-14 h-14 lg:w-[70px] lg:h-[70px] rounded-full bg-[#d8c79a] flex items-center justify-center shrink-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#153d28" aria-hidden="true">
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15 15 0 0 1-6.59-6.59l2.2-2.2a1 1 0 0 0 .25-1.02A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1Z" />
              </svg>
            </div>
            <p className="font-readex font-semibold text-xl sm:text-2xl lg:text-3xl leading-snug">
              <span className="text-white">{t("auto.brandpillarpage.make.an.appointment")}</span>
              <br className="hidden sm:block" />
              <span className="text-white">Now </span>
              <a href="tel:+12132142203" className="text-[#d8c79a] underline whitespace-nowrap">
                +1 213-214-2203
              </a>
            </p>
          </div>
          <a
            href="tel:+12132142203"
            aria-label={t("auto.brandpillarpage.call.us.now")}
            className="self-center lg:self-auto inline-flex items-center justify-center gap-3 border-4 border-[#d8c79a] text-[#d8c79a] hover:bg-[#d8c79a] hover:text-[#153d28] transition-colors h-[56px] lg:h-[68px] px-8 lg:px-10 font-googleSans font-bold text-base lg:text-lg uppercase tracking-wider"
          >
            Call us now →
          </a>
        </div>
      </section>
    </main>
  );
};

export default BrandPillarPage;
