import { useI18n } from "../../../../context/I18nContext";
const testimonials = [
  {
    id: 1,
    rating: "5.0 / 5.0 Review",
    title: "Seamless Online Purchase",
    body: "We ordered the Stomp V980 loader directly through their online checkout. The financing approval took minutes, and the machine was delivered to our site fully ready for deployment.",
    author: "- John Mirkant - Operations Manager",
    cardClassName:
      "absolute top-[99px] left-0 w-[461px] h-[290px] bg-[#f3f3f4] rounded-[12px] shadow-sm border border-neutral-200/40",
    contentClassName:
      "absolute top-[130px] left-[138px] w-[308px] h-[230px] flex flex-col justify-start",
    starsClassName: "absolute top-[138px] left-[141px] w-[65px] h-2.5 flex",
    avatarImageClassName:
      "absolute top-[136px] left-[33px] w-[79px] h-[79px] aspect-[1]",
    reviewTextClassName:
      "ml-[85.7px] [font-family:'Outfit',Helvetica] font-normal text-black text-[20px] tracking-[0] leading-6 whitespace-nowrap",
    titleClassName:
      "ml-[0.2px] w-[280px] mt-[12px] [font-family:'Outfit',Helvetica] font-bold text-black text-[24px] tracking-[0] leading-tight",
    descriptionClassName:
      "w-[300px] mt-[8px] [font-family:'Outfit',Helvetica] font-normal text-neutral-800 text-[19px] leading-snug",
    authorClassName:
      "ml-[0.2px] w-[280px] mt-auto mb-[5px] [font-family:'Outfit',Helvetica] font-medium text-neutral-600 text-[18px] leading-normal whitespace-nowrap",
    starSources: [
      "/img/star-3.svg",
      "/img/star-3.svg",
      "/img/star-3.svg",
      "/img/star-3.svg",
      "/img/star-3.svg",
    ],
    starMargins: [
      "ml-[0.3px]",
      "ml-[3.5px]",
      "ml-[4.2px]",
      "ml-[3.5px]",
      "ml-[4.2px]",
    ],
  },
  {
    id: 2,
    rating: "4.8 / 5.0 Review",
    title: "Easy E-Commerce Compatibility",
    body: "Finding attachment options on this digital store is incredibly easy. We bought a trenching bucket online and had it shipped to our site. The specs check tool is 100% accurate.",
    author: "- Sarah Jenkins - Site Supervisor",
    cardClassName:
      "absolute top-[99px] left-[484px] w-[462px] h-[290px] bg-[#e2e2e2] rounded-[12px] shadow-sm border border-neutral-300/40",
    contentClassName:
      "absolute top-[130px] left-[618px] w-[302px] h-[230px] flex flex-col justify-start",
    starsClassName: "absolute top-[138px] left-[618px] w-[65px] h-2.5 flex",
    avatarImageClassName:
      "absolute top-[136px] left-[515px] w-[79px] h-[79px] aspect-[1]",
    reviewTextClassName:
      "ml-[85.8px] [font-family:'Outfit',Helvetica] font-normal text-black text-[20px] tracking-[0] leading-6 whitespace-nowrap",
    titleClassName:
      "ml-[0.3px] w-[280px] mt-[12px] [font-family:'Outfit',Helvetica] font-bold text-black text-[24px] tracking-[0] leading-tight",
    descriptionClassName:
      "w-[294px] mt-[8px] [font-family:'Outfit',Helvetica] font-normal text-neutral-800 text-[19px] leading-snug",
    authorClassName:
      "ml-[0.3px] w-[280px] mt-auto mb-[5px] [font-family:'Outfit',Helvetica] font-medium text-neutral-600 text-[18px] leading-normal whitespace-nowrap",
    starSources: [
      "/img/star-3-2.svg",
      "/img/star-3-2.svg",
      "/img/star-3-2.svg",
      "/img/star-3-2.svg",
      "/img/star-5-2.svg",
    ],
    starMargins: [
      "ml-[0.2px]",
      "ml-[3.5px]",
      "ml-[4.2px]",
      "ml-[3.5px]",
      "ml-[4.2px]",
    ],
  },
  {
    id: 3,
    rating: "4.9 / 5.0 Review",
    title: "Fast Online Orders & Tracking",
    body: "Ordering heavy equipment online felt risky, but the support chat helped us select the right model. Secure checkout, easy real-time tracking, and fast delivery direct to our yard.",
    author: "- Mateo Silva - Contractor",
    cardClassName:
      "absolute top-[99px] left-[969px] w-[461px] h-[290px] bg-[#f3f3f4] rounded-[12px] shadow-sm border border-neutral-200/40",
    contentClassName:
      "absolute top-[130px] left-[1103px] w-[301px] h-[230px] flex flex-col justify-start",
    starsClassName: "absolute top-[138px] left-[1101px] w-[65px] h-2.5 flex",
    avatarImageClassName:
      "absolute top-[136px] left-[1002px] w-[79px] h-[79px] aspect-[1]",
    reviewTextClassName:
      "ml-[85.5px] [font-family:'Outfit',Helvetica] font-normal text-black text-[20px] tracking-[0] leading-6 whitespace-nowrap",
    titleClassName:
      "ml-0 w-[280px] mt-[12px] [font-family:'Outfit',Helvetica] font-bold text-black text-[24px] tracking-[0] leading-tight",
    descriptionClassName:
      "w-[293px] mt-[8px] [font-family:'Outfit',Helvetica] font-normal text-neutral-800 text-[19px] leading-snug",
    authorClassName:
      "ml-0 w-[280px] mt-auto mb-[5px] [font-family:'Outfit',Helvetica] font-medium text-neutral-600 text-[18px] leading-normal whitespace-nowrap",
    starSources: [
      "/img/star-3-2.svg",
      "/img/star-3-2.svg",
      "/img/star-3-2.svg",
      "/img/star-3-2.svg",
      "/img/star-5-2.svg",
    ],
    starMargins: [
      "ml-[0.2px]",
      "ml-[3.5px]",
      "ml-[4.2px]",
      "ml-[3.5px]",
      "ml-[4.2px]",
    ],
  },
];

export const CustomerTestimonialsSection = (): JSX.Element => {
  const { t } = useI18n();
  return (
    <section
      className="absolute top-[4785px] left-[260px] w-[1430px] h-[550px]"
      aria-labelledby="customer-testimonials-heading"
    >
      <h2
        id="customer-testimonials-heading"
        className="absolute top-0 left-[159px] [font-family:'Malking-Regular',Helvetica] font-normal text-[#d8c79a] text-[50px] tracking-[0] leading-[normal] whitespace-nowrap"
      >{t("auto.customertestimonials.what.our.customers")}</h2>
      <div className="absolute top-[148px] left-0 w-[1432px] h-[390px]">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id}>
            <article
              className={testimonial.cardClassName}
              aria-label={`Customer testimonial ${testimonial.id}`}
            />
            {/* User Profile Avatar Icon aligned relative to the card */}
            <div
              className={`${testimonial.avatarImageClassName} rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-neutral-500">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className={testimonial.contentClassName}>
              <div className={testimonial.reviewTextClassName}>{testimonial.rating}</div>
              <h3 className={testimonial.titleClassName}>{testimonial.title}</h3>
              <p className={testimonial.descriptionClassName}>
                {testimonial.body}
              </p>
              <p className={testimonial.authorClassName}>{testimonial.author}</p>
            </div>
            <div
              className={testimonial.starsClassName}
              aria-label={t("auto.customertestimonials.3.out.of")}
            >
              {testimonial.starSources.map((src, index) => (
                <img
                  key={`${testimonial.id}-star-${index + 1}`}
                  className={`${testimonial.starMargins[index]} w-[9.79px] h-[9.31px]`}
                  alt=""
                  aria-hidden="true"
                  src={src}
                />
              ))}
            </div>
          </div>
        ))}

        <p className="absolute top-5 left-px [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[24px] tracking-[0] leading-[normal] whitespace-nowrap">
          Rated 4.7 / 5 based on 28,370 reviews Showing our 4 &amp; 5 star
          reviews
        </p>
        <img
          className="absolute w-[153px] h-[30px] top-0 left-[1277px]"
          alt={t("auto.customertestimonials.review.platform.rating")}
          src="/img/group-29.png"
        />
      </div>
    </section>
  );
};
