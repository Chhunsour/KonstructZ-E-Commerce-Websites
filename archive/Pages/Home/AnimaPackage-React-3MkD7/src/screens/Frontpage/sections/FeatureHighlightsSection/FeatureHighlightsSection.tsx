const decorativeHouses = [
  {
    src: "/img/house.svg",
    alt: "",
    className: "left-[1756px] w-[292px] h-[375px] absolute top-[62px]",
  },
  {
    src: "/img/house-1.svg",
    alt: "",
    className: "left-32 w-[202px] h-[350px] absolute top-[62px]",
  },
];

const decorativeGlows = [
  {
    className:
      "absolute top-[180px] left-[166px] w-[318px] h-[318px] bg-[#153d28] rounded-[159px] blur-[75px]",
  },
  {
    className:
      "absolute top-[186px] left-[1616px] w-[394px] h-[394px] bg-[#153d28] rounded-[159px] blur-[75px]",
  },
];

export const FeatureHighlightsSection = (): JSX.Element => {
  return (
    <section
      className="absolute left-0 top-[5426px] h-[375px] w-[1920px] overflow-hidden"
      aria-labelledby="feature-highlights-call-title"
    >
      <div
        className="absolute left-0 top-[-82px] h-[540px] w-[1920px] bg-[#153d28]"
        aria-hidden="true"
      />
      <div
        className="absolute -left-32 top-[-62px] h-[580px] w-[2275px]"
        aria-hidden="true"
      >
        <div className="absolute left-px top-px h-[580px] w-[2275px]">
          {decorativeHouses.map((house) => (
            <img
              key={house.src}
              className={house.className}
              alt={house.alt}
              src={house.src}
            />
          ))}
          {decorativeGlows.map((glow, index) => (
            <div key={index} className={glow.className} />
          ))}
        </div>
      </div>
      <div className="absolute left-[551px] top-[139px] flex h-[98px] w-[705px] gap-[46px]">
        <img
          className="h-[98.01px] w-[98.01px]"
          alt=""
          src="/img/call.png"
          aria-hidden="true"
        />
        <p
          id="feature-highlights-call-title"
          className="mt-[1px] h-24 w-[559px] [font-family:'Readex_Pro',Helvetica] text-4xl font-semibold tracking-[0] leading-[48px] text-transparent"
        >
          <span className="text-white">
            Make An Appointment This Call{"\u2028"}Now{" "}
          </span>
          <a
            href="tel:+12132142203"
            className="text-[#d8c79a] underline"
            aria-label="Call us now at plus one two one three two one four two two zero three"
          >
            <span>+1 213-214-2203</span>
          </a>
        </p>
      </div>
      <a
        href="tel:+12132142203"
        className="absolute left-[1226px] top-[150px] flex h-[75px] w-[271px] border-4 border-solid border-[#d8c79a]"
        aria-label="Call us now at plus one two one three two one four two two zero three"
      >
        <div className="ml-[50px] mt-[23px] flex w-[180px] gap-[5px]">
          <span className="mt-0.5 h-[26px] w-[143px] [font-family:'Google_Sans_Flex',Helvetica] text-[21px] font-bold leading-[normal] tracking-[0] text-[#d8c79a]">
            CALL US NOW
          </span>
          <span
            className="flex h-7 w-[30px] items-start justify-start"
            aria-hidden="true"
          >
            <img className="w-[9.65px] flex-1" alt="" src="/img/vector-9.svg" />
          </span>
        </div>
      </a>
    </section>
  );
};
