import { useI18n } from "../context/I18nContext";
import React, { useState, useEffect, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../data/products";
import { Button } from "../components/ui/Button";
import { submitLead } from "../lib/leadsStore";

export const Contact: React.FC = () => {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const selectedProductFromUrl = searchParams.get("product") || "";
  const selectedAttachmentFromUrl = searchParams.get("attachment") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [interestType, setInterestType] = useState(
    selectedProductFromUrl ? "product" : selectedAttachmentFromUrl ? "attachment" : "general"
  );
  const [modelInterest, setModelInterest] = useState(
    selectedProductFromUrl || selectedAttachmentFromUrl || ""
  );
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!(name && email && phone) || submitting) return;

    setSubmitting(true);
    setError(false);

    const product = modelInterest
      ? products.find((p) => p.id === modelInterest)
      : undefined;

    const result = await submitLead({
      source: "contact-form",
      source_page: "/contact",
      name,
      email,
      phone,
      company,
      interest_type: interestType,
      product_interest: product?.name ?? modelInterest,
      product_url: product ? `${window.location.origin}/equipment/${product.id}` : undefined,
      message: notes,
      language: typeof navigator !== "undefined" ? navigator.language : undefined,
    });

    setSubmitting(false);

    if (result.ok) {
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setModelInterest("");
      setNotes("");
      setTimeout(() => setSuccess(false), 6000);
    } else {
      setError(true);
    }
  };

  return (
    <div className="bg-theme-bg min-h-screen pt-32 pb-24 text-theme-text transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 animate-gallery-swap">
          <span className="text-theme-accent text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.contact.quote.support.center")}</span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide text-theme-heading">{t("auto.contact.request.machinery.pricing")}</h1>
          <div className="w-16 h-1 bg-theme-accent mx-auto my-2" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">{t("auto.contact.get.spec.catalogs")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-theme-card p-6 md:p-10 border border-theme-border/10 rounded-lg shadow-lg transition-colors duration-200">
            {success ? (
              <div className="bg-theme-accent/10 border-2 border-theme-accent text-theme-text p-6 rounded text-center space-y-4">
                <span className="text-4xl">✅</span>
                <h3 className="text-xl font-bold font-googleSans uppercase text-theme-heading">{t("auto.contact.quote.request.submitted")}</h3>
                <p className="text-sm font-glonimove max-w-md mx-auto leading-relaxed text-theme-muted">{t("auto.contact.thank.you.a")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">
                      {t("contact.form.fullName", { fallback: "Full Name *" })}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-theme-border/20 focus:border-theme-accent p-3 font-googleSans text-sm focus:outline-none rounded bg-theme-card text-theme-text transition-colors"
                      placeholder={t("auto.contact.e.g.john")}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">
                      {t("contact.form.emailAddress", { fallback: "Email Address *" })}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-theme-border/20 focus:border-theme-accent p-3 font-googleSans text-sm focus:outline-none rounded bg-theme-card text-theme-text transition-colors"
                      placeholder="johndoe@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">
                      {t("contact.form.phoneNumber", { fallback: "Phone Number *" })}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-2 border-theme-border/20 focus:border-theme-accent p-3 font-googleSans text-sm focus:outline-none rounded bg-theme-card text-theme-text transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Company */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">{t("auto.contact.company.organization")}</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="border-2 border-theme-border/20 focus:border-theme-accent p-3 font-googleSans text-sm focus:outline-none rounded bg-theme-card text-theme-text transition-colors"
                      placeholder={t("auto.contact.e.g.heavy")}
                    />
                  </div>
                </div>

                {/* Interest Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">{t("auto.contact.quote.subject")}</label>
                  <div className="flex gap-4 font-googleSans text-sm text-theme-text">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="interestType"
                        checked={interestType === "product"}
                        onChange={() => setInterestType("product")}
                        className="accent-theme-accent"
                      />{t("auto.contact.machinery.model")}</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="interestType"
                        checked={interestType === "attachment"}
                        onChange={() => setInterestType("attachment")}
                        className="accent-theme-accent"
                      />{t("auto.contact.attachments.only")}</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="interestType"
                        checked={interestType === "general"}
                        onChange={() => setInterestType("general")}
                        className="accent-theme-accent"
                      />{t("auto.contact.general.inquiries")}</label>
                  </div>
                </div>

                {/* Model Interest Selector */}
                {interestType !== "general" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">
                      {interestType === "product" ? t("contact.form.selectModel", { fallback: "Select Machinery Model" }) : t("auto.contact.select.attachment.of")}
                    </label>
                    <select
                      value={modelInterest}
                      onChange={(e) => setModelInterest(e.target.value)}
                      className="border-2 border-theme-border/20 focus:border-theme-accent p-3 font-googleSans text-sm focus:outline-none rounded bg-theme-card text-theme-text transition-colors"
                    >
                      <option value="" className="bg-theme-card text-theme-text">{t("auto.contact.choose.option")}</option>
                      {interestType === "product" ? (
                        products
                          .filter((p) => p.category !== "attachments")
                          .map((p) => (
                            <option key={p.id} value={p.id} className="bg-theme-card text-theme-text">
                              {p.name}
                            </option>
                          ))
                      ) : (
                        <>
                          <option value="auger-drive" className="bg-theme-card text-theme-text">{t("auto.contact.planetary.auger.drive")}</option>
                          <option value="excavator-thumb" className="bg-theme-card text-theme-text">{t("auto.contact.hydraulic.thumb")}</option>
                          <option value="concrete-breaker" className="bg-theme-card text-theme-text">{t("auto.contact.hydraulic.hammer.breaker")}</option>
                          <option value="skeleton-bucket" className="bg-theme-card text-theme-text">{t("auto.contact.skeleton.aggregates.bucket")}</option>
                          <option value="attachments" className="bg-theme-card text-theme-text">{t("auto.contact.generic.quick.attach")}</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                {/* Project notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted font-googleSans">{t("auto.contact.worksite.parameters.logistics")}</label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border-2 border-theme-border/20 focus:border-theme-accent p-3 font-googleSans text-sm focus:outline-none rounded bg-theme-card text-theme-text transition-colors"
                    placeholder={t("auto.contact.tell.us.about")}
                  />
                </div>

                {error && (
                  <p className="text-sm font-googleSans text-red-400 bg-red-950/20 border border-red-500/30 rounded p-3 text-center">
                    {t("contact.form.error", { fallback: "Sorry, your message couldn't be sent. Please try again, or email us directly at support@konstructz.com." })}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-googleSans font-bold text-sm uppercase tracking-wider px-7 py-4 transition-colors duration-300 border-2 border-brand-green hover:border-brand-greenDark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? t("contact.form.submitting", { fallback: "Sending…" })
                    : t("auto.contact.submit.quote.request")}
                  <span className="w-4 h-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Contact info & Maps */}
          <div className="lg:col-span-5 space-y-8">
            {/* Call Direct banner */}
            <div className="bg-brand-greenDark text-brand-sand border-2 border-brand-sand/30 p-8 rounded-lg space-y-4 shadow-md text-center">
              <span className="text-5xl block">📞</span>
              <h2 className="text-2xl font-heading uppercase tracking-wider text-white">{t("auto.contact.direct.line")}</h2>
              <p className="text-brand-beige/85 font-glonimove text-sm leading-relaxed">{t("auto.contact.connect.directly.with")}</p>
              <a
                href="tel:+12132142203"
                className="inline-block bg-brand-sand text-brand-dark px-6 py-3 font-googleSans font-bold text-sm tracking-wider hover:bg-white hover:text-brand-green transition-colors uppercase"
              >
                +1 213-214-2203
              </a>
            </div>

            {/* Warehouse hours / locations */}
            <div className="bg-theme-card border border-theme-border/10 rounded-lg p-6 space-y-4 transition-colors duration-200">
              <h3 className="font-heading text-xl uppercase tracking-wider text-theme-heading border-b border-theme-border/20 pb-2">{t("auto.contact.depot.location")}</h3>
              <p className="font-glonimove text-sm text-theme-text leading-relaxed">
                <strong className="text-theme-accent">{t("contact.warehouseAddress", { fallback: "Warehouse Address:" })}</strong>
                <br /><span className="text-theme-muted">{t("auto.contact.commerce.california.usa")}</span></p>
              <p className="font-glonimove text-sm text-theme-text leading-relaxed">
                <strong className="text-theme-accent">{t("contact.businessHours", { fallback: "Business Hours:" })}</strong>
                <br />
                <span className="text-theme-muted">
                  {t("contact.hours.weekday", { fallback: "Monday - Friday: 8:00 AM - 5:00 PM (PST)" })}
                  <br />
                  {t("contact.hours.weekend", { fallback: "Saturday & Sunday: Closed for field testing" })}
                </span>
              </p>
            </div>

            {/* Map visual */}
            <div className="relative rounded-lg overflow-hidden border border-theme-border/20 aspect-square max-w-[320px] mx-auto shadow-md">
              <img
                src="https://c.animaapp.com/9h31joeZ/img/a1ae787b-3532-4fdb-b941-933e9d0075b4-1.png"
                alt={t("auto.contact.commerce.ca.depot")}
                className="w-full h-full object-cover"
              />
              <img
                src="https://c.animaapp.com/9h31joeZ/img/a1ae787b-3532-4fdb-b941-933e9d0075b4--1--1@2x.png"
                alt="Map Pin"
                className="absolute top-1/2 left-1/3 w-10 h-11 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Contact;
