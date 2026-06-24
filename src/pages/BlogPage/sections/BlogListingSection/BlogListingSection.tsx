import { useI18n } from "../../../../context/I18nContext";
import { Link } from "react-router-dom";




export const BlogListingSection = (): JSX.Element => {
  const { t } = useI18n();
  const blogCards = [
    {
      id: 1,
      slug: "excavator-safety-practical-tips",
      imageSrc: "/blog/img/chatgpt-image-apr-28-2026-09-24-09-am-3.png",
      imageAlt: t("auto.bloglisting.mini.excavator.blog"),
      imageClassName:
        "absolute top-[85px] left-[90px] w-[655px] h-[369px] aspect-[1.78] object-cover",
      imagePlaceholderClassName:
        "absolute top-[85px] left-[90px] w-[655px] h-[368px] bg-[#e8e8e8]",
      contentClassName: "absolute top-[480px] left-[90px] w-[661px] h-[375px]",
      title: t("auto.bloglisting.on.the.other"),
      date: t("auto.bloglisting.12th.june.2026"),
      author: t("auto.bloglisting.denvor.wayne"),
      excerpt:
        t("auto.bloglisting.rrow.itself.let"),
    },
    {
      id: 2,
      slug: "wheel-loader-field-productivity",
      imageSrc: "/blog/img/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
      imageAlt: t("auto.bloglisting.wheel.loader.blog"),
      imageClassName:
        "absolute top-[85px] left-[775px] w-[655px] h-[369px] aspect-[1.78] object-cover",
      imagePlaceholderClassName:
        "absolute top-[85px] left-[775px] w-[655px] h-[368px] bg-[#e8e8e8]",
      contentClassName: "absolute top-[480px] left-[778px] w-[661px] h-[375px]",
      title: t("auto.bloglisting.on.the.other"),
      date: t("auto.bloglisting.12th.june.2026"),
      author: t("auto.bloglisting.denvor.wayne"),
      excerpt:
        t("auto.bloglisting.rrow.itself.let"),
    },
    {
      id: 3,
      slug: "compact-excavator-buying-guide",
      imageSrc: "/blog/img/chatgpt-image-apr-28-2026-01-54-28-pm-2.png",
      imageAlt: t("auto.bloglisting.excavator.blog.cover"),
      imageClassName:
        "absolute top-[917px] left-[87px] w-[655px] h-[369px] aspect-[1.78] object-cover",
      imagePlaceholderClassName:
        "absolute top-[915px] left-[87px] w-[655px] h-[368px] bg-[#e8e8e8]",
      contentClassName: "absolute top-[1310px] left-[87px] w-[661px] h-[375px]",
      title: t("auto.bloglisting.on.the.other"),
      date: t("auto.bloglisting.12th.june.2026"),
      author: t("auto.bloglisting.denvor.wayne"),
      excerpt:
        t("auto.bloglisting.rrow.itself.let"),
    },
    {
      id: 4,
      slug: "forklift-site-handling-guide",
      imageSrc: "/blog/img/chatgpt-image-apr-28-2026-02-48-35-pm-2.png",
      imageAlt: t("auto.bloglisting.forklift.blog.cover"),
      imageClassName:
        "absolute top-[917px] left-[775px] w-[651px] h-[367px] aspect-[1.78] object-cover",
      imagePlaceholderClassName:
        "absolute top-[915px] left-[775px] w-[651px] h-[368px] bg-[#e8e8e8]",
      contentClassName: "absolute top-[1310px] left-[775px] w-[661px] h-[375px]",
      title: t("auto.bloglisting.on.the.other"),
      date: t("auto.bloglisting.12th.june.2026"),
      author: t("auto.bloglisting.denvor.wayne"),
      excerpt:
        t("auto.bloglisting.rrow.itself.let"),
    },
    {
      id: 5,
      slug: "mini-excavator-maintenance-basics",
      imageSrc: "/blog/img/chatgpt-image-apr-28-2026-09-24-09-am-3.png",
      imageAlt: t("auto.bloglisting.mini.excavator.blog"),
      imageClassName:
        "absolute top-[1747px] left-[90px] w-[655px] h-[369px] aspect-[1.78] object-cover",
      imagePlaceholderClassName:
        "absolute top-[1747px] left-[90px] w-[655px] h-[368px] bg-[#e8e8e8]",
      contentClassName: "absolute top-[2142px] left-[90px] w-[661px] h-[375px]",
      title: t("auto.bloglisting.on.the.other"),
      date: t("auto.bloglisting.12th.june.2026"),
      author: t("auto.bloglisting.denvor.wayne"),
      excerpt:
        t("auto.bloglisting.rrow.itself.let"),
    },
    {
      id: 6,
      slug: "wheel-loader-operator-checklist",
      imageSrc: "/blog/img/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
      imageAlt: t("auto.bloglisting.wheel.loader.blog"),
      imageClassName:
        "absolute top-[1747px] left-[775px] w-[655px] h-[369px] aspect-[1.78] object-cover",
      imagePlaceholderClassName:
        "absolute top-[1747px] left-[775px] w-[655px] h-[368px] bg-[#e8e8e8]",
      contentClassName: "absolute top-[2142px] left-[778px] w-[661px] h-[375px]",
      title: t("auto.bloglisting.on.the.other"),
      date: t("auto.bloglisting.12th.june.2026"),
      author: t("auto.bloglisting.denvor.wayne"),
      excerpt:
        t("auto.bloglisting.rrow.itself.let"),
    },
  ];

  const categories = [
    t("auto.bloglisting.mini.excavator.s"),
    t("auto.bloglisting.skid.steer.s"),
    t("auto.bloglisting.wheel.loader.s"),
    t("auto.bloglisting.forklift.s.blog"),
    t("auto.bloglisting.road.roller.s"),
    t("auto.bloglisting.scissor.lift.s"),
    t("auto.bloglisting.stone.crusher.s"),
  ];

  const latestBlogs = [
    {
      id: 1,
      imageSrc: "/blog/img/chatgpt-image-apr-28-2026-09-24-09-am-2-2.png",
      imageAlt: t("auto.bloglisting.latest.blog.thumbnail"),
      imageClassName:
        "top-0 left-0 w-[131px] h-[74px] absolute aspect-[1.78] object-cover",
      dateClassName:
        "absolute top-[90px] left-[147px] w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-secondery text-xs tracking-[0] leading-[normal]",
      titleClassName:
        "top-[30px] text-secondery absolute left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-[15px] tracking-[0] leading-[normal]",
      date: t("auto.bloglisting.12th.june.2026"),
      title: t("auto.bloglisting.on.the.other"),
    },
    {
      id: 2,
      imageSrc: "/blog/img/chatgpt-image-apr-28-2026-09-26-28-am-2-2.png",
      imageAlt: t("auto.bloglisting.latest.blog.thumbnail"),
      imageClassName:
        "top-[89px] left-0 w-[130px] h-[73px] absolute aspect-[1.78] object-cover",
      dateClassName:
        "top-[179px] left-[147px] text-secondery absolute w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-xs tracking-[0] leading-[normal]",
      titleClassName:
        "top-[119px] text-secondery absolute left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-[15px] tracking-[0] leading-[normal]",
      date: t("auto.bloglisting.12th.june.2026"),
      title: t("auto.bloglisting.on.the.other"),
    },
    {
      id: 3,
      imageSrc: "/blog/img/chatgpt-image-apr-28-2026-01-54-28-pm-2-1.png",
      imageAlt: t("auto.bloglisting.latest.blog.thumbnail"),
      imageClassName:
        "absolute top-[177px] left-0 w-[131px] h-[74px] aspect-[1.78]",
      dateClassName:
        "top-[267px] left-[147px] text-secondery absolute w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-xs tracking-[0] leading-[normal]",
      titleClassName:
        "top-[207px] text-secondery absolute left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-[15px] tracking-[0] leading-[normal]",
      date: t("auto.bloglisting.12th.june.2026"),
      title: t("auto.bloglisting.on.the.other"),
    },
  ];

  return (
    <section
      aria-label={t("auto.bloglisting.blog.listing")}
      className="top-[840px] h-[2600px] bg-[#282828] absolute left-0 w-[1920px]"
    >
      {blogCards.map((card) => (
        <article key={card.id}>
          <div className={card.imagePlaceholderClassName} aria-hidden="true" />
          <img
            className={card.imageClassName}
            alt={card.imageAlt}
            src={card.imageSrc}
            loading="lazy"
          />
          <div className={card.contentClassName}>
            <p className="absolute top-0 left-0 w-[382px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-6">
              {card.date},&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{card.author}
            </p>
            <h2 className="absolute top-[53px] left-0 w-[655px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[40px] tracking-[0] leading-[normal]">
              {card.title}
            </h2>
            <p className="absolute top-[158px] left-0 w-[655px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] tracking-[-0.42px] leading-[27px]">
              {card.excerpt}
            </p>
            <Link
              to={`/media/${card.slug}`}
              aria-label={`Read more about ${card.title}`}
              className="flex w-[178px] h-[69px] items-center justify-center px-5 py-[15px] absolute top-[306px] left-0 bg-[#153d28] shadow-[4px_4px_0px_#00000026] cursor-pointer"
            >
              <span className="relative w-[104px] [font-family:'Google_Sans_Flex',Helvetica] font-semibold text-white text-lg tracking-[0] leading-[normal] text-left">{t("auto.bloglisting.read.more")}</span>
              <img
                className="relative w-[7.71px] h-[13.41px] -ml-1"
                alt=""
                aria-hidden="true"
                src="/blog/img/vector-5.svg"
              />
            </Link>
          </div>
        </article>
      ))}

      <aside
        aria-labelledby="blog-categories-heading"
        className="absolute top-[85px] left-[1469px] w-[377px] h-[361px]"
      >
        <div className="absolute top-0 left-0 w-[361px] h-[361px] bg-[#d9d9d9]" />
        <div className="absolute top-[55px] left-1.5 w-[346px] h-[3px] bg-[#153d28]" />
        <h2
          id="blog-categories-heading"
          className="absolute top-[15px] left-1.5 [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap"
        >
          Blog&apos;s Categories
        </h2>
        <img
          className="absolute top-[9px] left-[321px] w-10 h-10"
          alt=""
          aria-hidden="true"
          src="/blog/img/arrow-drop-left-1.svg"
        />
        <ul className="list-none m-0 p-0">
          {categories.map((category, index) => {
            const top = 71 + index * 39;
            return (
              <li key={category}>
                <div
                  className="absolute left-1.5 w-[27px] h-[27px] border-[3px] border-solid border-[#153d28]"
                  style={{ top: `${top}px` }}
                  aria-hidden="true"
                />
                <button
                  type="button"
                  className="absolute [font-family:'Glonimove-Regular',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal] whitespace-nowrap text-left"
                  style={{ top: `${top + 2}px`, left: "42px" }}
                  aria-label={category}
                >
                  {category}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
      <aside
        aria-labelledby="latest-blogs-heading"
        className="absolute top-[480px] left-[1469px] w-[367px] h-[361px]"
      >
        <div className="absolute top-0 left-0 w-[363px] h-[361px]">
          <div className="absolute top-0 left-0 w-[361px] h-[361px] bg-[#d9d9d9]" />
          <div className="absolute top-[55px] left-1.5 w-[346px] h-[3px] bg-[#153d28]" />
          <h2
            id="latest-blogs-heading"
            className="absolute top-[15px] left-1.5 [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap"
          >{t("auto.bloglisting.latest.blogs")}</h2>
          <img
            className="absolute top-[9px] left-[321px] w-10 h-10"
            alt=""
            aria-hidden="true"
            src="/blog/img/arrow-drop-left-1.svg"
          />
        </div>
        <div className="absolute top-[81px] left-1.5 w-[341px] h-[251px]">
          {latestBlogs.map((blog) => (
            <article key={blog.id}>
              <img
                className={blog.imageClassName}
                alt={blog.imageAlt}
                src={blog.imageSrc}
                loading="lazy"
              />
              <p className={blog.dateClassName}>{blog.date}</p>
              <h3 className={blog.titleClassName}>{blog.title}</h3>
            </article>
          ))}
        </div>
      </aside>
      <h2 className="absolute top-[878px] left-[1553px] [font-family:'Clofie-Bold',Helvetica] font-bold text-[#d8c79a] text-3xl tracking-[0] leading-[normal] whitespace-nowrap">{t("auto.bloglisting.social.medias")}</h2>
      <img
        className="absolute w-[237px] h-10 top-[930px] left-[1531px]"
        alt={t("auto.bloglisting.social.media.icons")}
        src="/blog/img/icon.png"
        loading="lazy"
      />
    </section>
  );
};
