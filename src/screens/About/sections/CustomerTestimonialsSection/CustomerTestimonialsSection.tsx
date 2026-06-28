import React from "react";
import { useI18n } from "../../../../context/I18nContext";

const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  const filledCount = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < filledCount ? "#d8c79a" : "rgba(255,255,255,0.15)"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

export const CustomerTestimonialsSection = (): JSX.Element => {
  const { t } = useI18n();

  const testimonials = [
    {
      id: 1,
      rating: 5.0,
      ratingText: "5.0 / 5.0 Review",
      title: t("about.testimonial.1.title", { fallback: "Seamless Online Purchase" }),
      body: t("about.testimonial.1.body", { fallback: "We ordered the Stomp V980 loader directly through their online checkout. The financing approval took minutes, and the machine was delivered to our site fully ready for deployment." }),
      author: "John Mirkant",
      role: t("about.role.opsManager", { fallback: "Operations Manager" }),
      leftOffset: "0px",
    },
    {
      id: 2,
      rating: 4.8,
      ratingText: "4.8 / 5.0 Review",
      title: t("about.testimonial.2.title", { fallback: "Easy E-Commerce Compatibility" }),
      body: t("about.testimonial.2.body", { fallback: "Finding attachment options on this digital store is incredibly easy. We bought a trenching bucket online and had it shipped to our site. The specs check tool is 100% accurate." }),
      author: "Sarah Jenkins",
      role: t("about.role.siteSupervisor", { fallback: "Site Supervisor" }),
      leftOffset: "484px",
    },
    {
      id: 3,
      rating: 4.9,
      ratingText: "4.9 / 5.0 Review",
      title: t("about.testimonial.3.title", { fallback: "Fast Online Orders & Tracking" }),
      body: t("about.testimonial.3.body", { fallback: "Ordering heavy equipment online felt risky, but the support chat helped us select the right model. Secure checkout, easy real-time tracking, and fast delivery direct to our yard." }),
      author: "Mateo Silva",
      role: t("about.role.contractor", { fallback: "Contractor" }),
      leftOffset: "969px",
    },
  ];

  return (
    <section
      className="absolute top-[4785px] left-[260px] w-[1430px] h-[550px]"
      aria-labelledby="customer-testimonials-heading"
    >
      <h2
        id="customer-testimonials-heading"
        className="absolute top-0 left-0 [font-family:'Malking-Regular',Helvetica] font-normal text-theme-accent text-[54px] tracking-[-0.02em] uppercase leading-none"
      >
        {t("auto.customertestimonials.what.our.customers")}
      </h2>

      {/* Trust Rating Summary */}
      <div className="absolute top-[80px] left-0 flex items-center justify-between w-full border-b border-theme-border/20 pb-6">
        <p className="font-glonimove text-theme-text text-xl">
          {t("about.rated.4.7", { fallback: "Rated 4.7 / 5 based on 28,370 reviews Showing our 4 & 5 star reviews" })}
        </p>
        <img
          className="h-[30px] w-auto dark:opacity-100 opacity-80"
          alt={t("auto.customertestimonials.review.platform.rating")}
          src="/img/group-29.png"
        />
      </div>

      <div className="absolute top-[170px] left-0 w-full flex gap-[23px]">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="w-[461px] h-[310px] bg-theme-sec/60 backdrop-blur-md border border-theme-border/20 rounded-2xl p-6 flex gap-4 hover:border-theme-accent/40 hover:bg-theme-card/80 transition-all duration-300 shadow-lg group relative overflow-hidden"
            style={{
              position: "absolute",
              left: testimonial.leftOffset,
              top: "0px",
            }}
            aria-label={`Customer testimonial ${testimonial.id}`}
          >
            {/* Corner ambient glow on hover */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-theme-accent/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Left side: Avatar */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-[68px] h-[68px] rounded-full bg-[#181c16] border border-theme-border/40 flex items-center justify-center text-theme-accent group-hover:border-theme-accent/60 transition-colors shadow-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 opacity-80">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            {/* Right side: Content */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                {/* Stars + Rating Badge */}
                <div className="flex items-center justify-between mb-3">
                  <Stars rating={testimonial.rating} />
                  <span className="font-[Outfit] text-theme-muted text-xs tracking-wider uppercase font-bold">
                    {testimonial.ratingText}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-clofieBold text-white text-lg sm:text-xl leading-tight mb-2 tracking-wide truncate group-hover:text-theme-accent transition-colors">
                  {testimonial.title}
                </h3>

                {/* Body Text */}
                <p className="font-[Outfit] text-[#b4c3b0] text-sm sm:text-base leading-snug line-clamp-4">
                  "{testimonial.body}"
                </p>
              </div>

              {/* Author */}
              <div className="border-t border-white/5 pt-3 mt-2 flex items-center justify-between">
                <span className="font-googleSans text-theme-accent text-sm font-bold tracking-wide truncate">
                  {testimonial.author}
                </span>
                <span className="font-googleSans text-theme-muted text-xs tracking-wide truncate ml-2">
                  {testimonial.role}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
