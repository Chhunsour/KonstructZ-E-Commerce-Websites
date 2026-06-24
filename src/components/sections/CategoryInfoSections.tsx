import React, { useState } from "react";
import { Reveal } from "../Reveal";
import { Stagger } from "../Stagger";

export interface FAQItem {
  q: string;
  a: string;
}

export interface CategoryInfoSectionsProps {
  /** Plain category name used in copy, e.g. "Mini Excavator". */
  categoryName: string;
  /** Short answer: what the machine is used for. */
  usedForHeading?: string;
  usedFor: string;
  /** Who the machine is best for. */
  bestForHeading?: string;
  bestFor: string;
  /** Bulleted key benefits (no fake numbers). */
  benefits: string[];
  /** Applications / worksite use cases. */
  applications: string[];
  /** Compatibility / attachments paragraph (optional). */
  compatibility?: string;
  /** Maintenance & support paragraph. */
  maintenance?: string;
  /** Buyer's tips section. */
  buyingTips?: string[];
  /** FAQ list — short, direct answers help AEO/GEO ranking. */
  faqs: FAQItem[];
}

export const CategoryInfoSections: React.FC<CategoryInfoSectionsProps> = ({
  categoryName,
  usedForHeading,
  usedFor,
  bestForHeading,
  bestFor,
  benefits,
  applications,
  compatibility,
  maintenance,
  buyingTips,
  faqs,
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="mt-24 max-w-5xl mx-auto space-y-16">
      {/* What is this machine used for */}
      <Stagger as="div" step={120} className="grid md:grid-cols-2 gap-10 items-start">
        <Reveal variant="rise">
          <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-wide text-theme-heading">
            {usedForHeading ?? `What is a ${categoryName} used for?`}
          </h2>
          <div className="w-12 h-1 bg-theme-accent mt-3 mb-5" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">
            {usedFor}
          </p>
        </Reveal>
        <Reveal variant="rise">
          <h3 className="text-xl md:text-2xl font-heading uppercase tracking-wide text-theme-heading">
            {bestForHeading ?? `Who should choose a ${categoryName}?`}
          </h3>
          <div className="w-12 h-1 bg-theme-accent mt-3 mb-5" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">
            {bestFor}
          </p>
        </Reveal>
      </Stagger>

      {/* Key benefits */}
      <Reveal variant="rise">
        <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-wide text-theme-heading">
          Key benefits on the jobsite
        </h2>
        <div className="w-12 h-1 bg-theme-accent mt-3 mb-6" />
        <Stagger as="ul" step={70} className="grid sm:grid-cols-2 gap-4">
          {benefits.map((b, i) => (
            <Reveal key={i} as="span" variant="rise" className="flex gap-3 items-start bg-theme-card border border-theme-border/20 rounded p-4 font-glonimove text-sm text-theme-text k-hover-lift">
              <span className="text-theme-accent font-bold mt-0.5">›</span>
              <span>{b}</span>
            </Reveal>
          ))}
        </Stagger>
      </Reveal>

      {/* Applications */}
      <Reveal variant="rise">
        <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-wide text-theme-heading">
          Common applications
        </h2>
        <div className="w-12 h-1 bg-theme-accent mt-3 mb-6" />
        <Stagger as="div" step={40} className="flex flex-wrap gap-2">
          {applications.map((a, i) => (
            <Reveal
              key={i}
              as="span"
              variant="zoom"
              className="px-3 py-1.5 rounded-full bg-theme-sec border border-theme-border/20 text-theme-text font-googleSans text-xs uppercase tracking-wider transition-colors duration-200 hover:bg-theme-accent/15 hover:border-theme-accent/40 hover:text-theme-accent"
            >
              {a}
            </Reveal>
          ))}
        </Stagger>
      </Reveal>

      {/* Compatibility & maintenance */}
      {(compatibility || maintenance) && (
        <Stagger as="div" step={120} className="grid md:grid-cols-2 gap-10">
          {compatibility && (
            <Reveal variant="rise">
              <h2 className="text-xl md:text-2xl font-heading uppercase tracking-wide text-theme-heading">
                Attachment & worksite compatibility
              </h2>
              <div className="w-12 h-1 bg-theme-accent mt-3 mb-5" />
              <p className="text-theme-muted font-glonimove text-base leading-relaxed">
                {compatibility}
              </p>
            </Reveal>
          )}
          {maintenance && (
            <Reveal variant="rise">
              <h2 className="text-xl md:text-2xl font-heading uppercase tracking-wide text-theme-heading">
                Maintenance & support
              </h2>
              <div className="w-12 h-1 bg-theme-accent mt-3 mb-5" />
              <p className="text-theme-muted font-glonimove text-base leading-relaxed">
                {maintenance}
              </p>
            </Reveal>
          )}
        </Stagger>
      )}

      {/* Buying tips */}
      {buyingTips && buyingTips.length > 0 && (
        <Reveal variant="rise">
          <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-wide text-theme-heading">
            How to choose the right {categoryName.toLowerCase()}
          </h2>
          <div className="w-12 h-1 bg-theme-accent mt-3 mb-6" />
          <ol className="space-y-3 list-decimal pl-5 marker:text-theme-accent marker:font-bold font-glonimove text-base text-theme-text">
            {buyingTips.map((tip, i) => (
              <li key={i} className="leading-relaxed">{tip}</li>
            ))}
          </ol>
        </Reveal>
      )}

      {/* FAQ */}
      <Reveal variant="rise">
        <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-wide text-theme-heading">
          Frequently asked questions
        </h2>
        <div className="w-12 h-1 bg-theme-accent mt-3 mb-6" />
        <div className="divide-y divide-theme-border/20 border border-theme-border/20 rounded overflow-hidden bg-theme-card/30">
          {faqs.map((faq, i) => {
            const open = openIdx === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 font-googleSans font-bold text-sm md:text-base text-theme-text hover:text-theme-accent hover:bg-theme-accent/5 transition-colors"
                  aria-expanded={open}
                >
                  <span>{faq.q}</span>
                  <span className={`text-theme-accent text-xl leading-none transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 text-theme-muted font-glonimove text-sm md:text-base leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
};

export default CategoryInfoSections;
