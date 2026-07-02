# Konstructz.com — Technical SEO / AEO / GEO Audit Report

Date: 2026-07-02 · Scope: full codebase crawl + live-site checks · All fixes built, validated (`npm run seo:check`), and committed.

## 1. Crawl inventory

- **127 canonical URLs** in sitemap.xml: homepage, 8 category landings (`/product/<slug>`), 13 Konstructz machines (`/equipment/<id>`), 81 Typhon products (`/typhon-machinery/<id>`, one duplicate excluded), blog archive + posts, 7 support pages, attachments pages, brand/legal/static pages.
- **10 alias URLs** intentionally outside the sitemap, each canonicalizing to the preferred URL: `/media` → `/blog`, 8× `/equipment/<category>` → `/product/<category>`, 1 duplicate Typhon import → its primary.
- Admin (`/sour/*`) noindexed + robots-blocked. No orphan pages found: every sitemap URL is reachable through navbar, footer (all 8 categories), category grids, related-machine cards, and now the prerendered link graph.

## 2. Biggest problem found & fixed: crawlers saw the homepage everywhere

The site is a client-rendered SPA. Before this audit, **every URL served the homepage `<head>` — including `rel=canonical https://konstructz.com/` — until JavaScript ran.** Google renders JS, but Bing's raw pass and AI/answer-engine crawlers (GPTBot, ClaudeBot, PerplexityBot, Bingbot preview) mostly don't, so to them the whole site looked like one page. Fixed with a build-time prerender pipeline:

- `scripts/prerender-routes.mjs` (new) writes **137 static snapshots** to `dist/prerendered/<route>/index.html` with per-route title, meta description, canonical, OG/Twitter tags, JSON-LD, and a plain-HTML body (H1, summary, breadcrumb, specs, internal links) that React replaces on mount — design untouched.
- Meta logic was extracted from `SeoManager.tsx` into **`src/lib/seoMeta.ts`** so runtime and build output can never drift.
- `static/.htaccess` now internally rewrites clean URLs to snapshots (no redirects), falling back to `spa-shell.html` — a shell **without** the homepage canonical — for unknown routes.
- `npm run build` now runs: sitemap/robots generation → vite build → prerender. `.gitignore` whitelists `dist/prerendered/` + `dist/spa-shell.html` so git deploys ship them.

## 3. Other fixes applied

| Issue | Fix |
|---|---|
| No 404 route — any junk URL rendered a blank 200 page with homepage meta ("soft 404") | New catch-all `NotFound` page (branded, links to all main sections) + `useNoindexNotFound` hook setting `noindex, follow`; also applied to product/category/Typhon/blog not-found states, gated on Supabase loading so real products never get flagged |
| Unknown `/blog/<slug>` URLs rendered a **copy of the first blog post** (duplicate content) | Exact slug match only; quiet loading frame, then proper not-found + noindex |
| Product pages had no link back to their category | Desktop: breadcrumb (Home / Equipment / Category) added above product title; mobile: category label is now a link; verified visually — layout intact |
| 5 groups of Typhon variants shared identical `<title>` | Titles disambiguated with SKU when names collide |
| True duplicate Typhon import (`landscaping-skeleton-rock-bucket-attachment-2`, same SKU/GTIN) | Canonicalized to primary + dropped from sitemap (see "remaining", below) |
| `og:image` was a relative URL (broken in link previews); `og:url`/`twitter:image` missing | Absolute URLs + both tags added in `index.html` |
| Footer linked blog via non-canonical `/media` | Now links `/blog` |

## 4. What was already healthy (verified, unchanged)

- Unique titles/descriptions per route, canonicals, OG/Twitter tags via SeoManager (runtime).
- Schema: Organization, WebSite, BreadcrumbList sitewide; Product (+SKU/GTIN) on product pages; FAQPage on category & support pages; BlogPosting on articles. All prerendered JSON-LD parses (136/136 validated).
- Category pages have real buyer content: intro, "what is a…", common uses, why-choose, FAQ, related categories — strong AEO/GEO shape for all 8 categories you listed.
- H1s present on all page types (homepage H1 renders via `Reveal as="h1"`); meaningful images have alt text; `alt=""` instances are decorative with `aria-hidden` (correct).
- robots.txt correct (admin/api blocked, sitemap referenced; now also blocks `/prerendered/` internals).
- **Language switcher is SEO-safe**: language is localStorage-only, URLs never change per language → no hreflang needed, no half-translated indexable pages. Correct as-is; hreflang would only be needed if you ever add `/es/`-style URLs.

## 5. Remaining issues / recommendations

1. **JS bundle is 3.7 MB (920 KB gzip) in one chunk** — the biggest performance lever left. Code-split with dynamic `import()` per route (admin, chat assistant, Typhon catalog are easy wins).
2. **Delete the duplicate Typhon import at the source** (KiuQ dashboard / import CSV): `landscaping-skeleton-rock-bucket-attachment-2`. The canonical patch neutralizes it, but the data should be cleaned.
3. **Admin-created products published between builds** aren't prerendered/sitemapped until the next `npm run build` — rebuild after adding products.
4. Hero videos autoplay with `preload="auto"` (two MP4s on the homepage) — consider `preload="metadata"` + poster images.
5. Blog content: when writing posts in the admin, link to relevant category/product pages in the body (editorial task; the templates already link archive ↔ posts ↔ latest).
6. Consider adding `width`/`height` (or `aspect-ratio`) to gallery images in flex layouts to further reduce CLS; the fixed-canvas desktop pages are not affected.

## 6. Google Search Console next steps

1. Resubmit `https://konstructz.com/sitemap.xml` (Indexing → Sitemaps) after deploying.
2. URL-inspect 3–4 key pages (`/product/mini-excavators`, one `/equipment/<machine>`, one blog post) → "Test live URL" → confirm the crawled HTML now shows the page's own title/canonical → Request indexing.
3. Watch **Pages → "Duplicate without user-selected canonical"** and **"Soft 404"** — both should decline over the next weeks.
4. Check the Enhancements reports (Products, FAQ, Breadcrumbs) for the structured data now visible in raw HTML.
5. In Bing Webmaster Tools, submit the sitemap too — Bing benefits most from the prerendered pages.
