const decorativeImages = [
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

const decorativeBlurs = [
  "absolute top-[180px] left-[166px] w-[318px] h-[318px] bg-[#153d28] rounded-[159px] blur-[75px]",
  "absolute top-[186px] left-[1616px] w-[394px] h-[394px] bg-[#153d28] rounded-[159px] blur-[75px]",
];

export const AppointmentCalloutSection = (): JSX.Element => {
  return (
    <section
      aria-label="Appointment callout"
      className="absolute top-[6357px] left-0 h-[375px] w-[1920px] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute left-0 top-[-82px] h-[540px] w-[1920px] bg-[#153d28]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-32 top-[-62px] h-[580px] w-[2275px]"
      >
        <div className="absolute left-px top-px h-[580px] w-[2275px]">
          {decorativeImages.map(({ src, alt, className }) => (
            <img key={src} className={className} alt={alt} src={src} />
          ))}
          {decorativeBlurs.map((className, index) => (
            <div key={index} className={className} />
          ))}
        </div>
        <div className="absolute left-[551px] top-[201px] flex h-[98px] w-[705px] gap-[46px]">
          <img
            className="h-[98.01px] w-[98.01px]"
            alt=""
            aria-hidden="true"
            src="/img/call.png"
          />
          <p className="mt-[1.0px] h-24 w-[559px] [font-family:'Readex_Pro',Helvetica] text-4xl font-semibold leading-[48px] tracking-[0] text-transparent">
            <span className="text-white">
              Make An Appointment This Call Now{" "}
            </span>
            <a
              className="text-[#d8c79a] underline"
              href="tel:+12132142203"
              aria-label="Call now at plus one two one three two one four two two zero three"
            >
              +1 213-214-2203
            </a>
          </p>
        </div>
      </div>
      <a
        href="tel:+12132142203"
        aria-label="Call us now at plus one two one three two one four two two zero three"
        className="absolute left-[1226px] top-[150px] flex h-[75px] w-[271px] border-4 border-solid border-[#d8c79a]"
      >
        <span className="ml-[50px] mt-[23px] flex w-[180px] gap-[5px]">
          <span className="mt-0.5 h-[26px] w-[143px] [font-family:'Google_Sans_Flex',Helvetica] text-[21px] font-bold leading-[normal] tracking-[0] text-[#d8c79a]">
            CALL US NOW
          </span>
          <span className="flex h-7 w-[30px] items-start" aria-hidden="true">
            <img
              className="w-[9.65px] flex-1"
              alt=""
              src="/img/vector-9-1.svg"
            />
          </span>
        </span>
      </a>
    </section>
  );
};
