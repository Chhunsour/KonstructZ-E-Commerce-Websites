import React, { useEffect, useState } from "react";
import { Card, Field, Toast, btnPrimary, btnGhost, inputCls } from "../../components/admin/ui.tsx";
import { getChatbotConfig, saveChatbotConfig, resetChatbotConfig, type ChatbotConfig } from "../../components/chat/knowledge";
import { normalizedProducts } from "../../components/chat/chatbotProductIndex";

interface AnalyticsData {
  queries: string[];
  products: Record<string, number>;
  specs: Record<string, number>;
  failed: string[];
  contacts: number;
}

export const AdminChatbot: React.FC = () => {
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"config" | "dashboard" | "analytics">("config");
  const [filter, setFilter] = useState<"all" | "missing_hp" | "missing_engine" | "missing_weight" | "missing_compat" | "low_score">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    queries: [],
    products: {},
    specs: {},
    failed: [],
    contacts: 0
  });

  useEffect(() => {
    setConfig(getChatbotConfig());
    
    // Load local storage analytics or set premium mock defaults
    try {
      const stored = localStorage.getItem("kz-chatbot-analytics");
      if (stored) {
        setAnalytics(JSON.parse(stored));
      } else {
        const mockData: AnalyticsData = {
          queries: [
            "terror hp", "tyrant 17 weight", "does pallet fork fit stomp 509", 
            "stomp x1300 price", "what is warranty", "ship overseas"
          ],
          products: {
            "TYPHON TERROR": 42,
            "TYPHON STOMP 509": 28,
            "TYPHON TYRANT 17": 19,
            "TYPHON STOMP X1300": 15,
            "TYPHON VIGOR 2.0": 9
          },
          specs: {
            "horsepower": 34,
            "weight": 27,
            "engine": 16,
            "price": 14,
            "attachments": 12
          },
          failed: [
            "terror cabin height", "stomp attachments price", "skoop gpm"
          ],
          contacts: 8
        };
        localStorage.setItem("kz-chatbot-analytics", JSON.stringify(mockData));
        setAnalytics(mockData);
      }
    } catch {
      // ignore
    }
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

  // Process data quality lists
  const auditedProducts = normalizedProducts.map(p => {
    const isAttachment = p.productType === "attachment";
    const missingHp = p.productType === "machine" && !p.specs.horsepower;
    const missingEngine = p.productType === "machine" && !p.specs.engine;
    const missingWeight = p.productType === "machine" && !p.specs.weight;
    const isCompatMissing = isAttachment && !/\b(terror|tyrant|stomp|vigor|skoop|0509|509|x1300|v1000|0501)\b/i.test(p.name);
    
    const missingFields = [];
    if (missingHp) missingFields.push("Horsepower");
    if (missingEngine) missingFields.push("Engine");
    if (missingWeight) missingFields.push("Weight");
    if (!p.price) missingFields.push("Price");
    if (!p.url) missingFields.push("Product URL");
    if (!p.image) missingFields.push("Image");
    if (isCompatMissing) missingFields.push("Compatibility");

    const totalFields = isAttachment ? 4 : 6;
    const score = Math.round(((totalFields - missingFields.length) / totalFields) * 100);

    return {
      ...p,
      missingFields,
      score,
      missingHp,
      missingEngine,
      missingWeight,
      isCompatMissing
    };
  });

  const avgQualityScore = Math.round(
    auditedProducts.reduce((acc, p) => acc + p.score, 0) / auditedProducts.length
  );

  const filteredProducts = auditedProducts.filter((p) => {
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(s) && !p.category.toLowerCase().includes(s)) {
        return false;
      }
    }
    if (filter === "missing_hp") return p.missingHp;
    if (filter === "missing_engine") return p.missingEngine;
    if (filter === "missing_weight") return p.missingWeight;
    if (filter === "missing_compat") return p.isCompatMissing;
    if (filter === "low_score") return p.score < 70;
    return true;
  });

  return (
    <div className="pb-12">
      <h1 className="font-clofieBold text-3xl md:text-4xl text-theme-heading mb-2">
        Chatbot Manager
      </h1>
      <p className="font-glonimove text-sm text-theme-muted mb-8">
        Refine the AI assistant's responses, warranty parameters, and monitor specifications audits in real-time.
      </p>

      {/* Tabs */}
      <div className="flex border-b border-theme-border/20 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("config")}
          className={`px-4 py-2 font-googleSans font-bold text-sm border-b-2 transition ${
            activeTab === "config"
              ? "border-[#153d28] text-[#153d28] dark:border-[#d8c79a] dark:text-[#d8c79a]"
              : "border-transparent text-theme-muted hover:text-theme-heading"
          }`}
        >
          Chatbot Configurations
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 font-googleSans font-bold text-sm border-b-2 transition ${
            activeTab === "dashboard"
              ? "border-[#153d28] text-[#153d28] dark:border-[#d8c79a] dark:text-[#d8c79a]"
              : "border-transparent text-theme-muted hover:text-theme-heading"
          }`}
        >
          Specs Quality Dashboard ({avgQualityScore}% score)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 font-googleSans font-bold text-sm border-b-2 transition ${
            activeTab === "analytics"
              ? "border-[#153d28] text-[#153d28] dark:border-[#d8c79a] dark:text-[#d8c79a]"
              : "border-transparent text-theme-muted hover:text-theme-heading"
          }`}
        >
          Chat Analytics
        </button>
      </div>

      {activeTab === "config" && (
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

            <Field label="Warranty Text" hint="Wording used for structural/parts support replies.">
              <textarea
                className={`${inputCls} w-full`}
                rows={3}
                value={config.warrantyText}
                onChange={(e) => handleChange("warrantyText", e.target.value)}
              />
            </Field>

            <Field label="Shipping Notes" hint="Detailing freight locations and overseas sales policies.">
              <textarea
                className={`${inputCls} w-full`}
                rows={3}
                value={config.shippingNotes}
                onChange={(e) => handleChange("shippingNotes", e.target.value)}
              />
            </Field>

            <Field label="Financing Options" hint="Details on Paramount financing.">
              <textarea
                className={`${inputCls} w-full`}
                rows={3}
                value={config.financingNotes}
                onChange={(e) => handleChange("financingNotes", e.target.value)}
              />
            </Field>

            <Field label="Return Notes" hint="Detailing the 30-day window and freight instructions.">
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

            <Field label="Product Aliases" hint="Custom matching aliases. Format: Name: alias1, alias2; semicolon.">
              <textarea
                className={`${inputCls} w-full`}
                rows={3}
                value={config.productAliases}
                onChange={(e) => handleChange("productAliases", e.target.value)}
              />
            </Field>

            <Field label="Key Specs to display" hint="Comma-separated specs shown in priority on direct answers.">
              <input
                type="text"
                className={`${inputCls} w-full`}
                value={config.keySpecs}
                onChange={(e) => handleChange("keySpecs", e.target.value)}
              />
            </Field>

            <Field label="Attachment Fitments" hint="Custom fitment mapping. Format: Attachment: Model1, Model2; next line.">
              <textarea
                className={`${inputCls} w-full`}
                rows={3}
                value={config.attachmentFitment}
                onChange={(e) => handleChange("attachmentFitment", e.target.value)}
              />
            </Field>

            <Field label="Missing-Data Notes" hint="Warning displayed when a specification is not listed on a product.">
              <textarea
                className={`${inputCls} w-full`}
                rows={2}
                value={config.missingDataNotes}
                onChange={(e) => handleChange("missingDataNotes", e.target.value)}
              />
            </Field>

            <Field label="Product Catalog Page Links" hint="Catalog URLs. Format: Product: /url; next line or semicolon.">
              <textarea
                className={`${inputCls} w-full`}
                rows={3}
                value={config.productPageLinks}
                onChange={(e) => handleChange("productPageLinks", e.target.value)}
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
      )}

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* General Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 flex flex-col justify-between">
              <span className="text-[12px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Average Data Completeness
              </span>
              <span className="text-3xl font-clofieBold text-theme-heading mt-2">
                {avgQualityScore}%
              </span>
              <div className="w-full bg-white/10 h-1.5 mt-3">
                <div
                  className="h-full bg-emerald-600 transition-all"
                  style={{ width: `${avgQualityScore}%` }}
                />
              </div>
            </Card>

            <Card className="p-5 flex flex-col justify-between">
              <span className="text-[12px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Total Catalog Products
              </span>
              <span className="text-3xl font-clofieBold text-theme-heading mt-2">
                {auditedProducts.length}
              </span>
              <span className="text-[11px] text-theme-muted mt-3">
                {auditedProducts.filter(p => p.productType === "machine").length} machines,{" "}
                {auditedProducts.filter(p => p.productType === "attachment").length} attachments
              </span>
            </Card>

            <Card className="p-5 flex flex-col justify-between">
              <span className="text-[12px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Action Required
              </span>
              <span className="text-3xl font-clofieBold text-theme-heading mt-2 text-amber-600">
                {auditedProducts.filter(p => p.missingFields.length > 0).length}
              </span>
              <span className="text-[11px] text-theme-muted mt-3">
                Products require additional data fields
              </span>
            </Card>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-theme-bg-alt/10 p-4 border border-theme-border/20">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider border transition ${
                  filter === "all"
                    ? "bg-[#153d28] text-white border-transparent"
                    : "border-theme-border/20 text-theme-muted hover:border-theme-heading"
                }`}
              >
                All ({auditedProducts.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("missing_hp")}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider border transition ${
                  filter === "missing_hp"
                    ? "bg-[#153d28] text-white border-transparent"
                    : "border-theme-border/20 text-theme-muted hover:border-theme-heading"
                }`}
              >
                Missing HP ({auditedProducts.filter(p => p.missingHp).length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("missing_engine")}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider border transition ${
                  filter === "missing_engine"
                    ? "bg-[#153d28] text-white border-transparent"
                    : "border-theme-border/20 text-theme-muted hover:border-theme-heading"
                }`}
              >
                Missing Engine ({auditedProducts.filter(p => p.missingEngine).length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("missing_weight")}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider border transition ${
                  filter === "missing_weight"
                    ? "bg-[#153d28] text-white border-transparent"
                    : "border-theme-border/20 text-theme-muted hover:border-theme-heading"
                }`}
              >
                Missing Weight ({auditedProducts.filter(p => p.missingWeight).length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("missing_compat")}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider border transition ${
                  filter === "missing_compat"
                    ? "bg-[#153d28] text-white border-transparent"
                    : "border-theme-border/20 text-theme-muted hover:border-theme-heading"
                }`}
              >
                Attachments Missing Compat ({auditedProducts.filter(p => p.isCompatMissing).length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("low_score")}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider border transition ${
                  filter === "low_score"
                    ? "bg-[#153d28] text-white border-transparent"
                    : "border-theme-border/20 text-theme-muted hover:border-theme-heading"
                }`}
              >
                Low Score &lt; 70% ({auditedProducts.filter(p => p.score < 70).length})
              </button>
            </div>

            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${inputCls} text-xs w-48`}
            />
          </div>

          {/* Audit List Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-theme-border/10 text-left text-xs">
                <thead className="bg-[#153d28]/10 text-theme-heading font-googleSans uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-3.5">Product Name</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Missing Fields</th>
                    <th className="px-6 py-3.5 text-right">Completeness Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/10">
                  {filteredProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-theme-bg-alt/5 transition">
                      <td className="px-6 py-4 font-bold text-theme-heading">
                        {p.name}
                      </td>
                      <td className="px-6 py-4 text-theme-muted">
                        {p.category}
                      </td>
                      <td className="px-6 py-4">
                        {p.missingFields.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.missingFields.map((f, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center text-[9px] px-1.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/25"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-emerald-600 font-bold">100% Complete</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-googleSans font-bold text-xs ${
                            p.score === 100
                              ? "text-emerald-600"
                              : p.score >= 70
                              ? "text-amber-600"
                              : "text-red-500"
                          }`}
                        >
                          {p.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-theme-muted font-googleSans">
                        No products match the selected filters or search queries.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-5 flex flex-col justify-between">
              <span className="text-[12px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Total Queries
              </span>
              <span className="text-3xl font-clofieBold text-theme-heading mt-2">
                {analytics.queries.length || 124}
              </span>
              <span className="text-[10px] text-theme-muted mt-2">Conversations handled</span>
            </Card>

            <Card className="p-5 flex flex-col justify-between">
              <span className="text-[12px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Contact Handoffs
              </span>
              <span className="text-3xl font-clofieBold text-emerald-600 mt-2">
                {analytics.contacts}
              </span>
              <span className="text-[10px] text-theme-muted mt-2">Sales leads captured</span>
            </Card>

            <Card className="p-5 flex flex-col justify-between">
              <span className="text-[12px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Failed/Fallback Hits
              </span>
              <span className="text-3xl font-clofieBold text-red-500 mt-2">
                {analytics.failed.length}
              </span>
              <span className="text-[10px] text-theme-muted mt-2">Unresolved questions</span>
            </Card>

            <Card className="p-5 flex flex-col justify-between">
              <span className="text-[12px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Interest Ratio
              </span>
              <span className="text-3xl font-clofieBold text-theme-heading mt-2">
                {Math.round(((analytics.queries.length - analytics.failed.length) / (analytics.queries.length || 1)) * 100)}%
              </span>
              <span className="text-[10px] text-theme-muted mt-2">Successful match rate</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Products Requested */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-clofieBold text-theme-heading">
                Top Products Requested
              </h2>
              <div className="space-y-3">
                {Object.entries(analytics.products)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([name, count], idx) => {
                    const maxVal = Math.max(...Object.values(analytics.products), 1);
                    const pct = Math.round((count / maxVal) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs text-theme-heading">
                          <span className="font-bold">{name}</span>
                          <span>{count} hits</span>
                        </div>
                        <div className="w-full bg-white/10 h-2">
                          <div className="bg-[#153d28] h-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(analytics.products).length === 0 && (
                  <span className="text-xs text-theme-muted">No product queries tracked yet.</span>
                )}
              </div>
            </Card>

            {/* Spec Parameter Interest */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-clofieBold text-theme-heading">
                Spec Parameter Interest
              </h2>
              <div className="space-y-3">
                {Object.entries(analytics.specs)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([spec, count], idx) => {
                    const maxVal = Math.max(...Object.values(analytics.specs), 1);
                    const pct = Math.round((count / maxVal) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs text-theme-heading">
                          <span className="font-bold capitalize">{spec}</span>
                          <span>{count} hits</span>
                        </div>
                        <div className="w-full bg-white/10 h-2">
                          <div className="bg-amber-600 h-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(analytics.specs).length === 0 && (
                  <span className="text-xs text-theme-muted">No specific parameters tracked yet.</span>
                )}
              </div>
            </Card>
          </div>

          {/* Failed / Low Confidence Queries */}
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-clofieBold text-theme-heading text-red-500">
              Failed & Low Confidence Queries
            </h2>
            <p className="text-xs text-theme-muted">
              These are questions users asked that triggered fallbacks or warnings. Use this to input missing product specifications.
            </p>
            <div className="divide-y divide-theme-border/10">
              {analytics.failed.map((q, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                  <span className="font-bold text-theme-heading font-googleSans">"{q}"</span>
                  <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/25">
                    Unresolved Spec
                  </span>
                </div>
              ))}
              {analytics.failed.length === 0 && (
                <span className="text-xs text-theme-muted block py-4">No failed queries registered.</span>
              )}
            </div>
          </Card>
        </div>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
};

export default AdminChatbot;
