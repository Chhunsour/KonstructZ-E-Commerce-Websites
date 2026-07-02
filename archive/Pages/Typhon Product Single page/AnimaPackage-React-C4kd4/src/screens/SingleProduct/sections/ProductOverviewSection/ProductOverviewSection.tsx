const productFeatures = [
  "Horsepower: Kubota D902 21.3 HP",
  "Digging Force: 15 KN",
  "System Pressure: 21 Mpa",
  "Fuel Tank: 9 L",
];

export const ProductOverviewSection = (): JSX.Element => {
  return (
    <section
      className="absolute left-[1057px] top-[413px] h-[646px] w-[600px]"
      aria-labelledby="product-overview-title"
    >
      <h1
        id="product-overview-title"
        className="absolute left-0 top-0 whitespace-nowrap [font-family:'Clofie-Bold',Helvetica] text-7xl font-bold leading-[normal] tracking-[0] text-white"
      >
        Typhon Kuvuo 2.5
      </h1>
      <div
        className="absolute left-0 top-[113px] h-[49px] w-[418px]"
        aria-label="Pricing"
      >
        <div className="absolute left-0 top-[11px] whitespace-nowrap [font-family:'Glonimove-Regular',Helvetica] text-3xl font-normal leading-[normal] tracking-[0] text-white">
          $15,999.99
        </div>
        <img
          className="absolute left-[155px] top-[7px] h-[39px] w-[39px]"
          alt=""
          aria-hidden="true"
          src="/img/arrow-alt-lright-alt.svg"
        />
        <div className="absolute left-[211px] top-0 h-[49px] w-[203px] bg-[#153d28]" />
        <div className="absolute left-[222px] top-[3px] whitespace-nowrap [font-family:'Glonimove-Regular',Helvetica] text-[39px] font-normal leading-[normal] tracking-[0] text-[#d8c79a]">
          $12,999.99
        </div>
      </div>
      <div
        className="absolute left-0 top-[162px] h-[338px] w-[463px] overflow-hidden"
        aria-label="Product specifications"
      >
        <div className="absolute left-[-68px] top-0 h-[623px] w-[793px] bg-[#282828]" />
        {productFeatures.map((feature, index) => {
          const topPositions = [45, 110, 175, 240];
          const textTopPositions = [63, 128, 193, 258];

          return (
            <div key={feature}>
              <img
                className="absolute left-0 h-[53px] w-[47px]"
                style={{ top: `${topPositions[index]}px` }}
                alt=""
                aria-hidden="true"
                src="/img/done-duotone-line-3.svg"
              />
              <p
                className="absolute left-[51px] whitespace-nowrap [font-family:'Glonimove-Regular',Helvetica] text-2xl font-normal leading-[normal] tracking-[0] text-white"
                style={{ top: `${textTopPositions[index]}px` }}
              >
                {feature}
              </p>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        aria-label="Add to favorites"
        className="absolute left-px top-[517px] h-[60px] w-[60px] bg-[#d8c79a]"
      >
        <img
          className="absolute left-[10px] top-[10px] h-[39px] w-[39px]"
          alt=""
          aria-hidden="true"
          src="/img/favorite.svg"
        />
      </button>
      <button
        type="button"
        aria-label="Add Typhon Kuvuo 2.5 to cart"
        className="absolute left-[76px] top-[517px] h-[60px] w-[255px] bg-neutral-100"
      >
        <span className="absolute left-[26px] top-[10px] flex h-[39px] w-[204px] items-start">
          <span className="flex w-[206px] gap-[5px]">
            <span className="mt-1.5 h-[30px] w-40 [font-family:'Google_Sans_Flex',Helvetica] text-2xl font-bold leading-[normal] tracking-[-0.24px] text-[#153d28]">
              ADD TO CARD
            </span>
            <img
              className="h-[39px] w-[39px]"
              alt=""
              aria-hidden="true"
              src="/img/basket.svg"
            />
          </span>
        </span>
      </button>
      <button
        type="button"
        aria-label="Share Typhon Kuvuo 2.5"
        className="absolute left-px top-[604px] h-[42px] w-[130px] bg-neutral-100"
      >
        <span className="absolute left-6 top-2 flex h-[26px] w-[85px] gap-[5px]">
          <span className="h-[26px] w-[54px] [font-family:'Google_Sans_Flex',Helvetica] text-[21px] font-normal leading-[normal] tracking-[0] text-[#153d28]">
            Share
          </span>
          <img
            className="mt-px h-6 w-6"
            alt=""
            aria-hidden="true"
            src="/img/refund-ring-back.svg"
          />
        </span>
      </button>
    </section>
  );
};
