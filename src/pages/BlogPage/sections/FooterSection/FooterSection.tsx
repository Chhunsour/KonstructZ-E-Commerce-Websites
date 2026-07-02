import { useI18n } from "../../../../context/I18nContext";
import { FormEvent, useId, useState } from "react";





export const FooterSection = (): JSX.Element => {
  const { t } = useI18n();
  const serviceLinks = [
    "Equipment",
    "Attachments",
    t("auto.footer.mini.excavators"),
    t("auto.footer.skid.steers"),
    t("auto.footer.wheel.loaders"),
    "Dumpers",
    t("auto.footer.stone.crusher"),
    t("auto.footer.ground.rippers"),
  ];

  const quickLinks = [
    t("auto.footer.about.company"),
    t("auto.footer.our.products"),
    t("auto.footer.blog.and.news"),
    t("auto.footer.contact.us"),
  ];

  const recentBlogs = [
    {
      date: t("auto.footer.12th.june.2026"),
      title: t("auto.footer.on.the.other"),
      image: "/blog/img/chatgpt-image-apr-28-2026-09-24-09-am-2-2.png",
      imageAlt: t("auto.footer.construction.blog.preview"),
      top: "top-0",
      imageWidth: "w-[131px]",
      imageHeight: "h-[74px]",
      textTopDate: "top-[9px]",
      textTopTitle: "top-[30px]",
    },
    {
      date: t("auto.footer.9th.june.2026"),
      title: t("auto.footer.on.the.other"),
      image: "/blog/img/chatgpt-image-apr-28-2026-09-26-28-am-2-2.png",
      imageAlt: t("auto.footer.machinery.blog.preview"),
      top: "top-[89px]",
      imageWidth: "w-[130px]",
      imageHeight: "h-[73px]",
      textTopDate: "top-[98px]",
      textTopTitle: "top-[119px]",
    },
  ];

  const socialIcons = [{ src: "/blog/img/icon-1.png", alt: t("auto.footer.social.media.icons") }];

  const [email, setEmail] = useState("");
  const emailId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <footer
      className="absolute left-0 top-[4300px] h-[671px] w-[1920px]"
      aria-labelledby="footer-newsletter-heading"
    >
      <div className="absolute left-[20.68%] top-0 h-[22.80%] w-[61.04%]">
        <section
          className="absolute left-0 top-0 h-[153px] w-[1170px] bg-[#274426]"
          aria-labelledby="footer-newsletter-heading"
        >
          <div className="ml-9 mt-[33px] h-[88px] w-[88px] bg-[#d8c79a]" />
        </section>
        <div
          className="absolute left-[14.93%] top-[24.18%] h-[52.29%] w-[26.96%] [font-family:'Readex_Pro',Helvetica] text-3xl font-semibold leading-10 tracking-[0] text-[#d8c79a]"
          id="footer-newsletter-heading"
        >{t("auto.footer.subscribe.your.news")}<br />{t("auto.footer.latter.solutions")}</div>
        <form
          className="absolute left-[592px] top-[52px] flex h-[50px] w-[513px]"
          onSubmit={handleSubmit}
        >
          <div className="relative w-[517px] flex-1">
            <div className="absolute left-0 top-0 h-full w-[99.23%] bg-[url(/blog/img/vector-8.svg)] bg-[100%_100%]" />
            <label htmlFor={emailId} className="sr-only">{t("auto.footer.email.address")}</label>
            <input
              id={emailId}
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-label={t("auto.footer.email.address")}
              placeholder={t("auto.footer.ex.johndoe.gmail")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="absolute left-[5.42%] top-0 h-full w-[58%] [font-family:'Glonimove-Regular',Helvetica] text-base font-normal tracking-[0] text-[#636363] placeholder:text-[#636363]"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="absolute left-[69.44%] top-[10.00%] h-[90.00%] w-[30.56%] bg-[url(/blog/img/rectangle-67.svg)] bg-[100%_100%] [font-family:'Google_Sans_Flex',Helvetica] text-sm font-medium tracking-[0] text-[#d8c79a]"
            >
              SUBSCRIBE
            </button>
          </div>
        </form>
        <div
          className="absolute left-[46px] top-[42px] h-[69px] w-[69px] bg-[url(/blog/img/vector-10.svg)] bg-[100%_100%]"
          aria-hidden="true"
        >
          <img loading="lazy" decoding="async"
            className="absolute left-[46.67%] top-[11.66%] h-[88.34%] w-[53.33%]"
            alt=""
            src="/blog/img/vector-11.svg"
          />
          <img loading="lazy" decoding="async"
            className="absolute left-[46.67%] top-[23.34%] h-[76.66%] w-[53.33%]"
            alt=""
            src="/blog/img/vector-12.svg"
          />
          <img loading="lazy" decoding="async"
            className="absolute left-[60.00%] top-[31.67%] h-[68.33%] w-[40.00%]"
            alt=""
            src="/blog/img/vector-13.svg"
          />
          <img loading="lazy" decoding="async"
            className="absolute left-[46.67%] top-[31.67%] h-[68.33%] w-[53.33%]"
            alt=""
            src="/blog/img/vector-14.svg"
          />
          <img loading="lazy" decoding="async"
            className="absolute left-[46.67%] top-[40.00%] h-[60.00%] w-[53.33%]"
            alt=""
            src="/blog/img/vector-15.svg"
          />
        </div>
      </div>
      <img loading="lazy" decoding="async"
        className="absolute left-[211px] top-[175px] h-[101px] w-[345px]"
        alt={t("auto.footer.konstructz.logo")}
        src="/blog/img/vector-7.png"
      />
      <div className="absolute left-0 top-[77px] h-[594px] w-[1920px]">
        <div className="absolute left-0 top-0 flex h-[539px] w-[1920px] bg-[url(/blog/img/rectangle-916.svg)] bg-[100%_100%]">
          <img loading="lazy" decoding="async"
            className="mt-[30px] h-[509px] w-[1920px]"
            alt=""
            src="/blog/img/mask-group.png"
          />
        </div>
        <div className="absolute left-[211px] top-[214px] flex h-[218px] w-[347px] flex-col gap-10">
          <p className="h-[138px] w-[345px] [font-family:'Glonimove-Regular',Helvetica] text-[21px] font-normal leading-[23.3px] tracking-[0] text-white">{t("auto.footer.konstructz.delivers.tough")}</p>
          {socialIcons.map((icon) => (
            <img loading="lazy" decoding="async"
              key={icon.src}
              className="h-10 w-[259.71px]"
              alt={icon.alt}
              src={icon.src}
            />
          ))}
        </div>
        <nav
          className="absolute left-[33.13%] top-[20.37%] h-[59.09%] w-[7.69%]"
          aria-label={t("auto.footer.our.service")}
        >
          <h2 className="absolute left-0 top-0 h-[6.84%] w-[90.55%] [font-family:'Clofie-Bold',Helvetica] text-[22px] font-bold leading-[normal] tracking-[0] text-white">{t("auto.footer.our.service")}</h2>
          <ul className="absolute left-0 top-[24.79%] h-[75.21%] w-[109.48%]">
            {serviceLinks.map((item, index) => (
              <li
                key={item}
                className="absolute left-0 [font-family:'Glonimove-Regular',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-white"
                style={{
                  top: `${index * 13.6}%`,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
        <nav
          className="absolute left-[51.14%] top-[20.20%] h-[35.81%] w-[6.62%]"
          aria-label={t("auto.footer.quick.link")}
        >
          <h2 className="absolute left-0 top-0 h-[11.28%] w-[94.15%] [font-family:'Clofie-Bold',Helvetica] text-[22px] font-bold leading-[normal] tracking-[0] text-white">{t("auto.footer.quick.link")}</h2>
          <ul className="absolute left-0 top-[40.90%] h-[59.10%] w-[104.72%]">
            {quickLinks.map((item, index) => (
              <li
                key={item}
                className="absolute left-0 [font-family:'Glonimove-Regular',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-white"
                style={{
                  top: `${index * 28.56}%`,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
        <section
          className="absolute left-[70.16%] top-[20.20%] flex h-[4.04%] w-[7.18%]"
          aria-labelledby="recent-blog-heading"
        >
          <h2
            id="recent-blog-heading"
            className="w-[135.9px] flex-1 [font-family:'Clofie-Bold',Helvetica] text-[22px] font-bold leading-[normal] tracking-[0] text-white"
          >{t("auto.footer.recent.blog")}</h2>
        </section>
        <div className="absolute left-[1348px] top-[266px] h-[162px] w-[343px]">
          {recentBlogs.map((blog) => (
            <article key={blog.date} className="contents">
              <img loading="lazy" decoding="async"
                className={`absolute left-0 ${blog.top} ${blog.imageWidth} ${blog.imageHeight} aspect-[1.78] object-cover`}
                alt={blog.imageAlt}
                src={blog.image}
              />
              <div
                className={`absolute left-[141px] ${blog.textTopDate} w-[77px] [font-family:'Glonimove-Regular',Helvetica] text-xs font-normal leading-[normal] tracking-[0] text-neutral-100`}
              >
                {blog.date}
              </div>
              <p
                className={`absolute left-[141px] ${blog.textTopTitle} w-[194px] [font-family:'Clofie-Bold',Helvetica] text-[15px] font-bold leading-[normal] tracking-[0] text-neutral-100`}
              >
                {blog.title}
              </p>
            </article>
          ))}
        </div>
        <div className="absolute left-0 top-[539px] h-[55px] w-[1924px]">
          <img loading="lazy" decoding="async"
            className="absolute left-0 top-0 h-[55px] w-[1920px]"
            alt=""
            src="/blog/img/rectangle-917.svg"
          />
          <p className="absolute left-[19.44%] top-[38.18%] h-[20.00%] w-[19.33%] whitespace-nowrap [font-family:'Saira',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-white">
            Copyright © 2026 KonstructZ. All Rights Reserved.
          </p>
          <nav
            className="absolute left-[68.74%] top-[27.27%] h-[45.45%] w-[11.64%] [font-family:'Saira',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-white"
            aria-label={t("auto.footer.footer.legal.and")}
          >
            Privacy&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Policy&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contact
            Us
          </nav>
        </div>
        <div
          className="absolute left-[1568px] top-[550px] h-[34px] w-[42px] rotate-[-0.06deg]"
          aria-label={t("auto.footer.language.selector")}
        >
          <img loading="lazy" decoding="async"
            className="absolute left-0 top-0 h-[34px] w-10 rotate-[0.06deg]"
            alt=""
            src="/blog/img/3.svg"
          />
          <div className="absolute left-[9px] top-[11px] w-[22px] whitespace-nowrap [font-family:'Clofie-Regular',Helvetica] text-[15px] font-normal leading-[normal] tracking-[0] text-neutral-100">
            EN
          </div>
        </div>
      </div>
    </footer>
  );
};
