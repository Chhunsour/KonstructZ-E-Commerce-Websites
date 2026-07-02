import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_IMAGE,
  getRouteConfig,
  baseSchema,
  breadcrumbSchema,
} from "../lib/seoMeta";

/**
 * Applies per-route SEO to document.head at runtime.
 *
 * All titles/descriptions/canonicals/schema live in src/lib/seoMeta.ts, which
 * is shared with scripts/prerender-routes.mjs — the build bakes the same
 * values into static per-route HTML for crawlers that don't execute JS.
 */

const upsertMeta = (selector: string, create: () => HTMLMetaElement, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const ensureCanonical = (href: string) => {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

export const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname === "" ? "/" : location.pathname;
    const config = getRouteConfig(pathname);
    const canonicalPath = config.canonicalPath ?? pathname;
    const canonical = `${SITE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;
    const image = config.image ?? DEFAULT_IMAGE;

    document.title = config.title;

    // Admin routes must never be indexed by search engines or AI crawlers.
    const isAdminRoute = pathname === "/sour" || pathname.startsWith("/sour/");
    upsertMeta(
      'meta[name="robots"]',
      () => {
        const tag = document.createElement("meta");
        tag.setAttribute("name", "robots");
        return tag;
      },
      isAdminRoute ? "noindex, nofollow, noarchive, nosnippet" : "index, follow"
    );

    upsertMeta('meta[name="description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      return tag;
    }, config.description);
    upsertMeta('meta[property="og:title"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:title");
      return tag;
    }, config.title);
    upsertMeta('meta[property="og:description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:description");
      return tag;
    }, config.description);
    upsertMeta('meta[property="og:type"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:type");
      return tag;
    }, config.type ?? "website");
    upsertMeta('meta[property="og:site_name"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:site_name");
      return tag;
    }, SITE_NAME);
    upsertMeta('meta[property="og:url"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:url");
      return tag;
    }, canonical);
    upsertMeta('meta[name="twitter:card"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:card");
      return tag;
    }, "summary_large_image");
    upsertMeta('meta[property="og:image"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:image");
      return tag;
    }, image);
    upsertMeta('meta[name="twitter:title"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:title");
      return tag;
    }, config.title);
    upsertMeta('meta[name="twitter:description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:description");
      return tag;
    }, config.description);
    upsertMeta('meta[name="twitter:image"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:image");
      return tag;
    }, image);
    ensureCanonical(canonical);

    document.head.querySelectorAll('script[data-konstructz-schema="true"]').forEach((node) => node.remove());
    const graph = [...baseSchema(), breadcrumbSchema(canonicalPath), ...(config.schema ?? [])];
    const schemaTag = document.createElement("script");
    schemaTag.type = "application/ld+json";
    schemaTag.dataset.konstructzSchema = "true";
    schemaTag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
    document.head.appendChild(schemaTag);
  }, [location.pathname]);

  return null;
};

export default SeoManager;
