const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "../src/i18n/locales");
const targetFile = path.join(__dirname, "../src/i18n/dictionaries.ts");

function formatObject(obj) {
  return JSON.stringify(obj, null, 2);
}

function run() {
  const languages = ["en", "fr", "es", "jp", "kr", "cn", "it", "de"];
  const variables = {};

  for (const lang of languages) {
    const baseFile = path.join(localesDir, `${lang}.json`);
    const blogFile = path.join(localesDir, `blogui${lang}.json`);

    variables[lang] = JSON.parse(fs.readFileSync(baseFile, "utf8"));
    variables[`blogUi${lang.charAt(0).toUpperCase() + lang.slice(1)}`] = JSON.parse(
      fs.readFileSync(blogFile, "utf8")
    );
  }

  let fileContent = `export type LanguageCode = "EN" | "FR" | "JP" | "KR" | "ES" | "CN" | "IT" | "DE";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  htmlLang: string;
}

export type TranslationDictionary = Record<string, string>;

export const languageOptions: LanguageOption[] = [
  { code: "EN", name: "English", htmlLang: "en" },
  { code: "FR", name: "French", htmlLang: "fr" },
  { code: "JP", name: "Japanese", htmlLang: "ja" },
  { code: "KR", name: "Korean", htmlLang: "ko" },
  { code: "ES", name: "Spanish", htmlLang: "es" },
  { code: "CN", name: "Chinese", htmlLang: "zh" },
  { code: "IT", name: "Italian", htmlLang: "it" },
  { code: "DE", name: "German", htmlLang: "de" },
];

export const defaultLanguage: LanguageCode = "EN";
export const languageStorageKey = "language";

`;

  // Write base translation variables
  for (const lang of languages) {
    fileContent += `const ${lang}: TranslationDictionary = ${formatObject(variables[lang])};\n\n`;
  }

  // Write blog UI translation variables
  for (const lang of languages) {
    const varName = `blogUi${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
    fileContent += `const ${varName}: TranslationDictionary = ${formatObject(variables[varName])};\n\n`;
  }

  fileContent += `export const dictionaries: Record<LanguageCode, TranslationDictionary> = {
  EN: { ...en, ...blogUiEn },
  FR: { ...fr, ...blogUiFr },
  JP: { ...jp, ...blogUiJp },
  KR: { ...kr, ...blogUiKr },
  ES: { ...es, ...blogUiEs },
  CN: { ...cn, ...blogUiCn },
  IT: { ...it, ...blogUiIt },
  DE: { ...de, ...blogUiDe },
};
`;

  fs.writeFileSync(targetFile, fileContent, "utf8");
  console.log("Recompiled dictionaries.ts successfully!");
}

run();
