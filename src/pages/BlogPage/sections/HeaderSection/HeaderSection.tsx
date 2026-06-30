import { useI18n } from "../../../../context/I18nContext";

const dropdownIcons = [
  {
    left: "left-[280px]",
    width: "w-[13px]",
    height: "h-[17px]",
    src: "/blog/img/vector-622.svg",
  },
  {
    left: "left-[470px]",
    width: "w-[15px]",
    height: "h-4",
    src: "/blog/img/vector-621.svg",
  },
  {
    left: "left-[848px]",
    width: "w-[13px]",
    height: "h-[17px]",
    src: "/blog/img/vector-622.svg",
  },
];

export const HeaderSection = (): JSX.Element => {
  const { t } = useI18n();
  const navItems = [
    {
      label: t("auto.header.home"),
      left: "left-0",
      width: "w-[101px]",
      hasDropdown: false,
      active: true,
    },
    {
      label: "Equipment",
      left: "left-[150px]",
      width: "w-[136px]",
      hasDropdown: true,
      active: false,
    },
    {
      label: "Attachment",
      left: "left-[336px]",
      width: "w-[141px]",
      hasDropdown: true,
      active: false,
    },
    {
      label: t("auto.header.about"),
      left: "left-[527px]",
      width: "w-[71px]",
      hasDropdown: false,
      active: false,
    },
    {
      label: t("auto.header.blog"),
      left: "left-[647px]",
      width: "w-14",
      hasDropdown: false,
      active: false,
    },
    {
      label: t("auto.header.support"),
      left: "left-[752px]",
      width: "w-[100px]",
      hasDropdown: true,
      active: false,
    },
  ];

  return (
    <header
      className="absolute top-0 left-px flex h-[120px] w-[1920px] bg-transparent"
      aria-label={t("auto.header.main.header")}
    >
      <a
        href="/"
        className="ml-[90px] mt-[3px] block h-[113.45px] w-[120.34px] shrink-0"
        aria-label={t("auto.header.go.to.homepage")}
      >
        <img
          className="h-full w-full"
          alt={t("auto.header.company.logo")}
          src="/blog/img/group-2085662944.png"
        />
      </a>
      <nav
        className="relative ml-[135.7px] mt-[50px] h-9 w-[871px]"
        aria-label={t("auto.header.primary.navigation")}
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.label === "Home" ? "/" : `/${item.label.toLowerCase()}`}
            aria-current={item.active ? "page" : undefined}
            className={`absolute top-0 ${item.left} ${item.width} [font-family:'Clofie-Regular',Helvetica] text-2xl font-normal leading-[normal] tracking-[0] text-neutral-100`}
          >
            {item.label}
          </a>
        ))}

        {dropdownIcons.map((icon, index) => (
          <img
            key={index}
            className={`absolute top-1 ${icon.left} ${icon.width} ${icon.height}`}
            alt=""
            aria-hidden="true"
            src={icon.src}
          />
        ))}

        <div className="absolute left-0.5 top-[23px] h-0.5 w-[68px] border border-solid bg-[#153d28]" />
      </nav>
      <button
        type="button"
        className="ml-24 mt-[38px] flex h-[43.36px] w-[41.96px] shrink-0 flex-col gap-[0.6px]"
        aria-label={t("auto.header.search")}
      >
        <span className="h-[33.33px] w-[33.33px] rounded-[51px] border-2 border-solid border-neutral-100" />
        <span className="ml-[23.8px] h-[2.56px] w-[20.29px] rotate-[45.91deg] bg-neutral-100" />
      </button>
      <button
        type="button"
        className="relative ml-[26px] mt-[30px] h-[61px] w-[74px] shrink-0"
        aria-label={t("auto.header.change.language.current")}
      >
        <img
          className="absolute left-0 top-0 h-[61px] w-[72px]"
          alt=""
          aria-hidden="true"
          src="/blog/img/2.svg"
        />
        <span className="absolute left-4 top-[19px] w-[39px] whitespace-nowrap [font-family:'Clofie-Regular',Helvetica] text-[27px] font-normal leading-[normal] tracking-[0] text-neutral-100">
          EN
        </span>
      </button>
      <a
        href="/contact"
        className="relative ml-6 mt-[29px] block h-[61px] w-[204.87px] shrink-0"
        aria-label={t("auto.header.get.a.quote")}
      >
        <img
          className="absolute left-0 top-0 h-[61px] w-[203px]"
          alt=""
          aria-hidden="true"
          src="/blog/img/image.svg"
        />
        <span className="absolute left-6 top-4 w-[156px] [font-family:'Clofie-Regular',Helvetica] text-[27px] font-normal leading-[normal] tracking-[0] text-neutral-100">{t("auto.header.get.a.quote")}</span>
      </a>
    </header>
  );
};
