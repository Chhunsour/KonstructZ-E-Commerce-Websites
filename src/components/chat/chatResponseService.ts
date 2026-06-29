import { productKnowledgeService, type NormalizedProduct } from "./productKnowledgeService";
import { type CanonicalProfile } from "./canonicalProfiles";

export const chatResponseService = {
  formatProductOverview(profile: CanonicalProfile, t: (key: string, fallback: string) => string): string {
    const normalizedList = productKnowledgeService.getNormalizedProducts();
    const np = normalizedList.find(x => x.id === profile.id);
    
    const brandName = np ? np.brandName : (profile.brand === "Typhon Machinery" ? "Typhon" : profile.brand);
    const cleanName = np ? np.cleanName : profile.name;
    const shortDesc = np ? np.shortDescription : profile.shortSummary;
    const priceVal = np ? np.price : profile.price;
    const skuVal = np ? np.sku : profile.sku;
    const gtinVal = np ? np.gtin : profile.gtin;
    const hpVal = np ? np.horsepower : profile.horsepower;
    const engineVal = np ? np.engine : profile.engineModel;
    const weightVal = np ? np.operatingWeight : profile.operatingWeight;
    const liftVal = np ? np.liftingCapacity : profile.liftCapacity;
    const depthVal = np ? np.diggingDepth : profile.diggingDepth;
    const dimsVal = np ? np.dimensions : profile.overallWidth;
    const pUrl = np ? np.productUrl : profile.productUrl;
    
    let md = `Here’s what I found for **${cleanName}**.\n\n`;
    
    // Specs table or lines
    md += `| Specification | Details |\n`;
    md += `|---|---|\n`;
    md += `| **Category** | ${np?.category || profile.category} |\n`;
    md += `| **Price** | ${priceVal !== "Not listed" ? priceVal : "This spec is not listed yet."} |\n`;
    md += `| **Engine Output** | ${hpVal !== "Not listed" ? hpVal : "This spec is not listed yet."} |\n`;
    md += `| **Engine Model** | ${engineVal !== "Not listed" ? engineVal : "This spec is not listed yet."} |\n`;
    md += `| **Operating Weight** | ${weightVal !== "Not listed" ? weightVal : "This spec is not listed yet."} |\n`;
    md += `| **Lift Capacity** | ${liftVal !== "Not listed" ? liftVal : "This spec is not listed yet."} |\n`;
    md += `| **Digging Depth** | ${depthVal !== "Not listed" ? depthVal : "This spec is not listed yet."} |\n`;
    md += `| **Dimensions** | ${dimsVal !== "Not listed" ? dimsVal : "This spec is not listed yet."} |\n`;
    md += `| **SKU / GTIN** | SKU: ${skuVal !== "Not listed" ? skuVal : "This spec is not listed yet."} / GTIN: ${gtinVal !== "Not listed" ? gtinVal : "This spec is not listed yet."} |\n`;
    md += `\n`;

    md += `${shortDesc}\n\n`;

    // Explain what the product is good for
    const keyFeatures = np ? np.keyFeatures : (profile.goodFor || []);
    if (keyFeatures && keyFeatures.length > 0) {
      md += `**Best For:**\n`;
      for (const use of keyFeatures) {
        if (use && use !== "Not listed") {
          md += `* ${use}\n`;
        }
      }
      md += `\n`;
    }

    // Mention missing specs honestly
    const missingSpecs = np ? np.missingSpecs : [];
    if (missingSpecs.length > 0) {
      md += `*I found the product, but some specs are not listed yet: ${missingSpecs.join(", ")}. (That spec is not listed yet.)*\n\n`;
    }

    // Offer the product link or buying/help option
    md += `**Purchase / More Info:**\n`;
    md += `* [Explore ${cleanName} Catalog Page](${pUrl})\n`;
    md += `* Click "Build quote request" below to get pricing options for this model.\n\n`;

    // Suggest a related product only when useful
    const related = profile.relatedProducts.filter(x => x && x !== "Not listed");
    if (related.length > 0) {
      const relatedId = related[0];
      const relatedNameMap: Record<string, string> = {
        "terror-xxv": "TYPHON Terror XXV",
        "tyrant-17": "TYPHON Tyrant 17",
        "stomp-509": "TYPHON STOMP 509",
        "stomp-x1300": "TYPHON STOMP X1300",
        "vigor-1.5": "TYPHON Vigor 1.5",
        "vigor-2.0": "TYPHON Vigor 2.0"
      };
      const displayName = relatedNameMap[relatedId] || `TYPHON ${relatedId.replace(/-/g, " ").toUpperCase()}`;
      md += `**Related Option:** If you need a different size, consider looking at the **${displayName}**.\n`;
    }

    return md;
  }
};
