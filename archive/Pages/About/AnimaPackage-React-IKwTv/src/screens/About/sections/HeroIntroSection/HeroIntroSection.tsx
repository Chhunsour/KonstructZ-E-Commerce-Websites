export const HeroIntroSection = (): JSX.Element => {
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      iconSrc: "/img/home.svg",
      iconAlt: "Home",
    },
  ];

  return (
    <section
      aria-labelledby="hero-intro-heading"
      className="absolute top-[229px] left-0 flex h-[1006px] w-[1920px] flex-col gap-[79px]"
    >
      <header className="ml-[126px] h-[87px] w-[1668px]">
        <h2 className="[font-family:'Malking-Regular',Helvetica] text-[90px] font-normal leading-[normal] tracking-[0] whitespace-nowrap text-[#d8c79a]">
          BUILDING TRUST, POWERING PROJECTS
        </h2>
      </header>
      <div className="relative h-[840px] overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-[840px] w-[1920px] bg-[#d9d9d9]"
        />
        <img
          className="absolute left-0 top-0 h-[840px] w-[1920px] object-cover aspect-[1.5]"
          alt="Manager meeting with engineer at an outdoor project site"
          src="/img/manager-meeting-with-engineer-outdoor-site-stack-hand-teamwork-1.png"
        />
        <div
          aria-hidden="true"
          className="absolute left-[-698px] top-[704px] h-[1058px] w-[1608px] rotate-[22.63deg] bg-[#282828] blur-[289.75px]"
        />
        <nav
          aria-label="Breadcrumb"
          className="absolute left-[125px] top-[146px]"
        >
          <ol className="m-0 list-none p-0">
            {breadcrumbItems.map((item) => (
              <li
                key={item.label}
                className="relative flex h-[38px] items-center"
              >
                <a
                  href={item.href}
                  className="group inline-flex items-center text-white"
                >
                  <img
                    className="h-[38px] w-[38px] shrink-0"
                    alt={item.iconAlt}
                    src={item.iconSrc}
                  />
                  <span className="absolute left-[45px] top-[8px] [font-family:'Google_Sans_Flex',Helvetica] text-2xl font-normal leading-[normal] tracking-[0] text-white">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="absolute left-[125px] top-[222px] w-[778px]">
          <h1
            id="hero-intro-heading"
            className="[font-family:'Clofie-Bold',Helvetica] text-7xl font-bold leading-[normal] tracking-[0] text-white"
          >
            Affordable Machinery. Reliable Service.
          </h1>
        </div>
        <p className="absolute left-[125px] top-[435px] w-[1079px] [font-family:'Glonimove-Regular',Helvetica] text-4xl font-normal leading-[normal] tracking-[0] text-white">
          At Konstructz, we make quality machinery accessible to small
          businesses and local farmers. With a carefully curated selection of
          reliable, low-cost equipment, we help projects get done
          efficiently—without breaking the budget. Based in California, our team
          is small, agile, and ready to assist 24/7 online.
        </p>
      </div>
    </section>
  );
};
