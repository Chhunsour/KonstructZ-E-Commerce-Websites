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
    { title: "Offloaded", desc: t("auto.shippingdelivery.carrier.delivers.curbside") },
  ];

  const timeline = [
    { icon: Icons.clock, title: t("auto.shippingdelivery.in.stock.units"), desc: "Dispatch timing depends on machine status, configuration, inspection, and carrier availability." },
    { icon: Icons.shipping, title: t("auto.shippingdelivery.transit.time"), desc: "Transit time varies by destination, route, carrier schedule, and offload requirements." },
    { icon: Icons.track, title: t("auto.shippingdelivery.live.tracking"), desc: t("auto.shippingdelivery.every.shipment.includes") },
  ];

  const faqs = [
    { q: t("auto.shippingdelivery.how.long.does"), a: t("auto.shippingdelivery.in.stock.machines") },
    { q: t("auto.shippingdelivery.can.i.pick"), a: t("auto.shippingdelivery.yes.warehouse.pickup") },
    { q: t("auto.shippingdelivery.what.do.i"), a: t("auto.shippingdelivery.ensure.clear.truck") },
    { q: t("auto.shippingdelivery.what.happens.if"), a: t("auto.shippingdelivery.note.any.damage") },
    { q: "Do you ship internationally?", a: "Our standard freight network is U.S. based. For Canada, Mexico, and select export destinations we can quote dedicated international logistics — ask your specialist for an international quotation with port-of-entry details." },
    { q: "Is liftgate or residential delivery available?", a: "Most machines are too heavy for liftgate trucks. We use flatbed and step-deck carriers and deliver curbside or to a firm offload pad. Residential delivery is possible if there is suitable truck access and an offload surface." },
  ];

  const stats = [
    { value: "Varies", label: "Dispatch Window", sub: "Based on configuration and inspection" },
    { value: "Route", label: "Transit Timing", sub: "Depends on destination and carrier" },
    { value: "Tracking", label: "Shipment Updates", sub: "Provided when carrier confirms" },
    { value: "Secured", label: "Load Planning", sub: "Matched to machine and route" },
  ];

  const journey = [
    { icon: Icons.doc, title: "Order locked in", desc: "Once payment and pre-delivery review are complete, your unit moves into the dispatch queue." },
    { icon: Icons.truck, title: "Carrier matched", desc: "We route by machine configuration, destination, access needs, and offload requirements." },
    { icon: Icons.shield, title: "Load secured", desc: "The machine and loose attachments are secured for the selected freight method before departure." },
    { icon: Icons.track, title: "Tracking issued", desc: "Carrier contact and tracking details are shared when the shipment is confirmed." },
    { icon: Icons.gauge, title: "In transit", desc: "The carrier manages ETA updates while our team helps with routing or access questions." },
    { icon: Icons.check, title: "Curbside delivery", desc: "The carrier offloads onto your firm pad. You inspect with the driver, note anything on the receipt, and sign." },
  ];

  const prep = {
    left: {
      title: "Get ready for the truck",
      items: [
        "Flat, firm offload pad with no overhead obstructions",
        "Truck access with enough turning room and overhead clearance",
        "Diesel, fuel, or operator on standby if needed for offload",
        "Authorised contact on-site to inspect and sign",
      ],
    },
    right: {
      title: "Avoid these delivery delays",
      items: [
        "Soft or muddy ground that traps the carrier truck",
        "Low cable, branch, or gate clearance that blocks the carrier",
        "Site closed during the carrier's agreed window",
        "No one on-site authorised to inspect or sign",
      ],
    },
  };

  const trust = [
    { icon: Icons.shield, label: "Load Securing", sub: "Machine and attachments secured for transport" },
    { icon: Icons.truck, label: "Right-Size Freight", sub: "Freight method matched to the unit" },
    { icon: Icons.track, label: "Shipment Updates", sub: "Carrier contact and tracking when confirmed" },
    { icon: Icons.bolt, label: "Arrival Issue Help", sub: "Damage documentation reviewed quickly" },
  ];

  const gallery = [
    { src: "/img/support/production-hall.jpg", alt: "Konstructz production hall", caption: "Commerce Depot" },
    { src: "/img/support/factory-worker.png", alt: "Operator on the load floor", caption: "Load Crew" },
    { src: "/img/support/sawmill-production.jpg", alt: "Industrial production yard", caption: "Yard Operations" },
    { src: "/img/support/construction-site.jpg", alt: "Job-site delivery", caption: "Site Delivery" },
  ];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      <SupportHero
        eyebrow={t("auto.shippingdelivery.shipping.delivery")}
        title={t("auto.shippingdelivery.from.our.yard")}
        description={t("auto.shippingdelivery.freight.timelines.warehouse")}
        image="/img/support/production-hall.jpg"
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
          image="/img/support/factory-worker.png"
        />
      </Section>

      <ImageBand
        image="/img/support/sawmill-production.jpg"
        eyebrow="Coast To Coast"
        title="Built To Land Ready For Work, Anywhere"
        body="From rural yards to active construction sites, each shipment is planned around machine configuration, access conditions, offload needs, and carrier requirements."
      />


      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Logistics Standards"
          title="How We Protect Your Investment In Transit"
          description="Heavy equipment freight needs careful loading, clear handoff details, and an offload plan that matches the site before the truck arrives."
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
          eyebrow="Inside The Process"
          title="The Six-Stage Shipping Journey"
          description="From the moment your unit clears PDI to the moment the carrier rolls off your pad."
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
          image="/img/support/construction-site.jpg"
        />
      </Section>

      {/* Site prep two-column */}
      <Section>
        <SectionHeading
          eyebrow="Site Preparation"
          title="Make The Offload Painless"
          description="Five minutes of prep saves an hour of headache for your team and the carrier."
        />
        <div className="mt-12">
          <TwoColumnList left={prep.left} right={prep.right} />
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="If Something Looks Wrong"
          title="Damage Reporting Procedure"
          description="On the rare occasion that a unit arrives with transit damage, follow these three steps so we can open a freight claim immediately."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <InfoCard icon={Icons.doc} title={t("auto.shippingdelivery.inspect.on.arrival")} desc={t("auto.shippingdelivery.walk.around.the")} />
          <InfoCard icon={Icons.search} title={t("auto.shippingdelivery.document.damage")} desc={t("auto.shippingdelivery.photograph.any.transit")} />
          <InfoCard icon={Icons.phone} title={t("auto.shippingdelivery.report.same.day")} desc={t("auto.shippingdelivery.call.our.logistics")} />
        </div>
        <div className="mt-10 max-w-3xl mx-auto">
          <Callout
            tone="warning"
            title="Note damage on the delivery receipt"
            body="Carriers' liability rules require visible damage to be written on the delivery receipt at the time of offload. Photograph the receipt and the unit before the truck leaves, then call our logistics line the same day."
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Behind The Scenes"
          title="The Commerce Depot, In Picture"
          description="A look inside the facility your machine is dispatched from."
        />
        <div className="mt-12"><ImageCollage images={gallery} /></div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading eyebrow={t("auto.shippingdelivery.shipping.faq")} title={t("auto.shippingdelivery.frequently.asked.questions")} />
        <div className="mt-12"><FAQAccordion items={faqs} /></div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Reach Logistics"
          title="Get In Touch"
          description="Track a shipment, change a delivery address, or report a freight issue."
        />
        <div className="mt-10"><ContactStrip /></div>
      </Section>

      <SupportCTA
        heading={t("auto.shippingdelivery.questions.about.your")}
        description={t("auto.shippingdelivery.our.logistics.team")}
        image="/img/support/construction-site.jpg"
        primary={{ label: t("auto.shippingdelivery.contact.logistics.team"), to: "/support/contact-support" }}
        secondaryTel={{ label: t("auto.shippingdelivery.call.logistics"), tel: "+12132142203" }}
      />
    </div>
  );
};

export default ShippingDelivery;
