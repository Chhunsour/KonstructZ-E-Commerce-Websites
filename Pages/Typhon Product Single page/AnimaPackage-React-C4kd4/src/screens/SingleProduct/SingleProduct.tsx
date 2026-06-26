import { ProductDetailsSection } from "./sections/ProductDetailsSection";
import { ProductOverviewSection } from "./sections/ProductOverviewSection";
import { RelatedMachinesSection } from "./sections/RelatedMachinesSection";
import { ServiceHighlightsSection } from "./sections/ServiceHighlightsSection";

const breadcrumbItems = [
  { label: "Home", active: false },
  { label: "Mini Excavators", active: false },
  { label: "Engine", active: false },
  { label: "24.4HP Yanmar 3TNV88F Engine", active: false },
  { label: "TYPHON TERROR X2 MAX 2.7 Ton Mini Excavator", active: true },
];

const galleryThumbnails = [
  {
    id: 1,
    wrapperClassName:
      "absolute top-[1043px] left-[219px] w-[174px] h-[173px] bg-neutral-100",
    imageClassName:
      "absolute top-[1061px] left-[219px] w-[174px] h-[137px] aspect-[1.28]",
    alt: "TYPHON TERROR X2 MAX thumbnail 1",
    src: "/img/skoop-2-1-2.png",
  },
  {
    id: 2,
    wrapperClassName:
      "absolute top-[1043px] left-[407px] w-[171px] h-[173px] bg-neutral-100",
    imageClassName:
      "absolute top-[1049px] left-[414px] w-[152px] h-[152px] aspect-[1] object-cover",
    alt: "TYPHON TERROR X2 MAX thumbnail 2",
    src: "/img/new-project-19-1.png",
  },
  {
    id: 3,
    wrapperClassName:
      "absolute top-[1043px] left-[593px] w-[171px] h-[173px] bg-neutral-100",
    imageClassName:
      "absolute top-[1045px] left-[593px] w-[171px] h-[171px] aspect-[1] object-cover",
    alt: "TYPHON TERROR X2 MAX thumbnail 3",
    src: "/img/chatgpt-image-jun-13-2026-07-14-26-am-1.png",
  },
  {
    id: 4,
    wrapperClassName:
      "absolute top-[1043px] left-[778px] w-[174px] h-[173px] bg-neutral-100",
    imageClassName:
      "absolute top-[1040px] left-[776px] w-44 h-44 aspect-[1] object-cover",
    alt: "TYPHON TERROR X2 MAX thumbnail 4",
    src: "/img/chatgpt-image-jun-13-2026-07-19-41-am-1.png",
  },
];

export const SingleProduct = (): JSX.Element => {
  return (
    <main
      className="overflow-hidden w-full min-w-[1920px] min-h-[4104px] relative bg-[#282828]"
      data-model-id="2170:2348"
    >
      <div
        className="absolute top-0 left-0 w-[1920px] h-[8028px] bg-[#282828]"
        aria-hidden="true"
      />
      <nav
        className="absolute top-[186px] left-[211px] flex items-center"
        aria-label="Breadcrumb"
      >
        <img
          className="w-[38px] h-[38px] shrink-0"
          alt="Home"
          src="/img/home.svg"
        />
        <ol className="ml-3 flex flex-wrap items-center">
          {breadcrumbItems.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center [font-family:'Google_Sans_Flex',Helvetica] font-normal text-[27px] tracking-[0] leading-[normal]"
            >
              <span className={item.active ? "text-white" : "text-[#d8c79a]"}>
                {item.label}
              </span>
              {index < breadcrumbItems.length - 1 && (
                <span className="text-white">&nbsp;/&nbsp;</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <section
        className="absolute top-[295px] left-[219px]"
        aria-label="Product image gallery"
      >
        <div className="relative w-[733px] h-[921px]">
          <div
            className="absolute top-0 left-0 w-[733px] h-[733px] bg-neutral-100"
            aria-hidden="true"
          />
          <img
            className="top-[92px] w-[774px] h-[581px] aspect-[1.33] object-cover absolute left-0"
            alt="TYPHON TERROR X2 MAX 2.7 Ton Mini Excavator"
            src="/img/skoop-2-1-1.png"
          />
          {galleryThumbnails.map((thumbnail) => (
            <div key={thumbnail.id}>
              <div className={thumbnail.wrapperClassName} aria-hidden="true" />
              <img
                className={thumbnail.imageClassName}
                alt={thumbnail.alt}
                src={thumbnail.src}
              />
            </div>
          ))}
          <div
            className="absolute top-[910px] left-0 w-[174px] h-[11px] bg-[#153d28]"
            aria-hidden="true"
          />
          <button
            type="button"
            aria-label="View product image in fullscreen"
            className="absolute top-[668px] left-[661px] inline-flex h-[60px] w-[60px] items-center justify-center"
          >
            <img
              className="w-[60px] h-[60px]"
              alt=""
              src="/img/full.svg"
              aria-hidden="true"
            />
          </button>
        </div>
      </section>
      <ProductOverviewSection />
      <ServiceHighlightsSection />
      <ProductDetailsSection />
      <RelatedMachinesSection />
      <img
        className="absolute top-[1072px] left-[566px] w-[227px] h-[116px] aspect-[1.96] object-cover"
        alt="TYPHON TERROR X2 MAX detail thumbnail"
        src="/img/mini-excavator-png-3.png"
      />
    </main>
  );
};
