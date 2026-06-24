const summaryItems = [
  {
    iconSrc: "/img/date-range.svg",
    iconAlt: "Date range",
    text: "30 Days Return and Exchange",
    iconClassName: "mt-[30px] w-[55px] h-[55px] ml-[90px]",
    textClassName:
      "mt-[45px] w-[389px] h-[33px] ml-[17px] text-black text-3xl whitespace-nowrap [font-family:'Glonimove-Regular',Helvetica] font-normal tracking-[0] leading-[normal]",
  },
  {
    iconSrc: "/img/user-alt.svg",
    iconAlt: "User alt",
    text: "Lifetime Customer Support",
    iconClassName: "mt-[30px] w-[55px] h-[55px] ml-[181px]",
    textClassName:
      "mt-[45px] w-[361px] h-[33px] ml-[17px] text-black text-3xl whitespace-nowrap [font-family:'Glonimove-Regular',Helvetica] font-normal tracking-[0] leading-[normal]",
  },
  {
    iconSrc: "/img/package-car.svg",
    iconAlt: "Package car",
    text: "Free Delievery",
    iconClassName: "mt-[15px] w-[72px] h-[72px] ml-[209px]",
    textClassName:
      "mt-11 w-[186px] h-[33px] ml-[17px] text-black text-3xl whitespace-nowrap [font-family:'Glonimove-Regular',Helvetica] font-normal tracking-[0] leading-[normal]",
  },
];

export const ProductSummarySection = (): JSX.Element => {
  return (
    <section
      aria-label="Product service highlights"
      className="absolute top-[1758px] left-0 h-[116px] w-[1920px] bg-neutral-100"
    >
      <ul className="flex h-full list-none p-0 m-0">
        {summaryItems.map((item) => (
          <li key={item.text} className="contents">
            <img
              className={item.iconClassName}
              alt={item.iconAlt}
              src={item.iconSrc}
            />
            <p className={item.textClassName}>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
