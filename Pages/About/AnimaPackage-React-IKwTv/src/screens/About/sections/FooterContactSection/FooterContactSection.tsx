import { FormEvent, useId, useState } from "react";

const quickLinks = [
  "About Company",
  "Our Products",
  "Blog and News",
  "Contact Us",
];

const services = [
  "Equipment",
  "Attachments",
  "Mini Excavators",
  "Skid Steers",
  "Wheel Loaders",
  "Dumpers",
  "Stone Crusher",
  "Ground Rippers",
];

const recentBlogs = [
  {
    date: "12th June 2026",
    title: "On The Other Hand, We Denounce With And Dislike",
    image: "/img/chatgpt-image-apr-28-2026-09-24-09-am-2.png",
    imageClassName:
      "absolute top-0 left-0 w-[131px] h-[74px] aspect-[1.78] object-cover",
    dateClassName:
      "absolute top-[9px] left-[141px] w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-neutral-100 text-xs tracking-[0] leading-[normal]",
    titleClassName:
      "absolute top-[30px] left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-neutral-100 text-[15px] tracking-[0] leading-[normal]",
  },
  {
    date: "9th June 2026",
    title: "On The Other Hand, We Denounce With And Dislike",
    image: "/img/chatgpt-image-apr-28-2026-09-26-28-am-2.png",
    imageClassName:
      "absolute top-[89px] left-0 w-[130px] h-[73px] aspect-[1.78] object-cover",
    dateClassName:
      "absolute top-[98px] left-[141px] w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-neutral-100 text-xs tracking-[0] leading-[normal]",
    titleClassName:
      "absolute top-[119px] left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-neutral-100 text-[15px] tracking-[0] leading-[normal]",
  },
];

export const FooterContactSection = (): JSX.Element => {
  const emailId = useId();
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <footer
      className="absolute top-[6323px] left-[9px] w-[1920px] h-[671px]"
      aria-label="Footer contact section"
    >
      <div className="w-[1920px] h-[594px] top-[77px] absolute left-0">
        <div className="absolute top-0 left-0 w-[1920px] h-[539px]">
          <img
            className="absolute top-0 left-0 w-[1911px] h-[539px]"
            alt=""
            aria-hidden="true"
            src="/img/rectangle-916.svg"
          />
          <img
            className="absolute top-[30px] left-0 w-[1911px] h-[509px]"
            alt=""
            aria-hidden="true"
            src="/img/mask-group.png"
          />
        </div>
        <nav
          className="absolute w-[6.62%] h-[35.81%] top-[20.20%] left-[51.14%]"
          aria-labelledby="footer-quick-links-heading"
        >
          <h2
            id="footer-quick-links-heading"
            className="absolute w-[94.15%] h-[11.28%] top-0 left-0 [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[22px] tracking-[0] leading-[normal]"
          >
            Quick Link
          </h2>
          <div className="absolute w-[104.72%] h-[59.10%] top-[40.90%] left-0">
            {quickLinks.map((link, index) => {
              const positions = [
                "absolute w-[93.99%] h-[14.32%] top-0 left-0",
                "absolute w-[77.64%] h-[14.32%] top-[28.56%] left-0",
                "absolute w-[84.18%] h-[14.32%] top-[57.13%] left-0",
                "absolute w-[65.38%] h-[14.32%] top-[85.68%] left-0",
              ];

              return (
                <a
                  key={link}
                  href="#"
                  className={`${positions[index]} [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]`}
                >
                  {link}
                </a>
              );
            })}
          </div>
        </nav>
        <section
          className="absolute w-[7.18%] h-[4.04%] top-[20.20%] left-[70.16%] flex"
          aria-labelledby="recent-blog-heading"
        >
          <h2
            id="recent-blog-heading"
            className="flex-1 w-[135.9px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[22px] tracking-[0] leading-[normal]"
          >
            Recent Blog
          </h2>
        </section>
        <nav
          className="absolute w-[7.69%] h-[59.09%] top-[20.37%] left-[33.13%]"
          aria-labelledby="footer-services-heading"
        >
          <h2
            id="footer-services-heading"
            className="w-[90.55%] h-[6.84%] top-0 left-0 [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[22px] absolute tracking-[0] leading-[normal]"
          >
            Our Service
          </h2>
          <div className="absolute w-[109.48%] h-[75.21%] top-[24.79%] left-0">
            {services.map((service, index) => {
              const serviceClasses = [
                "absolute w-[66.57%] h-[6.82%] top-0 left-0",
                "absolute w-[75.98%] h-[6.82%] top-[13.60%] left-0",
                "absolute w-[86.07%] h-[6.82%] top-[27.21%] left-0",
                "absolute w-[69.93%] h-[6.82%] top-[40.81%] left-0",
                "absolute w-[87.41%] h-[6.82%] top-[54.41%] left-0",
                "absolute w-[57.83%] h-[6.82%] top-[67.42%] left-0",
                "absolute w-[84.73%] h-[6.82%] top-[80.30%] left-0",
                "absolute w-[90.10%] h-[6.82%] top-[93.18%] left-0",
              ];

              return (
                <a
                  key={service}
                  href="#"
                  className={`${serviceClasses[index]} [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]`}
                >
                  {service}
                </a>
              );
            })}
          </div>
        </nav>
        <div className="absolute top-[214px] left-[211px] w-[347px] h-[218px] flex flex-col gap-10">
          <p className="w-[345px] h-[138px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[23.3px]">
            KonstructZ delivers tough, modern machinery solutions built for
            construction, landscaping, and industrial work. Designed for
            performance, durability, and real job-site productivity.
          </p>
          <img
            className="w-[259.71px] h-10"
            alt="Social media icons"
            src="/img/icon.png"
          />
        </div>
        <div className="top-[539px] w-[1924px] h-[55px] absolute left-0">
          <img
            className="absolute top-0 left-0 w-[1911px] h-[55px]"
            alt=""
            aria-hidden="true"
            src="/img/rectangle-917.svg"
          />
          <p className="absolute w-[19.33%] h-[20.00%] top-[38.18%] left-[19.44%] [font-family:'Saira',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
            Copyright © 2026 KonstructZ. All Rights Reserved.
          </p>
          <nav
            className="absolute w-[11.64%] h-[45.45%] top-[27.27%] left-[68.74%] [font-family:'Saira',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]"
            aria-label="Legal and contact links"
          >
            <div className="flex items-center gap-[22px] whitespace-nowrap">
              <a href="#">Privacy</a>
              <a href="#">Policy</a>
              <a href="#">Contact Us</a>
            </div>
          </nav>
        </div>
        <button
          type="button"
          className="absolute top-[550px] left-[1568px] w-[42px] h-[34px] rotate-[-0.06deg]"
          aria-label="Change language, current language English"
        >
          <img
            className="w-10 h-[34px] rotate-[0.06deg] absolute top-0 left-0"
            alt=""
            aria-hidden="true"
            src="/img/3.svg"
          />
          <span className="top-[11px] left-[9px] w-[22px] text-[15px] absolute [font-family:'Clofie-Regular',Helvetica] font-normal text-neutral-100 tracking-[0] leading-[normal] whitespace-nowrap">
            EN
          </span>
        </button>
      </div>
      <img
        className="absolute top-[175px] left-[211px] w-[345px] h-[101px]"
        alt="KonstructZ logo"
        src="/img/vector.png"
      />
      <section
        className="absolute w-[61.04%] h-[22.80%] top-0 left-[20.68%]"
        aria-labelledby="newsletter-heading"
      >
        <div className="absolute top-0 left-0 w-[1170px] h-[153px] flex bg-[#274426]">
          <div className="mt-[33px] w-[88px] h-[88px] ml-9 bg-[#d8c79a]" />
        </div>
        <h2
          id="newsletter-heading"
          className="absolute w-[26.96%] h-[52.29%] top-[24.18%] left-[14.93%] [font-family:'Readex_Pro',Helvetica] font-semibold text-[#d8c79a] text-3xl tracking-[0] leading-10"
        >
          Subscribe Your News
          <br />
          Latter Solutions?
        </h2>
        <form
          className="absolute w-[513px] h-[50px] top-[52px] left-[592px] flex"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 w-[517px] relative">
            <div
              className="absolute w-[99.23%] h-full top-0 left-0 bg-[url(/img/vector-1.svg)] bg-[100%_100%]"
              aria-hidden="true"
            />
            <label htmlFor={emailId} className="sr-only">
              Email address
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ex: johndoe@gmail.com"
              className="absolute top-0 left-0 h-full w-[69.44%] pl-[27.8px] pr-4 [font-family:'Glonimove-Regular',Helvetica] font-normal text-[#636363] text-base tracking-[0] leading-[normal] placeholder:text-[#636363]"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="absolute w-[30.56%] h-[90.00%] top-[10.00%] left-[69.44%]"
              aria-label="Subscribe"
            >
              <img
                className="absolute inset-0 h-full w-full"
                alt=""
                aria-hidden="true"
                src="/img/rectangle-67.svg"
              />
              <span className="absolute w-[14.89%] h-[36.00%] top-[32.00%] left-[22.81%] [font-family:'Google_Sans_Flex',Helvetica] font-medium text-[#d8c79a] text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                SUBSCRIBE
              </span>
            </button>
          </div>
        </form>
        <div
          className="absolute top-[42px] left-[46px] w-[69px] h-[69px] bg-[url(/img/vector-2.svg)] bg-[100%_100%]"
          aria-hidden="true"
        >
          <img
            className="absolute w-[53.33%] h-[88.34%] top-[11.66%] left-[46.67%]"
            alt=""
            src="/img/vector-3.svg"
          />
          <img
            className="absolute w-[53.33%] h-[76.66%] top-[23.34%] left-[46.67%]"
            alt=""
            src="/img/vector-4.svg"
          />
          <img
            className="absolute w-[40.00%] h-[68.33%] top-[31.67%] left-[60.00%]"
            alt=""
            src="/img/vector-5.svg"
          />
          <img
            className="absolute w-[53.33%] h-[68.33%] top-[31.67%] left-[46.67%]"
            alt=""
            src="/img/vector-6.svg"
          />
          <img
            className="absolute w-[53.33%] h-[60.00%] top-[40.00%] left-[46.67%]"
            alt=""
            src="/img/vector-7.svg"
          />
        </div>
      </section>
      <section
        className="absolute top-[266px] left-[1348px] w-[343px] h-[162px]"
        aria-label="Recent blog posts"
      >
        {recentBlogs.map((blog) => (
          <article key={`${blog.date}-${blog.title}`} className="contents">
            <div className={blog.dateClassName}>{blog.date}</div>
            <img
              className={blog.imageClassName}
              alt={blog.title}
              src={blog.image}
            />
            <p className={blog.titleClassName}>{blog.title}</p>
          </article>
        ))}
      </section>
    </footer>
  );
};
