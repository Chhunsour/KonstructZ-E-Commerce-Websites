import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import {
  SupportHero,
  SectionHeading,
  FAQAccordion,
  SupportCTA,
  InfoCard,
  Icons,
  StatGrid,
  TrustStrip,
  Section,
  Callout,
  ContactStrip,
  ImageBand,
} from "../../components/support/SupportKit";

export const Support: React.FC = () => {
  const { t } = useI18n();

  const categories = [
    { icon: Icons.order, title: t("auto..order.purchase.support"), desc: t("auto..help.with.quotes"), to: "/support/order-purchase-support" },
    { icon: Icons.shipping, title: t("auto..shipping.delivery"), desc: t("auto..freight.timelines.warehouse"), to: "/support/shipping-delivery" },
    { icon: Icons.warranty, title: t("auto..warranty.returns"), desc: t("auto..coverage.details.claim"), to: "/support/warranty-returns" },
    { icon: Icons.machine, title: t("auto..machine.guidance"), desc: t("auto..compare.excavators.skid"), to: "/support/machine-guidance" },
    { icon: Icons.attachments, title: t("auto..attachments.support"), desc: t("auto..compatibility.checks.hydraulic"), to: "/support/attachments-support" },
    { icon: Icons.contact, title: t("auto..contact.support"), desc: t("auto..reach.our.specialists"), to: "/support/contact-support" },
  ];

  const quickHelp = [
    { icon: Icons.track, title: t("auto..track.my.order"), desc: t("auto..check.the.live"), to: "/support/shipping-delivery" },
    { icon: Icons.warranty, title: t("auto..request.warranty.service"), desc: t("auto..file.a.claim"), to: "/support/warranty-returns" },
    { icon: Icons.attachments, title: t("auto..find.compatible.attachments"), desc: t("auto..match.attachments.to"), to: "/support/attachments-support" },
    { icon: Icons.phone, title: t("auto..contact.sales.team"), desc: t("auto..speak.with.a"), to: "/support/contact-support" },
  ];

  const faqs = [
    { q: t("auto..how.long.does"), a: t("auto..most.in.stock") },
    { q: t("auto..what.warranty.comes"), a: t("auto..every.konstructz.machine") },
    { q: t("auto..can.i.return"), a: t("auto..unused.machines.in") },
    { q: t("auto..how.do.i"), a: t("auto..attachment.fit.depends") },
    { q: t("auto..do.you.provide"), a: t("auto..yes.our.team") },
    { q: t("auto..how.can.i"), a: t("auto..submit.a.parts") },
  ];

  const stats = [
    { value: "Online", label: "Help Requests", sub: "Form, email and phone intake" },
    { value: "Freight", label: "Delivery Planning", sub: "Carrier coordination by machine setup" },
    { value: "PDI", label: "Pre-Delivery Review", sub: "Configured units checked before handoff" },
    { value: "Direct", label: "Specialist Support", sub: "Sales, parts and technical guidance" },
  ];

  const trust = [
    { icon: Icons.shield, label: "Parts Guidance", sub: "Replacement path confirmed by model" },
    { icon: Icons.bolt, label: "Direct Specialists", sub: "Talk to real machinery experts, not call-center scripts" },
    { icon: Icons.truck, label: "Freight Guidance", sub: "Delivery method reviewed by machine size and route" },
    { icon: Icons.gauge, label: "Job-Site Prep", sub: "Startup, offload and inspection guidance before work begins" },
  ];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      <SupportHero
        tall
        eyebrow={t("auto..support.center")}
        title={t("auto..how.can.we")}
        description={t("auto..find.answers.request")}
        image="/img/support/factory-worker.webp"
        primary={{ label: t("auto..contact.support"), to: "/support/contact-support" }}
        secondary={{ label: t("auto..browse.resources"), to: "/support/machine-guidance" }}
      />

      {/* Stat strip — runs straight under the hero, premium proof block */}
      <Section bordered>
        <StatGrid stats={stats} />
      </Section>

      {/* Support categories */}
      <Section>
        <SectionHeading
          eyebrow={t("auto..how.we.support")}
          title={t("auto..support.categories")}
          description={t("auto..six.dedicated.support")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {categories.map((c) => (
            <InfoCard key={c.title} icon={c.icon} title={c.title} desc={c.desc} to={c.to} />
          ))}
        </div>
      </Section>

      {/* Atmospheric image band between sections */}
      <ImageBand
        image="/img/support/sawmill-production.webp"
        eyebrow="Built For Heavy Work"
        title="From The Yard To Your Site, Backed All The Way"
        body="Every Konstructz machine is supported with practical guidance before dispatch, during delivery, and after the first job."
      />

      {/* Promise / trust strip */}
      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Our Support Promise"
          title="Built On Mechanical Trust"
          description="The same operator-first philosophy that goes into our machines goes into how we support them after the sale."
        />
        <div className="mt-12">
          <TrustStrip items={trust} />
        </div>
      </Section>

      {/* Quick help */}
      <Section>
        <SectionHeading eyebrow={t("auto..fast.track")} title={t("auto..quick.help")} description={t("auto..jump.straight.to")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {quickHelp.map((q) => (
            <InfoCard key={q.title} icon={q.icon} title={q.title} desc={q.desc} to={q.to} />
          ))}
        </div>
      </Section>

      {/* Contact strip — fast access */}
      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Quick Contact"
          title="Reach A Specialist Today"
          description="Three ways to connect, one focused team."
        />
        <div className="mt-10">
          <ContactStrip />
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeading eyebrow={t("auto..common.questions")} title={t("auto..frequently.asked")} description={t("auto..quick.answers.to")} />
        <div className="mt-14"><FAQAccordion items={faqs} /></div>
        <div className="mt-10 max-w-3xl mx-auto">
          <Callout
            tone="info"
            title="Need a more specific answer?"
            body="If your question isn't covered above, send us your machine model and serial number so a specialist can route the right answer."
          />
        </div>
      </Section>

      <SupportCTA
        heading={t("auto..still.need.assistance")}
        description={t("auto..our.team.is")}
        image="/img/support/construction-site.webp"
        primary={{ label: t("auto..contact.support"), to: "/support/contact-support" }}
        secondaryTel={{ label: t("auto..call.sales.team"), tel: "+12132142203" }}
      />
    </div>
  );
};

export default Support;
