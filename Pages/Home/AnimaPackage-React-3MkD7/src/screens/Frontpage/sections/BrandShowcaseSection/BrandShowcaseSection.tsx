type ShowcaseCard = {
  id: string;
  containerClassName: string;
  innerClassName?: string;
  backgroundClassName?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  overlaySrc: string;
  overlayClassName: string;
  title: string;
  titleClassName: string;
  description: string;
  descriptionClassName: string;
  buttonWrapperClassName?: string;
  buttonBorderClassName: string;
  buttonTextClassName: string;
  buttonIconClassName: string;
  vectorSrc: string;
  customContent?: boolean;
};

const _showcaseCards: ShowcaseCard[] = [
  {
    id: "quality-equipment",
    containerClassName:
      "absolute top-[148px] left-[325px] w-[620px] h-[619px] flex overflow-hidden",
    innerClassName: "w-[626px] h-[1054px] relative",
    imageSrc:
      "/img/super-red-betta-fish-siamese-fighting-fish-isolated-white-backgr.png",
    imageAlt:
      "Super red betta fish siamese fighting fish isolated on white background",
    imageClassName: "absolute top-0 left-0 w-[620px] h-[619px] object-cover",
    overlaySrc: "/img/rectangle-34625639.svg",
    overlayClassName: "absolute top-[121px] left-0 w-[620px] h-[498px]",
    title: "Quality Equipment",
    titleClassName:
      "absolute top-[382px] left-[123px] w-[375px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[42px] tracking-[0] leading-[normal]",
    description:
      "Carefully selected machinery built for durability, performance, and tough working conditions.",
    descriptionClassName:
      "absolute top-[440px] left-[101px] w-[419px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] text-center tracking-[-0.42px] leading-[normal]",
    buttonBorderClassName:
      "absolute top-[520px] left-[209px] w-[203px] h-[49px] border-2 border-solid border-white",
    buttonTextClassName:
      "absolute top-[532px] left-[248px] [font-family:'Google_Sans_Flex',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[normal]",
    buttonIconClassName:
      "absolute w-[41.49%] h-[48.93%] top-[51.07%] left-[58.51%]",
    vectorSrc: "/img/vector-6.svg",
    customContent: true,
  },
  {
    id: "trusted-support",
    containerClassName:
      "absolute top-[148px] left-[975px] w-[620px] h-[619px] bg-[#bababa] bg-[url(/img/engineer-provides-technical-support-via-headset-solar-panel-fact.png)] bg-cover bg-[50%_50%]",
    overlaySrc: "/img/rectangle-34625639-1.svg",
    overlayClassName: "top-[122px] left-0 h-[497px] absolute w-[620px]",
    title: "Trusted Support",
    titleClassName:
      "absolute top-[382px] left-[148px] w-[325px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[42px] tracking-[0] leading-[normal]",
    description:
      "Get clear guidance before and after purchase, so you choose the right machine for your job.",
    descriptionClassName:
      "absolute top-[440px] left-[101px] w-[419px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] text-center tracking-[-0.42px] leading-[normal]",
    buttonWrapperClassName:
      "absolute top-[520px] left-[209px] w-[205px] h-[49px]",
    buttonBorderClassName:
      "top-0 left-0 absolute w-[203px] h-[49px] border-2 border-solid border-white",
    buttonTextClassName:
      "top-3 left-[39px] absolute [font-family:'Google_Sans_Flex',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[normal]",
    buttonIconClassName:
      "absolute w-[23.27%] h-[62.67%] top-[37.33%] left-[76.73%]",
    vectorSrc: "/img/vector-6.svg",
  },
  {
    id: "job-site-ready",
    containerClassName:
      "absolute top-[797px] left-[325px] w-[620px] h-[619px] flex bg-[#bababa]",
    title: "Job-Site Ready",
    titleClassName:
      "absolute top-0 left-[84px] w-[301px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[42px] tracking-[0] leading-[normal]",
    description:
      "Practical machines designed for construction, landscaping, material handling, and daily worksite use.",
    descriptionClassName:
      "absolute top-[58px] left-0 w-[468px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] text-center tracking-[-0.42px] leading-[normal]",
    buttonBorderClassName:
      "top-[520px] left-[322px] absolute w-[203px] h-[49px] border-2 border-solid border-white",
    buttonTextClassName:
      "top-[532px] left-[361px] absolute [font-family:'Google_Sans_Flex',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[normal]",
    buttonIconClassName:
      "absolute w-[49.01%] h-[47.59%] top-[52.41%] left-[50.99%]",
    vectorSrc: "/img/vector-6.svg",
    overlaySrc: "/img/rectangle-34625639-2.svg",
    overlayClassName: "top-[134px] left-[113px] h-[485px] absolute w-[620px]",
    customContent: true,
  },
  {
    id: "long-term-value",
    containerClassName:
      "absolute top-[797px] left-[975px] w-[620px] h-[619px] flex overflow-hidden",
    title: "Long-Term Value",
    titleClassName:
      "absolute top-96 left-[246px] w-[349px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[42px] tracking-[0] leading-[normal]",
    description:
      "Equipment solutions focused on productivity, reliability, and better return on investment.",
    descriptionClassName:
      "top-[442px] left-[211px] w-[419px] text-[21px] text-center tracking-[-0.42px] absolute [font-family:'Glonimove-Regular',Helvetica] font-normal text-white leading-[normal]",
    buttonBorderClassName:
      "top-[520px] left-[327px] absolute w-[203px] h-[49px] border-2 border-solid border-white",
    buttonTextClassName:
      "top-[532px] left-[366px] absolute [font-family:'Google_Sans_Flex',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[normal]",
    buttonIconClassName:
      "absolute w-[37.83%] h-[37.12%] top-[62.88%] left-[62.17%]",
    vectorSrc: "/img/vector-6.svg",
    overlaySrc: "/img/rectangle-34625639-3.svg",
    overlayClassName: "top-[120px] left-[118px] h-[499px] absolute w-[620px]",
    customContent: true,
  },
];

const DecorativeMagnets = () => (
  <>
    <img
      className="absolute top-[383px] left-0 w-[547px] h-[832px]"
      alt=""
      src="/img/magnet.svg"
      aria-hidden="true"
    />
    <img
      className="absolute top-[43px] left-[1679px] w-[241px] h-[367px]"
      alt=""
      src="/img/magnet-1.svg"
      aria-hidden="true"
    />
    <img
      className="absolute top-[1200px] left-[1760px] w-40 h-[294px]"
      alt=""
      src="/img/magnet-2.svg"
      aria-hidden="true"
    />
  </>
);

const LearnMoreButton = ({
  ariaLabel,
  wrapperClassName,
  borderClassName,
  textClassName,
  iconClassName,
  vectorSrc,
}: {
  ariaLabel: string;
  wrapperClassName?: string;
  borderClassName: string;
  textClassName: string;
  iconClassName: string;
  vectorSrc: string;
}) => {
  const content = (
    <>
      <div className={borderClassName} />
      <span className={textClassName}>Learn More</span>
      <img
        className={iconClassName}
        alt=""
        src={vectorSrc}
        aria-hidden="true"
      />
    </>
  );

  if (wrapperClassName) {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        className={`${wrapperClassName} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
      >
        {content}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="absolute inset-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      {content}
    </button>
  );
};

export const BrandShowcaseSection = (): JSX.Element => {
  return (
    <section
      className="top-[3846px] left-0 h-[1564px] bg-[#282828] absolute w-[1920px]"
      aria-label="Brand showcase"
    >
      <DecorativeMagnets />
      <div className="absolute top-[148px] left-[325px] w-[620px] h-[619px] flex overflow-hidden">
        <article className="w-[626px] h-[1054px] relative">
          <img
            className="absolute top-0 left-0 w-[620px] h-[619px]"
            alt=""
            src="/img/rectangle-34625626.svg"
            aria-hidden="true"
          />
          <img
            className="absolute top-0 left-0 w-[620px] h-[619px] object-cover"
            alt="Super red betta fish siamese fighting fish isolated on white background"
            src="/img/super-red-betta-fish-siamese-fighting-fish-isolated-white-backgr.png"
          />
          <img
            className="absolute top-[121px] left-0 w-[620px] h-[498px]"
            alt=""
            src="/img/rectangle-34625639.svg"
            aria-hidden="true"
          />
          <div className="absolute top-[382px] left-[123px] w-[375px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[42px] tracking-[0] leading-[normal]">
            Quality Equipment
          </div>
          <p className="absolute top-[440px] left-[101px] w-[419px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] text-center tracking-[-0.42px] leading-[normal]">
            Carefully selected machinery built for durability, performance, and
            tough working conditions.
          </p>
          <LearnMoreButton
            ariaLabel="Learn more about Quality Equipment"
            borderClassName="absolute top-[520px] left-[209px] w-[203px] h-[49px] border-2 border-solid border-white"
            textClassName="absolute top-[532px] left-[248px] [font-family:'Google_Sans_Flex',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[normal]"
            iconClassName="absolute w-[41.49%] h-[48.93%] top-[51.07%] left-[58.51%]"
            vectorSrc="/img/vector-6.svg"
          />
        </article>
      </div>
      <article className="absolute top-[148px] left-[975px] w-[620px] h-[619px] bg-[#bababa] bg-[url(/img/engineer-provides-technical-support-via-headset-solar-panel-fact.png)] bg-cover bg-[50%_50%]">
        <img
          className="top-[122px] left-0 h-[497px] absolute w-[620px]"
          alt=""
          src="/img/rectangle-34625639-1.svg"
          aria-hidden="true"
        />
        <div className="absolute top-[382px] left-[148px] w-[325px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[42px] tracking-[0] leading-[normal]">
          Trusted Support
        </div>
        <p className="absolute top-[440px] left-[101px] w-[419px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] text-center tracking-[-0.42px] leading-[normal]">
          Get clear guidance before and after purchase, so you choose the right
          machine for your job.
        </p>
        <LearnMoreButton
          ariaLabel="Learn more about Trusted Support"
          wrapperClassName="absolute top-[520px] left-[209px] w-[205px] h-[49px]"
          borderClassName="top-0 left-0 absolute w-[203px] h-[49px] border-2 border-solid border-white"
          textClassName="top-3 left-[39px] absolute [font-family:'Google_Sans_Flex',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[normal]"
          iconClassName="absolute w-[23.27%] h-[62.67%] top-[37.33%] left-[76.73%]"
          vectorSrc="/img/vector-6.svg"
        />
      </article>
      <article className="absolute top-[797px] left-[325px] w-[620px] h-[619px] flex bg-[#bababa]">
        <div className="mt-96 w-[468px] h-[185px] ml-[76px] relative">
          <div className="absolute -top-96 left-[-189px] w-[940px] h-[1027px]">
            <img
              className="absolute top-0 left-[113px] w-[620px] h-[619px] aspect-[1.5] object-cover"
              alt="Site engineer at a construction site"
              src="/img/site-engineer-construction-site-1.png"
            />
            <img
              className="top-[134px] left-[113px] h-[485px] absolute w-[620px]"
              alt=""
              src="/img/rectangle-34625639-2.svg"
              aria-hidden="true"
            />
            <LearnMoreButton
              ariaLabel="Learn more about Job-Site Ready"
              borderClassName="top-[520px] left-[322px] absolute w-[203px] h-[49px] border-2 border-solid border-white"
              textClassName="top-[532px] left-[361px] absolute [font-family:'Google_Sans_Flex',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[normal]"
              iconClassName="absolute w-[49.01%] h-[47.59%] top-[52.41%] left-[50.99%]"
              vectorSrc="/img/vector-6.svg"
            />
          </div>
          <div className="absolute top-0 left-[84px] w-[301px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[42px] tracking-[0] leading-[normal]">
            Job-Site Ready
          </div>
          <p className="absolute top-[58px] left-0 w-[468px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] text-center tracking-[-0.42px] leading-[normal]">
            Practical machines designed for construction, landscaping, material
            handling, and daily worksite use.
          </p>
        </div>
      </article>
      <article className="absolute top-[797px] left-[975px] w-[620px] h-[619px] flex overflow-hidden">
        <div className="w-[779px] h-[856px] ml-[-118px] relative">
          <div className="absolute top-0 left-[118px] w-[620px] h-[619px] bg-[#bababa]" />
          <img
            className="absolute top-0 left-[118px] w-[620px] h-[619px] aspect-[1.25] object-cover"
            alt="Businessman holding growth arrow"
            src="/img/businessman-holding-growth-arrow-1.png"
          />
          <img
            className="top-[120px] left-[118px] h-[499px] absolute w-[620px]"
            alt=""
            src="/img/rectangle-34625639-3.svg"
            aria-hidden="true"
          />
          <div className="absolute top-96 left-[246px] w-[349px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[42px] tracking-[0] leading-[normal]">
            Long-Term Value
          </div>
          <p className="top-[442px] left-[211px] w-[419px] text-[21px] text-center tracking-[-0.42px] absolute [font-family:'Glonimove-Regular',Helvetica] font-normal text-white leading-[normal]">
            Equipment solutions focused on productivity, reliability, and better
            return on investment.
          </p>
          <LearnMoreButton
            ariaLabel="Learn more about Long-Term Value"
            borderClassName="top-[520px] left-[327px] absolute w-[203px] h-[49px] border-2 border-solid border-white"
            textClassName="top-[532px] left-[366px] absolute [font-family:'Google_Sans_Flex',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[normal]"
            iconClassName="absolute w-[37.83%] h-[37.12%] top-[62.88%] left-[62.17%]"
            vectorSrc="/img/vector-6.svg"
          />
        </div>
      </article>
    </section>
  );
};
