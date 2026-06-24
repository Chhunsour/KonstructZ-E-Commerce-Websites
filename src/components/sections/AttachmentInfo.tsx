import React, { useState } from "react";
import { Reveal } from "../Reveal";
import { Stagger } from "../Stagger";

export interface AttachmentFAQ {
  q: string;
  a: string;
}

export interface AttachmentInfoProps {
  scope: string; // e.g. "mini excavator", "skid steer loader"
  intro: string;
  benefits: string[];
  compatibility: string;
  faqs: AttachmentFAQ[];
}

export const AttachmentInfo: React.FC<AttachmentInfoProps> = ({
  scope,
  intro,
  benefits,
  compatibility,
  faqs,
}) => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="max-w-5xl mx-auto mt-16 space-y-12">
      <Reveal variant="rise">
        <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-wide text-brand-dark">
          Why the right attachment matters
        </h2>
        <div className="w-12 h-1 bg-brand-green mt-3 mb-5" />
        <p className="text-neutral-600 font-glonimove text-base leading-relaxed">
          {intro}
        </p>
      </Reveal>

      <Reveal variant="rise">
        <h3 className="text-xl md:text-2xl font-heading uppercase tracking-wide text-brand-dark">
          What Konstructz {scope} attachments give you
        </h3>
        <div className="w-12 h-1 bg-brand-green mt-3 mb-5" />
        <Stagger as="ul" step={70} className="grid sm:grid-cols-2 gap-3">
          {benefits.map((b, i) => (
            <Reveal
              key={i}
              as="span"
              variant="rise"
              className="flex gap-3 items-start bg-white border border-brand-green/10 rounded p-4 font-glonimove text-sm text-brand-dark k-hover-lift"
            >
              <span className="text-brand-green font-bold mt-0.5">›</span>
              <span>{b}</span>
            </Reveal>
          ))}
        </Stagger>
      </Reveal>

      <Reveal variant="rise">
        <h3 className="text-xl md:text-2xl font-heading uppercase tracking-wide text-brand-dark">
          Compatibility & fitment
        </h3>
        <div className="w-12 h-1 bg-brand-green mt-3 mb-5" />
        <p className="text-neutral-600 font-glonimove text-base leading-relaxed">
          {compatibility}
        </p>
      </Reveal>

      <Reveal variant="rise">
        <h3 className="text-xl md:text-2xl font-heading uppercase tracking-wide text-brand-dark">
          Frequently asked questions
        </h3>
        <div className="w-12 h-1 bg-brand-green mt-3 mb-5" />
        <div className="divide-y divide-brand-green/10 border border-brand-green/10 rounded overflow-hidden bg-white">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 font-googleSans font-bold text-sm md:text-base text-brand-dark hover:text-brand-green hover:bg-brand-green/5 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className={`text-brand-green text-xl leading-none transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 text-neutral-600 font-glonimove text-sm md:text-base leading-relaxed">
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

export default AttachmentInfo;
