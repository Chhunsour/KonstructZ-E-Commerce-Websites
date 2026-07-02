import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext";
import { useNoindexNotFound } from "../hooks/useNoindexNotFound";

/**
 * Catch-all 404 page. Rendered for any URL that matches no route so unknown
 * paths stop looking like the homepage to crawlers (see useNoindexNotFound).
 * Links out to the main site sections so visitors and crawlers both have a
 * way forward.
 */
export const NotFound: React.FC = () => {
  const { t } = useI18n();
  useNoindexNotFound(true);

  const destinations = [
    { label: t("nav.equipment", { fallback: "Equipment Categories" }), to: "/categories" },
    { label: t("nav.allEquipment", { fallback: "All Machines" }), to: "/equipment" },
    { label: t("nav.attachments", { fallback: "Attachments" }), to: "/attachments" },
    { label: t("auto.footer.blog.and.news", { fallback: "Blog & News" }), to: "/blog" },
    { label: t("nav.support", { fallback: "Support" }), to: "/support" },
    { label: t("auto.footer.contact.us", { fallback: "Contact Us" }), to: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center pt-32 pb-24 px-5">
      <div className="max-w-xl text-center">
        <p className="font-googleSans text-xs font-bold uppercase tracking-[0.22em] text-theme-accent">
          {t("notFound.kicker", { fallback: "404 — Page not found" })}
        </p>
        <h1 className="mt-3 font-heading uppercase tracking-wide text-3xl md:text-4xl text-theme-heading">
          {t("notFound.title", { fallback: "This page doesn't exist" })}
        </h1>
        <p className="mt-5 font-glonimove text-base leading-relaxed text-theme-muted">
          {t("notFound.desc", {
            fallback:
              "The link may be out of date or the page may have moved. Head back to the equipment catalog or pick a section below.",
          })}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {destinations.map((d) => (
            <Link
              key={d.to}
              to={d.to}
              className="inline-flex items-center border border-theme-border/30 px-5 py-2.5 font-googleSans text-sm font-bold uppercase tracking-wider text-theme-text hover:border-theme-accent hover:text-theme-accent transition-colors"
            >
              {d.label}
            </Link>
          ))}
        </div>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-theme-accent px-6 py-3 font-googleSans text-sm font-bold uppercase tracking-wider text-theme-bg hover:bg-brand-green hover:text-white transition-colors"
        >
          {t("notFound.backHome", { fallback: "Back to Homepage" })}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
