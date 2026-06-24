import { useI18n } from "../../../../context/I18nContext";

export const HeroSection = (): JSX.Element => {
  const { t } = useI18n();
  const navigationItems = [
    {
      label: t("auto.hero.home"),
      leftClassName: "left-0",
      widthClassName: "w-[101px]",
      href: "#",
    },
    {
      label: "Equipment",
      leftClassName: "left-[150px]",
      widthClassName: "w-[136px]",
      href: "#",
      icon: {
        src: "/img/vector-622.svg",
        alt: "",
        className: "absolute top-1 left-[280px] w-[13px] h-[17px]",
      },
    },
    {
      label: "Attachment",
      leftClassName: "left-[336px]",
      widthClassName: "w-[141px]",
      href: "#",
      icon: {
        src: "/img/vector-621.svg",
        alt: "",
        className: "absolute top-1 left-[470px] w-[15px] h-4",
      },
    },
    {
      label: t("auto.hero.about"),
      leftClassName: "left-[527px]",
      widthClassName: "w-[71px]",
      href: "#",
    },
    {
      label: t("auto.hero.blog"),
      leftClassName: "left-[647px]",
      widthClassName: "w-14",
      href: "#",
    },
    {
      label: t("auto.hero.support"),
      leftClassName: "left-[752px]",
      widthClassName: "w-[100px]",
      href: "#",
      icon: {
        src: "/img/vector-622.svg",
        alt: "",
        className: "absolute top-1 left-[848px] w-[13px] h-[17px]",
      },
    },
  ];

  return (
    <header className="absolute top-0 left-px flex h-[120px] w-[1920px] bg-transparent">
      <a
        href="#"
        aria-label={t("auto.hero.go.to.homepage")}
        className="ml-[90px] mt-[3px] block h-[113.45px] w-[120.34px]"
      >
        <img
          className="h-full w-full"
          alt={t("auto.hero.company.logo")}
          src="/img/group-2085662944.png"
        />
      </a>
      <nav
        aria-label={t("auto.hero.primary.navigation")}
        className="relative ml-[135.7px] mt-[50px] h-9 w-[871px]"
      >
        {navigationItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`absolute top-0 ${item.leftClassName} ${item.widthClassName} [font-family:'Clofie-Regular',Helvetica] text-2xl font-normal leading-[normal] tracking-[0] text-neutral-100`}
          >
            {item.label}
          </a>
        ))}

        {navigationItems
          .filter((item) => item.icon)
          .map((item) => (
            <img
              key={`${item.label}-icon`}
              className={item.icon?.className}
              alt={item.icon?.alt}
              aria-hidden="true"
              src={item.icon?.src}
            />
          ))}

        <div
          className="absolute left-0.5 top-[23px] h-0.5 w-[68px] border border-solid bg-[#153d28]"
          aria-hidden="true"
        />
      </nav>
      <button
        type="button"
        aria-label={t("auto.hero.search")}
        className="ml-24 mt-[38px] flex h-[43.36px] w-[41.96px] flex-col gap-[0.6px] cursor-pointer"
      >
        <div className="h-[33.33px] w-[33.33px] rounded-[51px] border-2 border-solid border-neutral-100" />
        <div className="ml-[23.8px] h-[2.56px] w-[20.29px] rotate-[45.91deg] bg-neutral-100" />
      </button>
      <button
        type="button"
        aria-label={t("auto.hero.change.language")}
        className="relative ml-[26.0px] mt-[30px] h-[61px] w-[74px] cursor-pointer"
      >
        <img
          className="absolute left-0 top-0 h-[61px] w-[72px]"
          alt=""
          aria-hidden="true"
          src="/img/2.svg"
        />
        <span className="absolute left-4 top-[19px] w-[39px] whitespace-nowrap [font-family:'Clofie-Regular',Helvetica] text-[27px] font-normal leading-[normal] tracking-[0] text-neutral-100">
          EN
        </span>
      </button>
      <a
        href="#"
        className="relative ml-6 mt-[29px] block h-[61px] w-[204.87px]"
        aria-label={t("auto.hero.get.a.quote")}
      >
        <img
          className="absolute left-0 top-0 h-[61px] w-[203px]"
          alt=""
          aria-hidden="true"
          src="/img/image.svg"
        />
        <span className="absolute left-6 top-4 w-[156px] [font-family:'Clofie-Regular',Helvetica] text-[27px] font-normal leading-[normal] tracking-[0] text-neutral-100">{t("auto.hero.get.a.quote")}</span>
      </a>
    </header>
  );
};
