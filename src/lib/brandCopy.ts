const BRAND_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bTyphon Machinery\b/g, "Typhon"],
  [/\bTyphon machinery\b/g, "Typhon"],
  [/\bTYPHON MACHINERY\b/g, "TYPHON"],
  [/\bTYPHON Machinery\b/g, "TYPHON"],
];

export function normalizeBrandCopy(value: string): string {
  return BRAND_REPLACEMENTS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    String(value || ""),
  );
}
