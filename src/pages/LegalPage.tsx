import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext";

type LegalPageKind = "privacy" | "policy";

interface LegalPageProps {
  kind: LegalPageKind;
}

const pageContent: Record<LegalPageKind, { title: string; intro: string; sections: Array<{ title: string; body: string }> }> = {
  privacy: {
    title: "Privacy",
    intro: "How KonstructZ handles quote requests, contact details, and website inquiries.",
    sections: [
      {
        title: "Information You Send",
        body: "When you submit a form, request a quote, or contact support, KonstructZ uses the details you provide to respond to that request and support the sales or service conversation.",
      },
      {
        title: "Website Use",
        body: "Basic website activity may be used to improve page performance, product navigation, and support workflows. KonstructZ does not need sensitive payment information through general contact forms.",
      },
      {
        title: "Contact",
        body: "For privacy questions or a request about submitted information, contact the KonstructZ team through the contact page.",
      },
    ],
  },
  policy: {
    title: "Policy",
    intro: "General website, product, and quote policy information for KonstructZ visitors.",
    sections: [
      {
        title: "Product Information",
        body: "Website product details are provided for buyer guidance. Final pricing, availability, configuration, freight, warranty, and purchase terms are confirmed through official KonstructZ quote documents.",
      },
      {
        title: "Orders And Support",
        body: "Order, delivery, warranty, return, and support requests should be handled through the support pages or by contacting the KonstructZ team directly.",
      },
      {
        title: "Updates",
        body: "KonstructZ may update website pages, product information, and policies as equipment availability and business requirements change.",
      },
    ],
  },
};

export const LegalPage: React.FC<LegalPageProps> = ({ kind }) => {
  const { t } = useI18n();
  const content = pageContent[kind];

  return (
    <main className="min-h-screen bg-theme-bg px-6 pb-24 pt-32 text-theme-text transition-colors">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="font-googleSans text-sm font-bold uppercase tracking-[0.16em] text-theme-accent transition-colors hover:text-brand-green"
        >
          KonstructZ
        </Link>
        <h1 className="mt-6 font-heading text-5xl uppercase tracking-wide text-theme-heading sm:text-6xl">
          {t(`legal.${kind}.title`, { fallback: content.title })}
        </h1>
        <p className="mt-5 max-w-2xl font-glonimove text-lg leading-8 text-theme-muted">
          {t(`legal.${kind}.intro`, { fallback: content.intro })}
        </p>
        <div className="mt-12 divide-y divide-theme-border/30 border-y border-theme-border/30">
          {content.sections.map((section, index) => (
            <section key={section.title} className="py-8">
              <h2 className="font-googleSans text-base font-bold uppercase tracking-[0.14em] text-theme-heading">
                {t(`legal.${kind}.section.${index}.title`, { fallback: section.title })}
              </h2>
              <p className="mt-4 font-glonimove text-base leading-8 text-theme-muted">
                {t(`legal.${kind}.section.${index}.body`, { fallback: section.body })}
              </p>
            </section>
          ))}
        </div>
        <Link
          to="/contact"
          className="mt-10 inline-flex min-h-[46px] items-center justify-center bg-theme-accent px-6 font-googleSans text-sm font-bold uppercase tracking-[0.12em] text-theme-bg transition-colors hover:bg-brand-green hover:text-white"
        >
          {t("nav.contactUs", { fallback: "Contact Us" })}
        </Link>
      </div>
    </main>
  );
};

export default LegalPage;
