import { FormEvent, useId, useState } from "react";

export const NewsletterSubscriptionSection = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const emailId = useId();

  const iconLayers = [
    {
      alt: "Newsletter icon layer",
      src: "/img/vector-2.svg",
      className: "absolute w-[53.33%] h-[88.34%] top-[11.66%] left-[46.67%]",
    },
    {
      alt: "Newsletter icon layer",
      src: "/img/vector-3.svg",
      className: "absolute w-[53.33%] h-[76.66%] top-[23.34%] left-[46.67%]",
    },
    {
      alt: "Newsletter icon layer",
      src: "/img/vector-4.svg",
      className: "absolute w-[40.00%] h-[68.33%] top-[31.67%] left-[60.00%]",
    },
    {
      alt: "Newsletter icon layer",
      src: "/img/vector-5.svg",
      className: "absolute w-[53.33%] h-[68.33%] top-[31.67%] left-[46.67%]",
    },
    {
      alt: "Newsletter icon layer",
      src: "/img/vector-6.svg",
      className: "absolute w-[53.33%] h-[60.00%] top-[40.00%] left-[46.67%]",
    },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section
      className="absolute w-[61.04%] h-[22.80%] top-0 left-[20.68%]"
      aria-labelledby={`${emailId}-heading`}
    >
      <div className="absolute top-0 left-0 w-[1170px] h-[153px] flex bg-[#274426]" />
      <div className="absolute top-[42px] left-[46px] w-[69px] h-[69px] bg-[url(/img/vector-1.svg)] bg-[100%_100%]">
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
          <div className="absolute w-[99.23%] h-full top-0 left-0 bg-[url(/img/vector.svg)] bg-[100%_100%]" />
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-label="Email address"
            placeholder="ex: johndoe@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="absolute top-0 left-0 h-full w-[69.44%] pl-[27px] pr-4 [font-family:'Glonimove-Regular',Helvetica] font-normal text-[#636363] text-base tracking-[0] leading-[normal] placeholder:text-[#636363]"
          />
          <button
            type="submit"
            className="absolute w-[30.56%] h-[90.00%] top-[10.00%] left-[69.44%]"
            aria-label="Subscribe to newsletter"
          >
            <img
              className="absolute inset-0 w-full h-full"
              alt=""
              src="/img/rectangle-67.svg"
            />
            <span className="absolute w-[48.72%] h-[40.00%] top-[28.89%] left-[24.36%] [font-family:'Google_Sans_Flex',Helvetica] font-medium text-[#d8c79a] text-sm tracking-[0] leading-[normal]">
              SUBSCRIBE
            </span>
          </button>
        </div>
      </form>
    </section>
  );
};
