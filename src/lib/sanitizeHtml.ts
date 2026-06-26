/**
 * Dependency-free HTML sanitizer for admin-authored blog content.
 *
 * Blog bodies are written in the WYSIWYG editor and stored as HTML. Although
 * only authenticated admins can write posts, we still sanitize on render (and
 * on save) so a copy-pasted payload or a future XSS can never inject scripts,
 * event handlers, or `javascript:` URLs into the public site.
 *
 * Strategy: parse into a detached document, then walk the tree keeping only an
 * allowlist of tags/attributes. Unknown formatting tags are *unwrapped* (their
 * text is kept); dangerous tags are dropped entirely.
 */

/** Block/inline tags the editor can produce and we trust to render. */
const ALLOWED_TAGS = new Set([
  "p", "br", "hr", "span", "div",
  "h1", "h2", "h3", "h4",
  "strong", "b", "em", "i", "u", "s", "sub", "sup", "mark",
  "blockquote", "ul", "ol", "li",
  "a", "img", "figure", "figcaption",
  "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
]);

/** Tags removed together with everything inside them. */
const DANGEROUS_TAGS = new Set([
  "script", "style", "iframe", "object", "embed", "link", "meta",
  "form", "input", "button", "textarea", "select", "noscript", "title",
]);

/** Per-tag attribute allowlist. `*` applies to every allowed tag. */
const ALLOWED_ATTR: Record<string, Set<string>> = {
  "*": new Set(["class"]),
  a: new Set(["href", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading"]),
};

const isSafeUrl = (raw: string, { allowData = false } = {}): boolean => {
  const url = raw.trim();
  if (url === "") return false;
  // Relative paths and anchors are always fine.
  if (/^(\/|#|\.\/|\.\.\/)/.test(url)) return true;
  // Collapse whitespace so "java\nscript:" can't slip past the scheme check.
  const stripped = url.replace(/\s/g, "").toLowerCase();
  if (stripped.startsWith("http://") || stripped.startsWith("https://")) return true;
  if (stripped.startsWith("mailto:") || stripped.startsWith("tel:")) return true;
  if (allowData && stripped.startsWith("data:image/")) return true;
  // Reject javascript:, vbscript:, data:text/html, etc.
  return false;
};

const sanitizeElement = (el: Element): void => {
  // Strip event handlers and disallowed attributes.
  const allowed = ALLOWED_ATTR[el.tagName.toLowerCase()] ?? new Set<string>();
  const global = ALLOWED_ATTR["*"];
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name.toLowerCase();
    if (!allowed.has(name) && !global.has(name)) {
      el.removeAttribute(attr.name);
      continue;
    }
    if (name === "href" && !isSafeUrl(attr.value)) {
      el.removeAttribute(attr.name);
    }
    if (name === "src" && !isSafeUrl(attr.value, { allowData: true })) {
      el.removeAttribute(attr.name);
    }
  }

  // Harden links that open in a new tab.
  if (el.tagName === "A") {
    const a = el as HTMLAnchorElement;
    if (!a.getAttribute("href")) {
      // anchor lost its href during cleaning — unwrap to plain text below
    } else if (a.getAttribute("target") === "_blank") {
      a.setAttribute("rel", "noopener noreferrer");
    }
  }
  if (el.tagName === "IMG") {
    el.setAttribute("loading", "lazy");
  }
};

const walk = (node: Node): void => {
  // Iterate over a snapshot — we mutate as we go.
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) continue;
    if (child.nodeType === Node.COMMENT_NODE) {
      child.remove();
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) {
      child.remove();
      continue;
    }
    const el = child as Element;
    const tag = el.tagName.toLowerCase();

    if (DANGEROUS_TAGS.has(tag)) {
      el.remove();
      continue;
    }

    if (!ALLOWED_TAGS.has(tag)) {
      // Unwrap: keep the inner content, drop the tag.
      walk(el);
      while (el.firstChild) el.parentNode?.insertBefore(el.firstChild, el);
      el.remove();
      continue;
    }

    sanitizeElement(el);
    walk(el);

    // An anchor that lost its href is no longer interactive — unwrap it.
    if (tag === "a" && !el.getAttribute("href")) {
      while (el.firstChild) el.parentNode?.insertBefore(el.firstChild, el);
      el.remove();
    }
  }
};

/** Returns a sanitized HTML string safe to inject via dangerouslySetInnerHTML. */
export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return "";
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    // SSR / non-browser: strip every tag as a conservative fallback.
    return dirty.replace(/<[^>]*>/g, "");
  }
  const doc = new DOMParser().parseFromString(dirty, "text/html");
  walk(doc.body);
  return doc.body.innerHTML;
};

/**
 * Heuristic: does this content string look like HTML (from the WYSIWYG editor)
 * rather than legacy Markdown? New posts always start with a block tag.
 */
export const looksLikeHtml = (content: string): boolean => {
  const trimmed = content.trimStart();
  return /^<(p|h[1-4]|ul|ol|blockquote|div|figure|hr|pre|table|img|span)[\s>/]/i.test(
    trimmed
  );
};

/** Plain-text length of HTML/markdown content (for word-count style hints). */
export const contentTextLength = (content: string): number => {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return content.replace(/<[^>]*>/g, "").trim().length;
  }
  const doc = new DOMParser().parseFromString(content, "text/html");
  return (doc.body.textContent ?? "").trim().length;
};
