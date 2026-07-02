import esbuild from "esbuild";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE_URL = "https://konstructz.com";
const OUT_DIR = path.join(process.cwd(), "static");

const loadData = async () => {
  const tmp = path.join(os.tmpdir(), `kz-seo-data-${Date.now()}.mjs`);
  await esbuild.build({
    stdin: {
      contents: `
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

const fileDate = (relativePath) => {
  const full = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(full)) return new Date().toISOString().slice(0, 10);
  return fs.statSync(full).mtime.toISOString().slice(0, 10);
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const normalizePath = (urlPath) => {
  if (!urlPath.startsWith("/")) throw new Error(`Route must start with /: ${urlPath}`);
  return urlPath === "/" ? "/" : urlPath.replace(/\/+$/, "");
};

const addRoute = (routes, urlPath, lastmod, priority = "0.7", changefreq = "monthly") => {
  const locPath = normalizePath(urlPath);
  routes.set(locPath, {
    loc: `${SITE_URL}${locPath === "/" ? "/" : locPath}`,
    lastmod,
    priority,
    changefreq,
  });
};

const isLaunchReadyBlog = (post) => {
  const hay = `${post.slug || ""} ${post.title || ""} ${post.excerpt || ""}`.toLowerCase();
  if (!post.slug || !post.title) return false;
  if (/\b(test|testing|testiong|sample|draft|lorem)\b/.test(hay)) return false;
  return true;
};

const localBlogs = () => {
  const file = path.join(process.cwd(), "static/data/blogs.json");
  if (!fs.existsSync(file)) return [];
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(data.posts) ? data.posts : [];
};

export const buildRoutes = async () => {
  const { products, productCategories, typhonProducts, blogPosts } = await loadData();
  const routes = new Map();

  const appDate = fileDate("src/App.tsx");
  const productDate = fileDate("src/data/products.ts");
  const categoryDate = fileDate("src/data/productCategories.ts");
  const typhonDate = fileDate("src/data/typhonProducts.ts");
  const blogDate = fileDate("static/data/blogs.json");

  [
    ["/", "1.0", "weekly"],
    ["/equipment", "0.9", "weekly"],
    ["/categories", "0.9", "weekly"],
    ["/product", "0.7", "weekly"],
    ["/equipment/konstructz-machine", "0.8", "monthly"],
    ["/attachments", "0.8", "monthly"],
    ["/attachments/mini-excavator", "0.7", "monthly"],
    ["/attachments/mini-skid-steer", "0.7", "monthly"],
    ["/support", "0.8", "monthly"],
    ["/support/order-purchase-support", "0.7", "monthly"],
    ["/support/shipping-delivery", "0.7", "monthly"],
    ["/support/warranty-returns", "0.7", "monthly"],
    ["/support/machine-guidance", "0.7", "monthly"],
    ["/support/attachments-support", "0.7", "monthly"],
    ["/support/contact-support", "0.7", "monthly"],
    ["/blog", "0.7", "weekly"],
    ["/quality-equipment", "0.6", "monthly"],
    ["/trusted-support", "0.6", "monthly"],
    ["/job-site-ready", "0.6", "monthly"],
    ["/long-term-value", "0.6", "monthly"],
    ["/about", "0.6", "monthly"],
    ["/contact", "0.7", "monthly"],
    ["/privacy", "0.3", "yearly"],
    ["/policy", "0.3", "yearly"],
    ["/typhon-machinery", "0.8", "weekly"],
  ].forEach(([urlPath, priority, changefreq]) => addRoute(routes, urlPath, appDate, priority, changefreq));

  productCategories.forEach((category) => {
    addRoute(routes, `/product/${category.slug}`, categoryDate, "0.85", "weekly");
  });

  products.forEach((product) => {
    addRoute(routes, `/equipment/${product.id}`, productDate, "0.85", "weekly");
  });

  // Skip re-imported duplicates (same name + SKU): those pages canonicalize
  // to the first copy, and sitemaps should only list canonical URLs.
  const seenTyphon = new Set();
  typhonProducts.forEach((product) => {
    const twinKey = `${product.name}|${product.sku}`;
    if (seenTyphon.has(twinKey)) return;
    seenTyphon.add(twinKey);
    addRoute(routes, `/typhon-machinery/${product.id}`, typhonDate, "0.75", "weekly");
  });

  [...blogPosts, ...localBlogs()].filter(isLaunchReadyBlog).forEach((post) => {
    const date = post.updatedAt || post.publishedAt || post.date || blogDate;
    const lastmod = Number.isNaN(Date.parse(date)) ? blogDate : new Date(date).toISOString().slice(0, 10);
    addRoute(routes, `/blog/${post.slug}`, lastmod, "0.65", "monthly");
  });

  return [...routes.values()].sort((a, b) => a.loc.localeCompare(b.loc));
};

const writeSitemap = (routes) => {
  const body = routes
    .map(
      (route) => `  <url>
    <loc>${escapeXml(route.loc)}</loc>
    <lastmod>${escapeXml(route.lastmod)}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
};

const writeRobots = () => `User-agent: *
Allow: /
Disallow: /sour
Disallow: /sour/
Disallow: /api/
Disallow: /*?preview=
# Internal SEO snapshots — served via rewrite at the clean URLs; direct
# fetches would only create duplicate copies.
Disallow: /prerendered/
Disallow: /spa-shell.html

Sitemap: ${SITE_URL}/sitemap.xml
`;

const main = async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const routes = await buildRoutes();
  fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), writeSitemap(routes));
  fs.writeFileSync(path.join(OUT_DIR, "robots.txt"), writeRobots());
  console.log(`Generated ${routes.length} sitemap URLs`);
  console.log("Wrote static/sitemap.xml");
  console.log("Wrote static/robots.txt");
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
