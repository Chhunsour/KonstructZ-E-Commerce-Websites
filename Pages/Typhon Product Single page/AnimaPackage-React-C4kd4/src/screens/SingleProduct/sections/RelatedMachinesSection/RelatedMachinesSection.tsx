const backgroundDecorations = [
  {
    src: "/img/house.svg",
    alt: "",
    className: "absolute top-[62px] left-[1756px] w-[292px] h-[375px]",
  },
  {
    src: "/img/house-1.svg",
    alt: "",
    className: "absolute top-[62px] left-32 w-[202px] h-[350px]",
  },
];

const glowDecorations = [
  "absolute top-[180px] left-[166px] w-[318px] h-[318px] bg-[#153d28] rounded-[159px] blur-[75px]",
  "absolute top-[186px] left-[1616px] w-[394px] h-[394px] bg-[#153d28] rounded-[159px] blur-[75px]",
];

export const RelatedMachinesSection = (): JSX.Element => {
  return (
    <section
      className="absolute top-[3729px] left-0 w-[1920px] h-[375px] overflow-hidden"
      aria-label="Call to action"
    >
      <div
        className="absolute top-[-82px] left-0 w-[1920px] h-[540px] bg-[#153d28]"
        aria-hidden="true"
      />
      <div
        className="absolute w-[2275px] h-[580px] top-[-62px] -left-32"
        aria-hidden="true"
      >
        <div className="absolute top-px left-px w-[2275px] h-[580px]">
          {backgroundDecorations.map(({ src, alt, className }) => (
            <img key={src} className={className} alt={alt} src={src} />
          ))}
          {glowDecorations.map((className, index) => (
            <div key={index} className={className} />
          ))}
        </div>
      </div>
      <div className="absolute top-[201px] left-[551px] flex w-[705px] h-[98px] gap-[46px] items-start">
        <img
          className="w-[98.01px] h-[98.01px]"
          alt="Phone icon"
          src="/img/call.png"
        />
        <p className="mt-[1px] w-[559px] h-24 [font-family:'Readex_Pro',Helvetica] font-semibold text-transparent text-4xl tracking-[0] leading-[48px]">
          <span className="text-white">Make An Appointment This Call Now </span>
          <a
            href="tel:+12132142203"
            className="text-[#d8c79a] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8c79a]"
            aria-label="Call now at plus 1 213 214 2203"
          >
            +1 213-214-2203
          </a>
        </p>
      </div>
      <a
        href="tel:+12132142203"
        className="absolute top-[150px] left-[1226px] flex w-[271px] h-[75px] border-4 border-solid border-[#d8c79a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8c79a]"
        aria-label="Call us now at plus 1 213 214 2203"
      >
        <span className="mt-[23px] ml-[50px] flex w-[180px] gap-[5px]">
          <span className="mt-0.5 h-[26px] w-[143px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#d8c79a] text-[21px] tracking-[0] leading-[normal]">
            CALL US NOW
          </span>
          <span
            className="flex h-7 w-[30px] items-center justify-start"
            aria-hidden="true"
          >
            <img className="w-[9.65px]" alt="" src="/img/vector-9-1.svg" />
          </span>
        </span>
      </a>
    </section>
  );
};
