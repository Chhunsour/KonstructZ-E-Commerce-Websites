const specificationCards = [
  {
    id: 1,
    label: "21.3 HP",
    imageSrc: "/img/a1a9d112-aebd-4a09-ae81-e896e314d381-2.png",
    imageAlt: "Engine specification icon",
    cardClassName: "left-0",
    imageClassName:
      "absolute top-1.5 left-7 w-[139px] h-[138px] aspect-[1] object-cover",
    labelClassName: "absolute top-[146px] left-[69px]",
  },
  {
    id: 2,
    label: "3 Valves",
    imageSrc: "/img/automotivecarmechanic-4-5.png",
    imageAlt: "Valve specification icon",
    cardClassName: "left-[236px]",
    imageClassName:
      "absolute top-[34px] left-[292px] w-[97px] h-[99px] aspect-[0.98]",
    labelClassName: "absolute top-[146px] left-[297px]",
  },
  {
    id: 3,
    label: "21.3 HP",
    imageSrc: "/img/automotivecarmechanic-4-4.png",
    imageAlt: "Horsepower specification icon",
    cardClassName: "left-[480px]",
    imageClassName:
      "absolute top-[18px] left-[540px] w-[104px] h-[115px] aspect-[0.9]",
    labelClassName: "absolute top-[146px] left-[547px]",
  },
  {
    id: 4,
    label: "21.3 HP",
    imageSrc: "/img/fc154547-b2f6-4597-8bd4-c1bfb157fef6-3.png",
    imageAlt: "Performance specification icon",
    cardClassName: "left-[716px]",
    imageClassName:
      "absolute top-[18px] left-[775px] w-[92px] h-[119px] aspect-[0.77]",
    labelClassName: "absolute top-[146px] left-[776px]",
  },
];

const actionButtons = [
  {
    id: "add-to-cart",
    label: "ADD TO CARD",
    type: "outlined" as const,
    iconSrc: "/img/basket-1.svg",
    iconAlt: "",
    wrapperClassName:
      "absolute top-0 left-0 w-[255px] h-[60px] flex border-[3px] border-solid border-[#d8c79a]",
    contentClassName: "mt-[15px] w-[198px] h-[31px] ml-[26px] flex gap-2",
    textClassName:
      "mt-px w-40 h-[30px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-neutral-100 text-2xl tracking-[-0.24px] leading-[normal]",
    iconClassName: "w-7 h-7",
  },
  {
    id: "get-a-quote",
    label: "GET A QUOTE",
    type: "filled" as const,
    iconSrc: "/img/message-1.svg",
    iconAlt: "",
    wrapperClassName: "absolute top-0 left-[264px] w-[255px] h-[60px]",
    contentClassName:
      "absolute top-0 left-0 w-[255px] h-[60px] flex bg-[#d8c79a]",
    innerContentClassName: "mt-4 w-[158px] ml-[26px] flex",
    textClassName:
      "w-[156px] h-[30px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#2f2f2f] text-2xl tracking-[-0.24px] leading-[normal]",
    iconClassName: "absolute top-[13px] left-[187px] w-[34px] h-[34px]",
  },
];

export const HeroBannerSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="hero-banner-heading"
      className="absolute top-[678px] left-0 w-[1920px] h-[1080px] overflow-hidden"
    >
      <div
        className="absolute left-0 top-[121px] h-[1557px] w-[1920px] bg-[#282828]"
        aria-hidden="true"
      />
      <img
        className="absolute top-0 left-[1113px] h-[844px] w-[807px]"
        alt=""
        src="/img/vector-1120.svg"
        aria-hidden="true"
      />
      <img
        className="absolute top-[685px] left-[1237px] h-[395px] w-[683px]"
        alt=""
        src="/img/vector-1119.svg"
        aria-hidden="true"
      />
      <div
        className="absolute top-[236px] left-[1488px] -rotate-90 whitespace-nowrap [font-family:'Malking-Regular',Helvetica] text-[210px] font-normal leading-[normal] tracking-[0] text-[#1a442e]"
        aria-hidden="true"
      >
        STOMP
      </div>
      <img
        className="absolute top-[296px] left-[906px] h-[761px] w-[932px] aspect-[1.23]"
        alt="STOMP compact track loader product image"
        src="/img/stomp-v980-4.png"
      />
      <header className="absolute left-[91px] top-[226px]">
        <h1
          id="hero-banner-heading"
          className="w-[915px] [text-shadow:-6px_5px_10.4px_#00000040] [font-family:'Mission_X-Regular',Helvetica] text-[75px] font-normal leading-[normal] tracking-[0] text-[#d8c79a]"
        >
          THE POWERHOUSE
        </h1>
      </header>
      <div
        className="absolute top-[407px] left-[91px] h-52 w-[934px]"
        role="list"
        aria-label="Product specifications"
      >
        {specificationCards.map((card) => (
          <div key={card.id} className="contents">
            <div
              className={`absolute top-0 ${card.cardClassName} h-52 w-[210px] bg-neutral-100 aspect-[1.01]`}
              role="listitem"
              aria-label={card.label}
            />
            <img
              className={card.imageClassName}
              alt={card.imageAlt}
              src={card.imageSrc}
            />
            <div
              className={`${card.labelClassName} [font-family:'Cal_Sans',Helvetica] text-2xl font-normal leading-[normal] tracking-[0] text-black`}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>
      <p className="absolute top-[686px] left-[91px] w-[805px] [font-family:'Glonimove-Regular',Helvetica] text-[39px] font-normal leading-[normal] tracking-[0] text-white">
        Get help with orders, shipping, warranty, parts, maintenance, and
        choosing the right equipment for your job.
      </p>
      <div className="absolute top-[864px] left-[91px] h-[111px] w-[519px]">
        <div className="absolute top-[69px] left-0 h-[42px] w-[130px] bg-neutral-100" />
        <button
          type="button"
          aria-label="Share product"
          className="absolute top-[69px] left-[139px] flex h-[42px] w-[42px] items-start justify-start bg-[#d8c79a]"
        >
          <span className="ml-[7px] mt-[7px] flex h-7 w-[27px] rounded-[109px]">
            <img
              className="w-[23.88px] flex-1"
              alt=""
              src="/img/vector-15-1.svg"
              aria-hidden="true"
            />
          </span>
        </button>
        <button
          type="button"
          aria-label="Share"
          className="absolute top-[77px] left-[23px] flex h-[26px] w-[85px] gap-[3px]"
        >
          <span className="[font-family:'Google_Sans_Flex',Helvetica] text-[21px] font-medium leading-[normal] tracking-[0] text-[#153d28]">
            Share
          </span>
          <img
            className="mt-px h-6 w-6"
            alt=""
            src="/img/refund-ring-back-1.svg"
            aria-hidden="true"
          />
        </button>
        {actionButtons.map((button) =>
          button.type === "outlined" ? (
            <button
              key={button.id}
              type="button"
              className={button.wrapperClassName}
              aria-label={button.label}
            >
              <span className={button.contentClassName}>
                <span className={button.textClassName}>{button.label}</span>
                <img
                  className={button.iconClassName}
                  alt=""
                  src={button.iconSrc}
                  aria-hidden="true"
                />
              </span>
            </button>
          ) : (
            <button
              key={button.id}
              type="button"
              className={button.wrapperClassName}
              aria-label={button.label}
            >
              <span className={button.contentClassName}>
                <span className={button.innerContentClassName}>
                  <span className={button.textClassName}>{button.label}</span>
                </span>
              </span>
              <img
                className={button.iconClassName}
                alt=""
                src={button.iconSrc}
                aria-hidden="true"
              />
            </button>
          ),
        )}
      </div>
    </section>
  );
};
