import { FooterContentSection } from "./sections/FooterContentSection";
import { FooterLegalLinksSection } from "./sections/FooterLegalLinksSection";
import { NewsletterSubscriptionSection } from "./sections/NewsletterSubscriptionSection";

export const SourFooter = (): JSX.Element => {
  return (
    <footer
      className="relative min-h-[671px] w-full min-w-[1920px]"
      data-model-id="2468:5871"
    >
      <NewsletterSubscriptionSection />
      <FooterContentSection />
      <FooterLegalLinksSection />
    </footer>
  );
};
