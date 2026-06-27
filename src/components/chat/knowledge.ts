// Konstructz assistant — knowledge base + lightweight retrieval (RAG-lite).
//
// Every answer is grounded in real site content. We build a document index at
// runtime from products, the Typhon catalog, categories, curated support/company
// facts, and live blog posts — so new products and posts become searchable with
// NO code changes. Retrieval is a small TF-IDF/BM25-style scorer (no server, no
// embeddings API), which is enough to surface the right documents to compose an
// answer from.

import { products, type Product } from "../../data/products";
import { typhonProducts } from "../../data/typhonProducts";
import { categories } from "../../data/categories";

/* ───────────────────────────── Contact ─────────────────────────────── */

export const CONTACT = {
  phone: "+12132142203",
  phoneDisplay: "+1 213-214-2203",
  email: "support@konstructz.com",
  whatsapp: "https://wa.me/12132142203",
};

/* ───────────────────────────── Types ───────────────────────────────── */

export type DocType = "product" | "category" | "support" | "company" | "blog";

export interface KBDoc {
  id: string;
  type: DocType;
  title: string;
  body: string;
  href?: string;
  category?: string; // category label
  brand?: "Konstructz" | "Typhon";
  spec?: string;
  image?: string;
  // precomputed
  tokens?: Record<string, number>;
}

export interface ProductRef {
  name: string;
  href: string;
  categoryLabel: string;
  brand: "Konstructz" | "Typhon";
  spec?: string;
  image?: string;
}

/* ───────────────────────────── Tokenizer ───────────────────────────── */

const STOP = new Set(
  "a an and are as at be by for from has have how i in is it its of on or our that the their them they this to was what when where which who will with you your we us can do does my me need want would should could about into over under more most than then there here".split(
    " "
  )
);

function tokenize(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9.\s-]/g, " ")
    .split(/[\s-]+/)
    .map((w) => w.replace(/(?:'s|s)$/, "").trim()) // crude singularize
    .filter((w) => w.length >= 2 && !STOP.has(w));
}

function termFreq(text: string): Record<string, number> {
  const tf: Record<string, number> = {};
  for (const t of tokenize(text)) tf[t] = (tf[t] || 0) + 1;
  return tf;
}

/* ───────────────────────── Product helpers ─────────────────────────── */

function konstructzSpec(p: Product): string {
  const engine = p.specs.find((s) => /engine/i.test(s.label))?.value;
  return [p.weight, engine].filter(Boolean).join(" • ");
}

export function productRef(href: string): ProductRef | undefined {
  return PRODUCT_REFS.find((r) => r.href === href);
}

// PRODUCT_REFS is initialized as a mutable array populated at runtime
export const PRODUCT_REFS: ProductRef[] = [];

/* ─────────────────── Curated support / company docs ────────────────── */
// Grounded in the real support pages and company data. Where exact figures
// aren't published, the copy says so and points to the team — never invented.

const SUPPORT_DOCS: KBDoc[] = [
  {
    id: "sup-warranty",
    type: "support",
    title: "Warranty & coverage",
    href: "/support/warranty-returns",
    body:
      "Every Konstructz machine comes with a 1-year warranty + lifetime technical support that also includes spare parts during the coverage period, so genuine replacement parts are provided to keep your machine running. Exact coverage varies by machine and configuration, so the specific terms for your unit are confirmed by our team rather than stated as a blanket rule. To make a claim or check what's covered on your model, contact support. Detailed component-level coverage needs review and is confirmed per product.",
  },
  {
    id: "sup-shipping",
    type: "support",
    title: "Shipping & delivery",
    href: "/support/shipping-delivery",
    body:
      "Shipping is available in the USA. For overseas or international orders, please contact the Konstructz sales team so they can confirm availability, cost, and delivery options.",
  },
  {
    id: "sup-returns",
    type: "support",
    title: "Returns & refunds",
    href: "/support/warranty-returns",
    body:
      "If a machine isn't right, you can request a return within 30 days of delivery for a refund to your original payment method. Return freight is the customer's responsibility (we don't cover return logistics), and the machine must be unused and in its original condition. Some items can't be returned: used or damaged equipment, custom or special-order machines, spare parts, consumables, and hydraulic attachments. For transport damage, report it within 48 hours of delivery. To start a return, contact support and we'll issue return instructions. The exact return window, start date, and refund timeframe need review as published sources differ.",
  },
  {
    id: "sup-financing",
    type: "support",
    title: "Financing & payment",
    href: "/contact",
    body:
      "Konstructz offers flexible financing through Paramount Financial on a lease-to-own basis. Highlights include 100% financing with the option to bundle equipment, shipping, and taxes; soft credit checks that don't hurt your score; all credit profiles considered; startup-friendly approval with no minimum time in business; and instant decisions on approvals up to $25,000. How it works: apply with Paramount, get a decision by email or phone, choose your machine and get a quote from sales, sign the financing documents, and the order ships once approved. Lease payments may be tax-deductible, and an optional down payment reduces the financed balance. Exact rates, documentation fees, and early-payoff terms come from Paramount on approval. Pricing is quoted per machine.",
  },
  {
    id: "sup-attachments",
    type: "support",
    title: "Attachments & fitment",
    href: "/support/attachments-support",
    body:
      "Many Konstructz machines are attachment-ready. Mini excavators and skid steers in particular run a range of work tools: buckets, augers, breakers and hydraulic hammers, grapples, rippers, pallet forks, and hydraulic thumbs. Some mini excavators ship with multiple attachments in the package. Fitment depends on the specific model's coupler, mounting, and hydraulic flow, so compatibility should be confirmed with a quick fitment check rather than assumed. Attachment support and fitment checks are handled by the team.",
  },
  {
    id: "sup-parts-maintenance",
    type: "support",
    title: "Parts & maintenance",
    href: "/support/machine-guidance",
    body:
      "Genuine spare parts can be ordered directly through our parts team, and many machines include parts support under the 1-year warranty + lifetime technical support. We also provide servicing, parts replacement, and technical assistance for upkeep, plus operator training covering safety and best practices, and user manuals are available for our machines. Routine maintenance keeps a machine reliable: change engine oil and filters, hydraulic oil and filters, and air and fuel filters on schedule, grease pivot points, inspect tracks or tyres, and keep cutting edges and bucket teeth in good condition. Wear items are owner-maintained. For the right parts, service intervals, training, or a manual for your model, contact support.",
  },
  {
    id: "sup-safety",
    type: "support",
    title: "Operation & safety basics",
    href: "/support/machine-guidance",
    body:
      "Safe operation starts with the operator manual for your machine. General good practice: complete a walk-around inspection before starting, wear a seatbelt where fitted, keep bystanders clear of the working area and swing radius, operate on stable ground and be cautious on slopes, lower attachments to the ground before leaving the cab, and never exceed the machine's rated capacity or work outside its published spec. For model-specific operating and safety guidance, see machine guidance or contact support.",
  },
  {
    id: "sup-support-center",
    type: "support",
    title: "Support & contact",
    href: "/support",
    body:
      `The Support Center covers orders and purchases, shipping and delivery, warranty and returns, parts, machine guidance, and attachments support. You can reach the team by phone at ${CONTACT.phoneDisplay}, by email at ${CONTACT.email}, on WhatsApp, or through the contact form. Email inquiries are typically answered within 48 hours, and the team is generally available Monday to Friday, 9 AM to 5 PM (timezone needs review). Sales can help with machine selection, configuration, quotes, and financing.`,
  },
  {
    id: "sup-buying-guide",
    type: "support",
    title: "How to choose a machine (buying guide)",
    href: "/equipment",
    body:
      "Choosing the right machine comes down to the job and the site. Key questions: what tasks will it do most (digging, trenching, loading, hauling, grading, compaction, lifting, crushing); how tight is the access and how firm is the ground; what attachments you need now and later; how much you need to lift or carry; your budget; and operator experience. Compact machines like mini excavators and skid steers suit tight residential and landscaping sites; wheel loaders and dumpers suit higher-volume material handling and hauling. When unsure, share the job and site conditions and the team can match a configuration.",
  },
];

const COMPANY_DOCS: KBDoc[] = [
  {
    id: "co-about",
    type: "company",
    title: "About Konstructz",
    href: "/about",
    body:
      "Konstructz supplies compact construction machinery and attachments — mini excavators, skid steer loaders, wheel loaders, backhoe loaders, dumpers, trenchers, towable excavators, and stone crushers — alongside the wider Typhon Machinery catalog, which adds forklifts, road rollers, and scissor lifts. The focus is dependable, jobsite-ready equipment for contractors, landscapers, farmers, and property owners, backed by sales and support for selection, configuration, quotes, financing, shipping, and a 1-year warranty + lifetime technical support.",
  },
];

/* ─────────────────────────── Index build ───────────────────────────── */

function productDocs(): KBDoc[] {
  const docs: KBDoc[] = [];
  for (const p of products) {
    docs.push({
      id: `kz-${p.id}`,
      type: "product",
      title: p.name,
      href: `/equipment/${p.id}`,
      category: p.categoryLabel,
      brand: "Konstructz",
      spec: konstructzSpec(p),
      image: p.image,
      body: [
        p.name,
        p.categoryLabel,
        p.tagline,
        p.description,
        p.specs.map((s) => `${s.label} ${s.value}`).join(" "),
        p.features.join(" "),
      ].join(" "),
    });
  }
  for (const p of typhonProducts) {
    docs.push({
      id: `ty-${p.id}`,
      type: "product",
      title: p.name,
      href: `/typhon-machinery/${p.id}`,
      category: p.categoryLabel,
      brand: "Typhon",
      spec: PRODUCT_REFS.find((r) => r.name === p.name)?.spec,
      image: p.image,
      body: [
        p.name,
        p.categoryLabel,
        p.tagline,
        p.description,
        p.specs.map((s) => `${s.label} ${s.value}`).join(" "),
        (p.applications || []).join(" "),
      ].join(" "),
    });
  }
  return docs;
}

// Distinctive product-name token, e.g. "kuvuo 2.5" from "KUVUO 2.5", or
// "terror x storm" from "TYPHON Terror X Storm (0.7 Ton)".
function productNameTokens(title: string): string[] {
  const base = title.toLowerCase().replace(/typhon\s+/g, "").split("(")[0].trim();
  return [title.toLowerCase(), base].filter((t) => t.length >= 3);
}

function categoryDocs(): KBDoc[] {
  return categories.map((c) => ({
    id: `cat-${c.id}`,
    type: "category",
    title: c.name,
    href: `/equipment?category=${c.slug}`,
    category: c.name,
    body: `${c.name} ${c.description}`,
  }));
}

class KnowledgeIndex {
  docs: KBDoc[] = [];
  private df: Record<string, number> = {};

  constructor() {
    this.setBaseDocs([...productDocs(), ...categoryDocs(), ...SUPPORT_DOCS, ...COMPANY_DOCS]);
  }

  private recompute() {
    this.df = {};
    for (const d of this.docs) {
      d.tokens = termFreq(`${d.title} ${d.title} ${d.body}`); // title boosted
      for (const t of Object.keys(d.tokens)) this.df[t] = (this.df[t] || 0) + 1;
    }
  }

  private base: KBDoc[] = [];
  private blog: KBDoc[] = [];

  setBaseDocs(docs: KBDoc[]) {
    this.base = docs;
    this.docs = [...this.base, ...this.blog];
    this.recompute();
  }

  /** Add/replace live blog docs (called once posts load from Supabase). */
  setBlogDocs(
    posts: { slug: string; title: string; excerpt: string; category: string; image?: string }[]
  ) {
    this.blog = posts.map((p) => ({
      id: `blog-${p.slug}`,
      type: "blog" as const,
      title: p.title,
      href: `/media/${p.slug}`,
      category: p.category,
      image: p.image,
      body: `${p.title} ${p.category} ${p.excerpt}`,
    }));
    this.docs = [...this.base, ...this.blog];
    this.recompute();
  }

  search(query: string, k = 5, types?: DocType[]): KBDoc[] {
    const q = tokenize(query);
    if (!q.length) return [];
    const ql = query.toLowerCase();
    const n = this.docs.length;
    const scored: { doc: KBDoc; score: number }[] = [];
    for (const doc of this.docs) {
      if (types && !types.includes(doc.type)) continue;
      const tf = doc.tokens || {};
      let score = 0;
      for (const term of q) {
        const f = tf[term];
        if (!f) continue;
        const idf = Math.log(1 + n / (1 + (this.df[term] || 0)));
        score += (f / (f + 1.2)) * idf; // BM25-ish saturation
      }
      // Exact product-name match dominates: if the query literally contains the
      // model name, that machine is retrieved first (not just keyword overlap).
      if (doc.type === "product" && productNameTokens(doc.title).some((t) => ql.includes(t))) {
        score += 100;
      }
      if (score > 0) scored.push({ doc, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k).map((s) => s.doc);
  }
}

export const kb = new KnowledgeIndex();

export function docToRef(doc: KBDoc): ProductRef | undefined {
  if (doc.type !== "product" || !doc.href) return undefined;
  return productRef(doc.href);
}

/* ───────────────────── Full product detail (for compare) ───────────── */

export interface ProductDetail {
  id: string;
  name: string;
  href: string;
  categoryLabel: string;
  brand: "Konstructz" | "Typhon";
  image?: string;
  weight?: string;
  specs: { label: string; value: string }[];
  tagline?: string;
  description?: string;
  features?: string[];
  applications?: string[];
  aliases?: string[];
  verified?: boolean;
  suggestedQuestions?: string[];
  attachmentCompatibility?: string[];
}

export const PRODUCT_DETAIL: Record<string, ProductDetail> = {};

/** First spec whose label matches; undefined if not published. */
export function specValue(d: ProductDetail, re: RegExp): string | undefined {
  return d.specs.find((s) => re.test(s.label))?.value?.trim() || undefined;
}

/* ───────────────────────── Chatbot Editable Config ─────────────────── */

export interface ChatbotConfig {
  companyDescription: string;
  warrantyText: string;
  lifetimeSupportText: string;
  shippingNotes: string;
  financingNotes: string;
  returnNotes: string;
  productCategories: string;
  suggestedQuestions: string;
  contactEmail: string;
  contactPhone: string;
  safetyDisclaimer: string;
  productAliases: string;
  keySpecs: string;
  attachmentFitment: string;
  missingDataNotes: string;
  productPageLinks: string;
}

export const CHATBOT_CONFIG_DEFAULT: ChatbotConfig = {
  companyDescription: "Konstructz helps customers find compact heavy equipment, attachments, and machine support information.",
  warrantyText: "1-year warranty + lifetime technical support. Covers structural and powertrain components.",
  lifetimeSupportText: "Lifetime technical support is included with every machine purchase.",
  shippingNotes: "Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.",
  financingNotes: "100% financing available through Paramount Financial (lease-to-own).",
  returnNotes: "30-day returns for unused, original condition machinery. Customer covers return shipping.",
  productCategories: "Excavators, Skid Steers, Wheel Loaders, Dumpers, Trenchers, Backhoe Loader, Stone Crushers",
  suggestedQuestions: "Help me find the right machine for my job.\nCompare skid steer and wheel loader.\nWhat attachments fit my machine?\nTell me about Konstructz and what you sell.\nExplain the 1-year warranty and lifetime support.\nHelp me with shipping, financing, or returns.",
  contactEmail: "support@konstructz.com",
  contactPhone: "+1 213-214-2203",
  safetyDisclaimer: "Always consult the operator manual and check site conditions before operating heavy equipment.",
  productAliases: "TYPHON TERROR: terror, typhon terror, terror backhoe, backhoe loader;\nTYPHON TYRANT 17: tyrant, tyrant 17, typhon tyrant, mini excavator 17;\nTYPHON STOMP 509: stomp 509, 509, typhon stomp, mini skid steer 509;\nTYPHON STOMP X1300: stomp x1300, x1300, typhon x1300, skid steer x1300;\nTYPHON VIGOR 1.5: vigor 1.5, vigor blue, electric forklift 1.5;\nTYPHON VIGOR 2.0: vigor 2, vigor 2.0, electric forklift 2.0;\nTYPHON SKOOP: skoop, typhon skoop, wheel loader, telescopic wheel loader",
  keySpecs: "Engine Model, Horsepower, Weight, Lift Capacity, Digging Depth, Dimensions",
  attachmentFitment: "Pallet Fork: TYPHON STOMP 509, TYPHON STOMP X1300;\nGrapple: TERROR XI, Tyrant 17",
  missingDataNotes: "I do not have that exact spec listed in the current product data. Please confirm with sales before buying.",
  productPageLinks: "TYPHON TERROR: /typhon-machinery/terror-xi-mini-excavator-digger-13-5hp-gas-bs-epa-engine-with-13-attachments;\nTYPHON TYRANT 17: /typhon-machinery/typhon-tyrant-17"
};

const CHATBOT_CONFIG_KEY = "kz-chatbot-config";

export function getChatbotConfig(): ChatbotConfig {
  if (typeof window === "undefined") return CHATBOT_CONFIG_DEFAULT;
  const raw = window.localStorage.getItem(CHATBOT_CONFIG_KEY);
  if (!raw) return CHATBOT_CONFIG_DEFAULT;
  try {
    return { ...CHATBOT_CONFIG_DEFAULT, ...JSON.parse(raw) };
  } catch {
    return CHATBOT_CONFIG_DEFAULT;
  }
}

export function saveChatbotConfig(config: ChatbotConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHATBOT_CONFIG_KEY, JSON.stringify(config));
}

export function resetChatbotConfig(): ChatbotConfig {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(CHATBOT_CONFIG_KEY);
  }
  return CHATBOT_CONFIG_DEFAULT;
}

/* ───────────────────────── Dynamic Merging & Logging ───────────────── */

export interface FailedQueryLog {
  userQuestion: string;
  detectedProduct: string | null;
  detectedIntent: string;
  missingSpec: string | null;
  success: boolean;
  timestamp: string;
  suggestedFix: string;
}

export function getFailedQueryLogs(): FailedQueryLog[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem("kz-chatbot-failed-queries");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function logChatbotQuery(
  userQuestion: string,
  detectedIntent: string,
  detectedProduct: string | null,
  missingSpec: string | null,
  success: boolean,
  suggestedFix: string
): void {
  if (typeof window === "undefined") return;
  const logs = getFailedQueryLogs();
  
  try {
    const analKey = "kz-chatbot-analytics";
    let analytics = {
      queries: [] as string[],
      products: {} as Record<string, number>,
      specs: {} as Record<string, number>,
      failed: [] as string[],
      contacts: 0
    };
    const stored = window.localStorage.getItem(analKey);
    if (stored) analytics = JSON.parse(stored);
    
    analytics.queries.push(userQuestion);
    if (detectedProduct) {
      analytics.products[detectedProduct] = (analytics.products[detectedProduct] || 0) + 1;
    }
    if (missingSpec) {
      analytics.specs[missingSpec] = (analytics.specs[missingSpec] || 0) + 1;
    }
    if (!success) {
      analytics.failed.push(userQuestion);
    }
    window.localStorage.setItem(analKey, JSON.stringify(analytics));
  } catch (e) {
    console.error(e);
  }

  const newLog: FailedQueryLog = {
    userQuestion,
    detectedProduct,
    detectedIntent,
    missingSpec,
    success,
    timestamp: new Date().toISOString(),
    suggestedFix
  };
  
  logs.unshift(newLog);
  if (logs.length > 200) logs.pop();
  window.localStorage.setItem("kz-chatbot-failed-queries", JSON.stringify(logs));
}

export function getMergedProducts() {
  if (typeof window === "undefined") {
    return { baseProducts: products, baseTyphonProducts: typhonProducts };
  }
  
  const rawCustom = window.localStorage.getItem("kz-chatbot-products-custom");
  if (!rawCustom) {
    return { baseProducts: products, baseTyphonProducts: typhonProducts };
  }
  
  try {
    const custom = JSON.parse(rawCustom) as Record<string, any>;
    
    const mergedProducts = products.map(p => {
      const entry = custom[p.id];
      if (!entry) return p;
      
      const specsMap = new Map(p.specs.map(s => [s.label, s.value]));
      if (entry.specs) {
        for (const [lbl, val] of Object.entries(entry.specs)) {
          if (val === null || val === undefined) continue;
          specsMap.set(lbl, val as string);
        }
      }
      
      return {
        ...p,
        name: entry.name || p.name,
        aliases: entry.aliases ? entry.aliases.split(",").map((s: string) => s.trim()) : p.aliases,
        tagline: entry.tagline || p.tagline,
        description: entry.description || p.description,
        features: entry.keyFeatures ? entry.keyFeatures.split(",").map((s: string) => s.trim()) : p.features,
        bestUseCases: entry.bestUseCases ? entry.bestUseCases.split(",").map((s: string) => s.trim()) : p.features,
        price: entry.price || p.price,
        url: entry.url || p.url,
        image: entry.image || p.image,
        specs: Array.from(specsMap.entries()).map(([label, value]) => ({ label, value })),
        verified: !!entry.verified,
        suggestedQuestions: entry.suggestedQuestions ? entry.suggestedQuestions.split("\n").map((s: string) => s.trim()).filter(Boolean) : [],
        attachmentCompatibility: entry.attachmentCompatibility ? entry.attachmentCompatibility.split(",").map((s: string) => s.trim()).filter(Boolean) : []
      };
    });

    const mergedTyphonProducts = typhonProducts.map(p => {
      const entry = custom[p.id];
      if (!entry) return p;
      
      const specsMap = new Map(p.specs.map(s => [s.label, s.value]));
      if (entry.specs) {
        for (const [lbl, val] of Object.entries(entry.specs)) {
          if (val === null || val === undefined) continue;
          specsMap.set(lbl, val as string);
        }
      }
      
      return {
        ...p,
        name: entry.name || p.name,
        aliases: entry.aliases ? entry.aliases.split(",").map((s: string) => s.trim()) : [],
        tagline: entry.tagline || p.tagline,
        description: entry.description || p.description,
        features: entry.keyFeatures ? entry.keyFeatures.split(",").map((s: string) => s.trim()) : p.features,
        applications: entry.bestUseCases ? entry.bestUseCases.split(",").map((s: string) => s.trim()) : p.applications,
        price: entry.price || p.price,
        currentPrice: entry.price || p.currentPrice || p.price,
        sourceUrl: entry.url || p.sourceUrl,
        buttonUrl: entry.url || p.buttonUrl,
        image: entry.image || p.image,
        specs: Array.from(specsMap.entries()).map(([label, value]) => ({ label, value })),
        verified: !!entry.verified,
        suggestedQuestions: entry.suggestedQuestions ? entry.suggestedQuestions.split("\n").map((s: string) => s.trim()).filter(Boolean) : [],
        attachmentCompatibility: entry.attachmentCompatibility ? entry.attachmentCompatibility.split(",").map((s: string) => s.trim()).filter(Boolean) : []
      };
    });

    return { baseProducts: mergedProducts, baseTyphonProducts: mergedTyphonProducts };
  } catch (e) {
    console.error("Error merging custom products", e);
    return { baseProducts: products, baseTyphonProducts: typhonProducts };
  }
}

export function refreshKnowledgeBase() {
  const { baseProducts, baseTyphonProducts } = getMergedProducts();

  // 1. Refresh PRODUCT_REFS
  PRODUCT_REFS.length = 0;
  
  const konstructzRefs = baseProducts.map((p) => ({
    name: p.name,
    href: `/equipment/${p.id}`,
    categoryLabel: p.categoryLabel,
    brand: "Konstructz" as const,
    spec: [p.weight, p.specs.find((s) => /engine/i.test(s.label))?.value].filter(Boolean).join(" • "),
    image: p.image,
  }));
  
  const typhonRefs = baseTyphonProducts.map((p) => ({
    name: p.name,
    href: `/typhon-machinery/${p.id}`,
    categoryLabel: p.categoryLabel,
    brand: "Typhon" as const,
    spec: [
      p.specs.find((s) => s.label === "Weight Class")?.value,
      p.specs.find((s) => s.label === "Engine Power")?.value,
    ].filter(Boolean).join(" • "),
    image: p.image,
  }));
  
  PRODUCT_REFS.push(...konstructzRefs, ...typhonRefs);

  // 2. Refresh PRODUCT_DETAIL
  for (const key of Object.keys(PRODUCT_DETAIL)) {
    delete PRODUCT_DETAIL[key];
  }
  
  const detailList = [
    ...baseProducts.map((p) => ({
      id: p.id,
      name: p.name,
      href: `/equipment/${p.id}`,
      categoryLabel: p.categoryLabel,
      brand: "Konstructz" as const,
      image: p.image,
      weight: p.weight,
      specs: p.specs,
      tagline: p.tagline,
      description: p.description,
      features: p.features || [],
      applications: p.bestUseCases || [],
      aliases: p.aliases || [],
      verified: p.verified || false,
      suggestedQuestions: p.suggestedQuestions || [],
      attachmentCompatibility: p.attachmentCompatibility || []
    })),
    ...baseTyphonProducts.map((p) => ({
      id: p.id,
      name: p.name,
      href: `/typhon-machinery/${p.id}`,
      categoryLabel: p.categoryLabel,
      brand: "Typhon" as const,
      image: p.image,
      weight: p.specs.find((s) => s.label === "Weight Class")?.value,
      specs: p.specs,
      tagline: p.tagline,
      description: p.description,
      features: p.features || [],
      applications: p.applications || [],
      aliases: p.aliases || [],
      verified: p.verified || false,
      suggestedQuestions: p.suggestedQuestions || [],
      attachmentCompatibility: p.attachmentCompatibility || []
    })),
  ];
  
  for (const d of detailList) {
    PRODUCT_DETAIL[d.href] = d;
  }

  // 3. Refresh KB docs index
  const docs: KBDoc[] = [];
  for (const p of baseProducts) {
    docs.push({
      id: `kz-${p.id}`,
      type: "product",
      title: p.name,
      href: `/equipment/${p.id}`,
      category: p.categoryLabel,
      brand: "Konstructz",
      spec: [p.weight, p.specs.find((s) => /engine/i.test(s.label))?.value].filter(Boolean).join(" • "),
      image: p.image,
      body: [
        p.name,
        p.categoryLabel,
        p.tagline,
        p.description,
        p.specs.map((s) => `${s.label} ${s.value}`).join(" "),
        (p.features || []).join(" "),
      ].join(" "),
    });
  }
  for (const p of baseTyphonProducts) {
    docs.push({
      id: `ty-${p.id}`,
      type: "product",
      title: p.name,
      href: `/typhon-machinery/${p.id}`,
      category: p.categoryLabel,
      brand: "Typhon",
      spec: [
        p.specs.find((s) => s.label === "Weight Class")?.value,
        p.specs.find((s) => s.label === "Engine Power")?.value,
      ].filter(Boolean).join(" • "),
      image: p.image,
      body: [
        p.name,
        p.categoryLabel,
        p.tagline,
        p.description,
        p.specs.map((s) => `${s.label} ${s.value}`).join(" "),
        (p.features || []).join(" "),
      ].join(" "),
    });
  }
  
  const catDocs = categories.map((c) => ({
    id: `cat-${c.id}`,
    type: "category" as const,
    title: c.name,
    href: `/equipment?category=${c.slug}`,
    category: c.name,
    body: `${c.name} ${c.description}`,
  }));

  kb.setBaseDocs([...docs, ...catDocs, ...SUPPORT_DOCS, ...COMPANY_DOCS]);
}

// Call at initialization time to load base values
refreshKnowledgeBase();

export interface UserFeedbackLog {
  id: string;
  userQuestion: string;
  answerText: string;
  feedbackType: "helpful" | "not_helpful" | "missing_info";
  details: string;
  timestamp: string;
}

export function getFeedbackLogs(): UserFeedbackLog[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem("kz-chatbot-user-feedback");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function logUserFeedback(
  userQuestion: string,
  answerText: string,
  feedbackType: "helpful" | "not_helpful" | "missing_info",
  details: string
): void {
  if (typeof window === "undefined") return;
  const logs = getFeedbackLogs();
  const newLog: UserFeedbackLog = {
    id: Math.random().toString(36).slice(2, 10),
    userQuestion,
    answerText,
    feedbackType,
    details,
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog);
  if (logs.length > 200) logs.pop();
  window.localStorage.setItem("kz-chatbot-user-feedback", JSON.stringify(logs));
}

