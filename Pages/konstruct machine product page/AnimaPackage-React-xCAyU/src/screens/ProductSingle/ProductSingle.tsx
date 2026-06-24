import { AppointmentCalloutSection } from "./sections/AppointmentCalloutSection";
import { HeroBannerSection } from "./sections/HeroBannerSection";
import { ProductDescriptionSection } from "./sections/ProductDescriptionSection";
import { ProductSummarySection } from "./sections/ProductSummarySection";
import { RelatedMachinesSection } from "./sections/RelatedMachinesSection";

const galleryThumbs = [
  {
    id: 1,
    top: "top-0",
    src: "/img/stomp-v980-4-1.png",
    alt: "STOMP V950 thumbnail 1",
  },
  {
    id: 2,
    top: "top-40",
    src: "/img/stomp-v980-4-1.png",
    alt: "STOMP V950 thumbnail 2",
  },
  {
    id: 3,
    top: "top-80",
    src: "/img/stomp-v980-4-1.png",
    alt: "STOMP V950 thumbnail 3",
  },
];

export const ProductSingle = (): JSX.Element => {
  return (
    <main
      className="overflow-hidden w-full min-w-[1920px] min-h-[6732px] relative bg-[#282828]"
      data-model-id="2170:5142"
    >
      <div
        className="absolute top-0 left-0 w-[1920px] h-[7837px] bg-[#282828]"
        aria-hidden="true"
      />
      <img
        className="absolute top-0 left-0 w-[1920px] h-[720px] object-cover"
        alt="STOMP V950 hero background"
        src="/img/chatgpt-image-jun-4-2026-08-09-21-am-1.png"
      />
      <header className="absolute top-[276px] left-[97px] w-[565px] h-36 shadow-[0px_4px_4px_#00000040]">
        <nav
          className="absolute top-2 left-[220px] flex items-center gap-[7px]"
          aria-label="Breadcrumb"
        >
          <img
            className="w-[38px] h-[38px]"
            alt=""
            src="/img/home.svg"
            aria-hidden="true"
          />
          <span className="[font-family:'Google_Sans_Flex',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
            Home
          </span>
        </nav>
        <h1 className="top-[57px] left-0 [font-family:'Malking-Regular',Helvetica] text-[#d8c79a] text-[90px] absolute font-normal tracking-[0] leading-[normal] whitespace-nowrap">
          STOMP V950
        </h1>
      </header>
      <HeroBannerSection />
      <ProductSummarySection />
      <section
        className="absolute top-[1985px] left-[91px] w-[790px] h-[630px]"
        aria-label="Product image gallery"
      >
        {galleryThumbs.map((thumb) => (
          <button
            key={thumb.id}
            type="button"
            className={`absolute left-0 ${thumb.top} w-[150px] h-[150px] bg-[#d9d9d9] overflow-hidden`}
            aria-label={thumb.alt}
          >
            <img
              className="w-full h-full object-cover"
              alt=""
              src={thumb.src}
              aria-hidden="true"
            />
          </button>
        ))}

        <div className="absolute top-0 left-40 w-[630px] h-[630px] bg-[#d9d9d9] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt="STOMP V950 main product image"
            src="/img/stomp-v980-4-1.png"
          />
        </div>
        <button
          type="button"
          className="absolute top-[480px] left-0 w-[150px] h-[150px] bg-[linear-gradient(0deg,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.48)_100%),linear-gradient(0deg,rgba(217,217,217,1)_0%,rgba(217,217,217,1)_100%)]"
          aria-label="View 9 more product images"
        >
          <span className="top-10 left-[57px] [font-family:'Malking-Regular',Helvetica] text-white text-3xl absolute font-normal tracking-[0] leading-[normal] whitespace-nowrap">
            9+
          </span>
        </button>
      </section>
      <section
        className="absolute top-[2092px] left-[986px] w-[915px]"
        aria-label="Product overview"
      >
        <h2 className="[text-shadow:-6px_5px_10.4px_#00000040] [font-family:'Mission_X-Regular',Helvetica] font-normal text-[#d8c79a] text-[75px] tracking-[0] leading-[normal]">
          THE POWERHOUSE
        </h2>
        <p className="mt-[55px] w-[731px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[39px] tracking-[0] leading-[normal]">
          Get help with orders, shipping, warranty, parts, maintenance, and
          choosing the right equipment for your job.
        </p>
        <div className="relative mt-[78px] w-[519px] h-[111px]">
          <button
            type="button"
            className="absolute top-0 left-0 w-[255px] h-[60px] flex border-[3px] border-solid border-[#d8c79a] items-start"
            aria-label="Add to cart"
          >
            <span className="mt-[15px] w-[198px] h-[31px] ml-[26px] flex gap-2 items-center">
              <span className="[font-family:'Google_Sans_Flex',Helvetica] font-bold text-neutral-100 text-2xl tracking-[-0.24px] leading-[normal]">
                ADD TO CARD
              </span>
              <img
                className="w-7 h-7"
                alt=""
                src="/img/basket-1.svg"
                aria-hidden="true"
              />
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 left-[264px] w-[255px] h-[60px] bg-[#d8c79a]"
            aria-label="Get a quote"
          >
            <span className="absolute top-4 left-[26px] w-[158px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#2f2f2f] text-2xl tracking-[-0.24px] leading-[normal]">
              GET A QUOTE
            </span>
            <img
              className="absolute top-[13px] left-[187px] w-[34px] h-[34px]"
              alt=""
              src="/img/message-1.svg"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="absolute top-[69px] left-0 w-[130px] h-[42px] bg-neutral-100"
            aria-label="Share product"
          >
            <span className="absolute top-2 left-[23px] w-[85px] h-[26px] flex gap-[3px] items-start">
              <span className="w-14 h-[26px] [font-family:'Google_Sans_Flex',Helvetica] font-medium text-[#153d28] text-[21px] tracking-[0] leading-[normal]">
                Share
              </span>
              <img
                className="mt-px w-6 h-6"
                alt=""
                src="/img/refund-ring-back-1.svg"
                aria-hidden="true"
              />
            </span>
          </button>
          <button
            type="button"
            className="absolute top-[69px] left-[139px] w-[42px] h-[42px] flex bg-[#d8c79a] items-center justify-center"
            aria-label="Favorite product"
          >
            <span className="w-[27px] h-7 flex rounded-[109px] items-center justify-center">
              <img
                className="w-[23.88px] h-auto"
                alt=""
                src="/img/vector-15-1.svg"
                aria-hidden="true"
              />
            </span>
          </button>
        </div>
      </section>
      <img
        className="top-[2092px] left-[263px] w-[591px] h-[483px] absolute aspect-[1.23] object-contain"
        alt="STOMP V950"
        src="/img/stomp-v980-4-1.png"
      />
      <ProductDescriptionSection />
      <RelatedMachinesSection />
      <AppointmentCalloutSection />
    </main>
  );
};
