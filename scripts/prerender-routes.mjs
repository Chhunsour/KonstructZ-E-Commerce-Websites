/**
 * Build-time prerenderer for crawler-visible SEO.
 *
 * The site is a client-rendered SPA: without this step every URL serves the
 * same homepage <head> (same title, same canonical) to crawlers that don't
 * execute JavaScript — Bing's raw pass and most AI/answer-engine crawlers
 * (GPTBot, ClaudeBot, PerplexityBot). This script writes a static HTML
 * snapshot per route into dist/prerendered/<route>/index.html containing:
 *
 *   • the exact same title/description/canonical/OG/Twitter/JSON-LD that
 *     SeoManager.tsx applies at runtime (shared src/lib/seoMeta.ts logic);
 *   • a plain-HTML fallback inside #app — H1, summary, breadcrumb and
 *     internal links — so non-JS crawlers can discover every product,
 *     category, and blog URL. React replaces it on mount, so the design
 *     is untouched for real visitors.
 *
 * static/.htaccess internally rewrites clean URLs to these snapshots (no
 * redirects, URLs never change), and falls back to /spa-shell.html — a copy
 * of index.html WITHOUT the homepage canonical — for unknown routes, so
 * junk URLs stop claiming rel=canonical https://konstructz.com/.
 *
 * Runs after `vite build` (see package.json "build").
 */
import esbuild from "esbuild";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildRoutes } from "./generate-seo-files.mjs";

const DIST = path.join(process.cwd(), "dist");
const OUT = path.join(DIST, "prerendered");
const SITE_URL = "https://konstructz.com";

const loadSeo = async () => {
  const tmp = path.join(os.tmpdir(), `kz-prerender-${Date.now()}.mjs`);
  await esbuild.build({
    stdin: {
      contents: `
        export {
          getRouteConfig,
          baseSchema,
          breadcrumbSchema,
          DEFAULT_IMAGE,
        } from "./src/lib/seoMeta";
        export { products } from "./src/data/products";
        export { productCategories } from "./src/data/productCategories";
        export { typhonProducts } from "./src/data/typhonProducts";
        export { blogPosts } from "./src/data/blogPosts";
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
  const mod = await import(pathToFileURL(tmp).href);
  fs.rmSync(tmp, { force: true });
  return mod;
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const link = (href, label) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;

const linkList = (heading, items) =>
  items.length
    ? `<h2>${escapeHtml(heading)}</h2><ul>${items
        .map((item) => `<li>${link(item.href, item.label)}</li>`)
        .join("")}</ul>`
    : "";

const SITE_NAV = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Equipment Categories" },
  { href: "/equipment", label: "All Machines" },
  { href: "/typhon-machinery", label: "Typhon Machinery" },
  { href: "/attachments", label: "Attachments" },
  { href: "/blog", label: "Blog & Guides" },
  { href: "/support", label: "Support Center" },
  { href: "/about", label: "About Konstructz" },
  { href: "/contact", label: "Contact & Quotes" },
];

/**
 * Route-specific crawlable body: H1 + summary + the internal links a search
 * engine needs to discover the rest of the site from this page.
 */
const buildFallbackBody = (routePath, config, data) => {
  const { products, productCategories, typhonProducts } = data;
  const pieces = [];
  const h1 = escapeHtml(config.title.split("|")[0].trim());

  // Breadcrumb (matches the BreadcrumbList JSON-LD).
  const parts = routePath.split("/").filter(Boolean);
  const crumbs = [link("/", "Home")];
  parts.forEach((part, i) => {
    const crumbPath = `/${parts.slice(0, i + 1).join("/")}`;
    const label = part.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    crumbs.push(i === parts.length - 1 ? escapeHtml(label) : link(crumbPath, label));
  });
  pieces.push(`<nav aria-label="Breadcrumb">${crumbs.join(" / ")}</nav>`);
  pieces.push(`<h1>${h1}</h1>`);
  pieces.push(`<p>${escapeHtml(config.description)}</p>`);

  const productMatch = routePath.match(/^\/equipment\/([^/]+)$/);
  const konstructzProduct = productMatch && products.find((p) => p.id === productMatch[1]);
  const categoryMatch = routePath.match(/^\/product\/([^/]+)$/);
  const category = categoryMatch && productCategories.find((c) => c.slug === categoryMatch[1]);
  const typhonMatch = routePath.match(/^\/typhon-machinery\/([^/]+)$/);
  const typhonProduct = typhonMatch && typhonProducts.find((p) => p.id === typhonMatch[1]);

  if (konstructzProduct) {
    const cat = productCategories.find((c) => c.productCategoryKey === konstructzProduct.category);
    if (cat) {
      pieces.push(`<p>Category: ${link(`/product/${cat.slug}`, cat.name)}</p>`);
    }
    const specs = (konstructzProduct.specs || []).filter((s) => s.label && s.value);
    if (specs.length) {
      pieces.push(
        `<h2>Key specifications</h2><ul>${specs
          .map((s) => `<li>${escapeHtml(s.label)}: ${escapeHtml(s.value)}</li>`)
          .join("")}</ul>`
      );
    }
    const related = products
      .filter((p) => p.category === konstructzProduct.category && p.id !== konstructzProduct.id)
      .slice(0, 4)
      .map((p) => ({ href: `/equipment/${p.id}`, label: p.name }));
    pieces.push(linkList("Related machines", related));
  } else if (category) {
    const machines = products
      .filter((p) => p.category === category.productCategoryKey)
      .map((p) => ({ href: `/equipment/${p.id}`, label: p.name }));
    pieces.push(linkList(`${category.name} machines`, machines));
    if (Array.isArray(category.faqs) && category.faqs.length) {
      pieces.push(
        `<h2>${escapeHtml(category.name)} — common questions</h2>` +
          category.faqs
            .map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`)
            .join("")
      );
    }
    const others = productCategories
      .filter((c) => c.slug !== category.slug)
      .map((c) => ({ href: `/product/${c.slug}`, label: c.name }));
    pieces.push(linkList("Related equipment categories", others));
  } else if (typhonProduct) {
    pieces.push(`<p>Catalog: ${link("/typhon-machinery", "Typhon Machinery")}</p>`);
    const specs = (typhonProduct.specs || []).filter((s) => s.label && s.value);
    if (specs.length) {
      pieces.push(
        `<h2>Key specifications</h2><ul>${specs
          .map((s) => `<li>${escapeHtml(s.label)}: ${escapeHtml(s.value)}</li>`)
          .join("")}</ul>`
      );
    }
  } else if (routePath === "/categories" || routePath === "/") {
    pieces.push(
      linkList(
        "Equipment categories",
        productCategories.map((c) => ({ href: `/product/${c.slug}`, label: c.name }))
      )
    );
  } else if (routePath === "/equipment") {
    pieces.push(
      linkList(
        "Equipment categories",
        productCategories.map((c) => ({ href: `/product/${c.slug}`, label: c.name }))
      )
    );
    pieces.push(
      linkList(
        "All Konstructz machines",
        products.map((p) => ({ href: `/equipment/${p.id}`, label: p.name }))
      )
    );
  } else if (routePath === "/typhon-machinery") {
    pieces.push(
      linkList(
        "Typhon products",
        typhonProducts.map((p) => ({ href: `/typhon-machinery/${p.id}`, label: p.name }))
      )
    );
  } else if (routePath === "/blog") {
    pieces.push(linkList("Articles", data.blogLinks));
  }

  pieces.push(
    `<nav aria-label="Site sections"><ul>${SITE_NAV.map(
      (n) => `<li>${link(n.href, n.label)}</li>`
    ).join("")}</ul></nav>`
  );

  // Plain neutral block — visible only until React mounts and replaces #app.
  return `<div style="max-width:960px;margin:0 auto;padding:48px 20px;font-family:Arial,Helvetica,sans-serif;line-height:1.6">${pieces.join("\n")}</div>`;
};

const setTag = (html, pattern, replacement, label, routePath) => {
  if (!pattern.test(html)) {
    throw new Error(`Template is missing ${label} while prerendering ${routePath}`);
  }
  return html.replace(pattern, replacement);
};

const renderRoute = (template, routePath, seo, data) => {
  const config = seo.getRouteConfig(routePath);
  const canonicalPath = config.canonicalPath ?? routePath;
  const canonical = `${SITE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;
  const image = config.image ?? seo.DEFAULT_IMAGE;
  const graph = [
    ...seo.baseSchema(),
    seo.breadcrumbSchema(canonicalPath),
    ...(config.schema ?? []),
  ];
  const jsonLd = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });

  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(config.title)}</title>`, "<title>", routePath);
  html = setTag(
    html,
    /(<meta name="description" content=")[^"]*(")/,
    `$1${escapeHtml(config.description)}$2`,
    "meta description",
    routePath
  );
  html = setTag(
    html,
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${canonical}$2`,
    "canonical link",
    routePath
  );
  const metaPairs = [
    [/(<meta property="og:title" content=")[^"]*(")/, escapeHtml(config.title)],
    [/(<meta property="og:description" content=")[^"]*(")/, escapeHtml(config.description)],
    [/(<meta property="og:type" content=")[^"]*(")/, config.type ?? "website"],
    [/(<meta property="og:image" content=")[^"]*(")/, escapeHtml(image)],
    [/(<meta property="og:url" content=")[^"]*(")/, canonical],
    [/(<meta name="twitter:title" content=")[^"]*(")/, escapeHtml(config.title)],
    [/(<meta name="twitter:description" content=")[^"]*(")/, escapeHtml(config.description)],
    [/(<meta name="twitter:image" content=")[^"]*(")/, escapeHtml(image)],
  ];
  for (const [pattern, value] of metaPairs) {
    html = setTag(html, pattern, `$1${value}$2`, pattern.source.slice(0, 40), routePath);
  }
  html = setTag(
    html,
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${jsonLd}</script>`,
    "JSON-LD block",
    routePath
  );
  if (!html.includes('<div id="app"></div>')) {
    throw new Error(`Template is missing the empty #app mount node while prerendering ${routePath}`);
  }
  html = html.replace(
    '<div id="app"></div>',
    `<div id="app">${buildFallbackBody(routePath, config, data)}</div>`
  );
  return html;
};

const main = async () => {
  const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
  const seo = await loadSeo();

  const routes = await buildRoutes();
  const routePaths = routes.map((r) => r.loc.replace(SITE_URL, "") || "/");

  // Legacy/alias URLs — prerendered with a canonical pointing at the
  // preferred URL, but never listed in the sitemap. Includes re-imported
  // Typhon duplicates, which buildRoutes drops from the sitemap.
  // (/media is NOT prerendered: .htaccess 301s it to /blog.)
  const aliases = [
    ...seo.productCategories.map((c) => `/equipment/${c.slug}`),
    ...seo.typhonProducts.map((p) => `/typhon-machinery/${p.id}`),
  ].filter((alias) => !routePaths.includes(alias));

  const data = {
    products: seo.products,
    productCategories: seo.productCategories,
    typhonProducts: seo.typhonProducts,
    blogLinks: routePaths
      .filter((p) => p.startsWith("/blog/"))
      .map((p) => {
        const slug = p.replace("/blog/", "");
        const post = seo.blogPosts.find((b) => b.slug === slug);
        const label = post?.title || slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        return { href: p, label };
      }),
  };

  fs.rmSync(OUT, { recursive: true, force: true });

  let count = 0;
  for (const routePath of [...routePaths, ...aliases]) {
    if (routePath === "/") {
      // The homepage stays dist/index.html — just give it the crawlable body.
      const homeHtml = renderRoute(template, "/", seo, data);
      fs.writeFileSync(path.join(DIST, "index.html"), homeHtml);
      count += 1;
      continue;
    }
    const safe = path.normalize(routePath).replace(/^(\.\.[/\\])+/, "");
    const dir = path.join(OUT, ...safe.split("/").filter(Boolean));
    fs.mkdirSync(dir, { recursive: true });
    const html = renderRoute(template, routePath, seo, data);
    fs.writeFileSync(path.join(dir, "index.html"), html);
    if (routePath === "/blog") {
      const publicBlogDir = path.join(DIST, "blog");
      fs.mkdirSync(publicBlogDir, { recursive: true });
      fs.writeFileSync(path.join(publicBlogDir, "index.html"), html);
    }
    count += 1;
  }

  // SPA fallback shell for unknown routes: same app bundle, but WITHOUT the
  // homepage canonical/og:url and with a neutral title, so junk URLs don't
  // present themselves as duplicates of the homepage to non-JS crawlers.
  // (Real 404 handling happens in-app: the catch-all route sets noindex.)
  let shell = template;
  shell = shell.replace(/<title>[\s\S]*?<\/title>/, "<title>Konstructz</title>");
  shell = shell.replace(/[ \t]*<link rel="canonical"[^>]*>\s*/, "");
  shell = shell.replace(/[ \t]*<meta property="og:url"[^>]*>\s*/, "");
  fs.writeFileSync(path.join(DIST, "spa-shell.html"), shell);

  console.log(`Prerendered ${count} routes into dist/ (+ spa-shell.html)`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
