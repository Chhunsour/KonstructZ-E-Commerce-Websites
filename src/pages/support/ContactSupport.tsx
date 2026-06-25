import { useI18n } from "../../context/I18nContext";
import React, { useEffect, useState, FormEvent } from "react";
import {
  SupportHero, SectionHeading, SupportCTA, InfoCard, Icons,
  Section, StatGrid, TrustStrip, Callout, ImageBand,
} from "../../components/support/SupportKit";

export const ContactSupport: React.FC = () => {
  const { t } = useI18n();

  const methods = [
    { icon: Icons.phone, title: t("auto.contact.phone.support"), desc: t("auto.contact.talk.to.a"), line: "+1 213-214-2203", href: "tel:+12132142203" },
    { icon: Icons.mail, title: t("auto.contact.email.support"), desc: t("auto.contact.send.order.details"), line: "support@konstructz.com", href: "mailto:support@konstructz.com" },
    { icon: Icons.contact, title: t("auto.contact.sales.team"), desc: t("auto.contact.discuss.machine.selection"), line: "+1 213-214-2203", href: "tel:+12132142203" },
  ];

  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "general", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSent(true);
      setForm({ name: "", email: "", phone: "", topic: "general", message: "" });
      setTimeout(() => setSent(false), 5000);
    }
  };

  const field = "border-2 border-theme-border/20 focus:border-theme-accent p-3 font-googleSans text-sm focus:outline-none rounded bg-theme-card text-theme-text transition-colors";

  const stats = [
    { value: "Direct", label: "Reply Routing", sub: "Messages go to the relevant team" },
    { value: "Owner", label: "Specialist Contact", sub: "A team member follows the case" },
    { value: "Hours", label: "Office Support", sub: "Business-hour phone and email help" },
    { value: "Online", label: "Digital Channels", sub: "Form and email intake available" },
  ];

  const trust = [
    { icon: Icons.bolt, label: "Real Specialists", sub: "Machinery experts, not scripted agents" },
    { icon: Icons.shield, label: "Direct Channel", sub: "No outsourced call center between you and us" },
    { icon: Icons.doc, label: "Documented", sub: "Every conversation tracked to your account" },
    { icon: Icons.clock, label: "Clear Triage", sub: "Routed to the right team by topic" },
  ];

  const departments = [
    { icon: Icons.order, title: "Sales & Quoting", desc: "Pricing, configuration, financing, multi-unit orders." },
    { icon: Icons.truck, title: "Logistics & Freight", desc: "Tracking, delivery prep, route changes, damage claims." },
    { icon: Icons.warranty, title: "Service & Warranty", desc: "Claims, repair coordination, replacement parts." },
    { icon: Icons.attachments, title: "Attachments & Tech", desc: "Compatibility, install, hydraulic spec questions." },
  ];

  return (
    <div className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      <SupportHero
        eyebrow={t("auto.contact.contact.support")}
        title={t("auto.contact.talk.to.a")}
        description={t("auto.contact.reach.our.team")}
        image="/img/support/safety-team.jpg"
        primary={{ label: t("auto.contact.call.now"), to: "/support/contact-support" }}
        secondary={{ label: t("auto.contact.back.to.support"), to: "/support" }}
      />

      <Section bordered>
        <StatGrid stats={stats} />
      </Section>

      <Section>
        <SectionHeading eyebrow={t("auto.contact.contact.methods")} title={t("auto.contact.reach.us.your")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {methods.map((m) => (
            <a key={m.title} href={m.href} className="group block bg-theme-card border border-theme-border/10 p-7 hover:-translate-y-1.5 hover:border-theme-accent hover:shadow-[0_20px_40px_-15px_rgba(104,130,91,0.3)] transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center border border-theme-accent/40 text-theme-accent mb-5 group-hover:bg-theme-accent/10"><span className="w-6 h-6"><m.icon /></span></div>
              <h3 className="font-googleSans font-bold text-theme-text uppercase tracking-wide mb-2 transition-colors">{m.title}</h3>
              <p className="font-glonimove text-sm text-theme-muted leading-relaxed mb-3 transition-colors">{m.desc}</p>
              <span className="font-googleSans font-bold text-theme-accent">{m.line}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="By Department"
          title="Pick The Right Team"
          description="Tell us your topic and we route you straight to the right specialist — no transfers."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {departments.map((d) => (
            <div key={d.title} className="bg-theme-card border border-theme-border/10 p-6 hover:border-theme-accent transition-colors duration-200">
              <div className="w-11 h-11 flex items-center justify-center border border-theme-accent/40 text-theme-accent mb-4">
                <span className="w-5 h-5"><d.icon /></span>
              </div>
              <h3 className="font-googleSans font-bold uppercase tracking-wide text-theme-text text-sm mb-2 transition-colors">{d.title}</h3>
              <p className="font-glonimove text-xs text-theme-muted leading-relaxed transition-colors">{d.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Form + side info */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 bg-theme-card border border-theme-border/10 rounded-lg p-6 md:p-10 transition-colors duration-200">
            <SectionHeading center={false} eyebrow={t("auto.contact.contact.form")} title={t("auto.contact.send.us.a")} />
            {sent ? (
              <div className="mt-8 bg-theme-accent/10 border-2 border-theme-accent text-theme-heading p-6 rounded text-center space-y-3">
                <span className="w-10 h-10 mx-auto block text-theme-accent"><Icons.warranty /></span>
                <h3 className="text-lg font-googleSans font-bold uppercase">{t("auto.contact.message.received")}</h3>
                <p className="font-glonimove text-sm leading-relaxed max-w-md mx-auto text-theme-muted">A Konstructz specialist will review your request and route the next step based on machine model, attachment fitment, or purchase topic.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">Full Name *</label>
                    <input className={field} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("auto.contact.john.doe")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">Email *</label>
                    <input type="email" className={field} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">{t("auto.contact.phone")}</label>
                    <input type="tel" className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">Topic</label>
                    <select className={field} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                      <option value="general">{t("auto.contact.general.inquiry")}</option>
                      <option value="order">{t("auto.contact.order.purchase")}</option>
                      <option value="shipping">{t("auto.contact.shipping.delivery")}</option>
                      <option value="warranty">{t("auto.contact.warranty.returns")}</option>
                      <option value="attachments">Attachments</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">Message *</label>
                  <textarea rows={5} className={field} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t("auto.contact.include.your.machine")} />
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-googleSans font-bold text-sm uppercase tracking-wider px-7 py-4 transition-colors duration-300 border-2 border-brand-green hover:border-brand-greenDark">
                  {t("auto.contact.send.message")}<span className="w-4 h-4"><Icons.arrow /></span>
                </button>
                <p className="font-glonimove text-xs text-theme-muted leading-relaxed transition-colors">
                  By submitting this form, you agree we may use the information you provide to respond to your inquiry. We never share your details with third parties.
                </p>
              </form>
            )}
          </div>

          {/* Side info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-greenDark text-brand-sand border border-brand-sand/30 p-7 rounded-lg space-y-4">
              <span className="w-10 h-10 block text-brand-sand"><Icons.clock /></span>
              <h3 className="font-heading text-xl uppercase tracking-wider text-white">{t("auto.contact.business.hours")}</h3>
              <p className="font-glonimove text-sm text-brand-beige/85 leading-relaxed">
                Monday – Friday: 8:00 AM – 5:00 PM (PST)<br />
                Saturday & Sunday: Closed for field testing
              </p>
            </div>
            <div className="bg-theme-card border border-theme-border/10 rounded-lg p-7 space-y-3 transition-colors duration-200">
              <span className="w-10 h-10 block text-theme-accent"><Icons.track /></span>
              <h3 className="font-heading text-xl uppercase tracking-wider text-theme-text transition-colors">{t("auto.contact.office.depot")}</h3>
              <p className="font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">
                {t("auto.contact.konstructz.machinery")}<br />
                {t("auto.contact.2522.s.malt")}<br />
                {t("auto.contact.united.states")}
              </p>
            </div>
            <div className="bg-theme-sec border border-theme-accent/40 p-7 rounded-lg space-y-3 transition-colors duration-200">
              <span className="w-10 h-10 block text-theme-accent"><Icons.warning /></span>
              <h3 className="font-heading text-xl uppercase tracking-wider text-theme-text transition-colors">{t("auto.contact.emergency.support")}</h3>
              <p className="font-glonimove text-sm text-theme-muted leading-relaxed transition-colors">{t("auto.contact.machine.down.on")}</p>
              <a href="tel:+12132142203" className="inline-block bg-theme-accent text-theme-bg px-5 py-2.5 font-googleSans font-bold text-sm tracking-wider hover:bg-theme-text transition-colors uppercase">
                +1 213-214-2203
              </a>
            </div>
          </div>
        </div>
      </Section>

      <ImageBand
        image="/img/support/analyzing-data.jpg"
        eyebrow="Real Specialists"
        title="Direct Lines To People Who Run Machines"
        body="When you call, you reach a support path built around machine model, attachment fitment, hydraulic setup, and the job you need to finish."
      />

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Why People Reach Out"
          title="Built On Direct Conversation"
          description="Heavy machinery deserves a real conversation. Here is what makes our support channel different."
        />
        <div className="mt-12"><TrustStrip items={trust} /></div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Before You Write"
          title="Have These Three Details Handy"
          description="A small amount of upfront info dramatically speeds up the response."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-theme-card border border-theme-border/10 p-7">
            <div className="font-heading text-3xl text-theme-accent mb-3">01</div>
            <h3 className="font-googleSans font-bold uppercase text-theme-text tracking-wide mb-2">Machine Model</h3>
            <p className="font-glonimove text-sm text-theme-muted leading-relaxed">The exact model name and variant — printed on the machine ID plate and on your invoice.</p>
          </div>
          <div className="bg-theme-card border border-theme-border/10 p-7">
            <div className="font-heading text-3xl text-theme-accent mb-3">02</div>
            <h3 className="font-googleSans font-bold uppercase text-theme-text tracking-wide mb-2">Serial Number</h3>
            <p className="font-glonimove text-sm text-theme-muted leading-relaxed">The unique serial number stamped on the chassis. It lets us pull your full order history.</p>
          </div>
          <div className="bg-theme-card border border-theme-border/10 p-7">
            <div className="font-heading text-3xl text-theme-accent mb-3">03</div>
            <h3 className="font-googleSans font-bold uppercase text-theme-text tracking-wide mb-2">Issue Or Question</h3>
            <p className="font-glonimove text-sm text-theme-muted leading-relaxed">A short description, including hours on the meter and any error codes if applicable.</p>
          </div>
        </div>
        <div className="mt-10 max-w-3xl mx-auto">
          <Callout
            tone="success"
            title="Mention you're on an active site"
            body="If the machine is mid-job and time-sensitive, flag that in your message. Active-site issues are triaged ahead of general inquiries."
          />
        </div>
      </Section>

      <Section variant="secondary" bordered>
        <SectionHeading
          eyebrow="Browse First"
          title="Self-Service Resources"
          description="The fastest answers are often the ones you can find without a phone call."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <InfoCard icon={Icons.order} title={t("auto.contact.order.support")} desc={t("auto.contact.quotes.payments.invoices")} to="/support/order-purchase-support" />
          <InfoCard icon={Icons.warranty} title={t("auto.contact.warranty.help")} desc={t("auto.contact.file.a.claim")} to="/support/warranty-returns" />
          <InfoCard icon={Icons.machine} title={t("auto.contact.machine.guidance")} desc={t("auto.contact.get.matched.to")} to="/support/machine-guidance" />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow={t("auto.contact.find.us")} title={t("auto.contact.commerce.california.depot")} description="Visit by appointment for yard walkthroughs, equipment demos, and depot pickup." />
        <div className="mt-10 border-4 border-theme-accent/20 overflow-hidden rounded-lg transition-colors">
          <iframe
            title={t("auto.contact.konstructz.commerce.ca")}
            src="https://www.google.com/maps?q=2522+S+Malt+Ave,+Commerce,+CA+90040&output=embed"
            className="w-full h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Section>

      <SupportCTA
        heading={t("auto.contact.we.re.ready")}
        description={t("auto.contact.from.the.first")}
        image="/img/support/construction-site.jpg"
        primary={{ label: t("auto.contact.browse.support.center"), to: "/support" }}
        secondaryTel={{ label: t("auto.contact.call.sales.team"), tel: "+12132142203" }}
      />
    </div>
  );
};

export default ContactSupport;
