import React, { FormEvent, useId, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import { KonstructzLogo } from "./Navbar";

interface DesktopFooterProps {
  top: number;
}

export const DesktopFooter: React.FC<DesktopFooterProps> = ({ top }) => {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const emailId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email) {
      alert(t("action.subscribed") || "Subscribed!");
      setEmail("");
    }
  };

  const serviceLinks = [
    { label: t("nav.equipment"), href: "/equipment" },
    { label: t("nav.attachments"), href: "/attachments" },
    { label: t("auto.footer.mini.excavators"), href: "/equipment/mini-excavators" },
    { label: t("auto.footer.skid.steers"), href: "/equipment/mini-skid-steers" },
    { label: t("auto.footer.wheel.loaders"), href: "/equipment/wheel-loaders" },
    { label: t("auto.footer.dumpers"), href: "/equipment/dumpers" },
    { label: t("auto.footer.stone.crusher"), href: "/equipment/stone-crushers" },
    { label: t("auto.footer.ground.rippers"), href: "/equipment" },
  ];

  const quickLinks = [
    { label: t("auto.footer.about.company"), href: "/about" },
    { label: t("auto.footer.our.products"), href: "/equipment" },
    { label: t("auto.footer.blog.and.news"), href: "/media" },
    { label: t("auto.footer.contact.us"), href: "/contact" },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
      href: "#",
    },
    {
      label: "Twitter",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: "#",
    },
    {
      label: "Google",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.831 0-8.76-3.929-8.76-8.76s3.929-8.76 8.76-8.76c2.259 0 4.3.849 5.867 2.241l3.116-3.116C18.17 1.259 15.358 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.78 0 12.24-5.46 12.24-12.24 0-.825-.075-1.65-.24-2.455H12.24z" />
        </svg>
      ),
      href: "#",
    },
    {
      label: "LinkedIn",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      href: "#",
    },
    {
      label: "Instagram",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      href: "#",
    },
  ];

  const recentBlogs = [
    {
      date: t("auto.footer.12th.june.2026"),
      title: t("auto.footer.on.the.other"),
      imageSrc: "/img/footer/chatgpt-image-apr-28-2026-09-24-09-am-2.png",
      imageAlt: "Article thumbnail for On The Other Hand",
      imageWidthClass: "w-[131px]",
      imageHeightClass: "h-[74px]",
      topClass: "top-0",
      dateTopClass: "top-[9px]",
      titleTopClass: "top-[30px]",
    },
    {
      date: t("auto.footer.9th.june.2026"),
      title: t("auto.footer.on.the.other"),
      imageSrc: "/img/footer/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
      imageAlt: "Article thumbnail for On The Other Hand",
      imageWidthClass: "w-[130px]",
      imageHeightClass: "h-[73px]",
      topClass: "top-[89px]",
      dateTopClass: "top-[98px]",
      titleTopClass: "top-[119px]",
    },
    {
      date: t("auto.footer.9th.june.2026"),
      title: t("auto.footer.on.the.other"),
      imageSrc: "/img/footer/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
      imageAlt: "Article thumbnail for On The Other Hand",
      imageWidthClass: "w-[130px]",
      imageHeightClass: "h-[73px]",
      topClass: "top-[177px]",
      dateTopClass: "top-[186px]",
      titleTopClass: "top-[207px]",
    },
  ];

  const iconLayers = [
    {
      alt: "Newsletter icon layer 1",
      src: "/img/footer/vector-11.svg",
      className: "absolute w-[53.33%] h-[88.34%] top-[11.66%] left-[46.67%]",
    },
    {
      alt: "Newsletter icon layer 2",
      src: "/img/footer/vector-12.svg",
      className: "absolute w-[53.33%] h-[76.66%] top-[23.34%] left-[46.67%]",
    },
    {
      alt: "Newsletter icon layer 3",
      src: "/img/footer/vector-13.svg",
      className: "absolute w-[40.00%] h-[68.33%] top-[31.67%] left-[60.00%]",
    },
    {
      alt: "Newsletter icon layer 4",
      src: "/img/footer/vector-14.svg",
      className: "absolute w-[53.33%] h-[68.33%] top-[31.67%] left-[46.67%]",
    },
    {
      alt: "Newsletter icon layer 5",
      src: "/img/footer/vector-15.svg",
      className: "absolute w-[53.33%] h-[60.00%] top-[40.00%] left-[46.67%]",
    },
  ];

  return (
    <footer
      className="absolute left-0 w-[1920px] h-[671px] text-theme-text transition-colors duration-200"
      style={{ top: `${top}px` }}
      aria-label="Footer"
    >
      {/* Newsletter Subscription Section */}
      <section
        className="absolute z-10 w-[1170px] h-[153px] top-0 left-[397px]"
        aria-labelledby={`${emailId}-heading`}
      >
        <div className="absolute top-0 left-0 w-[1170px] h-[153px] bg-[#274426]" />
        
        {/* Newsletter Envelope Icon */}
        <div className="absolute top-[42px] left-[46px] w-[69px] h-[69px] bg-[url(/img/footer/vector-10.svg)] bg-[100%_100%]">
          {iconLayers.map((layer, index) => (
            <img
              key={`${layer.src}-${index}`}
              className={layer.className}
              alt={layer.alt}
              src={layer.src}
            />
          ))}
        </div>
        
        <div className="absolute mt-[33px] w-[88px] h-[88px] ml-9 bg-[#d8c79a]" />
        
        <h2
          id={`${emailId}-heading`}
          className="absolute w-[315px] h-[80px] top-[37px] left-[175px] [font-family:'Readex_Pro',Helvetica] font-semibold text-[#d8c79a] text-3xl tracking-[0] leading-10 uppercase"
        >
          {t("auto.footer.subscribe.to.our")}
          <br />
          {t("auto.footer.newsletter.solutions")}
        </h2>

        {/* Subscription Form */}
        <form
          className="absolute w-[513px] h-[50px] top-[52px] left-[592px] flex"
          onSubmit={handleSubmit}
        >
          <div className="flex-grow w-[517px] relative">
            <div className="absolute w-[99.23%] h-full top-0 left-0 bg-[url(/img/footer/vector-8.svg)] bg-[100%_100%]" />
            <label htmlFor={emailId} className="sr-only">
              Email address
            </label>
            <input
              id={emailId}
              type="email"
              placeholder={t("auto.footer.ex.johndoe.gmail")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="absolute w-[63%] h-[36.00%] top-[32.00%] left-[5.42%] [font-family:'Glonimove-Regular',Helvetica] font-normal text-[#636363] placeholder:text-[#636363] text-base tracking-[0] leading-[normal] whitespace-nowrap focus:outline-none bg-transparent border-0 outline-none"
              autoComplete="email"
              required
            />
            <button
              type="submit"
              className="absolute w-[30.56%] h-[90.00%] top-[10.00%] left-[69.44%] flex items-center justify-center cursor-pointer bg-transparent border-0"
              aria-label="Subscribe"
            >
              <img
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                alt=""
                src="/img/footer/rectangle-67.svg"
                aria-hidden="true"
              />
              <span className="relative z-10 [font-family:'Google_Sans_Flex',Helvetica] font-medium text-[#d8c79a] text-sm tracking-[0] leading-[normal] uppercase">
                SUBSCRIBE
              </span>
            </button>
          </div>
        </form>
      </section>

      {/* Main Footer Contents */}
      <div className="absolute z-0 left-0 top-[77px] h-[594px] w-[1920px]">
        <div className="absolute left-0 top-0 flex h-[539px] w-[1920px] bg-[url(/img/footer/rectangle-916.svg)] bg-[100%_100%]" aria-hidden="true">
          <img
            className="mt-[30px] h-[509px] w-[1920px]"
            alt=""
            src="/img/footer/mask-group.png"
          />
        </div>

        {/* Brand Column (New Logo + Description + Socials) */}
        <section
          className="absolute top-[125px] left-[211px] w-[347px] h-[307px] flex flex-col gap-5"
          aria-label={t("auto.footer.company.information")}
        >
          {/* Unified Brand Logo Component */}
          <div className="h-[50px] flex items-center">
            <KonstructzLogo height={50} isDark={false} />
          </div>
          <p className="w-[345px] h-[138px] [font-family:'Glonimove-Regular',Helvetica] text-[21px] leading-[23.3px] font-normal text-white/90 tracking-[0] mt-3">
            {t("auto.footer.konstructz.delivers.tough")}
          </p>
          <nav aria-label="Social media" className="mt-2">
            <ul className="flex items-center gap-2.5 list-none p-0 m-0">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded bg-white/10 hover:bg-[#d8c79a] hover:text-[#274426] text-white transition-colors"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {/* Services Links Column */}
        <nav
          className="absolute left-[636px] top-[121px] h-[351px] w-[147.72px]"
          aria-label={t("auto.footer.our.service")}
        >
          <h2 className="absolute left-0 top-0 h-[24px] w-[133.76px] [font-family:'Clofie-Bold',Helvetica] text-[22px] font-bold leading-[normal] tracking-[0] text-white">
            {t("auto.footer.our.service")}
          </h2>
          <ul className="absolute left-0 top-[87px] h-[264px] w-[161.71px] list-none p-0 m-0">
            {serviceLinks.map((item, index) => (
              <li
                key={item.label}
                className="absolute left-0 [font-family:'Glonimove-Regular',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-white hover:text-[#d8c79a] transition-colors"
                style={{ top: `${index * 35.9}px` }}
              >
                <Link to={item.href} className="text-white hover:text-[#d8c79a] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Links Column */}
        <nav
          className="absolute left-[982px] top-[120px] h-[212.72px] w-[127.1px]"
          aria-label={t("auto.footer.quick.link")}
        >
          <h2 className="absolute left-0 top-0 h-6 w-[119.66px] [font-family:'Clofie-Bold',Helvetica] text-[22px] font-bold leading-[normal] tracking-[0] text-white">
            {t("auto.footer.quick.link")}
          </h2>
          <ul className="absolute left-0 top-[87px] h-[125.72px] w-[133.1px] list-none p-0 m-0">
            {quickLinks.map((link, index) => (
              <li
                key={link.label}
                className="absolute left-0 [font-family:'Glonimove-Regular',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-white hover:text-[#d8c79a] transition-colors"
                style={{ top: `${index * 35.9}px` }}
              >
                <Link to={link.href} className="text-white hover:text-[#d8c79a] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Recent Blogs Header */}
        <section
          className="absolute w-[135.9px] h-6 top-[120px] left-[1347px] flex"
          aria-labelledby="recent-blog-heading"
        >
          <h2
            id="recent-blog-heading"
            className="flex-1 [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[22px] tracking-[0] leading-[normal]"
          >
            {t("auto.footer.recent.blog")}
          </h2>
        </section>

        {/* Recent Blogs List */}
        <section
          aria-label="Recent blog items"
          className="absolute top-[266px] left-[1348px] h-[250px] w-[347px]"
        >
          <div className="relative h-full w-full">
            {recentBlogs.map((item, index) => (
              <article key={`${item.date}-${index}`} className="contents">
                <Link to="/media">
                  <img
                    className={`absolute left-0 ${item.topClass} ${item.imageWidthClass} ${item.imageHeightClass} aspect-[1.78] object-cover hover:scale-[1.03] transition-transform duration-300`}
                    alt={item.imageAlt}
                    src={item.imageSrc}
                    loading="lazy"
                  />
                </Link>
                <time
                  className={`absolute left-[141px] ${item.dateTopClass} w-[77px] [font-family:'Glonimove-Regular',Helvetica] text-xs font-normal leading-[normal] tracking-[0] text-neutral-100`}
                  dateTime={item.date}
                >
                  {item.date}
                </time>
                <p
                  className={`absolute left-[141px] ${item.titleTopClass} w-[194px] [font-family:'Clofie-Bold',Helvetica] text-[15px] font-bold leading-[normal] tracking-[0] text-neutral-100 hover:text-[#d8c79a] transition-colors`}
                >
                  <Link to="/media" className="text-white hover:text-[#d8c79a] transition-colors">
                    {item.title}
                  </Link>
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Copyright and Bottom Links Bar */}
        <div className="top-[539px] w-[1924px] h-[55px] absolute left-0 border-t border-white/10">
          <img
            className="absolute top-0 left-0 w-[1920px] h-[55px]"
            alt=""
            src="/img/footer/rectangle-917.svg"
            aria-hidden="true"
          />
          <p className="absolute w-[371px] h-[11px] top-[21px] left-[373px] [font-family:'Saira',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
            Copyright © 2026 KonstructZ. All Rights Reserved.
          </p>
          <nav
            className="absolute w-[223px] h-[25px] top-[15px] left-[1321px] [font-family:'Saira',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]"
            aria-label={t("auto.footer.legal.and.contact")}
          >
            <ul className="m-0 p-0 list-none flex items-start gap-[20px] whitespace-nowrap">
              <li>
                <Link to="/about" className="hover:text-[#d8c79a] transition-colors text-white">Privacy</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#d8c79a] transition-colors text-white">Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#d8c79a] transition-colors text-white">{t("auto.footer.contact.us")}</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Language button */}
        <div
          className="absolute top-[550px] left-[1568px] w-[42px] h-[34px] rotate-[-0.06deg] flex items-center justify-center"
        >
          <img
            className="w-10 h-[34px] rotate-[0.06deg] absolute top-0 left-0"
            alt=""
            src="/img/footer/image.svg"
            aria-hidden="true"
          />
          <span className="top-[11px] left-[9px] w-[22px] text-[15px] absolute [font-family:'Clofie-Regular',Helvetica] font-normal text-neutral-100 tracking-[0] leading-[normal] whitespace-nowrap select-none">
            EN
          </span>
        </div>
      </div>
    </footer>
  );
};
