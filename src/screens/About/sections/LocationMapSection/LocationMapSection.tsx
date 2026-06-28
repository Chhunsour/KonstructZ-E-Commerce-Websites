import { useI18n } from "../../../../context/I18nContext";


export const LocationMapSection = (): JSX.Element => {
  const { t } = useI18n();
  const mapEmbedUrl =
    "https://www.google.com/maps?q=2522+S+Malt+Ave,+Commerce,+CA+90040&z=15&output=embed";
  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=2522%20S%20Malt%20Ave%2C%20Commerce%2C%20CA%2090040";

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
          {t("about.location.heading", { fallback: "Our Location & Warehouse" })}
        </h2>
        <p className="mt-6 max-w-[1300px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-text text-[24px] leading-[1.25] transition-colors">
          {t("about.location.warehouseIntro", { fallback: "Our main warehouse is located at" })}{" "}
          <span className="font-bold text-theme-accent">
            2522 S Malt Ave., Commerce, CA 90040, United States
          </span>
          .
        </p>
        <p className="mt-4 max-w-[1300px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-muted text-[18px] leading-[1.4] transition-colors">
          {t("about.location.appointmentDescDetailed", { fallback: "Visit by appointment for yard walkthroughs, equipment demos and depot pickup. Our team is on site Monday–Friday, 8:00 AM – 5:00 PM Pacific." })}
        </p>
      </header>

      <div
        className="relative mx-[90px] h-[640px] overflow-hidden border border-theme-border/20 bg-theme-sec transition-colors duration-200"
        aria-label={t("auto.locationmap.warehouse.location.section")}
      >
        <iframe
          title="Konstructz Commerce CA depot — Google Maps"
          src={mapEmbedUrl}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-6 right-6 bg-[#153d28] px-5 py-3 [font-family:'Google_Sans_Flex',Helvetica] text-[14px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-theme-accent hover:text-[#153d28]"
        >
          {t("about.location.openInMaps", { fallback: "Open in Google Maps" })}
        </a>
      </div>
    </section>
  );
};
