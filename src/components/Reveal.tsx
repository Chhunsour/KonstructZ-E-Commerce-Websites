import React, { useEffect, useRef, useState } from "react";

type Variant =
  | "fade"
  | "rise"
  | "fall"
  | "zoom"
  | "zoom-out"
  | "left"
  | "right"
  | "blur"
  | "cinematic"
  | "default";

interface RevealProps {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  /** Render element type. Default `div`. */
  as?: "div" | "section" | "h1" | "h2" | "h3" | "p" | "img" | "span" | "article" | "header";
  className?: string;
  ariaLabel?: string;
  ariaHidden?: boolean;
  ariaLabelledBy?: string;
  src?: string;
  alt?: string;
  style?: React.CSSProperties;
}

/**
 * Local-state scroll-reveal wrapper used only on the homepage.
 * Works across React StrictMode double-mount and parent re-renders because
 * the revealed state is owned by the wrapper component itself.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = "default",
  delay = 0,
  as = "div",
  className = "",
  ariaLabel,
  ariaHidden,
  ariaLabelledBy,
  src,
  alt,
  style,
}) => {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const inView = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      // 8% of element must be in view to count as revealed
      const margin = Math.max(20, r.height * 0.08);
      return r.top < vh - margin && r.bottom > margin;
    };

    if (inView()) {
      setRevealed(true);
      return;
    }

    // Primary path: IntersectionObserver (efficient).
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    observer.observe(el);

    // Fallback path: scroll/resize listener. Belt-and-suspenders so this also
    // works in environments where IntersectionObserver is throttled or doesn't
    // fire reliably (some headless renderers, background tabs, etc.).
    let scheduled = false;
    const check = () => {
      scheduled = false;
      if (inView()) {
        setRevealed(true);
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Safety net — if neither the observer nor the scroll listener fires
    // (rare: headless renderers, throttled tabs, mid-update layout race),
    // reveal anyway so content never gets stuck invisible for real users.
    const safety = window.setTimeout(() => {
      setRevealed(true);
    }, 1800);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(safety);
    };
  }, [revealed]);

  const Tag = as as React.ElementType;

  const computedStyle: React.CSSProperties = {
    ...(delay ? ({ ["--reveal-delay" as never]: `${delay}ms` } as React.CSSProperties) : {}),
    ...style,
  };

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={variant}
      data-revealed={revealed ? "true" : undefined}
      style={computedStyle}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      aria-labelledby={ariaLabelledBy}
      src={src}
      alt={alt}
    >
      {children}
    </Tag>
  );
};
