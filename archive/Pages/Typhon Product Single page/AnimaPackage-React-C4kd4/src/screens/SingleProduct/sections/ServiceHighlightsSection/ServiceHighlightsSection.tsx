const serviceHighlights = [
  {
    icon: "/img/date-range.svg",
    alt: "Date range",
    label: "30 Days Return and Exchange",
    iconClassName: "mt-[30px] w-[55px] h-[55px] ml-[90px]",
    textClassName:
      "mt-[45px] w-[389px] h-[33px] ml-[17px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-black text-3xl tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    icon: "/img/user-alt.svg",
    alt: "User alt",
    label: "Lifetime Customer Support",
    iconClassName: "mt-[30px] w-[55px] h-[55px] ml-[181px]",
    textClassName:
      "mt-[45px] w-[361px] h-[33px] ml-[17px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-black text-3xl tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    icon: "/img/package-car.svg",
    alt: "Package car",
    label: "Free Delievery",
    iconClassName: "mt-[15px] w-[72px] h-[72px] ml-[209px]",
    textClassName:
      "mt-11 w-[186px] h-[33px] ml-[17px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-black text-3xl tracking-[0] leading-[normal] whitespace-nowrap",
  },
];

export const ServiceHighlightsSection = (): JSX.Element => {
  return (
    <section
      aria-label="Service highlights"
      className="absolute top-[1315px] left-0 h-[116px] w-[1920px] bg-neutral-100"
    >
      <div className="flex h-full w-full">
        {serviceHighlights.map((highlight) => (
          <div key={highlight.label} className="flex h-full items-start">
            <img
              className={highlight.iconClassName}
              alt={highlight.alt}
              src={highlight.icon}
            />
            <p className={highlight.textClassName}>{highlight.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
