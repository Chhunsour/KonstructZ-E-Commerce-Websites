import { useI18n } from "../../context/I18nContext";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export const ContactCTA: React.FC = () => {
  const { t } = useI18n();
  return (
    <section className="bg-[#153d28] py-16 text-white relative overflow-hidden border-t border-brand-sand/20">
      {/* Decorative texture overlay mock */}
      <div className="absolute inset-0 z-0 opacity-15">
        <img
          src="https://c.animaapp.com/9h31joeZ/img/text.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          
          {/* Text block */}
          <div className="space-y-4">
            <span className="text-brand-sand text-xs uppercase tracking-widest font-googleSans font-bold block">{t("auto.contactcta.immediate.consultations")}</span>
            <h2 className="text-3xl md:text-5xl font-heading font-normal tracking-wide uppercase">{t("auto.contactcta.ready.to.discuss")}</h2>
            <p className="text-brand-beige/85 font-glonimove font-light text-base md:text-lg max-w-2xl leading-relaxed">
              Schedule an in-person viewing at our Commerce, California depot or arrange a virtual walkthrough. Call our direct line:{" "}
              <a
                href="tel:+12132142203"
                className="text-brand-sand hover:underline font-bold font-googleSans"
              >
                +1 213-214-2203
              </a>
            </p>
          </div>

          {/* Action triggers */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">
            <a href="tel:+12132142203" className="w-full sm:w-auto">
              <Button variant="filled" className="w-full sm:w-auto border-brand-sand bg-brand-sand text-brand-dark hover:bg-white hover:border-white">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.72 11.72 0 003.79.6 1 1 0 011 1v3.5a1 1 0 01-1 1A16 16 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.6 3.79 1 1 0 01-.27 1.11z" />
                  </svg>{t("auto.contactcta.call.us.now")}</span>
              </Button>
            </a>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="sand" className="w-full sm:w-auto">{t("auto.contactcta.request.a.quote")}</Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
