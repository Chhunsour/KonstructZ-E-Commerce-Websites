import { useI18n } from "../../../../context/I18nContext";

export const BlogHeroSection = (): JSX.Element => {
  const { t } = useI18n();
  const breadcrumbItems = [
    {
      label: t("auto.bloghero.home"),
      href: "/",
      iconSrc: "/blog/img/home.svg",
      iconAlt: "",
    },
  ];

  return (
    <section
      aria-labelledby="blog-hero-title"
      className="absolute top-[120px] left-0 h-[720px] w-[1920px] bg-[#d9d9d9] bg-[url(/blog/img/new-project-24-1.png)] bg-cover bg-[50%_50%]"
    >
      <nav
        aria-label="Breadcrumb"
        className="absolute left-[1436px] top-[186px] flex items-center gap-[7px]"
      >
        {breadcrumbItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-[7px] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <img
              className="h-[38px] w-[38px] shrink-0"
              alt={item.iconAlt}
              src={item.iconSrc}
              aria-hidden="true"
            />
            <span className="[font-family:'Google_Sans_Flex',Helvetica] text-2xl font-normal leading-[normal] tracking-[0] text-white">
              {item.label}
            </span>
          </a>
        ))}
      </nav>
      <h1
        id="blog-hero-title"
        className="absolute left-[1382px] top-[244px] whitespace-nowrap [font-family:'Malking-Regular',Helvetica] text-[90px] font-normal leading-[normal] tracking-[0] text-[#d8c79a] [text-shadow:0px_4px_4px_#00000040]"
      >
        BLOG
      </h1>
      <p className="absolute left-[1212px] top-[351px] whitespace-nowrap [font-family:'Glonimove-Regular',Helvetica] text-[45px] font-normal leading-[normal] tracking-[0] text-white [text-shadow:0px_4px_4px_#00000040]">{t("auto.bloghero.find.out.our")}</p>
    </section>
  );
};
