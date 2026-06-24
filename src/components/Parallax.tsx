import React, { useEffect, useRef } from "react";

/**
 * Lightweight scroll-driven parallax wrapper.
 *
 * Listens to window scroll (RAF-throttled), measures the element's position
 * relative to viewport, and sets `--parallax-y` on it. The home-reveal CSS
 * picks this up and translates the element on the Y axis.
 *
 * Honors prefers-reduced-motion (no transform applied).
 *
 *   strength  — how much the element moves relative to scroll.
 *               0.0 = no movement, 0.2 = subtle, 0.5 = strong. Default 0.2.
 *   axis      — "y" (default) or "x".
 *   className — passes through; element is rendered as a div.
 */
interface ParallaxProps {
  children: React.ReactNode;
  strength?: number;
  axis?: "y" | "x";
  className?: string;
  style?: React.CSSProperties;
  ariaHidden?: boolean;
  as?: "div" | "section" | "span";
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  strength = 0.2,
  axis = "y",
  className = "",
  style,
  ariaHidden,
  as = "div",
}) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let pending = false;

    const update = () => {
      pending = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Element centre relative to viewport centre, in [-1, 1] roughly
      const centreOffset = rect.top + rect.height / 2 - vh / 2;
      const range = vh + rect.height;
      const t = Math.max(-1, Math.min(1, centreOffset / range));
      const offset = t * strength * vh * 0.5; // px to shift
      if (axis === "y") {
        el.style.setProperty("--parallax-y", `${-offset}px`);
      } else {
        el.style.setProperty("--parallax-y", `0px`);
        el.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [strength, axis]);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      data-parallax=""
      className={className}
      style={style}
      aria-hidden={ariaHidden}
    >
      {children}
    </Tag>
  );
};
