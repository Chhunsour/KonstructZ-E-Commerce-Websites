import { getCanonicalProfiles, type CanonicalProfile } from "./canonicalProfiles";
import { getMergedProducts } from "./knowledge";

export interface NormalizedProduct {
  id: string;
  title: string;
  cleanName: string;
  brandName: string;
  modelName: string;
  category: string;
  subcategory: string;
  price: string;
  salePrice: string;
  sku: string;
  gtin: string;
  productUrl: string;
  buttonUrl: string;
  shortDescription: string;
  fullDescription: string;
  keyFeatures: string[];
  specs: Record<string, string>;
  engine: string;
  horsepower: string;
  fuelType: string;
  operatingWeight: string;
  liftingCapacity: string;
  diggingDepth: string;
  bucketSize: string;
  dimensions: string;
  attachmentCompatibility: string[];
  cabinInfo: string;
  warrantyInfo: string;
  shippingInfo: string;
  supportInfo: string;
  financingInfo: string;
  images: string[];
  missingSpecs: string[];
}

export function cleanHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const productKnowledgeService = {
  getNormalizedProducts(): NormalizedProduct[] {
    const profiles = getCanonicalProfiles();
    
    return profiles.map(profile => {
      const brandName = profile.brand === "Typhon Machinery" ? "Typhon" : profile.brand;
      const subcategory = profile.raw?.subcategoryLabel || profile.raw?.subcategory || "";
      
      const bucketSize = profile.bucketCapacity !== "Not listed" 
        ? profile.bucketCapacity 
        : (profile.bucketWidth !== "Not listed" ? profile.bucketWidth : "Not listed");
        
      const dimensions = profile.overallWidth !== "Not listed" 
        ? `Width: ${profile.overallWidth}, Height: ${profile.overallHeight}, Length: ${profile.overallLength}` 
        : "Not listed";

      const keyFeatures = profile.goodFor && profile.goodFor.length > 0 
        ? profile.goodFor 
        : (profile.mainStrengths && profile.mainStrengths.length > 0 ? profile.mainStrengths : []);

      const normalized: NormalizedProduct = {
        id: profile.id,
        title: profile.displayName,
        cleanName: profile.name,
        brandName,
        modelName: profile.model,
        category: profile.category,
        subcategory,
        price: profile.price,
        salePrice: profile.salePrice || "",
        sku: profile.sku,
        gtin: profile.gtin,
        productUrl: profile.productUrl,
        buttonUrl: profile.buttonUrl,
        shortDescription: cleanHtml(profile.shortSummary),
        fullDescription: cleanHtml(profile.raw?.description || ""),
        keyFeatures,
        specs: profile.specs || {},
        engine: profile.engineModel,
        horsepower: profile.horsepower,
        fuelType: profile.fuelType,
        operatingWeight: profile.operatingWeight,
        liftingCapacity: profile.liftCapacity,
        diggingDepth: profile.diggingDepth,
        bucketSize,
        dimensions,
        attachmentCompatibility: profile.attachmentCompatibility,
        cabinInfo: profile.cabinType,
        warrantyInfo: profile.warranty,
        shippingInfo: profile.shippingRule,
        supportInfo: profile.lifetimeTechnicalSupport,
        financingInfo: profile.financingNote,
        images: profile.gallery || [profile.image],
        missingSpecs: []
      };

      // Scan for missing specs
      const checkFields = {
        "Engine Output": normalized.horsepower,
        "Engine Model": normalized.engine,
        "Operating Weight": normalized.operatingWeight,
        "Lift Capacity": normalized.liftingCapacity,
        "Digging Depth": normalized.diggingDepth,
        "Bucket Size": normalized.bucketSize,
        "Dimensions": normalized.dimensions,
        "Price": normalized.price,
        "SKU": normalized.sku,
        "GTIN": normalized.gtin,
      };

      for (const [name, val] of Object.entries(checkFields)) {
        if (!val || val === "Not listed") {
          normalized.missingSpecs.push(name);
        }
      }

      return normalized;
    });
  }
};
