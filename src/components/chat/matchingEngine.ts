import { 
  getMergedProducts, 
  PRODUCT_DETAIL, 
  PRODUCT_REFS, 
  getChatbotConfig,
  type ProductRef, 
  type ProductDetail 
} from "./knowledge";

export interface CanonicalProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  productType: string;
  price: string | null;
  url: string | null;
  image: string | null;
  aliases: string[];
  misspellings: string[];
  bestUseTags: string[];
  specs: Record<string, string>;
  attachmentCompatibility: string[];
  relatedProducts: string[];
  raw: any;
}

// Nickname query translations
export function resolveNicknames(cleanSearch: string): string {
  const s = cleanSearch.toLowerCase().trim()
    .replace(/^the\s+/i, "")
    .replace(/\s+one$/i, "");
  
  if (s === "big skid steer" || s === "stronger stomp") return "stomp x1300";
  if (s === "small excavator") return "terror xi";
  if (s === "cabin excavator" || s === "cabin one") return "terror xxv cabin";
  if (s === "blue forklift" || s === "electric forklift") return "forklift";
  if (s === "2 ton forklift" || s === "2 ton forklift lift") return "forklift 2.0 ton";
  if (s === "kubota excavator" || s === "typhon with kubota engine") return "terror xxv";
  if (s === "25hp" || s === "25hp excavator") return "terror xxv";
  if (s === "2.7 ton excavator") return "terror xxv";
  if (s === "mini loader") return "skoop ii";
  
  return cleanSearch;
}

// Strip leading zeros and trailing decimals like .0 to match "0509" -> "509" and "2.0" -> "2"
export function normalizeNumericTokens(s: string): string {
  return s.toLowerCase().trim()
    .replace(/\b0+(\d+)\b/g, "$1")
    .replace(/\b(\d+)\.0+\b/g, "$1");
}

export function formatCategorySlug(slug: string): string {
  if (!slug) return "";
  return slug.split("-")
             .map(w => w.charAt(0).toUpperCase() + w.slice(1))
             .join(" ")
             .replace(/s$/, ""); // singularize e.g. "road-rollers" -> "Road Roller"
}

// Typo tolerance: Edit distance / Levenshtein
export function editDistance(s1: string, s2: string): number {
  s1 = normalizeNumericTokens(s1);
  s2 = normalizeNumericTokens(s2);
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export function getFuzzySimilarity(s1: string, s2: string): number {
  const distance = editDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  if (maxLength === 0) return 1.0;
  return 1.0 - distance / maxLength;
}

// Smart word-overlap similarity score supporting small spelling errors
export function getSimilarityScore(s1: string, s2: string): number {
  const clean = (s: string) => normalizeNumericTokens(s).replace(/typhon\s+/gi, "").replace(/[^a-z0-9]/gi, " ");
  const w1 = clean(s1).split(/\s+/).filter(Boolean);
  const w2 = clean(s2).split(/\s+/).filter(Boolean);
  
  if (w1.length === 0 || w2.length === 0) return 0.0;
  
  let matchCount = 0;
  for (const w of w1) {
    if (w2.includes(w)) {
      matchCount += 1.0;
    } else {
      // Check typo match
      let bestWordSim = 0;
      for (const w_other of w2) {
        const sim = getFuzzySimilarity(w, w_other);
        if (sim > bestWordSim) {
          bestWordSim = sim;
        }
      }
      if (bestWordSim >= 0.78) {
        matchCount += bestWordSim;
      }
    }
  }
  
  return matchCount / Math.max(w1.length, w2.length, 1);
}

// Spec synonym dictionary
export const SPEC_SYNONYMS: Record<string, string[]> = {
  "Horsepower": ["horsepower", "hp", "horse power", "power", "engine power", "rated power", "kw"],
  "Engine": ["engine", "motor", "kubota", "diesel", "gas", "gasoline", "electric", "battery", "power plant"],
  "Weight": ["weight", "heavy", "how heavy", "operating weight", "machine weight", "ton", "tons", "lbs", "kg", "mass"],
  "Lift Capacity": ["lift", "lifting", "capacity", "lift capacity", "rated load", "max lift", "load capacity", "lifting capacity"],
  "Digging Depth": ["dig", "digging", "depth", "dig depth", "digging depth", "excavation depth", "max depth", "deep"],
  "Dimensions": ["size", "dimension", "dimensions", "width", "height", "length", "overall size", "wide", "tall", "long"],
  "Price": ["price", "cost", "how much", "pricing", "value", "msrp", "quote", "cost?", "tag"],
  "Stock": ["stock", "availability", "available", "lead time", "ready stock", "in stock", "delivery time"],
  "Product URL": ["url", "link", "page", "website", "product page", "product link"],
  "Image": ["image", "picture", "photo", "gallery", "look like"],
  "Shipping": ["ship", "shipping", "delivery", "deliver", "freight", "overseas", "international"],
  "Warranty": ["warranty", "warranties", "guarantee", "coverage"],
  "Financing": ["finance", "financing", "paramount", "payment", "monthly"],
  "Support": ["support", "tech support", "maintenance", "service"]
};

// Map short spec inputs
export function matchSpecSynonym(q: string): string | null {
  const text = q.toLowerCase().trim();
  for (const [specName, list] of Object.entries(SPEC_SYNONYMS)) {
    for (const syn of list) {
      if (text === syn || new RegExp(`\\b${syn}\\b`, "i").test(text)) {
        return specName;
      }
    }
  }
  return null;
}

// Parse alias maps from config
export function getAliasesMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  const config = getChatbotConfig();
  if (!config || !config.productAliases) return map;
  
  const lines = config.productAliases.split(";");
  for (const line of lines) {
    const parts = line.split(":");
    if (parts.length === 2) {
      const key = parts[0].trim().toLowerCase();
      const vals = parts[1].split(",").map(v => v.trim().toLowerCase()).filter(Boolean);
      map[key] = vals;
    }
  }
  return map;
}

// Generate canonical records dynamically
export function getCanonicalProducts(): CanonicalProduct[] {
  const { baseProducts, baseTyphonProducts } = getMergedProducts();
  const allRaw = [...baseProducts, ...baseTyphonProducts];
  const aliasMap = getAliasesMap();
  
  return allRaw.map(p => {
    const isAttachment = p.productType === "attachment";
    
    // Core Specs Extraction
    const specsMap: Record<string, string> = {};
    if (p.specs) {
      for (const s of p.specs) {
        const syn = matchSpecSynonym(s.label);
        if (syn) {
          specsMap[syn] = s.value;
        }
      }
    }
    
    // Set fallback key specs
    const horsepower = specsMap["Horsepower"] || p.specs?.find((s: any) => /power|hp/i.test(s.label))?.value || null;
    const engine = specsMap["Engine"] || p.specs?.find((s: any) => /engine/i.test(s.label))?.value || null;
    const weight = p.weight || specsMap["Weight"] || p.specs?.find((s: any) => /weight/i.test(s.label))?.value || null;
    const liftCapacity = specsMap["Lift Capacity"] || p.specs?.find((s: any) => /lift/i.test(s.label))?.value || null;
    const digDepth = specsMap["Digging Depth"] || p.specs?.find((s: any) => /dig/i.test(s.label))?.value || null;
    
    const finalSpecs: Record<string, string> = {
      "Horsepower": horsepower || "Not listed",
      "Engine": engine || "Not listed",
      "Weight": weight || "Not listed",
      "Lift Capacity": liftCapacity || "Not listed",
      "Digging Depth": digDepth || "Not listed"
    };

    // Auto-generate aliases
    const aliases = new Set<string>();
    const cleanName = p.name.toLowerCase().replace(/typhon\s+/gi, "").trim();
    aliases.add(cleanName);
    aliases.add(p.name.toLowerCase());
    
    // Split words
    const tokens = cleanName.split(/\s+/);
    if (tokens.length > 1) {
      for (const t of tokens) {
        if (t.length > 2 && !["mini", "excavator", "loader", "skid", "steer", "roller"].includes(t)) {
          aliases.add(t);
        }
      }
    }
    
    // Model numbers
    const modelMatch = p.name.match(/\b([A-Z0-9.]+)\b/i);
    if (modelMatch) {
      aliases.add(normalizeNumericTokens(modelMatch[1].toLowerCase()));
    }
    
    // Add custom defined aliases from config mapping
    const cleanLowerName = p.name.toLowerCase();
    for (const [key, vals] of Object.entries(aliasMap)) {
      if (
        cleanLowerName.includes(key) || 
        key.includes(cleanLowerName) ||
        (key.includes("vigor 1.5") && cleanLowerName.includes("1.5") && cleanLowerName.includes("forklift")) ||
        (key.includes("vigor 2") && cleanLowerName.includes("2.0") && cleanLowerName.includes("forklift")) ||
        (key.includes("terror") && cleanLowerName.includes("terror")) ||
        (key.includes("tyrant") && cleanLowerName.includes("tyrant")) ||
        (key.includes("stomp 509") && cleanLowerName.includes("0509")) ||
        (key.includes("stomp x1300") && cleanLowerName.includes("x1300")) ||
        (key.includes("skoop") && cleanLowerName.includes("skoop"))
      ) {
        for (const val of vals) {
          aliases.add(val);
        }
      }
    }

    if (p.aliases) {
      for (const a of p.aliases) {
        aliases.add(a.toLowerCase().trim());
      }
    }
    
    // Category aliases
    let cat = p.categoryLabel || "";
    if (!cat && (p as any).category) {
      cat = formatCategorySlug((p as any).category);
    }
    aliases.add(cat.toLowerCase());
    aliases.add(`typhon ${cat.toLowerCase()}`);
    if (cat.toLowerCase().includes("excavator")) {
      aliases.add("excavator");
      aliases.add("digger");
    } else if (cat.toLowerCase().includes("skid steer")) {
      aliases.add("skid steer");
      aliases.add("steer loader");
    } else if (cat.toLowerCase().includes("loader")) {
      aliases.add("loader");
      aliases.add("wheel loader");
    } else if (cat.toLowerCase().includes("forklift")) {
      aliases.add("forklift");
    }

    // Auto-generate common typos
    const misspellings = new Set<string>();
    if (cleanName.includes("terror")) {
      misspellings.add("teror");
      misspellings.add("terrror");
      misspellings.add("typon terror");
      misspellings.add("typhon teror");
    }
    if (cleanName.includes("tyrant")) {
      misspellings.add("tyrantt");
      misspellings.add("tirant");
    }
    if (cleanName.includes("stomp")) {
      misspellings.add("stom");
      misspellings.add("stomp x");
    }
    if (cleanName.includes("vigor") || cleanLowerName.includes("forklift")) {
      misspellings.add("vigro");
      misspellings.add("vigour");
    }
    if (cleanName.includes("skoop")) {
      misspellings.add("skop");
      misspellings.add("scoop");
    }

    const attachmentCompatibility = (p as any).attachmentCompatibility || [];

    const relatedProducts: string[] = [];
    if (cat.toLowerCase().includes("excavator")) {
      if (cleanName.includes("xxv") || cleanName.includes("x2")) {
        relatedProducts.push("tyrant-17");
      } else {
        relatedProducts.push("terror-xxv");
      }
    } else if (cat.toLowerCase().includes("skid steer")) {
      if (cleanName.includes("509")) {
        relatedProducts.push("stomp-x1300");
      } else {
        relatedProducts.push("stomp-509");
      }
    } else if (cleanName.includes("vigor") || cleanLowerName.includes("forklift")) {
      if (cleanName.includes("1.5")) {
        relatedProducts.push("vigor-2.0");
      } else {
        relatedProducts.push("vigor-1.5");
      }
    }

    return {
      id: p.id,
      name: p.name,
      brand: p.brand || "Typhon",
      category: cat,
      productType: p.productType || (isAttachment ? "attachment" : "machine"),
      price: p.price || p.currentPrice || null,
      url: p.url || p.sourceUrl || p.buttonUrl || null,
      image: p.image || null,
      aliases: Array.from(aliases),
      misspellings: Array.from(misspellings),
      bestUseTags: (p as any).bestUseCases || (p as any).applications || [],
      specs: finalSpecs,
      attachmentCompatibility,
      relatedProducts,
      raw: p
    };
  });
}

// Core Matching Engine
export function matchProductAndSpec(
  query: string, 
  activeMachine?: ProductRef, 
  currentPageUrl?: string
): MatchResult {
  const q = normalizeNumericTokens(query).replace(/[?.,!]/g, "").replace(/\s+/g, " ").trim();
  const specIntent = matchSpecSynonym(q);
  
  let attachmentCandidate = "";
  if (/\b(pallet fork|forks|auger|breaker|grapple|thumb|trencher|bucket)\b/i.test(q)) {
    const attMatch = q.match(/\b(pallet fork|forks|auger|breaker|grapple|thumb|trencher|bucket)\b/i);
    if (attMatch) attachmentCandidate = attMatch[1].toLowerCase();
  }

  // Isolate product terms
  let pSearch = q;
  for (const list of Object.values(SPEC_SYNONYMS)) {
    for (const syn of list) {
      pSearch = pSearch.replace(new RegExp(`\\b${syn}\\b`, "gi"), "");
    }
  }
  if (attachmentCandidate) {
    pSearch = pSearch.replace(new RegExp(`\\b${attachmentCandidate}\\b`, "gi"), "");
  }
  pSearch = pSearch.replace(/\s+/g, " ").trim();
  pSearch = resolveNicknames(pSearch);

  const products = getCanonicalProducts();
  
  if (!pSearch) {
    if (currentPageUrl) {
      const matchPage = products.find(p => p.url && currentPageUrl.includes(p.id));
      if (matchPage) {
        return {
          product: matchPage,
          intent: specIntent,
          confidence: 100,
          type: "direct",
          candidates: [matchPage]
        };
      }
    }
    
    if (activeMachine) {
      const matchActive = products.find(p => p.id === activeMachine.id || (p.url && activeMachine.href.includes(p.id)));
      if (matchActive) {
        return {
          product: matchActive,
          intent: specIntent,
          confidence: 100,
          type: "direct",
          candidates: [matchActive]
        };
      }
    }
    
    return {
      product: null,
      intent: specIntent,
      confidence: 30,
      type: "clarify",
      candidates: products.filter(p => ["terror-xi", "typhon-tyrant-17", "brand-new-typhon-stomp-mini-skid-steer-kubota-d1105-diesel-epa-engine-usa", "brand-new-typhon-stomp-x1300-25hp-kubota-diesel-mini-skid-steer-loader", "typhon-vigor-2-0"].includes(p.id)).slice(0, 5)
    };
  }

  // Score candidate products
  const scored = products.map(p => {
    let score = 0;
    
    const cleanSearch = normalizeNumericTokens(pSearch);
    const cleanProdName = normalizeNumericTokens(p.name);
    
    if (cleanProdName === cleanSearch) score = 100;
    else if (cleanProdName.replace(/typhon\s+/gi, "") === cleanSearch) score = 98;
    else {
      for (const a of p.aliases) {
        const cleanAlias = normalizeNumericTokens(a);
        if (cleanAlias === cleanSearch) {
          score = Math.max(score, 95);
        } else if (cleanAlias.includes(cleanSearch) || cleanSearch.includes(cleanAlias)) {
          score = Math.max(score, 88);
        }
      }
      
      for (const m of p.misspellings) {
        const cleanM = normalizeNumericTokens(m);
        if (cleanM === cleanSearch) {
          score = Math.max(score, 90);
        }
      }
      
      const nameSim = getSimilarityScore(cleanSearch, cleanProdName);
      if (nameSim >= 0.8) {
        score = Math.max(score, Math.round(nameSim * 95));
      }
    }
    
    if (currentPageUrl && p.url && currentPageUrl.includes(p.id)) {
      score += 15;
    }
    if (activeMachine && (p.id === activeMachine.id || (p.url && activeMachine.href.includes(p.id)))) {
      score += 10;
    }
    
    score = Math.min(score, 100);
    
    return { product: p, score };
  });

  // Model token exclusivity penalty
  const searchWords = normalizeNumericTokens(pSearch).split(/\s+/);
  const penalized = scored.map(item => {
    let score = item.score;
    const prodWords = normalizeNumericTokens(item.product.name).split(/\s+/);
    
    const hasModelNumber = /\b(x|x2|17|509|10|15|20|1300|xxv)\b/i;
    const searchModels = searchWords.filter(w => hasModelNumber.test(w));
    if (searchModels.length > 0) {
      const prodModels = prodWords.filter(w => hasModelNumber.test(w));
      const matchModel = searchModels.some(sm => prodModels.includes(sm));
      if (!matchModel && prodModels.length > 0) {
        score -= 25;
      }
    }
    return { ...item, score: Math.max(0, score) };
  });

  const validCandidates = penalized.filter(c => c.score >= 40).sort((a, b) => b.score - a.score);
  
  if (validCandidates.length === 0) {
    return {
      product: null,
      intent: specIntent,
      confidence: 0,
      type: "not_found",
      candidates: []
    };
  }

  const best = validCandidates[0];
  
  const closeCandidates = validCandidates.filter(c => c.product.id !== best.product.id && (best.score - c.score) <= 10);
  
  if (closeCandidates.length > 0) {
    return {
      product: null,
      intent: specIntent,
      confidence: 60,
      type: "clarify",
      candidates: [best.product, ...closeCandidates.map(c => c.product)].slice(0, 5)
    };
  }

  let type: MatchResult["type"] = "direct";
  if (best.score < 65) {
    type = "clarify";
  }

  return {
    product: best.product,
    intent: specIntent,
    confidence: best.score,
    type,
    candidates: validCandidates.map(c => c.product).slice(0, 5)
  };
}

export interface MatchResult {
  product: CanonicalProduct | null;
  intent: string | null;
  confidence: number;
  type: "direct" | "clarify" | "not_found";
  candidates: CanonicalProduct[];
}
