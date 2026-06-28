import { useI18n } from "../../../../context/I18nContext";


export const ProductSummarySection = (): JSX.Element => {
  const { t } = useI18n();
  const summaryItems = [
    {
      iconSrc: "/img/date-range.svg",
      iconAlt: t("auto.productsummary.date.range"),
      textKey: "service.returnExchange",
      iconClassName: "mt-[30px] w-[55px] h-[55px] ml-[90px] opacity-80 transition-all",
      textClassName:
        "mt-[45px] w-[389px] h-[33px] ml-[17px] text-theme-text text-3xl whitespace-nowrap [font-family:'Glonimove-Regular',Helvetica] font-normal tracking-[0] leading-[normal] transition-colors",
    },
    {
      iconSrc: "/img/user-alt.svg",
      iconAlt: t("auto.productsummary.user.alt"),
      textKey: "service.lifetimeSupport",
      iconClassName: "mt-[30px] w-[55px] h-[55px] ml-[181px] opacity-80 transition-all",
      textClassName:
        "mt-[45px] w-[361px] h-[33px] ml-[17px] text-theme-text text-3xl whitespace-nowrap [font-family:'Glonimove-Regular',Helvetica] font-normal tracking-[0] leading-[normal] transition-colors",
    },
    {
      iconSrc: "/img/package-car.svg",
      iconAlt: t("auto.productsummary.package.car"),
      textKey: "service.freeDelivery",
      iconClassName: "mt-[15px] w-[72px] h-[72px] ml-[209px] opacity-80 transition-all",
      textClassName:
        "mt-11 w-[186px] h-[33px] ml-[17px] text-theme-text text-3xl whitespace-nowrap [font-family:'Glonimove-Regular',Helvetica] font-normal tracking-[0] leading-[normal] transition-colors",
    },
  ];


  return (
    <section
      aria-label={t("product.serviceHighlights")}
      className="absolute top-[1758px] left-0 h-[116px] w-[1920px] bg-theme-sec border-y border-theme-border/10 transition-colors duration-200"
    >
      <ul className="flex h-full list-none p-0 m-0">
        {summaryItems.map((item) => (
          <li key={item.textKey} className="contents">
            <img
              className={item.iconClassName}
              alt={item.iconAlt}
              src={item.iconSrc}
            />
            <p className={item.textClassName}>{t(item.textKey)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
