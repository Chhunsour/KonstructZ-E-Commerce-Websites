import { useI18n } from "../../../../context/I18nContext";
import { Reveal } from "../../../../components/Reveal";
import { Parallax } from "../../../../components/Parallax";

export const ScheduleAppointmentSection = (): JSX.Element => {
  const { t } = useI18n();
  const warehouseDescription = {
    city: "California",
    textBefore: t("auto.scheduleappointment.konstructz.operates.from"),
    textAfter:
      t("auto.scheduleappointment.giving.customers.a"),
  };

  const images = {
    background: "/img/chatgpt-image-jun-5-2026-08-50-16-am-1-1.webp",
    map: "/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1.png",
    icon: "/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1-1.png",
  };

  return (
    <section
      aria-labelledby="warehouse-heading"
      className="absolute left-px top-[5024px] h-[965px] w-[1920px]"
    >
      <Parallax strength={0.3} ariaHidden className="absolute left-0 top-[667px] h-[298px] w-[1919px]">
        <img loading="lazy" decoding="async"
          className="h-full w-full aspect-[3.86]"
          alt=""
          aria-hidden="true"
          src={images.background}
        />
      </Parallax>
      <Reveal variant="slide-r" className="absolute left-[1010px] top-10 h-[610px] w-[872px] k-image-zoom">
        <img loading="lazy" decoding="async"
          className="h-full w-full aspect-[1.43] object-cover"
          alt={t("auto.scheduleappointment.illustrated.map.showing")}
          src={images.map}
        />
      </Reveal>
      <Reveal as="div" variant="fall"
        className="absolute left-[92px] top-[170px] whitespace-nowrap text-center [font-family:'Clofie-Bold',Helvetica] text-7xl font-bold leading-[normal] tracking-[-1.44px] text-theme-heading transition-colors"
        ariaLabelledBy="warehouse-heading"
      >
        <span id="warehouse-heading">{t("auto.scheduleappointment.our.warehouse")}</span>
      </Reveal>
      <Reveal as="p" variant="rise" delay={180}
        className="absolute left-[92px] top-[278px] w-[766px] [font-family:'Glonimove-Light',Helvetica] text-3xl font-normal leading-[32.9px] tracking-[0] text-theme-text transition-colors duration-200"
      >
        <span className="font-light">{warehouseDescription.textBefore}</span>
        <span className="[font-family:'Glonimove-Bold',Helvetica] font-bold">
          {warehouseDescription.city}
        </span>
        <span className="font-light">{warehouseDescription.textAfter}</span>
      </Reveal>
      <Reveal variant="zoom" delay={360}
        className="absolute left-[1141px] top-[270px] h-[109px] w-[102px] k-float"
        ariaHidden
      >
        <img loading="lazy" decoding="async"
          className="h-full w-full aspect-[0.9]"
          alt=""
          aria-hidden="true"
          src={images.icon}
        />
      </Reveal>
    </section>
  );
};
