const machineCards = [
  {
    id: 1,
    left: "left-16",
    title: "STOMP V980",
    category: "Skid Steer",
    weight: "2T",
    specs: [
      { label: "SPEC", value: "N/A" },
      { label: "SPEC", value: "N/A" },
    ],
    image: {
      src: "/img/new-project-18-1.png",
      alt: "STOMP V980 machine",
      className:
        "absolute top-[37px] left-px w-[291px] h-[291px] aspect-[1] object-cover",
    },
    compactActions: false,
  },
  {
    id: 2,
    left: "left-[399px]",
    title: "STOMP V980",
    category: "Skid Steer",
    weight: "2T",
    specs: [
      { label: "SPEC", value: "N/A" },
      { label: "SPEC", value: "N/A" },
    ],
    image: {
      src: "/img/stomp-v980-4-2.png",
      alt: "STOMP V980 machine",
      className:
        "absolute top-[102px] left-5 w-[247px] h-[202px] aspect-[1.23]",
    },
    compactActions: true,
  },
  {
    id: 3,
    left: "left-[726px]",
    title: "STOMP V980",
    category: "Skid Steer",
    weight: "2T",
    specs: [
      { label: "SPEC", value: "N/A" },
      { label: "SPEC", value: "N/A" },
    ],
    image: {
      src: "/img/new-project-23-2.png",
      alt: "STOMP V980 machine",
      className:
        "absolute top-[39px] left-0 w-[293px] h-[314px] aspect-[0.93] object-cover",
    },
    compactActions: true,
  },
  {
    id: 4,
    left: "left-[1053px]",
    title: "STOMP V980",
    category: "Skid Steer",
    weight: "2T",
    specs: [
      { label: "SPEC", value: "N/A" },
      { label: "SPEC", value: "N/A" },
    ],
    image: {
      src: "/img/new-project-16-2.png",
      alt: "STOMP V980 machine",
      className:
        "absolute top-[75px] left-[34px] w-[225px] h-[225px] aspect-[1] object-cover",
    },
    compactActions: true,
  },
  {
    id: 5,
    left: "left-[1380px]",
    title: "STOMP V980",
    category: "Skid Steer",
    weight: "2T",
    specs: [
      { label: "SPEC", value: "N/A" },
      { label: "SPEC", value: "N/A" },
    ],
    image: {
      src: "/img/new-project-15-2.png",
      alt: "STOMP V980 machine",
      className:
        "absolute top-[52px] left-[9px] w-[271px] h-[271px] aspect-[1] object-cover",
    },
    compactActions: true,
  },
];

const paginationItems = [
  { type: "page", label: "1", active: true, left: "left-0" },
  { type: "page", label: "2", active: false, left: "left-[68px]" },
  { type: "page", label: "3", active: false, left: "left-[136px]" },
  { type: "page", label: "4", active: false, left: "left-[204px]" },
  { type: "page", label: "5", active: false, left: "left-[272px]" },
  { type: "page", label: "6", active: false, left: "left-[340px]" },
];

export const RelatedMachinesSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="related-machines-heading"
      className="absolute top-[5477px] left-[123px] w-[1673px] h-[741px]"
    >
      <h2
        id="related-machines-heading"
        className="absolute top-0 left-0 [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[45px] tracking-[0] leading-[normal] whitespace-nowrap"
      >
        Related Machines
      </h2>
      <div
        className="absolute top-[117px] left-0 w-[1673px] h-[482px]"
        role="list"
        aria-label="Related machine products"
      >
        {machineCards.map((card) => (
          <article
            key={card.id}
            role="listitem"
            className={`absolute top-0 ${card.left} w-[293px] h-[482px] bg-[#d9d9d9]`}
            aria-label={`${card.title} ${card.category}`}
          >
            <div className="absolute top-[9px] left-2.5 w-[41px] h-[49px]">
              <img
                className="absolute top-0 left-0 w-[41px] h-[49px] aspect-[0.83]"
                alt=""
                aria-hidden="true"
                src="/img/kilogram-kg-and-pound-lbs-weight-symbol-icon-dumbbell-vector-ill-4.png"
              />
              <div className="absolute top-[26px] left-[12px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                {card.weight}
              </div>
            </div>
            <img
              className={card.image.className}
              alt={card.image.alt}
              src={card.image.src}
            />
            <h3 className="top-[323px] left-2.5 w-[139px] [font-family:'Cal_Sans',Helvetica] text-[#153d28] text-2xl absolute font-normal tracking-[0] leading-[normal] whitespace-nowrap">
              {card.title}
            </h3>
            <div className="absolute top-[330px] left-[215px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]">
              {card.category}
            </div>
            <div className="absolute top-[355px] left-2.5 w-[272px] h-0.5 bg-[#153d28]" />
            <div className="absolute top-[418px] left-2 w-[272px] h-0.5 bg-[#153d28]" />
            {card.specs.map((spec, index) => (
              <div key={`${card.id}-${index}`}>
                <div
                  className={`absolute left-2.5 [font-family:'Glonimove-Regular',Helvetica] font-normal text-[#646464] text-lg tracking-[0] leading-[normal] whitespace-nowrap ${
                    index === 0 ? "top-[365px]" : "top-[390px]"
                  }`}
                >
                  {spec.label}
                </div>
                <div
                  className={`absolute left-[225px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#656565] text-lg tracking-[0] leading-[normal] ${
                    index === 0 ? "top-[365px]" : "top-[388px]"
                  }`}
                >
                  {spec.value}
                </div>
              </div>
            ))}

            <div className="absolute top-[432px] left-2 w-[111px] h-[33px] border-2 border-solid border-[#153d28]" />
            <div className="absolute top-[432px] left-[130px] w-[150px] h-[33px] bg-[#153d28]" />
            {card.compactActions ? (
              <>
                <button
                  type="button"
                  aria-label={`Request a quote for ${card.title}`}
                  className="absolute top-[432px] left-2 w-[111px] h-[33px] cursor-pointer"
                >
                  <span className="absolute top-[7px] left-[27px] [font-family:'Google_Sans_Flex',Helvetica] font-normal text-[#153d28] text-[15px] tracking-[0] leading-[normal]">
                    Quote
                  </span>
                  <img
                    className="absolute top-[8px] left-[76px] w-[8px] h-[15px]"
                    alt=""
                    aria-hidden="true"
                    src="/img/vector-8.svg"
                  />
                </button>
                <button
                  type="button"
                  aria-label={`View details for ${card.title}`}
                  className="absolute top-[432px] left-[130px] w-[150px] h-[33px] cursor-pointer"
                >
                  <span className="absolute top-[7px] left-[19px] [font-family:'Google_Sans_Flex',Helvetica] font-normal text-[#d9d9d9] text-[15px] tracking-[0] leading-[normal]">
                    VIEW DETIALS
                  </span>
                  <img
                    className="absolute top-[8px] left-[132px] w-[8px] h-[15px]"
                    alt=""
                    aria-hidden="true"
                    src="/img/vector-9.svg"
                  />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  aria-label={`Request a quote for ${card.title}`}
                  className="absolute top-[432px] left-2 w-[111px] h-[33px] cursor-pointer"
                >
                  <span className="absolute top-[7px] left-[27px] [font-family:'Google_Sans_Flex',Helvetica] font-normal text-[#153d28] text-[15px] tracking-[0] leading-[normal]">
                    Quote
                  </span>
                  <img
                    className="absolute top-[8px] left-[50px] w-[8px] h-[15px]"
                    alt=""
                    aria-hidden="true"
                    src="/img/vector-8.svg"
                  />
                </button>
                <button
                  type="button"
                  aria-label={`View details for ${card.title}`}
                  className="absolute top-[432px] left-[130px] w-[150px] h-[33px] cursor-pointer"
                >
                  <span className="absolute top-[7px] left-[21px] [font-family:'Google_Sans_Flex',Helvetica] font-normal text-[#d9d9d9] text-[15px] tracking-[0] leading-[normal]">
                    VIEW DETIALS
                  </span>
                  <img
                    className="absolute top-[8px] left-[127px] w-[8px] h-[15px]"
                    alt=""
                    aria-hidden="true"
                    src="/img/vector-9.svg"
                  />
                </button>
              </>
            )}
          </article>
        ))}
      </div>
      <nav
        aria-label="Related machines pagination"
        className="absolute top-[684px] left-[629px] w-[492px] h-[57px]"
      >
        {paginationItems.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-current={item.active ? "page" : undefined}
            aria-label={`Go to page ${item.label}`}
            className={`absolute top-0 ${item.left} w-[57px] h-[57px] cursor-pointer ${
              item.active ? "bg-[#153d28]" : "bg-[#d9d9d9]"
            }`}
          >
            <span
              className={`absolute top-3.5 left-1/2 -translate-x-1/2 [font-family:'Google_Sans_Flex',Helvetica] font-bold text-2xl tracking-[0] leading-[normal] ${
                item.active ? "text-white" : "text-[#153d28]"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}

        <div className="absolute top-12 left-[401px] w-[9px] h-[9px] bg-[#d9d9d9]" />
        <div className="absolute top-12 left-[414px] w-[9px] h-[9px] bg-[#d9d9d9]" />
        <div className="absolute top-12 left-[427px] w-2.5 h-[9px] bg-[#d9d9d9]" />
        <button
          type="button"
          aria-label="Go to next page"
          className="absolute top-0 left-[435px] w-[57px] h-[57px] cursor-pointer"
        >
          <img
            className="absolute w-[6.84%] h-[92.35%] top-[7.65%] left-[93.16%]"
            alt=""
            aria-hidden="true"
            src="/img/vector-10.svg"
          />
        </button>
      </nav>
    </section>
  );
};
