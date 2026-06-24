import { useI18n } from "../../context/I18nContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MachineLogoSlider } from "../../components/sections/MachineLogoSlider";
import { Reveal } from "../../components/Reveal";
import { blogPosts } from "../../data/blogPosts";
import "../../styles/home-reveal.css";

const ProductSlider = () => {
  const { t } = useI18n();

  const products = [
    { id: "scoopydig", title: t("auto.mobilefrontpage.mini.excavator"), imageSrc: "/img/mini-excavator-png-4-1.png" },
    { id: "spider-one", title: t("auto.mobilefrontpage.spider.one"), imageSrc: "/img/spider-one.png" },
    { id: "stomp-v950", title: t("auto.mobilefrontpage.skid.steer.loader"), imageSrc: "/img/skid-steer-loader.png" },
    { id: "groundripper-grx", title: t("auto.mobilefrontpage.ground.ripper"), imageSrc: "/img/groundripper-swipe.png" },
    { id: "scoopydig", title: t("auto.mobilefrontpage.scoopy.dig"), imageSrc: "/img/scoopy-dig-swipe.png" },
    { id: "skoop-ii", title: "K-LOAD 1200", imageSrc: "/img/skoop-swipe.png" },
    { id: "thunderdump", title: t("auto.mobilefrontpage.thunderdump.2"), imageSrc: "/img/thunderdump-2.png" },
    { id: "thunderdump", title: t("auto.mobilefrontpage.thunderdump.2.alt"), imageSrc: "/img/thunderdump-2-alt.png" },
  ];

  const [index, setIndex] = useState(0);
  const product = products[index];
  const navigate = useNavigate();

  const prev = () => setIndex((i) => (i === 0 ? products.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === products.length - 1 ? 0 : i + 1));

  return (
    <section className="bg-[#ebebeb] px-5 py-10">
      <h2 className="font-clofieBold text-[#153d28] text-3xl mb-2">
        {product.title}
      </h2>
      <img
        src="/img/zig-zag.svg"
        alt=""
        aria-hidden="true"
        className="w-32 h-auto mb-4"
      />

      <div className="relative w-full h-[260px] flex items-center justify-center">
        <img
          src={product.imageSrc}
          alt={product.title}
          className="max-h-[240px] w-auto object-contain transition-all duration-300"
        />
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          type="button"
          onClick={prev}
          aria-label={t("auto.mobilefrontpage.previous.product")}
          className="group relative w-14 h-12 flex items-center justify-center transition-transform duration-200 active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#68825B]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-x-[3px] translate-y-[3px] bg-black/20 [clip-path:polygon(8px_0,100%_0,100%_calc(100%_-_8px),calc(100%_-_8px)_100%,0_100%,0_8px)]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[#20251f] border border-[#DDC49A]/75 [clip-path:polygon(8px_0,100%_0,100%_calc(100%_-_8px),calc(100%_-_8px)_100%,0_100%,0_8px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-8px_14px_rgba(0,0,0,0.26)] transition-colors duration-200 group-hover:bg-[#283326] group-hover:border-[#DDC49A]"
          />
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-1 bg-[#68825B] transition-colors duration-200 group-hover:bg-[#DDC49A]"
          />
          <svg
            className="relative w-7 h-7 text-[#DDC49A] transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M13.5 6.5 8 12l5.5 5.5" />
            <path d="M8.5 12H20" />
          </svg>
        </button>
        <span className="font-glonimove text-sm text-[#153d28]">
          {index + 1} / {products.length}
        </span>
        <button
          type="button"
          onClick={next}
          aria-label={t("auto.mobilefrontpage.next.product")}
          className="group relative w-14 h-12 flex items-center justify-center transition-transform duration-200 active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#68825B]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-x-[3px] translate-y-[3px] bg-black/20 [clip-path:polygon(8px_0,100%_0,100%_calc(100%_-_8px),calc(100%_-_8px)_100%,0_100%,0_8px)]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[#20251f] border border-[#DDC49A]/75 [clip-path:polygon(8px_0,100%_0,100%_calc(100%_-_8px),calc(100%_-_8px)_100%,0_100%,0_8px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-8px_14px_rgba(0,0,0,0.26)] transition-colors duration-200 group-hover:bg-[#283326] group-hover:border-[#DDC49A]"
          />
          <span
            aria-hidden="true"
            className="absolute right-0 top-0 bottom-0 w-1 bg-[#68825B] transition-colors duration-200 group-hover:bg-[#DDC49A]"
          />
          <svg
            className="relative w-7 h-7 text-[#DDC49A] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.5 6.5 16 12l-5.5 5.5" />
            <path d="M4 12h11.5" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          type="button"
          onClick={() => navigate(`/equipment/${product.id}`)}
          className="w-full py-4 bg-[#153d28] text-white font-googleSans font-bold text-base tracking-wide btn"
        >{t("auto.mobilefrontpage.view.spec")}</button>
        <button
          type="button"
          onClick={() => navigate(`/contact?product=${product.id}`)}
          className="w-full py-4 bg-transparent border-[3px] border-[#153d28] text-[#153d28] font-googleSans font-bold text-base tracking-wide btn"
        >
          BUY {product.title.toUpperCase()}
        </button>
      </div>
    </section>
  );
};

export const MobileFrontpage = (): JSX.Element => {
  const { t } = useI18n();
  const [activeModel, setActiveModel] = useState<"v950" | "v980">("v950");



  const showcaseCards = [
    {
      title: t("auto.mobilefrontpage.quality.equipment"),
      description:
        t("auto.mobilefrontpage.carefully.selected.machinery"),
      image:
        "/img/super-red-betta-fish-siamese-fighting-fish-isolated-white-backgr.png",
      href: "/quality-equipment",
    },
    {
      title: t("auto.mobilefrontpage.trusted.support"),
      description:
        t("auto.mobilefrontpage.get.clear.guidance"),
      image:
        "/img/engineer-provides-technical-support-via-headset-solar-panel-fact.png",
      href: "/trusted-support",
    },
    {
      title: t("auto.mobilefrontpage.job.site.ready"),
      description:
        t("auto.mobilefrontpage.practical.machines.designed"),
      image: "/img/site-engineer-construction-site-1.png",
      href: "/job-site-ready",
    },
    {
      title: t("auto.mobilefrontpage.long.term.value"),
      description:
        t("auto.mobilefrontpage.equipment.solutions.focused"),
      image: "/img/businessman-holding-growth-arrow-1.png",
      href: "/long-term-value",
    },
  ];

  const warehouseImages = [
    {
      src: "/img/factory-with-machines-machinery-inside-it-1.png",
      alt: t("auto.mobilefrontpage.factory.with.machines"),
    },
    {
      src: "/img/engineer-provides-technical-support-via-headset-solar-panel-fact-1.png",
      alt: t("auto.mobilefrontpage.engineer.providing.technical"),
    },
    {
      src: "/img/male-worker-factory-1.png",
      alt: t("auto.mobilefrontpage.male.worker.in"),
    },
  ];

  const whyChooseImages = [
    { src: "/img/groundripper-png-4.png", alt: t("auto.whychooseus.groundripper.machine") },
    { src: "/img/skoop-png-4.png", alt: t("auto.whychooseus.skoop.machine") },
    { src: "/img/new-project-16-2.png", alt: t("auto.whychooseus.compact.construction.machine") },
    { src: "/img/new-project-19-3.png", alt: t("auto.whychooseus.tracked.construction.machine") },
    { src: "/img/scoopydigreal.png", alt: t("auto.whychooseus.heavy.equipment.lineup") },
    { src: "/img/stomp-v980-5.png", alt: t("auto.whychooseus.stomp.machine") },
  ];

  return (
    <div className="home-reveal-scope bg-theme-bg text-theme-text w-full overflow-hidden transition-colors duration-200">
      {/* Hero */}
      {/* Hero */}
      <section className="relative w-full h-[100svh] min-h-[560px] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          src="/video/banner-konstructz.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={t("auto.frontpage.konstructz.hero.background")}
          style={{ opacity: activeModel === "v950" ? 1 : 0, zIndex: activeModel === "v950" ? 1 : 0 }}
        />
        <video
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          src="/video/skid-steer-v980-banner.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="STOMP V980 Hero Video"
          style={{ opacity: activeModel === "v980" ? 1 : 0, zIndex: activeModel === "v980" ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80 z-[2]" />

        <div className="relative z-10 px-5 pt-28 pb-16 flex flex-col h-full justify-end">
          <span className="inline-block self-start border-2 border-[#d8c79a] px-3 py-1 mb-4 font-glonimove text-white text-sm z-10">{t("auto.mobilefrontpage.mini.skid.steer")}</span>
          <h1 className="font-heading text-white text-5xl leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] z-10">
            KONSTRUCTZ <span className="text-[#d8c79a]">{activeModel === "v950" ? t("auto.mobilefrontpage.stomp.v950") : "STOMP V980"}</span>
          </h1>

          {/* Mobile Model Switcher */}
          <div className="mt-5 flex gap-2.5 z-10">
            <button
              type="button"
              onClick={() => setActiveModel("v950")}
              className={`px-4 py-2 border-2 border-solid text-xs font-bold font-googleSans uppercase tracking-wider rounded-[3px] transition-all duration-300 ${
                activeModel === "v950"
                  ? "bg-[#d8c79a] border-[#d8c79a] text-[#153d28]"
                  : "bg-black/35 border-white/20 text-white"
              }`}
            >
              STOMP V950
            </button>
            <button
              type="button"
              onClick={() => setActiveModel("v980")}
              className={`px-4 py-2 border-2 border-solid text-xs font-bold font-googleSans uppercase tracking-wider rounded-[3px] transition-all duration-300 ${
                activeModel === "v980"
                  ? "bg-[#d8c79a] border-[#d8c79a] text-[#153d28]"
                  : "bg-black/35 border-white/20 text-white"
              }`}
            >
              STOMP V980
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 z-10">
            <Link
              to="/equipment"
              className="px-5 py-3 bg-[#153d28] text-white font-googleSans font-bold text-sm"
            >{t("auto.mobilefrontpage.explore.equipment")}</Link>
            <Link
              to="/contact"
              className="px-5 py-3 border-2 border-[#d8c79a] text-[#d8c79a] font-googleSans font-bold text-sm"
            >{t("auto.mobilefrontpage.get.a.quote")}</Link>
          </div>
        </div>
      </section>

      {/* Partner brands */}
      <MachineLogoSlider className="py-4 border-y border-theme-border/10" />



      {/* Promo tiles */}
      <Reveal as="section" variant="zoom" className="grid grid-cols-1">
        <div className="relative h-[220px] bg-[#e22c2c] overflow-hidden">
          <img
            src="/img/change-the-aspect-ratio-to-202605291023-1.png"
            alt={t("auto.mobilefrontpage.featured.equipment")}
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
          />
        </div>
        <div className="relative h-[220px] bg-[#114f2f] overflow-hidden">
          <img
            src="/img/remove-the-white-background-and-202605291020-1.png"
            alt={t("auto.mobilefrontpage.featured.equipment")}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </Reveal>

      {/* Product Slider */}
      <ProductSlider />

      {/* Brand Showcase — cards lift in one by one */}
      <Reveal as="section" variant="fade" className="bg-theme-bg px-5 py-12 transition-colors duration-200">
        <h2 className="font-clofieBold text-theme-heading text-3xl text-center mb-8">{t("auto.mobilefrontpage.why.konstructz")}</h2>
        <div className="grid grid-cols-1 gap-5">
          {showcaseCards.map((card, i) => (
            <Reveal
              key={card.title}
              as="article"
              variant="rise"
              delay={i * 110}
              className="relative h-[360px] overflow-hidden bg-theme-sec"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                <h3 className="font-clofieBold text-white text-2xl">
                  {card.title}
                </h3>
                <p className="font-glonimove text-white/90 text-sm leading-snug">
                  {card.description}
                </p>
                <Link
                  to={card.href}
                  aria-label={`Learn more about ${card.title}`}
                  className="self-start mt-2 border-2 border-white px-4 py-2 text-white font-googleSans text-sm hover:bg-white/10 transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* Call CTA */}
      <Reveal as="section" variant="zoom-out" className="relative bg-[#153d28] px-5 py-10 overflow-hidden">
        <div className="flex items-start gap-4">
          <img src="/img/call.png" alt="" className="w-14 h-14 shrink-0" />
          <div className="flex-1">
            <p className="font-readex text-white text-lg leading-snug">{t("auto.mobilefrontpage.make.an.appointment")}</p>
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
        >{t("auto.mobilefrontpage.call.us.now")}<img src="/img/vector-9.svg" alt="" className="w-2 h-auto" />
        </a>
      </Reveal>

      {/* Warehouse */}
      <Reveal as="section" variant="right" className="bg-theme-sec px-5 py-12 transition-colors duration-200">
        <h2 className="font-clofieBold text-theme-heading text-3xl mb-4">{t("auto.mobilefrontpage.our.warehouse")}</h2>
        <p className="font-glonimove text-theme-text text-base leading-relaxed transition-colors duration-200">
          <span className="font-light">
            KonstructZ operates from our warehouse in Commerce,{" "}
          </span>
          <span className="font-glonimoveBold font-bold">California</span>
          <span className="font-light">{t("auto.mobilefrontpage.giving.customers.a")}</span>
        </p>
        <img
          src="/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1.png"
          alt={t("auto.mobilefrontpage.service.coverage.map")}
          className="mt-6 w-full h-auto object-contain"
        />
      </Reveal>

      {/* Warehouse gallery */}
      <Reveal as="section" variant="blur" className="bg-theme-sec transition-colors duration-200">
        <div className="relative w-full h-[260px]">
          <img
            src="/img/machine-with-large-number-machines-background-1.png"
            alt={t("auto.mobilefrontpage.konstructz.warehouse")}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-5 text-center">
            <p className="font-clofieBlack text-white text-xl uppercase">{t("auto.mobilefrontpage.konstructz.is.built")}</p>
            <p className="font-clofieBlack text-white text-xl uppercase mt-1">{t("auto.mobilefrontpage.to.move.serious")}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {warehouseImages.map((img) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className="w-full h-[200px] object-cover"
            />
          ))}
        </div>
      </Reveal>

      {/* Blog Preview Section */}
      <section className="bg-theme-bg px-5 py-12 transition-colors duration-200 border-t border-theme-border/10">
        <div className="text-center flex flex-col items-center mb-8">
          <span className="text-theme-accent text-xs uppercase tracking-widest font-googleSans font-bold block mb-1">
            LATEST NEWS
          </span>
          <h2 className="font-clofieBold text-theme-heading text-3xl text-center">
            FROM OUR BLOG
          </h2>
          <div className="w-16 h-1 bg-[#153d28] mt-2" />
        </div>

        <div className="flex flex-col gap-6 max-w-md mx-auto">
          {blogPosts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex flex-col bg-theme-sec border border-theme-border/10 rounded-xl overflow-hidden shadow-md"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-[#1e1e1e]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex flex-col justify-between">
                <span className="font-glonimove text-[10px] text-theme-accent uppercase tracking-widest font-semibold mb-1 block">
                  {post.date} &nbsp;·&nbsp; BY {post.author.toUpperCase()}
                </span>
                <h3 className="font-clofieBold text-lg text-theme-text group-hover:text-theme-accent transition-colors">
                  {post.title}
                </h3>
                <p className="font-glonimove text-xs text-theme-muted mt-2 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-theme-border/10 pt-3">
                  <span className="font-googleSans text-xs font-bold text-theme-accent">
                    READ ARTICLE
                  </span>
                  <span className="text-theme-accent">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/blog"
            className="w-full max-w-md py-4 bg-[#153d28] text-white text-center font-googleSans font-bold text-base tracking-wide flex items-center justify-center gap-2 btn"
          >
            <span>EXPLORE ALL ARTICLES</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Why Choose Us — tiles lift in one by one */}
      <Reveal as="section" variant="fade" className="bg-[#282828] text-white px-5 py-16 transition-colors duration-200">
        <h2 className="font-clofieBold text-[#d8c79a] text-4xl text-center">{t("auto.mobilefrontpage.why.choose.us")}</h2>
        <p className="mt-4 font-glonimove text-white/90 text-center text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          <span className="font-light">
            KonstructZ operates from our warehouse in Commerce,{" "}
          </span>
          <span className="font-glonimoveBold font-bold">California</span>
          <span className="font-light">{t("auto.whychooseus.giving.customers.a").replace(/\n\s*/g, " ")}</span>
        </p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {whyChooseImages.map((img, i) => (
            <Reveal
              key={img.src}
              variant="zoom"
              delay={i * 90}
              className="bg-[#1e1e1e] border border-white/5 rounded-xl p-3 flex items-center justify-center h-[140px] sm:h-[180px]"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  );
};

export default MobileFrontpage;
