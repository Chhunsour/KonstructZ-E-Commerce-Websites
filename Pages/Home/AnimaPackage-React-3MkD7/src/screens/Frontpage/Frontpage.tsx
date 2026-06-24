import { BrandShowcaseSection } from "./sections/BrandShowcaseSection";
import { FeatureHighlightsSection } from "./sections/FeatureHighlightsSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { OurWarehouseSection } from "./sections/OurWarehouseSection";
import { ProductCarouselSection } from "./sections/ProductCarouselSection";
import { ScheduleAppointmentSection } from "./sections/ScheduleAppointmentSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";

const topBrandLogos = [
  {
    alt: "Ground ripper logo",
    src: "/img/ground-ripper-logo-1.png",
    className:
      "absolute top-[50px] left-[81px] w-[86px] h-[35px] aspect-[2.47] object-cover",
  },
  {
    alt: "Scoopy dig logo",
    src: "/img/scoopy-dig-logo-1.png",
    className:
      "absolute top-[50px] left-[364px] w-[210px] h-[39px] aspect-[5.34]",
  },
  {
    alt: "Skoop logo",
    src: "/img/skoop-2-logo-1.png",
    className:
      "absolute top-[50px] left-[767px] w-[210px] h-[41px] aspect-[5.14]",
  },
  {
    alt: "Spider one logo",
    src: "/img/spider-one-logo-1.png",
    className:
      "absolute top-[45px] left-[1173px] w-[232px] h-[50px] aspect-[4.61]",
  },
  {
    alt: "Stomp logo",
    src: "/img/stomp-logo-1.png",
    className: "absolute top-[45px] left-[1604px] w-[270px] h-11 aspect-[6.18]",
  },
  {
    alt: "Image",
    src: "/img/stone-krusher-logo-1.png",
    className:
      "absolute top-[-8576px] left-[-23695px] w-[233px] h-[94px] aspect-[2.47] object-cover",
  },
  {
    alt: "Stone krusher logo",
    src: "/img/stone-krusher-logo-1.png",
    className:
      "absolute top-[-8554px] left-[-23267px] w-[122px] h-[49px] aspect-[2.47] object-cover",
  },
];

const midPageBrandStrip = [
  {
    alt: "Yamaha motor logo",
    src: "/img/yamaha-motor-logo-full-svg-3-1.png",
    className:
      "mt-[-9780px] w-[1159px] h-[258px] ml-[-23889px] aspect-[4.49] object-cover",
  },
  {
    alt: "Yamaha motor logo",
    src: "/img/yamaha-motor-logo-full-svg-3-1.png",
    className:
      "mt-[-9780px] w-[1159px] h-[258px] ml-[2948px] aspect-[4.49] object-cover",
  },
  {
    alt: "Yamaha motor logo",
    src: "/img/yamaha-motor-logo-full-svg-4-1.png",
    className:
      "mt-[37px] w-[664px] h-[258px] ml-[20500px] aspect-[4.49] object-cover",
  },
  {
    alt: "Yamaha motor logo",
    src: "/img/yamaha-motor-logo-full-svg-1-2.png",
    className:
      "mt-[38px] w-[1073px] h-[257px] ml-[183px] aspect-[4.49] object-cover",
  },
];

export const Frontpage = (): JSX.Element => {
  return (
    <main
      className="bg-[#2f2f2f] overflow-hidden w-full min-w-[1920px] min-h-[11083px] relative"
      data-model-id="1582:4260"
      aria-label="Konstructz frontpage"
    >
      <div
        className="absolute top-0 left-0 w-[1920px] h-[120px] bg-[#2f2f2f]"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 w-[1920px] h-[1080px] bg-[#2f2f2f]"
        aria-hidden="true"
      />
      <div
        className="absolute top-[659px] left-[441px] w-[75px] h-[75px] rounded-[44.5px] border-[6px] border-solid border-[#153d28]"
        aria-hidden="true"
      />
      <img
        className="absolute top-[669px] left-[451px] w-[54px] h-[54px]"
        alt="Expand right"
        src="/img/expand-right.svg"
      />
      <div
        className="absolute top-[606px] left-[1029px] w-[451px] h-[391px] bg-[#d9d9d9] rounded-[418px] blur-[134.65px] backdrop-blur-[140.2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(140.2px)_brightness(100%)]"
        aria-hidden="true"
      />
      <img
        className="absolute top-[182px] left-[769px] w-[721px] h-[872px] aspect-[0.83]"
        alt="Kuvuo"
        src="/img/kuvuo-2-5-2.png"
      />
      <img
        className="absolute top-0 left-0 w-[1919px] h-[1080px] aspect-[1.78] object-cover"
        alt="Chatgpt image jun"
        src="/img/chatgpt-image-jun-4-2026-08-09-21-am-1.png"
      />
      <section aria-label="Hero">
        <HeroSection />
      </section>
      <div
        className="absolute top-[364px] left-[125px] w-[251px] h-[58px] border-[3px] border-solid border-[#d8c79a]"
        aria-hidden="true"
      />
      <div className="absolute top-[375px] left-[143px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[33px] tracking-[0] leading-[normal] whitespace-nowrap">
        Mini Skid Steer
      </div>
      <h1 className="absolute top-[448px] left-[125px] w-[817px] [text-shadow:-6px_5px_10.4px_#00000040] [font-family:'Mission_X-Regular',Helvetica] font-normal text-transparent text-8xl tracking-[0] leading-[normal]">
        <span className="text-white">KONSTRUCTZ </span>
        <span className="text-[#d8c79a]">STOMP V950</span>
      </h1>
      <section
        className="absolute top-[1206px] left-0 w-[1920px] h-[900px] bg-[#d9d9d9]"
        aria-label="Promotional imagery"
      >
        <img
          className="absolute top-0 left-[720px] w-[1200px] h-[900px] object-cover"
          alt="Rectangle"
          src="/img/rectangle-9581.png"
        />
        <div
          className="absolute top-[450px] left-0 w-[720px] h-[450px] bg-[#114f2f]"
          aria-hidden="true"
        />
        <img
          className="absolute top-[450px] left-0 w-[720px] h-[450px] aspect-[1.6]"
          alt="Remove the white"
          src="/img/remove-the-white-background-and-202605291020-1.png"
        />
        <div
          className="absolute top-0 left-0 w-[720px] h-[450px] bg-[#e22c2c]"
          aria-hidden="true"
        />
        <img
          className="absolute top-0 left-0 w-[720px] h-[450px] aspect-[1.61]"
          alt="Change the aspect"
          src="/img/change-the-aspect-ratio-to-202605291023-1.png"
        />
      </section>
      <section aria-label="Product carousel">
        <ProductCarouselSection />
      </section>
      <section aria-label="Brand showcase">
        <BrandShowcaseSection />
      </section>
      <div
        className="absolute top-[2300px] left-[-1877px] w-[5262px] h-[300px] flex"
        aria-hidden="true"
      >
        {midPageBrandStrip.map((logo, index) => (
          <img
            key={`${logo.src}-${index}`}
            className={logo.className}
            alt={logo.alt}
            src={logo.src}
          />
        ))}
      </div>
      <section
        className="absolute top-[1080px] left-px w-[1920px] h-[127px] overflow-hidden"
        aria-label="Partner brands"
      >
        <div
          className="absolute -top-px left-[-469px] w-[3640px] h-[127px] bg-[#070806]"
          aria-hidden="true"
        />
        {topBrandLogos.map((logo, index) => (
          <img
            key={`${logo.src}-${index}`}
            className={logo.className}
            alt={logo.alt}
            src={logo.src}
          />
        ))}
      </section>
      <section aria-label="Schedule appointment">
        <ScheduleAppointmentSection />
      </section>
      <section aria-label="Our warehouse">
        <OurWarehouseSection />
      </section>
      <img
        className="absolute top-[9384px] left-0.5 w-[1918px] h-[857px]"
        alt="Frame"
        src="/img/frame-2147225719.svg"
      />
      <section aria-label="Feature highlights">
        <FeatureHighlightsSection />
      </section>
      <section aria-label="Footer">
        <FooterSection />
      </section>
      <section aria-label="Why choose us">
        <WhyChooseUsSection />
      </section>
    </main>
  );
};
