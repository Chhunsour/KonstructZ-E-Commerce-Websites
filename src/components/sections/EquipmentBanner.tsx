import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

/**
 * Equipment showcase banner — 1:1 of the Figma export with a real carousel
 * rotation engine.
 *
 * Every slide is permanently mounted at all times and assigned to a "slot" by
 * its offset to the active index. Changing the active index just re-targets
 * each slide → CSS transitions animate them smoothly between slots. Clicking
 * the left/right machine sets it as active, so it slides into the centre while
 * the old centre slides out to the opposite side (cinematic carousel rotation,
 * no flickering, no DOM unmounts).
 *
 * Per-product display knobs (`scale` / `xOffset` / `yOffset`) compensate for
 * PNGs that have different amounts of transparent padding so every machine
 * looks visually balanced.
 *
 * Reference canvas: 1920 × 1080  →  X% = px/19.2, Y% = px/10.8, C(px) = cqw
 */

/* ── coordinate helpers (Figma px → responsive units) ───────────────────── */
const X = (px: number) => `${(px / 1920) * 100}%`;
const Y = (px: number) => `${(px / 1080) * 100}%`;
const C = (px: number) => `${px / 19.2}cqw`;

/* ── data ───────────────────────────────────────────────────────────────── */
interface BannerStat { icon: string; value: string; label: string; }
interface BannerSlide {
  id: string;
  category: string;
  productSlug: string;
  modelName: string;
  description: string;
  image: string;
  stats: [BannerStat, BannerStat, BannerStat];
  /** Per-image tuning — adjust until every machine looks the same visible size. */
  display?: { scale?: number; xOffset?: number; yOffset?: number };
}

const ICON_TONS = "/img/banner/icon-tons.svg";
const ICON_FORCE = "/img/banner/icon-force.svg";
const ICON_HP = "/img/banner/icon-hp.svg";

const SLIDES: BannerSlide[] = [
  {
    id: "skid-steer", category: "SKID STEER", productSlug: "stomp-v980",
    modelName: "STOMP V980",
    description: "Compact loader platform for loading, grading, cleanup, and attachment-driven work.",
    image: "/img/banner/banner-stomp-v980.png",
    display: { scale: 1.09, xOffset: 0, yOffset: 0 },
    stats: [
      { icon: ICON_TONS, value: "Setup", label: "Varies" },
      { icon: ICON_FORCE, value: "Flow", label: "Confirm" },
      { icon: ICON_HP, value: "Power", label: "Configured" },
    ],
  },
  {
    id: "wheel-loader", category: "WHEEL LOADER", productSlug: "skoop-ii",
    modelName: "SKOOP II",
    description: "Material-handling loader for aggregate yards, farms, stockpiles, and cleanup cycles.",
    image: "/img/banner/banner-skoop-ii.png",
    display: { scale: 1.36, xOffset: 0, yOffset: 9 },
    stats: [
      { icon: ICON_TONS, value: "Setup", label: "Varies" },
      { icon: ICON_FORCE, value: "Bucket", label: "Selected" },
      { icon: ICON_HP, value: "Power", label: "Configured" },
    ],
  },
  {
    id: "excavator", category: "EXCAVATOR", productSlug: "kuvuo-2-5",
    modelName: "KUVUO 2.5",
    description: "Controlled digging platform for trenches, drainage, landscaping, and utility access.",
    image: "/img/banner/banner-kuvuo.png",
    display: { scale: 1.33, xOffset: 0, yOffset: 6 },
    stats: [
      { icon: ICON_TONS, value: "Setup", label: "Varies" },
      { icon: ICON_FORCE, value: "Force", label: "Configured" },
      { icon: ICON_HP, value: "Depth", label: "Model-based" },
    ],
  },
  {
    id: "backhoe-loader", category: "BACKHOE LOADER", productSlug: "scoopydig",
    modelName: "SCOOPYDIG",
    description: "Dual-purpose digging and loading machine for utility, farm, and site-service work.",
    image: "/img/banner/banner-scoopydig.png",
    display: { scale: 1.42, xOffset: 0, yOffset: 15 },
    stats: [
      { icon: ICON_TONS, value: "Setup", label: "Varies" },
      { icon: ICON_FORCE, value: "Reach", label: "Confirm" },
      { icon: ICON_HP, value: "Power", label: "Configured" },
    ],
  },
  {
    id: "dumper", category: "DUMPER", productSlug: "thunderdump-1",
    modelName: "THUNDERDUMP",
    description: "Compact material hauler for soil, concrete, aggregate, debris, and narrow access.",
    image: "/img/banner/banner-thunderdump.png",
    display: { scale: 1.15, xOffset: 0, yOffset: 0 },
    stats: [
      { icon: ICON_TONS, value: "Payload", label: "Varies" },
      { icon: ICON_FORCE, value: "Skip", label: "Selected" },
      { icon: ICON_HP, value: "Power", label: "Configured" },
    ],
  },
  {
    id: "towable-excavator", category: "TOWABLE EXCAVATOR", productSlug: "spider-one",
    modelName: "SPIDER ONE",
    description: "Portable excavator for farms, trail work, drainage, and remote property jobs.",
    image: "/img/banner/banner-spider-one.png",
    display: { scale: 1.15, xOffset: 0, yOffset: 9 },
    stats: [
      { icon: ICON_TONS, value: "Tow", label: "Confirm" },
      { icon: ICON_FORCE, value: "Reach", label: "Model-based" },
      { icon: ICON_HP, value: "Power", label: "Configured" },
    ],
  },
  {
    id: "stone-crusher", category: "STONE CRUSHER", productSlug: "stone-crusher-1",
    modelName: "STONE CRUSHER",
    description: "On-site material reduction for rubble, masonry, concrete, asphalt, and stone.",
    image: "/img/banner/banner-stone-crusher.png",
    display: { scale: 1.36, xOffset: 0, yOffset: 12 },
    stats: [
      { icon: ICON_TONS, value: "Setup", label: "Varies" },
      { icon: ICON_FORCE, value: "Output", label: "Material-led" },
      { icon: ICON_HP, value: "Power", label: "Configured" },
    ],
  },
  {
    id: "trencher", category: "TRENCHER", productSlug: "group-ripper-grx",
    modelName: "GROUP RIPPER GRX",
    description: "Narrow-channel trenching for irrigation, drainage, conduit, and utility routing.",
    image: "/img/banner/banner-trencher.png",
    display: { scale: 1.57, xOffset: 0, yOffset: 24 },
    stats: [
      { icon: ICON_TONS, value: "Setup", label: "Varies" },
      { icon: ICON_FORCE, value: "Depth", label: "Chain-led" },
      { icon: ICON_HP, value: "Power", label: "Configured" },
    ],
  },
];

const AUTO_ROTATE_MS = 7000;
const ANIM_MS = 650;
const ANIM_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

/* ── slot system ────────────────────────────────────────────────────────── */
/** Convert "slide i with active a" → signed offset using the shortest wrap. */
function signedOffset(i: number, active: number, n: number) {
  let off = i - active;
  if (off > n / 2) off -= n;
  if (off < -n / 2) off += n;
  return off;
}

interface Slot {
  left: number; top: number; width: number; height: number;
  imgScale: number; blur: number; brightness: number;
  opacity: number; z: number; shadow: string;
}

/**
 * Slot lookup. Coordinates use the 1920×1080 Figma canvas. Sizes are kept close
 * to the original Figma export (centre 632×479, sides 455/401) with a small
 * bump for centre dominance — both side slots are equal size and symmetric.
 * Slot `imgScale` stays close to 1.0; visible-size tuning is per-product via
 * `BannerSlide.display.scale`.
 */
function slotForOffset(off: number, isDark: boolean): Slot {
  // CENTER — dominant but balanced (Figma 632×479)
  if (off === 0) return {
    left: 610, top: 138, width: 700, height: 530,
    imgScale: 1.0, blur: 0, brightness: 1, opacity: 1, z: 5,
    shadow: isDark
      ? "drop-shadow(0 28px 44px rgba(0,0,0,0.7))"
      : "drop-shadow(0 20px 30px rgba(21,61,40,0.15))",
  };
  // LEFT (prev) — secondary, soft (Figma left 455×455)
  if (off === -1) return {
    left: 130, top: 192, width: 430, height: 430,
    imgScale: 0.78, blur: 4, brightness: isDark ? 0.72 : 0.9, opacity: isDark ? 1 : 0.6, z: 3,
    shadow: isDark
      ? "drop-shadow(0 16px 24px rgba(0,0,0,0.4))"
      : "drop-shadow(0 12px 18px rgba(21,61,40,0.1))",
  };
  // RIGHT (next) — equal size to LEFT
  if (off === 1) return {
    left: 1360, top: 192, width: 430, height: 430,
    imgScale: 0.78, blur: 4, brightness: isDark ? 0.72 : 0.9, opacity: isDark ? 1 : 0.6, z: 3,
    shadow: isDark
      ? "drop-shadow(0 16px 24px rgba(0,0,0,0.4))"
      : "drop-shadow(0 12px 18px rgba(21,61,40,0.1))",
  };
  // FAR LEFT — fades in from off-stage during rotation
  if (off === -2) return {
    left: -260, top: 230, width: 360, height: 360,
    imgScale: 0.6, blur: 8, brightness: isDark ? 0.5 : 0.9, opacity: 0, z: 1, shadow: "none",
  };
  // FAR RIGHT
  if (off === 2) return {
    left: 1820, top: 230, width: 360, height: 360,
    imgScale: 0.6, blur: 8, brightness: isDark ? 0.5 : 0.9, opacity: 0, z: 1, shadow: "none",
  };
  // HIDDEN — parked behind centre
  return {
    left: 800, top: 260, width: 320, height: 320,
    imgScale: 0.4, blur: 12, brightness: isDark ? 0.3 : 0.9, opacity: 0, z: 0, shadow: "none",
  };
}

interface MobileStyle {
  translateX: string;
  opacity: number;
  zIndex: number;
  scale: number;
}

function mobileStyleForOffset(off: number, dragOffset: number): MobileStyle {
  // Center
  if (off === 0) {
    return {
      translateX: `${dragOffset}px`,
      opacity: 1 - Math.abs(dragOffset) / 450,
      zIndex: 2,
      scale: 1.0,
    };
  }
  // Left (prev)
  if (off === -1) {
    return {
      translateX: `calc(-100% + ${dragOffset}px)`,
      opacity: dragOffset > 0 ? Math.min(0.8, dragOffset / 100) : 0,
      zIndex: 1,
      scale: 0.8,
    };
  }
  // Right (next)
  if (off === 1) {
    return {
      translateX: `calc(100% + ${dragOffset}px)`,
      opacity: dragOffset < 0 ? Math.min(0.8, -dragOffset / 100) : 0,
      zIndex: 1,
      scale: 0.8,
    };
  }
  // Others
  return {
    translateX: off < 0 ? "-200%" : "200%",
    opacity: 0,
    zIndex: 0,
    scale: 0.6,
  };
}

/* ─────────────────────────────────────────────────────────────────────── */

export const EquipmentBanner: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [active, setActive] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Touch swipe and dragging states
  const [dragOffset, setDragOffset] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [gestureDirection, setGestureDirection] = useState<"horizontal" | "vertical" | null>(null);

  // Custom slide-in/slide-out animation states
  const [animating, setAnimating] = useState(false);
  const [transitionFrom, setTransitionFrom] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev" | null>(null);

  const total = SLIDES.length;
  const slide = SLIDES[active];

  const triggerSlide = useCallback((toIndex: number, direction: "next" | "prev") => {
    if (animating) return;
    if (reduceMotion) {
      setActive(toIndex);
      return;
    }
    setAnimating(true);
    setTransitionFrom(active);
    setSlideDirection(direction);
    setActive(toIndex);

    setTimeout(() => {
      setAnimating(false);
      setTransitionFrom(null);
      setSlideDirection(null);
      setDragOffset(0);
    }, ANIM_MS);
  }, [active, animating, reduceMotion]);

  const goTo = useCallback((i: number) => {
    const toIndex = ((i % total) + total) % total;
    if (toIndex === active || animating) return;
    const offset = signedOffset(toIndex, active, total);
    const direction = offset > 0 ? "next" : "prev";
    triggerSlide(toIndex, direction);
  }, [active, total, triggerSlide, animating]);

  // Respect reduced-motion: no auto-advance, instant slot changes.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const playing = !reduceMotion && !hoverPaused && !userPaused && !animating && !touchStart;
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const nextIdx = (active + 1) % total;
      triggerSlide(nextIdx, "next");
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [playing, total, active, triggerSlide]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(active - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); goTo(active + 1); }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (animating) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setGestureDirection(null);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || animating) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStart.x;
    const diffY = touch.clientY - touchStart.y;

    if (!gestureDirection) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        setGestureDirection("horizontal");
      } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
        setGestureDirection("vertical");
      }
    }

    if (gestureDirection === "horizontal") {
      if (e.cancelable) e.preventDefault();
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || animating) return;

    if (gestureDirection === "horizontal") {
      const threshold = 60; // swipe threshold in px
      if (dragOffset < -threshold) {
        const nextIdx = (active + 1) % total;
        triggerSlide(nextIdx, "next");
      } else if (dragOffset > threshold) {
        const prevIdx = (active - 1 + total) % total;
        triggerSlide(prevIdx, "prev");
      } else {
        setDragOffset(0);
      }
    }
    setTouchStart(null);
    setGestureDirection(null);
  };

  // Reduced-motion: drop fades + transitions
  const fade = reduceMotion ? "" : "animate-fade-in";
  const slotTransition = reduceMotion
    ? "none"
    : `left ${ANIM_MS}ms ${ANIM_EASE}, top ${ANIM_MS}ms ${ANIM_EASE}, width ${ANIM_MS}ms ${ANIM_EASE}, height ${ANIM_MS}ms ${ANIM_EASE}, opacity ${ANIM_MS}ms ${ANIM_EASE}`;
  const imgFilterTransition = reduceMotion
    ? "none"
    : `filter ${ANIM_MS}ms ${ANIM_EASE}, transform ${ANIM_MS}ms ${ANIM_EASE}`;

  // Figma headline = 210px on 1920 (10.94cqw); reduced 15% per request → 9.30cqw,
  // auto-shrinking for longer category names so they never overflow.
  const headlineCqw = Math.min(9.3, 148.8 / slide.category.length);

  const SpecCol = ({ s, scale = 1 }: { s: BannerStat; scale?: number }) => (
    <div className="flex flex-col items-center justify-center" style={{ gap: C(14 * scale) }}>
      <img src={s.icon} alt="" aria-hidden="true" className={isDark ? "" : "invert opacity-80"} style={{ width: C(40 * scale), height: C(40 * scale) }} />
      <div className="flex items-baseline justify-center" style={{ gap: C(8 * scale) }}>
        <span className="font-[Cal_Sans] text-theme-text whitespace-nowrap tabular-nums" style={{ fontSize: C(28 * scale), lineHeight: 1 }}>{s.value}</span>
        <span className="font-[Roboto_Flex] text-theme-muted whitespace-nowrap" style={{ fontSize: C(16 * scale), lineHeight: 1 }}>{s.label}</span>
      </div>
    </div>
  );

  return (
    <section
      className="relative w-full overflow-hidden bg-theme-bg text-theme-text select-none transition-colors duration-200"
      aria-roledescription="carousel"
      aria-label="Featured equipment showcase"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={() => setHoverPaused(false)}
      onKeyDown={onKeyDown}
    >
      <p className="sr-only" aria-live="polite">
        {`${slide.category}, ${slide.modelName}. Slide ${active + 1} of ${total}.`}
      </p>

      {/* ═══════════════ DESKTOP STAGE (lg+) — 1:1 Figma replica ═══════════════ */}
      {/* Container is capped at 1600w so cqw-based typography stays controlled */}
      {/* on ultra-wide monitors and the section height lands ~720–900px sweet spot. */}
      <div
        className="hidden lg:block relative w-full mx-auto"
        style={{ aspectRatio: "1920 / 920", maxWidth: "1600px", containerType: "inline-size" }}
      >
        {/* Spotlight glow */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none z-0"
          style={{
            left: X(591), top: Y(322), width: X(838), height: Y(175),
            background: isDark ? "rgba(217,217,217,0.16)" : "rgba(104,130,91,0.12)", borderRadius: "50%", filter: `blur(${C(100)})`,
          }}
        />



        {/* Giant headline (behind machines, decorative) */}
        <div
          key={`hl-${slide.id}`}
          aria-hidden="true"
          className={`absolute z-[2] left-0 right-0 text-center font-[Malking-Regular] text-theme-accent whitespace-nowrap ${fade}`}
          style={{ top: Y(201), fontSize: `${headlineCqw}cqw`, lineHeight: 1, letterSpacing: C(-4.2) }}
        >
          {slide.category}
        </div>

        {/* ── CAROUSEL: every slide rendered, slot-animated ─────────────── */}
        {SLIDES.map((s, i) => {
          const off = signedOffset(i, active, total);
          const slot = slotForOffset(off, isDark);
          const d = s.display ?? {};
          const productScale = d.scale ?? 1;
          const productX = d.xOffset ?? 0;
          const productY = d.yOffset ?? 0;
          const interactive = slot.z >= 3 && off !== 0;
          const isCenter = off === 0;

          // Scale adjustments for preview slides (preloads)
          let currentProductScale = productScale;
          if (!isCenter) {
            if (s.id === "trencher") {
              currentProductScale = productScale * 0.88; // 12% smaller
            } else if (s.id === "stone-crusher") {
              currentProductScale = productScale * 0.82; // 18% smaller
            }
          }

          // Vertical offset adjustments for preview slides (preloads)
          let currentProductY = productY;
          if (!isCenter) {
            if (s.id === "trencher" || s.id === "excavator") {
              currentProductY = productY - 12; // 12% up
            } else if (s.id === "stone-crusher") {
              currentProductY = productY - 15; // 9% + 6% up
            }
          }

          const label = isCenter
            ? `${s.modelName} — current selection`
            : `Show ${s.category}: ${s.modelName}`;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => { if (!isCenter) goTo(i); }}
              tabIndex={interactive ? 0 : -1}
              aria-hidden={!interactive && !isCenter}
              aria-label={label}
              disabled={isCenter}
              className={`absolute group ${interactive ? "cursor-pointer" : "cursor-default"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-accent`}
              style={{
                left: X(slot.left), top: Y(slot.top),
                width: X(slot.width), height: Y(slot.height),
                opacity: slot.opacity, zIndex: slot.z,
                pointerEvents: slot.opacity === 0 ? "none" : "auto",
                transition: slotTransition,
                background: "transparent",
                border: 0, padding: 0,
              }}
            >
              <img
                src={s.image}
                alt={isCenter ? s.modelName : ""}
                aria-hidden={!isCenter}
                draggable={false}
                decoding="async"
                className={`block w-full h-full object-contain ${interactive ? "group-hover:brightness-90" : ""}`}
                style={{
                  transformOrigin: "center bottom",
                  transform: `translate(${productX}%, ${currentProductY}%) scale(${slot.imgScale * currentProductScale})`,
                  filter: `blur(${slot.blur}px) brightness(${slot.brightness}) ${slot.shadow}`.replace(" none", ""),
                  transition: imgFilterTransition,
                  willChange: "transform, filter",
                }}
              />
            </button>
          );
        })}

        {/* ── Bottom content row (model · specs · CTA) ───────────────── */}
        <div
          className="absolute z-[10] flex items-center justify-between"
          style={{ left: X(329), top: Y(735), width: X(1262) }}
        >
          <div className="flex items-stretch" style={{ gap: C(23) }}>
            <span aria-hidden="true" className="bg-theme-accent shrink-0" style={{ width: C(4), height: C(144) }} />
            <div className="flex flex-col" style={{ gap: C(8) }}>
              <h3 className={`font-clofieBold text-theme-text ${fade}`} key={`name-${slide.id}`} style={{ fontSize: C(42), lineHeight: 1.15 }}>{slide.modelName}</h3>
              <p className={`font-glonimove text-theme-muted ${fade}`} key={`desc-${slide.id}`} style={{ width: C(301), fontSize: C(20), lineHeight: 1.4 }}>{slide.description}</p>
            </div>
          </div>

          <ul className="flex items-center" style={{ gap: C(40) }} aria-label={`${slide.modelName} specifications`}>
            {slide.stats.map((s, i) => (
              <React.Fragment key={`${s.label}-${i}`}>
                <li><SpecCol s={s} /></li>
                {i < slide.stats.length - 1 && (
                  <li aria-hidden="true" className="bg-theme-text/20" style={{ width: 1.5, height: C(52) }} />
                )}
              </React.Fragment>
            ))}
          </ul>

          <Link
            to={`/equipment/${slide.productSlug}`}
            aria-label={`Explore more about ${slide.modelName}`}
            className="inline-flex items-center bg-theme-accent text-theme-bg hover:bg-theme-text hover:text-theme-bg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-accent"
            style={{ paddingInline: C(20), paddingBlock: C(12), gap: C(12) }}
          >
            <span className="font-googleSans font-medium" style={{ fontSize: C(24), letterSpacing: C(-0.48) }}>EXPLORE MORE</span>
            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" aria-hidden="true" style={{ width: C(19), height: "auto" }}>
              <path d="M17.4121 17V1H1.41211M17.4121 1L1.41211 15.4008" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ═══════════════ MOBILE / TABLET (< lg) — stacked ═══════════════ */}
      <div className="lg:hidden relative px-5 pt-16 pb-12 text-center overflow-hidden">
        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[35%] w-[85%] h-[180px] rounded-[50%] blur-[80px]"
          style={{ background: isDark ? "rgba(217,217,217,0.16)" : "rgba(104,130,91,0.12)", zIndex: 0 }}
        />

        {/* Giant headline behind machine */}
        <div
          key={`mhl-${slide.id}`}
          aria-hidden="true"
          className="absolute left-0 right-0 pointer-events-none select-none font-[Malking-Regular] text-theme-accent/25 leading-[0.9] tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 13.5vw, 6.5rem)", zIndex: 1, top: "15%" }}
        >
          {slide.category}
        </div>

        {/* Mobile carousel: hardware accelerated swipable sliding container */}
        <div
          className="relative mt-4 h-[280px] sm:h-[380px] w-full overflow-hidden mx-auto cursor-grab active:cursor-grabbing"
          style={{ maxWidth: "450px", zIndex: 2 }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {SLIDES.map((s, i) => {
            const off = signedOffset(i, active, total);
            // Hide elements far away to save layout rendering effort
            if (Math.abs(off) > 1 && animating) return null;
            if (Math.abs(off) > 1 && !touchStart) return null;

            const mStyle = mobileStyleForOffset(off, dragOffset);
            const d = s.display ?? {};
            const scaleFactor = d.scale ?? 1;
            const xOffset = d.xOffset ?? 0;
            const yOffset = d.yOffset ?? 0;

            const transitionStyle = animating
              ? `transform ${ANIM_MS}ms ${ANIM_EASE}, opacity ${ANIM_MS}ms ${ANIM_EASE}`
              : "none";

            return (
              <img
                key={s.id}
                src={s.image}
                alt={i === active ? s.modelName : ""}
                aria-hidden={i !== active}
                decoding="async"
                draggable={false}
                className={`absolute inset-0 m-auto max-h-[85%] w-auto max-w-[85%] object-contain select-none pointer-events-none ${
                  isDark ? "drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)]" : "drop-shadow-[0_20px_30px_rgba(21,61,40,0.15)]"
                }`}
                style={{
                  opacity: mStyle.opacity,
                  transform: `translate(calc(${xOffset}% + ${mStyle.translateX}), ${yOffset}%) scale(${mStyle.scale * scaleFactor})`,
                  transition: transitionStyle,
                  willChange: animating ? "transform, opacity" : "auto",
                  backfaceVisibility: "hidden",
                  zIndex: mStyle.zIndex,
                }}
              />
            );
          })}
        </div>

        {/* Preload adjacent images */}
        <div style={{ display: "none" }}>
          <img src={SLIDES[(active + 1) % total].image} alt="" />
          <img src={SLIDES[(active - 1 + total) % total].image} alt="" />
        </div>

        {/* Carousel indicators (dots) */}
        <div className="flex items-center justify-center gap-2 mt-4 relative z-10">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === active
                  ? "w-6 bg-theme-accent"
                  : "w-1.5 bg-theme-text/30 hover:bg-theme-text/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Stacked Product Specs Card below */}
        <div className="relative z-10 mt-6 flex items-stretch gap-3.5 text-left max-w-md mx-auto px-1">
          <span aria-hidden="true" className="w-1 bg-theme-accent shrink-0 self-stretch" />
          <div>
            <h3 className={`font-clofieBold text-theme-text text-2xl sm:text-3xl leading-tight ${fade}`} key={`mname-${slide.id}`}>{slide.modelName}</h3>
            <p className={`mt-2 font-glonimove text-theme-muted text-sm sm:text-base leading-snug ${fade}`} key={`mdesc-${slide.id}`}>{slide.description}</p>
          </div>
        </div>

        <ul className="relative z-10 mt-6 flex items-start justify-center gap-5 sm:gap-8" aria-label={`${slide.modelName} specifications`}>
          {slide.stats.map((s, i) => (
            <React.Fragment key={`${s.label}-${i}`}>
              <li className="flex flex-col items-center gap-2">
                <img src={s.icon} alt="" aria-hidden="true" className={`w-8 h-8 sm:w-10 sm:h-10 ${isDark ? "" : "invert opacity-80"}`} />
                <div className="flex items-baseline gap-1.5">
                  <span className="font-[Cal_Sans] text-theme-text text-xl sm:text-2xl leading-none tabular-nums">{s.value}</span>
                  <span className="font-[Roboto_Flex] text-theme-muted text-xs sm:text-sm leading-none">{s.label}</span>
                </div>
              </li>
              {i < slide.stats.length - 1 && <li aria-hidden="true" className="w-px h-10 bg-theme-text/20 self-center opacity-30" />}
            </React.Fragment>
          ))}
        </ul>

        <div className="relative z-10 mt-8">
          <Link
            to={`/equipment/${slide.productSlug}`}
            aria-label={`Explore more about ${slide.modelName}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-theme-accent text-theme-bg hover:bg-theme-text hover:text-theme-bg transition-colors px-8 py-4 font-googleSans font-bold text-base sm:text-lg tracking-wider"
          >
            <span>EXPLORE MORE</span>
            <svg width="18" height="18" viewBox="0 0 19 18" fill="none" aria-hidden="true">
              <path d="M17.4121 17V1H1.41211M17.4121 1L1.41211 15.4008" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EquipmentBanner;
