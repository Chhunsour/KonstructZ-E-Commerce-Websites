import { productKnowledgeService, type NormalizedProduct } from "./productKnowledgeService";
import { type CanonicalProfile, getCanonicalProfiles } from "./canonicalProfiles";
import { cleanSpecUnit, parseWeightNumber, parsePriceNumber } from "./matchingEngine";

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
  },

  formatModelComparison(pA: any, pB: any, t: (key: string, fallback: string) => string): string {
    const profileA = getCanonicalProfiles().find(p => p.id === pA.id)!;
    const profileB = getCanonicalProfiles().find(p => p.id === pB.id)!;
    
    let md = `I found **${profileA.name}**. Here is the closest comparison I can make from listed product data.\n\n`;
    
    md += `| Specification | ${profileA.name} (Product A) | ${profileB.name} (Product B) |\n`;
    md += `|---|---|---|\n`;
    md += `| **Category** | ${profileA.category} | ${profileB.category} |\n`;
    
    const priceA = profileA.price && profileA.price !== "Not listed" ? profileA.price : "Price not listed";
    const priceB = profileB.price && profileB.price !== "Not listed" ? profileB.price : "Price not listed";
    md += `| **Price** | ${priceA} | ${priceB} |\n`;

    const specsList = [
      { label: "Engine Model", valA: profileA.engineModel, valB: profileB.engineModel },
      { label: "Engine Output", valA: profileA.horsepower, valB: profileB.horsepower },
      { label: "Operating Weight", valA: profileA.operatingWeight, valB: profileB.operatingWeight },
      { label: "Lift Capacity", valA: profileA.liftCapacity, valB: profileB.liftCapacity },
      { label: "Digging Depth", valA: profileA.diggingDepth, valB: profileB.diggingDepth },
      { label: "Cabin Type", valA: profileA.cabinType, valB: profileB.cabinType }
    ];

    for (const s of specsList) {
      md += `| **${s.label}** | ${cleanSpecUnit(s.valA)} | ${cleanSpecUnit(s.valB)} |\n`;
    }
    md += `\n`;

    md += `### Recommendation\n`;
    
    const hasAWeight = profileA.operatingWeight !== "Not listed";
    const hasBWeight = profileB.operatingWeight !== "Not listed";
    const hasAHp = profileA.horsepower !== "Not listed";
    const hasBHp = profileB.horsepower !== "Not listed";
    
    let recText = "";
    if (hasAWeight && hasBWeight && parseWeightNumber(profileA.operatingWeight) > parseWeightNumber(profileB.operatingWeight)) {
      recText = `Choose **${profileA.name}** if you need a heavier, more stable platform for demanding jobs. Choose **${profileB.name}** if you need a lighter, more compact machine for easier transport and tight spaces.`;
    } else if (hasAWeight && hasBWeight && parseWeightNumber(profileA.operatingWeight) < parseWeightNumber(profileB.operatingWeight)) {
      recText = `Choose **${profileB.name}** if you need a heavier, more stable platform for demanding jobs. Choose **${profileA.name}** if you need a lighter, more compact machine for easier transport and tight spaces.`;
    } else if (hasAHp && hasBHp && parsePriceNumber(profileA.horsepower) > parsePriceNumber(profileB.horsepower)) {
      recText = `**${profileA.name}** offers higher engine output (${profileA.horsepower}) than **${profileB.name}** (${profileB.horsepower}) based on listed specifications.`;
    } else {
      recText = `Both models offer excellent performance. Compare their dimensions and cabin style (e.g. cabin vs canopy) to choose the best option for your site conditions.`;
    }

    md += `* ${recText}\n\n`;

    md += `**Product Catalog Links:**\n`;
    md += `* [Explore ${profileA.name}](${profileA.productUrl})\n`;
    md += `* [Explore ${profileB.name}](${profileB.productUrl})\n`;

    return md;
  }
};
