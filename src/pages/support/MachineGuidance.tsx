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
    { q: t("guidance.faq.tracks.q"), a: t("guidance.faq.tracks.a") },
    { q: t("guidance.faq.cab.q"), a: t("guidance.faq.cab.a") },
  ];

  const stats = [
    { value: t("guidance.stat.categories.val"), label: t("guidance.stat.categories.lbl"), sub: t("guidance.stat.categories.sub") },
    { value: t("guidance.stat.models.val"), label: t("guidance.stat.models.lbl"), sub: t("guidance.stat.models.sub") },
    { value: t("guidance.stat.consult.val"), label: t("guidance.stat.consult.lbl"), sub: t("guidance.stat.consult.sub") },
    { value: t("guidance.stat.operator.val"), label: t("guidance.stat.operator.lbl"), sub: t("guidance.stat.operator.sub") },
  ];

  const sizingFlow = [
    { icon: Icons.search, title: t("guidance.journey.step1.lbl"), desc: t("guidance.journey.step1.sub") },
    { icon: Icons.gauge, title: t("guidance.journey.step2.lbl"), desc: t("guidance.journey.step2.sub") },
    { icon: Icons.machine, title: t("guidance.journey.step3.lbl"), desc: t("guidance.journey.step3.sub") },
    { icon: Icons.attachments, title: t("guidance.journey.step4.lbl"), desc: t("guidance.journey.step4.sub") },
    { icon: Icons.doc, title: t("guidance.journey.step5.lbl"), desc: t("guidance.journey.step5.sub") },
  ];

  const trust = [
    { icon: Icons.shield, label: t("guidance.trust.sizing.lbl"), sub: t("guidance.trust.sizing.sub") },
    { icon: Icons.gauge, label: t("guidance.trust.soil.lbl"), sub: t("guidance.trust.soil.sub") },
    { icon: Icons.attachments, label: t("guidance.trust.attachments.lbl"), sub: t("guidance.trust.attachments.sub") },
    { icon: Icons.contact, label: t("guidance.trust.specialist.lbl"), sub: t("guidance.trust.specialist.sub") },
  ];

  const excavatorVsSkid = {
    left: {
      title: t("guidance.compare.excavator.title"),
      items: [
        t("guidance.compare.excavator.item1"),
        t("guidance.compare.excavator.item2"),
        t("guidance.compare.excavator.item3"),
        t("guidance.compare.excavator.item4"),
        t("guidance.compare.excavator.item5"),
      ],
    },
    right: {
      title: t("guidance.compare.loader.title"),
      items: [
        t("guidance.compare.loader.item1"),
        t("guidance.compare.loader.item2"),
        t("guidance.compare.loader.item3"),
        t("guidance.compare.loader.item4"),
        t("guidance.compare.loader.item5"),
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
        eyebrow={t("guidance.operator.eyebrow")}
        title={t("guidance.operator.title", { fallback: "The Right Machine Is The One Your Crew Reaches For First" })}
        body={t("guidance.operator.body", { fallback: "Productive crews trust the unit that fits the job — not the biggest brochure spec sheet. We size around your operator, not around our inventory." })}
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
          eyebrow={t("guidance.size.eyebrow")}
          title={t("guidance.size.title", { fallback: "A Five-Step Recommendation" })}
          description={t("guidance.size.description", { fallback: "A structured way to land on the right machine — and to defend that choice to a buyer or finance team." })}
        />
        <div className="mt-14"><Timeline items={sizingFlow} /></div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow={t("guidance.approach.eyebrow")}
          title={t("guidance.approach.title", { fallback: "Operator-First Recommendations" })}
          description={t("guidance.approach.description", { fallback: "The advice you get from our specialists is the same advice we would give a friend buying for their own crew." })}
        />
        <div className="mt-12"><TrustStrip items={trust} /></div>
      </Section>

      {/* Individual guides */}
      <Section>
        <SectionHeading
          eyebrow={t("guidance.deep.eyebrow")}
          title={t("guidance.deep.title", { fallback: "Inside Each Machine Type" })}
          description={t("guidance.deep.description", { fallback: "A closer look at where each Konstructz category pulls its weight." })}
        />
        <div className="mt-14 space-y-16">
          <FeatureSplit eyebrow={t("auto.machineguidance.mini.excavator.guide")} title={t("auto.machineguidance.dig.deep.fit")} body={t("auto.machineguidance.our.mini.excavators")} image="/img/mini-excavator-png-4-1.png" />
          <FeatureSplit reverse eyebrow={t("auto.machineguidance.mini.skid.steer")} title={t("auto.machineguidance.compact.power.endless")} body={t("auto.machineguidance.the.stomp.class")} image="/img/stomp-v980-5.png" />
          <FeatureSplit eyebrow={t("auto.machineguidance.wheel.loader.guide")} title={t("auto.machineguidance.load.haul.repeat")} body={t("guidance.loader.body")} image="/img/skoop-png-4.png" />
          <FeatureSplit reverse eyebrow={t("auto.machineguidance.stone.crusher.guide")} title={t("auto.machineguidance.process.aggregate.on")} body={t("auto.machineguidance.heavy.duty.ground")} image="/img/groundripper-png-4.png" />
        </div>
      </Section>

      {/* Excavator vs Skid Steer */}
      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow={t("guidance.decision.eyebrow")}
          title={t("guidance.decision.title", { fallback: "Excavator Or Skid Steer?" })}
          description={t("guidance.decision.description", { fallback: "The question we get more than any other. Here's a clean way to answer it for your site." })}
        />
        <div className="mt-12">
          <TwoColumnList left={excavatorVsSkid.left} right={excavatorVsSkid.right} />
        </div>
        <div className="mt-10 max-w-3xl mx-auto">
          <Callout
            tone="info"
            title={t("guidance.decision.callout.title", { fallback: "Many crews carry both" })}
            body={t("guidance.decision.callout.body", { fallback: "A mini excavator and a mini skid steer paired together cover most general-contractor and landscape jobs. We can quote them as a package with shared attachments." })}
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
          eyebrow={t("guidance.specialist.eyebrow")}
          title={t("guidance.specialist.title", { fallback: "Get A Personal Recommendation" })}
          description={t("guidance.specialist.description", { fallback: "Describe the job, and a real machinery expert will spec it for you." })}
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
