import { useI18n } from "../../../../context/I18nContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Reveal } from "../../../../components/Reveal";
import { Parallax } from "../../../../components/Parallax";

const frameDecorations = [{ left: "left-[77px]" }, { left: "left-[1766px]" }];



export const ProductCarouselSection = (): JSX.Element => {
  const { t } = useI18n();
  const ctaButtons = [
    {
      label: t("auto.productcarousel.view.spec"),
      className:
        "w-[180px] h-[65px] bg-[#153d28] border-[4px] border-solid border-[#153d28] shadow-[-3px_4px_4px_#00000040] flex items-center justify-center font-googleSans font-bold text-neutral-100 text-[23px] tracking-[-0.23px] leading-[normal]",
      ariaLabel: t("auto.productcarousel.view.spec.for"),
      hasIcon: false,
    },
    {
      label: t("auto.productcarousel.buy.now"),
      className:
        "w-[298px] h-[65px] bg-transparent border-[4px] border-solid border-[#153d28] shadow-[-3px_4px_4px_#00000040] flex items-center justify-center gap-2 text-[#153d28] font-googleSans font-bold text-[23px] tracking-[-0.23px] leading-[normal]",
      ariaLabel: t("auto.productcarousel.buy.product"),
      hasIcon: true,
    },
  ];

  const products = [
    {
      id: "scoopydig",
      title: t("auto.productcarousel.mini.excavator"),
      imageSrc: "/img/mini-excavator-png-4-1.webp",
      scale: 1.05,
      translateY: 20,
    },
    {
      id: "spider-one",
      title: t("auto.productcarousel.spider.one"),
      imageSrc: "/img/spider-one.webp",
      scale: 1.25,
      translateY: 144,
    },
    {
      id: "stomp-v950",
      title: t("auto.productcarousel.skid.steer.loader"),
      imageSrc: "/img/skid-steer-loader.webp",
      scale: 1.15,
      translateY: 35,
    },
    {
      id: "groundripper-grx",
      title: t("auto.productcarousel.ground.ripper"),
      imageSrc: "/img/groundripper-swipe.webp",
      scale: 1.2,
      translateY: 25,
    },
    {
      id: "scoopydig",
      title: t("auto.productcarousel.scoopy.dig"),
      imageSrc: "/img/scoopy-dig-swipe.webp",
      scale: 1.35,
      translateY: 10,
    },
    {
      id: "skoop-ii",
      title: "K-LOAD 1200",
      imageSrc: "/img/skoop-swipe.webp",
      scale: 1.25,
      translateY: 35,
    },
    {
      id: "thunderdump",
      title: t("auto.productcarousel.thunderdump.2"),
      imageSrc: "/img/thunderdump-2.webp",
      scale: 1.18,
      translateY: 73,
    },
    {
      id: "thunderdump",
      title: t("auto.productcarousel.thunderdump.2.alt"),
      imageSrc: "/img/thunderdump-2-alt.webp",
      scale: 1.15,
      translateY: 40,
    },
  ];

  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionState, setTransitionState] = useState<{
    prevIndex: number | null;
    direction: "next" | "prev" | null;
  }>({ prevIndex: null, direction: null });

  const handleSlide = (targetIndex: number, dir: "next" | "prev") => {
    if (transitionState.direction !== null) return; // prevent spamming clicks
    setTransitionState({ prevIndex: activeIndex, direction: dir });
    setActiveIndex(targetIndex);

    setTimeout(() => {
      setTransitionState({ prevIndex: null, direction: null });
    }, 500); // 500ms slide duration
  };

  const handlePrev = () => {
    const target = activeIndex === 0 ? products.length - 1 : activeIndex - 1;
    handleSlide(target, "prev");
  };

  const handleNext = () => {
    const target = activeIndex === products.length - 1 ? 0 : activeIndex + 1;
    handleSlide(target, "next");
  };

  const activeProduct = products[activeIndex];

  return (
    <section
      aria-labelledby="product-carousel-title"
      className="absolute top-[2106px] left-px w-[1920px] h-[1479px] bg-[#ebebeb] overflow-hidden"
    >
      <Parallax strength={0.18} ariaHidden className="absolute top-0 left-[1162px] w-[758px] h-[1041px] pointer-events-none select-none">
        <img loading="lazy" decoding="async"
          className="h-full w-full"
          alt=""
          aria-hidden="true"
          src="/img/rainbow.svg"
        />
      </Parallax>
      <Parallax strength={0.22} ariaHidden className="absolute top-[189px] left-0 w-[320px] h-[870px] pointer-events-none select-none">
        <img loading="lazy" decoding="async"
          className="h-full w-full"
          alt=""
          aria-hidden="true"
          src="/img/rainbow-1.svg"
        />
      </Parallax>
      <div
        aria-hidden="true"
        className="absolute top-[694px] left-[784px] w-[588px] h-[588px] bg-[#ebebeb] rounded-[294px] blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="absolute top-[755px] left-[38px] w-[588px] h-[588px] bg-[#ebebeb] rounded-[294px] blur-[110px]"
      />

      {/* Engine brand logos — infinite marquee, no background, no pause on hover */}
      <style>{`
        @keyframes engineLogoScroll {
          from { transform: translate3d(0,0,0); }
          to   { transform: translate3d(-50%,0,0); }
        }
        .engine-logo-marquee { pointer-events: none; }
        .engine-logo-track {
          display: flex;
          width: max-content;
          animation: engineLogoScroll 45s linear infinite;
          will-change: transform;
        }
      `}</style>
      <div
        className="engine-logo-marquee absolute top-[180px] left-0 w-[1920px] h-[280px] overflow-hidden z-20 flex items-center"
        aria-label="Engine brand partners"
      >
        <div className="engine-logo-track items-center">
          {[
            { src: "/img/engine-logos/perkins.png", alt: "Perkins", h: 200 },
            { src: "/img/engine-logos/yanmar.png", alt: "Yanmar", h: 170 },
            { src: "/img/engine-logos/kubota.png", alt: "Kubota", h: 200 },
            { src: "/img/engine-logos/briggs-stratton.png", alt: "Briggs & Stratton", h: 220 },
            { src: "/img/engine-logos/perkins.png", alt: "Perkins", h: 200 },
            { src: "/img/engine-logos/yanmar.png", alt: "Yanmar", h: 170 },
            { src: "/img/engine-logos/kubota.png", alt: "Kubota", h: 200 },
            { src: "/img/engine-logos/briggs-stratton.png", alt: "Briggs & Stratton", h: 220 },
          ].map((logo, i) => (
            <div key={i} className="shrink-0 flex items-center justify-center px-[110px]">
              <img loading="lazy" decoding="async"
                src={logo.src}
                alt={logo.alt}
                style={{ height: logo.h }}
                className="w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slider navigation buttons */}
      {frameDecorations.map((decoration, index) => {
        const isPrev = index === 0;
        return (
          <button
            key={index}
            type="button"
            onClick={isPrev ? handlePrev : handleNext}
            aria-label={isPrev ? "Previous product" : t("auto.productcarousel.next.product")}
            className={`group absolute top-[1016px] ${decoration.left} w-[92px] h-[76px] flex items-center justify-center cursor-pointer z-10 bg-[#153d28] border border-[#d8c79a]/50 rounded-[3px] shadow-[0_10px_24px_rgba(21,61,40,0.22)] transition-all duration-200 hover:bg-[#d8c79a] hover:border-[#153d28]/25 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(21,61,40,0.28)] active:translate-y-0 active:shadow-[0_6px_14px_rgba(21,61,40,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#153d28]`}
          >
            <svg
              className={`relative w-8 h-8 text-[#d8c79a] transition-all duration-200 group-hover:text-[#153d28] ${
                isPrev ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {isPrev ? (
                <>
                  <path d="M13.5 6.5 8 12l5.5 5.5" />
                  <path d="M8.5 12H20" />
                </>
              ) : (
                <>
                  <path d="M10.5 6.5 16 12l-5.5 5.5" />
                  <path d="M4 12h11.5" />
                </>
              )}
            </svg>
          </button>
        );
      })}

      <Reveal as="h2" variant="slide-l"
        ariaLabelledBy="product-carousel-title"
        className="top-[634px] left-[77px] [font-family:'Mission_X-Regular',Helvetica] text-[#153d28] text-[61px] whitespace-nowrap absolute font-normal tracking-[0] leading-[normal]"
      >
        <span id="product-carousel-title">{activeProduct.title}</span>
      </Reveal>
      <Reveal variant="reveal-x" delay={220} ariaHidden className="absolute top-[699px] left-[75px] w-[291px] h-[29px] pointer-events-none select-none">
        <img loading="lazy" decoding="async"
          className="h-full w-full"
          alt=""
          aria-hidden="true"
          src="/img/zig-zag.svg"
        />
      </Reveal>
      
      {/* Product Image Slider Contain Box (Full width of screen to enable sliding from the edge) */}
      <div className="absolute top-[650px] left-0 w-[1920px] h-[800px] flex items-end justify-center pb-[40px] pointer-events-none select-none z-10 overflow-hidden">
        {/* Style block for screen-edge transitions */}
        <style>{`
          @keyframes slideOutLeft {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(-1920px); opacity: 0; }
          }
          @keyframes slideInRight {
            0% { transform: translateX(1920px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOutRight {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(1920px); opacity: 0; }
          }
          @keyframes slideInLeft {
            0% { transform: translateX(-1920px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
        `}</style>

        {transitionState.direction === null ? (
          <div className="absolute w-full h-full flex items-end justify-center pb-[40px]">
            <img loading="lazy" decoding="async"
              className="max-w-[1100px] max-h-[580px] object-contain transition-all duration-300"
              alt={activeProduct.title}
              src={activeProduct.imageSrc}
              style={{ transform: `scale(${activeProduct.scale}) translateY(${activeProduct.translateY}px)` }}
            />
          </div>
        ) : (
          <>
            {/* Slide leaving */}
            <div
              className="absolute w-full h-full flex items-end justify-center pb-[40px]"
              style={{
                animation: transitionState.direction === "next"
                  ? "slideOutLeft 500ms ease-in-out forwards"
                  : t("auto.productcarousel.slideoutright.500ms.ease")
              }}
            >
              <img loading="lazy" decoding="async"
                className="max-w-[1100px] max-h-[580px] object-contain"
                alt={products[transitionState.prevIndex!].title}
                src={products[transitionState.prevIndex!].imageSrc}
                style={{
                  transform: `scale(${products[transitionState.prevIndex!].scale}) translateY(${products[transitionState.prevIndex!].translateY}px)`
                }}
              />
            </div>

            {/* Slide entering */}
            <div
              className="absolute w-full h-full flex items-end justify-center pb-[40px]"
              style={{
                animation: transitionState.direction === "next"
                  ? "slideInRight 500ms ease-in-out forwards"
                  : t("auto.productcarousel.slideinleft.500ms.ease")
              }}
            >
              <img loading="lazy" decoding="async"
                className="max-w-[1100px] max-h-[580px] object-contain"
                alt={activeProduct.title}
                src={activeProduct.imageSrc}
                style={{
                  transform: `scale(${activeProduct.scale}) translateY(${activeProduct.translateY}px)`
                }}
              />
            </div>
          </>
        )}
      </div>
      
      {/* Action Buttons */}
      <Reveal variant="rise" delay={120} className="absolute top-[1363px] left-0 w-full flex items-center justify-center gap-[22px] z-20">
        {ctaButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={() => {
              if (button.label === "VIEW SPEC") {
                navigate(`/equipment/${activeProduct.id}`);
              } else {
                navigate(`/contact?product=${activeProduct.id}`);
              }
            }}
            aria-label={`${button.ariaLabel} for ${activeProduct.title}`}
            className={`${button.className} k-btn-lift cursor-pointer hover:opacity-90 focus-visible:opacity-90 z-20`}
          >
            <span>{button.label === "BUY NOW" ? `BUY ${activeProduct.title.toUpperCase()}` : button.label}</span>
            {button.hasIcon && (
              <img loading="lazy" decoding="async"
                src="/img/vector.svg"
                alt=""
                className="w-[12px] h-[20px] object-contain pointer-events-none select-none ml-1"
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </Reveal>
    </section>
  );
};
