import { useEffect } from "react";

/**
 * Marks the current route as a "not found" page for search engines.
 *
 * The SPA host rewrites every unknown URL to index.html with HTTP 200, so
 * without this crawlers would index missing pages as duplicates of the
 * homepage (soft-404s). Setting `noindex` + a distinct title tells Google,
 * Bing, and AI crawlers to drop the URL instead.
 *
 * `active` exists because product/blog data can arrive asynchronously from
 * Supabase — a page must only be flagged once loading has finished and the
 * entity is definitively absent. SeoManager re-applies indexable meta on the
 * next route change, so no cleanup is needed.
 */
export const useNoindexNotFound = (
  active: boolean,
  title = "Page Not Found | Konstructz",
) => {
  useEffect(() => {
    if (!active) return;
    document.title = title;
    let tag = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "robots");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", "noindex, follow");
  }, [active, title]);
};

export default useNoindexNotFound;
