const serviceLinks = [
  "Equipment",
  "Attachments",
  "Mini Excavators",
  "Skid Steers",
  "Wheel Loaders",
  "Dumpers",
  "Stone Crusher",
  "Ground Rippers",
];

const quickLinks = [
  "About Company",
  "Our Products",
  "Blog and News",
  "Contact Us",
];

const recentBlogs = [
  {
    date: "26th June 2026",
    title: "On The Other Hand, We Denounce With And Dislike",
    image: "/img/rectangle-920-1.png",
  },
  {
    date: "9th June 2025",
    title: "On The Other Hand, We Denounce With And Dislike",
    image: "/img/rectangle-920-2.png",
  },
  {
    date: "9th June 2025",
    title: "On The Other Hand, We Denounce With And Dislike",
    image: "/img/rectangle-920-3.png",
  },
];

const socialLinks = [
  { label: "Facebook", icon: "/img/facebook.svg", href: "#" },
  { label: "Twitter", icon: "/img/twitter.svg", href: "#" },
  { label: "Google", icon: "/img/google.svg", href: "#" },
  { label: "LinkedIn", icon: "/img/linkedin.svg", href: "#" },
  { label: "Instagram", icon: "/img/instagram.svg", href: "#" },
];

export const FooterContentSection = (): JSX.Element => {
  return (
    <footer
      className="absolute left-0 top-[77px] h-[594px] w-[1920px]"
      aria-label="Footer"
    >
      <div
        className="absolute left-0 top-0 flex h-[539px] w-[1920px] bg-[url(/img/rectangle-916.svg)] bg-[100%_100%]"
        aria-hidden="true"
      >
        <img
          className="mt-[30px] h-[509px] w-[1920px]"
          alt=""
          src="/img/mask-group.png"
        />
      </div>
      <div className="absolute left-[211px] top-[214px] flex h-[218px] w-[347px] flex-col gap-10">
        <p className="h-[138px] w-[345px] [font-family:'Glonimove-Regular',Helvetica] text-[21px] font-normal leading-[23.3px] tracking-[0] text-white">
          KonstructZ delivers tough, modern machinery solutions built for
          construction, landscaping, and industrial work. Designed for
          performance, durability, and real job-site productivity.
        </p>
        <nav aria-label="Social media">
          <ul className="flex items-center gap-2.5">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  className="block h-10 w-10"
                >
                  <img
                    className="h-10 w-10"
                    alt={social.label}
                    src={social.icon}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <section
        className="absolute left-[636px] top-[121px] h-[351px] w-[147.72px]"
        aria-labelledby="footer-services-heading"
      >
        <h2
          id="footer-services-heading"
          className="absolute left-0 top-0 h-[24px] w-[133.76px] [font-family:'Clofie-Bold',Helvetica] text-[22px] font-bold leading-[normal] tracking-[0] text-white"
        >
          Our Service
        </h2>
        <ul className="absolute left-0 top-[87px] h-[264px] w-[161.71px]">
          {serviceLinks.map((item, index) => (
            <li
              key={item}
              className="absolute left-0 [font-family:'Glonimove-Regular',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-white"
              style={{
                top: `${index * 35.9}px`,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section
        className="absolute left-[982px] top-[120px] h-[212.72px] w-[127.1px]"
        aria-labelledby="footer-quick-links-heading"
      >
        <h2
          id="footer-quick-links-heading"
          className="absolute left-0 top-0 h-6 w-[119.66px] [font-family:'Clofie-Bold',Helvetica] text-[22px] font-bold leading-[normal] tracking-[0] text-white"
        >
          Quick Link
        </h2>
        <nav
          className="absolute left-0 top-[87px] h-[125.72px] w-[133.1px]"
          aria-label="Quick links"
        >
          <ul className="relative h-full w-full">
            {quickLinks.map((item, index) => (
              <li
                key={item}
                className="absolute left-0 [font-family:'Glonimove-Regular',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-white"
                style={{
                  top: `${index * 35.9}px`,
                }}
              >
                <a href="#" className="text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>
      <section
        className="absolute left-[1347px] top-[120px] h-[238px] w-[276px]"
        aria-labelledby="footer-recent-blog-heading"
      >
        <h2
          id="footer-recent-blog-heading"
          className="h-6 w-[135.9px] [font-family:'Clofie-Bold',Helvetica] text-[22px] font-bold leading-[normal] tracking-[0] text-white"
        >
          Recent Blog
        </h2>
        <div className="mt-[33px] flex flex-col gap-[10px]">
          {recentBlogs.map((blog, index) => (
            <article
              key={`${blog.title}-${index}`}
              className="flex h-[53px] w-[276px] items-start gap-[10px]"
            >
              <img
                className="h-[53px] w-[69px] object-cover"
                alt={blog.title}
                src={blog.image}
              />
              <div className="flex w-[197px] flex-col">
                <span className="[font-family:'Glonimove-Regular',Helvetica] text-[8px] font-normal leading-[normal] tracking-[0] text-white">
                  {blog.date}
                </span>
                <a
                  href="#"
                  className="mt-[3px] [font-family:'Glonimove-Regular',Helvetica] text-[14px] font-normal leading-[16px] tracking-[0] text-white"
                >
                  {blog.title}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="absolute left-0 top-[539px] h-[55px] w-[1924px]">
        <img
          className="absolute left-0 top-0 h-[55px] w-[1920px]"
          alt=""
          src="/img/rectangle-917.svg"
          aria-hidden="true"
        />
        <p className="absolute left-[373px] top-[21px] h-[11px] w-[371px] whitespace-nowrap [font-family:'Saira',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-white">
          Copyright © 2026 KonstructZ. All Rights Reserved.
        </p>
        <nav
          className="absolute left-[1321px] top-[15px] h-[25px] w-[223px]"
          aria-label="Legal and contact links"
        >
          <ul className="flex h-full items-center gap-[20px] [font-family:'Saira',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-white">
            <li>
              <a href="#" className="text-white">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="text-white">
                Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-white">
                Contact Us
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <button
        type="button"
        aria-label="Current language: English"
        className="absolute left-[1568px] top-[550px] h-[34px] w-[42px] rotate-[-0.06deg]"
      >
        <img
          className="absolute left-0 top-0 h-[34px] w-10 rotate-[0.06deg]"
          alt=""
          src="/img/image.svg"
          aria-hidden="true"
        />
        <span className="absolute left-[9px] top-[11px] w-[22px] whitespace-nowrap [font-family:'Clofie-Regular',Helvetica] text-[15px] font-normal leading-[normal] tracking-[0] text-neutral-100">
          EN
        </span>
      </button>
    </footer>
  );
};
