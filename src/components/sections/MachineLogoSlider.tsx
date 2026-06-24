import React from "react";

const MACHINE_LOGOS = [
  { alt: "Ground Ripper", src: "/img/machine-logos/ground-ripper-logo.png", h: "h-[28px] sm:h-[34px] md:h-[40px]" },
  { alt: "Scoopy Dig", src: "/img/machine-logos/scoopy-dig-logo.png", h: "h-[30px] sm:h-[36px] md:h-[42px]" },
  { alt: "Stomp", src: "/img/machine-logos/stomp-logo.png", h: "h-[34px] sm:h-[40px] md:h-[46px]" },
  { alt: "ThunderDump", src: "/img/machine-logos/thunderdump-logo.png", h: "h-[37px] sm:h-[44px] md:h-[51px]" },
  { alt: "Skoop 2", src: "/img/machine-logos/skoop-2-logo.png", h: "h-[32px] sm:h-[38px] md:h-[44px]" },
  { alt: "Spider One", src: "/img/machine-logos/spider-one-logo.png", h: "h-[40px] sm:h-[46px] md:h-[52px]" },
  { alt: "Stone Krusher", src: "/img/machine-logos/stone-krusher-logo.png", h: "h-[38px] sm:h-[44px] md:h-[50px]" },
];

interface MachineLogoSliderProps {
  className?: string;
}

export const MachineLogoSlider: React.FC<MachineLogoSliderProps> = ({ className = "" }) => {
  // Duplicate logos three times to ensure it covers screens of all sizes continuously
  const duplicatedLogos = [...MACHINE_LOGOS, ...MACHINE_LOGOS, ...MACHINE_LOGOS];

  const hasBg = className.includes("bg-");
  const bgClass = hasBg ? "" : "bg-[#070806]";

  return (
    <>
      <style>{`
        @keyframes machineLogoScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333333%, 0, 0);
          }
        }
        .machine-marquee-track {
          display: flex;
          width: max-content;
          animation: machineLogoScroll 30s linear infinite;
          will-change: transform;
        }
        .machine-marquee-container:hover .machine-marquee-track {
          animation-play-state: paused;
        }
      `}</style>
      <div 
        className={`machine-marquee-container w-full h-full overflow-hidden flex items-center border-y border-theme-border/10 select-none py-6 sm:py-8 md:py-10 ${bgClass} ${className}`}
      >
        <div className="machine-marquee-track">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.src}-${index}`}
              className="flex items-center justify-center px-[35px] sm:px-[50px] md:px-[70px] lg:px-[85px] shrink-0"
            >
              <img
                className={`${logo.h} w-auto object-contain opacity-85 hover:opacity-100 hover:scale-[1.04] transition-all duration-300`}
                alt={logo.alt}
                src={logo.src}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MachineLogoSlider;
