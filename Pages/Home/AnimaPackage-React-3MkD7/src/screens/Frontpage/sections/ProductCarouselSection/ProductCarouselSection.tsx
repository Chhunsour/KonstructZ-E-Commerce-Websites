const backgroundVectors = [
  {
    className: "absolute w-[36.15%] h-[6.56%] top-[93.44%] left-[63.85%]",
    alt: "",
    src: "/img/vector.svg",
  },
  {
    className: "absolute w-[7.92%] h-[30.01%] top-[69.99%] left-[92.08%]",
    alt: "",
    src: "/img/vector-1.svg",
  },
  {
    className: "absolute w-[93.91%] h-[29.95%] top-[70.05%] left-[6.09%]",
    alt: "",
    src: "/img/vector-2.svg",
  },
];

const frameDecorations = [{ left: "left-[90px]" }, { left: "left-[1740px]" }];

const ctaButtons = [
  {
    label: "VIEW SPEC",
    className:
      "absolute top-0 left-0 w-[212px] h-[76px] bg-[#153d28] border-[5px] border-solid shadow-[-3px_4px_4px_#00000040]",
    textClassName:
      "absolute top-[21px] left-[35px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-neutral-100 text-[27px] tracking-[-0.27px] leading-[normal]",
    ariaLabel: "View spec for mini excavator",
  },
  {
    label: "BUY MINI EXCAVATOR",
    className:
      "absolute top-0 left-[238px] w-[351px] h-[76px] border-[5px] border-solid border-[#153d28] shadow-[-3px_4px_4px_#00000040]",
    textClassName:
      "absolute top-[21px] left-[267px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-black text-[27px] tracking-[-0.27px] leading-[normal]",
    ariaLabel: "Buy mini excavator",
  },
];

export const ProductCarouselSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="product-carousel-title"
      className="absolute top-[2106px] left-px w-[1920px] h-[1740px] bg-[#ebebeb]"
    >
      <img
        className="absolute top-0 left-[1027px] w-[892px] h-[1225px] pointer-events-none select-none"
        alt=""
        aria-hidden="true"
        src="/img/rainbow.svg"
      />
      <img
        className="absolute top-[222px] left-0 w-[376px] h-[1024px] pointer-events-none select-none"
        alt=""
        aria-hidden="true"
        src="/img/rainbow-1.svg"
      />
      <div
        aria-hidden="true"
        className="absolute top-[817px] left-[922px] w-[692px] h-[692px] bg-[#ebebeb] rounded-[346px] blur-[129.05px]"
      />
      <div
        aria-hidden="true"
        className="absolute top-[888px] left-[45px] w-[692px] h-[692px] bg-[#ebebeb] rounded-[346px] blur-[129.05px]"
      />
      {frameDecorations.map((decoration, index) => (
        <div
          key={index}
          aria-hidden="true"
          className={`absolute top-[${index === 0 ? "1196px" : "1195px"}] ${decoration.left} w-[90px] h-[90px] border-[6px] border-solid border-[#d8c79a] shadow-[-3px_4px_4px_#00000040]`}
        />
      ))}
      {backgroundVectors.map((vector, index) => (
        <img
          key={index}
          className={`${vector.className} pointer-events-none select-none`}
          alt={vector.alt}
          aria-hidden="true"
          src={vector.src}
        />
      ))}
      <div className="absolute top-[1603px] left-[675px] w-[593px] h-[76px]">
        {ctaButtons.map((button, _index) => (
          <button
            key={button.label}
            type="button"
            aria-label={button.ariaLabel}
            className={`${button.className} cursor-pointer transition-opacity duration-200 hover:opacity-90 focus-visible:opacity-90`}
          >
            <span className={button.textClassName}>{button.label}</span>
          </button>
        ))}
      </div>
      <h2
        id="product-carousel-title"
        className="top-[746px] left-[90px] [font-family:'Mission_X-Regular',Helvetica] text-[#153d28] text-7xl whitespace-nowrap absolute font-normal tracking-[0] leading-[normal]"
      >
        Mini Excavator
      </h2>
      <img
        className="absolute top-[822px] left-[88px] w-[342px] h-[34px] pointer-events-none select-none"
        alt=""
        aria-hidden="true"
        src="/img/zig-zag.svg"
      />
      <img
        className="absolute top-[876px] left-[521px] w-[981px] h-[769px] aspect-[1.28] pointer-events-none select-none"
        alt="Mini excavator"
        src="/img/mini-excavator-png-4-1.png"
      />
    </section>
  );
};
