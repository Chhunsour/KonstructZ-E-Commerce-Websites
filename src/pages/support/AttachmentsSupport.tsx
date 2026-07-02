import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import {
  SupportHero, SectionHeading, FeatureSplit, ProcessSteps,
  FAQAccordion, SupportCTA, InfoCard, Icons,
  Section, StatGrid, Callout, TrustStrip,
  TwoColumnList, ContactStrip, Timeline, ImageBand,
} from "../../components/support/SupportKit";

export const AttachmentsSupport: React.FC = () => {
  const { t } = useI18n();

  const hydraulics = [
    { icon: Icons.wrench, title: t("auto.attachments.flow.rate.gpm"), desc: t("auto.attachments.match.attachment.flow") },
    { icon: Icons.machine, title: t("auto.attachments.operating.pressure"), desc: t("auto.attachments.confirm.psi.ratings") },
    { icon: Icons.attachments, title: t("auto.attachments.mounting.plate"), desc: t("auto.attachments.verify.quick.attach") },
  ];

  const installSteps = [
    { title: t("auto.attachments.confirm.fit"), desc: t("auto.attachments.check.coupler.type") },
    { title: t("auto.attachments.mount.lock"), desc: t("auto.attachments.engage.the.quick") },
    { title: t("auto.attachments.connect.hydraulics"), desc: t("auto.attachments.couple.the.hydraulic") },
    { title: t("auto.attachments.test.run"), desc: t("auto.attachments.cycle.the.attachment") },
  ];

  const faqs = [
    { q: t("auto.attachments.how.do.i"), a: t("auto.attachments.compatibility.comes.down") },
    { q: t("auto.attachments.what.hydraulic.flow"), a: t("auto.attachments.each.powered.attachment") },
    { q: t("auto.attachments.can.i.install"), a: "Most quick-attach attachments mount in minutes following our installation guide. Powered attachments require connecting hydraulic lines and a low-flow leak check before full use." },
    { q: t("auto.attachments.do.you.stock"), a: t("auto.attachments.yes.we.stock") },
    { q: t("auto.attachments.how.do.i"), a: t("auto.attachments.grease.pivot.points") },
    { q: "Can I run a high-flow attachment on a standard machine?", a: "Only if the selected machine is configured for that attachment's hydraulic demand. Running a mismatched powered tool can underperform, overheat oil, or shorten seal life, so Konstructz confirms the setup before quoting." },
    { q: "What's the difference between quick-attach and pin-on mounts?", a: "Quick-attach systems make tool changes faster across compatible couplers. Pin-on mounts connect directly to the boom and can suit heavier-duty work, but they are slower to change. The right answer depends on the machine and attachment." },
  ];

  const stats = [
    { value: "Flow", label: "Hydraulic Match", sub: "Attachment paired to machine output" },
    { value: "Pressure", label: "Circuit Check", sub: "Verified before full use" },
    { value: "Coupler", label: "Mount Verified", sub: "Plate or pin setup confirmed" },
    { value: "Parts", label: "Wear Support", sub: "Teeth, edges and seals identified" },
  ];

  const compatJourney = [
    { icon: Icons.machine, title: "Send your machine model", desc: "Share the machine model, serial number if available, and photos of the coupler and auxiliary lines. That gives us the fitment baseline." },
    { icon: Icons.gauge, title: "We confirm specs", desc: "Our specialist checks mounting style, hydraulic demand, pressure range, hose ends, and any electrical requirements before recommending an attachment." },
    { icon: Icons.attachments, title: "Quote with confidence", desc: "If the setup is compatible, you receive a quote with the attachment and any adapter items required. If not, we suggest the closest practical alternative." },
    { icon: Icons.truck, title: "Ship with the right parts", desc: "Attachment shipments include the matched hose and coupler guidance available for that configuration so the on-site crew knows what to inspect." },
    { icon: Icons.check, title: "Verify on site", desc: "On first start-up, cycle the attachment slowly, check for leaks or binding, and contact Konstructz if anything looks off before full operation." },
  ];

  const trust = [
    { icon: Icons.shield, label: "Spec-Matched", sub: "Flow and pressure reviewed before quote" },
    { icon: Icons.attachments, label: "Coupler Verified", sub: "Mounting plate compatibility cleared" },
    { icon: Icons.wrench, label: "Install Cards", sub: "Printed mount instructions in every box" },
    { icon: Icons.bolt, label: "Phone-In Setup", sub: "Specialist walkthrough on first start" },
  ];

  const compatibility = {
    left: {
      title: "Compatible setups",
      items: [
        "Matching coupler style or adapter path",
        "Hydraulic flow within the attachment's required range",
        "Operating pressure within the attachment's required range",
        "Required auxiliary circuit (e.g., case drain) present",
        "Machine weight & lift capacity adequate for the load",
      ],
    },
    right: {
      title: "Compatibility blockers",
      items: [
        "Coupler mismatch with no adapter available",
        "Attachment flow demand exceeds machine output",
        "Operating pressure outside the spec range",
        "Missing case drain on a hammer-rated circuit",
        "Machine too light for the attachment's reaction force",
      ],
    },
  };

  const maintenance = [
    {
      icon: Icons.wrench,
      title: "Daily greasing",
      desc: "Hit every pivot point and pin with grease at start-of-shift. Wipe the zerk before adding grease to keep grit out of the bearing.",
    },
    {
      icon: Icons.search,
      title: "Pre-use inspection",
      desc: "Walk around every morning. Look for cracked welds, missing pins, hose abrasion, and loose hydraulic fittings. Catching it early avoids field breakdowns.",
    },
    {
      icon: Icons.shield,
      title: "Off-ground storage",
      desc: "Store attachments on a pallet or stand, not in mud or standing water. Hydraulic connectors should be capped to keep contaminants out.",
    },
  ];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      <SupportHero
        eyebrow={t("auto.attachments.attachments.support")}
        title={t("auto.attachments.one.machine.many")}
        description={t("auto.attachments.check.compatibility.confirm")}
        image="/img/support/factory-worker.webp"
        primary={{ label: t("auto.attachments.request.attachment.support"), to: "/support/contact-support" }}
        secondary={{ label: t("auto.attachments.back.to.support"), to: "/support" }}
      />

      <Section bordered>
        <StatGrid stats={stats} />
      </Section>

      <Section>
        <FeatureSplit
          eyebrow={t("auto.attachments.attachment.compatibility")}
          title={t("auto.attachments.fit.first.then")}
          body={t("auto.attachments.an.attachment.is")}
          points={[t("auto.attachments.coupler.mounting.plate"), t("auto.attachments.hydraulic.flow.pressure"), t("auto.attachments.model.specific.confirmation"), t("auto.attachments.quick.attach.compatibility")]}
          image="/img/support/construction-site.webp"
        />
      </Section>

      <ImageBand
        image="/img/support/production-hall.webp"
        eyebrow="Real Hydraulics, Real Tools"
        title="Attachments Engineered, Not Adapted"
        body="Every attachment inquiry is checked against machine fitment, hydraulic demand, and mounting style before quote. The result is a cleaner buying path and fewer surprises at first start."
        tone="green"
      />


      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow={t("auto.attachments.hydraulic.requirements")}
          title={t("auto.attachments.spec.it.right")}
          description={t("auto.attachments.three.numbers.decide")}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {hydraulics.map((h) => (
            <div key={h.title} className="bg-theme-card border border-theme-border/10 p-7 hover:border-theme-accent transition-colors duration-200">
              <div className="w-12 h-12 flex items-center justify-center border border-theme-accent/40 text-theme-accent mb-5"><span className="w-6 h-6"><h.icon /></span></div>
              <h3 className="font-googleSans font-bold text-theme-text uppercase tracking-wide mb-2 transition-colors">{h.title}</h3>
              <p className="font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">{h.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Compatibility two-column */}
      <Section>
        <SectionHeading
          eyebrow="Compatibility Reference"
          title="What Makes An Attachment Fit"
          description="Five technical boxes need to tick for an attachment to perform on your machine."
        />
        <div className="mt-12"><TwoColumnList left={compatibility.left} right={compatibility.right} /></div>
        <div className="mt-10 max-w-3xl mx-auto">
          <Callout
            tone="warning"
            title="Don't over-flow your hydraulics"
            body="Running an attachment beyond the machine's rated flow can overheat the oil, damage pump seals, and fail the attachment. When in doubt, ask us to verify before purchase."
          />
        </div>
      </Section>

      {/* Compatibility journey */}
      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Compatibility Workflow"
          title="From Inquiry To First Cut"
          description="The five-step path we follow when sizing an attachment to your machine."
        />
        <div className="mt-14"><Timeline items={compatJourney} /></div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow={t("auto.attachments.installation.guides")}
          title={t("auto.attachments.mount.in.four")}
        />
        <div className="mt-12"><ProcessSteps steps={installSteps} /></div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Why It Works"
          title="The Attachment Support Promise"
          description="A simple commitment: every attachment we sell, we confirm fits before it ships."
        />
        <div className="mt-12"><TrustStrip items={trust} /></div>
      </Section>

      {/* Maintenance detailed */}
      <Section>
        <SectionHeading
          eyebrow={t("auto.attachments.maintenance.tips")}
          title="Keep Attachments Running Longer"
          description="A handful of habits add years to attachment life."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          {maintenance.map((m) => (
            <div key={m.title} className="bg-theme-card border border-theme-border/10 p-7 hover:border-theme-accent transition-colors duration-200">
              <div className="w-12 h-12 flex items-center justify-center border border-theme-accent/40 text-theme-accent mb-5">
                <span className="w-6 h-6"><m.icon /></span>
              </div>
              <h3 className="font-googleSans font-bold text-theme-text uppercase tracking-wide mb-2 transition-colors">{m.title}</h3>
              <p className="font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">{m.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard icon={Icons.wrench} title={t("auto.attachments.maintenance.tips")} desc={t("auto.attachments.grease.pivots.inspect")} />
          <InfoCard icon={Icons.attachments} title={t("auto.attachments.replacement.components")} desc={t("auto.attachments.genuine.teeth.edges")} />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow={t("auto.attachments.attachments.faq")} title={t("auto.attachments.frequently.asked.questions")} />
        <div className="mt-12"><FAQAccordion items={faqs} /></div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Talk Attachments"
          title="Get A Compatibility Check"
          description="Send your model and we'll confirm fit, hydraulics, and install steps."
        />
        <div className="mt-10"><ContactStrip /></div>
      </Section>

      <SupportCTA
        heading={t("auto.attachments.need.the.right")}
        description={t("auto.attachments.send.us.your")}
        image="/img/support/sawmill-production.webp"
        primary={{ label: t("auto.attachments.request.attachment.support"), to: "/support/contact-support" }}
        secondaryTel={{ label: t("auto.attachments.call.support"), tel: "+12132142203" }}
      />
    </div>
  );
};

export default AttachmentsSupport;
