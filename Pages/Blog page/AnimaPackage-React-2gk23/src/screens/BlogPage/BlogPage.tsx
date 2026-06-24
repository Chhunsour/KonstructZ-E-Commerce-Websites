import { AppointmentCtaSection } from "./sections/AppointmentCtaSection";
import { BlogHeroSection } from "./sections/BlogHeroSection";
import { BlogListingSection } from "./sections/BlogListingSection";
import { FooterSection } from "./sections/FooterSection";
import { HeaderSection } from "./sections/HeaderSection";

const paginationItems = [
  {
    label: "1",
    active: true,
    left: "0px",
    widthClass: "w-[57px]",
    bg: "bg-[#153d28]",
    textColor: "text-white",
  },
  {
    label: "2",
    active: false,
    left: "68px",
    widthClass: "w-[57px]",
    bg: "bg-[#d9d9d9]",
    textColor: "text-[#153d28]",
  },
  {
    label: "3",
    active: false,
    left: "136px",
    widthClass: "w-[57px]",
    bg: "bg-[#d9d9d9]",
    textColor: "text-[#153d28]",
  },
  {
    label: "4",
    active: false,
    left: "204px",
    widthClass: "w-14",
    bg: "bg-[#d9d9d9]",
    textColor: "text-[#153d28]",
  },
  {
    label: "5",
    active: false,
    left: "272px",
    widthClass: "w-14",
    bg: "bg-[#d9d9d9]",
    textColor: "text-[#153d28]",
  },
  {
    label: "6",
    active: false,
    left: "340px",
    widthClass: "w-14",
    bg: "bg-[#d9d9d9]",
    textColor: "text-[#153d28]",
  },
];

const paginationTextPositions = [
  "23px",
  "91px",
  "157px",
  "225px",
  "293px",
  "361px",
];
const ellipsisDots = [
  { left: "401px", widthClass: "w-[9px]" },
  { left: "414px", widthClass: "w-[9px]" },
  { left: "427px", widthClass: "w-2.5" },
];

export const BlogPage = (): JSX.Element => {
  return (
    <main
      className="overflow-hidden w-full min-w-[1920px] min-h-[4972px] relative bg-[#282828]"
      data-model-id="1582:10259"
    >
      <div
        className="absolute top-0 left-0 w-[1920px] h-[5218px] bg-[#282828]"
        aria-hidden="true"
      />
      <HeaderSection />
      <BlogHeroSection />
      <BlogListingSection />
      <nav
        className="absolute top-[3496px] left-[714px] w-[492px] h-[57px]"
        aria-label="Blog pagination"
      >
        <img
          className="absolute w-[6.84%] h-[92.35%] top-[7.65%] left-[93.16%]"
          alt="Next page"
          src="/img/vector-6.svg"
        />
        {paginationItems.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-current={item.active ? "page" : undefined}
            aria-label={`Go to page ${item.label}`}
            className={`absolute top-0 left-[${item.left}] ${item.widthClass} h-[57px] ${item.bg}`}
          >
            <span
              className={`absolute top-3.5 left-[${paginationTextPositions[index]}] [font-family:'Google_Sans_Flex',Helvetica] font-bold ${item.textColor} text-2xl tracking-[0] leading-[normal]`}
            >
              {item.label}
            </span>
          </button>
        ))}

        {ellipsisDots.map((dot, index) => (
          <div
            key={index}
            className={`absolute top-12 left-[${dot.left}] ${dot.widthClass} h-[9px] bg-[#d9d9d9]`}
            aria-hidden="true"
          />
        ))}
      </nav>
      <AppointmentCtaSection />
      <FooterSection />
    </main>
  );
};
