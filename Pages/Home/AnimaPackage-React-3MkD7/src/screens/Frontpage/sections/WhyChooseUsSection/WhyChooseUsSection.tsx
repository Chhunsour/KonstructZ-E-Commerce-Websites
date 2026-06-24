const imageAssets = [
  {
    src: "/img/groundripper-png-4.png",
    alt: "Groundripper machine",
    className: "absolute top-[351px] left-[90px] flex h-[426px] w-[897px]",
    imageClassName:
      "mt-[70px] h-[355.47px] w-[473.96px] aspect-[1.33] object-cover",
  },
  {
    src: "/img/skoop-png-4.png",
    alt: "Skoop machine",
    className: "absolute top-[426px] left-[1262px] h-[351px] w-[624px]",
    imageClassName: "h-full w-full aspect-[1.78] object-cover",
  },
  {
    src: "/img/new-project-16-2.png",
    alt: "Compact construction machine",
    className: "absolute top-[503px] left-[298px] h-[380px] w-[380px]",
    imageClassName: "h-full w-full aspect-[1] object-cover",
  },
  {
    src: "/img/new-project-19-3.png",
    alt: "Tracked construction machine",
    className: "absolute top-[436px] left-[507px] h-[490px] w-[490px]",
    imageClassName: "h-full w-full aspect-[1] object-cover",
  },
  {
    src: "/img/new-project-23-3.png",
    alt: "Heavy equipment lineup",
    className: "absolute top-[293px] left-[987px] h-[711px] w-[745px]",
    imageClassName: "h-full w-full aspect-[0.93] object-cover",
  },
  {
    src: "/img/stomp-v980-5.png",
    alt: "Stomp machine",
    className: "absolute top-[592px] left-[933px] h-[369px] w-[452px]",
    imageClassName: "h-full w-full aspect-[1.23] object-contain",
  },
];

export const WhyChooseUsSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="why-choose-us-title"
      className="absolute left-0 top-[8138px] h-[1004px] w-[1920px]"
    >
      <div
        aria-hidden="true"
        className="absolute left-0 top-[-116px] h-[1120px] w-[1920px] bg-[#2f2f2f]"
      />
      <header className="absolute left-0 top-0 h-[293px] w-full">
        <h2
          id="why-choose-us-title"
          className="absolute left-[601px] top-[81px] whitespace-nowrap text-center [font-family:'Clofie-Bold',Helvetica] text-[81px] font-bold leading-[normal] tracking-[-1.62px] text-[#d8c79a]"
        >
          WHY CHOOSE US?
        </h2>
        <p className="absolute left-[619px] top-[188px] w-[682px] text-center [font-family:'Glonimove-Light',Helvetica] text-[27px] font-normal leading-[29.6px] tracking-[0] text-white">
          <span className="font-light">
            KonstructZ operates from our warehouse in Commerce,{" "}
          </span>
          <span className="[font-family:'Glonimove-Bold',Helvetica] font-bold">
            California
          </span>
          <span className="font-light">
            , giving customers a reliable location for machinery storage, order
            handling, and product support. Our facility helps us prepare
            equipment efficiently and support customers across the United
            States.
          </span>
        </p>
      </header>
      <div aria-hidden="true" className="absolute inset-0">
        {imageAssets.map((asset) => (
          <div key={asset.src} className={asset.className}>
            <img
              alt={asset.alt}
              className={asset.imageClassName}
              src={asset.src}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
