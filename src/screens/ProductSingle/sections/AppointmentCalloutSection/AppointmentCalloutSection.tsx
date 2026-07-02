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
          <div className="relative h-[98px] w-[98px] rounded-full flex items-center justify-center shrink-0">
            {/* Animated double ripple/breath rings */}
            <div className="absolute inset-0 rounded-full bg-[#d8c79a]/5 border border-[#d8c79a]/20 scale-110 animate-[ping_3s_ease-in-out_infinite]" />
            <div className="absolute inset-0 rounded-full bg-[#d8c79a]/10 border border-[#d8c79a]/30 scale-100" />
            
            {/* Inner solid circular glass container */}
            <div className="relative h-16 w-16 rounded-full bg-[#d8c79a]/15 backdrop-blur-sm border border-[#d8c79a]/50 flex items-center justify-center shadow-[0_0_15px_rgba(216,199,154,0.3)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d8c79a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
          </div>
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
