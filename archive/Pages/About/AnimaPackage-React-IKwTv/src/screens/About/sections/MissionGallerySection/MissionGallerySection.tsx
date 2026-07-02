const missionCards = [
  {
    id: "road-ironing-or-compaction",
    title: (
      <>
Road Ironing
        <br />
or&nbsp;&nbsp;Compaction
      </>
),
    image: "/img/chatgpt-image-jun-11-2026-09-17-59-am-1.png",
    className:
      "absolute top-px left-0 w-[343px] h-[343px] flex bg-[url(/img/chatgpt-image-jun-11-2026-09-17-59-am-1.png)] bg-cover bg-[50%_50%]",
    contentClassName:
      "mt-[259px] w-[206px] h-[68px] ml-3.5 [text-shadow:0px_4px_4px_#00000040] [font-family:'Cal_Sans',Helvetica] font-normal text-neutral-100 text-3xl tracking-[0] leading-[33.7px]",
  },
  {
    id: "material-handling-and-lifting",
    title: <>Material Handling &amp; Lifting</>,
    image: "/img/chatgpt-image-jun-11-2026-09-18-07-am-1.png",
    className:
      "absolute top-px left-[352px] w-[343px] h-[343px] flex bg-[url(/img/chatgpt-image-jun-11-2026-09-18-07-am-1.png)] bg-cover bg-[50%_50%]",
    contentClassName:
      "mt-[259px] w-[236px] h-[68px] ml-[13.8px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Cal_Sans',Helvetica] font-normal text-neutral-100 text-3xl tracking-[0] leading-[33.7px]",
  },
  {
    id: "vertical-reach-and-maintenance",
    title: <>Vertical Reach and Maintenance</>,
    image: "/img/chatgpt-image-jun-11-2026-09-18-16-am-1.png",
    className:
      "absolute top-px left-[704px] w-[344px] h-[344px] flex bg-[url(/img/chatgpt-image-jun-11-2026-09-18-16-am-1.png)] bg-cover bg-[50%_50%]",
    contentClassName:
      "mt-[260px] w-[244px] h-[68px] ml-[13.7px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Cal_Sans',Helvetica] font-normal text-neutral-100 text-3xl tracking-[0] leading-[33.7px]",
  },
  {
    id: "bulk-transport-and-stockpiling",
    title: <>Bulk Transport and Stockpiling</>,
    image: "/img/chatgpt-image-jun-11-2026-09-18-20-am-1.png",
    className:
      "absolute top-px left-[1056px] w-[343px] h-[343px] flex bg-[url(/img/chatgpt-image-jun-11-2026-09-18-20-am-1.png)] bg-cover bg-[50%_50%]",
    contentClassName:
      "mt-[259px] w-[218px] h-[68px] ml-[14.3px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Cal_Sans',Helvetica] font-normal text-neutral-100 text-3xl tracking-[0] leading-[33.7px]",
  },
  {
    id: "stone-and-aggregate-processing",
    title: <>Stone &amp; Aggregate Processing</>,
    image: "/img/chatgpt-image-jun-11-2026-09-18-31-am-1.png",
    className:
      "absolute top-[351px] left-0 w-[344px] h-[344px] flex bg-[url(/img/chatgpt-image-jun-11-2026-09-18-31-am-1.png)] bg-cover bg-[50%_50%]",
    contentClassName:
      "mt-[259.6px] w-[260px] h-[68px] ml-3.5 [text-shadow:0px_4px_4px_#00000040] [font-family:'Cal_Sans',Helvetica] font-normal text-neutral-100 text-3xl tracking-[0] leading-[33.7px]",
  },
  {
    id: "heavy-goods-and-pallet-handling",
    title: (
      <>
Heavy Goods
        <br />
and Pallet Handling
      </>
),
    image: "/img/chatgpt-image-jun-11-2026-09-18-23-am-1.png",
    className:
      "absolute top-[351px] left-[352px] w-[343px] h-[343px] flex bg-[url(/img/chatgpt-image-jun-11-2026-09-18-23-am-1.png)] bg-cover bg-[50%_50%]",
    contentClassName:
      "mt-[258.6px] w-[261px] h-[68px] ml-[13.8px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Cal_Sans',Helvetica] font-normal text-neutral-100 text-3xl tracking-[0] leading-[33.7px]",
  },
  {
    id: "soil-ripping-and-site-prep",
    title: (
      <>
Soil Ripping
        <br />
and Site Prep
      </>
),
    image: "/img/chatgpt-image-jun-11-2026-09-18-27-am-1.png",
    className:
      "absolute top-[351px] left-[704px] w-[343px] h-[343px] flex bg-[url(/img/chatgpt-image-jun-11-2026-09-18-27-am-1.png)] bg-cover bg-[50%_50%]",
    contentClassName:
      "mt-[258.6px] w-[205px] h-[68px] ml-[14.5px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Cal_Sans',Helvetica] font-normal text-neutral-100 text-3xl tracking-[0] leading-[33.7px]",
  },
  {
    id: "excavation-and-trenching",
    title: (
      <>
Excavation
        <br />
and Trenching
      </>
),
    image: "/img/chatgpt-image-jun-11-2026-09-18-03-am-1.png",
    className:
      "absolute top-[351px] left-[1056px] w-[343px] h-[343px] flex bg-[url(/img/chatgpt-image-jun-11-2026-09-18-03-am-1.png)] bg-cover bg-[50%_50%]",
    contentClassName:
      "mt-[258.6px] w-[205px] h-[68px] ml-[14.3px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Cal_Sans',Helvetica] font-normal text-neutral-100 text-3xl tracking-[0] leading-[33.7px]",
  },
];

export const MissionGallerySection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="mission-gallery-heading"
      className="absolute top-[1341px] left-[85px] w-[1750px] h-[1388px]"
    >
<h2
        id="mission-gallery-heading"
        className="top-[38px] left-[636px] [font-family:'Malking-Regular',Helvetica] font-normal text-[#d8c79a] text-[75px] whitespace-nowrap absolute tracking-[0] leading-[normal]"
      >
OUR MISSION
      </h2>
<div
        aria-label="Mission capability gallery"
        className="absolute top-[214px] left-[175px] w-[1399px] h-[695px]"
        role="list"
      >
{missionCards.map((card) => (
          <article
            key={card.id}
            aria-label={card.id.replace(/-/g, " ")}
            className={card.className}
            role="listitem"
          >
<div className={card.contentClassName}>{card.title}</div>
<img alt="" aria-hidden="true" className="sr-only" src={card.image} />
</article>
))}
      </div>
<h3 className="absolute top-[993px] left-[175px] w-[514px] [font-family:'Clofie-Bold',Helvetica] font-bold text-[#d8c79a] text-[54px] tracking-[0] leading-[normal]">
Empowering Small Businesses
      </h3>
<p className="absolute top-[976px] left-[827px] w-[746px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-3xl tracking-[0] leading-[normal]">
We aim to provide practical machinery solutions for those who need them
        most. From local farms to small contractors, our goal is to supply
        affordable, dependable machines that make work easier, faster, and
        safer.
      </p>
</section>
);
};
