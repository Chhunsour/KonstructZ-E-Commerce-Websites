import { getMergedProducts, getChatbotConfig } from "./knowledge";
import { normalizeNumericTokens, formatCategorySlug } from "./matchingEngine";

export interface CanonicalProfile {
  // Identity
  id: string;
  name: string;
  displayName: string;
  brand: string;
  category: string;
  machineType: string;
  model: string;
  sku: string;
  gtin: string;
  productUrl: string;
  buttonUrl: string;
  image: string;
  gallery: string[];

  // Specs
  engineBrand: string;
  engineModel: string;
  horsepower: string;
  ratedPower: string;
  torque: string;
  fuelType: string;
  epaCertified: string;
  operatingWeight: string;
  machineWeight: string;
  liftCapacity: string;
  maxLiftHeight: string;
  diggingDepth: string;
  diggingHeight: string;
  bucketWidth: string;
  bucketCapacity: string;
  hydraulicFlow: string;
  hydraulicPressure: string;
  overallWidth: string;
  overallHeight: string;
  overallLength: string;
  trackWidth: string;
  wheelbase: string;
  travelSpeed: string;
  cabinType: string;
  acHeater: string;
  batteryInfo: string;

  // Meaning
  shortSummary: string;
  bestUseCases: string[];
  goodFor: string[];
  notIdealFor: string[];
  mainStrengths: string[];
  limitations: string[];
  beginnerExplanation: string;
  proExplanation: string;
  relatedProducts: string[];
  similarProducts: string[];
  smallerOption: string;
  biggerOption: string;
  cabinOption: string;
  cheaperOption: string;
  strongerOption: string;

  // Commercial/Support
  price: string;
  salePrice: string;
  warranty: string;
  lifetimeTechnicalSupport: string;
  shippingRule: string;
  overseasSalesContactRule: string;
  financingNote: string;
  returnNote: string;
  stockNote: string;
  salesContactNote: string;
  raw: any;
}

// Product specs text auto-cleaner
export function cleanMessyText(text: string): string {
  if (!text) return "";
  // Split smerged headers e.g. "Overall Width1,400 mmOverall Height2,530 mm"
  let cleaned = text.replace(/([a-zA-Z\s]{4,})(\d+[\d,.]*\s*(?:mm|in|ft|kg|lbs|hp|kW|gpm|psi|kN|hz|Tons))/gi, "$1: $2; ");
  // Add spaces to CamelCase
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, "$1 $2");
  return cleaned.trim();
}

// Source priority lookup
export function lookupSpecWithPriority(
  p: any, 
  keys: string[], 
  fallbackVal: string = "Not listed"
): { value: string; source: string } {
  // 1. Check custom overrides from admin
  if (p.specs) {
    for (const spec of p.specs) {
      if (keys.some(k => spec.label.toLowerCase() === k.toLowerCase())) {
        return { value: spec.value || fallbackVal, source: "Admin Override" };
      }
    }
  }

  // 2. Check direct database fields
  for (const k of keys) {
    if (p[k] !== undefined && p[k] !== null && p[k] !== "") {
      return { value: String(p[k]), source: "Product DB" };
    }
  }

  // 3. Check specs list elements matching label key
  if (p.specs) {
    for (const spec of p.specs) {
      if (keys.some(k => new RegExp(`\\b${k}\\b`, "i").test(spec.label))) {
        return { value: spec.value || fallbackVal, source: "Product Spec Table" };
      }
    }
  }

  // 4. Try to extract from short description or tagline
  if (p.tagline) {
    for (const k of keys) {
      const match = p.tagline.match(new RegExp(`\\b${k}\\b[:\\s]*([a-zA-Z0-9.,\\s-]+)`, "i"));
      if (match) {
        return { value: match[1].trim(), source: "Tagline Extract" };
      }
    }
  }

  // 5. Try to extract from full description
  if (p.description) {
    for (const k of keys) {
      const match = p.description.match(new RegExp(`\\b${k}\\b[:\\s]*([a-zA-Z0-9.,\\s-]+)`, "i"));
      if (match) {
        return { value: match[1].trim(), source: "Description Extract" };
      }
    }
  }

  return { value: fallbackVal, source: "Not listed" };
}

// Generate canonical profiles dynamically
export function getCanonicalProfiles(): CanonicalProfile[] {
  const { baseProducts, baseTyphonProducts } = getMergedProducts();
  const allRaw = [...baseProducts, ...baseTyphonProducts];

  return allRaw.map(p => {
    // Identity fields
    const id = p.id;
    const name = p.name;
    const displayName = p.name.startsWith("TYPHON") ? p.name : `TYPHON ${p.name}`;
    const brand = p.brand || "Typhon";
    const category = p.categoryLabel || formatCategorySlug((p as any).category) || "Machinery";
    const machineType = category;
    const model = p.name.replace(/typhon\s+/gi, "").split(/\s+/)[0];
    const sku = p.sku || "Not listed";
    const gtin = p.gtin || (p as any).specs?.find((s: any) => /gtin/i.test(s.label))?.value || "Not listed";
    const productUrl = p.sourceUrl || p.url || `https://typhonmachinery.com/product/${id}/`;
    const buttonUrl = p.buttonUrl || `/typhon-machinery/${id}`;
    const image = p.image || "/img/placeholder-machinery.png";
    const gallery = p.gallery || [image];

    // Priority Specs Extractors
    const engineBrand = lookupSpecWithPriority(p, ["Engine Brand", "Engine Manufacture", "Engine Make"]).value;
    const engineModel = lookupSpecWithPriority(p, ["Engine Model", "Engine Type"]).value;
    const horsepower = lookupSpecWithPriority(p, ["Horsepower", "Engine Power", "Power Output", "Power"]).value;
    const ratedPower = lookupSpecWithPriority(p, ["Rated Power", "Working Power"]).value;
    const torque = lookupSpecWithPriority(p, ["Torque", "Max Torque"]).value;
    const fuelType = p.name.toLowerCase().includes("electric") ? "Electric" : "Diesel";
    const epaCertified = lookupSpecWithPriority(p, ["EPA", "EPA Certified", "Certification"]).value;
    const operatingWeight = p.weight || lookupSpecWithPriority(p, ["Operating Weight", "Machine Weight", "Weight"]).value;
    const liftCapacity = lookupSpecWithPriority(p, ["Lift Capacity", "Operating Capacity", "Rated Load"]).value;
    const maxLiftHeight = lookupSpecWithPriority(p, ["Max Lift Height", "Lifting Height", "Lift Height"]).value;
    const diggingDepth = lookupSpecWithPriority(p, ["Digging Depth", "Max Digging Depth", "Dig Depth"]).value;
    const diggingHeight = lookupSpecWithPriority(p, ["Digging Height", "Max Digging Height"]).value;
    const bucketWidth = lookupSpecWithPriority(p, ["Bucket Width", "Standard Bucket"]).value;
    const bucketCapacity = lookupSpecWithPriority(p, ["Bucket Capacity"]).value;
    const hydraulicFlow = lookupSpecWithPriority(p, ["Hydraulic Flow", "Auxiliary Flow", "Auxiliary Hydraulic Flow"]).value;
    const hydraulicPressure = lookupSpecWithPriority(p, ["Hydraulic Pressure", "System Pressure"]).value;
    const overallWidth = lookupSpecWithPriority(p, ["Overall Width", "Width", "Machine Width"]).value;
    const overallHeight = lookupSpecWithPriority(p, ["Overall Height", "Height", "Machine Height"]).value;
    const overallLength = lookupSpecWithPriority(p, ["Overall Length", "Length", "Machine Length"]).value;
    const trackWidth = lookupSpecWithPriority(p, ["Track Width", "Shoe Width"]).value;
    const wheelbase = lookupSpecWithPriority(p, ["Wheelbase"]).value;
    const travelSpeed = lookupSpecWithPriority(p, ["Travel Speed", "Speed"]).value;
    const cabinType = p.name.toLowerCase().includes("cabin") ? "Enclosed Cabin" : "Open Canopy";
    const acHeater = p.name.toLowerCase().includes("cabin") ? "Yes (A/C & Heater)" : "No (Open Air)";
    const batteryInfo = p.name.toLowerCase().includes("electric") ? (lookupSpecWithPriority(p, ["Battery", "Battery Info", "Voltage"]).value !== "Not listed" ? lookupSpecWithPriority(p, ["Battery", "Battery Info", "Voltage"]).value : "60V / 250Ah Lead-Acid") : "Not listed";

    // Dynamic Meaning & Application mapping
    const shortSummary = p.tagline || `A heavy-duty professional-grade ${category} designed for construction and landscaping.`;
    const bestUseCases = p.applications || ["Construction", "Site Preparation", "Material Handling"];
    const goodFor = p.features ? p.features.slice(0, 3) : ["Reliable diesel power", "Compact footprint", "Easy controls"];
    const notIdealFor = category.toLowerCase().includes("excavator") 
      ? ["Bulk material transport", "High speed traveling"] 
      : category.toLowerCase().includes("skid steer") 
      ? ["Deep trench digging", "Warehouse indoor lifting"] 
      : ["Excavation", "Soil compaction"];
      
    const mainStrengths = goodFor;
    const limitations = notIdealFor;
    const beginnerExplanation = `An easy-to-use ${category} with intuitive joystick controls, designed to handle daily farm, property, or residential chores safely.`;
    const proExplanation = `A professional ${category} featuring auxiliary hydraulics, heavy-duty hydraulic pumps, and high-efficiency heat dissipation systems built for commercial jobsite demands.`;

    // Sizing Relationships
    const lowercaseName = name.toLowerCase();
    let smallerOption = "Not listed";
    let biggerOption = "Not listed";
    let cheaperOption = "Not listed";
    let strongerOption = "Not listed";
    let cabinOption = "Not listed";

    if (category.toLowerCase().includes("excavator")) {
      if (lowercaseName.includes("xi") || lowercaseName.includes("x storm")) {
        biggerOption = "TYPHON Terror XIII";
        strongerOption = "TYPHON Terror XIII";
        cheaperOption = "Not listed";
      } else if (lowercaseName.includes("xiii")) {
        smallerOption = "TYPHON Terror XI";
        biggerOption = "TYPHON Terror XV";
        cheaperOption = "TYPHON Terror XI";
        strongerOption = "TYPHON Terror XV";
      } else if (lowercaseName.includes("xv")) {
        smallerOption = "TYPHON Terror XIII";
        biggerOption = "TYPHON Tyrant 17";
        cheaperOption = "TYPHON Terror XIII";
        strongerOption = "TYPHON Tyrant 17";
      } else if (lowercaseName.includes("xxv")) {
        smallerOption = "TYPHON Terror XX";
        biggerOption = "TYPHON Tyrant 17";
        cheaperOption = "TYPHON Terror XX";
        strongerOption = "TYPHON Tyrant 17";
        if (lowercaseName.includes("capony")) {
          cabinOption = "TYPHON Terror XXV Cabin";
        }
      }
    } else if (category.toLowerCase().includes("skid steer")) {
      if (lowercaseName.includes("509")) {
        biggerOption = "TYPHON Stomp X1300";
        strongerOption = "TYPHON Stomp X1300";
      } else if (lowercaseName.includes("x1300")) {
        smallerOption = "TYPHON Stomp 509";
        cheaperOption = "TYPHON Stomp 509";
      }
    } else if (category.toLowerCase().includes("forklift")) {
      if (lowercaseName.includes("1.5")) {
        biggerOption = "TYPHON Forklift (2.0 Ton)";
        strongerOption = "TYPHON Forklift (2.0 Ton)";
      } else if (lowercaseName.includes("2.0")) {
        smallerOption = "TYPHON Forklift (1.5 Ton)";
        biggerOption = "TYPHON Forklift (2.5 Ton)";
        cheaperOption = "TYPHON Forklift (1.5 Ton)";
        strongerOption = "TYPHON Forklift (2.5 Ton)";
      }
    }

    const relatedProducts = [smallerOption, biggerOption].filter(x => x !== "Not listed");
    const similarProducts = relatedProducts;

    // Commercial variables
    const price = p.price || p.currentPrice || "Not listed";
    const salePrice = p.salePrice || "Not listed";
    const warranty = "1-year warranty + lifetime technical support";
    const lifetimeTechnicalSupport = "Included with all purchases";
    const shippingRule = "Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.";
    const overseasSalesContactRule = "Overseas buyers must contact our sales team manually for direct container bookings.";
    const financingNote = "Financing lease-to-own options are available through Paramount Financial Services.";
    const returnNote = "30-day unused returns are accepted; buyer is responsible for return freight.";
    const stockNote = "Stock availability should be confirmed with sales.";
    const salesContactNote = "Our sales team is available Mon-Fri 9AM-5PM PST.";

    return {
      id,
      name,
      displayName,
      brand,
      category,
      machineType,
      model,
      sku,
      gtin,
      productUrl,
      buttonUrl,
      image,
      gallery,
      engineBrand,
      engineModel,
      horsepower,
      ratedPower,
      torque,
      fuelType,
      epaCertified,
      operatingWeight,
      machineWeight: operatingWeight,
      liftCapacity,
      maxLiftHeight,
      diggingDepth,
      diggingHeight,
      bucketWidth,
      bucketCapacity,
      hydraulicFlow,
      hydraulicPressure,
      overallWidth,
      overallHeight,
      overallLength,
      trackWidth,
      wheelbase,
      travelSpeed,
      cabinType,
      acHeater,
      batteryInfo,
      shortSummary,
      bestUseCases,
      goodFor,
      notIdealFor,
      mainStrengths,
      limitations,
      beginnerExplanation,
      proExplanation,
      relatedProducts,
      similarProducts,
      smallerOption,
      biggerOption,
      cabinOption,
      cheaperOption,
      strongerOption,
      price,
      salePrice,
      warranty,
      lifetimeTechnicalSupport,
      shippingRule,
      overseasSalesContactRule,
      financingNote,
      returnNote,
      stockNote,
      salesContactNote,
      raw: p
    };
  });
}
