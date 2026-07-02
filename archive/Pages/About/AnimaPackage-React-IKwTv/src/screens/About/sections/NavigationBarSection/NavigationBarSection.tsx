const navigationItems = [
  {
    label: "Home",
    widthClass: "w-[101px]",
    leftClass: "left-0",
    href: "#",
    active: true,
  },
  {
    label: "Equipment",
    widthClass: "w-[136px]",
    leftClass: "left-[150px]",
    href: "#",
    active: false,
    icon: {
      src: "/img/vector-622.svg",
      alt: "",
      className: "absolute top-1 left-[280px] w-[13px] h-[17px]",
    },
  },
  {
    label: "Attachment",
    widthClass: "w-[141px]",
    leftClass: "left-[336px]",
    href: "#",
    active: false,
    icon: {
      src: "/img/vector-621.svg",
      alt: "",
      className: "absolute top-1 left-[470px] w-[15px] h-4",
    },
  },
  {
    label: "About",
    widthClass: "w-[71px]",
    leftClass: "left-[527px]",
    href: "#",
    active: false,
  },
  {
    label: "Blog",
    widthClass: "w-14",
    leftClass: "left-[647px]",
    href: "#",
    active: false,
  },
  {
    label: "Support",
    widthClass: "w-[100px]",
    leftClass: "left-[752px]",
    href: "#",
    active: false,
    icon: {
      src: "/img/vector-622.svg",
      alt: "",
      className: "absolute top-1 left-[848px] w-[13px] h-[17px]",
    },
  },
];

export const NavigationBarSection = (): JSX.Element => {
  return (
    <header className="absolute top-0 left-px w-[1920px] h-[120px] bg-transparent">
      <div className="flex h-full">
        <a
          href="#"
          aria-label="Go to homepage"
          className="mt-[3px] ml-[90px] block h-[113.45px] w-[120.34px] shrink-0"
        >
          <img
            className="h-[113.45px] w-[120.34px]"
            alt="Group"
            src="/img/group-2085662944.png"
          />
        </a>
        <nav
          aria-label="Primary navigation"
          className="relative mt-[50px] ml-[135.7px] h-9 w-[871px] shrink-0"
        >
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`absolute top-0 ${item.leftClass} ${item.widthClass} [font-family:'Clofie-Regular',Helvetica] text-2xl font-normal leading-[normal] tracking-[0] text-neutral-100`}
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
                src={item.icon?.src}
                aria-hidden="true"
              />
            ))}

          <div
            className="absolute top-[23px] left-0.5 h-0.5 w-[68px] border border-solid bg-[#153d28]"
            aria-hidden="true"
          />
        </nav>
        <button
          type="button"
          aria-label="Search"
          className="mt-[38px] ml-24 flex h-[43.36px] w-[41.96px] shrink-0 flex-col gap-[0.6px]"
        >
          <div className="h-[33.33px] w-[33.33px] rounded-[51px] border-2 border-solid border-neutral-100" />
          <div className="ml-[23.8px] h-[2.56px] w-[20.29px] rotate-[45.91deg] bg-neutral-100" />
        </button>
        <button
          type="button"
          aria-label="Select language: English"
          className="relative mt-[30px] ml-[26px] h-[61px] w-[74px] shrink-0"
        >
          <img
            className="absolute top-0 left-0 h-[61px] w-[72px]"
            alt=""
            src="/img/2.svg"
            aria-hidden="true"
          />
          <span className="absolute top-[19px] left-4 w-[39px] whitespace-nowrap [font-family:'Clofie-Regular',Helvetica] text-[27px] font-normal leading-[normal] tracking-[0] text-neutral-100">
            EN
          </span>
        </button>
        <button
          type="button"
          className="relative mt-[29px] ml-6 h-[61px] w-[204.87px] shrink-0"
          aria-label="Get a Quote"
        >
          <img
            className="absolute top-0 left-0 h-[61px] w-[203px]"
            alt=""
            src="/img/image.svg"
            aria-hidden="true"
          />
          <span className="absolute top-4 left-6 w-[156px] [font-family:'Clofie-Regular',Helvetica] text-[27px] font-normal leading-[normal] tracking-[0] text-neutral-100">
            Get a Quote
          </span>
        </button>
        <button
          type="button"
          className="relative mt-[30px] ml-[24.1px] h-[61px] w-[124px] shrink-0"
          aria-label="Login"
        >
          <img
            className="absolute top-0 left-0 h-[61px] w-[122px]"
            alt=""
            src="/img/1.svg"
            aria-hidden="true"
          />
          <span className="absolute top-[15px] left-[25px] w-[72px] [font-family:'Clofie-Regular',Helvetica] text-[27px] font-normal leading-[normal] tracking-[0] text-neutral-100">
            Login
          </span>
        </button>
      </div>
    </header>
  );
};
