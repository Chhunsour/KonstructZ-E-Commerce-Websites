import { AnimaScaler } from "../../components/layout/AnimaScaler";
import { MobileAbout } from "./MobileAbout";
import { HeroIntroSection } from "./sections/HeroIntroSection";
import { MissionGallerySection } from "./sections/MissionGallerySection";
import { LocationMapSection } from "./sections/LocationMapSection";
import { TrustPillarsSection } from "./sections/TrustPillarsSection";
import { CustomerTestimonialsSection } from "./sections/CustomerTestimonialsSection";
import { AppointmentCTASection } from "./sections/AppointmentCTASection";
import { FooterContactSection } from "./sections/FooterContactSection";

export const AboutScreen = (): JSX.Element => {
  return (
    <AnimaScaler bgColor="var(--theme-bg)" mobile={<MobileAbout />}>
      <div
        className="relative w-[1920px] overflow-hidden bg-theme-bg text-theme-text transition-colors duration-200"
        style={{ minHeight: "6994px" }}
      >
        <div
          className="absolute inset-0 w-[1920px] bg-theme-bg pointer-events-none transition-colors duration-200"
          style={{ height: "7094px" }}
          aria-hidden="true"
        />
        <HeroIntroSection />
        <MissionGallerySection />
        <LocationMapSection />
        <TrustPillarsSection />
        <CustomerTestimonialsSection />
        <AppointmentCTASection />
        <FooterContactSection />
      </div>
    </AnimaScaler>
  );
};
