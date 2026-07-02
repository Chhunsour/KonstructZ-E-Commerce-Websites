import { Link } from "react-router-dom";
import { useI18n } from "../../../../context/I18nContext";

export const TrustPillarsSection = (): JSX.Element => {
  const { t } = useI18n();
  const trustPillars = [
    {
      title: t("auto.trustpillars.affordable.machinery"),
      description: t("auto.trustpillars.quality.equipment.at"),
      imageSrc:
        "/img/world-habitat-day-close-up-picture-pile-coins-sag-coin-2.webp",
      imageAlt: t("auto.trustpillars.affordable.machinery.represented"),
      cardLeft: "left-[141px]",
      cardWidth: "w-[371px]",
      imageLeft: "left-[141px]",
      imageWidth: "w-[371px]",
      imageAspect: "aspect-[1.26]",
      imagePanelLeft: "left-[141px]",
      badgeLeft: "left-[394px]",
      badgeImageLeft: "left-[384px]",
      badgeImageTop: "top-[595px]",
      badgeImageWidth: "w-[127px]",
      badgeImageHeight: "h-[127px]",
      badgeImageSrc: "/img/6141-1.png",
      titleLeft: "left-[156px]",
      descriptionLeft: "left-[156px]",
      descriptionTop: "top-[766px]",
      titleTracking: "tracking-[0]",
    },
    {
      title: t("auto.trustpillars.reliable.tested"),
      description: t("auto.trustpillars.every.machine.checked"),
      imageSrc:
        "/img/engineer-specialist-asian-female-technician-maintenance-inspect.webp",
      imageAlt: t("auto.trustpillars.technician.inspecting.equipment"),
      cardLeft: "left-[563px]",
      cardWidth: "w-[371px]",
      imageLeft: "left-[563px]",
      imageWidth: "w-[371px]",
      imageAspect: "aspect-[1.27]",
      imagePanelLeft: "left-[563px]",
      badgeLeft: "left-[816px]",
      badgeImageLeft: "left-[818px]",
      badgeImageTop: "top-[611px]",
      badgeImageWidth: "w-[99px]",
      badgeImageHeight: "h-[99px]",
      badgeImageSrc: "/img/77a00bd6-65f1-421c-8ae5-a2251b7b3802-1.png",
      titleLeft: "left-[578px]",
      descriptionLeft: "left-[578px]",
      descriptionTop: "top-[766px]",
      titleTracking: "tracking-[0]",
    },
    {
      title: t("auto.trustpillars.online.24.7"),
      description: t("auto.trustpillars.fast.answers.to"),
      imageSrc:
        "/img/customer-support-black-technician-helpline-photovoltaic-facility.webp",
      imageAlt: t("auto.trustpillars.customer.support.technician"),
      cardLeft: "left-[985px]",
      cardWidth: "w-[371px]",
      imageLeft: "left-[985px]",
      imageWidth: "w-[371px]",
      imageAspect: "aspect-[1.27]",
      imagePanelLeft: "left-[985px]",
      badgeLeft: "left-[1239px]",
      badgeImageLeft: "left-[1230px]",
      badgeImageTop: "top-[592px]",
      badgeImageWidth: "w-[127px]",
      badgeImageHeight: "h-[127px]",
      badgeImageSrc: "/img/390026be-717f-44d5-862f-db591784d1fa-1.png",
      titleLeft: "left-[1000px]",
      descriptionLeft: "left-[1000px]",
      descriptionTop: "top-[766px]",
      titleTracking: "tracking-[0]",
    },
    {
      title: t("auto.trustpillars.perfect.for.local"),
      description: t("auto.trustpillars.compact.versatile.machines"),
      imageSrc: "/img/men-standing-field-against-sky-1.webp",
      imageAlt: t("auto.trustpillars.farmers.and.contractors"),
      cardLeft: "left-[1407px]",
      cardWidth: "w-[371px]",
      imageLeft: "left-[1407px]",
      imageWidth: "w-[371px]",
      imageAspect: "aspect-[1.26]",
      imagePanelLeft: "left-[1407px]",
      badgeLeft: "left-[1660px]",
      badgeImageLeft: "left-[1657px]",
      badgeImageTop: "top-[601px]",
      badgeImageWidth: "w-[109px]",
      badgeImageHeight: "h-[109px]",
      badgeImageSrc: "/img/519b3f36-465f-437a-83b4-0a6c77226948-1.png",
      titleLeft: "left-[1422px]",
      descriptionLeft: "left-[1422px]",
      descriptionTop: "top-[817px]",
      titleTracking: "tracking-[-0.72px]",
    },
  ];

  return (
    <section
      aria-labelledby="trust-pillars-heading"
      className="absolute top-[3589px] left-0 flex h-[1015px] w-[1920px]"
    >
      <div className="relative h-[1030px] w-[1920px] overflow-hidden bg-theme-bg transition-colors duration-200">
        <div className="absolute left-0 top-0 h-[1095px] w-[1920px] bg-theme-bg transition-colors duration-200" />
        <header>
          <p className="absolute left-0 w-full text-center top-[72px] whitespace-nowrap [font-family:'Malking-Regular',Helvetica] text-[38px] font-normal leading-[normal] tracking-[0] text-theme-heading transition-colors">
            {t("auto.trustpillars.why.choose.us")}
          </p>
          <h2
            id="trust-pillars-heading"
            className="absolute left-[141px] top-[249px] whitespace-nowrap [font-family:'Clofie-Bold',Helvetica] text-[34px] font-bold leading-[normal] tracking-[0] text-theme-text transition-colors"
          >
            {t("auto.trustpillars.why.small.businesses")}
          </h2>
          <Link
            to="/contact"
            aria-label={t("auto.trustpillars.get.a.quote")}
            className="absolute left-[1513px] top-[246px] inline-flex h-[71px] w-[265px] items-center justify-center bg-[#153d28] shadow-[0px_4px_4px_#00000040] transition-opacity hover:opacity-90 focus-visible:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="[font-family:'Google_Sans_Flex',Helvetica] text-[22px] font-normal leading-[normal] tracking-[0] text-white">
              {t("auto.trustpillars.get.a.quote")}
            </span>
          </Link>
        </header>
        <div aria-hidden="true">
          {trustPillars.map((pillar) => (
            <div
              key={`${pillar.title}-background`}
              className={`absolute top-[396px] ${pillar.cardLeft} ${pillar.cardWidth} h-[517px] bg-theme-card border border-theme-border/20 shadow-[0px_4px_4px_#00000040] transition-colors duration-200`}
            />
          ))}

          {trustPillars.map((pillar) => (
            <div
              key={`${pillar.title}-panel`}
              className={`absolute top-[396px] ${pillar.imagePanelLeft} h-[294px] w-[371px] bg-[#153d28]`}
            />
          ))}
        </div>
        <div role="list" aria-label={t("auto.trustpillars.trust.pillars")}>
          {trustPillars.map((pillar) => (
            <article key={pillar.title} role="listitem">
              <img
                className={`absolute top-[396px] ${pillar.imageLeft} ${pillar.imageWidth} h-[294px] ${pillar.imageAspect} object-cover`}
                alt={pillar.imageAlt}
                src={pillar.imageSrc}
                loading="lazy"
              />
              <div
                aria-hidden="true"
                className={`absolute top-[608px] ${pillar.badgeLeft} h-[102px] w-[102px] bg-[#153d28]`}
              />
              <img
                className={`absolute ${pillar.badgeImageTop} ${pillar.badgeImageLeft} ${pillar.badgeImageWidth} ${pillar.badgeImageHeight} aspect-[1] object-cover`}
                alt=""
                src={pillar.badgeImageSrc}
                loading="lazy"
              />
              <h3
                className={`absolute top-[720px] ${pillar.titleLeft} w-[341px] [font-family:'Cal_Sans',Helvetica] text-[22px] font-normal leading-[normal] ${pillar.titleTracking} text-theme-text transition-colors`}
              >
                {pillar.title}
              </h3>
              <p
                className={`absolute ${pillar.descriptionTop} ${pillar.descriptionLeft} w-[341px] [font-family:'Glonimove-Regular',Helvetica] text-[20px] font-normal leading-[normal] tracking-[0] text-theme-muted transition-colors`}
              >
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
