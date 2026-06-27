import React, { useEffect, useState } from "react";
import { Card, Field, Toast, btnPrimary, btnGhost, inputCls } from "../../components/admin/ui.tsx";
import { 
  getChatbotConfig, 
  saveChatbotConfig, 
  resetChatbotConfig, 
  type ChatbotConfig,
  refreshKnowledgeBase,
  getFailedQueryLogs,
  getMergedProducts,
  type FailedQueryLog,
  getFeedbackLogs,
  type UserFeedbackLog
} from "../../components/chat/knowledge";
import { 
  getSpecValAndConfidence, 
  normalizeSpecValue, 
  getSimilarityScore 
} from "../../components/chat/engine";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const [activeTab, setActiveTab] = useState<"config" | "editor" | "dashboard" | "analytics" | "queue">("config");
  
  // Quality filters
  const [showHpMissing, setShowHpMissing] = useState(false);
  const [showEngineMissing, setShowEngineMissing] = useState(false);
  const [showWeightMissing, setShowWeightMissing] = useState(false);
  const [showPriceMissing, setShowPriceMissing] = useState(false);
  const [showCompatMissing, setShowCompatMissing] = useState(false);
  const [showLowQuality, setShowLowQuality] = useState(false);
  const [showDuplicateNames, setShowDuplicateNames] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Editor State
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [editAliases, setEditAliases] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editHp, setEditHp] = useState("");
  const [editEngine, setEditEngine] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editLiftCap, setEditLiftCap] = useState("");
  const [editDigDepth, setEditDigDepth] = useState("");
  const [editTagline, setEditTagline] = useState("");
  const [editUseCases, setEditUseCases] = useState("");
  const [editFeatures, setEditFeatures] = useState("");
  const [editCompat, setEditCompat] = useState("");
  const [editVerified, setEditVerified] = useState(false);
  const [editQuestions, setEditQuestions] = useState("");
  const [previewMode, setPreviewMode] = useState<"summary" | "key" | "full" | "desc">("summary");

  // Analytics & Logs
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    queries: [],
    products: {},
    specs: {},
    failed: [],
    contacts: 0
  });
  const [failedLogs, setFailedLogs] = useState<FailedQueryLog[]>([]);
  const [feedbackLogs, setFeedbackLogs] = useState<UserFeedbackLog[]>([]);

  // Metadata Version info
  const [scanTime, setScanTime] = useState("");
  useEffect(() => {
    setConfig(getChatbotConfig());
    setFailedLogs(getFailedQueryLogs());
    setFeedbackLogs(getFeedbackLogs());
    setScanTime(new Date().toLocaleString());
    
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
  }, [activeTab]);

  const handleChange = (key: keyof ChatbotConfig, value: string) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = () => {
    if (!config) return;
    saveChatbotConfig(config);
    setToast("Chatbot configurations saved successfully.");
    setTimeout(() => setToast(null), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all chatbot settings to default?")) {
      const reset = resetChatbotConfig();
      setConfig(reset);
      setToast("Chatbot configurations reset to defaults.");
      setTimeout(() => setToast(null), 2500);
    }
  };

  // Merge catalogs to calculate quality scores
  const { baseProducts, baseTyphonProducts } = getMergedProducts();
  const allMerged = [
    ...baseProducts.map(p => ({
      id: p.id,
      name: p.name,
      category: p.categoryLabel,
      brand: "Konstructz",
      productType: "machine",
      horsepower: p.specs.find(s => /horsepower|hp/i.test(s.label))?.value || "",
      engine: p.specs.find(s => /engine/i.test(s.label))?.value || "",
      weight: p.weight || p.specs.find(s => /weight/i.test(s.label))?.value || "",
      price: p.price || "",
      url: p.url || "",
      image: p.image || "",
      tagline: p.tagline || "",
      bestUseCases: p.bestUseCases || [],
      keyFeatures: p.features || [],
      attachmentCompatibility: (p as any).attachmentCompatibility || [],
      verified: !!p.verified,
      suggestedQuestions: p.suggestedQuestions || [],
      specs: p.specs,
      raw: p
    })),
    ...baseTyphonProducts.map(p => ({
      id: p.id,
      name: p.name,
      category: p.categoryLabel,
      brand: "Typhon",
      productType: p.productType || "machine",
      horsepower: p.specs.find(s => /engine power|horsepower|hp/i.test(s.label))?.value || "",
      engine: p.specs.find(s => /engine model|engine/i.test(s.label))?.value || "",
      weight: p.specs.find(s => /weight class|weight/i.test(s.label))?.value || "",
      price: p.currentPrice || p.price || "",
      url: p.sourceUrl || p.buttonUrl || "",
      image: p.image || "",
      tagline: p.tagline || "",
      bestUseCases: p.applications || [],
      keyFeatures: p.features || [],
      attachmentCompatibility: (p as any).attachmentCompatibility || [],
      verified: !!p.verified,
      suggestedQuestions: p.suggestedQuestions || [],
      specs: p.specs,
      raw: p
    }))
  ];

  // Map of names to find duplicates
  const nameCounts: Record<string, number> = {};
  for (const p of allMerged) {
    nameCounts[p.name.toLowerCase()] = (nameCounts[p.name.toLowerCase()] || 0) + 1;
  }

  // Calculate missing parameters for quality reports
  const auditedProducts = allMerged.map(p => {
    const isAttachment = p.productType === "attachment";
    
    const missingHp = p.productType === "machine" && (!p.horsepower || p.horsepower === "Not listed");
    const missingEngine = p.productType === "machine" && (!p.engine || p.engine === "Not listed");
    const missingWeight = p.productType === "machine" && (!p.weight || p.weight === "Not listed");
    const missingPrice = !p.price || p.price === "Not listed";
    const missingUrl = !p.url || p.url === "Not listed";
    const missingImage = !p.image;
    const missingSummary = !p.tagline;
    const missingBestUse = p.bestUseCases.length === 0;
    
    const isCompatMissing = isAttachment && p.attachmentCompatibility.length === 0 && !/\b(terror|tyrant|stomp|vigor|skoop|0509|509|x1300|v1000|0501)\b/i.test(p.name);

    const missingFields = [];
    if (missingHp) missingFields.push("Horsepower");
    if (missingEngine) missingFields.push("Engine");
    if (missingWeight) missingFields.push("Weight");
    if (missingPrice) missingFields.push("Price");
    if (missingUrl) missingFields.push("Product URL");
    if (missingImage) missingFields.push("Image");
    if (missingSummary) missingFields.push("Summary");
    if (missingBestUse) missingFields.push("Best Use Cases");
    if (isCompatMissing) missingFields.push("Compatibility");

    const totalCheck = 9;
    const score = Math.round(((totalCheck - missingFields.length) / totalCheck) * 100);
    const isDuplicate = nameCounts[p.name.toLowerCase()] > 1;

    // Direct check for conflict specs
    const hpTrace = getSpecValAndConfidence(p.raw, "Horsepower");
    const weightTrace = getSpecValAndConfidence(p.raw, "Weight");
    const hasConflict = !!(hpTrace.warning || weightTrace.warning);
    const conflictMessage = hpTrace.warning || weightTrace.warning || "";

    return {
      ...p,
      missingFields,
      score,
      missingHp,
      missingEngine,
      missingWeight,
      missingPrice,
      isCompatMissing,
      missingUrl,
      missingImage,
      missingSummary,
      missingBestUse,
      isDuplicate,
      hasConflict,
      conflictMessage
    };
  });

  const avgQualityScore = Math.round(
    auditedProducts.reduce((acc, p) => acc + p.score, 0) / (auditedProducts.length || 1)
  );

  // Apply filters on Quality Dashboard list
  const filteredProducts = auditedProducts.filter((p) => {
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(s) && !p.category.toLowerCase().includes(s)) {
        return false;
      }
    }
    if (showHpMissing && !p.missingHp) return false;
    if (showEngineMissing && !p.missingEngine) return false;
    if (showWeightMissing && !p.missingWeight) return false;
    if (showPriceMissing && !p.missingPrice) return false;
    if (showCompatMissing && !p.isCompatMissing) return false;
    if (showLowQuality && p.score >= 70) return false;
    if (showDuplicateNames && !p.isDuplicate) return false;
    return true;
  });

  // Total specs count in system
  const totalSpecsIndexed = auditedProducts.reduce((acc, p) => acc + p.specs.length, 0);

  // Handle product editor selection
  const handleSelectProduct = (id: string) => {
    const prod = allMerged.find(p => p.id === id);
    if (!prod) return;
    
    setSelectedProductId(id);
    setEditAliases((prod.raw.aliases || []).join(", "));
    setEditPrice(prod.price);
    setEditUrl(prod.url);
    setEditImage(prod.image);
    setEditHp(prod.horsepower);
    setEditEngine(prod.engine);
    setEditWeight(prod.weight);
    setEditLiftCap(prod.specs.find(s => /lift capacity|operating capacity/i.test(s.label))?.value || "");
    setEditDigDepth(prod.specs.find(s => /digging depth|dig depth/i.test(s.label))?.value || "");
    setEditTagline(prod.tagline);
    setEditUseCases(prod.bestUseCases.join(", "));
    setEditFeatures(prod.keyFeatures.join(", "));
    setEditCompat(prod.attachmentCompatibility.join(", "));
    setEditVerified(prod.verified);
    setEditQuestions((prod.suggestedQuestions || []).join("\n"));
  };

  const handleSaveProductKnowledge = () => {
    if (!selectedProductId) return;
    
    try {
      const customStoreKey = "kz-chatbot-products-custom";
      const customStore = JSON.parse(localStorage.getItem(customStoreKey) || "{}");
      
      customStore[selectedProductId] = {
        name: allMerged.find(p => p.id === selectedProductId)?.name,
        aliases: editAliases,
        price: editPrice,
        url: editUrl,
        image: editImage,
        verified: editVerified,
        tagline: editTagline,
        bestUseCases: editUseCases,
        keyFeatures: editFeatures,
        attachmentCompatibility: editCompat,
        suggestedQuestions: editQuestions,
        specs: {
          "Horsepower": editHp,
          "Engine Power": editHp,
          "Engine": editEngine,
          "Engine Model": editEngine,
          "Weight": editWeight,
          "Weight Class": editWeight,
          "Operating Weight": editWeight,
          "Lift Capacity": editLiftCap,
          "Operating Capacity": editLiftCap,
          "Digging Depth": editDigDepth,
          "Dig Depth": editDigDepth
        }
      };
      
      localStorage.setItem(customStoreKey, JSON.stringify(customStore));
      refreshKnowledgeBase();
      
      setToast("Product chatbot knowledge saved successfully.");
      setTimeout(() => setToast(null), 2500);
      
      setSelectedProductId(null);
    } catch (e) {
      console.error(e);
      alert("Error saving custom knowledge overrides.");
    }
  };

  // Generate live chatbot preview markdown in the editor tab
  const getPreviewMarkdown = (): string => {
    if (!selectedProductId) return "";
    
    const prod = allMerged.find(p => p.id === selectedProductId);
    if (!prod) return "";

    const name = prod.name;
    const category = prod.category;
    const bestFor = editUseCases.split(",")[0] || "General construction";
    const hp = editHp || "Not listed";
    const weight = editWeight || "Not listed";
    const engine = editEngine || "Not listed";
    
    if (previewMode === "summary") {
      let md = `### TYPHON ${name}\n\n`;
      md += `**Best for:** ${bestFor}\n\n`;
      md += `| Key Detail | Value |\n`;
      md += `| ------------ | ------- |\n`;
      md += `| Category | ${category} |\n`;
      md += `| Engine | ${engine} |\n`;
      md += `| Horsepower | ${hp} |\n`;
      md += `| Weight/Class | ${weight} |\n`;
      md += `| Main Use | ${editUseCases || "Not listed"} |\n\n`;
      md += `**Highlights:**\n\n`;
      const features = editFeatures ? editFeatures.split(",").slice(0, 3) : ["Robust reliability", "Auxiliary flow support", "Operator platform"];
      for (const f of features) {
        md += `* ${f.trim()}\n`;
      }
      md += `\n[1-Year Warranty] [Lifetime Technical Support]\n\n`;
      md += `**Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**`;
      return md;
    }
    
    if (previewMode === "key") {
      let md = `### TYPHON ${name} Key Specifications\n\n`;
      md += `| Specification | Value |\n`;
      md += `|---|---|\n`;
      md += `| Engine Model | ${engine} |\n`;
      md += `| Horsepower | ${hp} |\n`;
      md += `| Operating Weight | ${weight} |\n`;
      if (editLiftCap) md += `| Rated Lift Capacity | ${editLiftCap} |\n`;
      if (editDigDepth) md += `| Max Digging Depth | ${editDigDepth} |\n`;
      md += `\n**1-year warranty + lifetime technical support**\n\n`;
      md += `**Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**`;
      return md;
    }

    if (previewMode === "full") {
      let md = `### TYPHON ${name} Full Specifications\n\n`;
      md += `| Specification | Value |\n`;
      md += `|---|---|\n`;
      md += `| Category | ${category} |\n`;
      md += `| Engine Model | ${engine} |\n`;
      md += `| Horsepower | ${hp} |\n`;
      md += `| Operating Weight | ${weight} |\n`;
      if (editLiftCap) md += `| Lift Capacity | ${editLiftCap} |\n`;
      if (editDigDepth) md += `| Digging Depth | ${editDigDepth} |\n`;
      md += `| Price | ${editPrice || "Not listed"} |\n`;
      md += `| URL | ${editUrl || "Not listed"} |\n`;
      md += `\n**1-year warranty + lifetime technical support**\n\n`;
      md += `**Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**`;
      return md;
    }

    return `### TYPHON Machine Overview\n\n**TYPHON ${name}** is designed for **compact jobsite work**.\n\n**Best for:**\n* Small construction jobs\n* Property work\n* Landscaping\n* Farm or material handling\n* Tight work areas\n\n**Key details:**\n* Engine: ${engine}\n* Operating weight: ${weight}\n* Lift / digging / loading capacity: ${editLiftCap || editDigDepth || "Not listed"}\n* Attachments: ${editCompat || "Not listed"}\n\n**1-year warranty + lifetime technical support** is standard. **Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**`;
  };

  // Get diagnostic source trace for the editor preview pane
  const getProductSourceTrace = () => {
    if (!selectedProductId) return [];
    const prod = allMerged.find(p => p.id === selectedProductId);
    if (!prod) return [];

    return [
      { name: "Horsepower", ...getSpecValAndConfidence(prod.raw, "Horsepower") },
      { name: "Engine", ...getSpecValAndConfidence(prod.raw, "Engine") },
      { name: "Weight", ...getSpecValAndConfidence(prod.raw, "Weight") },
      { name: "Price", ...getSpecValAndConfidence(prod.raw, "Price") },
      { name: "Product URL", ...getSpecValAndConfidence(prod.raw, "Product URL") },
      { name: "Image", ...getSpecValAndConfidence(prod.raw, "Image") }
    ];
  };

  // Action methods on training queue logs
  const handleResolveLog = (idx: number, type: "failed" | "feedback") => {
    try {
      if (type === "failed") {
        const copy = [...failedLogs];
        copy.splice(idx, 1);
        setFailedLogs(copy);
        localStorage.setItem("kz-chatbot-failed-queries", JSON.stringify(copy));
      } else {
        const copy = [...feedbackLogs];
        copy.splice(idx, 1);
        setFeedbackLogs(copy);
        localStorage.setItem("kz-chatbot-user-feedback", JSON.stringify(copy));
      }
      setToast("Item marked as resolved.");
      setTimeout(() => setToast(null), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="pb-12">
      <h1 className="font-clofieBold text-3xl md:text-4xl text-theme-heading mb-2">
        Chatbot Manager
      </h1>
      <p className="font-glonimove text-sm text-theme-muted mb-8">
        Refine the AI assistant's responses, warranty parameters, customize specification overrides, and monitor data completeness quality.
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-theme-border/20 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("config")}
          className={`px-4 py-2 font-googleSans font-bold text-sm border-b-2 transition ${
            activeTab === "config"
              ? "border-[#153d28] text-[#153d28] dark:border-[#d8c79a] dark:text-[#d8c79a]"
              : "border-transparent text-theme-muted hover:text-theme-heading"
          }`}
        >
          Configurations
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("editor")}
          className={`px-4 py-2 font-googleSans font-bold text-sm border-b-2 transition ${
            activeTab === "editor"
              ? "border-[#153d28] text-[#153d28] dark:border-[#d8c79a] dark:text-[#d8c79a]"
              : "border-transparent text-theme-muted hover:text-theme-heading"
          }`}
        >
          Product Knowledge Editor
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
          Specs Quality Dashboard ({avgQualityScore}% avg)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 font-googleSans font-bold text-sm border-b-2 transition ${
            activeTab === "queue"
              ? "border-[#153d28] text-[#153d28] dark:border-[#d8c79a] dark:text-[#d8c79a]"
              : "border-transparent text-theme-muted hover:text-theme-heading"
          }`}
        >
          Training Queue ({failedLogs.length + feedbackLogs.filter(l => l.feedbackType === "missing_info").length})
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

      {/* CONFIGURATION TAB */}
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

      {/* PRODUCT KNOWLEDGE EDITOR TAB */}
      {activeTab === "editor" && (
        <div className="space-y-6">
          {!selectedProductId ? (
            <Card className="p-6">
              <h2 className="text-lg font-clofieBold text-theme-heading mb-4">Select Product to Edit</h2>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${inputCls} w-full max-w-md text-sm`}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                {allMerged
                  .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => handleSelectProduct(p.id)}
                      className="p-4 border border-theme-border/20 hover:border-theme-heading hover:bg-theme-bg-alt/5 cursor-pointer flex justify-between items-center transition"
                    >
                      <div>
                        <span className="font-bold text-theme-heading block text-sm">{p.name}</span>
                        <span className="text-[10px] text-theme-muted tracking-wider uppercase font-googleSans">{p.brand} ({p.category})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.verified && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 uppercase font-bold tracking-wider">Verified</span>
                        )}
                        <span className="text-xs font-bold text-theme-muted">&rarr;</span>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Form Editor */}
              <Card className="p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-theme-border/20 pb-3">
                  <div>
                    <h2 className="text-lg font-clofieBold text-theme-heading">
                      Edit Knowledge: {allMerged.find(p => p.id === selectedProductId)?.name}
                    </h2>
                    <span className="text-[11px] text-theme-muted">
                      Source brand: {allMerged.find(p => p.id === selectedProductId)?.brand}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setSelectedProductId(null)} 
                    className="text-xs border border-theme-border/20 px-2 py-1 hover:bg-white/5"
                  >
                    &larr; Back to list
                  </button>
                </div>

                <div className="flex items-center justify-between bg-theme-bg-alt/5 p-3 rounded">
                  <span className="text-xs font-bold text-theme-heading">Mark specifications data as Verified</span>
                  <input
                    type="checkbox"
                    checked={editVerified}
                    onChange={(e) => setEditVerified(e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-[#153d28]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Custom Aliases" hint="Comma-separated lowercase matching tags (e.g. terror, backhoe)">
                    <input
                      type="text"
                      className={`${inputCls} w-full text-xs`}
                      value={editAliases}
                      onChange={(e) => setEditAliases(e.target.value)}
                    />
                  </Field>
                  <Field label="Price Override" hint="Display price (e.g. $6,508.95)">
                    <input
                      type="text"
                      className={`${inputCls} w-full text-xs`}
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  </Field>
                  <Field label="Product URL Override">
                    <input
                      type="text"
                      className={`${inputCls} w-full text-xs`}
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                    />
                  </Field>
                  <Field label="Main Image URL">
                    <input
                      type="text"
                      className={`${inputCls} w-full text-xs`}
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                    />
                  </Field>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-[#d8c79a] mt-4 border-b border-theme-border/10 pb-1">
                  Core Specifications
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Engine Model">
                    <input
                      type="text"
                      className={`${inputCls} w-full text-xs`}
                      value={editEngine}
                      onChange={(e) => setEditEngine(e.target.value)}
                    />
                  </Field>
                  <Field label="Horsepower / Engine Power">
                    <input
                      type="text"
                      className={`${inputCls} w-full text-xs`}
                      value={editHp}
                      onChange={(e) => setEditHp(e.target.value)}
                    />
                  </Field>
                  <Field label="Operating Weight">
                    <input
                      type="text"
                      className={`${inputCls} w-full text-xs`}
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                    />
                  </Field>
                  <Field label="Lift / Loading Capacity">
                    <input
                      type="text"
                      className={`${inputCls} w-full text-xs`}
                      value={editLiftCap}
                      onChange={(e) => setEditLiftCap(e.target.value)}
                    />
                  </Field>
                  <Field label="Digging Depth">
                    <input
                      type="text"
                      className={`${inputCls} w-full text-xs`}
                      value={editDigDepth}
                      onChange={(e) => setEditDigDepth(e.target.value)}
                    />
                  </Field>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-[#d8c79a] mt-4 border-b border-theme-border/10 pb-1">
                  Chatbot Text Content
                </h3>

                <Field label="Short Summary/Tagline" hint="One-line description displayed on summary screens.">
                  <input
                    type="text"
                    className={`${inputCls} w-full text-xs`}
                    value={editTagline}
                    onChange={(e) => setEditTagline(e.target.value)}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Best Use Cases" hint="Comma-separated key jobs (e.g. landscaping, digging trench)">
                    <input
                      type="text"
                      className={`${inputCls} w-full text-xs`}
                      value={editUseCases}
                      onChange={(e) => setEditUseCases(e.target.value)}
                    />
                  </Field>
                  <Field label="Highlights / Key Features" hint="Comma-separated bullet points">
                    <input
                      type="text"
                      className={`${inputCls} w-full text-xs`}
                      value={editFeatures}
                      onChange={(e) => setEditFeatures(e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Attachment Compatibility" hint="Comma-separated attachments currently confirmed (e.g. Pallet Fork, Auger)">
                  <input
                    type="text"
                    className={`${inputCls} w-full text-xs`}
                    value={editCompat}
                    onChange={(e) => setEditCompat(e.target.value)}
                  />
                </Field>

                <Field label="Suggested Product-Specific Questions" hint="One question per line. Displayed as options when this product is viewed.">
                  <textarea
                    className={`${inputCls} w-full text-xs`}
                    rows={3}
                    value={editQuestions}
                    onChange={(e) => setEditQuestions(e.target.value)}
                  />
                </Field>

                <div className="flex items-center gap-3 pt-4 border-t border-theme-border/20">
                  <button type="button" onClick={handleSaveProductKnowledge} className={btnPrimary}>
                    Save Product Knowledge
                  </button>
                  <button type="button" onClick={() => setSelectedProductId(null)} className={btnGhost}>
                    Cancel
                  </button>
                </div>
              </Card>

              {/* Preview Pane & Source Trace */}
              <div className="space-y-4">
                <Card className="p-6 md:p-8 space-y-4 bg-theme-bg-alt/5 border border-theme-border/20">
                  <div className="flex items-center justify-between border-b border-theme-border/10 pb-3">
                    <h3 className="font-clofieBold text-theme-heading">Chatbot Live Preview</h3>
                    <div className="flex gap-1 text-[10px]">
                      <button 
                        type="button" 
                        onClick={() => setPreviewMode("summary")}
                        className={`px-2 py-0.5 border ${previewMode === "summary" ? "bg-[#153d28] text-white border-transparent" : "border-theme-border/10 text-theme-muted"}`}
                      >
                        Summary
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPreviewMode("key")}
                        className={`px-2 py-0.5 border ${previewMode === "key" ? "bg-[#153d28] text-white border-transparent" : "border-theme-border/10 text-theme-muted"}`}
                      >
                        Key Specs
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPreviewMode("full")}
                        className={`px-2 py-0.5 border ${previewMode === "full" ? "bg-[#153d28] text-white border-transparent" : "border-theme-border/10 text-theme-muted"}`}
                      >
                        Full Specs
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPreviewMode("desc")}
                        className={`px-2 py-0.5 border ${previewMode === "desc" ? "bg-[#153d28] text-white border-transparent" : "border-theme-border/10 text-theme-muted"}`}
                      >
                        Description
                      </button>
                    </div>
                  </div>
                  
                  {/* Rendering Mock Balloon */}
                  <div className="bg-[#1f2824] dark:bg-[#1a231f] border border-[#d8c79a]/20 p-5 font-googleSans text-xs text-white max-h-[400px] overflow-y-auto space-y-3 leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {getPreviewMarkdown()}
                    </ReactMarkdown>
                  </div>

                  <span className="text-[10px] text-theme-muted italic block border-b border-theme-border/10 pb-2">
                    * The pane above shows a live simulation of the chatbot output markdown string based on the form values.
                  </span>

                  {/* Diagnostic Source Trace Table */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-theme-heading font-googleSans uppercase tracking-wider text-[#d8c79a]">Diagnostic Spec Trace</h4>
                    <div className="overflow-x-auto border border-theme-border/10">
                      <table className="min-w-full text-left text-[11px] divide-y divide-theme-border/10">
                        <thead className="bg-white/5 text-theme-muted font-bold">
                          <tr>
                            <th className="p-2">Specification</th>
                            <th className="p-2">Current Value</th>
                            <th className="p-2">Trace Source</th>
                            <th className="p-2">Confidence</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-theme-border/10 text-white/90">
                          {getProductSourceTrace().map((trace, idx) => (
                            <tr key={idx} className="hover:bg-white/5">
                              <td className="p-2 font-semibold text-[#d8c79a]">{trace.name}</td>
                              <td className="p-2 font-mono">{trace.value || "N/A"}</td>
                              <td className="p-2 text-theme-muted">{trace.source}</td>
                              <td className="p-2">
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                  trace.confidence === "Verified" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                  trace.confidence === "Found in product data" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                                  trace.confidence === "Extracted from description" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                  trace.confidence === "Conflicting" ? "bg-red-500/10 text-red-500 border border-red-500/20 font-bold" :
                                  "bg-white/5 text-theme-muted"
                                }`}>
                                  {trace.confidence}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SPECS QUALITY DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* General Stats Card & Version Info */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Avg Quality
              </span>
              <span className="text-2xl font-clofieBold text-theme-heading mt-2">
                {avgQualityScore}%
              </span>
              <div className="w-full bg-white/10 h-1.5 mt-2">
                <div
                  className="h-full bg-emerald-600 transition-all"
                  style={{ width: `${avgQualityScore}%` }}
                />
              </div>
            </Card>

            <Card className="p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Total Products
              </span>
              <span className="text-2xl font-clofieBold text-theme-heading mt-2">
                {auditedProducts.length}
              </span>
              <span className="text-[9px] text-theme-muted mt-2 truncate">
                {auditedProducts.filter(p => p.productType === "machine").length} machines,{" "}
                {auditedProducts.filter(p => p.productType === "attachment").length} attachments
              </span>
            </Card>

            <Card className="p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Specs Indexed
              </span>
              <span className="text-2xl font-clofieBold text-theme-heading mt-2">
                {totalSpecsIndexed}
              </span>
              <span className="text-[9px] text-theme-muted mt-2">Total parameters in DB</span>
            </Card>

            <Card className="p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Conflicts / Warnings
              </span>
              <span className="text-2xl font-clofieBold text-red-500 mt-2">
                {auditedProducts.filter(p => p.hasConflict || p.isDuplicate).length}
              </span>
              <span className="text-[9px] text-theme-muted mt-2">Conflicting / Duplicate items</span>
            </Card>

            <Card className="p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider font-googleSans font-bold text-theme-muted">
                Knowledge Version
              </span>
              <span className="text-2xl font-clofieBold text-theme-heading mt-2">
                v3.2.1
              </span>
              <span className="text-[9px] text-theme-muted mt-2 truncate">Scan: {scanTime}</span>
            </Card>
          </div>

          {/* Advanced Checkbox Filters */}
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-theme-heading">Data Quality Audit Filters</h3>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <label className="flex items-center gap-2 text-xs text-theme-heading cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHpMissing}
                    onChange={(e) => setShowHpMissing(e.target.checked)}
                    className="w-4 h-4 rounded border-theme-border/20 accent-[#153d28]"
                  />
                  <span>Missing Horsepower</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-theme-heading cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEngineMissing}
                    onChange={(e) => setShowEngineMissing(e.target.checked)}
                    className="w-4 h-4 rounded border-theme-border/20 accent-[#153d28]"
                  />
                  <span>Missing Engine</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-theme-heading cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWeightMissing}
                    onChange={(e) => setShowWeightMissing(e.target.checked)}
                    className="w-4 h-4 rounded border-theme-border/20 accent-[#153d28]"
                  />
                  <span>Missing Weight</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-theme-heading cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPriceMissing}
                    onChange={(e) => setShowPriceMissing(e.target.checked)}
                    className="w-4 h-4 rounded border-theme-border/20 accent-[#153d28]"
                  />
                  <span>Missing Price</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-theme-heading cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCompatMissing}
                    onChange={(e) => setShowCompatMissing(e.target.checked)}
                    className="w-4 h-4 rounded border-theme-border/20 accent-[#153d28]"
                  />
                  <span>Missing Attachment Fitment</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-theme-heading cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLowQuality}
                    onChange={(e) => setShowLowQuality(e.target.checked)}
                    className="w-4 h-4 rounded border-theme-border/20 accent-[#153d28]"
                  />
                  <span>Low Quality Score (&lt; 70)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-theme-heading cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDuplicateNames}
                    onChange={(e) => setShowDuplicateNames(e.target.checked)}
                    className="w-4 h-4 rounded border-theme-border/20 accent-[#153d28]"
                  />
                  <span>Duplicate Names</span>
                </label>
              </div>

              <input
                type="text"
                placeholder="Quick name search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputCls} text-xs w-48`}
              />
            </div>
          </Card>

          {/* Audit List Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-theme-border/10 text-left text-xs">
                <thead className="bg-[#153d28]/10 text-theme-heading font-googleSans uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-3.5">Product Name</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Issues & Missing Fields</th>
                    <th className="px-6 py-3.5 text-center">Verification Status</th>
                    <th className="px-6 py-3.5 text-right">Quality Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/10">
                  {filteredProducts.map((p, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => {
                        setActiveTab("editor");
                        handleSelectProduct(p.id);
                      }}
                      className="hover:bg-theme-bg-alt/5 cursor-pointer transition"
                    >
                      <td className="px-6 py-4 font-bold text-theme-heading">
                        <div className="flex flex-col">
                          <span>{p.name}</span>
                          {p.isDuplicate && (
                            <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider mt-0.5">Duplicate model name</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-theme-muted">
                        {p.category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {p.hasConflict && (
                            <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/25 font-bold uppercase">
                              Spec Conflict Warning
                            </span>
                          )}
                          {p.missingFields.map((f, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center text-[9px] px-1.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/25"
                            >
                              {f}
                            </span>
                          ))}
                          {!p.hasConflict && p.missingFields.length === 0 && (
                            <span className="text-emerald-600 font-bold">100% Complete</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {p.verified ? (
                          <span className="inline-flex text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">Verified</span>
                        ) : (
                          <span className="inline-flex text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/5 text-theme-muted border border-theme-border/20">Pending</span>
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
                      <td colSpan={5} className="px-6 py-8 text-center text-theme-muted font-googleSans">
                        No products match the selected quality filters or search queries.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TRAINING QUEUE TAB */}
      {activeTab === "queue" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-clofieBold text-theme-heading mb-2">Chatbot Training Queue</h2>
            <p className="text-xs text-theme-muted">
              Analyze unresolved search queries and negative ratings directly. Select "Fix Spec" to update chatbot database values instantly.
            </p>
          </Card>

          {/* Unresolved / Failed Logs Queue */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-theme-heading text-[#d8c79a]">Failed & Unresolved Search Logs</h3>
            <div className="overflow-x-auto border border-theme-border/10">
              <table className="min-w-full divide-y divide-theme-border/10 text-left text-xs">
                <thead className="bg-[#153d28]/10 text-theme-heading font-googleSans uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">User Question</th>
                    <th className="px-4 py-3">Detected Intent</th>
                    <th className="px-4 py-3">Product Involved</th>
                    <th className="px-4 py-3">Missing Parameter</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/10 text-white/90">
                  {failedLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-theme-muted whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-theme-heading">
                        "{log.userQuestion}"
                      </td>
                      <td className="px-4 py-3 text-theme-muted">{log.detectedIntent}</td>
                      <td className="px-4 py-3 font-bold text-[#d8c79a]">{log.detectedProduct || "None"}</td>
                      <td className="px-4 py-3 text-red-500 font-medium">{log.missingSpec || "N/A"}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {log.detectedProduct && (
                          <button
                            type="button"
                            onClick={() => {
                              const found = allMerged.find(p => p.name.toLowerCase().includes(log.detectedProduct!.toLowerCase()) || log.detectedProduct!.toLowerCase().includes(p.name.toLowerCase()));
                              if (found) {
                                setActiveTab("editor");
                                handleSelectProduct(found.id);
                              }
                            }}
                            className="bg-[#153d28] border border-transparent px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-800 transition"
                          >
                            Fix Spec
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleResolveLog(idx, "failed")}
                          className="bg-white/5 border border-theme-border/20 px-2.5 py-1 text-[10px] text-theme-muted hover:border-white hover:text-white transition"
                        >
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))}
                  {failedLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-theme-muted">
                        No failed or weak queries currently logged in training queue.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* User Feedback & Rating Ratings */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-theme-heading text-[#d8c79a]">User Feedback Ratings</h3>
            <div className="overflow-x-auto border border-theme-border/10">
              <table className="min-w-full divide-y divide-theme-border/10 text-left text-xs">
                <thead className="bg-[#153d28]/10 text-theme-heading font-googleSans uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Helpfulness</th>
                    <th className="px-4 py-3">Detail Logs / Missing parameters</th>
                    <th className="px-4 py-3">Response Snippet</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/10 text-white/90">
                  {feedbackLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-theme-muted whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 font-bold uppercase tracking-wider text-[9px] ${
                          log.feedbackType === "helpful" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                          log.feedbackType === "not_helpful" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                          "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}>
                          {log.feedbackType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-theme-heading">
                        {log.details}
                      </td>
                      <td className="px-4 py-3 text-theme-muted truncate max-w-[200px]">
                        {log.answerText}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleResolveLog(idx, "feedback")}
                          className="bg-white/5 border border-theme-border/20 px-2.5 py-1 text-[10px] text-theme-muted hover:border-white hover:text-white transition"
                        >
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))}
                  {feedbackLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-theme-muted">
                        No user feedback ratings currently logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* CHAT ANALYTICS TAB */}
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
                {analytics.failed.length + failedLogs.filter(l => !l.success).length}
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
        </div>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
};

export default AdminChatbot;
