const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/i18n/dictionaries.ts");
const fileContent = fs.readFileSync(filePath, "utf8");

// Match all variables of type TranslationDictionary
const dicts = {};
const regex = /const\s+(\w+)\s*:\s*TranslationDictionary\s*=\s*({[\s\S]*?});/g;
let match;
while ((match = regex.exec(fileContent)) !== null) {
  const name = match[1];
  const objStr = match[2];
  try {
    // Evaluate the object literal string safely
    const obj = new Function(`return ${objStr}`)();
    dicts[name] = obj;
  } catch (e) {
    console.error(`Failed to parse ${name}:`, e);
  }
}

// Ensure output directory exists
const outputDir = path.join(__dirname, "../src/i18n/locales");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write JSON files
for (const [lang, dict] of Object.entries(dicts)) {
  fs.writeFileSync(
    path.join(outputDir, `${lang.toLowerCase()}.json`),
    JSON.stringify(dict, null, 2),
    "utf8"
  );
  console.log(`Wrote ${lang.toLowerCase()}.json`);
}
