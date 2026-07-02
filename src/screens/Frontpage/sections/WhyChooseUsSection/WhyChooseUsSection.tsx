import { useI18n } from "../../../../context/I18nContext";
import { Reveal } from "../../../../components/Reveal";

const imageAssets = [
  {
    src: "/img/groundripper-png-4.webp",
    alt: "Groundripper machine",
    className: "absolute top-[351px] left-[90px] flex h-[426px] w-[897px]",
    imageClassName:
      "mt-[70px] h-[355.47px] w-[473.96px] aspect-[1.33] object-cover",
  },
  {
    src: "/img/skoop-png-4.png",
    alt: "Skoop machine",
    className: "absolute top-[426px] left-[1262px] h-[351px] w-[624px]",
    imageClassName: "h-full w-full aspect-[1.78] object-cover",
  },
  {
    src: "/img/new-project-16-2.webp",
    alt: "Compact construction machine",
    className: "absolute top-[503px] left-[298px] h-[380px] w-[380px]",
    imageClassName: "h-full w-full aspect-[1] object-cover",
  },
  {
    src: "/img/new-project-19-3.webp",
    alt: "Tracked construction machine",
    className: "absolute top-[436px] left-[507px] h-[490px] w-[490px]",
    imageClassName: "h-full w-full aspect-[1] object-cover",
  },
  {
    src: "/img/scoopydigreal.webp",
    alt: "ScoopyDig machine",
    className: "absolute top-[368px] left-[1008px] h-[691px] w-[725px]",
    imageClassName: "h-full w-full object-contain",
  },
  {
    src: "/img/stomp-v980-5.webp",
    alt: "Stomp machine",
    className: "absolute top-[592px] left-[933px] h-[369px] w-[452px]",
    imageClassName: "h-full w-full aspect-[1.23] object-contain",
  },
];

export const WhyChooseUsSection = (): JSX.Element => {
  const { t } = useI18n();

  return (
    <section
      aria-labelledby="why-choose-us-title"
      className="absolute left-0 top-[7273px] min-h-[1004px] w-[1920px] overflow-hidden bg-[#282828]"
      data-model-id="2460:5848"
    >
      {/* Extended background bleed (from exported design) */}
      <div
        aria-hidden="true"
        className="absolute top-[-198px] left-0 h-[1202px] w-[1920px] bg-[#282828]"
      />

      <Reveal as="header" variant="fall" className="absolute top-[91px] left-0 w-[1920px] text-center">
        <h2
          id="why-choose-us-title"
          className="inline-block [font-family:'Clofie-Bold',Helvetica] text-[81px] font-bold leading-[normal] tracking-[-1.62px] text-[#d8c79a]"
        >
          {t("auto.whychooseus.why.choose.us")}
        </h2>
      </Reveal>

      <Reveal
        as="p"
        variant="rise"
        delay={160}
        className="absolute top-[211px] left-0 w-[1920px] text-center [font-family:'Glonimove-Light',Helvetica] text-2xl font-normal leading-[32px] tracking-[0] text-white"
      >
        <span className="font-light max-w-[682px] mx-auto block">
          {t("whychooseus.description")}
        </span>
      </Reveal>

      {/* Machine showcase — tilted, staggered drop-in for a premium product reveal */}
      <div aria-hidden="true" className="absolute inset-0">
        {imageAssets.map((asset, i) => (
          <Reveal
            key={asset.src}
            variant="tilt-in"
            delay={i * 140}
            className={`${asset.className} k-float`}
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            <img
              alt={asset.alt}
              className={asset.imageClassName}
              src={asset.src}
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
};
