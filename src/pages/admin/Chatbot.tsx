import React, { useEffect, useState } from "react";
import { Card, Field, Toast, btnPrimary, btnGhost, inputCls } from "../../components/admin/ui";
import { getChatbotConfig, saveChatbotConfig, resetChatbotConfig, type ChatbotConfig } from "../../components/chat/knowledge";

export const AdminChatbot: React.FC = () => {
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setConfig(getChatbotConfig());
  }, []);

  const handleChange = (key: keyof ChatbotConfig, value: string) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = () => {
    if (!config) return;
    saveChatbotConfig(config);
    setToast("Chatbot settings saved successfully.");
    setTimeout(() => setToast(null), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all chatbot settings to default?")) {
      const reset = resetChatbotConfig();
      setConfig(reset);
      setToast("Chatbot settings reset to defaults.");
      setTimeout(() => setToast(null), 2500);
    }
  };

  if (!config) return null;

  return (
    <div>
      <h1 className="font-clofieBold text-3xl md:text-4xl text-theme-heading mb-2">
        Chatbot Config
      </h1>
      <p className="font-glonimove text-sm text-theme-muted mb-8">
        Manage and edit static chatbot knowledge, support notes, product categories, and quick prompts without modifying source code.
      </p>

      <Card className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Company Description" hint="How the company describes its core services and inventory.">
            <textarea
              className={`${inputCls} w-full`}
              rows={3}
              value={config.companyDescription}
              onChange={(e) => handleChange("companyDescription", e.target.value)}
            />
          </Field>

          <Field label="Product Categories" hint="Comma-separated list of categories the chatbot sells.">
            <input
              type="text"
              className={`${inputCls} w-full`}
              value={config.productCategories}
              onChange={(e) => handleChange("productCategories", e.target.value)}
            />
          </Field>

          <Field label="Warranty Text" hint="Explanation of warranty terms (keep phrase: 1-year warranty + lifetime technical support).">
            <textarea
              className={`${inputCls} w-full`}
              rows={3}
              value={config.warrantyText}
              onChange={(e) => handleChange("warrantyText", e.target.value)}
            />
          </Field>

          <Field label="Lifetime Support Text" hint="Details regarding lifetime operational assistance.">
            <textarea
              className={`${inputCls} w-full`}
              rows={3}
              value={config.lifetimeSupportText}
              onChange={(e) => handleChange("lifetimeSupportText", e.target.value)}
            />
          </Field>

          <Field label="Shipping Notes" hint="Information about delivery areas, methods, and unloading requirements.">
            <textarea
              className={`${inputCls} w-full`}
              rows={3}
              value={config.shippingNotes}
              onChange={(e) => handleChange("shippingNotes", e.target.value)}
            />
          </Field>

          <Field label="Financing Notes" hint="Highlights of leasing, credit check types, and partners.">
            <textarea
              className={`${inputCls} w-full`}
              rows={3}
              value={config.financingNotes}
              onChange={(e) => handleChange("financingNotes", e.target.value)}
            />
          </Field>

          <Field label="Return Notes" hint="Detailing the 30-day window, conditions, and customer freight costs.">
            <textarea
              className={`${inputCls} w-full`}
              rows={3}
              value={config.returnNotes}
              onChange={(e) => handleChange("returnNotes", e.target.value)}
            />
          </Field>

          <Field label="Safety Disclaimers" hint="Displayed on operator tips or caution alerts.">
            <textarea
              className={`${inputCls} w-full`}
              rows={3}
              value={config.safetyDisclaimer}
              onChange={(e) => handleChange("safetyDisclaimer", e.target.value)}
            />
          </Field>

          <Field label="Contact Email">
            <input
              type="email"
              className={`${inputCls} w-full`}
              value={config.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
            />
          </Field>

          <Field label="Contact Phone">
            <input
              type="text"
              className={`${inputCls} w-full`}
              value={config.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Suggested Questions" hint="One suggested question per line. These display as quick-prompt cards on the welcome screen.">
          <textarea
            className={`${inputCls} w-full`}
            rows={5}
            value={config.suggestedQuestions}
            onChange={(e) => handleChange("suggestedQuestions", e.target.value)}
          />
        </Field>

        <div className="flex items-center gap-3 pt-4 border-t border-theme-border/20">
          <button type="button" onClick={handleSave} className={btnPrimary}>
            Save Changes
          </button>
          <button type="button" onClick={handleReset} className={btnGhost}>
            Reset Defaults
          </button>
        </div>
      </Card>

      {toast && <Toast message={toast} />}
    </div>
  );
};

export default AdminChatbot;
