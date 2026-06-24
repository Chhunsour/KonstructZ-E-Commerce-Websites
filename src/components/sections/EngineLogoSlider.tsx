import React from "react";

/**
 * Engine brand logo marquee — a homepage band that showcases the engine
 * manufacturers powering Konstructz machines.
 *
 * Distinct from the MachineLogoSlider:
 *  - light / soft-grey background with subtle abstract shapes
 *  - large, bold logos
 *  - smooth, slow, seamless infinite marquee
 *  - the motion NEVER pauses (no pause-on-hover, no drag, no click)
 */

const ENGINE_LOGOS = [
  { alt: "Perkins", src: "/img/engine-logos/perkins.png", h: "h-[52px] sm:h-[72px] md:h-[92px] lg:h-[108px]" },
  { alt: "Yanmar", src: "/img/engine-logos/yanmar.png", h: "h-[40px] sm:h-[56px] md:h-[72px] lg:h-[84px]" },
  { alt: "Kubota", src: "/img/engine-logos/kubota.png", h: "h-[48px] sm:h-[66px] md:h-[84px] lg:h-[98px]" },
  { alt: "Briggs & Stratton", src: "/img/engine-logos/briggs-stratton.png", h: "h-[58px] sm:h-[80px] md:h-[100px] lg:h-[120px]" },
];

interface EngineLogoSliderProps {
  className?: string;
}

export const EngineLogoSlider: React.FC<EngineLogoSliderProps> = ({ className = "" }) => {
  // Three copies guarantee the track always overflows the viewport and the
  // -33.333% shift lands exactly one copy over, so the loop is seamless.
  const track = [...ENGINE_LOGOS, ...ENGINE_LOGOS, ...ENGINE_LOGOS];

  return (
    <div className={`relative w-full overflow-hidden bg-gradient-to-b from-[#f4f3f0] to-[#e7e6e1] flex items-center ${className}`}>
      {/* subtle large abstract background shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-1/3 -left-24 w-[640px] h-[640px] rounded-full bg-black/[0.025]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-1/2 right-[-120px] w-[820px] h-[820px] rounded-full bg-[#68825B]/[0.06]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[300px] rounded-full bg-white/40 blur-[120px]" />

      {/* edge fades so logos appear to flow in and out */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-10 bg-gradient-to-r from-[#f1f0ec] to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10 bg-gradient-to-l from-[#e9e8e3] to-transparent" />

      <style>{`
        @keyframes engineLogoScroll {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.3333%, 0, 0); }
        }
        .engine-marquee-track {
          display: flex;
          width: max-content;
          animation: engineLogoScroll 50s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div className="engine-marquee-track relative">
        {track.map((logo, index) => (
          <div
            key={`${logo.src}-${index}`}
            className="flex items-center justify-center px-[48px] sm:px-[72px] md:px-[96px] lg:px-[120px] shrink-0"
          >
            <img
              className={`${logo.h} w-auto object-contain select-none`}
              alt={logo.alt}
              src={logo.src}
              draggable={false}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngineLogoSlider;
