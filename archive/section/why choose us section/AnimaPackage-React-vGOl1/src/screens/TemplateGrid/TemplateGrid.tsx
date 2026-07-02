const imageAssets = [
  {
    src: "/img/groundripper-png-4.png",
    alt: "Groundripper png",
    className:
      "absolute top-[266px] left-[62px] mt-[70px] w-[473.96px] h-[355.47px] aspect-[1.33] object-cover",
  },
  {
    src: "/img/skoop-png-4.png",
    alt: "Skoop png",
    className:
      "absolute top-[341px] left-[1234px] w-[624px] h-[351px] aspect-[1.78] object-cover",
  },
  {
    src: "/img/new-project-16-2.png",
    alt: "New project",
    className:
      "absolute top-[418px] left-[270px] w-[380px] h-[380px] aspect-[1] object-cover",
  },
  {
    src: "/img/new-project-19-3.png",
    alt: "New project",
    className:
      "absolute top-[351px] left-[479px] w-[490px] h-[490px] aspect-[1] object-cover",
  },
  {
    src: "/img/new-project-23-3.png",
    alt: "New project",
    className:
      "absolute top-52 left-[959px] w-[745px] h-[714px] aspect-[0.93] object-cover",
  },
  {
    src: "/img/stomp-v980-5.png",
    alt: "Stomp",
    className:
      "absolute top-[507px] left-[905px] w-[452px] h-[369px] aspect-[1.23] object-contain",
  },
];

export const TemplateGrid = (): JSX.Element => {
  return (
    <section
      className="relative min-h-[922px] w-full min-w-[1920px] overflow-hidden bg-[#282828]"
      data-model-id="2460:5848"
      aria-labelledby="template-grid-heading"
    >
      <div className="absolute top-[-198px] left-0 h-[1120px] w-[1920px] bg-[#282828]" />
      <header className="absolute top-[91px] left-1/2 -translate-x-1/2">
        <h2
          id="template-grid-heading"
          className="whitespace-nowrap text-center [font-family:'Clofie-Bold',Helvetica] text-[81px] font-bold leading-[normal] tracking-[-1.62px] text-[#d8c79a]"
        >
          WHY CHOOSE US?
        </h2>
      </header>
      <p className="absolute top-[211px] left-[628px] w-[682px] text-center [font-family:'Glonimove-Light',Helvetica] text-2xl font-normal leading-[26.3px] tracking-[0] text-white">
        <span className="font-light">
          KonstructZ operates from our warehouse in Commerce,{" "}
        </span>
        <span className="[font-family:'Glonimove-Bold',Helvetica] font-bold">
          California
        </span>
        <span className="font-light">
          , giving customers a reliable location for machinery storage, order
          handling, and product support. Our facility helps us prepare equipment
          efficiently and support customers across the United States.
        </span>
      </p>
      <div aria-hidden="true" className="absolute inset-0">
        {imageAssets.map((image) => (
          <img
            key={`${image.src}-${image.alt}`}
            className={image.className}
            alt={image.alt}
            src={image.src}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </section>
  );
};
