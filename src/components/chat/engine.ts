import {
  kb,
  PRODUCT_REFS,
  PRODUCT_DETAIL,
  CONTACT,
  type ProductRef,
  type ProductDetail,
  getChatbotConfig,
  logChatbotQuery,
} from "./knowledge";
import { typhonProducts } from "../../data/typhonProducts";
import { matchProductAndSpec, getCanonicalProducts } from "./matchingEngine";
import { getCanonicalProfiles, type CanonicalProfile } from "./canonicalProfiles";
import { dictionaries, type LanguageCode } from "../../i18n/dictionaries";

function getT(lang: string) {
  const code = (lang || "EN").toUpperCase() as LanguageCode;
  const dict = dictionaries[code] || dictionaries["EN"];
  return (key: string, fallback: string) => {
    return dict[key] || dictionaries["EN"][key] || fallback;
  };
}

export interface Answer {
  markdown: string;
  products?: ProductRef[];
  links?: { label: string; href: string }[];
  followups?: string[];
  handoff?: boolean;
  trace?: {
    product: string;
    intent: string;
    answer: string;
    source: string;
    confidence: string;
    warning?: string;
  };
}

export interface ChatMemory {
  slots: {
    job?: string;
    terrain?: string;
    budget?: string;
    experience?: string;
    capacity?: string;
    attachments?: string;
    projectSize?: string;
  };
  quoteSlots?: {
    name?: string;
    contact?: string;
    product?: string;
    job?: string;
    location?: string;
  };
  activeMachine?: ProductRef;
  activeCategory?: string;
  lastProducts: ProductRef[];
  lastIntent?: string;
  awaiting?: string | null;
  turn: number;
  greeted?: boolean;
  usedGreetings?: string[];
  recentlyViewedIds?: string[];
}

export const emptyMemory = (): ChatMemory => ({
  slots: {},
  lastProducts: [],
  awaiting: null,
  turn: 0,
  greeted: false,
  usedGreetings: [],
  recentlyViewedIds: [],
});

export const STARTERS = [
  "Which machine is right for my job?",
  "Compare a mini excavator and a skid steer",
  "What attachments fit a mini excavator?",
  "What does the warranty cover?",
  "How does shipping and delivery work?",
];

export const WELCOME =
  "Hi — I'm your **Typhon advisor**. I can help you select the right machine, compare models, look up specifications, check attachment fitment, and coordinate financing, shipping, or warranty policies.\n\nTell me what project you're working on and I'll match you to the right equipment.";

// Spec Terminology explanations
export const SPEC_HELPERS: Record<string, string> = {
  "digging depth": "**Digging Depth** indicates how deep the excavator bucket can reach below ground level to dig trenches or utility lines.",
  "horsepower": "**Horsepower (HP)** measures the engine's total power output. Higher HP means more digging or travel torque.",
  "operating weight": "**Operating Weight** is the total weight of the machine including full fluids, fuel, counterweights, and a standard operator. It dictates ground pressure and transportation needs.",
  "lift capacity": "**Lift Capacity** (or Operating Capacity) is the maximum safe weight the loader or forklift can lift without tipping over.",
  "hydraulic flow": "**Hydraulic Flow (GPM)** is the rate of fluid pumped to auxiliary ports to power attachments like post-hole augers or brush mowers.",
  "torque": "**Torque** is the rotational force produced by the engine, critical for pushing into dirt piles or driving up steep grades.",
  "free lift": "**Free Lift** is how high a forklift's forks can rise before the mast sections start extending upward, crucial for low-ceiling rooms."
};

// Formatting Helper that respects strict length limits
export function formatLimitedResponse(
  intro: string,
  tableHeader: string[] | null,
  tableRows: string[][] | null,
  bullets: string[],
  buttons: string[]
): string {
  let md = `${intro}\n\n`;
  if (tableHeader && tableRows && tableRows.length > 0) {
    md += `| ${tableHeader.join(" | ")} |\n`;
    md += `| ${tableHeader.map(() => "---").join(" | ")} |\n`;
    for (const r of tableRows.slice(0, 4)) {
      md += `| ${r.join(" | ")} |\n`;
    }
    md += `\n`;
  }
  if (bullets.length > 0) {
    for (const b of bullets.slice(0, 4)) {
      md += `* ${b}\n`;
    }
    md += `\n`;
  }
  return md.trim();
}

// Wrong machine warnings mapping
export function checkWrongMachineRedirection(
  mLower: string, 
  t: (key: string, fallback: string) => string
): Answer | null {
  const hasForklift = /\b(forklift|vigor)\b/i.test(mLower);
  const hasRoller = /\b(roller|compactor)\b/i.test(mLower);
  const hasExcavator = /\b(excavator|terror|tyrant|digger)\b/i.test(mLower);
  const hasLoader = /\b(loader|skoop)\b/i.test(mLower);

  const isDigging = /\b(dig|digging|trench|excavat)\b/i.test(mLower);
  const isLiftingPallets = /\b(pallet|stack|forks|lift\s+pallet)\b/i.test(mLower);

  if (hasForklift && isDigging) {
    return {
      markdown: t("chatbot.wrong.forkliftDig", "### Not the Right Machine\n\nAn electric forklift is designed strictly for **lifting and moving pallets** in warehouses, not digging.\n\nFor digging trenches or property work, you should look at a **TYPHON mini excavator** (like TERROR XI or TERROR XXV).\n\n*Common mistake: Do not choose a forklift for digging.*"),
      followups: ["Show mini excavators", "Compare forklift vs excavator", "Contact sales"]
    };
  }

  if (hasRoller && isLiftingPallets) {
    return {
      markdown: t("chatbot.wrong.rollerPallet", "### Not the Right Machine\n\nA road roller is built exclusively for **compacting soil, gravel, and asphalt**, not lifting pallets.\n\nFor material lifting and pallet handling, choose a **TYPHON electric forklift** or a **skid steer loader with pallet forks**.\n\n*Common mistake: A roller has no fork attachments.*"),
      followups: ["Show forklifts", "Show skid steers", "Contact sales"]
    };
  }

  if (hasExcavator && isLiftingPallets) {
    return {
      markdown: t("chatbot.wrong.excavatorPallet", "### Not the Right Machine\n\nWhile mini excavators can lift logs with grapples, they are **not designed for forklift-style pallet stacking**.\n\nFor warehouse pallet stacking, choose a **TYPHON electric forklift** (VIGOR series). For outdoor ground pallet handling, choose a **TYPHON skid steer** (STOMP series) with pallet forks.\n\n*Common mistake: Excavator geometry is poor for stacking flat loads.*"),
      followups: ["Show forklifts", "Show skid steers", "Contact sales"]
    };
  }

  if (hasLoader && isDigging && !/loading|loader/i.test(mLower)) {
    return {
      markdown: t("chatbot.wrong.loaderDig", "### Not the Right Machine\n\nWheel loaders and skid steers are excellent for **moving, grading, and bulk loading dirt**, but they cannot dig deep trenches.\n\nFor deep utility line excavation, look at a **TYPHON mini excavator**.\n\n*Common mistake: Loaders scrape surface material; they do not dig trenches.*"),
      followups: ["Show mini excavators", "Compare loaders vs excavators", "Contact sales"]
    };
  }

  return null;
}

export function detectIntent(m: string, memory: ChatMemory): string {
  const text = m.toLowerCase().trim();
  
  if (/\b(hi|hello|hey|yo|bonjour|salut|hola|ciao|hallo|guten\s+tag|こんにちは|もしもし|안녕하세요|여보세요|你好|您好)\b/i.test(text) && !/\b(which|ship|this|that|white)\b/i.test(text)) return "Greeting";
  if (prevIntentMatches(text, ["warranty", "warranties", "guarantee", "lifetime support", "garantie", "garantía", "garantia", "保証", "보증", "质保", "保修"])) return "Ask warranty";
  if (prevIntentMatches(text, ["overseas", "international shipping", "export", "outre-mer", "internacional", "海外", "외국", "국외", "出口"])) return "Ask overseas shipping";
  if (prevIntentMatches(text, ["ship", "shipping", "delivery", "deliver", "livraison", "livrer", "enviar", "envío", "envio", "spedizione", "consegna", "versand", "liefern", "発送", "配達", "배송", "배달", "运输", "配送"])) return "Ask shipping";
  if (prevIntentMatches(text, ["price", "cost", "how much", "quote", "pricing", "prix", "coût", "cout", "devis", "precio", "costo", "cotización", "cotizacion", "prezzo", "preventivo", "preis", "kosten", "価格", "値段", "見積", "가격", "비용", "견적", "价格", "费用", "报价"])) return "Ask price";
  if (prevIntentMatches(text, ["finance", "financing", "lease", "paramount", "financement", "financer", "financiación", "financiacion", "finanziare", "finanziamento", "finanzierung", "finanzieren", "ローン", "融資", "금융", "할부", "融资", "贷款"])) return "Ask financing";
  if (prevIntentMatches(text, ["stock", "availability", "warehouse", "reserve", "disponibilité", "disponibilite", "entrepôt", "disponibilidad", "almacén", "almacen", "magazzino", "lager", "verfügbarkeit", "在庫", "倉庫", "재고", "창고", "现货", "库存", "仓库"])) return "Ask stock";
  if (prevIntentMatches(text, ["contact", "sales", "talk to human", "phone", "email", "contacter", "ventes", "contacto", "vendedor", "contatto", "vendite", "verkauf", "sales@typhon", "電話", "メール", "問い合わせ", "전화", "이메일", "문의", "联系", "销售", "电话", "邮箱"])) return "Ask contact sales";
  if (prevIntentMatches(text, ["help", "troubleshoot", "broken", "service", "parts", "aide", "aider", "panne", "pièces", "ayuda", "soporte", "repuestos", "aiuto", "assistenza", "hilfe", "support", "サポート", "故障", "部品", "도움", "고장", "부품", "帮助", "故障", "零件", "售后"])) return "Ask support";
  if (prevIntentMatches(text, ["pallet fork", "compatible", "fitment", "attachment", "fit", "work with", "accessoire", "compatibilité", "acoplamiento", "compatibilidad", "adattarsi", "zubehör", "kompatibel", "アタッチメント", "適合", "互換", "어태치먼트", "호환", "적합", "配件", "兼容", "适用"])) return "Ask attachment fitment";
  if (prevIntentMatches(text, ["compare", "vs", "versus", "difference", "bigger", "stronger", "lifts more", "comparer", "différence", "plus grand", "plus fort", "comparar", "diferencia", "más grande", "mas grande", "confrontare", "differenza", "vergleichen", "unterschied", "grösser", "groesser", "stärker", "staerker", "比較", "違い", "大きい", "強い", "비교", "차이", "크다", "강하다", "对比", "比较", "区别", "更大", "更强"])) return "Ask product comparison";
  if (prevIntentMatches(text, ["recommend", "choose", "find the right", "best for", "picker", "recommander", "choisir", "trouver", "recomendar", "elegir", "encontrar", "consigliare", "scegliere", "trovare", "empfehlen", "wählen", "waehlen", "finden", "お勧め", "選ぶ", "추천", "선택", "推荐", "选择"])) return "Ask machine recommendation";
  if (prevIntentMatches(text, ["what is", "explain", "meaning", "define", "what does", "qu'est-ce", "expliquer", "définir", "signification", "qué es", "que es", "explicar", "definir", "cos'è", "spiegare", "was ist", "erklären", "定義", "意味", "설명", "정의", "什么是", "解释", "定义"])) return "Ask beginner explanation";
  if (prevIntentMatches(text, ["details", "description", "tell me about", "overview", "détails", "aperçu", "detalles", "descripción", "dettagli", "panoramica", "beschreibung", "überblick", "詳細", "概要", "설명", "개요", "详情", "介绍", "概述"])) return "Ask product overview";
  if (prevIntentMatches(text, ["url", "link", "website", "lien", "site web", "enlace", "sito web", "webseite", "リンク", "웹사이트", "链接", "网址"])) return "Ask product URL";
  if (prevIntentMatches(text, ["image", "picture", "photo", "gallery", "image", "photo", "galerie", "imagen", "galería", "foto", "galleria", "bild", "galerie", "画像", "写真", "ギャラリー", "사진", "갤러리", "图片", "照片", "图集"])) return "Ask image/gallery";

  // Check specs synonyms
  const isSpec = ["hp", "horsepower", "engine", "weight", "lift", "dig", "depth", "dimensions", "size", "width", "height", "moteur", "poids", "largeur", "hauteur", "puissance", "cavalli", "potencia", "peso", "ps", "motor", "gewicht", "馬力", "エンジン", "重量", "마력", "엔진", "무게", "크기", "尺寸", "重量", "马力", "发动机"].some(s => text.includes(s));
  if (isSpec) return "Ask exact spec";

  // If the query is a simple product name matching a canonical product, treat as overview
  const lookup = matchProductAndSpec(text, memory.activeMachine);
  if (lookup.product && lookup.confidence >= 80) {
    return "Ask product overview";
  }

  return "Unknown question";
}

function prevIntentMatches(text: string, list: string[]): boolean {
  return list.some(x => text.includes(x));
}

function translateReply(md: string, lang: string): string {
  if (!lang || lang.toUpperCase() === "EN") return md;
  const t = getT(lang);
  
  let translated = md;
  const labelMap = {
    "Warranty": t("chatbot.compare.warranty", "Warranty"),
    "Shipping": t("chatbot.compare.shipping", "Shipping"),
    "Pricing": t("chatbot.compare.price", "Pricing"),
    "Overview": t("chatbot.compare.overview", "Overview"),
    "Comparison": t("chatbot.compare.comparison", "Comparison"),
    "Specs": t("chatbot.compare.specs", "Specs"),
    "Lift Capacity": t("spec.operating-capacity", "Lift Capacity"),
    "Lift Capacité": t("spec.operating-capacity", "Lift Capacity"),
    "Weight": t("chatbot.compare.weight", "Weight"),
    "Power": t("chatbot.compare.power", "Power"),
    "Capacity": t("chatbot.compare.capacity", "Capacity"),
    "Best Use": t("chatbot.compare.bestUse", "Best Use"),
    "Price": t("chatbot.compare.price", "Price"),
    "Dimensions": t("chatbot.compare.dimensions", "Dimensions"),
    "Attachments": t("chatbot.compare.attachments", "Attachments"),
    "Horsepower": t("spec.engine-power", "Horsepower"),
    "Engine": t("spec.engine", "Engine"),
    "Attribute": t("chatbot.compare.attribute", "Attribute"),
    "Not listed": t("chatbot.notListed", "Not listed")
  };

  for (const [en, target] of Object.entries(labelMap)) {
    translated = translated.replace(new RegExp(`\\b${en}\\b`, "g"), target);
  }
  return translated;
}

// Dialog reply builder
export function getReply(
  m: string, 
  memory: ChatMemory, 
  lang: string = "EN",
  pathname?: string
): { answer: Answer; memory: ChatMemory } {
  const t = getT(lang);
  const mLower = m.toLowerCase().trim();
  const nextMemory = { ...memory, turn: memory.turn + 1 };
  
  // Look up product matching and pre-fill activeMachine context
  const lookup = matchProductAndSpec(mLower, memory.activeMachine, pathname);
  if (lookup.product && lookup.confidence >= 80) {
    const profile = getCanonicalProfiles().find(p => p.id === lookup.product?.id);
    if (profile) {
      nextMemory.activeMachine = {
        id: profile.id,
        name: profile.name,
        href: profile.productUrl,
        categoryLabel: profile.category,
        brand: profile.brand as any,
        image: profile.image || undefined
      };
    }
  }
  
  const finish = (ans: Answer, mem: ChatMemory) => {
    const translatedMd = translateReply(ans.markdown, lang);
    const translatedFollowups = (ans.followups || []).map(f => {
      const key = `chatbot.followup.${f.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "")}`;
      return t(key, f);
    });
    return { 
      answer: { ...ans, markdown: translatedMd, followups: translatedFollowups }, 
      memory: mem 
    };
  };

  // 1. Terminology spec helper trigger
  for (const [key, expl] of Object.entries(SPEC_HELPERS)) {
    if (mLower.includes(`what does ${key} mean`) || mLower.includes(`explain ${key}`)) {
      return finish({
        markdown: `### ${t("chatbot.spechelper.title", "Spec Glossary")}\n\n${t("chatbot.spechelper." + key.replace(/\s+/g, ""), expl)}\n\n${t("chatbot.spechelper.outro", "Do you want to check this spec on a specific TYPHON model?")}`,
        followups: ["Compare stomp models", "Show mini excavators", "Ask sales"]
      }, nextMemory);
    }
  }

  // 2. Wrong machine correction trigger
  const wrongMachineAns = checkWrongMachineRedirection(mLower, t);
  if (wrongMachineAns) {
    return finish(wrongMachineAns, nextMemory);
  }

  // 3. Guided Quote Request Builder Flow
  if (memory.awaiting && memory.awaiting.startsWith("quote_")) {
    const quoteSlots = memory.quoteSlots ? { ...memory.quoteSlots } : {};
    
    if (memory.awaiting === "quote_name") {
      quoteSlots.name = m;
      nextMemory.quoteSlots = quoteSlots;
      nextMemory.awaiting = "quote_contact";
      return finish({
        markdown: `### Guided Quote Request (Step 2/5)\n\n${t("chatbot.quote.niceToMeet", "Nice to meet you")}, **${m}**! ${t("chatbot.quote.bestContact", "What is the best **email address or phone number** for our team to contact you?")}`,
        followups: ["Cancel quote request"]
      }, nextMemory);
    }
    
    if (memory.awaiting === "quote_contact") {
      quoteSlots.contact = m;
      nextMemory.quoteSlots = quoteSlots;
      if (memory.activeMachine) {
        quoteSlots.product = memory.activeMachine.name;
        nextMemory.awaiting = "quote_job";
        return finish({
          markdown: `### Guided Quote Request (Step 3/5)\n\n${t("chatbot.quote.prefilledProduct", "Got it. We have pre-filled")} **TYPHON ${memory.activeMachine.name}** ${t("chatbot.quote.productOfInterest", "as your product of interest. What **type of work/job** will you be doing with this machine?")}`,
          followups: ["Digging trenches", "Lifting pallets", "Loading gravel", "Landscaping", "Cancel quote request"]
        }, nextMemory);
      } else {
        nextMemory.awaiting = "quote_product";
        return finish({
          markdown: `### Guided Quote Request (Step 3/5)\n\n${t("chatbot.quote.whatProduct", "Got it. Which **TYPHON machine or model** (e.g. TERROR XXV or STOMP 509) are you interested in quoting?")}`,
          followups: ["TERROR XXV", "STOMP 509", "TYRANT 17", "Cancel quote request"]
        }, nextMemory);
      }
    }
    
    if (memory.awaiting === "quote_product") {
      quoteSlots.product = m;
      nextMemory.quoteSlots = quoteSlots;
      nextMemory.awaiting = "quote_job";
      return finish({
        markdown: `### Guided Quote Request (Step 4/5)\n\n${t("chatbot.quote.workTypePrompt", "Understood. What **type of work/job** will you be doing with the machine? (e.g., landscaping, utility trenching, farm chores)")}`,
        followups: ["Digging trenches", "Lifting pallets", "Loading gravel", "Landscaping", "Cancel quote request"]
      }, nextMemory);
    }
    
    if (memory.awaiting === "quote_job") {
      quoteSlots.job = m;
      nextMemory.quoteSlots = quoteSlots;
      nextMemory.awaiting = "quote_location";
      return finish({
        markdown: `### Guided Quote Request (Step 5/5)\n\n${t("chatbot.quote.locationPrompt", "Perfect. What is your **shipping location** (City, State, or Country)?")}`,
        followups: ["United States", "Overseas", "Cancel quote request"]
      }, nextMemory);
    }
    
    if (memory.awaiting === "quote_location") {
      quoteSlots.location = m;
      nextMemory.quoteSlots = quoteSlots;
      nextMemory.awaiting = null;
      
      const summaryTable = `
### ${t("chatbot.quote.summaryTitle", "Quote Request Summary")}

| ${t("chatbot.compare.field", "Field")} | ${t("chatbot.compare.details", "Details")} |
|---|---|
| **${t("chatbot.compare.name", "Name")}** | ${quoteSlots.name} |
| **${t("chatbot.compare.contact", "Contact Info")}** | ${quoteSlots.contact} |
| **${t("chatbot.compare.product", "Product Interest")}** | ${quoteSlots.product} |
| **${t("chatbot.compare.job", "Job Type")}** | ${quoteSlots.job} |
| **${t("chatbot.compare.location", "Shipping Location")}** | ${quoteSlots.location} |
| **${t("chatbot.compare.confirmation", "Sales Confirmation Needed")}** | Yes |
`;
      return finish({
        markdown: `${t("chatbot.quote.confirm", "Thank you! Here is the summary of your quote request. I have routed it to our sales specialists to confirm final pricing and options.")}\n\n${summaryTable}`,
        followups: ["Find the right TYPHON machine", "Ask about financing"]
      }, nextMemory);
    }
  }

  // Handle Cancel action in quote builder
  if (mLower === "cancel quote request" || mLower === "cancel request") {
    nextMemory.awaiting = null;
    nextMemory.quoteSlots = undefined;
    return finish({
      markdown: t("chatbot.quote.canceled", "The quote builder has been canceled. What else can I help you with?"),
      followups: ["Find the right TYPHON machine", "Compare TYPHON equipment"]
    }, nextMemory);
  }

  // 4. Default intent detection
  const detectedIntent = detectIntent(m, memory);
  
  switch (detectedIntent) {
    case "Greeting": {
      return finish({
        markdown: t("chatbot.greeting", "Hi there! I'm your Typhon product expert and sales advisor. I can answer exact specifications, help you choose the right machine for your job, check attachment compatibility, or guide you through financing and shipping details. What can I help you build today?"),
        followups: ["Find the right TYPHON machine", "Compare TYPHON equipment", "Ask about warranty/support"]
      }, nextMemory);
    }

    case "Ask exact spec": {
      const res = matchProductAndSpec(mLower, memory.activeMachine, pathname);
      
      if (res.type === "clarify" && res.candidates.length > 0) {
        return finish({
          markdown: `### ${t("chatbot.whichProductTitle", "Which product do you mean?")}\n\n${t("chatbot.whichProductDesc", "I found multiple matching TYPHON products. Select a model below:")}`,
          products: res.candidates.map(c => ({ id: c.id, name: c.name, href: c.url || `/typhon-machinery/${c.id}`, categoryLabel: c.category, brand: c.brand as any, image: c.image || undefined })),
          followups: res.candidates.map(c => `${c.name} ${res.intent || "specs"}`)
        }, nextMemory);
      }

      if (res.type === "not_found" || !res.product) {
        return finish({
          markdown: t("chatbot.spec.whichMachine", "Which TYPHON machine would you like to check? Tell me the model (e.g. *TERROR XXV* or *STOMP 509*) and I'll find that specification."),
          followups: ["Find the right TYPHON machine", "Compare TYPHON equipment"]
        }, nextMemory);
      }

      const profiles = getCanonicalProfiles();
      const profile = profiles.find(p => p.id === res.product?.id);
      if (!profile) {
        return finish({
          markdown: t("chatbot.spec.notFound", "I do not have detailed specs for that product in the index. Please confirm with sales."),
          followups: ["Contact sales team"]
        }, nextMemory);
      }

      const specName = res.intent || "Horsepower";
      const specFieldMap: Record<string, keyof CanonicalProfile> = {
        "Horsepower": "horsepower",
        "Engine": "engineModel",
        "Weight": "operatingWeight",
        "Lift Capacity": "liftCapacity",
        "Digging Depth": "diggingDepth",
        "Dimensions": "overallWidth"
      };

      const fieldKey = specFieldMap[specName] || "horsepower";
      const val = profile[fieldKey];
      
      let md = `### TYPHON ${profile.name} ${specName}\n\n`;
      md += `**${val}**\n\n`;
      
      if (specName === "Price") {
        md += `*Final price and availability should be confirmed with sales.*\n\n`;
      } else if (specName === "Stock") {
        md += `*Stock availability should be confirmed with sales.*\n\n`;
      }

      md += `**1-year warranty + lifetime technical support** is standard.\n\n`;
      md += `**Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**\n`;

      const matchedRef: ProductRef = {
        id: profile.id,
        name: profile.name,
        href: profile.productUrl,
        categoryLabel: profile.category,
        brand: profile.brand as any,
        image: profile.image || undefined
      };

      nextMemory.activeMachine = matchedRef;

      return finish({
        markdown: md,
        products: [matchedRef],
        followups: [
          `What does ${specName.toLowerCase()} mean?`,
          `Show key specs for ${profile.name}`,
          `Compare ${profile.name}`,
          `Build quote request`
        ]
      }, nextMemory);
    }

    case "Ask product overview": {
      const res = matchProductAndSpec(mLower, memory.activeMachine, pathname);
      if (res.type === "clarify" && res.candidates.length > 0) {
        return finish({
          markdown: `### Which product do you mean?\n\nI found multiple matching TYPHON products. Select a model below:`,
          products: res.candidates.map(c => ({ name: c.name, href: c.url || `/typhon-machinery/${c.id}`, categoryLabel: c.category, brand: c.brand as any, image: c.image || undefined })),
          followups: res.candidates.map(c => `${c.name} specs`)
        }, nextMemory);
      }

      if (!res.product) {
        return finish({
          markdown: "Which TYPHON model do you mean? e.g. TERROR XXV or STOMP 509.",
          followups: ["Find the right TYPHON machine", "Compare TYPHON equipment"]
        }, nextMemory);
      }

      const profiles = getCanonicalProfiles();
      const profile = profiles.find(p => p.id === res.product?.id);
      if (!profile) {
        return finish({
          markdown: "I do not have canonical records for this product.",
          followups: ["Browse categories"]
        }, nextMemory);
      }

      let intro = `### TYPHON ${profile.name} Overview\n\n${profile.shortSummary}\n\n*Based on the current product data:*`;
      
      const tableHeaders = ["Specification", "Value"];
      const tableRows = [
        ["Engine Output", profile.horsepower],
        ["Engine Model", profile.engineModel],
        ["Weight", profile.operatingWeight],
        ["Lift Capacity", profile.liftCapacity],
        ["Digging Depth", profile.diggingDepth]
      ];

      const bullets = [
        `**Best For:** ${profile.bestUseCases.join(", ")}`,
        `**Strengths:** ${profile.goodFor.join(", ")}`,
        `**Limitations:** ${profile.notIdealFor.join(", ")}`,
        `**Cabin Option:** ${profile.cabinOption}`
      ];

      const formattedMarkdown = formatLimitedResponse(intro, tableHeaders, tableRows, bullets, []);
      
      const matchedRef: ProductRef = {
        id: profile.id,
        name: profile.name,
        href: profile.productUrl,
        categoryLabel: profile.category,
        brand: profile.brand as any,
        image: profile.image || undefined
      };

      nextMemory.activeMachine = matchedRef;

      return finish({
        markdown: formattedMarkdown,
        products: [matchedRef],
        followups: [
          `Compare ${profile.name}`,
          `Similar machines to ${profile.name}`,
          `Build quote request`,
          "Show financing options"
        ]
      }, nextMemory);
    }

    case "Ask product comparison": {
      // Sizing comparison query
      const isStrongerCheck = /\b(strong|stronger|power|hp|lift|capacity|force)\b/i.test(mLower);
      const isBiggerCheck = /\b(big|bigger|heavy|heavier|weight|dimensions|tall|wide)\b/i.test(mLower);
      const isBackyardCheck = /\b(tight|backyard|narrow|small|smaller|compact)\b/i.test(mLower);

      const profiles = getCanonicalProfiles();
      
      // If comparing stomp models
      if (mLower.includes("stomp")) {
        const s509 = profiles.find(p => p.name.includes("509"));
        const sx1300 = profiles.find(p => p.name.includes("X1300"));
        if (s509 && sx1300) {
          const metricName = isStrongerCheck ? "Strength / Power" : isBackyardCheck ? "Compactness" : "Overall Size";
          const comparisonText = isStrongerCheck 
            ? `**Based on available data, the STOMP X1300 is the stronger option because it delivers higher horsepower and lift capacity.**`
            : isBackyardCheck
            ? `**The STOMP 509 is the smaller/narrower option, making it better for tight residential backyard gates.**`
            : `**The STOMP X1300 is the bigger and heavier option.**`;

          let intro = `### STOMP Model Comparison (${metricName})`;
          const headers = ["Attribute", "STOMP 509", "STOMP X1300"];
          const rows = [
            ["Horsepower", s509.horsepower, sx1300.horsepower],
            ["Lift Capacity", s509.liftCapacity, sx1300.liftCapacity],
            ["Engine", s509.engineModel, sx1300.engineModel],
            ["Weight", s509.operatingWeight, sx1300.operatingWeight]
          ];

          return finish({
            markdown: formatLimitedResponse(intro, headers, rows, [comparisonText], []),
            followups: ["Build quote request", "Show financing options"]
          }, nextMemory);
        }
      }

      // If comparing tyrant vs terror
      if (mLower.includes("tyrant") || mLower.includes("terror")) {
        const tyrant = profiles.find(p => p.name.includes("Tyrant 17"));
        const terror = profiles.find(p => p.name.includes("Terror XXV"));
        if (tyrant && terror) {
          const comparisonText = isBackyardCheck
            ? `**The Tyrant 17 has a smaller footprint than the Terror XXV, making it better for tight spaces.**`
            : `**Based on available data, the Terror XXV is heavier and digs slightly deeper than the Tyrant 17.**`;

          let intro = `### TYPHON Tyrant 17 vs Terror XXV Comparison`;
          const headers = [t("chatbot.attribute", "Attribute"), "Tyrant 17", "Terror XXV"];
          const rows = [
            ["Weight", tyrant.operatingWeight, terror.operatingWeight],
            ["Engine output", tyrant.horsepower, terror.horsepower],
            ["Digging Depth", tyrant.diggingDepth, terror.diggingDepth]
          ];

          return finish({
            markdown: formatLimitedResponse(intro, headers, rows, [comparisonText], []),
            followups: ["Build quote request", "Ask about warranty"]
          }, nextMemory);
        }
      }

      const res = matchProductAndSpec(mLower, memory.activeMachine, pathname);
      
      if (res.type === "clarify" && res.candidates.length >= 2) {
        let intro = `### ${t("chatbot.compare.title", "Compare TYPHON Models")}\n\n${t("chatbot.compare.tableDesc", "Here is a comparison of the matched models:")}`;
        const headers = [t("chatbot.attribute", "Attribute"), ...res.candidates.map(c => c.name)];
        const specs = ["Horsepower", "Lift Capacity", "Engine", "Weight", "Best Use", "Price"];
        const rows = specs.map(s => {
          const rowVals = res.candidates.map(c => getSpecValAndConfidence(c, s).value);
          return [s, ...rowVals];
        });
        
        return finish({
          markdown: formatLimitedResponse(intro, headers, rows, [], []),
          followups: [t("chatbot.findMachine", "Find the right machine"), t("chatbot.compareStomp", "Compare stomp models"), t("chatbot.askSales", "Ask sales")]
        }, nextMemory);
      }

      return finish({
        markdown: t("chatbot.compare.prompt", "I'd be glad to compare two TYPHON models. Tell me the two models (for example *“stomp 509 vs stomp x1300”*) and I'll compile a comparison table for you."),
        followups: ["Compare STOMP 509 vs STOMP X1300", "Compare TERROR XXV vs TYRANT 17"]
      }, nextMemory);
    }

    case "Ask machine recommendation": {
      // Check job recommendation shortcuts
      let matchedCategory = "";
      let jobTitle = "General project work";
      if (/\b(dig|digging|trench|excavat)\b/i.test(mLower)) {
        matchedCategory = "Mini Excavator";
        jobTitle = "Digging & Trenching";
      } else if (/\b(load|grading|dirt|gravel|mulch)\b/i.test(mLower)) {
        matchedCategory = "Skid Steer";
        jobTitle = "Loading & Grading";
      } else if (/\b(pallet|warehouse|lift|forks)\b/i.test(mLower)) {
        matchedCategory = "Forklift";
        jobTitle = "Pallet & Material Lifting";
      } else if (/\b(compact|soil|asphalt|roller)\b/i.test(mLower)) {
        matchedCategory = "Road Roller";
        jobTitle = "Soil & Asphalt Compacting";
      }

      if (matchedCategory) {
        const profiles = getCanonicalProfiles();
        const matches = profiles.filter(p => p.category.toLowerCase().includes(matchedCategory.toLowerCase())).slice(0, 2);
        
        let intro = t("chatbot.recommend.intro", "### Best TYPHON Options for {jobTitle}\n\n*Here are the recommended models matching your job description:*").replace("{jobTitle}", t(`chatbot.job.${jobTitle.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "")}`, jobTitle));
        const headers = [t("chatbot.compare.machine", "Machine"), t("chatbot.compare.matchStrength", "Match Strength"), t("chatbot.compare.why", "Why")];
        const rows = matches.map((m, idx) => [
          m.name, 
          idx === 0 ? t("chatbot.recommend.strong", "Strong") : t("chatbot.recommend.good", "Good"), 
          idx === 0 ? t("chatbot.recommend.whyPrimary", "Primary model featuring optimized specifications.") : t("chatbot.recommend.whySecondary", "Secondary option with alternate sizing.")
        ]);

        return finish({
          markdown: formatLimitedResponse(intro, headers, rows, [t("chatbot.recommend.confirm", "Confirm final model specs with sales before buying.")], []),
          followups: ["Compare these", "Build quote request", "Apply for financing"]
        }, nextMemory);
      }

      // Default guided prompt if no job matched
      nextMemory.awaiting = "quote_job";
      return finish({
        markdown: t("chatbot.recommend.askJob", "### What kind of work/job will you be doing?\n\nTell me the job type (e.g. digging trench, grading yards, lifting pallets, compacting driveways) so I can match you to the right Typhon product category."),
        followups: ["Digging trenches", "Lifting pallets", "Loading gravel", "Landscaping"]
      }, nextMemory);
    }

    case "Ask attachment fitment": {
      const res = matchProductAndSpec(mLower, memory.activeMachine, pathname);
      if (res.product) {
        const profile = getCanonicalProfiles().find(p => p.id === res.product?.id);
        if (profile) {
          const compatible = profile.attachmentCompatibility.length > 0 
            ? profile.attachmentCompatibility.join(", ") 
            : t("chatbot.attachments.defaultList", "Hydraulic augers, trenchers, breakers, thumbs, and grading buckets.");
          
          let intro = t("chatbot.attachments.intro", "### TYPHON {model} Attachment Compatibility\n\n**Fits auxiliary attachments:** Yes.\n\n*Based on catalog compatibility records:*").replace("{model}", profile.displayName);
          const bullets = [
            `**${t("chatbot.attachments.flow", "Hydraulic flow")}:** ${profile.hydraulicFlow}`,
            `**${t("chatbot.attachments.couplers", "Compatible couplers")}:** ${t("chatbot.attachments.couplersDesc", "Standard quick coupler fitment.")}`,
            `**${t("chatbot.attachments.included", "Included with machine")}:** ${t("chatbot.attachments.includedDesc", "check bundle specifications.")}`,
            `**${t("chatbot.attachments.warning", "Fitment Warning: Attachment configuration must be confirmed with sales before final shipment.")}**`
          ];

          return finish({
            markdown: formatLimitedResponse(intro, null, null, bullets, []),
            followups: ["Build quote request", "Ask about warranty"]
          }, nextMemory);
        }
      }

      return finish({
        markdown: t("chatbot.attachments.notFound", "I can check attachment fitment compatibility. Which TYPHON machine model do you own or are looking at? (e.g., STOMP 509 or TERROR XXV)"),
        followups: ["Does pallet fork fit STOMP 509?", "Check attachment compatibility"]
      }, nextMemory);
    }

    case "Ask warranty": {
      return finish({
        markdown: t("chatbot.warranty.markdown", "### Standard Typhon Warranty\n\nEvery Typhon machine includes a **1-year warranty + lifetime technical support** standard.\n\nThis covers structural components, main hydraulic pumps, and engines. Wear items are owner-maintained. Contact sales for details."),
        followups: ["What does the warranty cover?", "Build quote request"]
      }, nextMemory);
    }

    case "Ask shipping": {
      return finish({
        markdown: t("chatbot.shipping.markdown", "### Continental U.S. Shipping Policy\n\n**Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**\n\nDomestic flat-rate freight is organized directly to residential or commercial addresses. Liftgate offloading assistance available."),
        followups: ["Overseas sales inquiry", "Build quote request"]
      }, nextMemory);
    }

    case "Ask overseas shipping": {
      return finish({
        markdown: t("chatbot.shipping.overseas.markdown", "### Overseas & International Inquiries\n\n**Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**\n\nWe coordinate sea containers and custom broker export invoicing directly. Handoff to sales is required to estimate custom port costs."),
        followups: ["Build quote request", "Ask about financing"],
        handoff: true
      }, nextMemory);
    }

    case "Ask price": {
      const res = matchProductAndSpec(mLower, memory.activeMachine, pathname);
      if (res.product) {
        const profile = getCanonicalProfiles().find(p => p.id === res.product?.id);
        if (profile) {
          return finish({
            markdown: t("chatbot.price.markdown", "### TYPHON {model} Pricing\n\n**Listed price:** **{price}**\n\n*Final price and availability should be confirmed with sales.*").replace("{model}", profile.name).replace("{price}", profile.price),
            followups: ["Build quote request", "Financing options", "Ask about warranty"]
          }, nextMemory);
        }
      }

      return finish({
        markdown: t("chatbot.price.notFound", "Which machine model are you checking the price for? Tell me the model (e.g. STOMP 509 or TERROR XXV) to view pricing."),
        followups: ["Find the right TYPHON machine", "Compare TYPHON equipment"]
      }, nextMemory);
    }

    case "Ask stock": {
      return finish({
        markdown: t("chatbot.stock.markdown", "### Catalog Stock Availability\n\n**Stock should be confirmed with sales.** California ready stock fluctuates daily. Please check in with sales to confirm chassis schedules."),
        followups: ["Build quote request", "Show financing options"]
      }, nextMemory);
    }

    case "Ask financing": {
      const config = getChatbotConfig();
      return finish({
        markdown: `### Financing Options\n\n${config.financingNotes || "We partner with Paramount Financial Services to offer flexible lease-to-own plans. 100% financing is available for qualified commercial, agricultural, and landscaping business buyers."}`,
        followups: ["Build quote request", "Apply for financing"]
      }, nextMemory);
    }

    case "Ask support": {
      return finish({
        markdown: `### Customer Support & Maintenance\n\nEvery machine includes a standard **${t("chatbot.warrantyVerbatim", "1-year warranty + lifetime technical support")}**.\n\nFor technical assistance, ordering replacement components, or general operator guidance, please submit a request to sales/support.`,
        followups: ["Contact sales team", "Apply for financing"]
      }, nextMemory);
    }

    case "Ask contact sales": {
      // Direct lead quote flow entry point
      nextMemory.awaiting = "quote_name";
      return finish({
        markdown: `### ${t("chatbot.quote.buildTitle", "Build your Quote Request (Step 1/5)")}\n\n${t("chatbot.quote.init", "I can help prepare your project details for the sales team. Let's begin: what is your **name**?")}`,
        followups: ["Cancel request"]
      }, nextMemory);
    }

    case "Ask beginner explanation": {
      return finish({
        markdown: `### ${t("chatbot.glossary.title", "Compact Machinery Terms (Explained Simply)")}

${t("chatbot.glossary.intro", "If you are new to heavy equipment, here are the most important terms translated into simple language:")}

1. **Operating Weight**:
   *~~Simple meaning~~*: Total weight of the machine ready to work. Higher weights provide more counterweight stability but require larger trailers.
2. **Hydraulic auxiliary flow (GPM)**:
   *~~Simple meaning~~*: Fluid power pumped through hoses to rotate attachments (like soil trenchers or post hole augers).
3. **Zero Tail Swing**:
   *~~Simple meaning~~*: The rear engine counterweight turns within the track base width, protecting nearby walls and fences from collision.

Would you like me to explain another term?`,
        followups: ["What does lift capacity mean?", "What does free lift mean?"]
      }, nextMemory);
    }

    case "Ask product URL": {
      const res = matchProductAndSpec(mLower, memory.activeMachine, pathname);
      if (res.product) {
        return finish({
          markdown: `### Product Page Link\n\nYou can explore details on the website catalog page:\n\n[View Catalog page](${res.product.href})`,
          followups: ["Build quote request", "Compare machines"]
        }, nextMemory);
      }
      return finish({
        markdown: "Which machine model's link do you need? (e.g. STOMP 509 or TERROR XXV)",
        followups: ["Browse mini excavators", "Browse skid steers"]
      }, nextMemory);
    }

    case "Ask image/gallery": {
      const res = matchProductAndSpec(mLower, memory.activeMachine, pathname);
      if (res.product) {
        const imgUrl = res.product.image || "/img/placeholder-machinery.png";
        return finish({
          markdown: `### TYPHON ${res.product.name} Gallery\n\n![${res.product.name}](${imgUrl})\n\n*(Catalog media placeholder shown)*`,
          followups: ["Build quote request", "Show key specs"]
        }, nextMemory);
      }
      return finish({
        markdown: "Which machine's pictures do you want to inspect?",
        followups: ["Browse mini excavators", "Browse skid steers"]
      }, nextMemory);
    }

    case "Ask category browsing": {
      return finish({
        markdown: t("chatbot.categoryBrowsing", "Which category lineup would you like to browse?\n\n- Mini Excavators\n- Skid Steer Loaders\n- Wheel Loaders\n- Electric Forklifts\n- Road Rollers\n- Attachments"),
        followups: ["Browse mini excavators", "Browse skid steers", "Browse forklifts", "Browse attachments"]
      }, nextMemory);
    }

    case "Unknown question":
    default: {
      return finish({
        markdown: t("chatbot.unknownQuestion", "I'd be glad to help. Are you looking to find the right machine, check a specification (like horsepower or weight), check attachment fitment, or contact sales for a quote?"),
        followups: ["Find the right machine", "Compare stomp models", "Ask sales"]
      }, nextMemory);
    }
  }
}

export function getWelcomeText(lang: string = "EN"): string {
  const t = getT(lang);
  return t("chatbot.welcome.completeGreeting", WELCOME);
}

import { getSimilarityScore } from "./matchingEngine";
export { getSimilarityScore };

export function getSpecValAndConfidence(
  rawProduct: any, 
  specName: string
): { value: string; source: string; confidence: string; warning?: string } {
  const profiles = getCanonicalProfiles();
  const profile = profiles.find(p => p.id === rawProduct.id);
  if (!profile) {
    return { value: "Not listed", source: "Not listed", confidence: "Missing" };
  }

  const specFieldMap: Record<string, keyof CanonicalProfile> = {
    "Horsepower": "horsepower",
    "Engine": "engineModel",
    "Weight": "operatingWeight",
    "Lift Capacity": "liftCapacity",
    "Digging Depth": "diggingDepth",
    "Dimensions": "overallWidth",
    "Price": "price",
    "Stock": "stockNote",
    "Product URL": "productUrl",
    "Image": "image"
  };

  const key = specFieldMap[specName];
  if (!key) {
    return { value: "Not listed", source: "Not listed", confidence: "Missing" };
  }

  const val = profile[key];
  if (!val || val === "Not listed") {
    return { value: "Not listed", source: "Not listed", confidence: "Missing" };
  }

  let source = "Product DB";
  let confidence = "High";
  
  if (profile.raw?.specs) {
    const hasSpec = profile.raw.specs.some((s: any) => s.label.toLowerCase() === specName.toLowerCase());
    if (hasSpec) {
      source = "Product Spec Table";
      confidence = "High";
    }
  }

  if (typeof window !== "undefined") {
    const customRaw = window.localStorage.getItem("kz-chatbot-products-custom");
    if (customRaw) {
      try {
        const custom = JSON.parse(customRaw);
        if (custom[profile.id]?.specs?.some((s: any) => s.label.toLowerCase() === specName.toLowerCase())) {
          source = "Admin Override";
          confidence = "Verified";
        }
      } catch {}
    }
  }

  return { value: String(val), source, confidence };
}

export function normalizeSpecValue(specName: string, val: string): string {
  if (!val || val === "Not listed") return "Not listed";
  return val.trim();
}
