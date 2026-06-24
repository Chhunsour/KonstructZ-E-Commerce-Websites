import { useI18n } from "../../../../context/I18nContext";
import { Reveal } from "../../../../components/Reveal";
import { Parallax } from "../../../../components/Parallax";

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
  const { t } = useI18n();
  return (
    <section
      className="absolute left-0 top-[4561px] h-[375px] w-[1920px] overflow-hidden"
      aria-labelledby="feature-highlights-call-title"
    >
      <div
        className="absolute left-0 top-[-82px] h-[540px] w-[1920px] bg-[#153d28]"
        aria-hidden="true"
      />
      <Parallax
        strength={0.15}
        ariaHidden
        className="absolute -left-32 top-[-62px] h-[580px] w-[2275px]"
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
      </Parallax>
      <div className="absolute left-0 w-full flex items-center justify-center gap-[46px] top-[116px] z-20">
        <Reveal variant="zoom" className="h-[98px] w-[98px] shrink-0 k-float">
          <img
            className="h-full w-full object-contain"
            alt={t("auto.featurehighlights.phone.call.icon")}
            src="/img/call.png"
          />
        </Reveal>
        <Reveal as="div" variant="slide-l" delay={140}
          className="flex flex-col justify-center [font-family:'Readex_Pro',Helvetica] text-white"
        >
          <span id="feature-highlights-call-title" className="text-white text-4xl font-semibold leading-normal">
            {t("auto.featurehighlights.make.an.appointment")}
          </span>
          <a
            href="tel:+12132142203"
            className="text-[#d8c79a] underline hover:text-[#e5d4ab] transition-colors text-[32px] font-bold leading-normal mt-1"
            aria-label={t("auto.featurehighlights.call.us.now")}
          >
            <span>+1 213-214-2203</span>
          </a>
        </Reveal>
        <Reveal variant="slide-r" delay={260}
          className="h-[75px] w-[271px] shrink-0"
        >
          <a
            href="tel:+12132142203"
            className="k-btn-lift flex h-full w-full border-4 border-solid border-[#d8c79a] items-center justify-center gap-3 bg-transparent hover:bg-[#d8c79a]/10 text-[#d8c79a]"
            aria-label={t("auto.featurehighlights.call.us.now")}
          >
            <span className="[font-family:'Google_Sans_Flex',Helvetica] text-[21px] font-bold tracking-[0] leading-[normal]">{t("auto.featurehighlights.call.us.now")}</span>
            <img className="w-[10px] h-auto object-contain" alt="" src="/img/vector-9.svg" aria-hidden="true" />
          </a>
        </Reveal>
      </div>

    </section>
  );
};
