import { useI18n } from "../../../../context/I18nContext";
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
  const { t } = useI18n();
  return (
    <section
      className="absolute top-[5524px] left-1 h-[375px] w-[1920px] overflow-hidden"
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
        <div className="absolute left-[551px] top-[201px] flex items-center h-[98px] w-[705px] gap-[46px]">
          <img
            className="h-[98.01px] w-[98.01px] shrink-0"
            alt={t("auto.appointmentcta.call.icon")}
            src="/img/call.png"
          />
          <h2
            id="appointment-cta-heading"
            className="mt-[1px] h-24 w-[559px] [font-family:'Readex_Pro',Helvetica] text-[28px] font-semibold leading-[36px] tracking-[0] text-transparent flex flex-wrap items-center"
          >
            <span className="text-white">
              Make An Appointment This Call Now{" "}
            </span>
            <a
              href="tel:+12132142203"
              className="text-[#d8c79a] underline ml-2"
              aria-label={t("auto.appointmentcta.call.now.at")}
            >
              +1 213-214-2203
            </a>
          </h2>
        </div>
      </div>
      <a
        href="tel:+12132142203"
        className="absolute left-[1226px] top-[150px] flex items-center justify-center gap-3 h-[75px] w-[271px] border-4 border-solid border-[#d8c79a] hover:bg-[#d8c79a]/10 transition-colors rounded-[3px]"
        aria-label={t("auto.appointmentcta.call.us.now")}
      >
        <span className="[font-family:'Google_Sans_Flex',Helvetica] text-[22px] font-bold tracking-[0] text-[#d8c79a] leading-none">
          {t("auto.appointmentcta.call.us.now")}
        </span>
        <img
          className="w-[10px] h-[16px] object-contain"
          alt=""
          aria-hidden="true"
          src="/img/vector-9.svg"
        />
      </a>
    </section>
  );
};
