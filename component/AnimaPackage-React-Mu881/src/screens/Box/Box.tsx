type ProductCard = {
  id: string;
  top: number;
  left: number;
  weight: string;
  title: string;
  category: string;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  titleClassName?: string;
  categoryClassName?: string;
  weightClassName?: string;
};

const productCards: ProductCard[] = [
  {
    id: "stomp-v980",
    top: 0,
    left: 0,
    weight: "2.1T",
    title: "STOMP V980",
    category: "Skid Steer",
    imageSrc: "/img/stomp-v980-4.webp",
    imageAlt: "Stomp V980 skid steer",
    imageClassName:
      "absolute top-[102px] left-5 w-[247px] h-[202px] aspect-[1.23]",
    titleClassName:
      "absolute top-[323px] left-2.5 w-[139px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-2xl tracking-[0] leading-[normal] whitespace-nowrap",
    categoryClassName:
      "absolute top-[330px] left-[215px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]",
    weightClassName:
      "absolute top-[37px] left-5 [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "kuvuo-25",
    top: 0,
    left: 327,
    weight: "2.5T",
    title: "KUVUO 2.5",
    category: "Mini Excavator",
    imageSrc: "/img/new-project-19-2.webp",
    imageAlt: "Kuvuo 2.5 mini excavator",
    imageClassName:
      "absolute top-[62px] left-[30px] w-[233px] h-[233px] aspect-[1] object-cover",
    titleClassName:
      "absolute top-[323px] left-2.5 w-[139px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-2xl tracking-[0] leading-[normal] whitespace-nowrap",
    categoryClassName:
      "absolute top-[332px] left-[184px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]",
    weightClassName:
      "absolute top-[37px] left-[19px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "skoop-ii",
    top: 0,
    left: 654,
    weight: "2.4T",
    title: "SKOOP II",
    category: "Wheel Loader",
    imageSrc: "/img/new-project-18-1.webp",
    imageAlt: "Skoop II wheel loader",
    imageClassName:
      "absolute top-[76px] left-px w-[289px] h-[237px] aspect-[1.23]",
    titleClassName:
      "absolute top-[323px] left-2.5 w-[139px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-2xl tracking-[0] leading-[normal] whitespace-nowrap",
    categoryClassName:
      "absolute top-[332px] left-[187px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]",
    weightClassName:
      "top-9 left-[18px] absolute [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "scoopydig",
    top: 0,
    left: 981,
    weight: "2.7T",
    title: "SCOOPYDIG",
    category: "Backhoe Loader",
    imageAlt: "Scoopydig backhoe loader",
    titleClassName:
      "absolute top-[323px] left-2.5 w-[194px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-2xl tracking-[0] leading-[normal] whitespace-nowrap",
    categoryClassName:
      "absolute top-[332px] left-[172px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]",
    weightClassName:
      "top-9 absolute left-[19px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "thunderdump-1",
    top: 517,
    left: 0,
    weight: "2.4T",
    title: "THUNDERDUMP",
    category: "DUMPER",
    imageSrc: "/img/new-project-26-1.webp",
    imageAlt: "Thunderdump dumper",
    imageClassName:
      "absolute top-[54px] left-[41px] w-[211px] h-[281px] aspect-[0.75] object-cover",
    titleClassName:
      "w-[191px] absolute top-[323px] left-2.5 [font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-2xl tracking-[0] leading-[normal] whitespace-nowrap",
    categoryClassName:
      "left-56 absolute top-[332px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]",
    weightClassName:
      "absolute top-[37px] left-[18px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "stone-krusher-1",
    top: 517,
    left: 327,
    weight: "2.4T",
    title: "STONE KRUSHER",
    category: "Stone Crasher",
    imageSrc: "/img/new-project-16-2.webp",
    imageAlt: "Stone Krusher stone crasher",
    imageClassName:
      "absolute top-[75px] left-[34px] w-[225px] h-[225px] aspect-[1] object-cover",
    titleClassName:
      "top-[327px] left-2.5 w-[175px] text-[#153d28] text-[21px] whitespace-nowrap absolute [font-family:'Cal_Sans',Helvetica] font-normal tracking-[0] leading-[normal]",
    categoryClassName:
      "top-[332px] left-[189px] text-black text-[15px] absolute [font-family:'Cal_Sans',Helvetica] font-normal tracking-[0] leading-[normal]",
    weightClassName:
      "top-9 left-[18px] absolute [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "group-ripper-grx",
    top: 517,
    left: 654,
    weight: "2.4T",
    title: "GROUP RIPPER GRX",
    category: "Trencher",
    imageSrc: "/img/new-project-15-2.webp",
    imageAlt: "Group Ripper GRX trencher",
    imageClassName:
      "absolute top-[52px] left-[9px] w-[271px] h-[271px] aspect-[1] object-cover",
    titleClassName:
      "absolute top-[327px] left-2.5 w-[205px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-[21px] tracking-[0] leading-[normal] whitespace-nowrap",
    categoryClassName:
      "absolute top-[333px] left-[223px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]",
    weightClassName:
      "top-9 left-[18px] absolute [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "kuvuo-27",
    top: 517,
    left: 981,
    weight: "2.4T",
    title: "KUVUO 2.7",
    category: "Mini Excavator",
    imageSrc: "/img/new-project-25-1.webp",
    imageAlt: "Kuvuo 2.7 mini excavator",
    imageClassName:
      "absolute top-[62px] left-[50px] w-[194px] h-[258px] aspect-[0.75] object-cover",
    titleClassName:
      "absolute top-[323px] left-2.5 w-[139px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-2xl tracking-[0] leading-[normal] whitespace-nowrap",
    categoryClassName:
      "absolute top-[332px] left-[184px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]",
    weightClassName:
      "top-[35px] left-[22px] absolute [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "spider-one",
    top: 1034,
    left: 0,
    weight: "2.4T",
    title: "SPIDER ONE",
    category: "Towable Excavator",
    imageSrc: "/img/new-project-17-2.webp",
    imageAlt: "Spider One towable excavator",
    imageClassName:
      "absolute top-[101px] left-2 w-[272px] h-[194px] aspect-[1.4]",
    titleClassName:
      "absolute top-[323px] left-2.5 w-[139px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-2xl tracking-[0] leading-[normal] whitespace-nowrap",
    categoryClassName:
      "absolute top-[332px] left-[155px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]",
    weightClassName:
      "absolute top-[37px] left-[18px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "stone-krusher-2",
    top: 1034,
    left: 327,
    weight: "2.7T",
    title: "STONE KRUSHER",
    category: "Stone Crasher",
    imageSrc: "/img/new-project-22-1.webp",
    imageAlt: "Stone Krusher stone crasher",
    imageClassName:
      "absolute top-[122px] left-2 w-[277px] h-[180px] aspect-[1.54]",
    titleClassName:
      "top-[327px] left-2.5 w-44 text-[#153d28] text-[21px] whitespace-nowrap absolute [font-family:'Cal_Sans',Helvetica] font-normal tracking-[0] leading-[normal]",
    categoryClassName:
      "top-[333px] left-[188px] text-black text-[15px] absolute [font-family:'Cal_Sans',Helvetica] font-normal tracking-[0] leading-[normal]",
    weightClassName:
      "absolute top-[37px] left-[19px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "thunderdump-2",
    top: 1034,
    left: 654,
    weight: "2.4T",
    title: "THUNDERDUMP",
    category: "Dumper",
    imageSrc: "/img/new-project-21-1.webp",
    imageAlt: "Thunderdump dumper",
    imageClassName:
      "absolute top-[90px] left-[15px] w-[258px] h-[207px] aspect-[1.25]",
    titleClassName:
      "w-[171px] absolute top-[323px] left-2.5 [font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-2xl tracking-[0] leading-[normal] whitespace-nowrap",
    categoryClassName:
      "left-[227px] absolute top-[332px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]",
    weightClassName:
      "absolute top-[37px] left-[18px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "stomp-v950",
    top: 1034,
    left: 981,
    weight: "2.7T",
    title: "STOMP V950",
    category: "Skid Steer",
    imageSrc: "/img/new-project-24-2.webp",
    imageAlt: "Stomp V950 skid steer",
    imageClassName:
      "absolute top-[94px] left-[-3px] w-[260px] h-[194px] aspect-[1.33] object-cover",
    titleClassName:
      "absolute top-[323px] left-2.5 w-[139px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-2xl tracking-[0] leading-[normal] whitespace-nowrap",
    categoryClassName:
      "absolute top-[330px] left-[215px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]",
    weightClassName:
      "top-[37px] absolute left-[19px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
  {
    id: "stone-krusher-3",
    top: 1551,
    left: 981,
    weight: "2.7T",
    title: "STONE KRUSHER",
    category: "Stone Crasher",
    imageSrc: "/img/screenshot-2026-06-22-at-11-24-05-1.webp",
    imageAlt: "Stone Krusher stone crasher screenshot",
    imageClassName:
      "absolute top-[111px] left-0 w-[269px] h-[166px] aspect-[1.62] object-cover",
    titleClassName:
      "top-[326px] left-2.5 w-[168px] text-[#153d28] text-[21px] whitespace-nowrap absolute [font-family:'Cal_Sans',Helvetica] font-normal tracking-[0] leading-[normal]",
    categoryClassName:
      "top-[332px] left-[189px] text-black text-[15px] absolute [font-family:'Cal_Sans',Helvetica] font-normal tracking-[0] leading-[normal]",
    weightClassName:
      "top-[37px] absolute left-[19px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap",
  },
];

const CardActions = ({ title }: { title: string }) => {
  return (
    <>
      <button
        type="button"
        aria-label={`Request quote for ${title}`}
        className="absolute top-[432px] left-2 w-[111px] h-[33px] border-2 border-solid border-[#153d28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153d28]"
      >
        <span className="absolute top-[439px] left-[37px] w-[58px] h-[19px] pointer-events-none">
          <span className="absolute top-0 left-0 [font-family:'Google_Sans_Flex',Helvetica] font-normal text-[#153d28] text-[15px] tracking-[0] leading-[normal]">
            Quote
          </span>
          <img
            className="w-[13.29%] left-[86.71%] absolute h-[77.41%] top-[22.59%]"
            alt=""
            src="/img/vector-24.svg"
            aria-hidden="true"
          />
        </span>
      </button>
      <button
        type="button"
        aria-label={`View details for ${title}`}
        className="absolute top-[432px] left-[130px] w-[150px] h-[33px] bg-[#153d28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153d28]"
      >
        <span className="absolute top-[439px] left-[149px] w-[115px] h-[19px] pointer-events-none">
          <span className="absolute top-0 left-0 [font-family:'Google_Sans_Flex',Helvetica] font-normal text-[#d9d9d9] text-[15px] tracking-[0] leading-[normal]">
            VIEW DETIALS
          </span>
          <img
            className="w-[6.70%] left-[93.30%] absolute h-[77.41%] top-[22.59%]"
            alt=""
            src="/img/vector-25.svg"
            aria-hidden="true"
          />
        </span>
      </button>
    </>
  );
};

const ProductEquipmentCard = ({
  weight,
  title,
  category,
  imageSrc,
  imageAlt,
  imageClassName,
  titleClassName,
  categoryClassName,
  weightClassName,
  top,
  left,
}: ProductCard) => {
  return (
    <article
      className="absolute w-[293px] h-[482px] bg-[#d9d9d9]"
      style={{ top, left }}
    >
      <img
        className="absolute top-[9px] left-2.5 w-[41px] h-[49px] aspect-[0.83]"
        alt="Kilogram kg and pound lbs weight symbol icon"
        src="/img/kilogram-kg-and-pound-lbs-weight-symbol-icon-dumbbell-vector-ill-12.png"
      />
      <div className={weightClassName}>{weight}</div>
      {imageSrc ? (
        <img
          className={imageClassName}
          alt={imageAlt || title}
          src={imageSrc}
        />
      ) : null}

      <h2 className={titleClassName}>{title}</h2>
      <p className={categoryClassName}>{category}</p>
      <div className="top-[365px] absolute left-2.5 [font-family:'Glonimove-Regular',Helvetica] font-normal text-[#646464] text-lg tracking-[0] leading-[normal] whitespace-nowrap">
        SPEC
      </div>
      <div className="top-[390px] absolute left-2.5 [font-family:'Glonimove-Regular',Helvetica] font-normal text-[#646464] text-lg tracking-[0] leading-[normal] whitespace-nowrap">
        SPEC
      </div>
      <div className="top-[365px] absolute left-[225px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#656565] text-lg tracking-[0] leading-[normal]">
        N/A
      </div>
      <div className="top-[388px] absolute left-[225px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#656565] text-lg tracking-[0] leading-[normal]">
        N/A
      </div>
      <div className="absolute top-[355px] left-2.5 w-[272px] h-0.5 bg-[#153d28]" />
      <div className="absolute top-[418px] left-2 w-[272px] h-0.5 bg-[#153d28]" />
      <CardActions title={title} />
    </article>
  );
};

export const Box = (): JSX.Element => {
  return (
    <section
      className="relative w-[1274px] h-[2033px]"
      data-model-id="2420:2174-frame"
      aria-label="Equipment product cards"
    >
      <div className="fixed top-[40805px] left-[17865px] w-[1274px] h-[2033px]">
        {productCards.map((card) => (
          <ProductEquipmentCard key={card.id} {...card} />
        ))}

        <img
          className="absolute top-[105px] left-[985px] w-[283px] h-[167px] aspect-[1.69]"
          alt="Scoopydig backhoe loader"
          src="/img/new-project-23-3.webp"
        />
      </div>
    </section>
  );
};
