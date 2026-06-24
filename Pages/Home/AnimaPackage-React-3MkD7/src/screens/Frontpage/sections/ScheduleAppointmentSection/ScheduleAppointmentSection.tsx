export const ScheduleAppointmentSection = (): JSX.Element => {
  const warehouseDescription = {
    city: "California",
    textBefore: "KonstructZ operates from our warehouse in Commerce, ",
    textAfter:
      ", giving customers a reliable location for machinery storage, order handling, and product support. Our facility helps us prepare equipment efficiently and support customers across the United States.",
  };

  const images = {
    background: "/img/chatgpt-image-jun-5-2026-08-50-16-am-1-1.png",
    map: "/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1.png",
    icon: "/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1-1.png",
  };

  return (
    <section
      aria-labelledby="warehouse-heading"
      className="absolute left-px top-[5889px] h-[965px] w-[1920px]"
    >
      <img
        className="absolute left-0 top-[667px] h-[298px] w-[1919px] aspect-[3.86]"
        alt=""
        aria-hidden="true"
        src={images.background}
      />
      <img
        className="absolute left-[1010px] top-10 h-[610px] w-[872px] aspect-[1.43] object-cover"
        alt="Illustrated map showing KonstructZ warehouse service coverage"
        src={images.map}
      />
      <div
        className="absolute left-[92px] top-[170px] whitespace-nowrap text-center [font-family:'Clofie-Bold',Helvetica] text-7xl font-bold leading-[normal] tracking-[-1.44px] text-[#d8c79a]"
        id="warehouse-heading"
      >
        Our Warehouse
      </div>
      <p className="absolute left-[92px] top-[278px] w-[766px] [font-family:'Glonimove-Light',Helvetica] text-3xl font-normal leading-[32.9px] tracking-[0] text-white">
        <span className="font-light">{warehouseDescription.textBefore}</span>
        <span className="[font-family:'Glonimove-Bold',Helvetica] font-bold">
          {warehouseDescription.city}
        </span>
        <span className="font-light">{warehouseDescription.textAfter}</span>
      </p>
      <img
        className="absolute left-[1141px] top-[270px] h-[109px] w-[102px] aspect-[0.9]"
        alt=""
        aria-hidden="true"
        src={images.icon}
      />
    </section>
  );
};
