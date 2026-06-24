import { useI18n } from "../../context/I18nContext";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export const WhyChooseUs: React.FC = () => {
  const { t } = useI18n();
  const points = [
    {
      title: t("auto.whychooseus.secure.ca.warehouse"),
      desc: t("auto.whychooseus.our.facility.in"),
      icon: "🏢",
    },
    {
      title: t("auto.whychooseus.direct.engineering.support"),
      desc: t("auto.whychooseus.no.middlemen.speak"),
      icon: "🛠️",
    },
    {
      title: t("auto.whychooseus.job.site.readiness"),
      desc: t("auto.whychooseus.every.product.is"),
      icon: "🏗️",
    },
  ];

  return (
    <section className="bg-brand-beige/20 py-24 relative border-b border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Side */}
          <div className="lg:col-span-5 relative space-y-6">
            <div className="relative rounded-lg overflow-hidden border border-brand-green/20">
              <img
                src="https://c.animaapp.com/9h31joeZ/img/chatgpt-image-jun-5--2026--08-50-16-am--1--1.png"
                alt={t("auto.whychooseus.konstructz.commerce.california")}
                className="w-full h-auto object-cover rounded-lg shadow-xl"
                loading="lazy"
              />
            </div>
            
            {/* Highlight bubble */}
            <div className="bg-brand-greenDark border-2 border-brand-sand text-brand-sand p-6 rounded shadow-lg">
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-1">{t("auto.whychooseus.active.depot")}</h3>
              <p className="font-glonimove text-xs text-brand-beige leading-relaxed">{t("auto.whychooseus.commerce.california.serving")}</p>
            </div>
          </div>

          {/* Text Side */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-brand-green text-sm uppercase tracking-widest font-googleSans font-bold block mb-2">{t("auto.whychooseus.operational.backbone")}</span>
              <h2 className="text-3xl md:text-5xl font-heading font-normal text-brand-dark uppercase tracking-wide leading-tight">{t("auto.whychooseus.why.choose.konstructz")}</h2>
              <div className="w-16 h-1 bg-brand-green mt-3" />
            </div>

            <p className="text-neutral-600 font-glonimove font-light leading-relaxed">{t("auto.whychooseus.we.understand.that")}</p>

            <div className="space-y-6">
              {points.map((point, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span className="text-3xl p-2 bg-white rounded border border-brand-green/10 shadow-sm shrink-0">
                    {point.icon}
                  </span>
                  <div>
                    <h3 className="font-googleSans font-bold text-brand-dark text-base uppercase">
                      {point.title}
                    </h3>
                    <p className="text-neutral-500 font-glonimove text-sm mt-1">
                      {point.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link to="/about" className="inline-block">
                <Button variant="outline">{t("auto.whychooseus.learn.more.about")}</Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
