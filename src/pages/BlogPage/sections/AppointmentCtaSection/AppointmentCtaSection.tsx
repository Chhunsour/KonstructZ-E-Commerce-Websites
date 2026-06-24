import { useI18n } from "../../../../context/I18nContext";

export const AppointmentCtaSection = (): JSX.Element => {
  const { t } = useI18n();
  const backgroundDecorations = [
    {
      type: "image",
      className: "absolute top-[62px] left-[1756px] w-[292px] h-[375px]",
      alt: t("auto.appointmentcta.decorative.house"),
      src: "/blog/img/house.svg",
    },
    {
      type: "image",
      className: "absolute top-[62px] left-32 w-[202px] h-[350px]",
      alt: t("auto.appointmentcta.decorative.house"),
      src: "/blog/img/house-1.svg",
    },
    {
      type: "blur",
      className:
        "absolute top-[180px] left-[166px] w-[318px] h-[318px] bg-[#153d28] rounded-[159px] blur-[75px]",
    },
    {
      type: "blur",
      className:
        "absolute top-[186px] left-[1616px] w-[394px] h-[394px] bg-[#153d28] rounded-[159px] blur-[75px]",
    },
  ]
  return (
    <section
      className="top-[3739px] h-[375px] overflow-hidden absolute left-0 w-[1920px]"
      aria-labelledby="appointment-cta-heading"
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
          {backgroundDecorations.map((item, index) =>
            item.type === "image" ? (
              <img
                key={`decoration-${index}`}
                className={item.className}
                alt={item.alt}
                src={item.src}
              />
            ) : (
              <div key={`decoration-${index}`} className={item.className} />
            ),
          )}
        </div>
      </div>
      <div className="absolute top-[201px] left-[551px] w-[705px] h-[98px] flex gap-[46px] items-start">
        <img
          className="w-[98.01px] h-[98.01px]"
          alt=""
          src="/blog/img/call.png"
          aria-hidden="true"
        />
        <h2
          id="appointment-cta-heading"
          className="mt-[1.0px] w-[559px] h-24 [font-family:'Readex_Pro',Helvetica] font-semibold text-transparent text-4xl tracking-[0] leading-[48px] not-italic"
        >
          <span className="text-white">{t("auto.appointmentcta.make.an.appointment")}</span>
          <a
            href="tel:+12132142203"
            className="text-[#d8c79a] underline"
            aria-label={t("auto.appointmentcta.call.now.at")}
          >
            +1 213-214-2203
          </a>
        </h2>
      </div>
      <a
        href="tel:+12132142203"
        className="absolute top-[150px] left-[1226px] w-[271px] h-[75px] flex border-4 border-solid border-[#d8c79a] items-start justify-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8c79a] btn"
        aria-label={t("auto.appointmentcta.call.us.now")}
      >
        <div className="mt-[23px] w-[180px] ml-[50px] flex gap-[5px] items-start">
          <span className="mt-0.5 w-[143px] h-[26px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#d8c79a] text-[21px] tracking-[0] leading-[normal] whitespace-nowrap btn">{t("auto.appointmentcta.call.us.now")}</span>
          <span
            className="w-[30px] h-7 flex items-center justify-start"
            aria-hidden="true"
          >
            <img className="flex-1 w-[9.65px]" alt="" src="/blog/img/vector-9.svg" />
          </span>
        </div>
      </a>
    </section>
  );
};
