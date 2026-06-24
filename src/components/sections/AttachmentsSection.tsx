import { useI18n } from "../../context/I18nContext";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export const AttachmentsSection: React.FC = () => {
  const { t } = useI18n();
  const attachmentFeatures = [
    {
      title: t("auto.attachments.planetary.augers"),
      desc: t("auto.attachments.extreme.torque.drilling"),
    },
    {
      title: t("auto.attachments.hydraulic.breakers"),
      desc: "High-impact hammers developed to pulverize concrete, stone, and asphalt on-site.",
    },
    {
      title: t("auto.attachments.material.buckets"),
      desc: "Reinforced wear strips and high-capacity bowls for severe sand and aggregate hauling.",
    },
    {
      title: t("auto.attachments.hydraulic.thumbs"),
      desc: t("auto.attachments.adds.pinch.control"),
    },
  ];

  return (
    <section className="bg-white py-24 relative border-b border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Info Side */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <div>
              <span className="text-brand-green text-sm uppercase tracking-widest font-googleSans font-bold block mb-2">{t("auto.attachments.versatility.engineered")}</span>
              <h2 className="text-3xl md:text-5xl font-heading font-normal text-brand-dark uppercase tracking-wide">{t("auto.attachments.machinery.attachments")}</h2>
            </div>
            
            <p className="text-neutral-600 font-glonimove font-light text-base leading-relaxed">{t("auto.attachments.every.konstructz.machine")}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {attachmentFeatures.map((item, idx) => (
                <div key={idx} className="border-l-4 border-brand-green pl-4">
                  <h3 className="font-googleSans font-bold text-brand-dark text-base uppercase">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 font-glonimove text-xs mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Link to="/attachments" className="inline-block">
                <Button variant="outline">{t("auto.attachments.explore.attachments")}</Button>
              </Link>
            </div>
          </div>

          {/* Visual Side */}
          <div className="lg:col-span-5 relative flex justify-center order-1 lg:order-2">
            <div className="absolute inset-0 bg-brand-beige/20 rounded-full blur-[80px]" />
            <div className="relative border-4 border-brand-green/20 p-4 rounded bg-brand-beige/10">
              <img
                src="https://c.animaapp.com/9h31joeZ/img/new-project--19--3@2x.png"
                alt={t("auto.attachments.konstructz.heavy.planetary")}
                className="w-full max-w-[380px] h-auto object-contain drop-shadow-xl"
                loading="lazy"
              />
              <span className="absolute top-4 right-4 bg-brand-greenDark text-brand-sand font-googleSans text-xs font-bold px-3 py-1 uppercase tracking-wider rounded">
                Model: A-200 Planetary
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
