const stats = [
  {
    icon: "/img/car-service-parts-warning-error-electric-refueling.svg",
    iconAlt: "Weight capacity icon",
    value: "3",
    label: "TONS",
    valueClassName:
      "relative w-fit mt-[-1.00px] [font-family:'Cal_Sans',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-7 whitespace-nowrap",
    labelClassName:
      "relative flex items-center w-fit [font-family:'Roboto_Flex',Helvetica] font-normal text-[#999999] text-base tracking-[0] leading-4 whitespace-nowrap",
  },
  {
    icon: "/img/car-service-parts-speedometer.svg",
    iconAlt: "Digging force icon",
    value: "30 Mpa",
    label: "Digging Force",
    valueClassName:
      "relative w-fit mt-[-1.00px] [font-family:'Cal_Sans',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-7 whitespace-nowrap",
    labelClassName:
      "relative flex items-center w-fit [font-family:'Roboto_Flex',Helvetica] font-normal text-[#999999] text-base tracking-[0] leading-4 whitespace-nowrap",
  },
  {
    icon: "/img/car-service-parts-car-time-timer.svg",
    iconAlt: "Horsepower icon",
    value: "21",
    label: "Horsepower",
    valueClassName:
      "relative w-fit mt-[-1.00px] [font-family:'Cal_Sans',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-7 whitespace-nowrap",
    labelClassName:
      "relative flex items-center w-fit [font-family:'Roboto_Flex',Helvetica] font-normal text-[#999999] text-base tracking-[0] leading-4 whitespace-nowrap",
  },
];

export const Frame = (): JSX.Element => {
  return (
    <main
      className="overflow-hidden w-full min-w-[1920px] min-h-[1080px] relative"
      data-model-id="2430:3033"
      aria-label="Skid steer hero section"
    >
      <div
        className="absolute top-[-21px] -left-2 w-[1942px] h-[1122px] bg-[#282828]"
        aria-hidden="true"
      />
      <img
        className="absolute top-[663px] left-[414px] w-[1092px] h-44"
        alt=""
        src="/img/ellipse-1.svg"
        aria-hidden="true"
      />
      <div
        className="absolute top-[621px] left-[591px] w-[838px] h-[230px] bg-[#d9d9d929] rounded-[419px/115px] blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="absolute top-[827px] left-[960px] w-6 h-6 bg-[#272727] rounded-xl border-2 border-solid border-[#afafaf] aspect-[1]"
        aria-hidden="true"
      />
      <header className="absolute top-[calc(50.00%_-_291px)] left-[calc(50.00%_-_550px)]">
        <h1 className="[font-family:'Malking-Regular',Helvetica] font-normal text-[#d8c79a] text-[210px] tracking-[-4.20px] leading-[210px] whitespace-nowrap">
          SKID STEER
        </h1>
      </header>
      <section
        className="flex w-[1262px] items-center justify-between absolute top-[905px] left-[329px]"
        aria-label="Product details"
      >
        <div className="inline-flex items-center gap-[23px] relative flex-[0_0_auto]">
          <img
            className="relative w-1 h-36"
            alt=""
            src="/img/line-3.svg"
            aria-hidden="true"
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
          aria-label="Machine specifications"
        >
          {stats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className="inline-flex items-center gap-10 relative flex-[0_0_auto]"
            >
              <div
                className="inline-flex flex-col items-center justify-center gap-3.5 relative flex-[0_0_auto]"
                role="listitem"
              >
                <img
                  className="relative w-10 h-10 aspect-[1]"
                  alt={stat.iconAlt}
                  src={stat.icon}
                />
                <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto]">
                  <div className={stat.valueClassName}>{stat.value}</div>
                  <div className={stat.labelClassName}>{stat.label}</div>
                </div>
              </div>
              {index < stats.length - 1 ? (
                <img
                  className="relative w-[1.5px] h-[52px]"
                  alt=""
                  src="/img/line-10.svg"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="inline-flex flex-col items-end gap-1 px-5 py-3 relative flex-[0_0_auto] bg-[#d8c79a] cursor-pointer"
          aria-label="Explore more about Kuvuo 4.0"
        >
          <span className="flex items-center justify-end gap-3 relative self-stretch w-full flex-[0_0_auto]">
            <span className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Google_Sans_Flex',Helvetica] font-medium text-black text-2xl tracking-[-0.48px] leading-[normal]">
              EXPLORE MORE
            </span>
            <img
              className="relative w-[18.41px] h-[18px] mr-[-1.00px]"
              alt=""
              src="/img/vector-3.svg"
              aria-hidden="true"
            />
          </span>
        </button>
      </section>
      <img
        className="absolute top-[401px] left-[158px] w-[455px] h-[455px] aspect-[1] object-cover"
        alt="Compact skid steer side vehicle"
        src="/img/new-project-18-2.png"
      />
      <img
        className="absolute top-[368px] left-[591px] w-[632px] h-[479px] aspect-[1.32]"
        alt="Kuvuo 4.0 skid steer front view"
        src="/img/stomp-v980-4.webp"
      />
      <img
        className="absolute top-[428px] left-[1256px] w-[401px] h-[401px] aspect-[1] object-cover"
        alt="Skid steer attachment vehicle"
        src="/img/new-project-15-2.webp"
      />
    </main>
  );
};
