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

const konstructzRefs: ProductRef[] = products.map((p) => ({
  name: p.name,
  href: `/equipment/${p.id}`,
  categoryLabel: p.categoryLabel,
  brand: "Konstructz",
  spec: konstructzSpec(p),
  image: p.image,
}));

const typhonRefs: ProductRef[] = typhonProducts.map((p) => ({
  name: p.name,
  href: `/typhon-machinery/${p.id}`,
  categoryLabel: p.categoryLabel,
  brand: "Typhon",
  spec: [
    p.specs.find((s) => s.label === "Weight Class")?.value,
    p.specs.find((s) => s.label === "Engine Power")?.value,
  ]
    .filter(Boolean)
    .join(" • "),
  image: p.image,
}));

export const PRODUCT_REFS: ProductRef[] = [...konstructzRefs, ...typhonRefs];

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
      spec: typhonRefs.find((r) => r.name === p.name)?.spec,
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
}

const detailList: ProductDetail[] = [
  ...products.map((p) => ({
    name: p.name,
    href: `/equipment/${p.id}`,
    categoryLabel: p.categoryLabel,
    brand: "Konstructz" as const,
    image: p.image,
    weight: p.weight,
    specs: p.specs,
    tagline: p.tagline,
    description: p.description,
    features: p.features,
  })),
  ...typhonProducts.map((p) => ({
    name: p.name,
    href: `/typhon-machinery/${p.id}`,
    categoryLabel: p.categoryLabel,
    brand: "Typhon" as const,
    image: p.image,
    weight: p.specs.find((s) => s.label === "Weight Class")?.value,
    specs: p.specs,
    tagline: p.tagline,
    description: p.description,
    applications: p.applications,
  })),
];

export const PRODUCT_DETAIL: Record<string, ProductDetail> = Object.fromEntries(
  detailList.map((d) => [d.href, d])
);

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
}

export const CHATBOT_CONFIG_DEFAULT: ChatbotConfig = {
  companyDescription: "Konstructz helps customers find compact heavy equipment, attachments, and machine support information.",
  warrantyText: "1-year warranty + lifetime technical support. Covers structural and powertrain components.",
  lifetimeSupportText: "Lifetime technical support is included with every machine purchase.",
  shippingNotes: "Shipping is available in the USA. For overseas or international orders, please contact the Konstructz sales team so they can confirm availability, cost, and delivery options.",
  financingNotes: "100% financing available through Paramount Financial (lease-to-own).",
  returnNotes: "30-day returns for unused, original condition machinery. Customer covers return shipping.",
  productCategories: "Excavators, Skid Steers, Wheel Loaders, Dumpers, Trenchers, Backhoe Loaders, Stone Crushers",
  suggestedQuestions: "Help me find the right machine for my job.\nCompare skid steer and wheel loader.\nWhat attachments fit my machine?\nTell me about Konstructz and what you sell.\nExplain the 1-year warranty and lifetime support.\nHelp me with shipping, financing, or returns.",
  contactEmail: "support@konstructz.com",
  contactPhone: "+1 213-214-2203",
  safetyDisclaimer: "Always consult the operator manual and check site conditions before operating heavy equipment."
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
