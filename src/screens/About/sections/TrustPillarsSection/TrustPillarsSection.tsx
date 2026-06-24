import { useI18n } from "../../../../context/I18nContext";

export const TrustPillarsSection = (): JSX.Element => {
  const { t } = useI18n();
  const trustPillars = [
    {
      title: t("auto.trustpillars.affordable.machinery"),
      description: t("auto.trustpillars.quality.equipment.at"),
      imageSrc:
        "/img/world-habitat-day-close-up-picture-pile-coins-sag-coin-2.png",
      imageAlt: t("auto.trustpillars.affordable.machinery.represented"),
      cardLeft: "left-[90px]",
      cardWidth: "w-[395px]",
      imageLeft: "left-[90px]",
      imageWidth: "w-[394px]",
      imageAspect: "aspect-[1.26]",
      imagePanelLeft: "left-[89px]",
      badgeLeft: "left-[359px]",
      badgeImageLeft: "left-[349px]",
      badgeImageTop: "top-[632px]",
      badgeImageWidth: "w-[135px]",
      badgeImageHeight: "h-[135px]",
      badgeImageSrc: "/img/6141-1.png",
      titleLeft: "left-[105px]",
      descriptionLeft: "left-[105px]",
      descriptionTop: "top-[814px]",
      titleTracking: "tracking-[0]",
    },
    {
      title: t("auto.trustpillars.reliable.tested"),
      description: t("auto.trustpillars.every.machine.checked"),
      imageSrc:
        "/img/engineer-specialist-asian-female-technician-maintenance-inspect.png",
      imageAlt: t("auto.trustpillars.technician.inspecting.equipment"),
      cardLeft: "left-[539px]",
      cardWidth: "w-[395px]",
      imageLeft: "left-[538px]",
      imageWidth: "w-[396px]",
      imageAspect: "aspect-[1.27]",
      imagePanelLeft: "left-[538px]",
      badgeLeft: "left-[808px]",
      badgeImageLeft: "left-[810px]",
      badgeImageTop: "top-[649px]",
      badgeImageWidth: "w-[105px]",
      badgeImageHeight: "h-[105px]",
      badgeImageSrc: "/img/77a00bd6-65f1-421c-8ae5-a2251b7b3802-1.png",
      titleLeft: "left-[554px]",
      descriptionLeft: "left-[554px]",
      descriptionTop: "top-[814px]",
      titleTracking: "tracking-[0]",
    },
    {
      title: t("auto.trustpillars.online.24.7"),
      description: t("auto.trustpillars.fast.answers.to"),
      imageSrc:
        "/img/customer-support-black-technician-helpline-photovoltaic-facility.png",
      imageAlt: t("auto.trustpillars.customer.support.technician"),
      cardLeft: "left-[988px]",
      cardWidth: "w-[395px]",
      imageLeft: "left-[988px]",
      imageWidth: "w-[396px]",
      imageAspect: "aspect-[1.27]",
      imagePanelLeft: "left-[988px]",
      badgeLeft: "left-[1258px]",
      badgeImageLeft: "left-[1249px]",
      badgeImageTop: "top-[628px]",
      badgeImageWidth: "w-[135px]",
      badgeImageHeight: "h-[135px]",
      badgeImageSrc: "/img/390026be-717f-44d5-862f-db591784d1fa-1.png",
      titleLeft: "left-[1004px]",
      descriptionLeft: "left-[1004px]",
      descriptionTop: "top-[814px]",
      titleTracking: "tracking-[0]",
    },
    {
      title: t("auto.trustpillars.perfect.for.local"),
      description: t("auto.trustpillars.compact.versatile.machines"),
      imageSrc: "/img/men-standing-field-against-sky-1.png",
      imageAlt: t("auto.trustpillars.farmers.and.contractors"),
      cardLeft: "left-[1437px]",
      cardWidth: "w-[395px]",
      imageLeft: "left-[1437px]",
      imageWidth: "w-[395px]",
      imageAspect: "aspect-[1.26]",
      imagePanelLeft: "left-[1436px]",
      badgeLeft: "left-[1706px]",
      badgeImageLeft: "left-[1703px]",
      badgeImageTop: "top-[638px]",
      badgeImageWidth: "w-[116px]",
      badgeImageHeight: "h-[116px]",
      badgeImageSrc: "/img/519b3f36-465f-437a-83b4-0a6c77226948-1.png",
      titleLeft: "left-[1454px]",
      descriptionLeft: "left-[1452px]",
      descriptionTop: "top-[868px]",
      titleTracking: "tracking-[-0.72px]",
    },
  ];

  return (
    <section
      aria-labelledby="trust-pillars-heading"
      className="absolute top-[3589px] left-[9px] flex h-[1080px] w-[1902px]"
    >
      <div className="relative h-[1095px] w-[1920px] overflow-hidden bg-theme-bg transition-colors duration-200">
        <div className="absolute left-0 top-0 h-[1182px] w-[1920px] bg-theme-bg transition-colors duration-200" />
        <header>
          <p className="absolute left-[679px] top-[77px] whitespace-nowrap [font-family:'Malking-Regular',Helvetica] text-[41px] font-normal leading-[normal] tracking-[0] text-theme-heading transition-colors">{t("auto.trustpillars.why.choose.us")}</p>
          <h2
            id="trust-pillars-heading"
            className="absolute left-[90px] top-[265px] whitespace-nowrap [font-family:'Clofie-Bold',Helvetica] text-[36px] font-bold leading-[normal] tracking-[0] text-theme-text transition-colors"
          >{t("auto.trustpillars.why.small.businesses")}</h2>
          <a
            href="#quote"
            aria-label={t("auto.trustpillars.get.a.quote")}
            className="absolute left-[1550px] top-[262px] inline-flex h-[76px] w-[282px] items-center justify-center bg-[#153d28] shadow-[0px_4px_4px_#00000040] transition-opacity hover:opacity-90 focus-visible:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="[font-family:'Google_Sans_Flex',Helvetica] text-[24px] font-normal leading-[normal] tracking-[0] text-white">{t("auto.trustpillars.get.a.quote")}</span>
          </a>
        </header>
        <div aria-hidden="true">
          {trustPillars.map((pillar) => (
            <div
              key={`${pillar.title}-background`}
              className={`absolute top-[420px] ${pillar.cardLeft} ${pillar.cardWidth} h-[550px] bg-theme-card border border-theme-border/20 shadow-[0px_4px_4px_#00000040] transition-colors duration-200`}
            />
          ))}

          {trustPillars.map((pillar) => (
            <div
              key={`${pillar.title}-panel`}
              className={`absolute top-[420px] ${pillar.imagePanelLeft} h-[313px] w-[396px] bg-[#153d28]`}
            />
          ))}
        </div>
        <div role="list" aria-label={t("auto.trustpillars.trust.pillars")}>
          {trustPillars.map((pillar) => (
            <article key={pillar.title} role="listitem">
              <img
                className={`absolute top-[420px] ${pillar.imageLeft} ${pillar.imageWidth} h-[313px] ${pillar.imageAspect} object-cover`}
                alt={pillar.imageAlt}
                src={pillar.imageSrc}
                loading="lazy"
              />
              <div
                aria-hidden="true"
                className={`absolute top-[645px] ${pillar.badgeLeft} h-[109px] w-[109px] bg-[#153d28]`}
              />
              <img
                className={`absolute ${pillar.badgeImageTop} ${pillar.badgeImageLeft} ${pillar.badgeImageWidth} ${pillar.badgeImageHeight} aspect-[1] object-cover`}
                alt=""
                src={pillar.badgeImageSrc}
                loading="lazy"
              />
              <h3
                className={`absolute top-[765px] ${pillar.titleLeft} w-[363px] [font-family:'Cal_Sans',Helvetica] text-[24px] font-normal leading-[normal] ${pillar.titleTracking} text-theme-text transition-colors`}
              >
                {pillar.title}
              </h3>
              <p
                className={`absolute ${pillar.descriptionTop} ${pillar.descriptionLeft} w-[363px] [font-family:'Glonimove-Regular',Helvetica] text-[22px] font-normal leading-[normal] tracking-[0] text-theme-muted transition-colors`}
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
