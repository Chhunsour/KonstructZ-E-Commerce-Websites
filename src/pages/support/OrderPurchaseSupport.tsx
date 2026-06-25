import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import {
  SupportHero, SectionHeading, FeatureSplit, ProcessSteps,
  FAQAccordion, SupportCTA, InfoCard, Icons,
  Section, StatGrid, Timeline, Callout, TrustStrip, ContactStrip, ImageBand,
} from "../../components/support/SupportKit";

export const OrderPurchaseSupport: React.FC = () => {
  const { t } = useI18n();

  const payments = [
    { icon: Icons.card, title: t("auto.orderpurchase.bank.wire.ach"), desc: t("auto.orderpurchase.secure.domestic.and") },
    { icon: Icons.doc, title: t("auto.orderpurchase.financing.leasing"), desc: t("auto.orderpurchase.flexible.equipment.financing") },
    { icon: Icons.order, title: t("auto.orderpurchase.purchase.orders"), desc: t("auto.orderpurchase.net.term.pos") },
  ];

  const trackSteps = [
    { title: t("auto.orderpurchase.order.confirmed"), desc: t("auto.orderpurchase.quote.accepted.and") },
    { title: t("auto.orderpurchase.pre.delivery.inspection"), desc: t("auto.orderpurchase.the.unit.is") },
    { title: "Dispatch", desc: t("auto.orderpurchase.machine.is.loaded") },
    { title: "Delivered", desc: t("auto.orderpurchase.unit.arrives.on") },
  ];

  const faqs = [
    { q: t("auto.orderpurchase.can.i.change"), a: t("auto.orderpurchase.yes.modifications.to") },
    { q: t("auto.orderpurchase.do.you.issue"), a: t("auto.orderpurchase.absolutely.itemized.invoices") },
    { q: t("auto.orderpurchase.what.deposit.is"), a: t("auto.orderpurchase.most.orders.are") },
    { q: t("auto.orderpurchase.can.i.buy"), a: t("auto.orderpurchase.yes.fleet.and") },
    { q: "How do I get an itemized quote?", a: "Send your shortlist of models, attachments, and shipping destination to our purchase team. We will prepare a written quotation that separates machine price, attachments, freight, and applicable taxes where possible." },
    { q: "Can I request a custom build configuration?", a: "Yes — many machines accept optional auxiliary hydraulic kits, canopy upgrades, attachment plates, and lighting packages. Tell your specialist what the job site needs and they will confirm what is buildable and how it affects lead time." },
  ];

  const stats = [
    { value: "Direct", label: "Purchase Specialist", sub: "One team from quote to delivery" },
    { value: "Written", label: "Quote Details", sub: "Machine, attachments and freight separated" },
    { value: "Clear", label: "Clear Itemized Pricing", sub: "Line items shown before approval" },
    { value: "Confirmed", label: "Order Scope", sub: "Final setup reviewed before dispatch" },
  ];

  const buyingJourney = [
    { icon: Icons.search, title: "Tell us about the job", desc: "Share your duty cycle, soil type, lift capacity needs, and shipping destination. Our specialist sizes options around those parameters — not the other way around." },
    { icon: Icons.doc, title: "Receive a written quote", desc: "An itemized quotation lists the machine, attachments, freight, and applicable charges separately so you can compare line by line." },
    { icon: Icons.card, title: "Reserve the unit", desc: "Once you approve the quote, your specialist confirms the reservation terms, configuration, and expected preparation path." },
    { icon: Icons.shield, title: "Pre-delivery inspection", desc: "The selected unit is reviewed before dispatch. Any available handoff photos or configuration notes are shared before shipping." },
    { icon: Icons.truck, title: "Dispatch & tracking", desc: "Freight is booked after the balance and dispatch details are confirmed, then carrier tracking is shared when available." },
    { icon: Icons.check, title: "Delivered & confirmed", desc: "Your team inspects the unit on arrival. Our specialist stays on the line for first-start questions and configuration help." },
  ];

  const trust = [
    { icon: Icons.shield, label: "No-Surprise Pricing", sub: "Freight and tax separated from machine price" },
    { icon: Icons.doc, label: "Clean Paperwork", sub: "Proforma, final invoice, and bill of sale included" },
    { icon: Icons.bolt, label: "Specialist Backed", sub: "Real machinery experts, not call-center scripts" },
    { icon: Icons.clock, label: "Responsive Replies", sub: "Quote and order questions routed to the purchase team" },
  ];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      <SupportHero
        eyebrow={t("auto.orderpurchase.order.purchase.support")}
        title={t("auto.orderpurchase.buy.with.total")}
        description={t("auto.orderpurchase.guidance.through.every")}
        image="/img/support/analyzing-data.jpg"
        primary={{ label: t("auto.orderpurchase.contact.purchase.support"), to: "/support/contact-support" }}
        secondary={{ label: t("auto.orderpurchase.back.to.support"), to: "/support" }}
      />

      <Section bordered>
        <StatGrid stats={stats} />
      </Section>

      <Section>
        <FeatureSplit
          eyebrow={t("auto.orderpurchase.order.assistance.overview")}
          title={t("auto.orderpurchase.a.buying.process")}
          body={t("auto.orderpurchase.purchasing.heavy.machinery")}
          points={[
            t("auto.orderpurchase.dedicated.specialist.assigned"),
            t("auto.orderpurchase.transparent.pricing.with"),
            t("auto.orderpurchase.pre.delivery.inspection"),
            t("auto.orderpurchase.clear.documentation.for"),
          ]}
          image="/img/support/safety-team.jpg"
        />
      </Section>

      <ImageBand
        image="/img/support/production-hall.jpg"
        eyebrow="Inside The Process"
        title="Quotes Built By People Who've Run These Machines"
        body="Your purchase specialist has run units off the same depot floor where yours is being prepared. Expect questions about your soil, your access, and your duty cycle — not your credit card."
      />


      {/* Why operators trust the way we sell */}
      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="The Konstructz Way"
          title="Pricing You Can Defend Internally"
          description="Heavy machinery is a capital decision. Our paperwork is built so you can take it to a finance team, an accountant, or a tax filing without rework."
        />
        <div className="mt-12">
          <TrustStrip items={trust} />
        </div>
      </Section>

      {/* Payment methods */}
      <Section>
        <SectionHeading
          eyebrow={t("auto.orderpurchase.payment.methods")}
          title={t("auto.orderpurchase.flexible.ways.to")}
          description={t("auto.orderpurchase.choose.the.payment")}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {payments.map((p) => (
            <div key={p.title} className="bg-theme-card border border-theme-border/10 p-7 hover:border-theme-accent transition-colors duration-200">
              <div className="w-12 h-12 flex items-center justify-center border border-theme-accent/40 text-theme-accent mb-5"><span className="w-6 h-6"><p.icon /></span></div>
              <h3 className="font-googleSans font-bold text-theme-text uppercase tracking-wide mb-2 transition-colors">{p.title}</h3>
              <p className="font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 max-w-3xl mx-auto">
          <Callout
            tone="info"
            title="Need a specific payment instrument?"
            body="If your accounting team needs a particular payment method or document set we have not listed, ask before quote approval. We will confirm what can be supported for your order."
          />
        </div>
      </Section>

      {/* Detailed buying journey */}
      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Buying Journey"
          title="Six Stages, Fully Mapped"
          description="From first conversation to job-site handoff, this is the practical order path Konstructz follows."
        />
        <div className="mt-14">
          <Timeline items={buyingJourney} />
        </div>
      </Section>

      <Section>
        <FeatureSplit
          reverse
          eyebrow={t("auto.orderpurchase.invoice.requests")}
          title={t("auto.orderpurchase.documentation.done.right")}
          body={t("auto.orderpurchase.need.a.proforma")}
          points={[t("auto.orderpurchase.proforma.final.invoices"), t("auto.orderpurchase.tax.and.freight"), t("auto.orderpurchase.duplicate.copies.on")]}
          image="/img/support/analyzing-data.jpg"
        />
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow={t("auto.orderpurchase.order.tracking.process")}
          title={t("auto.orderpurchase.from.confirmation.to")}
          description={t("auto.orderpurchase.four.clear.stages")}
        />
        <div className="mt-12"><ProcessSteps steps={trackSteps} /></div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Order Modifications"
          title="Change Things Before Dispatch"
          description="Most modifications are possible while your unit is still in our depot. Once dispatched, changes are limited to delivery address rerouting via the carrier."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <InfoCard icon={Icons.wrench} title={t("auto.orderpurchase.change.configuration")} desc={t("auto.orderpurchase.adjust.model.attachments")} />
          <InfoCard icon={Icons.shipping} title={t("auto.orderpurchase.update.shipping")} desc={t("auto.orderpurchase.change.the.delivery")} />
          <InfoCard icon={Icons.doc} title={t("auto.orderpurchase.cancel.or.reschedule")} desc={t("auto.orderpurchase.talk.to.your")} />
        </div>
        <div className="mt-10 max-w-3xl mx-auto">
          <Callout
            tone="warning"
            title="Modify before the dispatch stage"
            body="Once a machine is loaded onto a carrier, configuration changes are no longer possible without recalling the unit. If you need a change, call your specialist as early as possible."
          />
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading eyebrow={t("auto.orderpurchase.order.faq")} title={t("auto.orderpurchase.frequently.asked.questions")} />
        <div className="mt-12"><FAQAccordion items={faqs} /></div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Direct Lines"
          title="Talk To Purchase Support"
          description="Three ways to reach the team that owns your order."
        />
        <div className="mt-10"><ContactStrip /></div>
      </Section>

      <SupportCTA
        heading={t("auto.orderpurchase.need.help.with")}
        description={t("auto.orderpurchase.our.purchase.support")}
        image="/img/support/factory-worker.png"
        primary={{ label: t("auto.orderpurchase.contact.purchase.support"), to: "/support/contact-support" }}
        secondaryTel={{ label: t("auto.orderpurchase.call.sales.team"), tel: "+12132142203" }}
      />
    </div>
  );
};

export default OrderPurchaseSupport;
