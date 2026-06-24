const mapImages = [
  {
    src: "/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1.png",
    alt: "Regional warehouse location map",
    className: "absolute top-[137px] left-0 w-[1001px] h-[801px] aspect-[2.14]",
  },
  {
    src: "/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1-1.png",
    alt: "Highlighted warehouse service area",
    className:
      "absolute top-[529px] left-[301px] w-[235px] h-[250px] aspect-[0.9]",
  },
];

const overlayImages = [
  {
    src: "/img/screenshot-2026-06-03-at-8-21-34-am-1.png",
    alt: "Map screenshot showing the Commerce, California warehouse location",
    className:
      "absolute top-[271px] left-[90px] w-[885px] h-[495px] aspect-[1.79]",
  },
  {
    src: "/img/image-596.png",
    alt: "Los Angeles label graphic",
    className: "absolute top-[285px] left-[99px] w-[270px] h-[90px] aspect-[3]",
  },
];

export const LocationMapSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="location-map-section-heading"
      className="absolute top-[2628px] left-0 w-[1920px] h-[1000px] flex flex-col gap-[109px]"
    >
      <header className="ml-[487px]">
        <h2
          id="location-map-section-heading"
          className="w-[981px] h-[72px] [font-family:'Malking-Regular',Helvetica] font-normal text-[#d8c79a] text-[75px] tracking-[0] leading-[normal] whitespace-nowrap"
        >
          Our Location &amp; Warehouse
        </h2>
      </header>
      <div
        className="h-[819px] relative bg-[#282828] overflow-hidden"
        role="img"
        aria-label="Warehouse location section with address details and regional map visuals"
      >
        <div
          className="absolute top-[-137px] left-[919px] w-[2003px] h-[938px]"
          aria-hidden="true"
        >
          {mapImages.map((image) => (
            <img
              key={image.src}
              className={image.className}
              alt={image.alt}
              src={image.src}
              loading="lazy"
            />
          ))}
        </div>
        {overlayImages.map((image) => (
          <img
            key={image.src}
            className={image.className}
            alt={image.alt}
            src={image.src}
            loading="lazy"
          />
        ))}

        <p className="absolute top-[99px] left-[99px] w-[1022px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[42px] tracking-[0] leading-[normal]">
          Our main warehouse is located at 2522 S Malt Ave., Commerce, CA 90040,
          United States.
        </p>
      </div>
    </section>
  );
};
