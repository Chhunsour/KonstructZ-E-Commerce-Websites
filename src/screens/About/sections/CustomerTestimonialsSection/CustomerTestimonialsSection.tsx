import { useI18n } from "../../../../context/I18nContext";
const testimonials = [
  {
    id: 1,
    rating: "5.0 / 5.0 Review",
    title: "Reliable Machinery & Direct Support",
    body: "Outstanding build quality. We purchased the Stomp V980 skid steer and it has been running non-stop on our landscaping site without any issues.",
    author: "- John Mirkant - Operations Manager",
    cardClassName:
      "absolute top-[99px] left-0 w-[461px] h-[223px] bg-[#f3f3f4]",
    contentClassName:
      "absolute top-[130px] left-[138px] w-[308px] h-[163px] flex flex-col",
    starsClassName: "absolute top-[138px] left-[141px] w-[65px] h-2.5 flex",
    avatarImageClassName:
      "absolute top-[136px] left-[33px] w-[79px] h-[79px] aspect-[1]",
    reviewTextClassName:
      "ml-[85.7px] w-[105px] h-6 [font-family:'Outfit',Helvetica] font-normal text-black text-[20px] tracking-[0] leading-6 whitespace-nowrap",
    titleClassName:
      "ml-[0.2px] w-[280px] h-5 mt-[17.3px] [font-family:'Outfit',Helvetica] font-bold text-black text-[24px] tracking-[0] leading-[normal]",
    descriptionClassName:
      "w-[300px] h-[47px] mt-[10.3px] [font-family:'Outfit',Helvetica] font-normal text-black text-[22px] leading-5",
    authorClassName:
      "ml-[0.2px] w-[280px] h-6 mt-[20.1px] [font-family:'Outfit',Helvetica] font-normal text-black text-[22px] leading-6 whitespace-nowrap",
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
    title: "Excellent Service & Parts Dispatch",
    body: "Incredible direct customer support. Our technical questions about attachment hydraulic flows were answered quickly by a machinery specialist.",
    author: "- Sarah Jenkins - Site Supervisor",
    cardClassName:
      "absolute top-[99px] left-[484px] w-[462px] h-[223px] bg-[#e2e2e2]",
    contentClassName:
      "absolute top-[130px] left-[618px] w-[302px] h-[163px] flex flex-col",
    starsClassName: "absolute top-[138px] left-[618px] w-[65px] h-2.5 flex",
    avatarImageClassName:
      "absolute top-[136px] left-[515px] w-[79px] h-[79px] aspect-[1]",
    reviewTextClassName:
      "ml-[85.8px] w-[105px] h-6 [font-family:'Outfit',Helvetica] font-normal text-black text-[20px] tracking-[0] leading-6 whitespace-nowrap",
    titleClassName:
      "ml-[0.3px] w-[280px] h-5 mt-[17.3px] [font-family:'Outfit',Helvetica] font-bold text-black text-[24px] tracking-[0] leading-[normal]",
    descriptionClassName:
      "w-[294px] h-[47px] mt-[10.3px] [font-family:'Outfit',Helvetica] font-normal text-black text-[22px] leading-5",
    authorClassName:
      "ml-[0.3px] w-[280px] h-6 mt-[20.1px] [font-family:'Outfit',Helvetica] font-normal text-black text-[22px] leading-6 whitespace-nowrap",
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
    title: "Tough, Job-Site Ready Equipment",
    body: "The mini excavator is extremely robust and easy to operate. Delivery was fast, DOT-compliant, and direct to our residential construction site.",
    author: "- Mateo Silva - Contractor",
    cardClassName:
      "absolute top-[99px] left-[969px] w-[461px] h-[223px] bg-[#f3f3f4]",
    contentClassName:
      "absolute top-[130px] left-[1103px] w-[301px] h-[163px] flex flex-col",
    starsClassName: "absolute top-[138px] left-[1101px] w-[65px] h-2.5 flex",
    avatarImageClassName:
      "absolute top-[136px] left-[1002px] w-[79px] h-[79px] aspect-[1]",
    reviewTextClassName:
      "ml-[85.5px] w-[105px] h-6 [font-family:'Outfit',Helvetica] font-normal text-black text-[20px] tracking-[0] leading-6 whitespace-nowrap",
    titleClassName:
      "ml-0 w-[280px] h-5 mt-[17.3px] [font-family:'Outfit',Helvetica] font-bold text-black text-[24px] tracking-[0] leading-[normal]",
    descriptionClassName:
      "w-[293px] h-[47px] mt-[10.3px] [font-family:'Outfit',Helvetica] font-normal text-black text-[22px] leading-5",
    authorClassName:
      "ml-0 w-[280px] h-6 mt-[20.1px] [font-family:'Outfit',Helvetica] font-normal text-black text-[22px] leading-6 whitespace-nowrap",
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
      className="absolute top-[4785px] left-[260px] w-[1430px] h-[470px]"
      aria-labelledby="customer-testimonials-heading"
    >
      <h2
        id="customer-testimonials-heading"
        className="absolute top-0 left-[159px] [font-family:'Malking-Regular',Helvetica] font-normal text-[#d8c79a] text-[50px] tracking-[0] leading-[normal] whitespace-nowrap"
      >{t("auto.customertestimonials.what.our.customers")}</h2>
      <div className="absolute top-[148px] left-0 w-[1432px] h-[322px]">
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
