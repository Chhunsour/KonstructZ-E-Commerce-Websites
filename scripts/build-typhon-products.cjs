const fs = require("node:fs");
const path = require("node:path");
const {
  importProductImages,
  loadImageImportCache,
  saveImageImportCache,
  splitImageUrls,
} = require("./product-image-importer.cjs");

const OUT_PATH = path.join(process.cwd(), "src", "data", "typhonProducts.ts");
const CSV_SEARCH_DIRS = [
  path.join(process.cwd(), "Product update 26:06"),
  path.join(process.cwd(), "product machine of typhon"),
];

function findLatestTyphonCsv() {
  for (const dir of CSV_SEARCH_DIRS) {
    if (!fs.existsSync(dir)) continue;

    const candidates = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".csv")) continue;

      const fullPath = path.join(dir, entry.name);
      const stats = fs.statSync(fullPath);
      candidates.push({ path: fullPath, mtimeMs: stats.mtimeMs });
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
      return candidates[0].path;
    }
  }

  throw new Error(`No Typhon CSV found in: ${CSV_SEARCH_DIRS.join(", ")}`);
}

const CSV_PATH = findLatestTyphonCsv();

const categoryDefaults = {
  "mini-excavators": {
    label: "Mini Excavator",
    fallbackImage: "/img/kuvuo 2.5.png",
    applications: ["Trenching", "Drainage", "Landscaping", "Small construction", "Farm and property work"],
    features: ["Compact tracked platform", "Hydraulic digging system", "Jobsite maneuverability", "Attachment-ready excavation setup"],
  },
  "skid-steer-loaders": {
    label: "Skid Steer Loader",
    fallbackImage: "/img/STOMP V980 v1.png",
    applications: ["Loading", "Grading", "Material handling", "Site cleanup", "Landscape work"],
    features: ["Compact loader footprint", "Attachment-ready front plate", "Responsive hydraulic controls", "Jobsite material handling layout"],
  },
  "wheel-loaders": {
    label: "Wheel Loader",
    fallbackImage: "/img/skoop ii v2.png",
    applications: ["Yard loading", "Aggregate handling", "Farm material movement", "Snow and debris clearing"],
    features: ["Articulated loader format", "Material bucket setup", "Stable wheel base", "Serviceable compact loader frame"],
  },
  forklifts: {
    label: "Forklift",
    fallbackImage: "/img/new-project-18-1.png",
    applications: ["Pallet handling", "Warehouse loading", "Yard logistics", "Material staging"],
    features: ["Electric lift-truck platform", "Compact turning layout", "Pallet handling mast", "Indoor and yard material support"],
  },
  "road-rollers": {
    label: "Road Roller",
    fallbackImage: "/img/ground ripper grx.png",
    applications: ["Soil compaction", "Asphalt repair", "Driveway work", "Landscape base prep"],
    features: ["Vibratory drum configuration", "Compact compaction footprint", "Hydraulic steering support", "Small-site roadwork setup"],
  },
  "scissor-lifts": {
    label: "Scissor Lift",
    fallbackImage: "/img/new-project-16-2.png",
    applications: ["Elevated maintenance", "Warehouse access", "Indoor installation", "Jobsite vertical access"],
    features: ["Electric lift platform", "Compact access footprint", "Guarded work platform", "Vertical maintenance support"],
  },
  attachments: {
    label: "Attachment",
    fallbackImage: "/img/package-car.svg",
    applications: ["Machine fitment", "Attachment pairing", "Jobsite task changes", "Productivity support"],
    features: ["Typhon machine compatibility", "Task-specific work tool", "Fitment-dependent setup", "Support-guided pairing"],
  },
  equipment: {
    label: "Equipment",
    fallbackImage: "/img/kuvuo 2.5.png",
    applications: ["Construction work", "Material handling", "Property maintenance", "Jobsite support"],
    features: ["Typhon machinery platform", "Jobsite-ready configuration", "Supportable service layout", "Category-specific setup"],
  },
};

function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows;
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\uFEFF/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/™|®/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugFromUrls(buttonUrl, sourceUrl, name, index) {
  const buttonMatch = normalizeText(buttonUrl).match(/\/product\/([^/]+)/);
  const sourceMatch = normalizeText(sourceUrl).match(/\/product\/([^/]+)/);
  const base = buttonMatch?.[1] || sourceMatch?.[1] || slugify(name);
  return base || `typhon-product-${index + 1}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function formatNumber(value, digits = 1) {
  const fixed = Number(value).toFixed(digits);
  return fixed.replace(/\.0$/, "");
}

function convertVisibleUnits(value) {
  let output = normalizeText(value);

  // If the source already provides a US inch value plus a metric value in
  // parentheses, keep the US value and drop the duplicate metric parenthetical.
  output = output.replace(
    /(\d+(?:\.\d+)?)\s*in\s*\(\s*[\d,]+(?:\.\d+)?\s*mm\s*\)/gi,
    (_, inches) => `${formatNumber(inches, 1)} in`,
  );

  output = output.replace(/(\d+(?:\.\d+)?)\s*-?\s*inch\s*x\s*(\d+(?:\.\d+)?)\s*-?\s*inch\s*mm\b/gi, (_, width, height) => {
    return `${formatNumber(width, 1)} in x ${formatNumber(height, 1)} in`;
  });

  output = output.replace(/(\d[\d,]*(?:\.\d+)?)\s*mm\b/gi, (_, raw) => {
    const inches = Number(String(raw).replace(/,/g, "")) / 25.4;
    if (inches >= 48) {
      return `${formatNumber(inches, 1)} in (${formatNumber(inches / 12, 1)} ft)`;
    }
    return `${formatNumber(inches, 1)} in`;
  });

  output = output.replace(/(\d+(?:\.\d+)?)\s*kg\b/gi, (_, raw) => {
    const pounds = Number(raw) * 2.20462;
    return `${Math.round(pounds).toLocaleString("en-US")} lb`;
  });

  output = output.replace(/(\d+(?:\.\d+)?)\s*kW\b/g, (_, raw) => {
    const hp = Number(raw) * 1.34102;
    return `${formatNumber(hp, 1)} HP`;
  });

  output = output.replace(/(\d+(?:\.\d+)?)\s*(?:cbm|cubic meters?|m3)\b/gi, (_, raw) => {
    const yards = Number(raw) * 1.30795;
    return `${formatNumber(yards, 3)} cu yd`;
  });

  output = output.replace(/\bhp\b/gi, "HP");
  output = output.replace(/\blbs\b/gi, "lb");
  return output;
}

function cleanSalesCopy(value) {
  return normalizeText(value)
    .replace(/As low as \$[\d,]+\/mo with Paramount Financial APPLY NOW/gi, "")
    .replace(/\bAPPLY NOW\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Strip CSV boilerplate so the long description reads like real product copy.
// Removes the leading "Description" / "Description GTIN: …" preamble and the
// trailing "TYPHON Machinery – Your Trusted Partner / Why Choose …" sales tail.
function cleanLongDescription(value) {
  let text = normalizeText(value);
  if (!text) return "";

  // Drop the leading word "Description" / "Description GTIN: 5061…" preamble.
  text = text.replace(/^Description\b[:\s]*/i, "");
  text = text.replace(/^GTIN:\s*[^\s]+\s*/i, "");

  // Cut the long boilerplate sales tail that appears on most rows.
  const cutPatterns = [
    /\s*TYPHON Machinery\s*[–-]\s*Your Trusted Partner.*$/i,
    /\s*Why Choose TYPHON Machinery\??.*$/i,
  ];
  for (const pattern of cutPatterns) {
    text = text.replace(pattern, "");
  }

  text = cleanSalesCopy(text);

  // Detect useless stubs like "TYPHON: TYPHON" — fall back to short description.
  const stripped = text.replace(/[^a-z]/gi, "");
  if (stripped.length < 24) return "";

  return text.trim();
}

// Pull a clean short description out of the CSV "Short Description" cell.
function cleanShortDescription(value) {
  let text = normalizeText(value);
  if (!text) return "";
  text = cleanSalesCopy(text);
  return text.trim();
}

function cleanSku(value) {
  const sku = normalizeText(value).replace(/^SKU\s+/i, "");
  return /^find out more$/i.test(sku) ? "" : sku;
}

function inferCategory(record) {
  const haystack = normalizeText(
    `${record.Name} ${record.Category} ${record["Button URL"]} ${record.Description} ${record["Short Description"]}`,
  ).toLowerCase();

  if (/scissor|xflex/.test(haystack)) return "scissor-lifts";
  if (/forklift|vigor|lift truck|jitney/.test(haystack)) return "forklifts";
  if (/road roller|roller|fury/.test(haystack)) return "road-rollers";
  if (/wheel\s*loader|skoop/.test(haystack)) return "wheel-loaders";
  if (/skid\s*steer|stomp|050\d|v1000|x1300/.test(haystack)) return "skid-steer-loaders";
  if (/excavator|digger|trench digger|terror|tyrant|kuvu|flex 18/.test(haystack)) return "mini-excavators";
  if (normalizeText(record["Product Type"]).toLowerCase() === "attachment") return "attachments";
  return "equipment";
}

function inferProductType(record) {
  // The CSV "Product Type" column is authoritative. Attachments are mapped into
  // a machine category (their *fitment*, e.g. skid-steer-loaders) by
  // inferCategory, so we must NOT infer the type from the category — otherwise
  // every attachment looks like equipment. Trust the source column instead.
  const rawType = normalizeText(record["Product Type"]).toLowerCase();
  return rawType === "attachment" ? "attachment" : "equipment";
}

function inferSeries(record, category) {
  const name = normalizeText(record.Name).toLowerCase();
  if (/xflex/.test(name)) return "xFLEX lift series";
  if (/vigor|forklift/.test(name)) return "VIGOR forklift series";
  if (/fury|road roller/.test(name)) return "FURY road roller series";
  if (/skoop|wheel/.test(name)) return "SKOOP wheel loader series";
  if (/stomp|050\d|v1000|x1300/.test(name)) return "STOMP skid steer series";
  if (/kuvu/.test(name)) return "KUVU excavator series";
  if (/terror|tyrant|flex/.test(name)) return "TERROR mini excavator series";
  return `${categoryDefaults[category]?.label || "Typhon"} series`;
}

function extractPrices(value) {
  const prices =
    normalizeText(value)
      .match(/\$\s*\d[\d,\s]*(?:\.\d{2})?/g)
      ?.map((price) =>
        price
          .replace(/\$\s*/, "$")
          .replace(/\s+/g, ",")
      ) || [];
  if (!prices.length) return {};
  if (prices.length === 1) return { currentPrice: prices[0] };
  return {
    originalPrice: prices[0],
    currentPrice: prices[prices.length - 1],
  };
}

function sentenceList(value) {
  return normalizeText(value)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function buildTagline(record, categoryLabel) {
  const shortDescription = cleanShortDescription(record["Short Description"]);
  if (shortDescription) return convertVisibleUnits(shortDescription);
  const longDescription = cleanLongDescription(record.Description);
  if (longDescription) {
    return convertVisibleUnits(sentenceList(longDescription).slice(0, 2).join(" "));
  }
  return `${normalizeText(record.Name)} — Typhon ${categoryLabel.toLowerCase()} for jobsite work.`;
}

function buildLongDescription(record, categoryLabel, tagline) {
  const cleaned = cleanLongDescription(record.Description);
  if (cleaned) return convertVisibleUnits(cleaned);
  // Long description is missing or unusable — fall back to the short description
  // so the single page never shows a placeholder block.
  if (tagline) return tagline;
  return `${normalizeText(record.Name)} is a Typhon ${categoryLabel.toLowerCase()} available from the Typhon Machinery catalog.`;
}

function extractFeatureCandidates(record) {
  const text = normalizeText(record.Description);
  const matches = [];
  const numbered = [...text.matchAll(/\b\d+\.\s+(.+?)(?=\s+\d+\.| TYPHON Machinery| Why Choose| Successful Projects|$)/g)];
  for (const match of numbered) {
    const candidate = normalizeText(match[1])
      .replace(/^Key Features\s*/i, "")
      .replace(/^Included Accessories\s*/i, "Included accessories ")
      .replace(/^Comprehensive Package\s*/i, "Comprehensive package ");
    const firstSentence = sentenceList(candidate)[0] || candidate;
    if (firstSentence && firstSentence.length > 12) matches.push(cleanSalesCopy(convertVisibleUnits(firstSentence)));
  }
  return matches;
}

function extractApplications(record, category) {
  const text = normalizeText(`${record["Short Description"]} ${record.Description}`);
  const rangeMatch = text.match(/(?:Wide Range of Uses|Versatile Applications)\s+(.+?)(?=\s+\d+\.| TYPHON Machinery| Why Choose|$)/i);
  if (rangeMatch) {
    return unique(
      rangeMatch[1]
        .replace(/Compact and user-friendly design for/i, "")
        .replace(/Perfect for a wide range of tasks, including/i, "")
        .split(/,\s*|\sand\s/)
        .map((item) => titleCase(item.replace(/\.$/, "").trim()))
        .filter((item) => item.length > 2 && item.length < 42),
    ).slice(0, 8);
  }

  return categoryDefaults[category]?.applications || categoryDefaults.equipment.applications;
}

function extractSpecs(record, category, priceInfo) {
  const specs = [];
  const text = convertVisibleUnits(`${record.Name} ${record.Category} ${record["Short Description"]} ${record.Description}`);
  const categoryLabel = categoryDefaults[category]?.label || "Equipment";

  specs.push({ label: "Category", value: categoryLabel });
  if (priceInfo.currentPrice) specs.push({ label: "Current Price", value: priceInfo.currentPrice });

  const sku = cleanSku(record.SKU);
  if (sku) specs.push({ label: "SKU", value: sku });

  const gtin = normalizeText(record.GTIN);
  if (gtin) specs.push({ label: "GTIN", value: gtin });

  const tonMatch = text.match(/(\d+(?:\.\d+)?)\s*-?\s*ton/i);
  if (tonMatch) specs.push({ label: "Weight Class", value: `${tonMatch[1]} ton` });

  const lbMatch = text.match(/(\d{1,3}(?:,\d{3})+|\d{4,5})\s*lb/i);
  if (lbMatch && !specs.some((spec) => spec.label === "Weight Class")) {
    specs.push({ label: "Weight Class", value: `${lbMatch[1]} lb` });
  }

  const hpMatch = text.match(/(\d+(?:\.\d+)?)\s*HP/i);
  if (hpMatch) specs.push({ label: "Engine Power", value: `${hpMatch[1]} HP` });

  const engineSource = convertVisibleUnits(`${record.Category} ${record.Name} ${record["Short Description"]}`);
  const engineMatch = engineSource.match(/\b(?:Briggs\s*&\s*Stratton|B&S|Honda|Kubota|Yanmar|Vanguard)(?:\s+[A-Za-z0-9.-]+){0,4}(?:\s+engine)?/i);
  if (engineMatch) specs.push({ label: "Engine", value: normalizeText(engineMatch[0]).replace(/\s+$/, "") });

  const depthMatch = text.match(/(?:digging depth|maximum digging depth)[^0-9]*(\d+(?:\.\d+)?)\s*(?:in|ft)(?:\s*\([^)]+\))?/i);
  if (depthMatch) {
    const whole = text.match(/(?:maximum\s+)?digging depth[^.]{0,80}/i)?.[0];
    if (whole) specs.push({ label: "Digging Depth", value: normalizeText(whole.replace(/.*?(\d)/, "$1")) });
  }

  const heightMatch = text.match(/(?:platform height|max lifting height|lifting height)[^.]{0,90}/i);
  if (heightMatch) specs.push({ label: "Lift Height", value: normalizeText(heightMatch[0].replace(/^(platform height|max lifting height|lifting height)\s*/i, "")) });

  const capacityMatch = text.match(/(?:load capacity|bucket capacity|capacity)[^.]{0,90}/i);
  if (capacityMatch && !/ton/i.test(capacityMatch[0])) {
    specs.push({ label: "Capacity", value: normalizeText(capacityMatch[0].replace(/^(load capacity|bucket capacity|capacity)\s*/i, "")) });
  }

  return uniqueSpecs(specs).slice(0, 8);
}

function uniqueSpecs(specs) {
  const seen = new Set();
  return specs.filter((spec) => {
    const key = `${spec.label}:${spec.value}`.toLowerCase();
    if (!spec.value || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function productImages(record, category, productSlug, imageImportContext) {
  const fallback = categoryDefaults[category]?.fallbackImage || categoryDefaults.equipment.fallbackImage;
  const featureImage = normalizeText(record["Feature Image"]);
  const sourceImages = unique([
    featureImage,
    ...splitImageUrls(record["Images"]),
    ...splitImageUrls(record["Gallery Images"]),
  ]);

  if (!sourceImages.length) {
    return {
      image: fallback,
      thumbnailImage: fallback,
      gallery: [fallback],
      originalImageSource: undefined,
      originalGallerySources: undefined,
      imageImportWarnings: undefined,
    };
  }

  const imported = await importProductImages({
    productSlug,
    productId: productSlug,
    urls: sourceImages,
    cache: imageImportContext.cache,
    progress: (result) => {
      imageImportContext.done += 1;
      const label =
        result.status === "failed"
          ? "Failed"
          : result.status === "skipped duplicate"
            ? "Skipped duplicate"
            : "Imported";
      console.log(
        `Downloading images ${imageImportContext.done}/${imageImportContext.total}: ${label} — ${productSlug}`,
      );
    },
  });

  const gallery = imported.map((item) => item.localPath || item.sourceUrl).filter(Boolean);
  const warnings = imported
    .filter((item) => item.warning)
    .map((item) => item.warning);
  return {
    image: gallery[0] || fallback,
    thumbnailImage: imported[0]?.thumbnailPath || gallery[0] || fallback,
    gallery: gallery.slice(0, 16),
    originalImageSource: featureImage || sourceImages[0],
    originalGallerySources: sourceImages,
    imageImportWarnings: warnings.length ? warnings : undefined,
  };
}

async function productFromRecord(record, index, usedIds, imageImportContext) {
  const category = inferCategory(record);
  const defaults = categoryDefaults[category] || categoryDefaults.equipment;
  const categoryLabel = defaults.label;
  const idBase = slugFromUrls(
    record["Button URL"],
    record["Source URL"],
    record.Name,
    index,
  );
  let id = idBase;
  let duplicateIndex = 2;
  while (usedIds.has(id)) {
    id = `${idBase}-${duplicateIndex}`;
    duplicateIndex += 1;
  }
  usedIds.add(id);

  const priceInfo = extractPrices(record.Price);
  const images = await productImages(record, category, id, imageImportContext);
  const tagline = buildTagline(record, categoryLabel);
  const description = buildLongDescription(record, categoryLabel, tagline);
  const extractedFeatures = extractFeatureCandidates(record);
  const features = unique([...extractedFeatures, ...defaults.features]).slice(0, 6);
  const applications = extractApplications(record, category).slice(0, 8);
  const specs = extractSpecs(record, category, priceInfo);
  const productType = inferProductType(record, category);

  return {
    id,
    name: normalizeText(record.Name),
    productType,
    rawProductType: normalizeText(record["Product Type"]),
    category,
    categoryLabel,
    rawCategory: normalizeText(record.Category),
    sku: cleanSku(record.SKU),
    gtin: normalizeText(record.GTIN),
    price: normalizeText(record.Price),
    ...priceInfo,
    sourceUrl: normalizeText(record["Source URL"]),
    buttonUrl: normalizeText(record["Button URL"]),
    importConfidence: normalizeText(record["Import Confidence"]),
    series: inferSeries(record, category),
    weight: specs.find((spec) => spec.label === "Weight Class")?.value || categoryLabel,
    tagline,
    description,
    image: images.image,
    thumbnailImage: images.thumbnailImage,
    gallery: images.gallery,
    originalImageSource: images.originalImageSource,
    originalGallerySources: images.originalGallerySources,
    imageImportWarnings: images.imageImportWarnings,
    specs,
    features,
    applications,
    imageMatch: images.imageImportWarnings?.length
      ? "CSV image fields with import warnings"
      : images.image.startsWith("/uploads/products/")
        ? "Local CSV image import"
        : images.image.startsWith("http")
          ? "CSV image fields"
          : "Category fallback image",
  };
}

function buildCategoryList(products) {
  const counts = new Map();
  for (const product of products) {
    counts.set(product.category, (counts.get(product.category) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([id, count]) => ({
      id,
      label: categoryDefaults[id]?.label || titleCase(id.replace(/-/g, " ")),
      count,
      image: categoryDefaults[id]?.fallbackImage || categoryDefaults.equipment.fallbackImage,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function toTs(value) {
  return JSON.stringify(value, null, 2)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/\\u0026/g, "&");
}

async function main() {
  const csv = fs.readFileSync(CSV_PATH, "utf8");
  const rows = parseCsv(csv);
  const [rawHeaders, ...body] = rows;
  const headers = rawHeaders.map((header) => normalizeText(header));
  const records = body
    .filter((row) => row.some((cell) => normalizeText(cell)))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
  const usedIds = new Set();
  const imageImportContext = {
    cache: loadImageImportCache(),
    done: 0,
    total: records.reduce((sum, record) => {
      return sum + unique([
        normalizeText(record["Feature Image"]),
        ...splitImageUrls(record["Images"]),
        ...splitImageUrls(record["Gallery Images"]),
      ]).length;
    }, 0),
  };
  const products = [];
  for (let index = 0; index < records.length; index += 1) {
    products.push(await productFromRecord(records[index], index, usedIds, imageImportContext));
  }
  saveImageImportCache(imageImportContext.cache);
  const categories = buildCategoryList(products);
  const csvLabel = path.relative(process.cwd(), CSV_PATH).replace(/\\/g, "/");

  const output = `// Generated from ${csvLabel}.
// Run \`node scripts/build-typhon-products.cjs\` after updating the CSV.

export interface TyphonProductSpec {
  label: string;
  value: string;
}

export interface TyphonProduct {
  id: string;
  name: string;
  productType: "equipment" | "attachment";
  rawProductType: string;
  category: string;
  categoryLabel: string;
  rawCategory: string;
  sku: string;
  gtin: string;
  price: string;
  originalPrice?: string;
  currentPrice?: string;
  sourceUrl: string;
  buttonUrl: string;
  importConfidence: string;
  series: string;
  weight: string;
  tagline: string;
  description: string;
  image: string;
  thumbnailImage?: string;
  gallery: string[];
  originalImageSource?: string;
  originalGallerySources?: string[];
  imageImportWarnings?: string[];
  specs: TyphonProductSpec[];
  features: string[];
  applications: string[];
  imageMatch: string;
}

export interface TyphonCategory {
  id: string;
  label: string;
  count: number;
  image: string;
}

export const typhonProducts: TyphonProduct[] = ${toTs(products)};

export const typhonCategories: TyphonCategory[] = ${toTs(categories)};

export const getTyphonProductById = (id: string | undefined) =>
  typhonProducts.find((product) => product.id === id);

export const getTyphonProductHref = (product: Pick<TyphonProduct, "id">) =>
  \`/typhon-machinery/\${product.id}\`;
`;

  fs.writeFileSync(OUT_PATH, output);
  console.log(`Generated ${products.length} Typhon products in ${path.relative(process.cwd(), OUT_PATH)}`);
  console.log(`Categories: ${categories.map((category) => `${category.label} (${category.count})`).join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
