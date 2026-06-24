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
  const { t } = useI18n();

  return (
    <section
      aria-label={t("auto.appointmentcallout.appointment.callout")}
      className="relative mt-[80px] left-0 h-[375px] w-[1920px] overflow-hidden"
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
        <div className="absolute left-[551px] top-[201px] flex items-center h-[98px] w-[705px] gap-[46px]">
          <img
            className="h-[98.01px] w-[98.01px]"
            alt=""
            aria-hidden="true"
            src="/img/call.png"
          />
          <p className="mt-[1.0px] h-24 w-[559px] [font-family:'Readex_Pro',Helvetica] text-4xl font-semibold leading-[48px] tracking-[0] text-transparent flex flex-wrap items-center">
            <span className="text-white">
              {t("allProducts.appointment")} {t("allProducts.thisCallNow")}{" "}
            </span>
            <a
              className="text-[#d8c79a] underline ml-2"
              href="tel:+12132142203"
              aria-label={t("auto.appointmentcallout.call.now.at")}
            >
              +1 213-214-2203
            </a>
          </p>
        </div>
      </div>
      <a
        href="tel:+12132142203"
        aria-label={t("auto.appointmentcallout.call.us.now")}
        className="absolute left-[1226px] top-[150px] flex items-center justify-center gap-3 h-[75px] w-[271px] border-4 border-solid border-[#d8c79a] hover:bg-[#d8c79a]/10 transition-colors rounded-[3px]"
      >
        <span className="[font-family:'Google_Sans_Flex',Helvetica] text-[21px] font-bold tracking-[0] text-[#d8c79a] leading-none">
          {t("action.callUsNow")}
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
import { useI18n } from "../../../../context/I18nContext";
