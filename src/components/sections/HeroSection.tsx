import { useI18n } from "../../context/I18nContext";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export const HeroSection: React.FC = () => {
  const { t } = useI18n();
  return (
    <section className="relative min-h-[90vh] md:min-h-screen bg-brand-dark flex items-center overflow-hidden pt-24 md:pt-16">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://c.animaapp.com/9h31joeZ/img/chatgpt-image-jun-4--2026--08-09-21-am-1.png"
          alt={t("auto.hero.konstructz.heavy.machinery")}
          className="w-full h-full object-cover opacity-85 object-right lg:object-center"
        />
        {/* Dark overlay for text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/70 to-transparent" />
      </div>

      {/* Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text content */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-block border-2 border-brand-sand px-6 py-2.5 bg-brand-dark/60 backdrop-blur-sm">
              <span className="font-googleSans font-bold text-base md:text-lg tracking-wider text-brand-sand block uppercase">{t("auto.hero.premium.industrial.grade")}</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-normal text-transparent tracking-wide leading-tight drop-shadow-lg">
              <span className="text-white block">KONSTRUCTZ</span>
              <span className="text-brand-sand block">{t("auto.hero.stomp.v950")}</span>
            </h1>
            
            <p className="text-neutral-300 font-glonimove font-light text-lg md:text-xl max-w-xl leading-relaxed">{t("auto.hero.carving.a.new")}</p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/equipment">
                <Button variant="filled" className="w-full sm:w-auto">{t("auto.hero.explore.equipment")}</Button>
              </Link>
              <Link to="/contact">
                <Button variant="sand" className="w-full sm:w-auto">{t("auto.hero.get.a.quote")}</Button>
              </Link>
            </div>
          </div>

          {/* Empty column to keep text left-aligned while background machine shows on the right */}
          <div className="lg:col-span-5 hidden lg:block" />
        </div>
      </div>
    </section>
  );
};

