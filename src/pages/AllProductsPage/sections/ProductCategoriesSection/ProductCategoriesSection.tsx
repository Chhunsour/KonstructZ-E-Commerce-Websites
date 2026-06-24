import { useI18n } from "../../../../context/I18nContext";
const testimonials = [
  {
    id: 1,
    cardClassName:
      "absolute top-[99px] left-0 w-[461px] h-[223px] bg-[#f3f3f4]",
    contentClassName:
      "absolute top-[130px] left-[138px] w-[308px] h-[163px] flex flex-col",
    starsClassName: "absolute top-[138px] left-[141px] w-[65px] h-2.5 flex",
    avatarBgClassName:
      "absolute top-[136px] left-[33px] w-[79px] h-[79px] bg-[#c4c4c4] rounded-[39.5px]",
    avatarImgClassName:
      "top-[284px] left-[33px] absolute w-[79px] h-[79px] aspect-[1]",
    ratingTextClassName:
      "ml-[85.7px] w-[105px] h-6 [font-family:'Outfit',Helvetica] font-normal text-black text-sm tracking-[0] leading-6 whitespace-nowrap",
    titleClassName:
      "ml-[0.2px] w-[138px] h-5 mt-[17.3px] [font-family:'Outfit',Helvetica] font-bold text-base text-black tracking-[0] leading-[normal]",
    descriptionClassName:
      "w-[300px] h-[47px] mt-[10.3px] [font-family:'Outfit',Helvetica] font-normal text-black text-base tracking-[0] leading-6",
    authorClassName:
      "ml-[0.2px] w-[183px] h-6 mt-[20.1px] [font-family:'Outfit',Helvetica] font-normal text-black text-base tracking-[0] leading-6 whitespace-nowrap",
  },
  {
    id: 2,
    cardClassName:
      "absolute top-[99px] left-[484px] w-[462px] h-[223px] bg-[#e2e2e2]",
    contentClassName:
      "absolute top-[130px] left-[618px] w-[302px] h-[163px] flex flex-col",
    starsClassName: "absolute top-[138px] left-[618px] w-[65px] h-2.5 flex",
    avatarBgClassName:
      "absolute top-[136px] left-[515px] w-[79px] h-[79px] bg-[#c4c4c4] rounded-[39.5px]",
    avatarImgClassName:
      "top-[286px] left-[515px] absolute w-[79px] h-[79px] aspect-[1]",
    ratingTextClassName:
      "ml-[85.8px] w-[105px] h-6 [font-family:'Outfit',Helvetica] font-normal text-black text-sm tracking-[0] leading-6 whitespace-nowrap",
    titleClassName:
      "ml-[0.3px] w-[138px] h-5 mt-[17.3px] [font-family:'Outfit',Helvetica] font-bold text-base text-black tracking-[0] leading-[normal]",
    descriptionClassName:
      "w-[294px] h-[47px] mt-[10.3px] [font-family:'Outfit',Helvetica] font-normal text-black text-base tracking-[0] leading-6",
    authorClassName:
      "ml-[0.3px] w-[183px] h-6 mt-[20.1px] [font-family:'Outfit',Helvetica] font-normal text-black text-base tracking-[0] leading-6 whitespace-nowrap",
  },
  {
    id: 3,
    cardClassName:
      "absolute top-[99px] left-[969px] w-[461px] h-[223px] bg-[#f3f3f4]",
    contentClassName:
      "absolute top-[130px] left-[1103px] w-[301px] h-[163px] flex flex-col",
    starsClassName: "absolute top-[138px] left-[1101px] w-[65px] h-2.5 flex",
    avatarBgClassName:
      "absolute top-[136px] left-[1002px] w-[79px] h-[79px] bg-[#c4c4c4] rounded-[39.5px]",
    avatarImgClassName:
      "top-[284px] left-[1002px] absolute w-[79px] h-[79px] aspect-[1]",
    ratingTextClassName:
      "ml-[85.5px] w-[105px] h-6 [font-family:'Outfit',Helvetica] font-normal text-black text-sm tracking-[0] leading-6 whitespace-nowrap",
    titleClassName:
      "ml-0 w-[138px] h-5 mt-[17.3px] [font-family:'Outfit',Helvetica] font-bold text-base text-black tracking-[0] leading-[normal]",
    descriptionClassName:
      "w-[293px] h-[47px] mt-[10.3px] [font-family:'Outfit',Helvetica] font-normal text-black text-base tracking-[0] leading-6",
    authorClassName:
      "ml-0 w-[183px] h-6 mt-[20.1px] [font-family:'Outfit',Helvetica] font-normal text-black text-base tracking-[0] leading-6 whitespace-nowrap",
  },
];

const starItems = [
  {
    src: "/all-products/img/star-3-2.svg",
    alt: "Star",
    className: "ml-[0.3px] w-[9.79px] h-[9.31px]",
  },
  {
    src: "/all-products/img/star-3-2.svg",
    alt: "Star",
    className: "w-[9.79px] h-[9.31px] ml-[3.5px]",
  },
  {
    src: "/all-products/img/star-3-2.svg",
    alt: "Star",
    className: "ml-[4.2px] w-[9.79px] h-[9.31px]",
  },
  {
    src: "/all-products/img/star-5-2.svg",
    alt: "Star",
    className: "w-[9.79px] h-[9.31px] ml-[3.5px]",
  },
  {
    src: "/all-products/img/star-5-2.svg",
    alt: "Star",
    className: "ml-[4.2px] w-[9.79px] h-[9.31px]",
  },
];

export const ProductCategoriesSection = (): JSX.Element => {
  const { t } = useI18n();
  return (
    <section
      className="absolute top-[6982px] left-[254px] w-[1430px] h-[470px]"
      aria-labelledby="customer-testimonials-heading"
    >
      <h2
        id="customer-testimonials-heading"
        className="absolute top-0 left-[159px] [font-family:'Malking-Regular',Helvetica] font-normal text-[#d8c79a] text-[90px] tracking-[0] leading-[normal] whitespace-nowrap"
      >{t("auto.productcategories.what.our.customers")}</h2>
      <div className="absolute top-[148px] left-0 w-[1432px] h-[322px]">
        <p className="absolute top-5 left-px [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[27px] tracking-[0] leading-[normal] whitespace-nowrap">
          Rated 4.7 / 5 based on 28,370 reviews Showing our 4 &amp; 5 star
          reviews
        </p>
        <img
          className="absolute w-[153px] h-[30px] top-0 left-[1277px]"
          alt={t("auto.productcategories.review.platform.rating")}
          src="/all-products/img/group-29.png"
        />
        {testimonials.map((testimonial) => (
          <article key={testimonial.id}>
            <div className={testimonial.cardClassName} />
            <div className={testimonial.avatarBgClassName} />
            <div
              className={testimonial.starsClassName}
              aria-label={t("auto.productcategories.4.out.of")}
            >
              {starItems.map((star, index) => (
                <img
                  key={`${testimonial.id}-star-${index}`}
                  className={star.className}
                  alt={star.alt}
                  src={star.src}
                />
              ))}
            </div>
            <div className={testimonial.contentClassName}>
              <div className={testimonial.ratingTextClassName}>{t("auto.productcategories.4.0.5")}</div>
              <h3 className={testimonial.titleClassName}>{t("auto.productcategories.good.offer.dealer")}</h3>
              <p className={testimonial.descriptionClassName}>
                It is a long established fact that a reader will be distracted
                the industry&#39;s standard.
              </p>
              <p className={testimonial.authorClassName}>{t("auto.productcategories.jhon.mirkant.manager")}</p>
            </div>
            <img
              className={testimonial.avatarImgClassName}
              alt={t("auto.productcategories.customer.portrait")}
              src="/all-products/img/image-72.png"
            />
          </article>
        ))}
      </div>
    </section>
  );
};
