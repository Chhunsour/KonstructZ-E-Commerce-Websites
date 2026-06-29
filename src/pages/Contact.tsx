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
    <div className="bg-brand-beige/10 min-h-screen pt-32 pb-24 text-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-brand-green text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.contact.quote.support.center")}</span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide">{t("auto.contact.request.machinery.pricing")}</h1>
          <div className="w-16 h-1 bg-brand-green mx-auto my-2" />
          <p className="text-neutral-600 font-glonimove text-base leading-relaxed">{t("auto.contact.get.spec.catalogs")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-10 border border-brand-green/10 rounded-lg shadow-sm">
            {success ? (
              <div className="bg-brand-green/10 border-2 border-brand-green text-brand-greenDark p-6 rounded text-center space-y-4">
                <span className="text-4xl">✅</span>
                <h3 className="text-xl font-bold font-googleSans uppercase">{t("auto.contact.quote.request.submitted")}</h3>
                <p className="text-sm font-glonimove max-w-md mx-auto leading-relaxed">{t("auto.contact.thank.you.a")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-googleSans">
                      {t("contact.form.fullName", { fallback: "Full Name *" })}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-neutral-300 focus:border-brand-green p-3 font-googleSans text-sm focus:outline-none rounded"
                      placeholder={t("auto.contact.e.g.john")}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-googleSans">
                      {t("contact.form.emailAddress", { fallback: "Email Address *" })}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-neutral-300 focus:border-brand-green p-3 font-googleSans text-sm focus:outline-none rounded"
                      placeholder="johndoe@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-googleSans">
                      {t("contact.form.phoneNumber", { fallback: "Phone Number *" })}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-2 border-neutral-300 focus:border-brand-green p-3 font-googleSans text-sm focus:outline-none rounded"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Company */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-googleSans">{t("auto.contact.company.organization")}</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="border-2 border-neutral-300 focus:border-brand-green p-3 font-googleSans text-sm focus:outline-none rounded"
                      placeholder={t("auto.contact.e.g.heavy")}
                    />
                  </div>
                </div>

                {/* Interest Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-googleSans">{t("auto.contact.quote.subject")}</label>
                  <div className="flex gap-4 font-googleSans text-sm text-neutral-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="interestType"
                        checked={interestType === "product"}
                        onChange={() => setInterestType("product")}
                        className="accent-brand-green"
                      />{t("auto.contact.machinery.model")}</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="interestType"
                        checked={interestType === "attachment"}
                        onChange={() => setInterestType("attachment")}
                        className="accent-brand-green"
                      />{t("auto.contact.attachments.only")}</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="interestType"
                        checked={interestType === "general"}
                        onChange={() => setInterestType("general")}
                        className="accent-brand-green"
                      />{t("auto.contact.general.inquiries")}</label>
                  </div>
                </div>

                {/* Model Interest Selector */}
                {interestType !== "general" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-googleSans">
                      {interestType === "product" ? t("contact.form.selectModel", { fallback: "Select Machinery Model" }) : t("auto.contact.select.attachment.of")}
                    </label>
                    <select
                      value={modelInterest}
                      onChange={(e) => setModelInterest(e.target.value)}
                      className="border-2 border-neutral-300 focus:border-brand-green p-3 font-googleSans text-sm focus:outline-none rounded bg-white"
                    >
                      <option value="">{t("auto.contact.choose.option")}</option>
                      {interestType === "product" ? (
                        products
                          .filter((p) => p.category !== "attachments")
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))
                      ) : (
                        <>
                          <option value="auger-drive">{t("auto.contact.planetary.auger.drive")}</option>
                          <option value="excavator-thumb">{t("auto.contact.hydraulic.thumb")}</option>
                          <option value="concrete-breaker">{t("auto.contact.hydraulic.hammer.breaker")}</option>
                          <option value="skeleton-bucket">{t("auto.contact.skeleton.aggregates.bucket")}</option>
                          <option value="attachments">{t("auto.contact.generic.quick.attach")}</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                {/* Project notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-googleSans">{t("auto.contact.worksite.parameters.logistics")}</label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border-2 border-neutral-300 focus:border-brand-green p-3 font-googleSans text-sm focus:outline-none rounded"
                    placeholder={t("auto.contact.tell.us.about")}
                  />
                </div>

                {error && (
                  <p className="text-sm font-googleSans text-red-600 bg-red-50 border border-red-200 rounded p-3 text-center">
                    {t("contact.form.error", { fallback: "Sorry, your message couldn't be sent. Please try again, or email us directly at sales@konstructz.com." })}
                  </p>
                )}
                <Button type="submit" variant="filled" className="w-full" disabled={submitting}>
                  {submitting
                    ? t("contact.form.submitting", { fallback: "Sending…" })
                    : t("auto.contact.submit.quote.request")}
                </Button>
              </form>
            )}
          </div>

          {/* Right: Contact info & Maps */}
          <div className="lg:col-span-5 space-y-8">
            {/* Call Direct banner */}
            <div className="bg-brand-greenDark text-brand-sand border-2 border-brand-sand/30 p-8 rounded-lg space-y-4 shadow-md text-center">
              <span className="text-5xl block">📞</span>
              <h2 className="text-2xl font-heading uppercase tracking-wider">{t("auto.contact.direct.line")}</h2>
              <p className="text-brand-beige/85 font-glonimove text-sm leading-relaxed">{t("auto.contact.connect.directly.with")}</p>
              <a
                href="tel:+12132142203"
                className="inline-block bg-brand-sand text-brand-dark px-6 py-3 font-googleSans font-bold text-sm tracking-wider hover:bg-white hover:text-brand-green transition-colors uppercase"
              >
                +1 213-214-2203
              </a>
            </div>

            {/* Warehouse hours / locations */}
            <div className="bg-white border border-brand-green/10 rounded-lg p-6 space-y-4">
              <h3 className="font-heading text-xl uppercase tracking-wider text-brand-dark border-b pb-2">{t("auto.contact.depot.location")}</h3>
              <p className="font-glonimove text-sm text-neutral-600 leading-relaxed">
                <strong>{t("contact.warehouseAddress", { fallback: "Warehouse Address:" })}</strong>
                <br />{t("auto.contact.commerce.california.usa")}</p>
              <p className="font-glonimove text-sm text-neutral-600 leading-relaxed">
                <strong>{t("contact.businessHours", { fallback: "Business Hours:" })}</strong>
                <br />
                {t("contact.hours.weekday", { fallback: "Monday - Friday: 8:00 AM - 5:00 PM (PST)" })}
                <br />
                {t("contact.hours.weekend", { fallback: "Saturday & Sunday: Closed for field testing" })}
              </p>
            </div>

            {/* Map visual */}
            <div className="relative rounded-lg overflow-hidden border border-brand-green/20 aspect-square max-w-[320px] mx-auto">
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
