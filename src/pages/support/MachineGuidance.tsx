import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import {
  SupportHero, SectionHeading, FeatureSplit,
  FAQAccordion, SupportCTA, InfoCard, Icons,
  Section, StatGrid, Callout, TrustStrip,
  TwoColumnList, ContactStrip, Timeline, ImageBand,
} from "../../components/support/SupportKit";

export const MachineGuidance: React.FC = () => {
  const { t } = useI18n();

  const machines = [
    { name: t("auto.machineguidance.mini.excavator"), best: t("auto.machineguidance.trenching.digging.tight"), power: t("auto.machineguidance.diesel.proportional.hydraulics"), image: "/img/mini-excavator-png-4-1.png" },
    { name: t("auto.machineguidance.mini.skid.steer"), best: t("auto.machineguidance.material.handling.landscaping"), power: t("auto.machineguidance.compact.high.maneuverability"), image: "/img/stomp-v980-5.png" },
    { name: t("auto.machineguidance.wheel.loader"), best: t("auto.machineguidance.loading.hauling.stockpiling"), power: t("auto.machineguidance.high.torque.bucket"), image: "/img/skoop-png-4.png" },
    { name: t("auto.machineguidance.stone.crusher"), best: t("auto.machineguidance.on.site.aggregate"), power: t("auto.machineguidance.heavy.duty.ground"), image: "/img/groundripper-png-4.png" },
  ];

  const faqs = [
    { q: t("auto.machineguidance.how.do.i"), a: t("auto.machineguidance.choose.an.excavator") },
    { q: t("auto.machineguidance.which.machine.is"), a: t("auto.machineguidance.mini.excavators.and") },
    { q: t("auto.machineguidance.can.one.machine"), a: t("auto.machineguidance.yes.with.the") },
    { q: t("auto.machineguidance.do.you.help"), a: t("auto.machineguidance.our.specialists.size") },
    { q: "What's the trade-off between rubber and steel tracks?", a: "Rubber tracks are gentler on finished surfaces (driveways, lawns, asphalt) and quieter, but wear faster in rocky or abrasive soils. Steel tracks are tougher and last longer in quarry conditions but will mark soft surfaces. We pick based on where the machine will spend most of its hours." },
    { q: "Do I need an enclosed cab?", a: "If you operate in cold weather, dust, or rain for full days, a heated/ventilated cab pays back in operator comfort and machine resale. For seasonal or short-shift work, an open ROPS canopy keeps cost down and visibility up." },
  ];

  const stats = [
    { value: "Core", label: "Machine Categories", sub: "Excavator · Skid Steer · Loader · Crusher" },
    { value: "Range", label: "Models & Variants", sub: "Sized from compact to heavier work" },
    { value: "Guide", label: "Sizing Consultation", sub: "No obligation, with a specialist" },
    { value: "Fit", label: "Operator-First", sub: "Right-sized for the job" },
  ];

  const sizingFlow = [
    { icon: Icons.search, title: "What's the work?", desc: "Trenching, lifting, loading, demolishing, crushing? Each job leans toward a different category — we start by understanding the dominant task." },
    { icon: Icons.gauge, title: "What ground?", desc: "Clay, sand, gravel, broken rock, finished surfaces? Ground conditions dictate track type, ground pressure, and engine output." },
    { icon: Icons.machine, title: "What size?", desc: "We match operating weight to your access, lift capacity to your load, and reach to your geometry. Bigger isn't better — right-sized is." },
    { icon: Icons.attachments, title: "What attachments?", desc: "Buckets, augers, breakers, thumbs, forks. We confirm hydraulic flow and coupler type so the attachment chain is buildable from day one." },
    { icon: Icons.doc, title: "Written recommendation", desc: "You receive a written spec sheet with the recommended model, attachment list, and an estimate. You decide — we never push." },
  ];

  const trust = [
    { icon: Icons.shield, label: "Honest Sizing", sub: "We say no when a smaller machine is right" },
    { icon: Icons.gauge, label: "Soil & Spec Aware", sub: "Recommendations include ground & lift checks" },
    { icon: Icons.attachments, label: "Attachment-Aware", sub: "Hydraulics & couplers planned from day one" },
    { icon: Icons.contact, label: "Specialist Owned", sub: "Same person from inquiry to delivery" },
  ];

  const excavatorVsSkid = {
    left: {
      title: "Lean excavator",
      items: [
        "You're trenching, digging, or excavating",
        "You need vertical reach and depth",
        "You're working in tight access with a swing radius",
        "You'll run breakers, thumbs, or augers",
        "Site work is mostly stationary (digging in place)",
      ],
    },
    right: {
      title: "Lean skid steer / loader",
      items: [
        "You're moving material across the site",
        "You need to load trucks or hoppers quickly",
        "You'll swap attachments multiple times per day",
        "Surface conditions allow for wheeled or tracked travel",
        "Job site is spread out, with lots of repositioning",
      ],
    },
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      <SupportHero
        eyebrow={t("auto.machineguidance.machine.guidance")}
        title={t("auto.machineguidance.find.the.right")}
        description={t("auto.machineguidance.compare.machine.categories")}
        image="/img/support/construction-site.jpg"
        primary={{ label: t("auto.machineguidance.speak.to.a"), to: "/support/contact-support" }}
        secondary={{ label: t("auto.machineguidance.back.to.support"), to: "/support" }}
      />

      <Section bordered>
        <StatGrid stats={stats} />
      </Section>

      <Section>
        <FeatureSplit
          eyebrow={t("auto.machineguidance.find.the.right")}
          title={t("auto.machineguidance.match.the.machine")}
          body={t("auto.machineguidance.the.wrong.machine")}
          points={[t("auto.machineguidance.sized.to.your"), t("auto.machineguidance.reach.vs.lift"), t("auto.machineguidance.attachment.compatibility.planning"), t("auto.machineguidance.honest.no.oversell")]}
          image="/img/support/analyzing-data.jpg"
        />
      </Section>

      <ImageBand
        image="/img/support/safety-team.jpg"
        eyebrow="Sized For The Operator"
        title="The Right Machine Is The One Your Crew Reaches For First"
        body="Productive crews trust the unit that fits the job — not the biggest brochure spec sheet. We size around your operator, not around our inventory."
      />


      {/* Comparison cards */}
      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow={t("auto.machineguidance.compare.machine.categories")}
          title={t("auto.machineguidance.the.konstructz.lineup")}
          description={t("auto.machineguidance.four.core.categories")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {machines.map((m) => (
            <div key={m.name} className="group bg-theme-card border border-theme-border/10 overflow-hidden hover:border-theme-accent hover:-translate-y-1 transition-all duration-300">
              <div className="h-40 bg-theme-sec flex items-center justify-center overflow-hidden transition-colors duration-200">
                <img src={m.image} alt={m.name} className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-heading text-xl text-theme-text uppercase transition-colors">{m.name}</h3>
                <p className="font-glonimove text-xs text-theme-muted uppercase tracking-wider transition-colors">{t("auto.machineguidance.best.for")}</p>
                <p className="font-glonimove text-sm text-theme-text leading-relaxed transition-colors">{m.best}</p>
                <p className="font-glonimove text-xs text-theme-accent font-bold pt-2 border-t border-theme-border/10 transition-colors">{m.power}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Sizing methodology */}
      <Section>
        <SectionHeading
          eyebrow="How We Size Machines"
          title="A Five-Step Recommendation"
          description="A structured way to land on the right machine — and to defend that choice to a buyer or finance team."
        />
        <div className="mt-14"><Timeline items={sizingFlow} /></div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Our Approach"
          title="Operator-First Recommendations"
          description="The advice you get from our specialists is the same advice we would give a friend buying for their own crew."
        />
        <div className="mt-12"><TrustStrip items={trust} /></div>
      </Section>

      {/* Individual guides */}
      <Section>
        <SectionHeading
          eyebrow="Category Deep Dive"
          title="Inside Each Machine Type"
          description="A closer look at where each Konstructz category pulls its weight."
        />
        <div className="mt-14 space-y-16">
          <FeatureSplit eyebrow={t("auto.machineguidance.mini.excavator.guide")} title={t("auto.machineguidance.dig.deep.fit")} body={t("auto.machineguidance.our.mini.excavators")} image="/img/mini-excavator-png-4-1.png" />
          <FeatureSplit reverse eyebrow={t("auto.machineguidance.mini.skid.steer")} title={t("auto.machineguidance.compact.power.endless")} body={t("auto.machineguidance.the.stomp.class")} image="/img/stomp-v980-5.png" />
          <FeatureSplit eyebrow={t("auto.machineguidance.wheel.loader.guide")} title={t("auto.machineguidance.load.haul.repeat")} body="High-torque wheel loaders move aggregate and stockpile material all day with strong bucket capacity and simple, serviceable mechanical drive." image="/img/skoop-png-4.png" />
          <FeatureSplit reverse eyebrow={t("auto.machineguidance.stone.crusher.guide")} title={t("auto.machineguidance.process.aggregate.on")} body={t("auto.machineguidance.heavy.duty.ground")} image="/img/groundripper-png-4.png" />
        </div>
      </Section>

      {/* Excavator vs Skid Steer */}
      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Common Decision"
          title="Excavator Or Skid Steer?"
          description="The question we get more than any other. Here's a clean way to answer it for your site."
        />
        <div className="mt-12">
          <TwoColumnList left={excavatorVsSkid.left} right={excavatorVsSkid.right} />
        </div>
        <div className="mt-10 max-w-3xl mx-auto">
          <Callout
            tone="info"
            title="Many crews carry both"
            body="A mini excavator and a mini skid steer paired together cover most general-contractor and landscape jobs. We can quote them as a package with shared attachments."
          />
        </div>
      </Section>

      {/* Recommended attachments */}
      <Section>
        <SectionHeading
          eyebrow={t("auto.machineguidance.recommended.attachments")}
          title={t("auto.machineguidance.get.more.from")}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <InfoCard icon={Icons.attachments} title={t("auto.machineguidance.match.by.hydraulics")} desc={t("auto.machineguidance.pair.attachments.to")} to="/support/attachments-support" />
          <InfoCard icon={Icons.wrench} title={t("auto.machineguidance.quick.attach.ready")} desc={t("auto.machineguidance.swap.buckets.augers")} to="/support/attachments-support" />
          <InfoCard icon={Icons.search} title={t("auto.machineguidance.compatibility.check")} desc={t("auto.machineguidance.send.us.your")} to="/support/attachments-support" />
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading eyebrow={t("auto.machineguidance.machine.selection.faq")} title={t("auto.machineguidance.frequently.asked.questions")} />
        <div className="mt-12"><FAQAccordion items={faqs} /></div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Talk To A Specialist"
          title="Get A Personal Recommendation"
          description="Describe the job, and a real machinery expert will spec it for you."
        />
        <div className="mt-10"><ContactStrip /></div>
      </Section>

      <SupportCTA
        heading={t("auto.machineguidance.not.sure.which")}
        description={t("auto.machineguidance.tell.a.specialist")}
        image="/img/support/factory-worker.png"
        primary={{ label: t("auto.machineguidance.speak.to.a"), to: "/support/contact-support" }}
        secondaryTel={{ label: t("auto.machineguidance.call.sales.team"), tel: "+12132142203" }}
      />
    </div>
  );
};

export default MachineGuidance;
