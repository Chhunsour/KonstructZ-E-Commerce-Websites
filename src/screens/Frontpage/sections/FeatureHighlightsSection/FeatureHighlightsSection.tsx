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
        <Reveal variant="zoom" className="h-[98px] w-[98px] rounded-full bg-[#d8c79a]/10 border-2 border-[#d8c79a]/40 flex items-center justify-center shrink-0 k-float">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="#d8c79a" className="animate-pulse">
            <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15 15 0 0 1-6.59-6.59l2.2-2.2a1 1 0 0 0 .25-1.02A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1-1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1Z" />
          </svg>
        </Reveal>
        <Reveal as="div" variant="slide-l" delay={140}
          className="flex flex-col justify-center [font-family:'Readex_Pro',Helvetica] text-white"
        >
          <span id="feature-highlights-call-title" className="text-white text-3xl font-semibold leading-normal tracking-wide uppercase text-white/80">
            {t("auto.featurehighlights.make.an.appointment")}
          </span>
          <a
            href="tel:+12132142203"
            className="text-[#d8c79a] hover:text-white transition-colors text-[40px] font-bold leading-normal mt-0.5"
            aria-label={t("auto.featurehighlights.call.us.now")}
          >
            <span>+1 213-214-2203</span>
          </a>
        </Reveal>
        <Reveal variant="slide-r" delay={260}
          className="h-[70px] w-[270px] shrink-0"
        >
          <a
            href="tel:+12132142203"
            className="k-btn-lift flex h-full w-full bg-[#d8c79a] hover:bg-[#c7b689] items-center justify-center gap-3 text-[#153d28] rounded-[4px] font-googleSans font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(216,199,154,0.25)]"
            aria-label={t("auto.featurehighlights.call.us.now")}
          >
            <span className="[font-family:'Google_Sans_Flex',Helvetica] text-[20px] font-bold uppercase tracking-wider">{t("auto.featurehighlights.call.us.now")}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="translate-y-[0.5px]">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </Reveal>
      </div>

    </section>
  );
};
