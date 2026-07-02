import { useI18n } from "../../context/I18nContext";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MachineLogoSlider } from "../../components/sections/MachineLogoSlider";
import { Reveal } from "../../components/Reveal";
import { blogPosts as staticBlogPosts } from "../../data/blogPosts";
import { listPublicPosts, type PublicBlogSummary } from "../../lib/blogStore";
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
  const [animating, setAnimating] = useState(false);
  const [animationState, setAnimationState] = useState<{
    prevIndex: number;
    currentIndex: number;
    direction: "left" | "right";
    phase: "init" | "active";
  } | null>(null);

  const product = products[index];
  const navigate = useNavigate();

  // Mobile Swipe Touch References
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

  const triggerAnimation = (targetIdx: number, dir: "left" | "right") => {
    if (animating) return;
    setAnimating(true);
    setIndex(targetIdx);

    setAnimationState({
      prevIndex: index,
      currentIndex: targetIdx,
      direction: dir,
      phase: "init"
    });

    setTimeout(() => {
      setAnimationState(prev => prev ? { ...prev, phase: "active" } : null);

      setTimeout(() => {
        setAnimating(false);
        setAnimationState(null);
      }, 550);
    }, 30);
  };

  const prev = () => {
    if (animating) return;
    const targetIdx = index === 0 ? products.length - 1 : index - 1;
    triggerAnimation(targetIdx, "right");
  };

  const next = () => {
    if (animating) return;
    const targetIdx = index === products.length - 1 ? 0 : index + 1;
    triggerAnimation(targetIdx, "left");
  };

  // Touch Handlers for Finger Swipe Support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (animating) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (animating) return;
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    const threshold = 40; // horizontal swipe threshold in px

    // Check if horizontal movement is clear and greater than vertical movement
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        next(); // Swipe left moves track left (shows next)
      } else {
        prev(); // Swipe right moves track right (shows prev)
      }
    }
  };

  return (
    <section className="bg-[#ebebeb] px-5 py-10 overflow-hidden border-b border-theme-border/10">
      {/* 1. Static Branded Heading (No Animation) */}
      <h2 className="font-heading text-[#153d28] text-3xl font-bold uppercase tracking-wide mb-2 transition-colors duration-200">
        {product.title}
      </h2>
      <img
        src="/img/zig-zag.svg"
        alt=""
        aria-hidden="true"
        className="w-32 h-auto mb-6"
      />

      {/* 2. Slideable Product Image (Hardware-accelerated layout-safe transition) */}
      <div 
        className="relative w-full h-[260px] overflow-hidden mb-6 cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!animationState ? (
          // Idle state - only one image is rendered, perfectly centered
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={product.imageSrc}
              alt={product.title}
              className="max-h-[240px] w-auto object-contain select-none"
              style={{
                transform: 'translate3d(0,0,0) translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            />
          </div>
        ) : (
          // Animating state - two images are rendered absolute and transitioned via transform + opacity
          <>
            {/* Previous Image Layer (Sliding Out) */}
            <div 
              className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                transform: animationState.phase === "init" 
                  ? 'translate3d(0,0,0) translateZ(0)' 
                  : animationState.direction === "left"
                    ? 'translate3d(-100%, 0, 0) translateZ(0)' 
                    : 'translate3d(100%, 0, 0) translateZ(0)',
                opacity: animationState.phase === "init" ? 1 : 0
              }}
            >
              <img
                src={products[animationState.prevIndex].imageSrc}
                alt=""
                className="max-h-[240px] w-auto object-contain select-none"
              />
            </div>

            {/* Current Image Layer (Sliding In) */}
            <div 
              className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                transform: animationState.phase === "init"
                  ? animationState.direction === "left"
                    ? 'translate3d(100%, 0, 0) translateZ(0)'
                    : 'translate3d(-100%, 0, 0) translateZ(0)'
                  : 'translate3d(0,0,0) translateZ(0)',
                opacity: animationState.phase === "init" ? 0 : 1
              }}
            >
              <img
                src={products[animationState.currentIndex].imageSrc}
                alt=""
                className="max-h-[240px] w-auto object-contain select-none"
              />
            </div>
          </>
        )}
      </div>

      {/* 3. Navigation Controls (Stationary) */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          type="button"
          onClick={prev}
          disabled={animating}
          aria-label={t("auto.mobilefrontpage.previous.product")}
          className="group relative w-14 h-12 flex items-center justify-center bg-[#153d28] border border-[#d8c79a]/50 rounded-[3px] shadow-[0_6px_14px_rgba(21,61,40,0.22)] transition-all duration-200 active:translate-y-0.5 active:shadow-[0_3px_8px_rgba(21,61,40,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#153d28] disabled:opacity-50"
        >
          <svg
            className="relative w-7 h-7 text-[#d8c79a] transition-transform duration-200"
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

        <button
          type="button"
          onClick={next}
          disabled={animating}
          aria-label={t("auto.mobilefrontpage.next.product")}
          className="group relative w-14 h-12 flex items-center justify-center bg-[#153d28] border border-[#d8c79a]/50 rounded-[3px] shadow-[0_6px_14px_rgba(21,61,40,0.22)] transition-all duration-200 active:translate-y-0.5 active:shadow-[0_3px_8px_rgba(21,61,40,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#153d28] disabled:opacity-50"
        >
          <svg
            className="relative w-7 h-7 text-[#d8c79a] transition-transform duration-200"
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

      {/* 4. Specification & Purchase Buttons (Stationary) */}
      <div className="flex flex-col gap-3 mt-8">
        <button
          type="button"
          onClick={() => navigate(`/equipment/${product.id}`)}
          className="w-full py-4 bg-[#153d28] text-white font-googleSans font-bold text-base tracking-wide btn"
        >
          {t("auto.mobilefrontpage.view.spec")}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/contact?product=${product.id}`)}
          className="w-full py-4 bg-transparent border-[3px] border-[#153d28] text-[#153d28] font-googleSans font-bold text-base tracking-wide btn"
        >
          BUY {product.title.toUpperCase()}
        </button>
      </div>

      {/* Hidden preloader container to cache all slider images in browser cache */}
      <div className="absolute w-1 h-1 opacity-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {products.map((p) => (
          <img key={p.id} src={p.imageSrc} alt="" />
        ))}
      </div>
    </section>
  );
};

export const MobileFrontpage = (): JSX.Element => {
  const { t } = useI18n();
  const [posts, setPosts] = useState<PublicBlogSummary[]>(() =>
    staticBlogPosts.slice(0, 4).map((p) => ({
      id: String(p.id),
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      image: p.image,
      author: p.author,
      category: p.category,
      date: p.date,
      publishedAt: p.date,
    }))
  );

  useEffect(() => {
    let active = true;
    listPublicPosts().then((rows) => {
      if (active && rows.length > 0) {
        setPosts(rows.slice(0, 4));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const [activeModel, setActiveModel] = useState<"v950" | "v980">("v950");
  const v950Ref = useRef<HTMLVideoElement>(null);
  const v980Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (activeModel === "v950") {
      if (v950Ref.current) {
        v950Ref.current.currentTime = 0;
        v950Ref.current.play().catch((err) => console.log("v950 mobile play error", err));
      }
      if (v980Ref.current) {
        v980Ref.current.pause();
      }
    } else {
      if (v980Ref.current) {
        v980Ref.current.currentTime = 0;
        v980Ref.current.play().catch((err) => console.log("v980 mobile play error", err));
      }
      if (v950Ref.current) {
        v950Ref.current.pause();
      }
    }
  }, [activeModel]);



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
          ref={v950Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          src="/video/banner-konstructz.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-label={t("auto.frontpage.konstructz.hero.background")}
          style={{ opacity: activeModel === "v950" ? 1 : 0, zIndex: activeModel === "v950" ? 1 : 0 }}
          onEnded={() => setActiveModel("v980")}
        />
        <video
          ref={v980Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          src="/video/skid-steer-v980-banner.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-label="STOMP V980 Hero Video"
          style={{ opacity: activeModel === "v980" ? 1 : 0, zIndex: activeModel === "v980" ? 1 : 0 }}
          onEnded={() => setActiveModel("v950")}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80 z-[2]" />

        <div className="relative z-10 px-5 pt-28 pb-16 flex flex-col h-full justify-end">
          <Reveal
            as="span"
            variant="fall"
            delay={2100}
            className="inline-block self-start border-2 border-[#d8c79a] px-3 py-1 mb-4 font-glonimove text-white text-sm z-10"
          >
            {t("auto.mobilefrontpage.mini.skid.steer")}
          </Reveal>
          <Reveal
            as="h1"
            variant="cinematic"
            delay={2400}
            className="font-heading text-white text-5xl leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] z-10"
          >
            KONSTRUCTZ <span className="text-[#d8c79a]">{activeModel === "v950" ? t("auto.mobilefrontpage.stomp.v950") : "STOMP V980"}</span>
          </Reveal>

          <Reveal variant="fade" delay={2600} className="mt-6 flex flex-wrap gap-3 z-10">
            <Link
              to="/equipment"
              className="px-5 py-3 bg-[#153d28] text-white font-googleSans font-bold text-sm"
            >{t("auto.mobilefrontpage.explore.equipment")}</Link>
            <Link
              to="/contact"
              className="px-5 py-3 border-2 border-[#d8c79a] text-[#d8c79a] font-googleSans font-bold text-sm"
            >{t("auto.mobilefrontpage.get.a.quote")}</Link>
          </Reveal>
        </div>
      </section>

      {/* Partner brands */}
      <MachineLogoSlider className="py-4 border-y border-theme-border/10" />



      {/* Promo tiles Redesign */}
      <Reveal as="section" variant="zoom" className="bg-[#0c0d0b] px-5 py-10 flex flex-col gap-6 border-b border-theme-border/10">
        {/* Section Heading */}
        <div className="flex flex-col gap-1 text-center">
          <span className="font-googleSans text-[10px] tracking-[0.2em] text-[#d8c79a] uppercase font-bold">
            KonstructZ
          </span>
          <h2 className="font-heading text-white text-3xl font-normal uppercase">
            Equipment Lineup
          </h2>
          <div className="w-12 h-1 bg-[#d8c79a] mx-auto mt-2" />
        </div>

        {/* 1. Main large product card first (focus) */}
        <Link
          to="/equipment/scoopydig"
          className="relative block w-full h-[240px] bg-[#1a1b1a] overflow-hidden border border-white/5 shadow-lg group"
        >
          <img
            src="/img/rectangle-9581.png"
            alt="KonstructZ Excavation Showcase"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="bg-[#d8c79a] text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide">
              Showcase
            </span>
            <h3 className="font-heading text-white text-lg mt-1 uppercase">
              Heavy Duty Commercial Grade
            </h3>
          </div>
        </Link>

        {/* 2. Two smaller machine cards below it */}
        <div className="grid grid-cols-2 gap-4">
          {/* Card A: Excavator */}
          <Link
            to="/product/mini-excavators"
            className="flex flex-col bg-[#111211] border border-white/5 overflow-hidden group"
          >
            <div className="relative h-[120px] bg-[#114f2f]/30 overflow-hidden flex items-center justify-center">
              <img
                src="/img/remove-the-white-background-and-202605291020-1.png"
                alt="KonstructZ Compact Excavators"
                className="max-h-[100px] w-auto object-contain p-2 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3">
              <h4 className="font-heading text-[#d8c79a] text-xs uppercase tracking-wide">
                Excavators
              </h4>
              <p className="font-googleSans text-[10px] text-white/60 mt-1 leading-snug">
                Precision digging & trenching.
              </p>
            </div>
          </Link>

          {/* Card B: Trencher */}
          <Link
            to="/product/trenchers"
            className="flex flex-col bg-[#111211] border border-white/5 overflow-hidden group"
          >
            <div className="relative h-[120px] bg-[#2d1c15]/30 overflow-hidden flex items-center justify-center">
              <img
                src="/img/change-the-aspect-ratio-to-202605291023-1.png"
                alt="KonstructZ Trenchers"
                className="max-h-[100px] w-auto object-contain p-2 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3">
              <h4 className="font-heading text-[#d8c79a] text-xs uppercase tracking-wide">
                Trenchers
              </h4>
              <p className="font-googleSans text-[10px] text-white/60 mt-1 leading-snug">
                Heavy loading & grading.
              </p>
            </div>
          </Link>
        </div>
      </Reveal>

      {/* Product Slider */}
      <ProductSlider />

      {/* Brand Showcase — cards lift in one by one */}
      <Reveal as="section" variant="fade" className="bg-theme-bg px-5 py-12 transition-colors duration-200">
        <h2 className="font-clofieBold text-theme-heading text-3xl text-center mb-8">{t("auto.mobilefrontpage.why.konstructz")}</h2>
        <div className="grid grid-cols-2 gap-3.5">
          {showcaseCards.map((card, i) => (
            <Reveal
              key={card.title}
              as="article"
              variant="rise"
              delay={i * 110}
              className="relative h-[250px] overflow-hidden bg-theme-sec rounded-sm"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3.5 flex flex-col justify-end min-h-[60%]">
                <h3 className="font-clofieBold text-white text-base leading-tight">
                  {card.title}
                </h3>
                <p className="font-glonimove text-white/80 text-[11px] leading-snug mt-1 line-clamp-3">
                  {card.description}
                </p>
                <Link
                  to={card.href}
                  aria-label={`Learn more about ${card.title}`}
                  className="self-start mt-2 text-[#d8c79a] hover:text-[#e8d7aa] font-googleSans text-xs font-semibold hover:underline flex items-center gap-1 transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* Call CTA */}
      <Reveal as="section" variant="zoom-out" className="relative bg-[#153d28] px-6 py-8 mx-5 mt-4 mb-8 rounded-lg shadow-xl overflow-hidden border border-white/5">
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-[#d8c79a]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-[#d8c79a]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative h-14 w-14 rounded-full flex items-center justify-center shrink-0">
            {/* Animated double ripple/breath rings */}
            <div className="absolute inset-0 rounded-full bg-[#d8c79a]/5 border border-[#d8c79a]/20 scale-110 animate-[ping_3s_ease-in-out_infinite]" />
            <div className="absolute inset-0 rounded-full bg-[#d8c79a]/10 border border-[#d8c79a]/30 scale-100" />
            
            {/* Inner solid circular glass container */}
            <div className="relative h-10 w-10 rounded-full bg-[#d8c79a]/15 backdrop-blur-sm border border-[#d8c79a]/50 flex items-center justify-center shadow-[0_0_10px_rgba(216,199,154,0.3)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d8c79a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-googleSans text-white/70 text-xs uppercase tracking-wider font-semibold">
              {t("auto.mobilefrontpage.make.an.appointment")}
            </p>
            <a
              href="tel:+12132142203"
              className="font-readex font-bold text-[#d8c79a] text-2xl hover:text-white transition-colors mt-0.5"
            >
              +1 213-214-2203
            </a>
          </div>
        </div>
        
        <a
          href="tel:+12132142203"
          className="mt-6 flex items-center justify-center gap-2 bg-[#d8c79a] hover:bg-[#c7b689] text-[#153d28] py-3.5 rounded-[4px] font-googleSans font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_4px_12px_rgba(216,199,154,0.2)] relative z-10"
        >
          <span>{t("auto.mobilefrontpage.call.us.now")}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="translate-y-[0.5px]">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
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

        <div className="grid grid-cols-2 gap-4 w-full">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex flex-col bg-transparent"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-[#1e1e1e] rounded-sm">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="pt-3 px-0 pb-1 flex flex-col justify-between flex-grow">
                <div>
                  <span className="font-glonimove text-[9px] text-theme-accent uppercase tracking-widest font-semibold mb-1 block">
                    {post.date}
                  </span>
                  <h3 className="font-clofieBold text-sm sm:text-base text-theme-text group-hover:text-theme-accent transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="font-glonimove text-[11px] text-theme-muted mt-1 line-clamp-2 leading-snug">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-theme-border/10 pt-2">
                  <span className="font-googleSans text-[10px] font-bold text-theme-accent tracking-wider">
                    READ ARTICLE
                  </span>
                  <span className="text-theme-accent text-xs">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/blog"
            className="w-full py-3.5 bg-[#153d28] hover:bg-[#113120] text-white text-center font-googleSans font-bold text-sm tracking-wider flex items-center justify-center gap-2 rounded-[4px] btn transition-colors duration-300"
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
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {whyChooseImages.map((img, i) => (
            <Reveal
              key={img.src}
              variant="zoom"
              delay={i * 90}
              className="flex items-center justify-center h-[130px] sm:h-[160px] k-float"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500 drop-shadow-[0_15px_20px_rgba(0,0,0,0.55)]"
              />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  );
};

export default MobileFrontpage;
