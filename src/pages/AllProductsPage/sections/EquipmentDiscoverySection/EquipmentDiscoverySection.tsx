import { useI18n } from "../../../../context/I18nContext";







const PaginationBox = ({
  left,
  active = false,
}: {
  left: number;
  active?: boolean;
}) => (
  <div
    className={`absolute top-0 w-[57px] h-[57px] ${active ? "bg-[#153d28]" : "bg-[#d9d9d9]"}`}
    style={{ left: `${left}px` }}
  />
);

const FilterCheckbox = ({
  id,
  label,
  top,
  left = 1.5,
  labelLeft = 42,
  className,
}: {
  id: string;
  label: string;
  top: number;
  left?: number;
  labelLeft?: number;
  className?: string;
}) => (
  <>
    <input
      id={id}
      type="checkbox"
      className={`absolute w-[27px] h-[27px] border-[3px] border-solid border-[#153d28] ${className ?? ""}`}
      style={{ top: `${top - 2}px`, left: `${left}px` }}
      aria-label={label}
    />
    <label
      htmlFor={id}
      className="absolute [font-family:'Glonimove-Regular',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal] whitespace-nowrap cursor-pointer"
      style={{ top: `${top}px`, left: `${labelLeft}px` }}
    >
      {label}
    </label>
  </>
);

const EquipmentCard = ({
  top,
  left,
  imageSrc,
  imageAlt,
  imageClassName,
  combinedActions = false,
}: {
  top: number;
  left: number;
  imageSrc: string;
  imageAlt: string;
  imageClassName: string;
  combinedActions?: boolean;
}) => {
  const { t } = useI18n();
  return (
    <article
      className="absolute w-[293px] h-[482px] bg-[#d9d9d9]"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      <img
        className="absolute top-[9px] left-2.5 w-[41px] h-[49px] aspect-[0.83]"
        alt={t("auto.equipmentdiscovery.2.ton.weight")}
        src="/all-products/img/kilogram-kg-and-pound-lbs-weight-symbol-icon-dumbbell-vector-ill-19.png"
      />
      <div className="absolute top-[35px] left-[22px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
        2T
      </div>
      <img className={imageClassName} alt={imageAlt} src={imageSrc} />
      <h3 className="absolute top-[323px] left-2.5 w-[139px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-2xl tracking-[0] leading-[normal] whitespace-nowrap">{t("auto.equipmentdiscovery.stomp.v980")}</h3>
      <p className="absolute top-[330px] left-[215px] [font-family:'Cal_Sans',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal]">{t("auto.equipmentdiscovery.skid.steer")}</p>
      <div className="absolute top-[365px] left-2.5 [font-family:'Glonimove-Regular',Helvetica] font-normal text-[#646464] text-lg tracking-[0] leading-[normal] whitespace-nowrap">
        SPEC
      </div>
      <div className="absolute top-[390px] left-2.5 [font-family:'Glonimove-Regular',Helvetica] font-normal text-[#646464] text-lg tracking-[0] leading-[normal] whitespace-nowrap">
        SPEC
      </div>
      <div className="absolute top-[365px] left-[225px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#656565] text-lg tracking-[0] leading-[normal]">
        N/A
      </div>
      <div className="absolute top-[388px] left-[225px] [font-family:'Cal_Sans',Helvetica] font-normal text-[#656565] text-lg tracking-[0] leading-[normal]">
        N/A
      </div>
      <div className="absolute top-[355px] left-2.5 w-[272px] h-0.5 bg-[#153d28]" />
      <div className="absolute top-[418px] left-2 w-[272px] h-0.5 bg-[#153d28]" />
      {combinedActions ? (
        <>
          <button
            type="button"
            className="absolute top-[432px] left-2 w-[111px] h-[33px] border-2 border-solid border-[#153d28]"
            aria-label={t("auto.equipmentdiscovery.request.quote.for")}
          />
          <button
            type="button"
            className="absolute top-[432px] left-[130px] w-[150px] h-[33px] bg-[#153d28]"
            aria-label={t("auto.equipmentdiscovery.view.details.for")}
          />
          <div className="absolute top-[439px] left-[37px] w-[223px] h-[19px] pointer-events-none">
            <div className="absolute top-0 left-0 [font-family:'Google_Sans_Flex',Helvetica] font-normal text-[#153d28] text-[15px] tracking-[0] leading-[normal]">{t("auto.equipmentdiscovery.quote")}</div>
            <img
              className="absolute w-[77.45%] h-[77.41%] top-[22.59%] left-[22.55%]"
              alt=""
              aria-hidden="true"
              src="/all-products/img/vector-38.svg"
            />
            <div className="absolute top-0 left-[119px] [font-family:'Google_Sans_Flex',Helvetica] font-normal text-[#d9d9d9] text-[15px] tracking-[0] leading-[normal]">{t("auto.equipmentdiscovery.view.detials")}</div>
          </div>
          <div className="absolute w-0 h-[2.07%] top-[92.12%] left-[87.71%] flex pointer-events-none">
            <img
              className="flex-1 w-[6.71px]"
              alt=""
              aria-hidden="true"
              src="/all-products/img/vector-39.svg"
            />
          </div>
        </>
      ) : (
        <>
          <button
            type="button"
            className="absolute top-[432px] left-2 w-[111px] h-[33px] border-2 border-solid border-[#153d28]"
            aria-label={t("auto.equipmentdiscovery.request.quote.for")}
          />
          <button
            type="button"
            className="absolute top-[432px] left-[130px] w-[150px] h-[33px] bg-[#153d28]"
            aria-label={t("auto.equipmentdiscovery.view.details.for")}
          />
          <div className="absolute top-[439px] left-[37px] w-[58px] h-[19px] pointer-events-none">
            <div className="absolute top-0 left-0 [font-family:'Google_Sans_Flex',Helvetica] font-normal text-[#153d28] text-[15px] tracking-[0] leading-[normal]">{t("auto.equipmentdiscovery.quote")}</div>
            <img
              className="absolute w-[13.29%] h-[77.41%] top-[22.59%] left-[86.71%]"
              alt=""
              aria-hidden="true"
              src="/all-products/img/vector-38.svg"
            />
          </div>
          <div className="absolute top-[439px] left-[149px] w-[115px] h-[19px] pointer-events-none">
            <div className="absolute top-0 left-0 [font-family:'Google_Sans_Flex',Helvetica] font-normal text-[#d9d9d9] text-[15px] tracking-[0] leading-[normal]">{t("auto.equipmentdiscovery.view.detials")}</div>
            <img
              className="absolute w-[6.70%] h-[77.41%] top-[22.59%] left-[93.30%]"
              alt=""
              aria-hidden="true"
              src="/all-products/img/vector-39.svg"
            />
          </div>
        </>
      )}
    </article>
  );
};

export const EquipmentDiscoverySection = (): JSX.Element => {
  const { t } = useI18n();
  const productCards = [
    {
      top: 319,
      left: 538,
      imageSrc: "/all-products/img/new-project-18-1-3.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "top-[37px] left-px w-[291px] h-[291px] absolute aspect-[1] object-cover",
      combinedActions: true,
    },
    {
      top: 836,
      left: 538,
      imageSrc: "/all-products/img/new-project-15-2-4.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[52px] left-[9px] w-[271px] h-[271px] aspect-[1] object-cover",
    },
    {
      top: 1353,
      left: 538,
      imageSrc: "/all-products/img/new-project-21-1-1.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[83px] left-[15px] w-[258px] h-[258px] aspect-[1] object-cover",
    },
    {
      top: 1870,
      left: 543,
      imageSrc: "/all-products/img/new-project-18-1-3.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "top-[37px] left-px w-[291px] h-[291px] absolute aspect-[1] object-cover",
    },
    {
      top: 2387,
      left: 543,
      imageSrc: "/all-products/img/new-project-15-2-4.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[52px] left-[9px] w-[271px] h-[271px] aspect-[1] object-cover",
    },
  ];

  const gridOneCards = [
    {
      top: 0,
      left: 0,
      imageSrc: "/all-products/img/stomp-v980-4-2.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[102px] left-5 w-[247px] h-[202px] aspect-[1.23]",
    },
    {
      top: 0,
      left: 327,
      imageSrc: "/all-products/img/new-project-19-2-1.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[62px] left-[30px] w-[233px] h-[233px] aspect-[1] object-cover",
    },
    {
      top: 0,
      left: 654,
      imageSrc: "/all-products/img/new-project-18-1-3.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "top-[37px] left-px w-[291px] h-[291px] absolute aspect-[1] object-cover",
    },
    {
      top: 517,
      left: 0,
      imageSrc: "/all-products/img/new-project-23-2-1.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "top-[39px] left-0 w-[293px] h-[314px] absolute aspect-[0.93] object-cover",
    },
    {
      top: 517,
      left: 327,
      imageSrc: "/all-products/img/new-project-16-2-2.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[75px] left-[34px] w-[225px] h-[225px] aspect-[1] object-cover",
    },
    {
      top: 517,
      left: 654,
      imageSrc: "/all-products/img/new-project-15-2-4.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[52px] left-[9px] w-[271px] h-[271px] aspect-[1] object-cover",
    },
    {
      top: 1034,
      left: 0,
      imageSrc: "/all-products/img/new-project-17-2-1.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[63px] left-2 w-[272px] h-[272px] aspect-[1] object-cover",
    },
    {
      top: 1034,
      left: 327,
      imageSrc: "/all-products/img/new-project-22-1-1.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[68px] left-2 w-[277px] h-[277px] aspect-[1] object-cover",
    },
    {
      top: 1034,
      left: 654,
      imageSrc: "/all-products/img/new-project-21-1-1.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[83px] left-[15px] w-[258px] h-[258px] aspect-[1] object-cover",
    },
  ];

  const gridTwoCards = [
    {
      top: 0,
      left: 0,
      imageSrc: "/all-products/img/stomp-v980-4-2.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[102px] left-5 w-[247px] h-[202px] aspect-[1.23]",
    },
    {
      top: 0,
      left: 327,
      imageSrc: "/all-products/img/new-project-19-2-1.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[62px] left-[30px] w-[233px] h-[233px] aspect-[1] object-cover",
    },
    {
      top: 0,
      left: 654,
      imageSrc: "/all-products/img/new-project-18-1-3.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "top-[37px] left-px w-[291px] h-[291px] absolute aspect-[1] object-cover",
    },
    {
      top: 517,
      left: 0,
      imageSrc: "/all-products/img/new-project-23-2-1.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "top-[39px] left-0 w-[293px] h-[314px] absolute aspect-[0.93] object-cover",
    },
    {
      top: 517,
      left: 327,
      imageSrc: "/all-products/img/new-project-16-2-2.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[75px] left-[34px] w-[225px] h-[225px] aspect-[1] object-cover",
    },
    {
      top: 517,
      left: 654,
      imageSrc: "/all-products/img/new-project-15-2-4.png",
      imageAlt: t("auto.equipmentdiscovery.stomp.v980.equipment"),
      imageClassName:
        "absolute top-[52px] left-[9px] w-[271px] h-[271px] aspect-[1] object-cover",
    },
  ];

  const categories = [
    { id: "mini-excavator", label: t("auto.equipmentdiscovery.mini.excavator"), top: 392 },
    { id: "skid-steer", label: t("auto.equipmentdiscovery.skid.steer"), top: 431 },
    { id: "stone-crusher", label: t("auto.equipmentdiscovery.stone.crusher"), top: 470 },
    { id: "wheel-loader", label: t("auto.equipmentdiscovery.wheel.loader"), top: 509 },
    { id: "scissor-lift", label: t("auto.equipmentdiscovery.scissor.lift"), top: 548 },
    { id: "forklift", label: "Forklift", top: 587 },
    { id: "road-roller", label: t("auto.equipmentdiscovery.road.roller"), top: 626 },
  ];

  const operationWeightOptions = [
    { id: "compact", label: "Compact setup", top: 73 },
    { id: "medium", label: "Medium setup", top: 112 },
    { id: "heavy", label: "Heavy setup", top: 151 },
    { id: "towable", label: "Towable format", top: 190 },
    { id: "tracked", label: "Tracked format", top: 229 },
    { id: "wheeled", label: "Wheeled format", top: 268 },
    { id: "configured", label: "Configured to quote", top: 307 },
  ];

  const engineOptions = [
    { id: "gas", label: "Gas option", top: 73 },
    { id: "diesel", label: "Diesel option", top: 112 },
    { id: "hydraulic", label: "Hydraulic match", top: 151 },
    { id: "confirmed", label: "Confirmed before quote", top: 190 },
    { id: "electric", label: "Electric drive", top: 229 },
  ];

  const horsepowerOptions = [
    { id: "power-range", label: "10 - 25 HP range", top: 73 },
    { id: "attachment-load", label: "Match attachment load", top: 112 },
    { id: "duty-cycle", label: "Duty-cycle based", top: 151 },
    { id: "flow-match", label: "Flow requirement", top: 190 },
    { id: "transport-limit", label: "Transport limit", top: 229 },
    { id: "site-condition", label: "Site condition", top: 268 },
    { id: "quote-confirmed", label: "Confirmed before quote", top: 307 },
  ];

  return (
    <section
      className="absolute top-[3683px] left-[5px] w-[1920px] h-[3138px]"
      aria-labelledby="equipment-discovery-heading"
    >
      <h2
        id="equipment-discovery-heading"
        className="absolute w-[calc(100%_-_1433px)] top-[43px] left-[716px] [font-family:'Clofie-Bold',Helvetica] font-bold text-[#d8c79a] text-[75px] tracking-[-0.75px] leading-[normal] whitespace-nowrap"
      >
        EQUIPMENTS
      </h2>
      <form
        className="absolute top-[220px] left-[85px] w-[443px] h-16"
        role="search"
        aria-label={t("auto.equipmentdiscovery.search.equipments")}
      >
        <label htmlFor="equipment-search" className="sr-only">{t("auto.equipmentdiscovery.search.equipments")}</label>
        <input
          id="equipment-search"
          type="search"
          placeholder="Search..."
          className="absolute top-0 left-0 w-[441px] h-16 border-4 border-solid border-[#d8c79a] [font-family:'Google_Sans_Flex',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal] placeholder:text-white pl-5 pr-20"
        />
        <button
          type="submit"
          className="absolute top-0 left-[377px] w-16 h-16 bg-[#d8c79a] border-[6px] border-solid"
          aria-label={t("auto.equipmentdiscovery.submit.search")}
        >
          <img
            className="absolute top-4 left-[15px] w-[33px] h-[33px]"
            alt=""
            aria-hidden="true"
            src="/all-products/img/search.svg"
          />
        </button>
      </form>
      <p className="absolute top-[252px] left-[1493px] [font-family:'Clofie-Regular',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">{t("auto.equipmentdiscovery.showing.1.20")}</p>
      <aside aria-label={t("auto.equipmentdiscovery.equipment.filters")}>
        <div className="top-[319px] left-[85px] h-[361px] absolute w-[361px] bg-[#d9d9d9]" />
        <div className="absolute top-[374px] left-[99px] w-[346px] h-[3px] bg-[#153d28]" />
        <div className="absolute top-[374px] left-[99px] w-[346px] h-[3px] bg-[#153d28]" />
        <h3 className="absolute top-[334px] left-[99px] [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap">
          Categories
        </h3>
        <button
          type="button"
          className="top-[328px] left-[414px] absolute w-10 h-10"
          aria-label={t("auto.equipmentdiscovery.collapse.categories.filter")}
        >
          <img alt="" aria-hidden="true" src="/all-products/img/arrow-drop-left-4.svg" />
        </button>
        {categories.map((category) => (
          <FilterCheckbox
            key={category.id}
            id={category.id}
            label={category.label}
            top={category.top}
            left={99}
            labelLeft={category.id === "mini-excavator" ? 137 : 135}
          />
        ))}

        <div className="absolute top-[704px] left-[85px] w-[361px] h-[150px] bg-[#d9d9d9]" />
        <div className="absolute top-[759px] left-[99px] w-[346px] h-[3px] bg-[#153d28]" />
        <button
          type="button"
          className="top-[714px] left-[406px] absolute w-10 h-10"
          aria-label={t("auto.equipmentdiscovery.collapse.price.filter")}
        >
          <img alt="" aria-hidden="true" src="/all-products/img/arrow-drop-left-4.svg" />
        </button>
        <div className="absolute top-[719px] left-[99px] [font-family:'Clofie-Bold',Helvetica] font-bold text-[27px] whitespace-nowrap text-black tracking-[0] leading-[normal]">
          Price
        </div>
        <div
          className="absolute top-[784px] left-[99px] w-[346px] h-[17px]"
          aria-hidden="true"
        >
          <div className="absolute top-[3px] left-0 w-[346px] h-[11px] bg-[#799486] rounded-[10.42px]" />
          <div className="absolute top-[3px] left-0 w-[210px] h-2.5 bg-[#153d28] rounded-[10.42px]" />
          <div className="absolute -top-0.5 left-[199px] w-[23px] h-[21px] bg-[#153d28] rounded-[11.3px/10.42px] border-[3.47px] border-solid border-white" />
        </div>
        <input
          type="range"
          min={0}
          max={69999}
          value={36990}
          readOnly
          aria-label={t("auto.equipmentdiscovery.maximum.price")}
          className="absolute top-[778px] left-[99px] w-[346px] h-[24px] opacity-0 cursor-pointer"
        />
        <div className="absolute top-[811px] left-[99px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
          0-$36,990.00
        </div>
        <div className="absolute top-[811px] left-[332px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-black text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
          Max: $69,999.00
        </div>
        <div className="absolute top-[878px] left-[85px] w-[377px] h-[361px]">
          <div className="absolute top-0 left-0 w-[361px] h-[361px] bg-[#d9d9d9]" />
          <div className="absolute top-[55px] left-1.5 w-[346px] h-[3px] bg-[#153d28]" />
          <h3 className="absolute top-[15px] left-1.5 [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap">{t("auto.equipmentdiscovery.operation.weight")}</h3>
          <button
            type="button"
            className="absolute top-[9px] left-[321px] w-10 h-10"
            aria-label={t("auto.equipmentdiscovery.collapse.operation.weight")}
          >
            <img alt="" aria-hidden="true" src="/all-products/img/arrow-drop-left-4.svg" />
          </button>
          {operationWeightOptions.map((option) => (
            <FilterCheckbox
              key={option.id}
              id={option.id}
              label={option.label}
              top={option.top}
            />
          ))}
        </div>
        <div className="absolute top-[1263px] left-[85px] w-[373px] h-[279px]">
          <div className="top-0 left-0 h-[279px] absolute w-[361px] bg-[#d9d9d9]" />
          <div className="absolute top-[55px] left-1.5 w-[346px] h-[3px] bg-[#153d28]" />
          <h3 className="absolute top-[15px] left-1.5 [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap">
            Engine
          </h3>
          <button
            type="button"
            className="absolute top-[9px] left-[321px] w-10 h-10"
            aria-label={t("auto.equipmentdiscovery.collapse.engine.filter")}
          >
            <img alt="" aria-hidden="true" src="/all-products/img/arrow-drop-left-4.svg" />
          </button>
          {engineOptions.map((option) => (
            <FilterCheckbox
              key={option.id}
              id={option.id}
              label={option.label}
              top={option.top}
            />
          ))}
        </div>
        <div className="absolute top-[1566px] left-[85px] w-[377px] h-[361px]">
          <div className="absolute top-0 left-0 w-[361px] h-[361px] bg-[#d9d9d9]" />
          <div className="absolute top-[55px] left-1.5 w-[346px] h-[3px] bg-[#153d28]" />
          <h3 className="absolute top-[15px] left-1.5 [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap">
            Horsepower
          </h3>
          <button
            type="button"
            className="absolute top-[9px] left-[321px] w-10 h-10"
            aria-label={t("auto.equipmentdiscovery.collapse.horsepower.filter")}
          >
            <img alt="" aria-hidden="true" src="/all-products/img/arrow-drop-left-4.svg" />
          </button>
          {horsepowerOptions.map((option) => (
            <FilterCheckbox
              key={option.id}
              id={option.id}
              label={option.label}
              top={option.top}
            />
          ))}
        </div>
      </aside>
      {productCards.map((card, index) => (
        <EquipmentCard key={`left-column-card-${index}`} {...card} />
      ))}

      <div className="absolute top-[319px] left-[873px] w-[947px] h-[1516px]">
        {gridOneCards.map((card, index) => (
          <EquipmentCard key={`grid-one-card-${index}`} {...card} />
        ))}
      </div>
      <div className="absolute top-[1870px] left-[878px] w-[947px] h-[999px]">
        {gridTwoCards.map((card, index) => (
          <EquipmentCard key={`grid-two-card-${index}`} {...card} />
        ))}
      </div>
      <img
        className="absolute top-[2229px] left-0 w-[319px] h-[486px]"
        alt={t("auto.equipmentdiscovery.decorative.polygon")}
        src="/all-products/img/polygon.svg"
      />
      <nav
        className="absolute top-[2972px] left-[714px] w-[492px] h-[57px]"
        aria-label="Pagination"
      >
        <button
          type="button"
          className="absolute w-[57px] h-[57px] top-0 left-0"
          aria-label={t("auto.equipmentdiscovery.page.1")}
          aria-current="page"
        >
          <PaginationBox left={0} active />
          <span className="absolute top-3.5 left-[23px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-white text-2xl tracking-[0] leading-[normal]">
            1
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 left-[68px] w-[57px] h-[57px]"
          aria-label={t("auto.equipmentdiscovery.page.2")}
        >
          <PaginationBox left={68} />
          <span className="absolute top-3.5 left-[91px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#153d28] text-2xl tracking-[0] leading-[normal]">
            2
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 left-[136px] w-[57px] h-[57px]"
          aria-label={t("auto.equipmentdiscovery.page.3")}
        >
          <PaginationBox left={136} />
          <span className="absolute top-3.5 left-[157px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#153d28] text-2xl tracking-[0] leading-[normal]">
            3
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 left-[204px] w-14 h-[57px]"
          aria-label={t("auto.equipmentdiscovery.page.4")}
        >
          <div className="absolute top-0 left-[204px] w-14 h-[57px] bg-[#d9d9d9]" />
          <span className="absolute top-3.5 left-[225px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#153d28] text-2xl tracking-[0] leading-[normal]">
            4
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 left-[272px] w-14 h-[57px]"
          aria-label={t("auto.equipmentdiscovery.page.5")}
        >
          <div className="absolute top-0 left-[272px] w-14 h-[57px] bg-[#d9d9d9]" />
          <span className="absolute top-3.5 left-[293px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#153d28] text-2xl tracking-[0] leading-[normal]">
            5
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 left-[340px] w-14 h-[57px]"
          aria-label={t("auto.equipmentdiscovery.page.6")}
        >
          <div className="absolute top-0 left-[340px] w-14 h-[57px] bg-[#d9d9d9]" />
          <span className="absolute top-3.5 left-[361px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#153d28] text-2xl tracking-[0] leading-[normal]">
            6
          </span>
        </button>
        <div className="absolute top-12 left-[401px] w-[9px] h-[9px] bg-[#d9d9d9]" />
        <div className="absolute top-12 left-[414px] w-[9px] h-[9px] bg-[#d9d9d9]" />
        <div className="absolute top-12 left-[427px] w-2.5 h-[9px] bg-[#d9d9d9]" />
        <button
          type="button"
          className="absolute top-0 left-[438px] w-[54px] h-[57px]"
          aria-label={t("auto.equipmentdiscovery.next.page")}
        >
          <img
            className="absolute w-[6.84%] h-[92.35%] top-[7.65%] left-[93.16%]"
            alt=""
            aria-hidden="true"
            src="/all-products/img/vector-40.svg"
          />
        </button>
      </nav>
    </section>
  );
};
