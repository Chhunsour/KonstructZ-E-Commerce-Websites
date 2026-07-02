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
    imageAlt: "Construction machinery blog preview",
    topClass: "top-0",
    dateTopClass: "top-[9px]",
    titleTopClass: "top-[30px]",
    imageClass: "w-[131px] h-[74px]",
  },
  {
    date: "9th June 2026",
    title: "On The Other Hand, We Denounce With And Dislike",
    image: "/img/chatgpt-image-apr-28-2026-09-26-28-am-2.png",
    imageAlt: "Industrial equipment blog preview",
    topClass: "top-[89px]",
    dateTopClass: "top-[98px]",
    titleTopClass: "top-[119px]",
    imageClass: "w-[130px] h-[73px]",
  },
];

export const FooterSection = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const emailId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <footer
      className="absolute top-[10412px] left-0 w-[1920px] h-[671px]"
      aria-label="Footer"
    >
      <div className="w-[1920px] h-[594px] top-[77px] absolute left-0">
        <div className="absolute top-0 left-0 w-[1920px] h-[539px] flex bg-[url(/img/rectangle-916.svg)] bg-[100%_100%]">
          <img
            className="mt-[30px] w-[1920px] h-[509px]"
            alt=""
            src="/img/mask-group.png"
            aria-hidden="true"
          />
        </div>
        <section
          className="absolute top-[214px] left-[211px] w-[347px] h-[218px] flex flex-col gap-10"
          aria-label="Company information"
        >
          <p className="w-[345px] h-[138px] [font-family:'Glonimove-Regular',Helvetica] text-[21px] leading-[23.3px] font-normal text-white tracking-[0]">
            KonstructZ delivers tough, modern machinery solutions built for
            construction, landscaping, and industrial work. Designed for
            performance, durability, and real job-site productivity.
          </p>
          <img
            className="w-[259.71px] h-10"
            alt="Social media icons"
            src="/img/icon.png"
          />
        </section>
        <nav
          className="absolute w-[7.69%] h-[59.09%] top-[20.37%] left-[33.13%]"
          aria-label="Our Service"
        >
          <h2 className="w-[90.55%] h-[6.84%] top-0 left-0 [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[22px] tracking-[0] absolute leading-[normal]">
            Our Service
          </h2>
          <ul className="absolute w-[109.48%] h-[75.21%] top-[24.79%] left-0 list-none m-0 p-0">
            {services.map((service, index) => {
              const topValues = [
                "top-0",
                "top-[13.60%]",
                "top-[27.21%]",
                "top-[40.81%]",
                "top-[54.41%]",
                "top-[67.42%]",
                "top-[80.30%]",
                "top-[93.18%]",
              ];
              const widthValues = [
                "w-[66.57%]",
                "w-[75.98%]",
                "w-[86.07%]",
                "w-[69.93%]",
                "w-[87.41%]",
                "w-[57.83%]",
                "w-[84.73%]",
                "w-[90.10%]",
              ];

              return (
                <li
                  key={service}
                  className={`${widthValues[index]} h-[6.82%] ${topValues[index]} left-0 text-base tracking-[0] absolute [font-family:'Glonimove-Regular',Helvetica] font-normal text-white leading-[normal]`}
                >
                  <a href="#" className="inline-block w-full h-full">
                    {service}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <nav
          className="absolute w-[6.62%] h-[35.81%] top-[20.20%] left-[51.14%]"
          aria-label="Quick Link"
        >
          <h2 className="absolute w-[94.15%] h-[11.28%] top-0 left-0 [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[22px] tracking-[0] leading-[normal]">
            Quick Link
          </h2>
          <ul className="absolute w-[104.72%] h-[59.10%] top-[40.90%] left-0 list-none m-0 p-0">
            {quickLinks.map((link, index) => {
              const topValues = [
                "top-0",
                "top-[28.56%]",
                "top-[57.13%]",
                "top-[85.68%]",
              ];
              const widthValues = [
                "w-[93.99%]",
                "w-[77.64%]",
                "w-[84.18%]",
                "w-[65.38%]",
              ];

              return (
                <li
                  key={link}
                  className={`absolute ${widthValues[index]} h-[14.32%] ${topValues[index]} left-0 [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]`}
                >
                  <a href="#" className="inline-block w-full h-full">
                    {link}
                  </a>
                </li>
              );
            })}
          </ul>
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
        <div className="absolute top-[266px] left-[1348px] w-[343px] h-[162px]">
          {recentBlogs.map((blog, index) => (
            <article key={`${blog.date}-${index}`}>
              <div
                className={`absolute ${blog.dateTopClass} left-[141px] w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-neutral-100 text-xs tracking-[0] leading-[normal]`}
              >
                <time dateTime={index === 0 ? "2026-06-12" : "2026-06-09"}>
                  {blog.date}
                </time>
              </div>
              <img
                className={`absolute ${blog.topClass} left-0 ${blog.imageClass} aspect-[1.78] object-cover`}
                alt={blog.imageAlt}
                src={blog.image}
              />
              <p
                className={`absolute ${blog.titleTopClass} left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-neutral-100 text-[15px] tracking-[0] leading-[normal]`}
              >
                <a href="#" className="inline-block">
                  {blog.title}
                </a>
              </p>
            </article>
          ))}
        </div>
        <div className="top-[539px] w-[1924px] h-[55px] absolute left-0">
          <img
            className="absolute top-0 left-0 w-[1920px] h-[55px]"
            alt=""
            src="/img/rectangle-917.svg"
            aria-hidden="true"
          />
          <p className="absolute w-[19.33%] h-[20.00%] top-[38.18%] left-[19.44%] [font-family:'Saira',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
            Copyright © 2026 KonstructZ. All Rights Reserved.
          </p>
          <nav
            className="absolute w-[11.64%] h-[45.45%] top-[27.27%] left-[68.74%] [font-family:'Saira',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]"
            aria-label="Legal and contact links"
          >
            <ul className="m-0 p-0 list-none flex items-start gap-[22px] whitespace-nowrap">
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Policy</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </nav>
        </div>
        <button
          type="button"
          className="absolute top-[550px] left-[1568px] w-[42px] h-[34px] rotate-[-0.06deg]"
          aria-label="Change language to English"
        >
          <img
            className="w-10 h-[34px] rotate-[0.06deg] absolute top-0 left-0"
            alt=""
            src="/img/3.svg"
            aria-hidden="true"
          />
          <span className="top-[11px] left-[9px] w-[22px] text-[15px] absolute [font-family:'Clofie-Regular',Helvetica] font-normal text-neutral-100 tracking-[0] leading-[normal] whitespace-nowrap">
            EN
          </span>
        </button>
      </div>
      <img
        className="absolute top-[175px] left-[211px] w-[345px] h-[101px]"
        alt="KonstructZ logo"
        src="/img/vector-7.png"
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
              className="absolute w-[99.23%] h-full top-0 left-0 bg-[url(/img/vector-8.svg)] bg-[100%_100%]"
              aria-hidden="true"
            />
            <label htmlFor={emailId} className="sr-only">
              Email address
            </label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ex: johndoe@gmail.com"
              className="absolute w-[63%] h-[36.00%] top-[32.00%] left-[5.42%] [font-family:'Glonimove-Regular',Helvetica] font-normal text-[#636363] placeholder:text-[#636363] text-base tracking-[0] leading-[normal] whitespace-nowrap"
              autoComplete="email"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="absolute w-[30.56%] h-[90.00%] top-[10.00%] left-[69.44%]"
              aria-label="Subscribe"
            >
              <img
                className="absolute inset-0 w-full h-full"
                alt=""
                src="/img/rectangle-67.svg"
                aria-hidden="true"
              />
              <span className="absolute w-[48.72%] h-[36.00%] top-[32.00%] left-[23.60%] [font-family:'Google_Sans_Flex',Helvetica] font-medium text-[#d8c79a] text-sm tracking-[0] leading-[normal]">
                SUBSCRIBE
              </span>
            </button>
          </div>
        </form>
        <div
          className="absolute top-[42px] left-[46px] w-[69px] h-[69px] bg-[url(/img/vector-10.svg)] bg-[100%_100%]"
          aria-hidden="true"
        >
          <img
            className="absolute w-[53.33%] h-[88.34%] top-[11.66%] left-[46.67%]"
            alt=""
            src="/img/vector-11.svg"
          />
          <img
            className="absolute w-[53.33%] h-[76.66%] top-[23.34%] left-[46.67%]"
            alt=""
            src="/img/vector-12.svg"
          />
          <img
            className="absolute w-[40.00%] h-[68.33%] top-[31.67%] left-[60.00%]"
            alt=""
            src="/img/vector-13.svg"
          />
          <img
            className="absolute w-[53.33%] h-[68.33%] top-[31.67%] left-[46.67%]"
            alt=""
            src="/img/vector-14.svg"
          />
          <img
            className="absolute w-[53.33%] h-[60.00%] top-[40.00%] left-[46.67%]"
            alt=""
            src="/img/vector-15.svg"
          />
        </div>
      </section>
    </footer>
  );
};
