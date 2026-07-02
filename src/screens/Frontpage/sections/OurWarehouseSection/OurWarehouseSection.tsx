import { useI18n } from "../../../../context/I18nContext";
import { Reveal } from "../../../../components/Reveal";
import { Stagger } from "../../../../components/Stagger";
import { Parallax } from "../../../../components/Parallax";

const galleryBackgrounds = [
  "absolute top-[729px] left-0 w-[634px] h-[355px] bg-[#878787]",
  "absolute top-[729px] left-[643px] w-[633px] h-[355px] bg-[#878787]",
  "absolute top-[729px] left-[1286px] w-[634px] h-[355px] bg-[#878787]",
];

export const OurWarehouseSection = (): JSX.Element => {
  const { t } = useI18n();
  const galleryImages = [
    {
      src: "/img/factory-with-machines-machinery-inside-it-1.webp",
      alt: t("auto.ourwarehouse.factory.with.machines"),
      className: "absolute top-[729px] left-0 w-[634px] h-[355px] aspect-[1.79]",
    },
    {
      src: "/img/engineer-provides-technical-support-via-headset-solar-panel-fact-1.webp",
      alt: t("auto.ourwarehouse.engineer.provides.technical"),
      className:
        "absolute top-[729px] left-[643px] w-[633px] h-[355px] aspect-[1.78]",
    },
    {
      src: "/img/male-worker-factory-1.webp",
      alt: t("auto.ourwarehouse.male.worker.in"),
      className:
        "absolute top-[729px] left-[1286px] w-[634px] h-[355px] aspect-[1.79]",
    },
  ];

  return (
    <section
      className="top-[6106px] left-0 h-[1084px] absolute w-[1920px]"
      aria-labelledby="our-warehouse-section-heading"
    >
      <div className="absolute top-0 left-0 w-[1920px] h-[720px] bg-[#878787]" />
      {galleryBackgrounds.map((className, index) => (
        <div key={index} className={className} />
      ))}
      <div className="absolute top-[544px] left-[829px] w-[261px] h-[63px] bg-[#515151]" />
      <div className="absolute top-[455px] left-[685px] w-[549px] h-[63px] bg-[#515151]" />
      <Parallax strength={0.18} ariaHidden className="absolute top-0 left-0 w-[1920px] h-[720px]">
        <img loading="lazy" decoding="async"
          className="h-full w-full aspect-[2.67] object-cover"
          alt={t("auto.ourwarehouse.machine.with.large")}
          src="/img/machine-with-large-number-machines-background-1.webp"
        />
      </Parallax>

      {/* Gallery — three frames sweep open one after the other */}
      <Stagger step={160} className="contents" ariaHidden>
        {galleryImages.map((image) => (
          <Reveal
            key={image.src}
            variant="reveal-x"
            className={`${image.className} k-image-zoom`}
          >
            <img loading="lazy" decoding="async"
              className="h-full w-full object-cover"
              alt={image.alt}
              src={image.src}
            />
          </Reveal>
        ))}
      </Stagger>

      <div className="absolute top-[432px] left-[818px] [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[42px] tracking-[0] leading-[normal] whitespace-nowrap">
        <h2
          id="our-warehouse-section-heading"
          className="m-0 text-inherit font-inherit"
        >
          {""}
        </h2>
      </div>
      <Reveal as="p" variant="fall" className="absolute top-[343px] left-[499px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Clofie-Black',Helvetica] font-black text-white text-[45px] tracking-[0] leading-[normal] whitespace-nowrap">{t("auto.ourwarehouse.konstructz.is.built")}</Reveal>
      <Reveal as="p" variant="fall" delay={150} className="absolute top-[411px] left-[557px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Clofie-Black',Helvetica] font-black text-white text-[45px] tracking-[0] leading-[normal] whitespace-nowrap">{t("auto.ourwarehouse.to.move.serious")}</Reveal>
    </section>
  );
};
