import { useI18n } from "../../context/I18nContext";
import { Link } from "react-router-dom";




export const MobileAbout = (): JSX.Element => {
  const { t } = useI18n();
  const missionCards = [
    {
      id: "road-ironing-or-compaction",
      title: t("auto.mobileabout.road.ironing.or"),
      image: "/img/chatgpt-image-jun-11-2026-09-17-59-am-1.png",
    },
    {
      id: "material-handling-and-lifting",
      title: t("auto.mobileabout.material.handling.lifting"),
      image: "/img/chatgpt-image-jun-11-2026-09-18-07-am-1.png",
    },
    {
      id: "vertical-reach-and-maintenance",
      title: t("auto.mobileabout.vertical.reach.and"),
      image: "/img/chatgpt-image-jun-11-2026-09-18-16-am-1.png",
    },
    {
      id: "bulk-transport-and-stockpiling",
      title: t("auto.mobileabout.bulk.transport.and"),
      image: "/img/chatgpt-image-jun-11-2026-09-18-20-am-1.png",
    },
    {
      id: "stone-and-aggregate-processing",
      title: t("auto.mobileabout.stone.aggregate.processing"),
      image: "/img/chatgpt-image-jun-11-2026-09-18-31-am-1.png",
    },
    {
      id: "heavy-goods-and-pallet-handling",
      title: t("auto.mobileabout.heavy.goods.and"),
      image: "/img/chatgpt-image-jun-11-2026-09-18-23-am-1.png",
    },
    {
      id: "soil-ripping-and-site-prep",
      title: t("auto.mobileabout.soil.ripping.and"),
      image: "/img/chatgpt-image-jun-11-2026-09-18-27-am-1.png",
    },
    {
      id: "excavation-and-trenching",
      title: t("auto.mobileabout.excavation.and.trenching"),
      image: "/img/chatgpt-image-jun-11-2026-09-18-03-am-1.png",
    },
  ];

  const trustPillars = [
    {
      title: t("auto.mobileabout.affordable.machinery"),
      description: t("auto.mobileabout.quality.equipment.at"),
      imageSrc:
        "/img/world-habitat-day-close-up-picture-pile-coins-sag-coin-2.png",
      badgeSrc: "/img/6141-1.png",
    },
    {
      title: t("auto.mobileabout.reliable.tested"),
      description: t("auto.mobileabout.every.machine.checked"),
      imageSrc:
        "/img/engineer-specialist-asian-female-technician-maintenance-inspect.png",
      badgeSrc: "/img/77a00bd6-65f1-421c-8ae5-a2251b7b3802-1.png",
    },
    {
      title: t("auto.mobileabout.online.24.7"),
      description: t("auto.mobileabout.fast.answers.to"),
      imageSrc:
        "/img/customer-support-black-technician-helpline-photovoltaic-facility.png",
      badgeSrc: "/img/390026be-717f-44d5-862f-db591784d1fa-1.png",
    },
    {
      title: t("auto.mobileabout.perfect.for.farmers"),
      description: t("auto.mobileabout.compact.versatile.machines"),
      imageSrc: "/img/men-standing-field-against-sky-1.png",
      badgeSrc: "/img/519b3f36-465f-437a-83b4-0a6c77226948-1.png",
    },
  ];

  const testimonials = [
    {
      id: 1,
      rating: 5.0,
      ratingText: "5.0 / 5.0 Review",
      title: "Seamless Online Purchase",
      body: "We ordered the Stomp V980 loader directly through their online checkout. The financing approval took minutes, and the machine was delivered to our site fully ready for deployment.",
      author: "John Mirkant",
      role: "Operations Manager",
    },
    {
      id: 2,
      rating: 4.8,
      ratingText: "4.8 / 5.0 Review",
      title: "Easy E-Commerce Compatibility",
      body: "Finding attachment options on this digital store is incredibly easy. We bought a trenching bucket online and had it shipped to our site. The specs check tool is 100% accurate.",
      author: "Sarah Jenkins",
      role: "Site Supervisor",
    },
    {
      id: 3,
      rating: 4.9,
      ratingText: "4.9 / 5.0 Review",
      title: "Fast Online Orders & Tracking",
      body: "Ordering heavy equipment online felt risky, but the support chat helped us select the right model. Secure checkout, easy real-time tracking, and fast delivery direct to our yard.",
      author: "Mateo Silva",
      role: "Contractor",
    },
  ];

  return (
    <div className="bg-theme-bg text-theme-text w-full overflow-hidden transition-colors duration-200">
      <section className="relative h-screen min-h-[500px] overflow-hidden">
        <img
          src="/img/manager-meeting-with-engineer-outdoor-site-stack-hand-teamwork-1.png"
          alt={t("auto.mobileabout.manager.and.engineer")}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-transparent z-[1]" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-black/45 to-transparent z-[1]" aria-hidden="true" />
        <div className="relative z-10 px-5 pt-24 flex flex-col justify-center h-full">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white font-googleSans text-sm"
          >
            <img src="/img/home.svg" alt={t("auto.mobileabout.home")} className="w-5 h-5" />
            <span>{t("auto.mobileabout.home")}</span>
          </Link>
          <h1 className="mt-4 font-clofieBold text-white text-3xl leading-tight">{t("auto.mobileabout.affordable.machinery.reliable")}</h1>
        </div>
      </section>

      <section className="px-5 py-8 bg-theme-bg transition-colors duration-200">
        <p className="font-glonimove text-theme-text text-base leading-relaxed transition-colors">
          At Konstructz, we make quality machinery accessible to small
          businesses and local farmers. With a carefully curated selection of
          reliable, low-cost equipment, we help projects get done
          efficiently—without breaking the budget. Based in California, our
          team is small, agile, and ready to assist 24/7 online.
        </p>
      </section>

      {/* Mission Gallery */}
      <section className="bg-theme-bg px-5 py-12 transition-colors duration-200">
        <h2 className="font-heading text-theme-heading text-4xl text-center mb-8 transition-colors">{t("auto.mobileabout.our.mission")}</h2>
        <div className="grid grid-cols-2 gap-3">
          {missionCards.map((card) => (
            <article
              key={card.id}
              className="relative aspect-square overflow-hidden bg-neutral-900"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <h3 className="font-glonimove text-white text-sm leading-tight drop-shadow-md">
                  {card.title}
                </h3>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <h3 className="font-clofieBold text-theme-heading text-2xl transition-colors">{t("auto.mobileabout.empowering.small.businesses")}</h3>
          <p className="font-glonimove text-theme-text text-base leading-relaxed transition-colors">{t("auto.mobileabout.we.aim.to")}</p>
        </div>
      </section>

      {/* Location & Warehouse */}
      <section className="bg-theme-bg px-5 py-12 transition-colors duration-200">
        <h2 className="font-heading text-theme-heading text-3xl sm:text-4xl mb-4 transition-colors">
          Our Location &amp; Warehouse
        </h2>
        <p className="font-glonimove text-theme-text text-lg sm:text-xl leading-relaxed mb-2 transition-colors">
          Our main warehouse is located at{" "}
          <span className="font-bold text-theme-accent">
            2522 S Malt Ave., Commerce, CA 90040, United States
          </span>
          .
        </p>
        <p className="font-glonimove text-theme-muted text-sm sm:text-base leading-relaxed mb-6 transition-colors">
          Visit by appointment for yard walkthroughs, equipment demos and depot
          pickup. Monday–Friday, 8:00 AM – 5:00 PM Pacific.
        </p>

        {/* Real Google Maps embed */}
        <div className="w-full aspect-[4/3] border-4 border-theme-accent/30 rounded-lg overflow-hidden shadow-lg">
          <iframe
            title="Konstructz Commerce CA depot — Google Maps"
            src="https://www.google.com/maps?q=2522+S+Malt+Ave,+Commerce,+CA+90040&z=13&output=embed"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* USA service-area map with pin over California */}
        <div className="relative mt-6 w-full aspect-[1.32]" aria-label="Konstructz nationwide service area — depot located in California">
          <img
            src="/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1.png"
            alt="Map of the United States showing Konstructz nationwide service coverage"
            className="absolute inset-0 w-full h-full object-contain"
          />
          {/* Pin tip aligned over Southern California */}
          <img
            src="/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1-1.png"
            alt="Pin marking Commerce, California — Konstructz headquarters"
            className="absolute w-[10%] aspect-[0.88] drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]"
            style={{ top: "45%", left: "11%" }}
          />
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="bg-theme-bg px-5 py-12 transition-colors duration-200">
        <p className="font-heading text-theme-heading text-3xl text-center transition-colors">{t("auto.mobileabout.why.choose.us")}</p>
        <h2 className="mt-4 font-clofieBold text-theme-text text-2xl text-center transition-colors">{t("auto.mobileabout.why.small.businesses")}</h2>

        <div className="mt-8 grid grid-cols-1 gap-6">
          {trustPillars.map((pillar) => (
            <article
              key={pillar.title}
              className="bg-theme-card border border-theme-border/20 shadow-lg overflow-hidden transition-colors duration-200"
            >
              <div className="relative">
                <img
                  src={pillar.imageSrc}
                  alt={pillar.title}
                  className="w-full h-[200px] object-cover"
                />
                <div className="absolute -bottom-6 right-4 w-16 h-16 bg-brand-greenDark flex items-center justify-center">
                  <img
                    src={pillar.badgeSrc}
                    alt=""
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>
              <div className="p-5 pt-8">
                <h3 className="font-googleSans text-theme-text text-xl transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-2 font-glonimove text-theme-muted text-base transition-colors">
                  {pillar.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <Link
          to="/contact"
          className="mt-8 flex items-center justify-center bg-[#153d28] py-4 text-white font-googleSans text-lg shadow hover:bg-brand-green transition-colors"
        >{t("auto.mobileabout.get.a.quote")}</Link>
      </section>

      {/* Testimonials */}
      <section className="bg-theme-bg px-5 py-12 transition-colors duration-200">
        <h2 className="font-heading text-theme-heading text-3xl text-center mb-3 transition-colors">{t("auto.mobileabout.what.our.customers")}</h2>
        <p className="font-glonimove text-theme-text text-sm text-center mb-8 transition-colors">{t("auto.mobileabout.rated.4.7")}</p>

        <div className="flex flex-col gap-5">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="bg-theme-card border border-theme-border/20 p-5 flex gap-4 items-start transition-colors duration-200 rounded-[12px] shadow-sm hover:border-theme-accent/40"
            >
              <div className="w-14 h-14 rounded-full bg-[#181c16] border border-theme-border/40 flex-shrink-0 flex items-center justify-center text-theme-accent shadow-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 opacity-80">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill={i < Math.round(t.rating) ? "#d8c79a" : "rgba(255,255,255,0.15)"}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-outfit text-xs text-theme-muted uppercase tracking-wider font-semibold font-[Outfit]">
                    {t.ratingText}
                  </span>
                </div>
                <h3 className="mt-2 font-outfit font-bold text-theme-text text-base transition-colors leading-tight">
                  {t.title}
                </h3>
                <p className="mt-1.5 font-outfit text-[#b4c3b0] text-sm leading-snug transition-colors">
                  "{t.body}"
                </p>
                <div className="border-t border-white/5 pt-2.5 mt-2 flex items-center justify-between">
                  <span className="font-outfit text-theme-accent text-xs font-bold transition-colors">
                    {t.author}
                  </span>
                  <span className="font-outfit text-theme-muted text-[11px] transition-colors">
                    {t.role}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Appointment CTA */}
      <section className="relative bg-[#153d28] px-5 py-10 overflow-hidden">
        <div className="flex items-start gap-4">
          <img src="/img/call.png" alt="" className="w-14 h-14 shrink-0" />
          <div className="flex-1">
            <p className="font-readex text-white text-lg leading-snug">{t("auto.mobileabout.make.an.appointment")}</p>
            <a
              href="tel:+12132142203"
              className="font-readex font-semibold text-[#d8c79a] underline text-xl"
            >
              +1 213-214-2203
            </a>
          </div>
        </div>
        <a
          href="tel:+12132142203"
          className="mt-6 flex items-center justify-center gap-3 border-4 border-[#d8c79a] text-[#d8c79a] py-4 font-googleSans font-bold text-base"
        >{t("auto.mobileabout.call.us.now")}<img src="/img/vector-9.svg" alt="" className="w-2 h-auto" />
        </a>
      </section>
    </div>
  );
};

export default MobileAbout;
