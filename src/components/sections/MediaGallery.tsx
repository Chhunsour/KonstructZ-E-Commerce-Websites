import { useI18n } from "../../context/I18nContext";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export const MediaGallery: React.FC = () => {
  const { t } = useI18n();
  const galleryItems = [
    {
      src: "https://c.animaapp.com/9h31joeZ/img/machine-with-large-number-machines-background-1.png",
      alt: t("auto.mediagallery.konstructz.heavy.excavator"),
      tag: "Earthmoving",
      isVideo: true,
    },
    {
      src: "https://c.animaapp.com/9h31joeZ/img/chatgpt-image-jun-5--2026--08-50-16-am--1--1.png",
      alt: t("auto.mediagallery.konstructz.wheel.loader"),
      tag: "Logistics",
      isVideo: false,
    },
    {
      src: "https://c.animaapp.com/9h31joeZ/img/skoop-png-4.png",
      alt: t("auto.mediagallery.stomp.v980.clearing"),
      tag: "Landscaping",
      isVideo: true,
    },
    {
      src: "https://c.animaapp.com/9h31joeZ/img/new-project--23--3.png",
      alt: t("auto.mediagallery.heavy.duty.stone"),
      tag: "Recycling",
      isVideo: false,
    },
  ];

  return (
    <section className="bg-brand-dark py-24 border-b border-brand-green/20 relative text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-brand-sand text-sm uppercase tracking-widest font-googleSans font-bold block mb-2">{t("auto.mediagallery.action.reels")}</span>
            <h2 className="text-3xl md:text-5xl font-heading font-normal text-white uppercase tracking-wide">{t("auto.mediagallery.cinematic.showcase")}</h2>
          </div>
          <p className="max-w-md text-neutral-400 font-glonimove text-sm leading-relaxed">
            See Konstructz heavy equipment in motion. High-definition field reviews, stress testing, and specifications walkthroughs.
          </p>
        </div>

        {/* Video & Photo Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="relative aspect-[16/9] rounded-lg overflow-hidden group border border-brand-green/10"
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-75 group-hover:opacity-60 transition-opacity duration-300" />

              {/* Tag & Title */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                <div>
                  <span className="bg-brand-greenDark/80 border border-brand-sand/20 text-brand-sand text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                    {item.tag}
                  </span>
                  <p className="text-sm font-glonimove mt-3 text-neutral-200 line-clamp-1 max-w-[80%]">
                    {item.alt}
                  </p>
                </div>

                {/* Video Play indicator */}
                {item.isVideo && (
                  <div className="w-12 h-12 bg-brand-sand/90 hover:bg-brand-sand text-brand-dark flex items-center justify-center rounded-full shadow-lg transform group-hover:scale-110 transition-all cursor-pointer">
                    <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <Link to="/blog" className="inline-block">
            <Button variant="sand">{t("auto.mediagallery.launch.media.center")}</Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
