import {
  getMergedProducts,
  PRODUCT_DETAIL,
  PRODUCT_REFS,
  getChatbotConfig,
  type ProductRef,
  type ProductDetail
} from "./knowledge";

export function parsePriceNumber(priceStr: string | null): number {
  if (!priceStr) return Infinity;
  const cleaned = priceStr.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? Infinity : num;
}

export function parseWeightNumber(weightStr: string | null): number {
  if (!weightStr) return Infinity;
  const cleaned = weightStr.replace(/[^0-9.]/g, "");
  let num = parseFloat(cleaned);
  if (isNaN(num)) return Infinity;

  const lower = weightStr.toLowerCase();
  if (lower.includes("ton")) {
    num = num * 1000;
  }
  return num;
}

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
  let s = cleanSearch.toLowerCase().trim()
    .replace(/^the\s+/i, "")
    .replace(/\s+one$/i, "")
    .replace(/\btyphon machinery\b/g, "typhon")
    .replace(/\bx\s+1300\b/g, "x1300")
    .replace(/\b18\s+flex\b/g, "18 flex");

  if (s === "big skid steer" || s === "stronger stomp" || s === "big skid") return "stomp x1300";
  if (s === "small skid" || s === "small stomp") return "stomp 509";
  if (s.includes("small skid vs big skid") || s.includes("small skid steer vs big skid steer")) return "stomp 509 vs stomp x1300";

  if (s === "small excavator" || s === "cheap excavator" || s === "cheap" || s === "cheap one") return "terror xi";
  if (s === "cabin excavator" || s === "cabin one" || s === "with cabin" || s === "cabin" || s === "closed cabin") return "cabin";
  if (s === "no cabin" || s === "canopy" || s === "capony" || s === "open cabin") return "canopy";
  if (s === "blue forklift" || s === "electric forklift") return "forklift";
  if (s === "2 ton forklift" || s === "2 ton forklift lift") return "forklift 2.0 ton";
  if (s === "kubota excavator" || s === "typhon with kubota engine" || s === "kubota one" || s === "kubota") return "kubota";
  if (s === "25hp" || s === "25hp excavator") return "terror xxv";
  if (s === "2.7 ton excavator") return "terror xxv";
  if (s === "mini loader") return "skoop ii";

  // Lazy inputs smart mappings
  if (s === "stomp" || s === "mini skid" || s === "skid steer" || s === "skid" || s === "loader" || s === "skid with canopy") return "stomp";
  if (s === "509" || s === "stomp 509") return "stomp 509";
  if (s === "x1300" || s === "stomp x1300") return "stomp x1300";
  if (s === "507") return "stomp 508";
  if (s === "fork" || s === "forks" || s === "forklift") return "pallet fork";
  if (s === "tyrant") return "tyrant 17";
  if (s === "18 flex" || s === "flex 18" || s === "18flex") return "flex 18 pro";
  if (s === "flex pro") return "flex 18 pro";
  if (s === "attachment for skid steer" || s === "skid steer attachment" || s === "skid steer attachments" || s === "attachment for skid" || s === "attachments for skid") return "skid steer attachments";

  return s;
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
  const clean = (s: string) => normalizeNumericTokens(s)
    .replace(/typhon machinery/gi, "")
    .replace(/typhon/gi, "")
    .replace(/[^a-z0-9]/gi, " ");
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

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
  const qLower = pSearch.toLowerCase();

  // 1. Direct Page / Active Machine Context Check
  const hasThis = /\bthis\b/i.test(q) || /\bthis\b/i.test(query);
  if (!qLower || qLower === "this" || qLower === "this machine" || qLower === "this product" || hasThis) {
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
  }

  // 1.5 Cheap or Small Category Check
  const wantsCheap = /\b(cheap|cheapest|low price|lowest price|affordable)\b/i.test(query) || /\b(cheap|cheapest|low price|lowest price|affordable)\b/i.test(qLower);
  const wantsSmall = /\b(small|smallest|compact|tiny|mini)\b/i.test(query) || /\b(small|smallest|compact|tiny|mini)\b/i.test(qLower);

  if (wantsCheap || wantsSmall) {
    let categoryProducts = products;
    if (/\b(excavator|digger|terror|tyrant|flex)\b/i.test(qLower) || /\b(excavator|digger|terror|tyrant|flex)\b/i.test(query)) {
      categoryProducts = products.filter(p => p.category.toLowerCase().includes("excavator"));
    } else if (/\b(forklift|vigor)\b/i.test(qLower) || /\b(forklift|vigor)\b/i.test(query)) {
      categoryProducts = products.filter(p => p.category.toLowerCase().includes("forklift") || p.name.toLowerCase().includes("forklift"));
    } else if (/\b(skid steer|loader|stomp|skoop)\b/i.test(qLower) || /\b(skid steer|loader|stomp|skoop)\b/i.test(query)) {
      categoryProducts = products.filter(p => p.category.toLowerCase().includes("loader") || p.category.toLowerCase().includes("skid"));
    } else if (/\b(roller)\b/i.test(qLower) || /\b(roller)\b/i.test(query)) {
      categoryProducts = products.filter(p => p.category.toLowerCase().includes("roller"));
    }

    if (categoryProducts.length > 0) {
      if (wantsCheap) {
        const sorted = [...categoryProducts].sort((a, b) => {
          const aPrice = parsePriceNumber(a.price);
          const bPrice = parsePriceNumber(b.price);
          return aPrice - bPrice;
        });
        return {
          product: sorted[0],
          intent: specIntent,
          confidence: 98,
          type: "direct",
          candidates: [sorted[0]]
        };
      } else {
        const sorted = [...categoryProducts].sort((a, b) => {
          const aWeight = parseWeightNumber(a.specs["Weight"] || a.raw?.weight);
          const bWeight = parseWeightNumber(b.specs["Weight"] || b.raw?.weight);
          return aWeight - bWeight;
        });
        return {
          product: sorted[0],
          intent: specIntent,
          confidence: 98,
          type: "direct",
          candidates: [sorted[0]]
        };
      }
    }
  }

  // 2. Token-based Mentions Scanner
  const tokenCandidates: CanonicalProduct[] = [];
  const searchWords = qLower.split(/\s+/).filter(w => w.length >= 2);

  if (searchWords.length > 0) {
    for (const p of products) {
      const cleanProdName = p.name.toLowerCase().replace(/typhon\s+/gi, "").trim();
      const prodWords = cleanProdName.split(/\s+/).map(w => w.toLowerCase());

      // Look for model number indicators (e.g. 509, x1300, xxv, xviii, xvii, xix, xi)
      const modelNum = prodWords.find(w => /\b(x|x2|17|509|508|1300|xxv|xviii|xvii|xix|xi|v980|skoop|vigor)\b/i.test(w));

      let matched = false;

      // Match if full clean name or any alias is directly contained in the query
      if (qLower === cleanProdName || qLower === p.name.toLowerCase()) {
        matched = true;
      } else {
        for (const a of p.aliases) {
          const cleanAlias = a.toLowerCase();
          if (qLower === cleanAlias || new RegExp(`\\b${escapeRegExp(cleanAlias)}\\b`, "i").test(qLower)) {
            matched = true;
            break;
          }
        }
      }

      // Match by model number specifically
      if (!matched && modelNum) {
        if (new RegExp(`\\b${escapeRegExp(modelNum)}\\b`, "i").test(qLower)) {
          matched = true;
        }
      }

      if (matched) {
        tokenCandidates.push(p);
      }
    }
  }

  if (tokenCandidates.length >= 2) {
    const exactMatches = tokenCandidates.filter(p => {
      const cleanProdName = p.name.toLowerCase().replace(/typhon\s+/gi, "").trim();
      if (qLower === cleanProdName || qLower === p.name.toLowerCase()) return true;
      for (const a of p.aliases) {
        if (qLower === a.toLowerCase()) return true;
      }
      return false;
    });

    if (exactMatches.length === 1) {
      return {
        product: exactMatches[0],
        intent: specIntent,
        confidence: 100,
        type: "direct",
        candidates: exactMatches
      };
    } else if (exactMatches.length > 1) {
      return {
        product: null,
        intent: specIntent,
        confidence: 95,
        type: "clarify",
        candidates: exactMatches.slice(0, 5)
      };
    }

    return {
      product: null,
      intent: specIntent,
      confidence: 95,
      type: "clarify",
      candidates: tokenCandidates.slice(0, 5)
    };
  }

  if (tokenCandidates.length === 1) {
    return {
      product: tokenCandidates[0],
      intent: specIntent,
      confidence: 100,
      type: "direct",
      candidates: tokenCandidates
    };
  }

  // 3. Fallback scoring engine (Fuzzy matching, specs boost, typos)
  if (!pSearch) {
    return {
      product: null,
      intent: specIntent,
      confidence: 30,
      type: "clarify",
      candidates: products.filter(p => ["terror-xi", "typhon-tyrant-17", "brand-new-typhon-stomp-mini-skid-steer-kubota-d1105-diesel-epa-engine-usa", "brand-new-typhon-stomp-x1300-25hp-kubota-diesel-mini-skid-steer-loader", "typhon-vigor-2-0"].includes(p.id)).slice(0, 5)
    };
  }

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
          score = Math.max(score, 85);
        }
      }

      for (const m of p.misspellings) {
        const cleanM = normalizeNumericTokens(m);
        if (cleanM === cleanSearch) {
          score = Math.max(score, 90);
        }
      }

      const nameSim = getSimilarityScore(cleanSearch, cleanProdName);
      if (nameSim >= 0.75) {
        score = Math.max(score, Math.round(nameSim * 90));
      }
    }

    // Specifications Boosts
    if (cleanSearch.includes("kubota") && p.specs["Engine"]?.toLowerCase().includes("kubota")) {
      score = Math.max(score, 85);
    }
    if (cleanSearch.includes("cabin") && p.raw?.description?.toLowerCase().includes("cabin")) {
      score = Math.max(score, 80);
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
  const penalized = scored.map(item => {
    let score = item.score;
    const prodWords = normalizeNumericTokens(item.product.name).split(/\s+/);

    const hasModelNumber = /\b(x|x2|17|509|508|1300|xxv|xviii|xvii|xix|xi|v980|skoop|vigor)\b/i;
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

export function cleanSpecUnit(val: string | undefined): string {
  if (!val || val === "Not listed") return "Not listed";
  const trimmed = val.trim();
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return `${trimmed} — unit not listed`;
  }
  return trimmed;
}

export function matchTwoProductsForComparison(query: string): { productA: CanonicalProduct | null; productB: CanonicalProduct | null; matchesFound: number; candidates: CanonicalProduct[] } {
  const products = getCanonicalProducts();
  const qLower = query.toLowerCase();

  const strictModels = [
    { key: "terror xix storm", id: "typhon-terror-xix-storm-mini-excavator-1-8-ton-trench-digger-with-boom-swing-canopy" },
    { key: "terror xix prestige", id: "typhon-terror-xix-prestige-cabin-mini-excavator-4200lbs-20-4-hp-kubota-d902-with-boom-swing-retractable-tracks" },
    { key: "xix storm", id: "typhon-terror-xix-storm-mini-excavator-1-8-ton-trench-digger-with-boom-swing-canopy" },
    { key: "xix prestige", id: "typhon-terror-xix-prestige-cabin-mini-excavator-4200lbs-20-4-hp-kubota-d902-with-boom-swing-retractable-tracks" },
    { key: "terror xix", id: "typhon-terror-xix-storm-mini-excavator-1-8-ton-trench-digger-with-boom-swing-canopy" },
    { key: "xix", id: "typhon-terror-xix-storm-mini-excavator-1-8-ton-trench-digger-with-boom-swing-canopy" },
    { key: "terror xxv", id: "typhon-terror-xxv-6-6-ton-excavator-kubota-v2607-56-9hp-ac-heater-cabin-boom-swing" },
    { key: "xxv", id: "typhon-terror-xxv-6-6-ton-excavator-kubota-v2607-56-9hp-ac-heater-cabin-boom-swing" },
    { key: "terror lxv", id: "typhon-terror-lxv-6-6-ton-excavator-kubota-v2607-56-9hp-ac-heater-cabin-boom-swing" },
    { key: "lxv", id: "typhon-terror-lxv-6-6-ton-excavator-kubota-v2607-56-9hp-ac-heater-cabin-boom-swing" },
    { key: "terror xviii", id: "typhon-terror-xviii-cabin-prestige-mini-excavator-3800lbs-13-8-hp-kubota-d722-with-boom-swing" },
    { key: "xviii", id: "typhon-terror-xviii-cabin-prestige-mini-excavator-3800lbs-13-8-hp-kubota-d722-with-boom-swing" },
    { key: "terror xvii", id: "typhon-terror-xvii-cabin-prestige-mini-excavator-3600lbs-13-8-hp-kubota-d722-with-boom-swing" },
    { key: "xvii", id: "typhon-terror-xvii-cabin-prestige-mini-excavator-3600lbs-13-8-hp-kubota-d722-with-boom-swing" },
    { key: "terror xi", id: "typhon-terror-xi-mini-excavator-2500lbs-13-5-hp-b-s-engine-with-boom-swing" },
    { key: "terror x", id: "typhon-terror-x-mini-excavator-2200lbs-13-5-hp-b-s-engine" },
    { key: "terror xv", id: "typhon-terror-xv-mini-excavator-2300lbs-13-5hp-b-s-engine-with-boom-swing" },
    { key: "tyrant 17", id: "typhon-tyrant-17-mini-excavator-3800lbs-25-hp-kubota-d1703-with-boom-swing" },
    { key: "tyrant", id: "typhon-tyrant-17-mini-excavator-3800lbs-25-hp-kubota-d1703-with-boom-swing" },
    { key: "18 flex pro", id: "typhon-18-flex-pro-mini-excavator-kubota-d902-16-1hp-canopy-retractable-tracks" },
    { key: "flex pro", id: "typhon-18-flex-pro-mini-excavator-kubota-d902-16-1hp-canopy-retractable-tracks" },
    { key: "18 flex", id: "typhon-18-flex-pro-mini-excavator-kubota-d902-16-1hp-canopy-retractable-tracks" },
    { key: "stomp 509", id: "brand-new-typhon-stomp-mini-skid-steer-kubota-d1105-diesel-epa-engine-usa" },
    { key: "509", id: "brand-new-typhon-stomp-mini-skid-steer-kubota-d1105-diesel-epa-engine-usa" },
    { key: "stomp x1300", id: "brand-new-typhon-stomp-x1300-25hp-kubota-diesel-mini-skid-steer-loader" },
    { key: "x1300", id: "brand-new-typhon-stomp-x1300-25hp-kubota-diesel-mini-skid-steer-loader" },
    { key: "stomp 508", id: "brand-new-typhon-stomp-508-25hp-kubota-diesel-mini-skid-steer-loader" },
    { key: "508", id: "brand-new-typhon-stomp-508-25hp-kubota-diesel-mini-skid-steer-loader" },
    { key: "stomp 507", id: "brand-new-typhon-stomp-508-25hp-kubota-diesel-mini-skid-steer-loader" },
    { key: "507", id: "brand-new-typhon-stomp-508-25hp-kubota-diesel-mini-skid-steer-loader" },
    { key: "vigor 1.5", id: "new-2025-typhon-vigor-1-5-blue-electric-forklift-1-5-ton-lifter-lift-truck-jitney" },
    { key: "vigor 2.0", id: "typhon-vigor-2-compact-electric-forklift-2025-model" },
    { key: "vigor 2.5", id: "new-2025-typhon-vigor-2-5-blue-electric-forklift-2-5-ton-lifter-lift-truck" },
    { key: "vigor 3.0", id: "new-2025-typhon-vigor-3-0-blue-electric-forklift-3-ton-lifter-lift-truck" },
    { key: "skoop ii", id: "new-typhon-skoop-ii-articulated-compact-mini-wheel-loader-25hp-kubota-engine" },
    { key: "skoop", id: "new-typhon-skoop-ii-articulated-compact-mini-wheel-loader-25hp-kubota-engine" }
  ];

  const matchedIds: string[] = [];

  for (const m of strictModels) {
    if (new RegExp(`\\b${escapeRegExp(m.key)}\\b`, "i").test(qLower)) {
      if (!matchedIds.includes(m.id)) {
        matchedIds.push(m.id);
      }
    }
  }

  const matches = matchedIds.map(id => products.find(p => p.id === id)).filter((x): x is CanonicalProduct => !!x);

  if (matches.length >= 2) {
    return { productA: matches[0], productB: matches[1], matchesFound: matches.length, candidates: matches };
  } else if (matches.length === 1) {
    return { productA: matches[0], productB: null, matchesFound: 1, candidates: matches };
  }

  // Fuzzier check if no strict models found
  const candidates: CanonicalProduct[] = [];
  const words = qLower.split(/\s+/).filter(w => w.length >= 2 && w !== "typhon" && w !== "machinery" && w !== "compare" && w !== "similar" && w !== "model");
  if (words.length > 0) {
    for (const p of products) {
      if (words.some(w => p.name.toLowerCase().includes(w))) {
        candidates.push(p);
      }
    }
  }

  return { productA: null, productB: null, matchesFound: 0, candidates: candidates.slice(0, 3) };
}

export interface SkuSearchResult {
  isSkuSearch: boolean;
  searchTerm: string;
  exactMatch: any | null;
  isLikelyDigitsMatch: boolean;
  isPossibleMatch: boolean;
  partialMatches: any[];
  fuzzyMatches: any[];
  allCandidates: any[];
}

export function getSkuDisplayName(profile: any): string {
  const cleanSku = (profile.sku || "").replace(/\s*Blue|\s*Red|\s*Yellow/gi, "").trim();
  if (cleanSku === "TYPH-0611") {
    return "TYPHON VIGOR 1.5 Blue Electric Forklift";
  }
  if (cleanSku === "TYPH-0612") {
    return "TYPHON VIGOR 2.0 Blue Electric Forklift";
  }
  return profile.displayName || profile.name;
}

export function isSkuSearchQuery(query: string): boolean {
  const q = query.toLowerCase().trim();
  // Check for keywords
  if (/\b(sku|gtin|upc|barcode|product[\s-]*code|model[\s-]*code|model[\s-]*number|part[\s-]*number|serial[\s-]*number)\b/i.test(q)) {
    return true;
  }
  // Check if it's a code-like token or number
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    const w = words[0];
    // Pure digits of length >= 3
    if (/^\d{3,}$/.test(w)) return true;
    // Alphanumeric with letters and digits (e.g., typh0611, typh-0611)
    if (/[a-z]/i.test(w) && /\d/.test(w)) return true;
  }
  return false;
}

export function extractSkuSearchTerm(query: string): string {
  const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s.-]/gi, " ").replace(/\s+/g, " ").trim();
  let searchTerm = cleanQuery;
  const prefixes = [
    "what product is",
    "find sku for",
    "do you have sku for",
    "sku for",
    "gtin for",
    "product code for",
    "model code for",
    "model number for",
    "wrong sku",
    "product code",
    "model code",
    "model number",
    "sku",
    "gtin",
    "upc"
  ];
  for (const prefix of prefixes) {
    if (searchTerm.startsWith(prefix)) {
      searchTerm = searchTerm.slice(prefix.length).trim();
      break;
    }
  }
  return searchTerm;
}

export function executeSkuSearch(query: string, profiles: any[]): SkuSearchResult {
  const isSku = isSkuSearchQuery(query);
  const searchTerm = extractSkuSearchTerm(query);
  const cleanTarget = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, "");

  let exactMatch: any | null = null;
  let isLikelyDigitsMatch = false;
  let isPossibleMatch = false;
  const partialMatches: any[] = [];
  const fuzzyMatches: any[] = [];

  const scored = profiles.map(p => {
    const skuRaw = p.sku || "";
    const gtinRaw = p.gtin || "";
    const nameRaw = p.name || "";
    const modelRaw = p.model || "";

    const pSkuClean = skuRaw.toLowerCase().replace(/[^a-z0-9]/g, "");
    // Remove color/suffix for core SKU comparison
    const pSkuCore = skuRaw.toLowerCase()
      .replace(/\s*(blue|red|yellow|green|black|white|orange|grey|gray|pro|max|flex|stomp|terror|tyrant|bundle)/gi, "")
      .replace(/[^a-z0-9]/g, "");
    const pGtinClean = gtinRaw.toLowerCase().replace(/[^a-z0-9]/g, "");
    const pSkuDigits = skuRaw.replace(/[^0-9]/g, "");
    const pModelClean = modelRaw.toLowerCase().replace(/[^a-z0-9]/g, "");
    const pNameClean = nameRaw.toLowerCase().replace(/[^a-z0-9]/g, "");

    let score = 0;

    // 1. Exact Match on full SKU, core SKU or GTIN -> 100
    if (cleanTarget && (pSkuClean === cleanTarget || pSkuCore === cleanTarget || pGtinClean === cleanTarget)) {
      score = Math.max(score, 100);
    }
    // 2. Exact match on pure digits to SKU digits -> 95
    if (/^\d+$/.test(cleanTarget) && cleanTarget.length >= 3 && (pSkuDigits === cleanTarget || pSkuDigits.replace(/^0+/, "") === cleanTarget.replace(/^0+/, ""))) {
      score = Math.max(score, 95);
    }
    // 3. Partial SKU/GTIN match -> 80
    if (cleanTarget && cleanTarget.length >= 3 && (pSkuClean.includes(cleanTarget) || pSkuCore.includes(cleanTarget) || pGtinClean.includes(cleanTarget))) {
      score = Math.max(score, 80);
    }
    // 4. Exact model match -> 75
    if (cleanTarget && pModelClean === cleanTarget) {
      score = Math.max(score, 75);
    }
    // 5. Fuzzy SKU match -> 70-75
    if (cleanTarget && cleanTarget.length >= 3 && pSkuCore.length >= 3) {
      const sim = getFuzzySimilarity(cleanTarget, pSkuCore);
      if (sim >= 0.75) {
        score = Math.max(score, 70 + Math.round(sim * 5));
      }
    }
    // 6. Name/Category/description match -> 45-65
    if (cleanTarget) {
      const nameContains = pNameClean.includes(cleanTarget);
      const catContains = (p.category || "").toLowerCase().replace(/[^a-z0-9]/g, "").includes(cleanTarget);
      const urlContains = (p.productUrl || "").toLowerCase().replace(/[^a-z0-9]/g, "").includes(cleanTarget);
      const descContains = (p.raw?.description || p.shortSummary || "").toLowerCase().replace(/[^a-z0-9]/g, "").includes(cleanTarget);
      const specsContains = JSON.stringify(p.specs || {}).toLowerCase().replace(/[^a-z0-9]/g, "").includes(cleanTarget);

      if (nameContains) {
        score = Math.max(score, 65);
      } else if (catContains || urlContains) {
        score = Math.max(score, 55);
      } else if (descContains || specsContains) {
        score = Math.max(score, 45);
      }
    }

    return { profile: p, score };
  });

  const sorted = scored.filter(s => s.score >= 40).sort((a, b) => b.score - a.score);

  if (sorted.length > 0) {
    const best = sorted[0];
    if (best.score >= 90) {
      exactMatch = best.profile;
      if (best.score === 95) {
        isLikelyDigitsMatch = true;
      }
    } else if (best.score >= 60 && (sorted.length === 1 || (best.score - sorted[1].score) >= 15)) {
      exactMatch = best.profile;
      isPossibleMatch = true;
    }

    for (const item of sorted) {
      if (item.score >= 90) {
        // Main exact match already captured or multiple identical
      } else if (item.score === 80) {
        partialMatches.push(item.profile);
      } else if (item.score >= 70) {
        fuzzyMatches.push(item.profile);
      }
    }
  }

  return {
    isSkuSearch: isSku,
    searchTerm,
    exactMatch,
    isLikelyDigitsMatch,
    isPossibleMatch,
    partialMatches,
    fuzzyMatches,
    allCandidates: sorted.map(s => s.profile)
  };
}
