import { useI18n } from "../../context/I18nContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export const FeaturedProduct: React.FC = () => {
  const { t } = useI18n();
  const productInfo = {
    id: "stomp-v950",
    name: t("auto.featuredproduct.stomp.v950"),
    category: t("auto.featuredproduct.skid.steer.loader"),
    tagline: t("auto.featuredproduct.high.productivity.zero"),
    description:
      "The Konstructz STOMP V950 represents the pinnacle of compact earthmoving. Engineering with thick structural steel plate, dual-joystick controls, and high-flow auxiliary hydraulics, it performs where larger machines cannot. Adaptive cooling ensures reliable operations under demanding conditions.",
    specs: [
      { label: t("auto.featuredproduct.operating.capacity"), value: t("auto.featuredproduct.950.lbs") },
      { label: t("auto.featuredproduct.operating.weight"), value: t("auto.featuredproduct.3.280.lbs") },
      { label: "Engine", value: t("auto.featuredproduct.kubota.25hp.diesel") },
      { label: t("auto.featuredproduct.system.pressure"), value: t("auto.featuredproduct.3.000.psi") },
    ],
  };

  const images = [
    {
      src: "https://c.animaapp.com/9h31joeZ/img/change-the-aspect-ratio-to-202605291023-1.png",
      alt: t("auto.featuredproduct.stomp.v950.front"),
      label: t("auto.featuredproduct.front.profile"),
    },
    {
      src: "https://c.animaapp.com/9h31joeZ/img/remove-the-white-background-and-202605291020-1.png",
      alt: t("auto.featuredproduct.stomp.v950.side"),
      label: t("auto.featuredproduct.side.profile"),
    },
    {
      src: "https://c.animaapp.com/9h31joeZ/img/rectangle-9581.png",
      alt: t("auto.featuredproduct.stomp.v950.in"),
      label: t("auto.featuredproduct.action.view"),
    },
  ];

  const [activeImgIdx, setActiveImgIdx] = useState(0);

  return (
    <section className="bg-brand-dark py-24 border-b border-brand-green/20 relative text-white">
      {/* Decorative vectors from Anima */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-[300px] h-[300px]">
        <img src="https://c.animaapp.com/9h31joeZ/img/vector-1.svg" alt="" className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Gallery Showcase */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/3] bg-brand-dark/50 border border-brand-green/30 overflow-hidden rounded">
              <img
                src={images[activeImgIdx].src}
                alt={images[activeImgIdx].alt}
                className="w-full h-full object-contain p-4 md:p-8"
              />
              <span className="absolute bottom-4 left-4 bg-brand-dark/80 px-4 py-1.5 text-xs text-brand-sand uppercase tracking-wider font-googleSans">
                {images[activeImgIdx].label}
              </span>
            </div>

            {/* Thumbnail Selectors */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`aspect-[4/3] border-2 rounded overflow-hidden p-2 bg-brand-dark/30 transition-all ${
                    activeImgIdx === idx
                      ? "border-brand-sand shadow-lg scale-95"
                      : t("auto.featuredproduct.border.brand.green")
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info Specification */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-brand-sand text-sm uppercase tracking-widest font-googleSans font-bold block mb-2">{t("auto.featuredproduct.product.spotlight")}</span>
              <h2 className="text-3xl md:text-5xl font-heading font-normal text-white uppercase tracking-wide leading-none">
                {productInfo.name}
              </h2>
              <span className="text-xs uppercase tracking-widest font-googleSans text-brand-military font-bold block mt-2">
                Category: {productInfo.category}
              </span>
            </div>

            <p className="text-neutral-300 font-glonimove font-light leading-relaxed">
              {productInfo.description}
            </p>

            {/* Specs Table */}
            <div className="bg-brand-dark/50 border border-brand-green/20 p-6 rounded">
              <h3 className="font-googleSans font-bold text-brand-sand text-xs uppercase tracking-wider mb-4">{t("auto.featuredproduct.core.metrics")}</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-googleSans text-sm">
                {productInfo.specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col border-b border-neutral-700 pb-2">
                    <span className="text-neutral-400 text-xs">{spec.label}</span>
                    <span className="font-bold text-white mt-0.5">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to={`/equipment/${productInfo.id}`} className="w-full sm:w-auto">
                <Button variant="filled" className="w-full">{t("auto.featuredproduct.full.specifications")}</Button>
              </Link>
              <Link to={`/contact?product=${productInfo.id}`} className="w-full sm:w-auto">
                <Button variant="sand" className="w-full">{t("auto.featuredproduct.request.pricing")}</Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
