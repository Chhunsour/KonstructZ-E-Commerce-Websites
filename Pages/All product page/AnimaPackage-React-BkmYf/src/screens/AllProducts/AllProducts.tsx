import { EquipmentDiscoverySection } from "./sections/EquipmentDiscoverySection";
import { ProductCategoriesSection } from "./sections/ProductCategoriesSection";
import { SkidSteerHeroSection } from "./sections/SkidSteerHeroSection";
import { TestimonialsCallToActionSection } from "./sections/TestimonialsCallToActionSection";

const categoryCards = [
  {
    id: 1,
    containerClassName: "absolute top-[198px] left-[339px] w-[285px] h-[236px]",
    imageClassName:
      "absolute top-[232px] left-[371px] w-[221px] h-[167px] aspect-[1.32]",
    alt: "Stomp",
    src: "/img/stomp-v980-4.png",
  },
  {
    id: 2,
    containerClassName: "absolute top-[198px] left-[658px] w-[284px] h-[236px]",
    imageClassName:
      "absolute top-[198px] left-[707px] w-[186px] h-[226px] aspect-[0.83]",
    alt: "Kuvuo",
    src: "/img/kuvuo-2-5-8.png",
  },
  {
    id: 3,
    containerClassName: "absolute top-[198px] left-[978px] w-[284px] h-[236px]",
    imageClassName:
      "absolute top-[244px] left-[979px] w-[291px] h-[169px] aspect-[1.72]",
    alt: "Fsd",
    src: "/img/fsd1-1.png",
  },
  {
    id: 4,
    containerClassName:
      "absolute top-[198px] left-[1296px] w-[285px] h-[236px]",
    imageClassName:
      "absolute top-[177px] left-[1289px] w-[284px] h-[305px] aspect-[0.93] object-cover",
    alt: "New project",
    src: "/img/new-project-23-1.png",
  },
  {
    id: 5,
    containerClassName: "absolute top-[469px] left-[339px] w-[285px] h-[236px]",
    imageClassName:
      "absolute top-[480px] left-[357px] w-[213px] h-[213px] aspect-[1] object-cover",
    alt: "New project",
    src: "/img/new-project-16-2.png",
  },
  {
    id: 6,
    containerClassName: "absolute top-[469px] left-[658px] w-[284px] h-[236px]",
    imageClassName:
      "absolute top-[469px] left-[684px] w-[233px] h-[233px] aspect-[1] object-cover",
    alt: "New project",
    src: "/img/new-project-15-2.png",
  },
  {
    id: 7,
    containerClassName: "absolute top-[469px] left-[978px] w-[284px] h-[236px]",
    imageClassName:
      "absolute top-[481px] left-[999px] w-[241px] h-[241px] aspect-[1] object-cover",
    alt: "New project",
    src: "/img/new-project-17-2.png",
  },
  {
    id: 8,
    containerClassName:
      "absolute top-[469px] left-[1296px] w-[285px] h-[236px]",
    imageClassName:
      "absolute top-[469px] left-[1323px] w-[239px] h-[239px] aspect-[1] object-cover",
    alt: "New project",
    src: "/img/new-project-22-1.png",
  },
];

const transformationThumbnails = [
  {
    id: 1,
    className: "w-[198px] h-28 aspect-[1.78]",
    alt: "Chatgpt image jun",
    src: "/img/chatgpt-image-jun-10-2026-01-24-24-pm-3.png",
  },
  {
    id: 2,
    className: "w-[198px] h-28 aspect-[1.78] object-cover",
    alt: "Chatgpt image jun",
    src: "/img/chatgpt-image-jun-10-2026-01-24-16-pm-3.png",
  },
  {
    id: 3,
    className: "w-[198px] h-28 aspect-[1.78] object-cover",
    alt: "Chatgpt image jun",
    src: "/img/chatgpt-image-jun-10-2026-01-24-31-pm-3.png",
  },
  {
    id: 4,
    className: "mt-px w-[198px] h-[111px] aspect-[1.78] object-cover",
    alt: "Chatgpt image jun",
    src: "/img/chatgpt-image-jun-10-2026-11-18-24-am-4.png",
  },
];

const logoStripImages = [
  {
    id: 1,
    className:
      "mt-[-8609px] w-[1155px] h-[257px] ml-[-25156px] aspect-[4.49] object-cover",
    alt: "Yamaha motor logo",
    src: "/img/yamaha-motor-logo-full-svg-2-1.png",
  },
  {
    id: 2,
    className:
      "mt-[-8610px] w-[1159px] h-[258px] ml-[228px] aspect-[4.49] object-cover",
    alt: "Yamaha motor logo",
    src: "/img/yamaha-motor-logo-full-svg-2-1.png",
  },
  {
    id: 3,
    className:
      "mt-[37px] w-[1159px] h-[258px] ml-[22614px] aspect-[4.49] object-cover",
    alt: "Yamaha motor logo",
    src: "/img/yamaha-motor-logo-full-svg-3-1.png",
  },
  {
    id: 4,
    className: "mt-[37px] w-[537px] h-[258px] ml-56 aspect-[4.49] object-cover",
    alt: "Yamaha motor logo",
    src: "/img/yamaha-motor-logo-full-svg-4-1.png",
  },
];

export const AllProducts = (): JSX.Element => {
  return (
    <main
      className="overflow-hidden w-full min-w-[1920px] min-h-[8957px] relative bg-[#282828]"
      data-model-id="1582:6499"
    >
      <div
        className="absolute -top-px left-0 w-[1920px] h-[9848px] bg-[#282828]"
        aria-hidden="true"
      />
      <section
        className="absolute top-0 left-0 w-[1920px]"
        aria-label="Skid steer hero section"
      >
        <SkidSteerHeroSection />
      </section>
      <div
        className="absolute top-[1130px] left-0 w-[1920px] h-[300px] flex"
        aria-hidden="true"
      >
        {logoStripImages.map((image) => (
          <img
            key={image.id}
            className={image.className}
            alt={image.alt}
            src={image.src}
          />
        ))}
      </div>
      <section
        className="absolute top-[1534px] -left-0.5 w-[1920px] h-[1080px]"
        aria-labelledby="before-after-title"
      >
        <div className="absolute top-[118px] left-[90px] w-[843px] h-28 flex gap-[17px]">
          {transformationThumbnails.map((thumbnail) => (
            <img
              key={thumbnail.id}
              className={thumbnail.className}
              alt={thumbnail.alt}
              src={thumbnail.src}
            />
          ))}
        </div>
        <h2
          id="before-after-title"
          className="absolute top-[105px] left-[1256px] [font-family:'Clofie-Bold',Helvetica] font-bold text-[#d8c79a] text-[63px] tracking-[0] leading-[normal]"
        >
          Before &amp; After Site <br />
          Transformation
        </h2>
        <img
          className="absolute top-80 left-[90px] w-[1740px] h-[760px] aspect-[2.29]"
          alt="Before and after site transformation comparison"
          src="/img/chatgpt-image-jun-10-2026-11-18-24-am-1-1.png"
        />
        <img
          className="w-[597px] aspect-[0.79] absolute top-80 left-[90px] h-[760px]"
          alt="Site transformation before view"
          src="/img/chatgpt-image-jun-10-2026-11-20-07-am-2.png"
        />
        <div
          className="absolute top-80 left-[665px] w-[43px] h-[760px]"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-[15px] w-3 h-[760px] bg-[#274426]" />
          <div className="absolute top-[358px] left-0 w-[43px] h-[43px] bg-[#d9d9d9] rounded-[47px]" />
          <img
            className="absolute w-[37.65%] h-[50.91%] top-[49.09%] left-[62.35%]"
            alt=""
            src="/img/vector-41.svg"
          />
          <img
            className="absolute w-[80.23%] h-[50.91%] top-[49.09%] left-[19.77%]"
            alt=""
            src="/img/vector-42.svg"
          />
        </div>
      </section>
      <section
        className="absolute top-[2762px] left-0 w-[1920px] h-[900px]"
        aria-labelledby="categories-title"
      >
        <h2
          id="categories-title"
          className="absolute top-0 left-[725px] [font-family:'Clofie-Bold',Helvetica] font-bold text-[#d8c79a] text-[75px] tracking-[-0.75px] leading-[normal] whitespace-nowrap"
        >
          CATEGORIES
        </h2>
        {categoryCards.map((card) => (
          <div key={card.id}>
            <div className={`${card.containerClassName} bg-[#d9d9d9]`} />
            <img
              className={card.imageClassName}
              alt={card.alt}
              src={card.src}
            />
          </div>
        ))}
      </section>
      <section
        className="absolute top-[3531px] left-[1695px]"
        aria-hidden="true"
      >
        <img
          className="w-[225px] h-[361px]"
          alt="Magnet"
          src="/img/magnet.svg"
        />
      </section>
      <section
        className="absolute top-[3662px] left-0 w-[1920px]"
        aria-label="Equipment discovery section"
      >
        <EquipmentDiscoverySection />
      </section>
      <section
        className="absolute top-[6850px] left-0 w-[1920px]"
        aria-label="Product categories section"
      >
        <ProductCategoriesSection />
      </section>
      <section
        className="absolute top-[7596px] left-0 w-[1920px]"
        aria-label="Testimonials and call to action section"
      >
        <TestimonialsCallToActionSection />
      </section>
    </main>
  );
};
