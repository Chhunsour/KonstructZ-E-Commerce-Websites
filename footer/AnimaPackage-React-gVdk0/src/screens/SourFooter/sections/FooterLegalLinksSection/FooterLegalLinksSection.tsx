const legalLinkItems = [
  {
    date: "12th June 2026",
    title: "On The Other Hand, We Denounce With And Dislike",
    imageSrc: "/img/chatgpt-image-apr-28-2026-09-24-09-am-2.png",
    imageAlt:
      "Article thumbnail for On The Other Hand, We Denounce With And Dislike",
    imageWidthClass: "w-[131px]",
    imageHeightClass: "h-[74px]",
    topClass: "top-0",
    dateTopClass: "top-[9px]",
    titleTopClass: "top-[30px]",
  },
  {
    date: "9th June 2026",
    title: "On The Other Hand, We Denounce With And Dislike",
    imageSrc: "/img/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
    imageAlt:
      "Article thumbnail for On The Other Hand, We Denounce With And Dislike",
    imageWidthClass: "w-[130px]",
    imageHeightClass: "h-[73px]",
    topClass: "top-[89px]",
    dateTopClass: "top-[98px]",
    titleTopClass: "top-[119px]",
  },
  {
    date: "9th June 2026",
    title: "On The Other Hand, We Denounce With And Dislike",
    imageSrc: "/img/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
    imageAlt:
      "Article thumbnail for On The Other Hand, We Denounce With And Dislike",
    imageWidthClass: "w-[130px]",
    imageHeightClass: "h-[73px]",
    topClass: "top-[177px]",
    dateTopClass: "top-[186px]",
    titleTopClass: "top-[207px]",
  },
];

export const FooterLegalLinksSection = (): JSX.Element => {
  return (
    <section
      aria-label="Recent legal links"
      className="absolute top-[266px] left-[1348px] h-[250px] w-[347px]"
    >
      <div className="relative h-full w-full">
        {legalLinkItems.map((item, index) => (
          <article key={`${item.date}-${index}`} className="contents">
            <img
              className={`absolute left-0 ${item.topClass} ${item.imageWidthClass} ${item.imageHeightClass} aspect-[1.78] object-cover`}
              alt={item.imageAlt}
              src={item.imageSrc}
              loading="lazy"
            />
            <time
              className={`absolute left-[141px] ${item.dateTopClass} w-[77px] [font-family:'Glonimove-Regular',Helvetica] text-xs font-normal leading-[normal] tracking-[0] text-neutral-100`}
              dateTime={item.date}
            >
              {item.date}
            </time>
            <p
              className={`absolute left-[141px] ${item.titleTopClass} w-[194px] [font-family:'Clofie-Bold',Helvetica] text-[15px] font-bold leading-[normal] tracking-[0] text-neutral-100`}
            >
              {item.title}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
