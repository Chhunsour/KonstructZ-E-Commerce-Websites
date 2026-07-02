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
    { icon: Icons.machine, title: t("warranty.coverage.powertrain.title"), desc: t("auto.warrantyreturns.industrial.diesel.engine") },
    { icon: Icons.wrench, title: t("warranty.coverage.hydraulics.title"), desc: t("auto.warrantyreturns.pumps.valves.and") },
  ];

  const claimSteps = [
    { title: t("auto.warrantyreturns.submit.claim"), desc: t("auto.warrantyreturns.send.your.model") },
    { title: t("warranty.claim.review.title"), desc: t("auto.warrantyreturns.our.service.team") },
    { title: t("warranty.claim.approval.title"), desc: t("auto.warrantyreturns.approved.claims.are") },
    { title: t("warranty.claim.resolution.title"), desc: t("auto.warrantyreturns.replacement.parts.shipped") },
  ];

  const faqs = [
    { q: t("auto.warrantyreturns.what.warranty.comes"), a: t("auto.warrantyreturns.each.machine.includes") },
    { q: t("auto.warrantyreturns.how.do.i"), a: t("warranty.faq.how.a") },
    { q: t("auto.warrantyreturns.am.i.eligible"), a: t("auto.warrantyreturns.unused.units.in") },
    { q: t("auto.warrantyreturns.how.do.replacement"), a: t("auto.warrantyreturns.approved.warranty.parts") },
    { q: t("auto.warrantyreturns.does.the.warranty"), a: t("auto.warrantyreturns.routine.wear.items") },
    { q: t("warranty.faq.docs.q"), a: t("warranty.faq.docs.a") },
    { q: t("warranty.faq.transfer.q"), a: t("warranty.faq.transfer.a") },
  ];

  const stats = [
    { value: t("warranty.stat.frame.val"), label: t("warranty.stat.frame.lbl"), sub: t("warranty.stat.frame.sub") },
    { value: t("warranty.stat.engine.val"), label: t("warranty.stat.engine.lbl"), sub: t("warranty.stat.engine.sub") },
    { value: t("warranty.stat.hydraulics.val"), label: t("warranty.stat.hydraulics.lbl"), sub: t("warranty.stat.hydraulics.sub") },
    { value: t("warranty.stat.direct.val"), label: t("warranty.stat.direct.lbl"), sub: t("warranty.stat.direct.sub") },
  ];

  const claimJourney = [
    { icon: Icons.doc, title: t("warranty.journey.step1.lbl"), desc: t("warranty.journey.step1.sub") },
    { icon: Icons.search, title: t("warranty.journey.step2.lbl"), desc: t("warranty.journey.step2.sub") },
    { icon: Icons.check, title: t("warranty.journey.step3.lbl"), desc: t("warranty.journey.step3.sub") },
    { icon: Icons.truck, title: t("warranty.journey.step4.lbl"), desc: t("warranty.journey.step4.sub") },
    { icon: Icons.wrench, title: t("warranty.journey.step5.lbl"), desc: t("warranty.journey.step5.sub") },
  ];

  const includedExcluded = {
    left: {
      title: t("warranty.included.title"),
      items: [
        t("warranty.included.item1"),
        t("warranty.included.item2"),
        t("warranty.included.item3"),
        t("warranty.included.item4"),
        t("warranty.included.item5"),
      ],
    },
    right: {
      title: t("warranty.excluded.title"),
      items: [
        t("warranty.excluded.item1"),
        t("warranty.excluded.item2"),
        t("warranty.excluded.item3"),
        t("warranty.excluded.item4"),
        t("warranty.excluded.item5"),
      ],
    },
  };

  const trust = [
    { icon: Icons.shield, label: t("warranty.trust.maker.lbl"), sub: t("warranty.trust.maker.sub") },
    { icon: Icons.bolt, label: t("warranty.trust.review.lbl"), sub: t("warranty.trust.review.sub") },
    { icon: Icons.wrench, label: t("warranty.trust.support.lbl"), sub: t("warranty.trust.support.sub") },
    { icon: Icons.doc, label: t("warranty.trust.closure.lbl"), sub: t("warranty.trust.closure.sub") },
  ];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      <SupportHero
        eyebrow={t("auto.warrantyreturns.warranty.returns")}
        title={t("auto.warrantyreturns.backed.protected.supported")}
        description={t("auto.warrantyreturns.understand.your.coverage")}
        image="/img/support/safety-team.webp"
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
          eyebrow={t("warranty.detail.eyebrow")}
          title={t("warranty.detail.title", { fallback: "What's Included, What's Maintenance" })}
          description={t("warranty.detail.description", { fallback: "Heavy machinery needs regular maintenance — that is the operator's responsibility. The warranty covers what the machine cannot ask of you." })}
        />
        <div className="mt-12">
          <TwoColumnList left={includedExcluded.left} right={includedExcluded.right} />
        </div>
        <div className="mt-10 max-w-3xl mx-auto">
          <Callout
            tone="info"
            title={t("warranty.detail.callout.title", { fallback: "Service intervals matter" })}
            body={t("warranty.detail.callout.body", { fallback: "Following the maintenance schedule in your operator's manual is part of keeping warranty coverage valid. Save your service receipts — they help if a powertrain or hydraulic claim is ever submitted." })}
          />
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow={t("warranty.promise.eyebrow")}
          title={t("warranty.promise.title", { fallback: "What You Can Expect From Us" })}
          description={t("warranty.promise.description", { fallback: "Warranty support should feel clear, documented, and practical from the first claim note to the final repair record." })}
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
          eyebrow={t("warranty.journey.eyebrow")}
          title={t("warranty.journey.title", { fallback: "From First Issue To Closed Case" })}
          description={t("warranty.journey.description", { fallback: "The full lifecycle of a warranty claim, mapped out so you know what to expect at every stage." })}
        />
        <div className="mt-14"><Timeline items={claimJourney} /></div>
      </Section>

      <ImageBand
        image="/img/support/factory-worker.webp"
        eyebrow={t("warranty.repairable.eyebrow")}
        title={t("warranty.repairable.title", { fallback: "Heavy Castings, Honest Hydraulics, Simple Service" })}
        body={t("warranty.repairable.body", { fallback: "Konstructz machines are selected for serviceable layouts, accessible components, and practical troubleshooting. When something needs attention, the support path is documented before work begins." })}
        tone="green"
      />

      <Section>
        <FeatureSplit
          eyebrow={t("auto.warrantyreturns.return.eligibility")}
          title={t("auto.warrantyreturns.clear.fair.return")}
          body={t("auto.warrantyreturns.we.want.you")}
          points={[t("auto.warrantyreturns.original.unused.condition"), t("auto.warrantyreturns.within.the.stated"), t("auto.warrantyreturns.inspection.based.assessment"), t("auto.warrantyreturns.restocking.terms.explained")]}
          image="/img/support/analyzing-data.webp"
        />
        <div className="mt-12 max-w-3xl mx-auto">
          <Callout
            tone="warning"
            title={t("warranty.claim.returnsBadge")}
            body={t("warranty.claim.returnsBody", { fallback: "Once a machine has been fueled, started, and operated on a job site, it is no longer eligible for return. Use our pre-purchase guidance to make sure the configuration is right before delivery." })}
          />
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow={t("warranty.resources.eyebrow")}
          title={t("warranty.resources.title", { fallback: "Supporting Tools" })}
          description={t("warranty.resources.description", { fallback: "The three resources we use most often when working with owners through a claim." })}
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
          eyebrow={t("warranty.claim.eyebrow")}
          title={t("warranty.claim.title", { fallback: "Three Ways To Reach Service" })}
          description={t("warranty.claim.description", { fallback: "The fastest path is the phone — but every channel reaches the same team." })}
        />
        <div className="mt-10"><ContactStrip /></div>
      </Section>

      <SupportCTA
        heading={t("auto.warrantyreturns.ready.to.submit")}
        description={t("auto.warrantyreturns.send.your.machine")}
        image="/img/support/production-hall.webp"
        primary={{ label: t("auto.warrantyreturns.submit.a.claim"), to: "/support/contact-support" }}
        secondaryTel={{ label: t("auto.warrantyreturns.call.service"), tel: "+12132142203" }}
      />
    </div>
  );
};

export default WarrantyReturns;
