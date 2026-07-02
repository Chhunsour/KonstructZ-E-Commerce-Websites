import { useI18n } from "../../../../context/I18nContext";
import { Link } from "react-router-dom";
import { Reveal } from "../../../../components/Reveal";
import { Parallax } from "../../../../components/Parallax";

const DecorativeMagnets = () => (
  <>
    <Parallax strength={0.18} ariaHidden className="absolute top-[234px] left-0 w-[334px] h-[508px]">
      <img loading="lazy" decoding="async" className="h-full w-full" alt="" src="/img/magnet.svg" aria-hidden="true" />
    </Parallax>
    <Parallax strength={0.28} ariaHidden className="absolute top-[26px] left-[1773px] w-[147px] h-[224px]">
      <img loading="lazy" decoding="async" className="h-full w-full" alt="" src="/img/magnet-1.svg" aria-hidden="true" />
    </Parallax>
    <Parallax strength={0.22} ariaHidden className="absolute top-[732px] left-[1822px] w-[98px] h-[179px]">
      <img loading="lazy" decoding="async" className="h-full w-full" alt="" src="/img/magnet-2.svg" aria-hidden="true" />
    </Parallax>
  </>
);

const LearnMoreButton = ({
  ariaLabel,
  className,
  vectorSrc,
  href,
  textSizeClass = "text-[21px]"
}: {
  ariaLabel: string;
  className: string;
  vectorSrc: string;
  href: string;
  textSizeClass?: string;
}) => {
  const { t } = useI18n();

  return (
    <Link
      to={href}
      aria-label={ariaLabel}
      className={`${className} k-btn-lift cursor-pointer border-[1.5px] border-solid border-white bg-transparent flex items-center justify-center gap-1.5 hover:bg-white/10 text-white font-googleSans ${textSizeClass} font-normal leading-[normal]`}
    >
      <span>{t("auto.brandshowcase.learn.more")}</span>
      <img loading="lazy" decoding="async"
        className="w-[8px] h-[8px] object-contain ml-0.5"
        alt=""
        src={vectorSrc}
        aria-hidden="true"
      />
    </Link>
  );
};

export const BrandShowcaseSection = (): JSX.Element => {
  const { t } = useI18n();
  return (
    <section
      className="top-[3585px] left-0 h-[960px] bg-theme-bg absolute w-[1920px] transition-colors duration-200"
      aria-label={t("auto.brandshowcase.brand.showcase")}
    >
      <DecorativeMagnets />

      {/* Card 1: Quality Equipment */}
      <Reveal variant="stack" delay={0} className="k-card-hover absolute top-[90px] left-[570px] w-[378px] h-[378px] overflow-hidden bg-[#bababa] k-image-zoom">
        <img loading="lazy" decoding="async"
          className="absolute top-0 left-0 w-[378px] h-[378px]"
          alt=""
          src="/img/rectangle-34625626.svg"
          aria-hidden="true"
        />
        <img loading="lazy" decoding="async"
          className="absolute top-0 left-0 w-[378px] h-[378px] object-cover"
          alt={t("auto.brandshowcase.super.red.betta")}
          src="/img/super-red-betta-fish-siamese-fighting-fish-isolated-white-backgr.webp"
        />
        <img loading="lazy" decoding="async"
          className="absolute top-[74px] left-0 w-[378px] h-[304px]"
          alt=""
          src="/img/rectangle-34625639.svg"
          aria-hidden="true"
        />
        <div className="absolute bottom-[24px] left-1/2 transform -translate-x-1/2 w-[320px] flex flex-col items-center text-center gap-2.5 z-10">
          <h3 className="[font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[25px] tracking-[0] leading-[1.1]">
            {t("auto.brandshowcase.quality.equipment")}
          </h3>
          <p className="[font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[12.5px] tracking-[-0.2px] leading-relaxed">
            {t("auto.brandshowcase.carefully.selected.machinery")}
          </p>
          <LearnMoreButton
            ariaLabel={t("auto.brandshowcase.learn.more.about")}
            className="w-[124px] h-[30px] mt-0.5"
            vectorSrc="/img/vector-6.svg"
            href="/quality-equipment"
            textSizeClass="text-[13px]"
          />
        </div>
      </Reveal>

      {/* Card 2: Trusted Support */}
      <Reveal variant="stack" delay={140} className="k-card-hover k-image-zoom absolute top-[90px] left-[972px] w-[378px] h-[378px] overflow-hidden bg-[#bababa]">
        <img loading="lazy" decoding="async"
          className="absolute top-0 left-0 w-[378px] h-[378px] object-cover"
          alt=""
          src="/img/engineer-provides-technical-support-via-headset-solar-panel-fact.webp"
        />
        <img loading="lazy" decoding="async"
          className="absolute top-[74px] left-0 w-[378px] h-[303px]"
          alt=""
          src="/img/rectangle-34625639-1.svg"
          aria-hidden="true"
        />
        <div className="absolute bottom-[24px] left-1/2 transform -translate-x-1/2 w-[320px] flex flex-col items-center text-center gap-2.5 z-10">
          <h3 className="[font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[25px] tracking-[0] leading-[1.1]">
            {t("auto.brandshowcase.trusted.support")}
          </h3>
          <p className="[font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[12.5px] tracking-[-0.2px] leading-relaxed">
            {t("auto.brandshowcase.get.clear.guidance")}
          </p>
          <LearnMoreButton
            ariaLabel={t("auto.brandshowcase.learn.more.about")}
            className="w-[124px] h-[30px] mt-0.5"
            vectorSrc="/img/vector-6.svg"
            href="/trusted-support"
            textSizeClass="text-[13px]"
          />
        </div>
      </Reveal>

      {/* Card 3: Job-Site Ready */}
      <Reveal variant="stack" delay={260} className="k-card-hover k-image-zoom absolute top-[492px] left-[570px] w-[378px] h-[378px] overflow-hidden bg-[#bababa]">
        <img loading="lazy" decoding="async"
          className="absolute top-0 left-0 w-[378px] h-[378px] object-cover"
          alt={t("auto.brandshowcase.site.engineer.at")}
          src="/img/site-engineer-construction-site-1.webp"
        />
        <img loading="lazy" decoding="async"
          className="absolute top-[82px] left-0 w-[378px] h-[296px]"
          alt=""
          src="/img/rectangle-34625639-2.svg"
          aria-hidden="true"
        />
        <div className="absolute bottom-[24px] left-1/2 transform -translate-x-1/2 w-[320px] flex flex-col items-center text-center gap-2.5 z-10">
          <h3 className="[font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[25px] tracking-[0] leading-[1.1]">
            {t("auto.brandshowcase.job.site.ready")}
          </h3>
          <p className="[font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[12.5px] tracking-[-0.2px] leading-relaxed">
            {t("auto.brandshowcase.practical.machines.designed")}
          </p>
          <LearnMoreButton
            ariaLabel={t("auto.brandshowcase.learn.more.about")}
            className="w-[124px] h-[30px] mt-0.5"
            vectorSrc="/img/vector-6.svg"
            href="/job-site-ready"
            textSizeClass="text-[13px]"
          />
        </div>
      </Reveal>

      {/* Card 4: Long-Term Value */}
      <Reveal variant="stack" delay={380} className="k-card-hover k-image-zoom absolute top-[492px] left-[972px] w-[378px] h-[378px] overflow-hidden bg-[#bababa]">
        <img loading="lazy" decoding="async"
          className="absolute top-0 left-0 w-[378px] h-[378px] object-cover"
          alt={t("auto.brandshowcase.businessman.holding.growth")}
          src="/img/businessman-holding-growth-arrow-1.webp"
        />
        <img loading="lazy" decoding="async"
          className="absolute top-[73px] left-0 w-[378px] h-[304px]"
          alt=""
          src="/img/rectangle-34625639-3.svg"
          aria-hidden="true"
        />
        <div className="absolute bottom-[24px] left-1/2 transform -translate-x-1/2 w-[320px] flex flex-col items-center text-center gap-2.5 z-10">
          <h3 className="[font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[25px] tracking-[0] leading-[1.1]">
            {t("auto.brandshowcase.long.term.value")}
          </h3>
          <p className="[font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[12.5px] tracking-[-0.2px] leading-relaxed">
            {t("auto.brandshowcase.equipment.solutions.focused")}
          </p>
          <LearnMoreButton
            ariaLabel={t("auto.brandshowcase.learn.more.about")}
            className="w-[124px] h-[30px] mt-0.5"
            vectorSrc="/img/vector-6.svg"
            href="/long-term-value"
            textSizeClass="text-[13px]"
          />
        </div>
      </Reveal>
    </section>
  );
};
