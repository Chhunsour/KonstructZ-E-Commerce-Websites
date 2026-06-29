// Formats a Typhon product's raw CSV `description` into clean, structured blocks
// for the single page. The CSV copy lost its bold/headings/line-breaks on import
// and arrives as one collapsed wall of text, e.g.:
//   "<name> GTIN: 123 The <name> is … Key Features <Subheading> <body> Engine
//    Highlights <run of specs> … Standard Equipment Included ✔ a ✔ b … Ideal
//    Applications … Why Choose …? Key Benefits ✔ x ✔ y …"
//
// We rebuild structure at render time (never touching the stored data):
//   • Known section headings become bold headings with spacing.
//   • ✔-delimited and "1. 2. 3." runs become bullet lists.
//   • Everything else is grouped into readable paragraphs.
// Flattened spec tables (the "SpecificationDetails…" artifacts) are rebuilt
// as real tables when the section has recognizable spec labels.
//
// Everything is plain text rendered through React (which escapes it), so any
// stray markup is shown safely rather than injected.

import { normalizeBrandCopy } from "../../lib/brandCopy";

export interface DescriptionFeature {
  /** Optional bold lead-in, e.g. "Ideal for Tight-Space Tasks". */
  title?: string;
  body: string;
}

export interface DescriptionTableRow {
  label: string;
  value: string;
}

export type DescriptionBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: DescriptionFeature[] }
  | { kind: "table"; title: string; rows: DescriptionTableRow[] };

export type DescriptionBlocks =
  | { fallback: true }
  | { fallback: false; blocks: DescriptionBlock[] };

/** Fallback copy shown only when a product has no real full description. */
export const DESCRIPTION_FALLBACK = "Contact us for full product details.";

// Recurring section headings mined from the product copy. Longest first so
// "Standard Equipment Included" wins over "Included Equipment", etc.
const SECTION_HEADINGS = [
  "Standard Equipment Included",
  "Built-In Safety Equipment",
  "Versatile Multi-Purpose Performance",
  "High-Performance Hydraulic System",
  "Advanced Hydraulic System",
  "High-Flow Hydraulic System",
  "Operator Station Dimensions",
  "Premium Operator Comfort",
  "Lift Performance Highlights",
  "Performance Highlights",
  "Professional Performance",
  "Compaction Performance",
  "Digging Performance",
  "Hydraulic Thumb Benefits",
  "Boom Swing Benefits",
  "Engine Specifications",
  "Battery Specifications",
  "Engine Highlights",
  "Hydraulic Performance",
  "Hydraulic Features",
  "Included Equipment",
  "Technical Specifications",
  "Machine Dimensions",
  "Ideal Applications",
  "Operator Benefits",
  "Additional Benefits",
  "Cooling Benefits",
  "Operator Features",
  "Control Features",
  "Mobility Features",
  "Protection Features",
  "Comfort Features",
  "Cabin Features",
  "Safety Features",
  "Tank Capacities",
  "Key Features",
  "Key Benefits",
].sort((a, b) => b.length - a.length);

// Headings whose bodies are flattened spec tables.
const TABLE_HEADINGS = new Set([
  "Technical Specifications",
  "Machine Dimensions",
  "Operator Station Dimensions",
]);

const escapeForRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const SPEC_TABLE_LABELS = [
  "Maximum Engine Output",
  "Maximum Digging Depth",
  "Maximum Lifting Height",
  "Bucket Digging Force",
  "Hydraulic Oil Cooler",
  "Hydraulic Pump Flow",
  "Operator Station",
  "Operating Weight",
  "Battery Capacity",
  "Battery Type",
  "Bucket Capacity",
  "Bucket Volume",
  "Bucket Width",
  "Compaction Force",
  "Drum Diameter",
  "Drum Width",
  "Engine Model",
  "Fork Length",
  "Ground Clearance",
  "Hydraulic Flow",
  "Lifting Capacity",
  "Load Capacity",
  "Overall Height",
  "Overall Length",
  "Overall Width",
  "Platform Height",
  "Product Model",
  "Rated Load",
  "Rated Power",
  "Tank Capacity",
  "Travel Speed",
  "Turning Radius",
  "Vibration Frequency",
  "Voltage",
  "Working Height",
  "Boom Swing",
  "Capacity",
  "Engine",
  "GTIN",
  "Power",
  "Weight",
].sort((a, b) => b.length - a.length);

const SPEC_LABEL_RE = new RegExp(
  "(" + SPEC_TABLE_LABELS.map(escapeForRegex).join("|") + ")",
  "g"
);

// A heading must follow whitespace/start and be followed by whitespace + an
// uppercase letter, digit or ✔ — this avoids matching a phrase mid-sentence
// (e.g. "Hydraulic Oil Cooler for…" where the next word is lowercase).
const HEADING_RE = new RegExp(
  "(?:(?<=\\s)|^)(" +
    SECTION_HEADINGS.map(escapeForRegex).join("|") +
    "|Why Choose[^?]{0,90}\\?)(?=\\s+[A-Z0-9✔])",
  "g"
);

function stripHtml(value: string): string {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function groupSentences(sentences: string[], perParagraph = 3): string[] {
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += perParagraph) {
    paragraphs.push(sentences.slice(i, i + perParagraph).join(" "));
  }
  return paragraphs;
}

function toFeature(item: string): DescriptionFeature {
  // Bold the lead-in only when the source uses a clear "Title: body" delimiter.
  const match = item.match(/^([^.!?:]{4,70}):\s+(.+)$/s);
  if (match) return { title: match[1].trim(), body: match[2].trim() };
  return { body: item };
}

function cleanTableValue(value: string): string {
  return value
    .replace(/^[:\s-]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSpecRows(body: string): DescriptionTableRow[] {
  const text = body
    .replace(/^Specification\s*Details/i, "")
    .replace(/^Specification\s*Value/i, "")
    .trim();
  const matches = [...text.matchAll(SPEC_LABEL_RE)];
  const rows: DescriptionTableRow[] = [];

  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const label = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index ?? text.length : text.length;
    let value = cleanTableValue(text.slice(start, end));
    const nextMatch = matches[i + 1];
    const followingMatch = matches[i + 2];
    if (
      label === "Engine" &&
      value &&
      !value.endsWith("Engine") &&
      nextMatch?.[1].trim() === "Engine" &&
      followingMatch
    ) {
      const nextStart = (nextMatch.index ?? 0) + nextMatch[0].length;
      const nextEnd = followingMatch.index ?? text.length;
      if (!cleanTableValue(text.slice(nextStart, nextEnd))) value = `${value} Engine`;
    }

    if (value.length < 2 || value.length > 120) continue;
    if (rows.some((row) => row.label === label && row.value === value)) continue;
    rows.push({ label, value });
  }

  return rows.slice(0, 18);
}

/** Split a section body into bullet items via ✔ or "1. 2." markers, else null. */
function detectList(body: string): { pre: string; items: DescriptionFeature[] } | null {
  if (body.includes("✔")) {
    const firstCheck = body.indexOf("✔");
    const pre = body.slice(0, firstCheck).trim();
    const items = body
      .slice(firstCheck)
      .split("✔")
      .map((s) => s.trim().replace(/[.\s]+$/, ""))
      .filter((s) => s.length > 1)
      .slice(0, 18)
      .map(toFeature);
    return items.length ? { pre, items } : null;
  }
  if (/\s1\.\s/.test(` ${body}`)) {
    const items = body
      .split(/\s+(?=\d{1,2}\.\s)/)
      .map((chunk) => chunk.replace(/^\s*\d{1,2}\.\s*/, "").trim())
      .filter((chunk) => chunk.length > 3)
      .slice(0, 18)
      .map(toFeature);
    if (items.length) return { pre: "", items };
  }
  return null;
}

function pushBody(blocks: DescriptionBlock[], body: string) {
  const list = detectList(body);
  if (list) {
    if (list.pre.length > 40) blocks.push({ kind: "paragraph", text: list.pre });
    blocks.push({ kind: "list", items: list.items });
  } else {
    for (const p of groupSentences(splitSentences(body))) {
      blocks.push({ kind: "paragraph", text: p });
    }
  }
}

export function buildDescriptionBlocks(
  description: string,
  tagline: string
): DescriptionBlocks {
  let text = stripHtml(normalizeBrandCopy(description));
  const short = stripHtml(normalizeBrandCopy(tagline));

  // No real full description (empty, or just a copy of the short description).
  if (!text || (short && text === short)) return { fallback: true };

  // Drop the leading "<Product name> … GTIN: 1234567890" boilerplate.
  text = text.replace(/^.*?GTIN:\s*\d+\s*/i, "").trim() || text;

  const blocks: DescriptionBlock[] = [];
  const matches = [...text.matchAll(HEADING_RE)];

  // Intro (everything before the first heading).
  const introEnd = matches.length ? matches[0].index ?? text.length : text.length;
  for (const p of groupSentences(splitSentences(text.slice(0, introEnd).trim()))) {
    blocks.push({ kind: "paragraph", text: p });
  }

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const heading = m[1].trim();
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index ?? text.length : text.length;
    const body = text.slice(start, end).trim();

    if (TABLE_HEADINGS.has(heading) || /^Specification(Details|Value)?/i.test(body)) {
      const rows = buildSpecRows(body);
      if (rows.length >= 2) blocks.push({ kind: "table", title: heading, rows });
      continue;
    }
    if (!body) continue;

    blocks.push({ kind: "heading", text: heading });
    pushBody(blocks, body);
  }

  if (blocks.length === 0) return { fallback: true };
  return { fallback: false, blocks };
}
