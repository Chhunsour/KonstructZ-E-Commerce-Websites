import { AppointmentCTASection } from "./sections/AppointmentCTASection";
import { CustomerTestimonialsSection } from "./sections/CustomerTestimonialsSection";
import { FooterContactSection } from "./sections/FooterContactSection";
import { HeroIntroSection } from "./sections/HeroIntroSection";
import { LocationMapSection } from "./sections/LocationMapSection";
import { MissionGallerySection } from "./sections/MissionGallerySection";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { TrustPillarsSection } from "./sections/TrustPillarsSection";

export const About = (): JSX.Element => {
  return (
    <main
      className="relative w-full min-w-[1920px] min-h-[6995px] overflow-hidden bg-[#282828]"
      data-model-id="1582:5216"
      aria-label="About page"
    >
      <div
        className="absolute inset-0 w-[1920px] h-[8103px] bg-[#282828] pointer-events-none"
        aria-hidden="true"
      />
      <NavigationBarSection />
      <HeroIntroSection />
      <MissionGallerySection />
      <LocationMapSection />
      <TrustPillarsSection />
      <CustomerTestimonialsSection />
      <AppointmentCTASection />
      <FooterContactSection />
    </main>
  );
};
