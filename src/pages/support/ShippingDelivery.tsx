import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import {
  SupportHero, SectionHeading, FeatureSplit, ProcessSteps,
  FAQAccordion, SupportCTA, InfoCard, Icons,
  Section, StatGrid, Timeline, Callout, TrustStrip,
  TwoColumnList, ContactStrip, ImageCollage, ImageBand,
} from "../../components/support/SupportKit";

export const ShippingDelivery: React.FC = () => {
  const { t } = useI18n();

  const shipSteps = [
    { title: t("auto.shippingdelivery.freight.booked"), desc: t("auto.shippingdelivery.we.match.your") },
    { title: t("auto.shippingdelivery.loaded.secured"), desc: t("auto.shippingdelivery.the.machine.is") },
    { title: t("auto.shippingdelivery.in.transit"), desc: t("auto.shippingdelivery.live.tracking.number") },
    { title: t("shipping.freight.offloaded"), desc: t("auto.shippingdelivery.carrier.delivers.curbside") },
  ];

  const timeline = [
    { icon: Icons.clock, title: t("auto.shippingdelivery.in.stock.units"), desc: t("shipping.timeline.stock.desc") },
    { icon: Icons.shipping, title: t("auto.shippingdelivery.transit.time"), desc: t("shipping.timeline.transit.desc") },
    { icon: Icons.track, title: t("auto.shippingdelivery.live.tracking"), desc: t("auto.shippingdelivery.every.shipment.includes") },
  ];

  const faqs = [
    { q: t("auto.shippingdelivery.how.long.does"), a: t("auto.shippingdelivery.in.stock.machines") },
    { q: t("auto.shippingdelivery.can.i.pick"), a: t("auto.shippingdelivery.yes.warehouse.pickup") },
    { q: t("auto.shippingdelivery.what.do.i"), a: t("auto.shippingdelivery.ensure.clear.truck") },
    { q: t("auto.shippingdelivery.what.happens.if"), a: t("auto.shippingdelivery.note.any.damage") },
    { q: t("shipping.faq.intl.q"), a: t("shipping.faq.intl.a") },
    { q: t("shipping.faq.res.q"), a: t("shipping.faq.res.a") },
  ];

  const stats = [
    { value: t("shipping.stat.dispatch.val"), label: t("shipping.stat.dispatch.lbl"), sub: t("shipping.stat.dispatch.sub") },
    { value: t("shipping.stat.transit.val"), label: t("shipping.stat.transit.lbl"), sub: t("shipping.stat.transit.sub") },
    { value: t("shipping.stat.updates.val"), label: t("shipping.stat.updates.lbl"), sub: t("shipping.stat.updates.sub") },
    { value: t("shipping.stat.load.val"), label: t("shipping.stat.load.lbl"), sub: t("shipping.stat.load.sub") },
  ];

  const journey = [
    { icon: Icons.doc, title: t("shipping.journey.step1.title"), desc: t("shipping.journey.step1.desc") },
    { icon: Icons.truck, title: t("shipping.journey.step2.title"), desc: t("shipping.journey.step2.desc") },
    { icon: Icons.shield, title: t("shipping.journey.step3.title"), desc: t("shipping.journey.step3.desc") },
    { icon: Icons.track, title: t("shipping.journey.step4.title"), desc: t("shipping.journey.step4.desc") },
    { icon: Icons.gauge, title: t("shipping.journey.step5.title"), desc: t("shipping.journey.step5.desc") },
    { icon: Icons.check, title: t("shipping.journey.step6.title"), desc: t("shipping.journey.step6.desc") },
  ];

  const prep = {
    left: {
      title: t("shipping.prep.ready.title"),
      items: [
        t("shipping.prep.ready.item1"),
        t("shipping.prep.ready.item2"),
        t("shipping.prep.ready.item3"),
        t("shipping.prep.ready.item4"),
      ],
    },
    right: {
      title: t("shipping.prep.delay.title"),
      items: [
        t("shipping.prep.delay.item1"),
        t("shipping.prep.delay.item2"),
        t("shipping.prep.delay.item3"),
        t("shipping.prep.delay.item4"),
      ],
    },
  };

  const trust = [
    { icon: Icons.shield, label: t("shipping.trust.item1.lbl"), sub: t("shipping.trust.item1.sub") },
    { icon: Icons.truck, label: t("shipping.trust.item2.lbl"), sub: t("shipping.trust.item2.sub") },
    { icon: Icons.track, label: t("shipping.trust.item3.lbl"), sub: t("shipping.trust.item3.sub") },
    { icon: Icons.bolt, label: t("shipping.trust.item4.lbl"), sub: t("shipping.trust.item4.sub") },
  ];

  const gallery = [
    { src: "/img/support/production-hall.webp", alt: "Konstructz production hall", caption: t("shipping.gallery.caption") },
    { src: "/img/support/factory-worker.webp", alt: "Operator on the load floor", caption: "Load Crew" },
    { src: "/img/support/sawmill-production.webp", alt: "Industrial production yard", caption: "Yard Operations" },
    { src: "/img/support/construction-site.webp", alt: "Job-site delivery", caption: "Site Delivery" },
  ];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      <SupportHero
        eyebrow={t("auto.shippingdelivery.shipping.delivery")}
        title={t("auto.shippingdelivery.from.our.yard")}
        description={t("auto.shippingdelivery.freight.timelines.warehouse")}
        image="/img/support/production-hall.webp"
        primary={{ label: t("auto.shippingdelivery.contact.logistics.team"), to: "/support/contact-support" }}
        secondary={{ label: t("auto.shippingdelivery.back.to.support"), to: "/support" }}
      />

      <Section bordered>
        <StatGrid stats={stats} />
      </Section>

      <Section>
        <FeatureSplit
          eyebrow={t("auto.shippingdelivery.shipping.process")}
          title={t("auto.shippingdelivery.heavy.machinery.handled")}
          body={t("auto.shippingdelivery.every.konstructz.machine")}
          points={[t("auto.shippingdelivery.dot.compliant.load"), t("auto.shippingdelivery.flatbed.step.deck"), t("auto.shippingdelivery.nationwide.carrier.network"), t("auto.shippingdelivery.inspected.before.every")]}
          image="/img/support/factory-worker.webp"
        />
      </Section>

      <ImageBand
        image="/img/support/sawmill-production.webp"
        eyebrow={t("shipping.band.eyebrow")}
        title={t("shipping.band.title")}
        body={t("shipping.band.body")}
      />


      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow={t("shipping.standards.eyebrow")}
          title={t("shipping.standards.title")}
          description={t("shipping.standards.description")}
        />
        <div className="mt-12"><TrustStrip items={trust} /></div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow={t("auto.shippingdelivery.delivery.timeline")}
          title={t("auto.shippingdelivery.when.to.expect")}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {timeline.map((it) => (
            <div key={it.title} className="bg-theme-card border border-theme-border/10 p-7 hover:border-theme-accent transition-colors duration-200">
              <div className="w-12 h-12 flex items-center justify-center border border-theme-accent/40 text-theme-accent mb-5"><span className="w-6 h-6"><it.icon /></span></div>
              <h3 className="font-googleSans font-bold text-theme-text uppercase tracking-wide mb-2 transition-colors">{it.title}</h3>
              <p className="font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">{it.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow={t("shipping.process.eyebrow")}
          title={t("shipping.process.title")}
          description={t("shipping.process.description")}
        />
        <div className="mt-14"><Timeline items={journey} /></div>
      </Section>

      <Section>
        <SectionHeading eyebrow={t("auto.shippingdelivery.shipping.process")} title={t("auto.shippingdelivery.four.stages.to")} />
        <div className="mt-12"><ProcessSteps steps={shipSteps} /></div>
      </Section>

      <Section variant="secondary" bordered>
        <FeatureSplit
          reverse
          eyebrow={t("auto.shippingdelivery.warehouse.pickup.prep")}
          title={t("auto.shippingdelivery.picking.up.or")}
          body={t("auto.shippingdelivery.prefer.to.collect")}
          points={[t("auto.shippingdelivery.appointment.based.depot"), t("auto.shippingdelivery.clear.firm.truck"), t("auto.shippingdelivery.on.site.contact"), t("auto.shippingdelivery.offloading.guidance.for")]}
          image="/img/support/construction-site.webp"
        />
      </Section>

      {/* Site prep two-column */}
      <Section>
        <SectionHeading
          eyebrow={t("shipping.prep.eyebrow")}
          title={t("shipping.prep.title")}
          description={t("shipping.prep.description")}
        />
        <div className="mt-12">
          <TwoColumnList left={prep.left} right={prep.right} />
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow={t("shipping.wrong.eyebrow")}
          title={t("shipping.wrong.title")}
          description={t("shipping.wrong.description")}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <InfoCard icon={Icons.doc} title={t("auto.shippingdelivery.inspect.on.arrival")} desc={t("auto.shippingdelivery.walk.around.the")} />
          <InfoCard icon={Icons.search} title={t("auto.shippingdelivery.document.damage")} desc={t("auto.shippingdelivery.photograph.any.transit")} />
          <InfoCard icon={Icons.phone} title={t("auto.shippingdelivery.report.same.day")} desc={t("auto.shippingdelivery.call.our.logistics")} />
        </div>
        <div className="mt-10 max-w-3xl mx-auto">
          <Callout
            tone="warning"
            title={t("shipping.wrong.callout.title")}
            body={t("shipping.wrong.callout.body")}
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow={t("shipping.scenes.eyebrow")}
          title={t("shipping.scenes.title")}
          description={t("shipping.scenes.description")}
        />
        <div className="mt-12"><ImageCollage images={gallery} /></div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading eyebrow={t("auto.shippingdelivery.shipping.faq")} title={t("auto.shippingdelivery.frequently.asked.questions")} />
        <div className="mt-12"><FAQAccordion items={faqs} /></div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow={t("shipping.reach.eyebrow")}
          title={t("shipping.reach.title")}
          description={t("shipping.reach.description")}
        />
        <div className="mt-10"><ContactStrip /></div>
      </Section>

      <SupportCTA
        heading={t("auto.shippingdelivery.questions.about.your")}
        description={t("auto.shippingdelivery.our.logistics.team")}
        image="/img/support/construction-site.webp"
        primary={{ label: t("auto.shippingdelivery.contact.logistics.team"), to: "/support/contact-support" }}
        secondaryTel={{ label: t("auto.shippingdelivery.call.logistics"), tel: "+12132142203" }}
      />
    </div>
  );
};

export default ShippingDelivery;
