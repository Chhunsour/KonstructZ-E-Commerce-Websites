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
import { matchProductAndSpec, getCanonicalProducts, parseWeightNumber, parsePriceNumber, isSkuSearchQuery, executeSkuSearch, getSkuDisplayName } from "./matchingEngine";
import { getCanonicalProfiles, type CanonicalProfile } from "./canonicalProfiles";
import { dictionaries, type LanguageCode } from "../../i18n/dictionaries";
import { productKnowledgeService } from "./productKnowledgeService";
import { chatResponseService } from "./chatResponseService";
import { productMatcher } from "./productMatcher";

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
  capturedLead?: any;
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
    company?: string;
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
  if (prevIntentMatches(text, ["gtin", "sku", "upc", "barcode", "serial number"])) return "Ask GTIN/SKU";
  if (prevIntentMatches(text, ["who is typhon", "about typhon", "typhon brand", "typhon machinery", "what is typhon"])) return "Ask Typhon question";
  if (prevIntentMatches(text, ["who is konstructz", "about konstructz", "what is konstructz", "konstructz website"])) return "Ask Konstructz question";
  if (prevIntentMatches(text, ["warranty", "warranties", "guarantee", "lifetime support", "garantie", "garantía", "garantia", "保証", "보증", "质保", "保修"])) return "Ask warranty";
  if (prevIntentMatches(text, ["overseas", "international shipping", "export", "outre-mer", "internacional", "海外", "외국", "국외", "出口"])) return "Ask overseas shipping";
  if (prevIntentMatches(text, ["ship", "shipping", "delivery", "deliver", "livraison", "livrer", "enviar", "envío", "envio", "spedizione", "consegna", "versand", "liefern", "発送", "배달", "배송", "배달", "运输", "配送"])) return "Ask shipping";
  if (prevIntentMatches(text, ["price", "cost", "how much", "pricing", "prix", "coût", "cout", "precio", "costo", "prezzo", "preis", "kosten", "価格", "値段", "가격", "비용", "价格", "费用"])) return "Ask price";
  if (prevIntentMatches(text, ["finance", "financing", "lease", "paramount", "financement", "financer", "financiación", "financiacion", "finanziare", "finanziamento", "finanzierung", "finanzieren", "ローン", "融資", "금융", "할부", "融资", "贷款"])) return "Ask financing";
  if (prevIntentMatches(text, ["stock", "availability", "warehouse", "reserve", "disponibilité", "disponibilite", "entrepôt", "disponibilidad", "almacén", "almacen", "magazzino", "lager", "verfügbarkeit", "在庫", "倉庫", "재고", "창고", "现货", "库存", "仓库"])) return "Ask stock";
  if (prevIntentMatches(text, ["contact", "sales", "talk to human", "phone", "email", "contacter", "ventes", "contacto", "vendedor", "contatto", "vendite", "verkauf", "sales@typhon", "電話", "メール", "問い合わせ", "전화", "이메일", "문의", "联系", "销售", "电话", "邮箱", "buy this", "i want to buy", "quote", "devis", "cotización", "cotizacion", "preventivo", "見積", "견적", "报价"])) return "Ask contact sales";
  if (prevIntentMatches(text, ["help", "troubleshoot", "broken", "service", "parts", "aide", "aider", "panne", "pièces", "ayuda", "soporte", "repuestos", "aiuto", "assistenza", "hilfe", "support", "サポート", "故障", "部品", "도움", "고장", "부품", "帮助", "故障", "零件", "售后"])) return "Ask support";
  if (prevIntentMatches(text, ["pallet fork", "compatible", "fitment", "attachment", "fit", "work with", "accessoire", "compatibilité", "acoplamiento", "compatibilidad", "adattarsi", "zubehör", "kompatibel", "アタッチメント", "適合", "互換", "어태치먼트", "호환", "적합", "配件", "兼容", "适用"])) return "Ask attachment fitment";
  if (prevIntentMatches(text, ["compare", "vs", "versus", "difference", "bigger", "stronger", "lifts more", "comparer", "différence", "plus grand", "plus fort", "comparar", "diferencia", "más grande", "mas grande", "confrontare", "differenza", "vergleichen", "unterschied", "grösser", "groesser", "stärker", "staerker", "比較", "違い", "大きい", "強い", "비교", "차이", "크다", "강하다", "对比", "比较", "区别", "更大", "更强"])) return "Ask product comparison";
  if (prevIntentMatches(text, ["recommend", "choose", "find the right", "best for", "picker", "recommander", "choisir", "trouver", "recomendar", "elegir", "encontrar", "consigliare", "scegliere", "trovare", "empfehlen", "wählen", "waehlen", "finden", "お勧め", "選ぶ", "추천", "선택", "推荐", "选择"])) return "Ask machine recommendation";
  if (prevIntentMatches(text, ["what is", "explain", "meaning", "define", "what does", "qu'est-ce", "expliquer", "définir", "signification", "qué es", "que es", "explicar", "definir", "cos'è", "spiegare", "was ist", "erklären", "定義", "意味", "설명", "정의", "什么是", "解释", "定义"])) return "Ask beginner explanation";
  if (prevIntentMatches(text, ["details", "description", "tell me about", "overview", "détails", "aperçu", "detalles", "descripción", "dettagli", "panoramica", "beschreibung", "überblick", "詳細", "概要", "설명", "개요", "详情", "介绍", "概述"])) return "Ask product overview";
  if (prevIntentMatches(text, ["url", "link", "website", "lien", "site web", "enlace", "sito web", "webseite", "リンク", "웹사이트", "链接", "网址"])) return "Ask product URL";
  if (prevIntentMatches(text, ["image", "picture", "photo", "gallery", "image", "photo", "galerie", "imagen", "galería", "foto", "galleria", "bild", "galerie", "画像", "写真", "ギャラリー", "사진", "갤러리", "图片", "照片", "图集"])) return "Ask image/gallery";
  if (prevIntentMatches(text, ["cabin", "canopy", "closed cab", "enclosed cab", "open canopy", "cabine", "windshield", "a/c", "heater", "climate control", "ac/heater"])) return "Ask cabin canopy info";

  // Check specs synonyms
  const isSpec = ["hp", "horsepower", "engine", "weight", "lift", "dig", "depth", "dimensions", "size", "width", "height", "moteur", "poids", "largeur", "hauteur", "puissance", "cavalli", "potencia", "peso", "ps", "motor", "gewicht", "馬力", "エンジン", "重量", "마력", "엔진", "무게", "크기", "尺寸", "重量", "马力", "发动机"].some(s => text.includes(s));
  if (isSpec) return "Ask exact spec";

  // If the query is a simple product name matching a canonical product, treat as overview
  const lookup = matchProductAndSpec(text, memory.activeMachine);
  if ((lookup.product && lookup.confidence >= 80) || (lookup.type === "clarify" && lookup.candidates.length > 0)) {
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
  let detectedIntent = "Unknown question";

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

    let finalFollowups = ans.followups || [];
    if (finalFollowups.length > 0) {
      const activeProd = mem.activeMachine ? getCanonicalProfiles().find(p => p.id === mem.activeMachine?.id) : lookup.product;
      const dynamic = getDynamicFollowups(activeProd, detectedIntent, mLower, pathname);
      finalFollowups = Array.from(new Set([...finalFollowups.slice(0, 2), ...dynamic])).slice(0, 4);
    }

    const translatedFollowups = finalFollowups.map(f => {
      const key = `chatbot.followup.${f.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "")}`;
      return t(key, f);
    });
    return {
      answer: { ...ans, markdown: translatedMd, followups: translatedFollowups },
      memory: mem
    };
  };

  // Helper inside getReply scope or module scope
  function getDynamicFollowups(
    product: any,
    intent: string,
    mLowerStr: string,
    pathUrl?: string
  ): string[] {
    const isSkidSteer = (product?.category?.toLowerCase().includes("skid steer") || mLowerStr.includes("skid") || mLowerStr.includes("stomp"));
    const isExcavator = (product?.category?.toLowerCase().includes("excavator") || mLowerStr.includes("excavator") || mLowerStr.includes("terror") || mLowerStr.includes("tyrant") || mLowerStr.includes("flex"));
    const isBuyingIntent = (intent === "Ask contact sales" || mLowerStr.includes("buy") || mLowerStr.includes("quote") || mLowerStr.includes("contact"));

    if (isBuyingIntent) {
      return ["Ask for a quote", "Check shipping", "Save my contact info"];
    }
    if (isSkidSteer) {
      return ["What attachments fit this?", "Compare with another skid steer", "Send me the product link"];
    }
    if (isExcavator) {
      return ["What is the digging depth?", "Does it have Kubota engine?", "Compare mini excavators"];
    }
    return ["Find the right TYPHON machine", "Compare TYPHON equipment", "Ask about warranty/support"];
  }

  // SKU/GTIN/Product Code Search Interceptor
  const profiles = getCanonicalProfiles();
  const skuSearchResult = executeSkuSearch(m, profiles);

  if (skuSearchResult.isSkuSearch || skuSearchResult.exactMatch) {
    detectedIntent = "Ask GTIN/SKU";
    const matchedProfile = skuSearchResult.exactMatch;
    if (matchedProfile) {
      nextMemory.activeMachine = {
        id: matchedProfile.id,
        name: matchedProfile.name,
        href: matchedProfile.productUrl,
        categoryLabel: matchedProfile.category,
        brand: matchedProfile.brand as any,
        image: matchedProfile.image || undefined
      };

      const name = getSkuDisplayName(matchedProfile);
      const sku = matchedProfile.sku !== "Not listed" ? matchedProfile.sku : "This spec is not listed yet.";
      const gtin = matchedProfile.gtin !== "Not listed" ? matchedProfile.gtin : "This spec is not listed yet.";
      const brand = matchedProfile.brand !== "Not listed" ? matchedProfile.brand : "Typhon";
      const category = matchedProfile.category !== "Not listed" ? matchedProfile.category : "This spec is not listed yet.";
      const price = matchedProfile.price !== "Not listed" ? matchedProfile.price : "This spec is not listed yet.";
      const shortDesc = matchedProfile.shortSummary !== "Not listed" ? matchedProfile.shortSummary : "This spec is not listed yet.";
      const pUrl = matchedProfile.productUrl || `/typhon-machinery/${matchedProfile.id}`;

      const hp = matchedProfile.horsepower !== "Not listed" ? matchedProfile.horsepower : "This spec is not listed yet.";
      const engine = matchedProfile.engineModel !== "Not listed" ? matchedProfile.engineModel : "This spec is not listed yet.";
      const weight = matchedProfile.operatingWeight !== "Not listed" ? matchedProfile.operatingWeight : "This spec is not listed yet.";
      const lift = matchedProfile.liftCapacity !== "Not listed" ? matchedProfile.liftCapacity : "This spec is not listed yet.";
      const depth = matchedProfile.diggingDepth !== "Not listed" ? matchedProfile.diggingDepth : "This spec is not listed yet.";

      const dimsVal = matchedProfile.overallWidth !== "Not listed"
        ? `Width: ${matchedProfile.overallWidth}, Height: ${matchedProfile.overallHeight}, Length: ${matchedProfile.overallLength}`
        : "This spec is not listed yet.";

      let header = "";
      const baseSku = sku.replace(/\s*(blue|red|yellow|green|black|white|orange|grey|gray)/gi, "");
      if (skuSearchResult.isLikelyDigitsMatch) {
        header = `I found a likely SKU match: ${baseSku}.`;
      } else {
        header = `Here’s what I found for SKU ${skuSearchResult.searchTerm.toUpperCase()}: ${name}.`;
      }

      let possibleMatchNote = "";
      if (skuSearchResult.isPossibleMatch) {
        possibleMatchNote = `*(Note: This is a possible match based on the product model/name)*\n\n`;
      }

      const missingList: string[] = [];
      const fieldsToCheck = {
        "Engine Output": hp,
        "Engine Model": engine,
        "Operating Weight": weight,
        "Lift Capacity": lift,
        "Digging Depth": depth,
        "Dimensions": dimsVal,
        "Price": price,
        "SKU": sku,
        "GTIN": gtin
      };
      for (const [name, val] of Object.entries(fieldsToCheck)) {
        if (!val || val === "This spec is not listed yet.") {
          missingList.push(name);
        }
      }

      let markdown = `${header}\n\n${possibleMatchNote}`;
      markdown += `* **Product Name:** ${name}\n`;
      markdown += `* **SKU:** ${sku}\n`;
      markdown += `* **GTIN:** ${gtin}\n`;
      markdown += `* **Brand:** ${brand}\n`;
      markdown += `* **Category:** ${category}\n`;
      markdown += `* **Price:** ${price}\n`;
      markdown += `* **Short Description:** ${shortDesc}\n`;
      markdown += `* **Key Specs:**\n`;
      markdown += `  * **Horsepower:** ${hp}\n`;
      markdown += `  * **Engine:** ${engine}\n`;
      markdown += `  * **Operating Weight:** ${weight}\n`;
      markdown += `  * **Lift Capacity:** ${lift}\n`;
      markdown += `  * **Digging Depth:** ${depth}\n`;
      markdown += `  * **Dimensions:** ${dimsVal}\n`;
      markdown += `* **Product Link:** [Explore ${matchedProfile.name} Catalog Page](${pUrl})`;

      if (missingList.length > 0) {
        markdown += `\n\n*Note: The following fields are not listed yet: ${missingList.join(", ")}.*`;
      }

      const finishAns = finish({
        markdown,
        products: [nextMemory.activeMachine],
        followups: [`Compare ${matchedProfile.name}`, `Build quote request`, `Ask sales team`]
      }, nextMemory);

      return finishAns;
    }

    const suggestions = skuSearchResult.allCandidates.slice(0, 3);
    if (suggestions.length > 0) {
      const isPartial = skuSearchResult.partialMatches.length > 0;
      let header = "";
      if (isPartial) {
        header = `I could not find an exact SKU for ${skuSearchResult.searchTerm.toUpperCase()}. Did you mean one of these?`;
      } else {
        header = `I could not find an exact match for ${skuSearchResult.searchTerm}. These are the closest product codes I found:`;
      }

      let markdown = `${header}\n\n`;
      for (const p of suggestions) {
        const name = getSkuDisplayName(p);
        const sku = p.sku !== "Not listed" ? p.sku.replace(/\s*(blue|red|yellow|green|black|white|orange|grey|gray)/gi, "") : "Unknown SKU";
        markdown += `* ${sku} — ${name}\n`;
      }
      markdown += `\nWhich model did you want to check?`;

      return finish({
        markdown: markdown.trim(),
        followups: suggestions.map(p => `Show specs for ${p.name}`)
      }, nextMemory);
    }

    return finish({
      markdown: `I could not find a product matching the SKU or code "${skuSearchResult.searchTerm}". Could you please verify the number or provide one more detail, such as the machine model name (e.g. STOMP 509 or TERROR XXV) or category?`,
      followups: ["Find the right TYPHON machine", "Compare TYPHON equipment"]
    }, nextMemory);
  }


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

  // 2.5 Free-text contact detail parsing
  if (!memory.awaiting || !memory.awaiting.startsWith("quote_")) {
    const parsedContact = parseContactDetails(m);
    if (parsedContact && (parsedContact.email || parsedContact.phone)) {
      const leadName = parsedContact.name || "Valued Customer";
      const leadCompany = parsedContact.company || "";
      const leadEmail = parsedContact.email || "";
      const leadPhone = parsedContact.phone || "";

      return finish({
        markdown: `### Lead Capture Success\n\nThank you, **${leadName}**! I have successfully captured your contact details and routed them to our sales team:\n\n* **Name:** ${leadName}\n${leadCompany ? `* **Company:** ${leadCompany}\n` : ""}${leadEmail ? `* **Email:** ${leadEmail}\n` : ""}${leadPhone ? `* **Phone:** ${leadPhone}\n` : ""}\nOur sales specialists will contact you shortly regarding Typhon Machinery products.`,
        followups: ["Find the right TYPHON machine", "Browse categories"],
        handoff: true,
        capturedLead: {
          sourcePage: pathname || "",
          name: leadName,
          company: leadCompany,
          email: leadEmail,
          phone: leadPhone,
          productInterest: memory.activeMachine?.name || "",
          message: "Direct contact info provided in chat: " + m,
          location: "",
          chatTranscriptSummary: "" // Will be updated in ChatAssistant
        }
      }, nextMemory);
    }
  }

  // 3. Guided Quote Request Builder Flow
  if (memory.awaiting && memory.awaiting.startsWith("quote_")) {
    const quoteSlots = memory.quoteSlots ? { ...memory.quoteSlots } : {};

    if (memory.awaiting === "quote_name") {
      quoteSlots.name = m;
      nextMemory.quoteSlots = quoteSlots;
      nextMemory.awaiting = "quote_company";
      return finish({
        markdown: `### Guided Quote Request (Step 2/6)\n\nNice to meet you, **${m}**! What is your **company name**? (Type 'none' or 'skip' to skip)`,
        followups: ["Skip company", "Cancel quote request"]
      }, nextMemory);
    }

    if (memory.awaiting === "quote_company") {
      quoteSlots.company = (mLower === "skip company" || mLower === "none" || mLower === "skip") ? "" : m;
      nextMemory.quoteSlots = quoteSlots;
      nextMemory.awaiting = "quote_contact";
      return finish({
        markdown: `### Guided Quote Request (Step 3/6)\n\nWhat is the best **email address or phone number** for our team to contact you?`,
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
          markdown: `### Guided Quote Request (Step 4/5)\n\n${t("chatbot.quote.prefilledProduct", "Got it. We have pre-filled")} **TYPHON ${memory.activeMachine.name}** ${t("chatbot.quote.productOfInterest", "as your product of interest. What **type of work/job** will you be doing with this machine?")}`,
          followups: ["Digging trenches", "Lifting pallets", "Loading gravel", "Landscaping", "Cancel quote request"]
        }, nextMemory);
      } else {
        nextMemory.awaiting = "quote_product";
        return finish({
          markdown: `### Guided Quote Request (Step 4/6)\n\n${t("chatbot.quote.whatProduct", "Got it. Which **TYPHON machine or model** (e.g. TERROR XXV or STOMP 509) are you interested in quoting?")}`,
          followups: ["TERROR XXV", "STOMP 509", "TYRANT 17", "Cancel quote request"]
        }, nextMemory);
      }
    }

    if (memory.awaiting === "quote_product") {
      quoteSlots.product = m;
      nextMemory.quoteSlots = quoteSlots;
      nextMemory.awaiting = "quote_job";
      return finish({
        markdown: `### Guided Quote Request (Step 5/6)\n\n${t("chatbot.quote.workTypePrompt", "Understood. What **type of work/job** will you be doing with the machine? (e.g., landscaping, utility trenching, farm chores)")}`,
        followups: ["Digging trenches", "Lifting pallets", "Loading gravel", "Landscaping", "Cancel quote request"]
      }, nextMemory);
    }

    if (memory.awaiting === "quote_job") {
      quoteSlots.job = m;
      nextMemory.quoteSlots = quoteSlots;
      nextMemory.awaiting = "quote_location";
      const stepTotal = quoteSlots.product ? "5/5" : "6/6";
      return finish({
        markdown: `### Guided Quote Request (Step ${stepTotal})\n\n${t("chatbot.quote.locationPrompt", "Perfect. What is your **shipping location** (City, State, or Country)?")}`,
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
| **${t("chatbot.compare.company", "Company")}** | ${quoteSlots.company || "Not listed"} |
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
  detectedIntent = detectIntent(m, memory);

  switch (detectedIntent) {
    case "Greeting": {
      return finish({
        markdown: t("chatbot.greeting", "Hi there! I'm your Typhon product expert and sales advisor. I can answer exact specifications, help you choose the right machine for your job, check attachment compatibility, or guide you through financing and shipping details. What can I help you build today?"),
        followups: ["Find the right TYPHON machine", "Compare TYPHON equipment", "Ask about warranty/support"]
      }, nextMemory);
    }

    case "Ask GTIN/SKU": {
      const res = matchProductAndSpec(mLower, memory.activeMachine, pathname);
      if (res.product) {
        const profile = getCanonicalProfiles().find(p => p.id === res.product?.id);
        if (profile) {
          const skuVal = profile.sku !== "Not listed" ? profile.sku : "This spec is not listed yet.";
          const gtinVal = profile.gtin !== "Not listed" ? profile.gtin : "This spec is not listed yet.";
          return finish({
            markdown: `### TYPHON ${profile.name} SKU & GTIN\n\n* **SKU (Stock Keeping Unit):** ${skuVal}\n* **GTIN (Global Trade Item Number):** ${gtinVal}\n\n*This information is sourced directly from the official catalog inventory.*`,
            followups: [`Show specs for ${profile.name}`, `Build quote request`]
          }, nextMemory);
        }
      }
      return finish({
        markdown: `Which TYPHON machine model's SKU or GTIN do you need? (e.g., STOMP 509 or TERROR XXV)`,
        followups: ["SKU for STOMP 509", "GTIN for TERROR XXV"]
      }, nextMemory);
    }

    case "Ask Typhon question": {
      return finish({
        markdown: `### About Typhon\n\n**Typhon** (formerly Typhon Machinery) is a premium manufacturer of mini excavators, mini skid steers, wheel loaders, and electric forklifts designed for high performance, reliability, and value. Every Typhon machine includes a standard 1-year warranty and lifetime technical support. You can browse and purchase Typhon equipment directly on the **Konstructz** website.`,
        followups: ["Browse Typhon excavators", "Browse Typhon skid steers", "Ask about warranty"]
      }, nextMemory);
    }

    case "Ask Konstructz question": {
      return finish({
        markdown: `### About Konstructz\n\n**Konstructz** is your premier online e-commerce platform and marketplace for high-quality compact machinery, attachments, and commercial construction equipment. We offer flexible financing, nation-wide shipping, and direct support for all products listed on our platform.`,
        followups: ["Browse categories", "Ask about financing", "Contact sales"]
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

      if (!val || val === "Not listed") {
        md += `**Not listed**\n\nThis specification is not listed in the official product catalog database for this model. Please contact our sales team to confirm the exact figures.\n\n`;
      } else {
        md += `**${val}**\n\n`;
      }

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
          products: res.candidates.map(c => ({ id: c.id, name: c.name, href: c.url || `/typhon-machinery/${c.id}`, categoryLabel: c.category, brand: c.brand as any, image: c.image || undefined })),
          followups: res.candidates.map(c => `${c.name}`)
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

      const formattedMarkdown = formatProductOverview(profile, t);

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
      const compResult = productMatcher.matchComparison(mLower);

      // Internal matching logs (for development and debug safety)
      // Query: mLower
      // Matches Found: compResult.matchesFound
      // Product A: compResult.productA?.name
      // Product B: compResult.productB?.name
      // Candidates: compResult.candidates
      console.log("[Comparison Engine Log]", {
        query: mLower,
        productA: compResult.productA?.name || "None",
        productB: compResult.productB?.name || "None",
        matchesFound: compResult.matchesFound,
        candidates: compResult.candidates.map(c => c.name)
      });

      if (compResult.matchesFound >= 2 && compResult.productA && compResult.productB) {
        const md = chatResponseService.formatModelComparison(compResult.productA, compResult.productB, t);
        return finish({
          markdown: md,
          followups: ["Build quote request", "Apply for financing", "Contact sales"]
        }, nextMemory);
      }

      if (compResult.matchesFound === 1 && compResult.productA) {
        const anchor = compResult.productA;
        const profiles = getCanonicalProfiles();

        // Find a similar model in the same category, prioritizing closest weight
        const anchorProfile = profiles.find(p => p.id === anchor.id)!;
        const sameCategory = profiles.filter(p => p.id !== anchor.id && p.category === anchorProfile.category);

        let similar = sameCategory[0];
        if (sameCategory.length > 1) {
          // Sort by weight difference
          const anchorWeight = parseWeightNumber(anchorProfile.operatingWeight);
          sameCategory.sort((a, b) => {
            const diffA = Math.abs(parseWeightNumber(a.operatingWeight) - anchorWeight);
            const diffB = Math.abs(parseWeightNumber(b.operatingWeight) - anchorWeight);
            return diffA - diffB;
          });
          similar = sameCategory[0];
        }

        if (similar) {
          const md = chatResponseService.formatModelComparison(anchor, similar, t);
          return finish({
            markdown: md,
            followups: ["Build quote request", "Check shipping costs"]
          }, nextMemory);
        } else {
          return finish({
            markdown: `I found **${anchorProfile.name}**, but could not find similar models of the same category in our listed data to compare it with.`,
            followups: ["Build quote request", "Show specs"]
          }, nextMemory);
        }
      }

      // If no exact matched products found
      if (compResult.candidates.length > 0) {
        const matchesText = compResult.candidates.map(c => `* **${c.name}** ([Explore product catalog page](${c.url || `/typhon-machinery/${c.id}`}))`).join("\n");
        return finish({
          markdown: `I could not find an exact match for '${m}'. I found these close matches:\n\n${matchesText}\n\nWhich model did you want to compare?`,
          followups: compResult.candidates.map(c => `Compare ${c.name}`)
        }, nextMemory);
      }

      return finish({
        markdown: t("chatbot.compare.prompt", "I'd be glad to compare two TYPHON models. Tell me the two models (for example *“stomp 509 vs stomp x1300”*) and I'll compile a comparison table for you."),
        followups: ["Compare STOMP 509 vs STOMP X1300", "Compare TERROR XXV vs TYRANT 17"]
      }, nextMemory);
    }

    case "Ask machine recommendation": {
      // Check for farm/agricultural queries
      if (/\b(farm|hay|chores|agricultural|gardening)\b/i.test(mLower)) {
        return finish({
          markdown: `### Recommended Equipment for Farm Chores & Agricultural Work

For farming and agricultural operations (such as moving feed, lifting hay bales, manure management, or clearing brush), we highly recommend:
1. **TYPHON STOMP 509 Mini Skid Steer**: Exceptional maneuverability, compatible with Pallet Forks, Augers, and standard Buckets.
2. **TYPHON Tyrant 17 Mini Excavator**: Best for fence post digging, irrigation line layout, and ditch clearing.

*Note: All recommendations are based on real, catalog-confirmed products.*`,
          followups: ["Compare STOMP 509 vs Tyrant 17", "Build quote request", "Check shipping options"]
        }, nextMemory);
      }

      // Check for unsupported product categories (scissor lift, stone crusher)
      if (/\b(scissor lift|lift high|working high)\b/i.test(mLower)) {
        return finish({
          markdown: `### Scissor Lifts Availability\n\nWe currently do not offer scissor lifts or high-access aerial platforms in our active product catalog. We recommend browsing our available mini excavators and mini skid steer loaders for ground-based material handling.`,
          followups: ["Browse Typhon excavators", "Browse Typhon skid steers"]
        }, nextMemory);
      }

      if (/\b(stone crusher|rock crusher|crusher)\b/i.test(mLower)) {
        return finish({
          markdown: `### Stone Crushers Availability\n\nStone crushers and heavy rock crushing machinery are not listed in our current catalog. We do offer auxiliary attachments (like breakers/augers) for our mini excavator lineup.`,
          followups: ["Browse excavator attachments", "Browse Typhon excavators"]
        }, nextMemory);
      }

      // Check job recommendation shortcuts
      let matchedCategory = "";
      let jobTitle = "General project work";
      if (/\b(dig|digging|trench|excavat)\b/i.test(mLower)) {
        matchedCategory = "Mini Excavator";
        jobTitle = "Digging & Trenching";
      } else if (/\b(load|grading|dirt|gravel|mulch|skid|loader)\b/i.test(mLower)) {
        matchedCategory = "Skid Steer";
        jobTitle = "Loading & Grading";
      } else if (/\b(pallet|warehouse|lift|forks|forklift)\b/i.test(mLower)) {
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
      // Check for generic category attachment requests
      const isSkidSteerAttach = /\b(skid steer|loader|stomp)\b/i.test(mLower);
      const isExcavatorAttach = /\b(excavator|terror|digger|tyrant|flex)\b/i.test(mLower);

      if (isSkidSteerAttach && !isExcavatorAttach) {
        return finish({
          markdown: `### TYPHON Skid Steer Loader Attachments

Our **TYPHON STOMP mini skid steer loaders** feature a standard quick coupler and dual auxiliary hydraulic flow lines (main flow 11.4 GPM, auxiliary 5.7 GPM).

**Compatible attachments:**
* Standard Skid Steer Bucket (included)
* Pallet Forks (ideal for moving cargo/pallets)
* Post-hole Augers (for digging fence post holes)
* Trenchers (for laying pipes/cables)
* Hydraulic Breakers / Jackhammers
* Sweepers / Angle Brooms
* Forestry Mulchers & Brush Cutters
* Snow Blades & Snow Blowers
* Rototillers

Would you like to get a quote or see financing options for a TYPHON loader or attachments?`,
          followups: ["Compare STOMP loaders", "Build quote request"]
        }, nextMemory);
      }

      if (isExcavatorAttach && !isSkidSteerAttach) {
        return finish({
          markdown: `### TYPHON Mini Excavator Attachments

All **TYPHON mini excavators** (from the TERROR XI up to the KUVUO 4.0) are equipped with standard auxiliary hydraulics and support a quick coupler workflow. Many bundles come with a package of attachments.

**Compatible attachments:**
* Quick Coupler
* 7.9 in Narrow Bucket (trenching)
* 15.7 in Trenching Bucket (standard)
* 19.7 in Plain Bucket & 23.6 in Tilting Bucket (grading)
* Hydraulic Thumb Clip (for grabbing logs/rocks)
* Post-hole Auger
* Hydraulic Breaker/Hammer (for concrete demolition)
* Ripper (for breaking hard soil/roots)
* Rake (for clearing land/brush)
* Grapple (for moving logs/wood)
* 23.6 in Screen Bucket

Would you like to check compatibility for a specific model like the STOMP 509 or TERROR XXV?`,
          followups: ["Does pallet fork fit STOMP 509?", "Build quote request"]
        }, nextMemory);
      }

      const res = matchProductAndSpec(mLower, memory.activeMachine, pathname);
      if (res.product) {
        const profile = getCanonicalProfiles().find(p => p.id === res.product?.id);
        if (profile) {
          const compatible = profile.attachmentCompatibility.length > 0
            ? profile.attachmentCompatibility.map(item => `* ${item}`).join("\n")
            : `* Hydraulic auger\n* Trencher\n* Hydraulic breaker\n* Hydraulic thumb\n* Grading bucket`;

          let intro = `### TYPHON ${profile.displayName} Attachment Compatibility\n\n**Fits auxiliary attachments:** Yes.\n\n*Compatible attachments for this model:*`;
          const bullets = [
            `**Hydraulic flow:** ${profile.hydraulicFlow}`,
            `**Compatible couplers:** Standard quick coupler fitment.`,
            `**Included with machine:** Check standard bundle configuration.`,
            `**Fitment Warning:** Attachment configuration must be confirmed with sales before final shipment.`
          ];

          return finish({
            markdown: `${intro}\n\n${compatible}\n\n* **Specifications:**\n  * ${bullets.join("\n  * ")}`,
            followups: ["Build quote request", "Ask about warranty"]
          }, nextMemory);
        }
      }

      return finish({
        markdown: t("chatbot.attachments.notFound", "I can check attachment fitment compatibility. Which TYPHON machine model do you own or are looking at? (e.g., STOMP 509 or TERROR XXV)"),
        followups: ["Does pallet fork fit STOMP 509?", "Check attachment compatibility"]
      }, nextMemory);
    }

    case "Ask cabin canopy info": {
      // If general query and query has specific indicators
      if (mLower.includes("no cabin") || mLower.includes("canopy") || mLower.includes("capony") || mLower.includes("open")) {
        return finish({
          markdown: `### TYPHON Open Canopy Models (No Cabin)

These models are designed with an **open operator platform** equipped with a protective overhead ROPS canopy (no enclosed cab or AC/Heater):

* **TYPHON Terror XI** (1.1-Ton Excavator)
* **TYPHON Terror X** (1-Ton Excavator)
* **TYPHON Terror XV** (1.05-Ton Excavator)
* **TYPHON Tyrant 17** (1.7-Ton Excavator)
* **TYPHON Flex 18 Pro** (1.8-Ton Excavator)
* **TYPHON STOMP Loaders** (STOMP 508, STOMP 509, STOMP X1300)

Would you like to get a quote or see specifications for one of these models?`,
          followups: ["Compare TERROR XI vs Tyrant 17", "Build quote request"]
        }, nextMemory);
      }

      if (mLower.includes("cabin") || mLower.includes("closed") || mLower.includes("enclosed")) {
        return finish({
          markdown: `### TYPHON Enclosed Cabin Models (with A/C & Heating)

These models feature a **fully enclosed, climate-controlled operator station** equipped with both **air conditioning and heating** standard:

* **TYPHON Terror XVIII Cabin / Prestige** (2-Ton Excavator)
* **TYPHON Terror XVII Cabin / Prestige** (2-Ton Excavator)
* **TYPHON Terror XIX Prestige** (2-Ton Excavator)
* **TYPHON KUVUO 4.0** (4-Ton Excavator)
* **TYPHON Terror LXV** (6.6-Ton Excavator)

Would you like to get a quote or see specifications for one of these models?`,
          followups: ["Compare TERROR XVIII Cabin vs Tyrant 17", "Build quote request"]
        }, nextMemory);
      }

      const res = matchProductAndSpec(mLower, memory.activeMachine, pathname);
      if (res.product) {
        const profile = getCanonicalProfiles().find(p => p.id === res.product?.id);
        if (profile) {
          const desc = profile.cabinType === "Enclosed Cab"
            ? `The TYPHON ${profile.name} features a **fully enclosed, climate-controlled cabin** equipped with both **air conditioning and heating** standard. This provides year-round operator comfort.`
            : `The TYPHON ${profile.name} has an **open station operator platform** equipped with a heavy-duty protective canopy (no enclosed cabin/AC).`;
          return finish({
            markdown: `### Operator Station details for TYPHON ${profile.name}\n\n* **Cabin Type:** ${profile.cabinType}\n* **A/C & Heater:** ${profile.acHeater}\n\n${desc}`,
            followups: [`Compare ${profile.name}`, `Show key specs for ${profile.name}`, `Build quote request`]
          }, nextMemory);
        }
      }

      // General cabin/canopy query fallback
      return finish({
        markdown: `### Operator Station options (Cabin vs. Canopy)

TYPHON mini excavators and loaders come in both enclosed climate-controlled cabin and open-canopy designs:

* **Enclosed Cabin Models (with A/C & Heating):**
  * **TYPHON Terror XVIII Cabin / Prestige** (2-Ton Excavator)
  * **TYPHON Terror XVII Cabin / Prestige** (2-Ton Excavator)
  * **TYPHON Terror XIX Prestige** (2-Ton Excavator)
  * **TYPHON KUVUO 4.0** (4-Ton Excavator)
  * **TYPHON Terror LXV** (6.6-Ton Excavator)

* **Open Canopy / Station Models (No Cabin):**
  * **TYPHON Terror XI** (1.1-Ton Excavator)
  * **TYPHON Terror X** (1-Ton Excavator)
  * **TYPHON Terror XV** (1.05-Ton Excavator)
  * **TYPHON Tyrant 17** (1.7-Ton Excavator)
  * **TYPHON Flex 18 Pro** (1.8-Ton Excavator)
  * **TYPHON STOMP Loaders** (Open platform)

Would you like to get a quote or see specifications for one of these models?`,
        followups: ["Compare TERROR XVIII Cabin vs Tyrant 17", "Build quote request"]
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

export function parseContactDetails(text: string): { name?: string; email?: string; phone?: string; company?: string } | null {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  // matches formats like 123456, 123-456-7890, +1 (213) 214-2203, etc.
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{6,11}\b/;
  const nameRegex = /(?:my name is|i am|call me)\s+([a-zA-Z\s]+?)(?:,|\.|\band\b|email|phone|$)/i;
  const companyRegex = /(?:my company is|company name is|work at|from)\s+([a-zA-Z0-9\s]+?)(?:,|\.|\band\b|email|phone|$)/i;

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const nameMatch = text.match(nameRegex);
  const companyMatch = text.match(companyRegex);

  if (emailMatch || phoneMatch || nameMatch) {
    return {
      name: nameMatch ? nameMatch[1].trim() : undefined,
      email: emailMatch ? emailMatch[1].trim() : undefined,
      phone: phoneMatch ? phoneMatch[0].trim() : undefined,
      company: companyMatch ? companyMatch[1].trim() : undefined,
    };
  }
  return null;
}

export function formatProductOverview(profile: CanonicalProfile, t: any): string {
  return chatResponseService.formatProductOverview(profile, t);
}
