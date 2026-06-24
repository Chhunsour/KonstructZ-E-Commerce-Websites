const fs = require("fs");
const path = require("path");
const https = require("https");

const localesDir = path.join(__dirname, "../src/i18n/locales");

const noTranslate = [
  "Konstructz Machine",
  "Konstructz",
  "KonstructZ",
  "TYPHON",
  "STOMP V980",
  "STOMP V950",
  "STOMP",
  "ScoopyDig",
  "Scoopy Dig",
  "StoneKrusher",
  "Stone Krusher",
  "Kubota D1105",
  "Kubota",
  "Perkins",
  "Yamaha Motor",
  "Yamaha",
  "Briggs & Stratton",
  "Honda",
  "KUVUO",
  "FSD1-1",
  "FSD",
  "Skoop",
  "Spider One",
  "Stomp",
  "3 TONS",
  "4.0 TONS",
  "30 Mpa",
  "30Mpa",
  "21 HP",
  "25 HP",
  "21HP",
  "3800 lbs",
  "1.5T",
  "2T"
];

const langMap = {
  fr: "fr",
  es: "es",
  jp: "ja",
  kr: "ko",
  cn: "zh-CN",
  it: "it",
  de: "de"
};

function translateText(text, targetLang) {
  if (!text || typeof text !== "string") return Promise.resolve(text);

  // 1. Identify and protect template parameters like `{name}`, `{count}` etc.
  const placeholders = [];
  let protectedText = text;

  // Protect template variables matching {word}
  protectedText = protectedText.replace(/\{\w+\}/g, (match) => {
    const idx = placeholders.length;
    placeholders.push(match);
    return `__P_${idx}__`;
  });

  // Protect no-translate terms (case-insensitive regex word boundary match)
  // Sort no-translate terms by length descending to match longer ones first
  const sortedNoTranslate = [...noTranslate].sort((a, b) => b.length - a.length);
  for (const term of sortedNoTranslate) {
    const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedTerm}\\b`, "gi");
    protectedText = protectedText.replace(regex, (match) => {
      const idx = placeholders.length;
      placeholders.push(match);
      return `__P_${idx}__`;
    });
  }

  return new Promise((resolve) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      protectedText
    )}`;

    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json && json[0]) {
              let translated = json[0].map((x) => x[0]).join("");

              // Restore protected placeholders
              for (let i = 0; i < placeholders.length; i++) {
                translated = translated.replace(
                  new RegExp(`__P_${i}__`, "g"),
                  placeholders[i]
                );
              }
              resolve(translated);
            } else {
              resolve(text);
            }
          } catch (e) {
            resolve(text);
          }
        });
      })
      .on("error", () => {
        resolve(text);
      });
  });
}

async function run() {
  const enBase = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
  const enBlog = JSON.parse(fs.readFileSync(path.join(localesDir, "bloguien.json"), "utf8"));

  const files = [
    { source: enBase, prefix: "" },
    { source: enBlog, prefix: "blogui" }
  ];

  for (const file of files) {
    const sourceKeys = Object.keys(file.source);

    for (const [langCode, gtLang] of Object.entries(langMap)) {
      const targetFileName = `${file.prefix}${langCode}.json`;
      const targetPath = path.join(localesDir, targetFileName);

      let targetData = {};
      if (fs.existsSync(targetPath)) {
        targetData = JSON.parse(fs.readFileSync(targetPath, "utf8"));
      }

      let updatedCount = 0;
      console.log(`\nTranslating to ${langCode.toUpperCase()} (${targetFileName})...`);

      const batchSize = 15;
      for (let i = 0; i < sourceKeys.length; i += batchSize) {
        const batchKeys = sourceKeys.slice(i, i + batchSize);
        const promises = batchKeys.map(async (key) => {
          const existing = targetData[key];
          const isProtectedOnly = noTranslate.some(
            (term) => term.toLowerCase() === file.source[key].trim().toLowerCase()
          );

          if (!existing || (existing === file.source[key] && !isProtectedOnly)) {
            const translated = await translateText(file.source[key], gtLang);
            targetData[key] = translated;
            updatedCount++;
          }
        });
        await Promise.all(promises);
        if (updatedCount > 0 && i % 60 === 0) {
          console.log(`  Processed up to key ${i + batchKeys.length} / ${sourceKeys.length} (translated ${updatedCount} keys)...`);
        }
        await new Promise((r) => setTimeout(r, 100));
      }

      fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2), "utf8");
      console.log(`Completed ${langCode.toUpperCase()}! Translated ${updatedCount} new keys.`);
    }
  }
  console.log("\nAll translations updated successfully!");
}

run();
