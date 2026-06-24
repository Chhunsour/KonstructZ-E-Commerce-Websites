import { useI18n } from "../../../../context/I18nContext";
const decorativeImages = [
  {
    src: "/all-products/img/house.svg",
    alt: "",
    className: "absolute top-[62px] left-[1756px] w-[291px] h-[375px]",
  },
  {
    src: "/all-products/img/house-1.svg",
    alt: "",
    className: "absolute top-[62px] left-32 w-[202px] h-[350px]",
  },
];

const blurShapes = [
  {
    className:
      "absolute top-[180px] left-[166px] w-[318px] h-[318px] bg-[#153d28] rounded-[159px] blur-[75px]",
  },
  {
    className:
      "absolute top-[186px] left-[1616px] w-[394px] h-[394px] bg-[#153d28] rounded-[159px] blur-[75px]",
  },
];

export const TestimonialsCallToActionSection = (): JSX.Element => {
  const { t } = useI18n();
  return (
    <section
      aria-labelledby="testimonials-call-to-action-heading"
      className="absolute top-[7691px] left-px w-[1920px] h-[375px] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-[-82px] left-0 w-[1920px] h-[540px] bg-[#153d28]"
      />
      <div
        aria-hidden="true"
        className="absolute w-[2275px] h-[580px] top-[-62px] -left-32"
      >
        <div className="absolute top-px left-px w-[2275px] h-[580px]">
          {decorativeImages.map((image) => (
            <img
              key={image.src}
              className={image.className}
              alt={image.alt}
              src={image.src}
              aria-hidden="true"
            />
          ))}
          {blurShapes.map((shape, index) => (
            <div key={index} className={shape.className} />
          ))}
        </div>
        <div className="absolute top-[201px] left-[551px] w-[705px] h-[98px] flex items-center gap-[46px]">
          <img
            className="w-[98.01px] h-[98.01px]"
            alt=""
            src="/all-products/img/call.png"
            aria-hidden="true"
          />
          <div className="mt-[1.0px] w-[559px] h-24 [font-family:'Readex_Pro',Helvetica] font-semibold text-4xl tracking-[0] leading-[48px] flex flex-wrap items-center">
            <h2
              id="testimonials-call-to-action-heading"
              className="inline text-white"
            >
              Make An Appointment This Call Now{" "}
            </h2>
            <a
              href="tel:+12132142203"
              aria-label={t("auto.testimonialscalltoaction.call.us.now")}
              className="inline text-[#d8c79a] underline ml-2"
            >
              +1 213-214-2203
            </a>
          </div>
        </div>
      </div>
      <a
        href="tel:+12132142203"
        aria-label={t("auto.testimonialscalltoaction.call.us.now")}
        className="absolute top-[150px] left-[1226px] w-[271px] h-[75px] flex items-center justify-center gap-3 border-4 border-solid border-[#d8c79a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8c79a] btn hover:bg-[#d8c79a]/10 transition-colors rounded-[3px]"
      >
        <span className="[font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#d8c79a] text-[21px] tracking-[0] leading-none whitespace-nowrap">
          {t("auto.testimonialscalltoaction.call.us.now")}
        </span>
        <img
          className="w-[10px] h-[16px] object-contain"
          alt=""
          aria-hidden="true"
          src="/all-products/img/vector-9-1.svg"
        />
      </a>
    </section>
  );
};
