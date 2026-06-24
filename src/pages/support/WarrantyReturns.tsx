import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import {
  SupportHero, SectionHeading, FeatureSplit, ProcessSteps,
  FAQAccordion, SupportCTA, InfoCard, Icons,
  Section, StatGrid, Timeline, Callout, TrustStrip,
  TwoColumnList, ContactStrip, ImageBand,
} from "../../components/support/SupportKit";

export const WarrantyReturns: React.FC = () => {
  const { t } = useI18n();

  const coverage = [
    { icon: Icons.warranty, title: t("auto.warrantyreturns.structural.frame"), desc: t("auto.warrantyreturns.reinforced.steel.castings") },
    { icon: Icons.machine, title: "Powertrain", desc: t("auto.warrantyreturns.industrial.diesel.engine") },
    { icon: Icons.wrench, title: "Hydraulics", desc: t("auto.warrantyreturns.pumps.valves.and") },
  ];

  const claimSteps = [
    { title: t("auto.warrantyreturns.submit.claim"), desc: t("auto.warrantyreturns.send.your.model") },
    { title: "Review", desc: t("auto.warrantyreturns.our.service.team") },
    { title: "Approval", desc: t("auto.warrantyreturns.approved.claims.are") },
    { title: "Resolution", desc: t("auto.warrantyreturns.replacement.parts.shipped") },
  ];

  const faqs = [
    { q: t("auto.warrantyreturns.what.warranty.comes"), a: t("auto.warrantyreturns.each.machine.includes") },
    { q: t("auto.warrantyreturns.how.do.i"), a: t("auto.warrantyreturns.submit.your.machine") },
    { q: t("auto.warrantyreturns.am.i.eligible"), a: t("auto.warrantyreturns.unused.units.in") },
    { q: t("auto.warrantyreturns.how.do.replacement"), a: t("auto.warrantyreturns.approved.warranty.parts") },
    { q: t("auto.warrantyreturns.does.the.warranty"), a: t("auto.warrantyreturns.routine.wear.items") },
    { q: "What documentation do I need on file?", a: "Keep your original invoice, the machine's serial number, and your delivery receipt. These three documents let us validate any claim quickly without back-and-forth." },
    { q: "Can I transfer the warranty when I sell the machine?", a: "Warranty coverage is tied to the original purchase. Talk to our service team if you are selling — depending on the unit's age and condition we can sometimes assign the remaining term to the new owner." },
  ];

  const stats = [
    { value: "Frame", label: "Structural Cover", sub: "Reinforced castings & chassis" },
    { value: "Engine", label: "Powertrain Cover", sub: "Industrial diesel & drive" },
    { value: "Hydraulics", label: "System Cover", sub: "Pumps, valves & cylinders" },
    { value: "1×", label: "Specialist Per Claim", sub: "Same point of contact end-to-end" },
  ];

  const claimJourney = [
    { icon: Icons.doc, title: "Open a claim", desc: "Send model, serial, purchase date, and a description of the issue through the contact form or call our service line." },
    { icon: Icons.search, title: "Service review", desc: "Our service team reviews your claim, asks for photos or a short video if needed, and confirms what the warranty covers." },
    { icon: Icons.check, title: "Approval & plan", desc: "Once approved, you get a plan: parts shipped, mobile service dispatched, or a remote troubleshooting walkthrough." },
    { icon: Icons.truck, title: "Parts or service", desc: "Genuine replacement parts ship from our warehouse, or a service appointment is scheduled with one of our partners in your region." },
    { icon: Icons.wrench, title: "Repair & verify", desc: "After the repair, we verify the unit is operating normally and close out the claim with documentation for your records." },
  ];

  const includedExcluded = {
    left: {
      title: "Covered by warranty",
      items: [
        "Manufacturing defects in the frame and chassis",
        "Diesel engine and drivetrain failures under normal operation",
        "Hydraulic pumps, valves and cylinders under spec load",
        "Electrical harness and control modules (where fitted)",
        "Cracks or weld failures from manufacturing defects",
      ],
    },
    right: {
      title: "Not covered (maintenance items)",
      items: [
        "Routine wear: filters, fluids, teeth, cutting edges",
        "Damage from operating outside the published spec",
        "Cosmetic wear, scratches, paint chips, or rust",
        "Modifications or non-genuine parts installed by third parties",
        "Improper storage damage (corrosion, freeze damage, rodents)",
      ],
    },
  };

  const trust = [
    { icon: Icons.shield, label: "Direct From Maker", sub: "No outsourced warranty middlemen" },
    { icon: Icons.bolt, label: "Same-Day Response", sub: "Claims acknowledged inside one business day" },
    { icon: Icons.wrench, label: "Genuine Parts", sub: "Shipped from our own parts warehouse" },
    { icon: Icons.doc, label: "Documented Closure", sub: "Every repair logged for your records" },
  ];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      <SupportHero
        eyebrow={t("auto.warrantyreturns.warranty.returns")}
        title={t("auto.warrantyreturns.backed.protected.supported")}
        description={t("auto.warrantyreturns.understand.your.coverage")}
        image="/img/support/safety-team.jpg"
        primary={{ label: t("auto.warrantyreturns.submit.a.claim"), to: "/support/contact-support" }}
        secondary={{ label: t("auto.warrantyreturns.back.to.support"), to: "/support" }}
      />

      <Section bordered>
        <StatGrid stats={stats} />
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow={t("auto.warrantyreturns.warranty.coverage")}
          title={t("auto.warrantyreturns.what.s.protected")}
          description={t("auto.warrantyreturns.konstructz.machines.are")}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {coverage.map((c) => (
            <div key={c.title} className="bg-theme-card border border-theme-border/10 p-7 hover:border-theme-accent transition-colors duration-200">
              <div className="w-12 h-12 flex items-center justify-center border border-theme-accent/40 text-theme-accent mb-5"><span className="w-6 h-6"><c.icon /></span></div>
              <h3 className="font-googleSans font-bold text-theme-text uppercase tracking-wide mb-2 transition-colors">{c.title}</h3>
              <p className="font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Coverage Detail"
          title="What's Included, What's Maintenance"
          description="Heavy machinery needs regular maintenance — that is the operator's responsibility. The warranty covers what the machine cannot ask of you."
        />
        <div className="mt-12">
          <TwoColumnList left={includedExcluded.left} right={includedExcluded.right} />
        </div>
        <div className="mt-10 max-w-3xl mx-auto">
          <Callout
            tone="info"
            title="Service intervals matter"
            body="Following the maintenance schedule in your operator's manual is part of keeping warranty coverage valid. Save your service receipts — they help if a powertrain or hydraulic claim is ever submitted."
          />
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Service Promise"
          title="What You Can Expect From Us"
          description="Warranty support without the runaround — that's been our standard since day one."
        />
        <div className="mt-12"><TrustStrip items={trust} /></div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow={t("auto.warrantyreturns.warranty.claim.process")}
          title={t("auto.warrantyreturns.filing.is.straightforward")}
        />
        <div className="mt-12"><ProcessSteps steps={claimSteps} /></div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="End-to-End Claim Journey"
          title="From First Issue To Closed Case"
          description="The full lifecycle of a warranty claim, mapped out so you know what to expect at every stage."
        />
        <div className="mt-14"><Timeline items={claimJourney} /></div>
      </Section>

      <ImageBand
        image="/img/support/factory-worker.png"
        eyebrow="Built To Be Repairable"
        title="Heavy Castings, Honest Hydraulics, Simple Service"
        body="Our machines are built without the electronic fragility that traps modern equipment. When something does need attention, parts are accessible, components are standard, and our team is on the line."
        tone="green"
      />

      <Section>
        <FeatureSplit
          eyebrow={t("auto.warrantyreturns.return.eligibility")}
          title={t("auto.warrantyreturns.clear.fair.return")}
          body={t("auto.warrantyreturns.we.want.you")}
          points={[t("auto.warrantyreturns.original.unused.condition"), t("auto.warrantyreturns.within.the.stated"), t("auto.warrantyreturns.inspection.based.assessment"), t("auto.warrantyreturns.restocking.terms.explained")]}
          image="/img/support/analyzing-data.jpg"
        />
        <div className="mt-12 max-w-3xl mx-auto">
          <Callout
            tone="warning"
            title="Operated machines are not returnable"
            body="Once a machine has been fueled, started, and operated on a job site, it is no longer eligible for return. Use our pre-purchase guidance to make sure the configuration is right before delivery."
          />
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Day-to-Day Resources"
          title="Supporting Tools"
          description="The three resources we use most often when working with owners through a claim."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <InfoCard icon={Icons.wrench} title={t("auto.warrantyreturns.replacement.procedure")} desc={t("auto.warrantyreturns.approved.parts.ship")} />
          <InfoCard icon={Icons.contact} title={t("auto.warrantyreturns.service.support")} desc={t("auto.warrantyreturns.phone.and.remote")} />
          <InfoCard icon={Icons.doc} title={t("auto.warrantyreturns.keep.your.records")} desc={t("auto.warrantyreturns.hold.onto.your")} />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow={t("auto.warrantyreturns.warranty.faq")} title={t("auto.warrantyreturns.frequently.asked.questions")} />
        <div className="mt-12"><FAQAccordion items={faqs} /></div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Submit A Claim"
          title="Three Ways To Reach Service"
          description="The fastest path is the phone — but every channel reaches the same team."
        />
        <div className="mt-10"><ContactStrip /></div>
      </Section>

      <SupportCTA
        heading={t("auto.warrantyreturns.ready.to.submit")}
        description={t("auto.warrantyreturns.send.your.machine")}
        image="/img/support/production-hall.jpg"
        primary={{ label: t("auto.warrantyreturns.submit.a.claim"), to: "/support/contact-support" }}
        secondaryTel={{ label: t("auto.warrantyreturns.call.service"), tel: "+12132142203" }}
      />
    </div>
  );
};

export default WarrantyReturns;
