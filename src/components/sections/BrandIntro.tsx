import { useI18n } from "../../context/I18nContext";
import React from "react";

export const BrandIntro: React.FC = () => {
  const { t } = useI18n();
  const stats = [
    { value: "100%", label: t("auto.brandintro.heavy.steel.build") },
    { value: "48hr", label: t("auto.brandintro.parts.dispatch") },
    { value: "US", label: t("auto.brandintro.based.logistics") },
  ];

  const galleryImages = [
    {
      src: "https://c.animaapp.com/9h31joeZ/img/factory-with-machines-machinery-inside-it-1.png",
      alt: "Konstructz high-tech fabrication factory interior",
    },
    {
      src: "https://c.animaapp.com/9h31joeZ/img/engineer-provides-technical-support-via-headset-solar-panel-fact-1.png",
      alt: t("auto.brandintro.konstructz.engineering.support"),
    },
    {
      src: "https://c.animaapp.com/9h31joeZ/img/male-worker-factory-1.png",
      alt: t("auto.brandintro.assembly.technician.inspecting"),
    },
  ];

  return (
    <section className="bg-brand-dark py-20 border-b border-brand-green/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Statement Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6 mb-16">
          <span className="text-brand-sand text-sm uppercase tracking-widest font-googleSans font-bold">{t("auto.brandintro.engineering.excellence")}</span>
          <h2 className="text-3xl md:text-5xl font-heading font-normal text-white uppercase tracking-wide leading-tight">
            KONSTRUCTZ IS BUILT FOR ONE PURPOSE:
            <span className="block text-brand-sand mt-2">{t("auto.brandintro.to.move.serious")}</span>
          </h2>
          <div className="w-24 h-1 bg-brand-green mx-auto my-4" />
          <p className="text-neutral-400 font-glonimove font-light text-base md:text-lg">{t("auto.brandintro.we.bypass.delicate")}</p>
        </div>

        {/* Brand Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="bg-brand-dark/40 border border-brand-green/10 p-8 text-center rounded">
              <span className="block text-4xl md:text-5xl font-heading text-brand-sand mb-2">
                {stat.value}
              </span>
              <span className="block text-xs uppercase tracking-widest font-googleSans text-neutral-400 font-bold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Industrial Image Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryImages.map((image, idx) => (
            <div
              key={idx}
              className="relative group aspect-[16/9] rounded-lg overflow-hidden border border-brand-green/10"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
