const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "../src/i18n/locales");
const enPath = path.join(localesDir, "en.json");
const enData = JSON.parse(fs.readFileSync(enPath, "utf8"));

const filesToLocalize = [];

function getFilesRecursively(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFilesRecursively(fullPath);
    } else if (stat.isFile() && item.endsWith(".tsx")) {
      const baseName = path.basename(item);
      if (
        baseName !== "FlagIcons.tsx" &&
        baseName !== "AnimaScaler.tsx" &&
        baseName !== "I18nContext.tsx" &&
        baseName !== "ThemeContext.tsx" &&
        baseName !== "App.tsx" &&
        baseName !== "index.tsx"
      ) {
        filesToLocalize.push(fullPath);
      }
    }
  }
}

getFilesRecursively(path.join(__dirname, "../src/pages"));
getFilesRecursively(path.join(__dirname, "../src/screens"));
getFilesRecursively(path.join(__dirname, "../src/components"));

function isTranslatable(str) {
  if (typeof str !== "string") return false;
  str = str.trim();
  if (str.length < 3) return false;

  // Exclude assets, tags, classes, URLs
  if (
    str.startsWith("/") ||
    str.startsWith("#") ||
    str.startsWith("http") ||
    str.includes("bg-") ||
    str.includes("text-")
  )
    return false;
  if (
    str.endsWith(".png") ||
    str.endsWith(".jpg") ||
    str.endsWith(".svg") ||
    str.endsWith(".webp")
  )
    return false;
  if (
    str.includes("font-family") ||
    str.includes("w-") ||
    str.includes("h-") ||
    str.includes("grid-")
  )
    return false;

  // Exclude common icon names
  if (
    /^[a-z]+$/.test(str) &&
    [
      "card",
      "doc",
      "order",
      "shipping",
      "warranty",
      "machine",
      "attachments",
      "contact",
      "track",
      "phone",
      "mail",
      "clock",
      "search",
      "wrench",
      "arrow"
    ].includes(str)
  )
    return false;

  const hasLetters = /[a-zA-Z]/.test(str);
  const isSingleCommonWord =
    /^[a-zA-Z]+$/.test(str) &&
    [
      "Email",
      "Location",
      "Phone",
      "Hours",
      "Search",
      "Details",
      "Home",
      "About",
      "Support",
      "Blog",
      "Contact",
      "Quote",
      "Warning",
      "Error",
      "Success",
      "Close",
      "Submit",
      "Language",
      "Payments",
      "Steps",
      "FAQ"
    ].includes(str);
  const hasSpaces = /\s+/.test(str);

  return hasLetters && (hasSpaces || isSingleCommonWord);
}

// Generate unique translation keys
function generateKey(fileName, val) {
  const cleanBase = path
    .basename(fileName, ".tsx")
    .replace(/Support$/, "")
    .replace(/Section$/, "")
    .toLowerCase();

  // Create a clean key from string content
  const cleanVal = val
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "")
    .split(".")
    .slice(0, 3)
    .join(".");

  return `auto.${cleanBase}.${cleanVal}`;
}

let newKeysCount = 0;

for (const filePath of filesToLocalize) {
  if (!fs.existsSync(filePath)) continue;

  console.log(`Processing ${path.basename(filePath)}...`);
  let content = fs.readFileSync(filePath, "utf8");
  let hasChanges = false;

  // 1. Match attributes: attr="translatable string"
  // Exclude 'to', 'src', 'className', 'href', 'id', 'variant', 'type'
  content = content.replace(/(\w+)\s*=\s*"([^"\n]{3,})"/g, (match, attrName, value) => {
    if (
      ["to", "src", "className", "href", "id", "variant", "type"].includes(
        attrName
      )
    )
      return match;
    if (isTranslatable(value)) {
      const key = generateKey(filePath, value);
      enData[key] = value;
      newKeysCount++;
      hasChanges = true;
      return `${attrName}={t("${key}")}`;
    }
    return match;
  });

  // 2. Match variables: prefix: "translatable string" or suffix of array elements
  content = content.replace(/([\:\,\(\[\+]\s*)"([^"\n]{3,})"/g, (match, prefix, value) => {
    if (isTranslatable(value)) {
      const key = generateKey(filePath, value);
      enData[key] = value;
      newKeysCount++;
      hasChanges = true;
      return `${prefix}t("${key}")`;
    }
    return match;
  });

  // 3. Match single quotes inside JS variables/arrays
  content = content.replace(/([\:\,\(\[\+]\s*)'([^'\n]{3,})'/g, (match, prefix, value) => {
    if (isTranslatable(value)) {
      const key = generateKey(filePath, value);
      enData[key] = value;
      newKeysCount++;
      hasChanges = true;
      return `${prefix}t("${key}")`;
    }
    return match;
  });

  // 4. Match JSX text nodes >Translatable string<
  content = content.replace(/>\s*([a-zA-Z0-9\s&,\.\-\?\!\(\)\'\’\/\+]{3,})\s*</g, (match, value) => {
    const cleanText = value.trim();
    if (isTranslatable(cleanText)) {
      const key = generateKey(filePath, cleanText);
      enData[key] = cleanText;
      newKeysCount++;
      hasChanges = true;
      return `>{t("${key}")}<`;
    }
    return match;
  });

  if (hasChanges) {
    // Determine relative import path for useI18n context
    let relativeImport = path
      .relative(path.dirname(filePath), path.join(__dirname, "../src/context/I18nContext"))
      .replace(/\\/g, "/");
    if (!relativeImport.startsWith(".")) {
      relativeImport = "./" + relativeImport;
    }
    relativeImport = relativeImport.replace(/\.(tsx|ts)$/, "");

    // Insert import at the top if not present
    if (!content.includes("useI18n")) {
      content = `import { useI18n } from "${relativeImport}";\n` + content;
    }

    // Insert t in scope inside component body
    const compRegex = /(export\s+const\s+\w+(?:\s*:\s*(?:React\.FC(?:<[^>]+>)?|JSX\.Element))?\s*=\s*\([^)]*\)\s*(?::\s*JSX\.Element)?\s*=>\s*\{|const\s+\w+(?:\s*:\s*(?:React\.FC(?:<[^>]+>)?|JSX\.Element))?\s*=\s*\([^)]*\)\s*(?::\s*JSX\.Element)?\s*=>\s*\{|export\s+function\s+\w+\s*\([^)]*\)\s*(?::\s*\w+)?\s*\{|function\s+\w+\s*\([^)]*\)\s*(?::\s*\w+)?\s*\{)/g;

    content = content.replace(compRegex, (match, name1, offset, fullText) => {
      const slice = fullText.substring(offset, offset + match.length + 150);
      if (slice.includes("useI18n") || slice.includes("const { t }")) {
        return match; // Already imported or hook called in this component
      }
      return `${match}\n  const { t } = useI18n();`;
    });

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`  Localized and updated ${path.basename(filePath)}`);
  }
}

if (newKeysCount > 0) {
  fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), "utf8");
  console.log(`Added ${newKeysCount} new keys to en.json`);
}
