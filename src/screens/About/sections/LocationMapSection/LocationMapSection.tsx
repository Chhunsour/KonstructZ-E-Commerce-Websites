import { useI18n } from "../../../../context/I18nContext";


export const LocationMapSection = (): JSX.Element => {
  const { t } = useI18n();

  return (
    <section
      aria-labelledby="location-map-section-heading"
      className="absolute top-[2473px] left-0 w-[1920px] h-[1000px] flex flex-col gap-[80px]"
    >
      <header className="ml-[90px]">
        <h2
          id="location-map-section-heading"
          className="[font-family:'Malking-Regular',Helvetica] font-normal text-theme-heading text-[44px] tracking-[0] leading-[1.05] transition-colors"
        >
          Our Location &amp; Warehouse
        </h2>
        <p className="mt-6 max-w-[1300px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-text text-[24px] leading-[1.25] transition-colors">
          Our main warehouse is located at{" "}
          <span className="font-bold text-theme-accent">
            2522 S Malt Ave., Commerce, CA 90040, United States
          </span>
          .
        </p>
        <p className="mt-4 max-w-[1300px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-muted text-[18px] leading-[1.4] transition-colors">
          Visit by appointment for yard walkthroughs, equipment demos and depot
          pickup. Our team is on site Monday–Friday, 8:00 AM – 5:00 PM Pacific.
        </p>
      </header>

      <div
        className="relative bg-theme-bg overflow-hidden transition-colors duration-200"
        aria-label={t("auto.locationmap.warehouse.location.section")}
      >
        {/* Real Google Maps embed (left side) */}
        <div className="absolute top-[40px] left-[90px] w-[900px] h-[560px] border-4 border-theme-accent/30 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <iframe
            title="Konstructz Commerce CA depot — Google Maps"
            src="https://www.google.com/maps?q=2522+S+Malt+Ave,+Commerce,+CA+90040&z=13&output=embed"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* USA service-area map (right side) with pin over California */}
        <div
          className="absolute top-[20px] left-[1050px] w-[820px] h-[620px]"
          aria-label="Konstructz nationwide service area — depot located in California"
        >
          <img
            src="/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1.png"
            alt="Map of the United States showing Konstructz nationwide service coverage"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain"
          />
          {/* Red map pin — positioned over California (west coast, middle-vertically) */}
          <img
            src="/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1-1.png"
            alt="Pin marking Commerce, California — Konstructz headquarters"
            loading="lazy"
            className="absolute w-[150px] h-[170px] aspect-[0.88] drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
            style={{ top: "230px", left: "65px" }}
          />
        </div>
      </div>
    </section>
  );
};
