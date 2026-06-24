const galleryImages = [
  {
    src: "/img/factory-with-machines-machinery-inside-it-1.png",
    alt: "Factory with machines and machinery inside",
    className: "absolute top-[729px] left-0 w-[634px] h-[355px] aspect-[1.79]",
  },
  {
    src: "/img/engineer-provides-technical-support-via-headset-solar-panel-fact-1.png",
    alt: "Engineer provides technical support via headset",
    className:
      "absolute top-[729px] left-[643px] w-[633px] h-[355px] aspect-[1.78]",
  },
  {
    src: "/img/male-worker-factory-1.png",
    alt: "Male worker in factory",
    className:
      "absolute top-[729px] left-[1286px] w-[634px] h-[355px] aspect-[1.79]",
  },
];

const galleryBackgrounds = [
  "absolute top-[729px] left-0 w-[634px] h-[355px] bg-[#878787]",
  "absolute top-[729px] left-[643px] w-[633px] h-[355px] bg-[#878787]",
  "absolute top-[729px] left-[1286px] w-[634px] h-[355px] bg-[#878787]",
];

export const OurWarehouseSection = (): JSX.Element => {
  return (
    <section
      className="top-[6971px] left-0 h-[1084px] absolute w-[1920px]"
      aria-labelledby="our-warehouse-section-heading"
    >
      <div className="absolute top-0 left-0 w-[1920px] h-[720px] bg-[#878787]" />
      {galleryBackgrounds.map((className, index) => (
        <div key={index} className={className} />
      ))}
      <div className="absolute top-[544px] left-[829px] w-[261px] h-[63px] bg-[#515151]" />
      <div className="absolute top-[455px] left-[685px] w-[549px] h-[63px] bg-[#515151]" />
      <img
        className="absolute top-0 left-0 w-[1920px] h-[720px] aspect-[2.67]"
        alt="Machine with large number of machines in the background"
        src="/img/machine-with-large-number-machines-background-1.png"
      />
      {galleryImages.map((image) => (
        <img
          key={image.src}
          className={image.className}
          alt={image.alt}
          src={image.src}
        />
      ))}

      <div className="absolute top-[432px] left-[818px] [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[42px] tracking-[0] leading-[normal] whitespace-nowrap">
        <h2
          id="our-warehouse-section-heading"
          className="m-0 text-inherit font-inherit"
        >
          {""}
        </h2>
      </div>
      <p className="absolute top-[343px] left-[499px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Clofie-Black',Helvetica] font-black text-white text-[45px] tracking-[0] leading-[normal] whitespace-nowrap">
        KONSTRUCTZ IS BUILT FOR ONE PURPOSE
      </p>
      <p className="absolute top-[411px] left-[557px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Clofie-Black',Helvetica] font-black text-white text-[45px] tracking-[0] leading-[normal] whitespace-nowrap">
        TO MOVE SERIOUS WORK FORWARD.
      </p>
    </section>
  );
};
