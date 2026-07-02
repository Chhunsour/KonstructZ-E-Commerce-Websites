const specs = [
  {
    id: 1,
    cardClassName:
      "absolute top-0 left-0 w-[210px] h-52 bg-neutral-100 aspect-[1.01]",
    imageClassName:
      "absolute top-1.5 left-7 w-[139px] h-[138px] aspect-[1] object-cover",
    imageAlt: "21.3 horsepower icon",
    imageSrc: "/img/a1a9d112-aebd-4a09-ae81-e896e314d381-2.png",
    labelClassName:
      "absolute top-[146px] left-[69px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-2xl tracking-[0] leading-[normal]",
    label: "21.3 HP",
  },
  {
    id: 2,
    cardClassName:
      "absolute top-0 left-[236px] w-[210px] h-52 bg-neutral-100 aspect-[1.01]",
    imageClassName:
      "absolute top-[34px] left-[292px] w-[97px] h-[99px] aspect-[0.98]",
    imageAlt: "3 valves icon",
    imageSrc: "/img/automotivecarmechanic-4-5.png",
    labelClassName:
      "absolute top-[146px] left-[297px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-2xl tracking-[0] leading-[normal]",
    label: "3 Valves",
  },
  {
    id: 3,
    cardClassName:
      "absolute top-0 left-[480px] w-[210px] h-52 bg-neutral-100 aspect-[1.01]",
    imageClassName:
      "absolute top-[18px] left-[540px] w-[104px] h-[115px] aspect-[0.9]",
    imageAlt: "21.3 horsepower mechanical icon",
    imageSrc: "/img/automotivecarmechanic-4-4.png",
    labelClassName:
      "left-[547px] absolute top-[146px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-2xl tracking-[0] leading-[normal]",
    label: "21.3 HP",
  },
  {
    id: 4,
    cardClassName:
      "absolute top-0 left-[716px] w-[210px] h-52 bg-neutral-100 aspect-[1.01]",
    imageClassName:
      "absolute top-[18px] left-[775px] w-[92px] h-[119px] aspect-[0.77]",
    imageAlt: "21.3 horsepower fuel can icon",
    imageSrc: "/img/fc154547-b2f6-4597-8bd4-c1bfb157fef6-3.png",
    labelClassName:
      "left-[776px] absolute top-[146px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-2xl tracking-[0] leading-[normal]",
    label: "21.3 HP",
  },
];

export const TemplateGrid = (): JSX.Element => {
  return (
    <main
      className="overflow-hidden w-full min-w-[1920px] min-h-[1080px] relative bg-white"
      data-model-id="2473:2208"
      aria-label="Product hero section"
    >
      <div className="absolute top-[121px] left-0 w-[1920px] h-[1557px] bg-[#282828]" />
      <img
        className="absolute top-0 left-[1113px] w-[807px] h-[844px]"
        alt=""
        aria-hidden="true"
        src="/img/vector-1120.svg"
      />
      <img
        className="absolute top-[685px] left-[1237px] w-[683px] h-[395px]"
        alt=""
        aria-hidden="true"
        src="/img/vector-1119.svg"
      />
      <div className="absolute top-[236px] left-[1488px] -rotate-90 [font-family:'Malking-Regular',Helvetica] font-normal text-[#1a442e] text-[210px] tracking-[0] leading-[normal] whitespace-nowrap select-none">
        STOMP
      </div>
      <img
        className="absolute top-[296px] left-[906px] w-[932px] h-[761px] aspect-[1.23]"
        alt="STOMP V980 compact track loader"
        src="/img/stomp-v980-4.png"
      />
      <section
        className="absolute top-[407px] left-[91px] w-[934px] h-52"
        aria-label="Product specifications"
      >
        {specs.map((spec) => (
          <div key={spec.id}>
            <div className={spec.cardClassName} />
            <img
              className={spec.imageClassName}
              alt={spec.imageAlt}
              src={spec.imageSrc}
            />
            <div className={spec.labelClassName}>{spec.label}</div>
          </div>
        ))}
      </section>
      <h1 className="absolute top-[226px] left-[91px] w-[915px] [text-shadow:-6px_5px_10.4px_#00000040] [font-family:'Mission_X-Regular',Helvetica] font-normal text-[#d8c79a] text-[75px] tracking-[0] leading-[normal]">
        THE POWERHOUSE
      </h1>
      <p className="absolute top-[686px] left-[91px] w-[805px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[39px] tracking-[0] leading-[normal]">
        Get help with orders, shipping, warranty, parts, maintenance, and
        choosing the right equipment for your job.
      </p>
      <section
        className="absolute top-[864px] left-[91px] w-[519px] h-[111px]"
        aria-label="Product actions"
      >
        <button
          type="button"
          className="absolute top-0 left-0 w-[255px] h-[60px] flex border-[3px] border-solid border-[#d8c79a] cursor-pointer"
          aria-label="Add to cart"
        >
          <div className="mt-[15px] w-[198px] h-[31px] ml-[26px] flex gap-2">
            <span className="mt-px w-40 h-[30px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-neutral-100 text-2xl tracking-[-0.24px] leading-[normal] text-left">
              ADD TO CARD
            </span>
            <img
              className="w-7 h-7"
              alt=""
              aria-hidden="true"
              src="/img/basket.svg"
            />
          </div>
        </button>
        <button
          type="button"
          className="absolute top-0 left-[264px] w-[255px] h-[60px] cursor-pointer"
          aria-label="Get a quote"
        >
          <div className="absolute top-0 left-0 w-[255px] h-[60px] flex bg-[#d8c79a]">
            <div className="mt-4 w-[158px] ml-[26px] flex">
              <span className="w-[156px] h-[30px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#2f2f2f] text-2xl tracking-[-0.24px] leading-[normal] text-left">
                GET A QUOTE
              </span>
            </div>
          </div>
          <img
            className="absolute top-[13px] left-[187px] w-[34px] h-[34px]"
            alt=""
            aria-hidden="true"
            src="/img/message.svg"
          />
        </button>
        <button
          type="button"
          className="absolute top-[69px] left-0 w-[130px] h-[42px] bg-neutral-100 cursor-pointer"
          aria-label="Share product"
        >
          <span className="absolute top-[8px] left-[23px] w-[85px] h-[26px] flex gap-[3px]">
            <span className="w-14 h-[26px] [font-family:'Google_Sans_Flex',Helvetica] font-medium text-[#153d28] text-[21px] tracking-[0] leading-[normal] text-left">
              Share
            </span>
            <img
              className="mt-px w-6 h-6"
              alt=""
              aria-hidden="true"
              src="/img/refund-ring-back.svg"
            />
          </span>
        </button>
        <button
          type="button"
          className="absolute top-[69px] left-[139px] w-[42px] h-[42px] flex bg-[#d8c79a] cursor-pointer"
          aria-label="Add to favorites"
        >
          <span className="mt-[7px] w-[27px] h-7 ml-[7px] flex rounded-[109px]">
            <img
              className="flex-1 w-[23.88px]"
              alt=""
              aria-hidden="true"
              src="/img/vector-15.svg"
            />
          </span>
        </button>
      </section>
    </main>
  );
};
