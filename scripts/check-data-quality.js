import esbuild from "esbuild";
import { pathToFileURL } from "node:url";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// 1. Transpile TS modules using esbuild
const tmp = path.join(os.tmpdir(), `kz-check-data-${Date.now()}.mjs`);
await esbuild.build({
  stdin: {
    contents: `
      export { products } from "./src/data/products";
      export { typhonProducts } from "./src/data/typhonProducts";
    `,
    resolveDir: process.cwd(),
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: tmp,
  logLevel: "error",
});

const { products, typhonProducts } = await import(pathToFileURL(tmp).href);
fs.rmSync(tmp, { force: true });

// Helper to check if string contains specific spec
function specValue(d, re) {
  if (!d.specs) return undefined;
  return d.specs.find((s) => re.test(s.label))?.value?.trim() || undefined;
}

console.log("==========================================");
console.log("    KONSTRUCTZ DATA QUALITY CHECKER       ");
console.log("==========================================\n");

const allItems = [...(products || []), ...(typhonProducts || [])];

// 1. Missing fields analysis
const missingHp = [];
const missingEngine = [];
const missingWeight = [];
const missingPrice = [];
const missingUrl = [];
const productNames = [];
const duplicateNames = new Set();
const nameMap = {};

for (const p of allItems) {
  if (p.productType === "machine" || !p.productType) {
    const hp = specValue(p, /horsepower|hp/i) || specValue(p, /engine/i)?.match(/(\d+)\s*hp/i)?.[0];
    const engine = specValue(p, /engine/i);
    const weight = p.weight || specValue(p, /weight/i);
    
    if (!hp) missingHp.push(p.name);
    if (!engine) missingEngine.push(p.name);
    if (!weight) missingWeight.push(p.name);
  }
  
  if (!p.price) missingPrice.push(p.name);
  if (!p.href && !p.id) missingUrl.push(p.name);

  // Duplicate / similarity checks
  const nameClean = p.name.trim().toLowerCase();
  if (nameMap[nameClean]) {
    duplicateNames.add(p.name);
  } else {
    nameMap[nameClean] = p;
  }
  productNames.push(p.name);
}

// 2. Attachments missing compatibility check
const missingCompatibility = [];
for (const p of allItems) {
  if (p.productType === "attachment") {
    const desc = (p.description || "").toLowerCase();
    const nameLower = p.name.toLowerCase();
    
    const hasCompat = /\b(terror|tyrant|stomp|vigor|skoop|0509|509|x1300|v1000|0501)\b/i.test(nameLower + " " + desc);
    if (!hasCompat) {
      missingCompatibility.push(p.name);
    }
  }
}

// 3. Similar names analysis (potential confusion)
const confusingPairs = [];
const checked = new Set();
for (const p1 of allItems) {
  for (const p2 of allItems) {
    if (p1.name === p2.name) continue;
    const key = [p1.name, p2.name].sort().join(" vs ");
    if (checked.has(key)) continue;
    checked.add(key);

    const n1 = p1.name.toLowerCase().replace(/typhon\s+/g, "");
    const n2 = p2.name.toLowerCase().replace(/typhon\s+/g, "");
    
    if (n1.includes(n2) || n2.includes(n1)) {
      confusingPairs.push(`${p1.name} vs ${p2.name} (Sub-string match)`);
    }
  }
}

console.log(`Total Products Analyzed: ${allItems.length}`);
console.log(`- Machines: ${allItems.filter(p => p.productType === "machine" || !p.productType).length}`);
console.log(`- Attachments: ${allItems.filter(p => p.productType === "attachment").length}\n`);

console.log("------------------------------------------");
console.log(`1. PRODUCTS MISSING HORSEPOWER (${missingHp.length}):`);
console.log("------------------------------------------");
missingHp.slice(0, 15).forEach(n => console.log(` - ${n}`));
if (missingHp.length > 15) console.log(` ... and ${missingHp.length - 15} more`);

console.log("\n------------------------------------------");
console.log(`2. PRODUCTS MISSING ENGINE (${missingEngine.length}):`);
console.log("------------------------------------------");
missingEngine.slice(0, 15).forEach(n => console.log(` - ${n}`));
if (missingEngine.length > 15) console.log(` ... and ${missingEngine.length - 15} more`);

console.log("\n------------------------------------------");
console.log(`3. PRODUCTS MISSING WEIGHT (${missingWeight.length}):`);
console.log("------------------------------------------");
missingWeight.slice(0, 15).forEach(n => console.log(` - ${n}`));
if (missingWeight.length > 15) console.log(` ... and ${missingWeight.length - 15} more`);

console.log("\n------------------------------------------");
console.log(`4. PRODUCTS MISSING PRICE (${missingPrice.length}):`);
console.log("------------------------------------------");
missingPrice.slice(0, 15).forEach(n => console.log(` - ${n}`));
if (missingPrice.length > 15) console.log(` ... and ${missingPrice.length - 15} more`);

console.log("\n------------------------------------------");
console.log(`5. PRODUCTS MISSING PRODUCT URL/HREF (${missingUrl.length}):`);
console.log("------------------------------------------");
missingUrl.slice(0, 15).forEach(n => console.log(` - ${n}`));
if (missingUrl.length > 15) console.log(` ... and ${missingUrl.length - 15} more`);

console.log("\n------------------------------------------");
console.log(`6. ATTACHMENTS MISSING COMPATIBILITY DATA (${missingCompatibility.length}):`);
console.log("------------------------------------------");
missingCompatibility.slice(0, 15).forEach(n => console.log(` - ${n}`));
if (missingCompatibility.length > 15) console.log(` ... and ${missingCompatibility.length - 15} more`);

console.log("\n------------------------------------------");
console.log(`7. DUPLICATE PRODUCT NAMES (${duplicateNames.size}):`);
console.log("------------------------------------------");
Array.from(duplicateNames).slice(0, 15).forEach(n => console.log(` - ${n}`));

console.log("\n------------------------------------------");
console.log(`8. POTENTIALLY CONFUSING SIMILAR NAMES (${confusingPairs.length}):`);
console.log("------------------------------------------");
confusingPairs.slice(0, 15).forEach(n => console.log(` - ${n}`));
if (confusingPairs.length > 15) console.log(` ... and ${confusingPairs.length - 15} more`);
