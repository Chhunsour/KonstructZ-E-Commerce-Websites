const specItems = [
  {
    icon: "/img/car-service-parts-warning-error-electric-refueling.svg",
    iconAlt: "Weight capacity icon",
    value: "3",
    label: "TONS",
  },
  {
    icon: "/img/car-service-parts-speedometer.svg",
    iconAlt: "Digging force icon",
    value: "30 Mpa",
    label: "Digging Force",
  },
  {
    icon: "/img/car-service-parts-car-time-timer.svg",
    iconAlt: "Horsepower icon",
    value: "21",
    label: "Horsepower",
  },
];

const productImages = [
  {
    src: "/img/new-project-18-2.png",
    alt: "Compact skid steer attachment view",
    className:
      "top-[401px] left-[158px] w-[455px] h-[455px] absolute aspect-[1] object-cover",
  },
  {
    src: "/img/stomp-v980-4-3.png",
    alt: "Kuvuo 4.0 skid steer loader",
    className:
      "top-[368px] left-[591px] w-[632px] h-[479px] absolute aspect-[1.32]",
  },
  {
    src: "/img/new-project-15-2-5.png",
    alt: "Additional skid steer attachment view",
    className:
      "top-[428px] left-[1256px] w-[401px] h-[401px] absolute aspect-[1] object-cover",
  },
];

export const SkidSteerHeroSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="skid-steer-hero-title"
      className="absolute -top-px -left-px w-[1920px] h-[1080px] overflow-hidden"
    >
      <div className="absolute top-[-21px] -left-2 w-[1942px] h-[1122px] bg-[#282828]" />
      <img
        className="absolute top-[663px] left-[414px] w-[1092px] h-44"
        alt=""
        aria-hidden="true"
        src="/img/ellipse-1.svg"
      />
      <div
        aria-hidden="true"
        className="absolute top-[621px] left-[591px] w-[838px] h-[230px] bg-[#d9d9d929] rounded-[419px/115px] blur-[100px]"
      />
      <button
        type="button"
        aria-label="Select current product"
        className="absolute top-[827px] left-[960px] w-6 h-6 bg-[#272727] rounded-xl border-2 border-solid border-[#afafaf] aspect-[1]"
      />
      <h1
        id="skid-steer-hero-title"
        className="top-[calc(50.00%_-_291px)] left-[calc(50.00%_-_550px)] [font-family:'Malking-Regular',Helvetica] text-[#d8c79a] text-[210px] tracking-[-4.20px] leading-[210px] absolute font-normal whitespace-nowrap"
      >
        SKID STEER
      </h1>
      <div className="flex w-[1262px] items-center justify-between absolute top-[905px] left-[329px]">
        <div className="inline-flex items-center gap-[23px] relative flex-[0_0_auto]">
          <img
            className="relative w-1 h-36"
            alt=""
            aria-hidden="true"
            src="/img/line-3.svg"
          />
          <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
            <h2 className="relative self-stretch h-[45px] mt-[-1.00px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[42px] tracking-[0] leading-[67.2px] whitespace-nowrap">
              Kuvuo 4.0
            </h2>
            <p className="relative w-[301px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-[#999999] text-xl tracking-[0] leading-[28.0px]">
              A Powerful Compacted Mini Excator 2 TONS that actually blah blah
              and yeah
            </p>
          </div>
        </div>
        <div
          className="inline-flex items-center gap-10 relative flex-[0_0_auto]"
          role="list"
          aria-label="Product specifications"
        >
          {specItems.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="inline-flex items-center gap-10 relative flex-[0_0_auto]"
            >
              <div
                className="inline-flex flex-col items-center justify-center gap-3.5 relative flex-[0_0_auto]"
                role="listitem"
              >
                <img
                  className="relative w-10 h-10 aspect-[1]"
                  alt={item.iconAlt}
                  src={item.icon}
                />
                <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Cal_Sans',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-7 whitespace-nowrap">
                    {item.value}
                  </div>
                  <div className="relative flex items-center w-fit [font-family:'Roboto_Flex',Helvetica] font-normal text-[#999999] text-base tracking-[0] leading-4 whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              </div>
              {index < specItems.length - 1 ? (
                <img
                  className="relative w-[1.5px] h-[52px]"
                  alt=""
                  aria-hidden="true"
                  src="/img/line-10.svg"
                />
              ) : null}
            </div>
          ))}
        </div>
        <button
          type="button"
          aria-label="Explore more about Kuvuo 4.0"
          className="inline-flex flex-col items-end gap-1 px-5 py-3 relative flex-[0_0_auto] bg-[#d8c79a]"
        >
          <span className="flex items-center justify-end gap-3 relative self-stretch w-full flex-[0_0_auto]">
            <span className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Google_Sans_Flex',Helvetica] font-medium text-black text-2xl tracking-[-0.48px] leading-[normal]">
              EXPLORE MORE
            </span>
            <img
              className="relative w-[18.41px] h-[18px] mr-[-1.00px]"
              alt=""
              aria-hidden="true"
              src="/img/vector-3-1.svg"
            />
          </span>
        </button>
      </div>
      {productImages.map((image) => (
        <img
          key={image.src}
          className={image.className}
          alt={image.alt}
          src={image.src}
        />
      ))}
    </section>
  );
};
