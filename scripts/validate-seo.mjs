import fs from "node:fs";
import path from "node:path";
import { buildRoutes } from "./generate-seo-files.mjs";

const SITE_URL = "https://konstructz.com";
const sitemapPath = path.join(process.cwd(), "static/sitemap.xml");
const robotsPath = path.join(process.cwd(), "static/robots.txt");
const indexPath = path.join(process.cwd(), "index.html");

const fail = (message) => {
  throw new Error(message);
};

const read = (file) => {
  if (!fs.existsSync(file)) fail(`Missing required file: ${path.relative(process.cwd(), file)}`);
  return fs.readFileSync(file, "utf8");
};

const extractLocs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

const assertNoBadUrl = (url) => {
  if (!url.startsWith(SITE_URL)) fail(`Non-production URL in sitemap: ${url}`);
  if (/localhost|127\.0\.0\.1|\/sour(?:\/|$)|\/api(?:\/|$)|testiong|\/media(?:\/|$)/i.test(url)) {
    fail(`Private, duplicate, or test URL in sitemap: ${url}`);
  }
};

const validateSitemap = async () => {
  const xml = read(sitemapPath);
  if (!xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    fail("sitemap.xml is missing the sitemap urlset namespace");
  }

  const actual = extractLocs(xml);
  const expected = (await buildRoutes()).map((route) => route.loc);

  if (actual.length !== new Set(actual).size) fail("sitemap.xml contains duplicate URLs");
  actual.forEach(assertNoBadUrl);

  const missing = expected.filter((url) => !actual.includes(url));
  const extra = actual.filter((url) => !expected.includes(url));
  if (missing.length) fail(`sitemap.xml is missing expected URLs:\n${missing.join("\n")}`);
  if (extra.length) fail(`sitemap.xml has unexpected URLs:\n${extra.join("\n")}`);

  if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(xml)) {
    fail("sitemap.xml is missing valid lastmod dates");
  }

  console.log(`Sitemap OK: ${actual.length} URLs`);
};

const validateRobots = () => {
  const robots = read(robotsPath);
  if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
    fail("robots.txt is missing the production sitemap line");
  }
  if (!/^Allow: \/$/m.test(robots)) fail("robots.txt must allow the public site root");
  if (!/^Disallow: \/sour$/m.test(robots) || !/^Disallow: \/sour\//m.test(robots)) {
    fail("robots.txt must block the hidden admin area");
  }
  if (/Disallow:\s*\/(?:assets|img|icons|fonts|equipment|product|attachments|support|blog|typhon-machinery)\b/m.test(robots)) {
    fail("robots.txt blocks a public asset or content route");
  }
  console.log("Robots OK");
};

const validateIndex = () => {
  const html = read(indexPath);
  if (!html.includes('<link rel="canonical" href="https://konstructz.com/"')) {
    fail("index.html is missing the production canonical");
  }
  if (!html.includes('property="og:site_name" content="Konstructz"')) {
    fail("index.html is missing og:site_name");
  }
  if (!html.includes('name="twitter:card" content="summary_large_image"')) {
    fail("index.html is missing Twitter card metadata");
  }

  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!scripts.length) fail("index.html is missing JSON-LD");
  scripts.forEach((match) => JSON.parse(match[1]));
  console.log("Index metadata OK");
};

const main = async () => {
  await validateSitemap();
  validateRobots();
  validateIndex();
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
