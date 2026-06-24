import { useI18n } from "../../context/I18nContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Icons — minimal line icons, inherit currentColor                    */
/* ------------------------------------------------------------------ */

type IconProps = { className?: string };
const base = "w-full h-full";

export const Icons: Record<string, React.FC<IconProps>> = {
  order: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 3h6a1 1 0 0 1 1 1v1h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2V4a1 1 0 0 1 1-1z" />
      <path d="M9 5h6" /><path d="M8 11h8" /><path d="M8 15h5" />
    </svg>
  ),
  shipping: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h11v9H3z" /><path d="M14 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" />
    </svg>
  ),
  warranty: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  machine: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 17h9v-4l4-1 3 4v2" /><circle cx="7" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" />
      <path d="M6 13V7l4 2" /><path d="M13 13V9" />
    </svg>
  ),
  attachments: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 4l6 6-3 3-1-1-3 3 1 1-4 4-5-5 4-4 1 1 3-3-1-1z" />
    </svg>
  ),
  contact: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 12a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-1v-6h3" />
      <path d="M4 12v5a2 2 0 0 0 2 2h1v-6H4" />
    </svg>
  ),
  track: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  phone: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 4h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  ),
  mail: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3 7l9 6 9-6" />
    </svg>
  ),
  clock: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  ),
  search: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  wrench: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 6.5a3.5 3.5 0 0 1-4.6 4.6L5 16l3 3 4.9-4.9a3.5 3.5 0 0 0 4.6-4.6l-2 2-2-1-1-2z" />
    </svg>
  ),
  card: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /><path d="M7 15h4" />
    </svg>
  ),
  doc: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><path d="M9 12h6" /><path d="M9 16h6" />
    </svg>
  ),
  arrow: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
    </svg>
  ),
  shield: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
    </svg>
  ),
  truck: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="11" height="9" rx="1" />
      <path d="M13 10h5l3 4v2h-8z" />
      <circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" />
    </svg>
  ),
  warning: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l10 17H2z" />
      <path d="M12 10v4" /><circle cx="12" cy="17" r="0.6" fill="currentColor" />
    </svg>
  ),
  info: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v0.5M12 11v5" />
    </svg>
  ),
  check: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
  cross: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  gauge: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 14a9 9 0 1 1 18 0" />
      <path d="M12 14l4-4" /><circle cx="12" cy="14" r="1" fill="currentColor" />
    </svg>
  ),
  lightning: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
    </svg>
  ),
  globe: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
  bolt: ({ className = base }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/* Section label (small uppercase eyebrow)                            */
/* ------------------------------------------------------------------ */

export const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <span className={`inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.25em] font-googleSans font-bold transition-colors ${light ? "text-white" : "text-theme-accent"}`}>
    <span className="w-6 h-px bg-current opacity-60" />
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* Hero — dark industrial banner with blended machinery image          */
/* ------------------------------------------------------------------ */

export const SupportHero: React.FC<{
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  image: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
  tall?: boolean;
}> = ({ eyebrow, title, description, image, primary, secondary, tall }) => (
  <section
    className={`relative w-full overflow-hidden bg-theme-bg ${tall ? "min-h-[88vh]" : "min-h-[60vh]"} flex items-center transition-colors duration-200`}
  >
    {/* machinery image */}
    <div className="absolute inset-0">
      <img src={image} alt="" className="w-full h-full object-cover opacity-20 dark:opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-theme-bg via-theme-bg/85 to-theme-bg/30 transition-colors" />
      <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-transparent to-theme-bg/60 transition-colors" />
      {/* desert dust glow */}
      <div className="absolute -bottom-32 right-0 w-[600px] h-[600px] rounded-full bg-theme-accent/10 blur-[160px] transition-colors" />
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] rounded-full bg-theme-accent/5 blur-[150px] transition-colors" />
    </div>

    <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full pt-36 pb-20">
      <div className="max-w-3xl space-y-6">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading uppercase tracking-wide text-theme-heading leading-[1.05] transition-colors">
          {title}
        </h1>
        <p className="text-theme-muted font-glonimove text-base sm:text-lg leading-relaxed max-w-2xl transition-colors">
          {description}
        </p>
        {(primary || secondary) && (
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {primary && (
              <Link
                to={primary.to}
                className="inline-flex items-center justify-center gap-2 bg-theme-accent hover:bg-brand-green text-theme-bg font-googleSans font-bold text-sm uppercase tracking-wider px-7 py-4 transition-colors duration-300 border-2 border-theme-accent hover:border-brand-green"
              >
                {primary.label}
                <span className="w-4 h-4"><Icons.arrow /></span>
              </Link>
            )}
            {secondary && (
              <Link
                to={secondary.to}
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-theme-text/10 text-theme-text font-googleSans font-bold text-sm uppercase tracking-wider px-7 py-4 transition-colors duration-300 border-2 border-theme-text/40 hover:border-theme-text"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Section heading block                                              */
/* ------------------------------------------------------------------ */

export const SectionHeading: React.FC<{
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
  center?: boolean;
}> = ({ eyebrow, title, description, light, center = true }) => (
  <div className={`space-y-4 ${center ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}`}>
    <Eyebrow light={light}>{eyebrow}</Eyebrow>
    <h2 className="text-3xl sm:text-4xl font-heading uppercase tracking-wide text-theme-heading transition-colors">
      {title}
    </h2>
    {description && (
      <p className={`font-glonimove text-base leading-relaxed text-theme-muted transition-colors ${center ? "mx-auto" : ""}`}>
        {description}
      </p>
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/* FAQ accordion                                                      */
/* ------------------------------------------------------------------ */

export const FAQAccordion: React.FC<{ items: { q: string; a: string }[]; light?: boolean }> = ({ items, light: _light }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto divide-y divide-theme-border/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`border border-theme-border/20 bg-theme-card mb-3 transition-colors duration-200 ${isOpen ? "border-theme-accent/60 shadow-sm" : ""}`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-5"
            >
              <span className="font-googleSans font-bold text-base sm:text-lg text-theme-text transition-colors">
                {item.q}
              </span>
              <span
                className={`shrink-0 w-7 h-7 flex items-center justify-center border border-theme-accent/40 text-theme-accent transition-all duration-300 ${isOpen ? "rotate-45" : ""}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60" : "max-h-0"}`}>
              <p className="px-5 sm:px-6 pb-5 font-glonimove text-sm leading-relaxed text-theme-muted transition-colors">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* CTA banner                                                         */
/* ------------------------------------------------------------------ */

export const SupportCTA: React.FC<{
  heading: string;
  description: string;
  image: string;
  primary?: { label: string; to: string };
  secondaryTel?: { label: string; tel: string };
}> = ({ heading, description, image, primary, secondaryTel }) => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={image} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#171A16]/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#153d28]/80 to-transparent" />
    </div>
    <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-28 text-center space-y-6">
      <h2 className="text-3xl sm:text-5xl font-heading uppercase tracking-wide text-white">{heading}</h2>
      <p className="text-neutral-300 font-glonimove text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        {primary && (
          <Link
            to={primary.to}
            className="inline-flex items-center justify-center gap-2 bg-brand-military hover:bg-brand-sand text-[#171A16] font-googleSans font-bold text-sm uppercase tracking-wider px-8 py-4 transition-colors duration-300 border-2 border-brand-military hover:border-brand-sand"
          >
            {primary.label}
            <span className="w-4 h-4"><Icons.arrow /></span>
          </Link>
        )}
        {secondaryTel && (
          <a
            href={`tel:${secondaryTel.tel}`}
            className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-googleSans font-bold text-sm uppercase tracking-wider px-8 py-4 transition-colors duration-300 border-2 border-brand-sand/50 hover:border-brand-sand"
          >
            <span className="w-4 h-4"><Icons.phone /></span>
            {secondaryTel.label}
          </a>
        )}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Info card (icon + title + text), optional link                     */
/* ------------------------------------------------------------------ */

export const InfoCard: React.FC<{
  icon: React.FC<IconProps>;
  title: string;
  desc: string;
  to?: string;
}> = ({ icon: Icon, title, desc, to }) => {
  const { t } = useI18n();
  const inner = (
    <div className="group relative h-full bg-theme-card border border-theme-border/10 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-theme-accent hover:shadow-[0_20px_40px_-15px_rgba(104,130,91,0.3)]">
      <div className="w-14 h-14 flex items-center justify-center border border-theme-accent/40 text-theme-accent mb-6 transition-colors group-hover:border-theme-accent group-hover:bg-theme-accent/10">
        <span className="w-7 h-7"><Icon /></span>
      </div>
      <h3 className="font-googleSans font-bold text-lg text-theme-text uppercase tracking-wide mb-3 transition-colors">{title}</h3>
      <p className="font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">{desc}</p>
      {to && (
        <span className="mt-6 inline-flex items-center gap-2 text-theme-accent text-sm font-googleSans font-bold uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">{t("auto.supportkit.learn.more")}<span className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"><Icons.arrow /></span>
        </span>
      )}
    </div>
  );
  return to ? (
    <Link to={to} className="block h-full">{inner}</Link>
  ) : (
    inner
  );
};

/* ------------------------------------------------------------------ */
/* Reusable feature block — image + bullet text (alternating)          */
/* ------------------------------------------------------------------ */

export const FeatureSplit: React.FC<{
  eyebrow: string;
  title: string;
  body: string;
  points?: string[];
  image: string;
  reverse?: boolean;
}> = ({ eyebrow, title, body, points, image, reverse }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
    <div className={`space-y-5 ${reverse ? "lg:order-2" : ""}`}>
      <Eyebrow light>{eyebrow}</Eyebrow>
      <h2 className="text-3xl sm:text-4xl font-heading uppercase tracking-wide text-theme-heading transition-colors">{title}</h2>
      <p className="font-glonimove text-theme-muted leading-relaxed transition-colors">{body}</p>
      {points && (
        <ul className="space-y-3 pt-2">
          {points.map((p, i) => (
            <li key={i} className="flex items-start gap-3 font-glonimove text-theme-text text-sm leading-relaxed transition-colors">
              <span className="mt-1 shrink-0 w-5 h-5 flex items-center justify-center bg-theme-accent/15 text-theme-accent transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className={`relative ${reverse ? "lg:order-1" : ""}`}>
      <div className="relative border-4 border-theme-accent/20 overflow-hidden bg-theme-sec transition-colors">
        <img src={image} alt={title} className="w-full h-72 sm:h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-bg/30 to-transparent transition-colors" />
      </div>
      <div className="absolute -bottom-4 -right-4 w-20 h-20 border-r-4 border-b-4 border-theme-accent hidden sm:block transition-colors" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Numbered process steps                                              */
/* ------------------------------------------------------------------ */

export const ProcessSteps: React.FC<{ steps: { title: string; desc: string }[] }> = ({ steps }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {steps.map((s, i) => (
      <div key={i} className="relative bg-theme-card border border-theme-border/10 p-6 hover:border-theme-accent transition-colors duration-200">
        <span className="block font-heading text-5xl text-theme-accent/30 mb-3 transition-colors">{String(i + 1).padStart(2, "0")}</span>
        <h3 className="font-googleSans font-bold text-theme-text uppercase text-base tracking-wide mb-2 transition-colors">{s.title}</h3>
        <p className="font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">{s.desc}</p>
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Stat grid — big numbers with labels                                */
/* ------------------------------------------------------------------ */

export const StatGrid: React.FC<{
  stats: { value: string; label: string; sub?: string }[];
}> = ({ stats }) => (
  <div className={`grid gap-px bg-theme-border/30 border border-theme-border/30 ${stats.length === 4 ? "grid-cols-2 lg:grid-cols-4" : stats.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
    {stats.map((s, i) => (
      <div key={i} className="bg-theme-card px-5 sm:px-7 py-7 sm:py-9 text-center transition-colors duration-200">
        <div className="font-heading text-4xl sm:text-5xl text-theme-accent leading-none mb-3">{s.value}</div>
        <div className="font-googleSans font-bold uppercase tracking-wide text-xs sm:text-sm text-theme-text mb-1">{s.label}</div>
        {s.sub && (
          <div className="font-glonimove text-xs text-theme-muted leading-relaxed">{s.sub}</div>
        )}
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Vertical timeline — for detailed multi-step processes              */
/* ------------------------------------------------------------------ */

export const Timeline: React.FC<{
  items: { title: string; desc: string; icon?: React.FC<IconProps> }[];
}> = ({ items }) => (
  <ol className="relative max-w-3xl mx-auto">
    <div className="absolute left-[19px] top-3 bottom-3 w-px bg-theme-accent/30" aria-hidden="true" />
    {items.map((item, i) => {
      const Icon = item.icon;
      return (
        <li key={i} className="relative pl-14 pb-10 last:pb-0">
          <span className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center rounded-full bg-theme-bg border-2 border-theme-accent text-theme-accent font-googleSans font-bold text-sm transition-colors">
            {Icon ? <span className="w-5 h-5"><Icon /></span> : String(i + 1).padStart(2, "0")}
          </span>
          <div className="space-y-2">
            <h3 className="font-googleSans font-bold uppercase tracking-wide text-theme-text text-base sm:text-lg transition-colors">{item.title}</h3>
            <p className="font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">{item.desc}</p>
          </div>
        </li>
      );
    })}
  </ol>
);

/* ------------------------------------------------------------------ */
/* Callout — info, warning, success                                   */
/* ------------------------------------------------------------------ */

export const Callout: React.FC<{
  tone?: "info" | "warning" | "success";
  title: string;
  body: string;
}> = ({ tone = "info", title, body }) => {
  const Icon = tone === "warning" ? Icons.warning : tone === "success" ? Icons.check : Icons.info;
  const accent =
    tone === "warning"
      ? "border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400"
      : tone === "success"
      ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
      : "border-theme-accent/40 bg-theme-accent/5 text-theme-accent";
  return (
    <div className={`flex items-start gap-4 border-l-4 px-5 sm:px-6 py-5 ${accent}`}>
      <span className="w-6 h-6 shrink-0 mt-0.5"><Icon /></span>
      <div className="space-y-1">
        <h4 className="font-googleSans font-bold uppercase tracking-wide text-sm text-theme-text transition-colors">{title}</h4>
        <p className="font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">{body}</p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Two-column comparison list — "Included / Not included"              */
/* ------------------------------------------------------------------ */

export const TwoColumnList: React.FC<{
  left: { title: string; items: string[] };
  right: { title: string; items: string[] };
}> = ({ left, right }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      { col: left, positive: true },
      { col: right, positive: false },
    ].map(({ col, positive }, idx) => (
      <div
        key={idx}
        className={`border bg-theme-card p-7 transition-colors duration-200 ${positive ? "border-theme-accent/40" : "border-theme-border/20"}`}
      >
        <div className="flex items-center gap-3 mb-5">
          <span className={`w-9 h-9 flex items-center justify-center ${positive ? "bg-theme-accent/15 text-theme-accent" : "bg-theme-border/15 text-theme-muted"}`}>
            <span className="w-5 h-5">{positive ? <Icons.check /> : <Icons.cross />}</span>
          </span>
          <h3 className="font-googleSans font-bold uppercase tracking-wide text-theme-text">{col.title}</h3>
        </div>
        <ul className="space-y-3">
          {col.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">
              <span className={`mt-1 shrink-0 w-4 h-4 ${positive ? "text-theme-accent" : "text-theme-muted/60"}`}>
                {positive ? <Icons.check /> : <Icons.cross />}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Pillar — large image + content row, alternating                    */
/* ------------------------------------------------------------------ */

export const Pillar: React.FC<{
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
  image: string;
  badge?: string;
  reverse?: boolean;
}> = ({ eyebrow, title, body, bullets, image, badge, reverse }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
    <div className={`lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}>
      <div className="relative border-4 border-theme-accent/20 overflow-hidden bg-theme-sec">
        <img src={image} alt={title} className="w-full h-72 sm:h-[28rem] object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-tr from-theme-bg/40 via-transparent to-transparent" />
        {badge && (
          <span className="absolute bottom-5 left-5 inline-flex items-center bg-theme-bg/85 backdrop-blur-sm border border-theme-accent/40 px-4 py-2 font-googleSans font-bold text-xs uppercase tracking-wider text-theme-accent">
            {badge}
          </span>
        )}
      </div>
      <div className={`absolute hidden sm:block w-20 h-20 border-theme-accent ${reverse ? "" : ""}`} />
    </div>
    <div className={`lg:col-span-5 space-y-5 ${reverse ? "lg:order-1" : ""}`}>
      <Eyebrow light>{eyebrow}</Eyebrow>
      <h2 className="text-3xl sm:text-4xl font-heading uppercase tracking-wide text-theme-heading leading-tight transition-colors">{title}</h2>
      <p className="font-glonimove text-theme-muted leading-relaxed transition-colors">{body}</p>
      {bullets && (
        <ul className="space-y-3 pt-2">
          {bullets.map((p, i) => (
            <li key={i} className="flex items-start gap-3 font-glonimove text-theme-text text-sm leading-relaxed transition-colors">
              <span className="mt-1 shrink-0 w-5 h-5 flex items-center justify-center bg-theme-accent/15 text-theme-accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Trust strip — compact value statements row                          */
/* ------------------------------------------------------------------ */

export const TrustStrip: React.FC<{
  items: { icon: React.FC<IconProps>; label: string; sub: string }[];
}> = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-theme-border/30 border border-theme-border/30">
    {items.map((it, i) => (
      <div key={i} className="bg-theme-card p-6 flex items-start gap-4 transition-colors duration-200">
        <span className="w-10 h-10 shrink-0 flex items-center justify-center border border-theme-accent/40 text-theme-accent">
          <span className="w-5 h-5"><it.icon /></span>
        </span>
        <div className="space-y-1">
          <h4 className="font-googleSans font-bold uppercase tracking-wide text-sm text-theme-text transition-colors">{it.label}</h4>
          <p className="font-glonimove text-xs text-theme-muted leading-relaxed transition-colors">{it.sub}</p>
        </div>
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Image collage — small grid of supporting imagery                   */
/* ------------------------------------------------------------------ */

export const ImageCollage: React.FC<{
  images: { src: string; alt: string; caption?: string }[];
}> = ({ images }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {images.map((img, i) => (
      <figure key={i} className="relative group overflow-hidden border border-theme-border/20 bg-theme-sec">
        <img
          src={img.src}
          alt={img.alt}
          className="w-full h-40 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-bg/80 via-transparent to-transparent" />
        {img.caption && (
          <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-3 font-googleSans font-bold text-xs uppercase tracking-wide text-white">
            {img.caption}
          </figcaption>
        )}
      </figure>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Mini contact strip — phone + email + hours                          */
/* ------------------------------------------------------------------ */

export const ContactStrip: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-theme-border/30 border border-theme-border/30">
    <a href="tel:+12132142203" className="flex items-center gap-4 bg-theme-card p-6 hover:bg-theme-sec transition-colors">
      <span className="w-10 h-10 flex items-center justify-center border border-theme-accent/40 text-theme-accent">
        <span className="w-5 h-5"><Icons.phone /></span>
      </span>
      <div>
        <div className="font-googleSans font-bold uppercase text-xs tracking-wide text-theme-muted">Call</div>
        <div className="font-googleSans font-bold text-theme-text">+1 213-214-2203</div>
      </div>
    </a>
    <a href="mailto:support@konstructz.com" className="flex items-center gap-4 bg-theme-card p-6 hover:bg-theme-sec transition-colors">
      <span className="w-10 h-10 flex items-center justify-center border border-theme-accent/40 text-theme-accent">
        <span className="w-5 h-5"><Icons.mail /></span>
      </span>
      <div>
        <div className="font-googleSans font-bold uppercase text-xs tracking-wide text-theme-muted">Email</div>
        <div className="font-googleSans font-bold text-theme-text break-all">support@konstructz.com</div>
      </div>
    </a>
    <div className="flex items-center gap-4 bg-theme-card p-6">
      <span className="w-10 h-10 flex items-center justify-center border border-theme-accent/40 text-theme-accent">
        <span className="w-5 h-5"><Icons.clock /></span>
      </span>
      <div>
        <div className="font-googleSans font-bold uppercase text-xs tracking-wide text-theme-muted">Hours</div>
        <div className="font-googleSans font-bold text-theme-text">Mon–Fri · 8AM–5PM PST</div>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Image band — full-width atmospheric band with overlay text          */
/* ------------------------------------------------------------------ */

export const ImageBand: React.FC<{
  image: string;
  eyebrow: string;
  title: string;
  body?: string;
  tone?: "dark" | "green";
  align?: "left" | "center";
  height?: "short" | "tall";
}> = ({ image, eyebrow, title, body, tone = "dark", align = "left", height = "tall" }) => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
      <div className={`absolute inset-0 ${tone === "green" ? "bg-brand-greenDark/85" : "bg-[#171A16]/80"}`} />
      <div className={`absolute inset-0 bg-gradient-to-t ${tone === "green" ? "from-brand-greenDark/95 via-brand-greenDark/40 to-transparent" : "from-[#171A16]/90 via-[#171A16]/30 to-transparent"}`} />
    </div>
    <div className={`relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 ${height === "tall" ? "py-24 sm:py-32" : "py-16 sm:py-20"}`}>
      <div className={`max-w-3xl space-y-5 ${align === "center" ? "mx-auto text-center" : ""}`}>
        <span className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.25em] font-googleSans font-bold text-brand-sand">
          <span className="w-6 h-px bg-current opacity-60" />
          {eyebrow}
        </span>
        <h2 className="text-3xl sm:text-5xl font-heading uppercase tracking-wide text-white leading-[1.1]">{title}</h2>
        {body && (
          <p className="font-glonimove text-neutral-200 text-base sm:text-lg leading-relaxed">{body}</p>
        )}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Section wrapper — consistent vertical rhythm                        */
/* ------------------------------------------------------------------ */

export const Section: React.FC<{
  children: React.ReactNode;
  variant?: "default" | "secondary";
  bordered?: boolean;
  className?: string;
}> = ({ children, variant = "default", bordered, className = "" }) => (
  <section
    className={`py-16 sm:py-24 px-5 sm:px-8 lg:px-12 ${variant === "secondary" ? "bg-theme-sec" : "bg-theme-bg"} ${bordered ? "border-y border-theme-border/10" : ""} transition-colors duration-200 ${className}`}
  >
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);
