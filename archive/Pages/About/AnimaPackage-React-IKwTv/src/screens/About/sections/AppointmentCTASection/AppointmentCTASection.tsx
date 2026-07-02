const backgroundHouses = [
  {
    src: "/img/house.svg",
    alt: "",
    className: "left-[1756px] w-72 h-[375px] absolute top-[62px]",
  },
  {
    src: "/img/house-1.svg",
    alt: "",
    className: "left-32 w-[202px] h-[350px] absolute top-[62px]",
  },
];

export const AppointmentCTASection = (): JSX.Element => {
  return (
    <section
      className="absolute top-[5679px] left-1 h-[375px] w-[1920px] overflow-hidden"
      aria-labelledby="appointment-cta-heading"
    >
      <div
        className="absolute left-0 top-[-82px] h-[540px] w-[1920px] bg-[#153d28]"
        aria-hidden="true"
      />
      <div className="absolute -left-32 top-[-62px] h-[580px] w-[2275px]">
        <div
          className="absolute left-px top-px h-[580px] w-[2275px]"
          aria-hidden="true"
        >
          {backgroundHouses.map((image) => (
            <img
              key={image.src}
              className={image.className}
              alt={image.alt}
              src={image.src}
            />
          ))}
          <div className="absolute left-[166px] top-[180px] h-[318px] w-[318px] rounded-[159px] bg-[#153d28] blur-[75px]" />
          <div className="absolute left-[1616px] top-[186px] h-[394px] w-[394px] rounded-[159px] bg-[#153d28] blur-[75px]" />
        </div>
        <div className="absolute left-[551px] top-[201px] flex h-[98px] w-[705px] items-start gap-[46px]">
          <img
            className="h-[98.01px] w-[98.01px] shrink-0"
            alt="Call icon"
            src="/img/call.png"
          />
          <h2
            id="appointment-cta-heading"
            className="mt-[1px] h-24 w-[559px] [font-family:'Readex_Pro',Helvetica] text-4xl font-semibold leading-[48px] tracking-[0] text-transparent"
          >
            <span className="text-white">
              Make An Appointment This Call Now{" "}
            </span>
            <a
              href="tel:+12132142203"
              className="text-[#d8c79a] underline"
              aria-label="Call now at plus 1 213 214 2203"
            >
              +1 213-214-2203
            </a>
          </h2>
        </div>
      </div>
      <a
        href="tel:+12132142203"
        className="absolute left-[1226px] top-[150px] flex h-[75px] w-[271px] items-start border-4 border-solid border-[#d8c79a]"
        aria-label="Call us now at plus 1 213 214 2203"
      >
        <span className="ml-[50px] mt-[23px] flex w-[180px] gap-[5px]">
          <span className="mt-0.5 h-[26px] w-[143px] [font-family:'Google_Sans_Flex',Helvetica] text-[21px] font-bold leading-[normal] tracking-[0] text-[#d8c79a]">
            CALL US NOW
          </span>
          <span className="flex h-7 w-[30px] items-center" aria-hidden="true">
            <img className="w-[9.65px] flex-1" alt="" src="/img/vector-9.svg" />
          </span>
        </span>
      </a>
    </section>
  );
};
