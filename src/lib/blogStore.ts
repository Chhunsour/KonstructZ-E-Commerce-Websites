/**
 * Public blog data adapter.
 *
 * Reads from Supabase when configured (returning only `published` posts —
 * row-level security guarantees this on the server too). Falls back to the
 * static `src/data/blogPosts.ts` so the site keeps rendering before Supabase
 * is wired up, during local dev, and if the API is briefly unreachable.
 *
 * The list endpoint deliberately excludes `content` to keep payloads small.
 */
import { BlogPost as StaticPost, blogPosts as staticPosts } from "../data/blogPosts";
import {
  BLOG_POST_BASE_SELECT,
  BLOG_POST_ENHANCED_SELECT,
  BlogPost,
  BlogPostSummary,
  blogImagePublicUrl,
  isMissingBlogEnhancementColumn,
  supabase,
  supabaseConfigured,
  withBlogPostDefaults,
} from "./supabase";

export interface PublicBlogSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  date: string;
  publishedAt: string;
}

export interface PublicBlogDetail extends PublicBlogSummary {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  keywords: string | null;
  tags: string[];
}

const fmtDate = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const staticToSummary = (p: StaticPost): PublicBlogSummary => ({
  id: String(p.id),
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  image: p.image,
  author: p.author,
  category: p.category,
  date: p.date,
  publishedAt: p.date,
});

const staticToDetail = (p: StaticPost): PublicBlogDetail => ({
  ...staticToSummary(p),
  content: p.content,
  seoTitle: null,
  seoDescription: p.excerpt,
  keywords: null,
  tags: [],
});

/* ── local JSON source (blogs synced to this site by the KiuQ receiver) ──── */
const BLOG_SOURCE =
  (import.meta.env.VITE_BLOG_SOURCE as string | undefined) ??
  (import.meta.env.VITE_PRODUCTS_SOURCE as string | undefined) ??
  "local";
const useLocalBlogs = BLOG_SOURCE === "local";
const LOCAL_BLOG_URL =
  (import.meta.env.VITE_BLOG_LOCAL_URL as string | undefined) ?? "/data/blogs.json";

interface LocalBlog {
  id: string | number;
  slug: string;
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: string;
  featuredImage?: string | null;
  publishedAt?: string | null;
  date?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  keywords?: string | null;
  tags?: string[];
}

let localBlogCache: LocalBlog[] | null = null;
const loadLocalBlogs = async (): Promise<LocalBlog[]> => {
  if (localBlogCache) return localBlogCache;
  try {
    const res = await fetch(LOCAL_BLOG_URL, { cache: "no-cache" });
    if (!res.ok) {
      localBlogCache = [];
      return localBlogCache;
    }
    const data = await res.json();
    localBlogCache = Array.isArray(data?.posts) ? (data.posts as LocalBlog[]) : [];
  } catch {
    localBlogCache = [];
  }
  return localBlogCache;
};

const localToSummary = (p: LocalBlog): PublicBlogSummary => ({
  id: String(p.id),
  slug: p.slug,
  title: p.title ?? "",
  excerpt: p.excerpt ?? "",
  image: p.featuredImage ?? "",
  author: p.author || "Konstructz Editorial",
  category: p.category ?? "",
  date: p.date || fmtDate(p.publishedAt ?? null),
  publishedAt: p.publishedAt ?? "",
});
const localToDetail = (p: LocalBlog): PublicBlogDetail => ({
  ...localToSummary(p),
  content: p.content ?? "",
  seoTitle: p.seoTitle ?? null,
  seoDescription: p.seoDescription ?? p.excerpt ?? null,
  keywords: p.keywords ?? null,
  tags: Array.isArray(p.tags) ? p.tags : [],
});

const dbToSummary = (
  row: BlogPostSummary & { category?: { name: string } | null }
): PublicBlogSummary => {
  // A just-due scheduled post may have no published_at yet — fall back to its
  // scheduled time, then created time, so dates and ordering stay sensible.
  const effective = row.published_at ?? row.scheduled_at ?? row.created_at;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    image: blogImagePublicUrl(row.featured_image) ?? "",
    author: row.author ?? "Konstructz Editorial",
    category: row.category?.name ?? "",
    date: fmtDate(effective),
    publishedAt: effective,
  };
};

const dbToDetail = (
  row: BlogPost & { category?: { name: string } | null }
): PublicBlogDetail => {
  const normalized = withBlogPostDefaults(row);
  return {
    ...dbToSummary(normalized),
    content: row.content,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    keywords: row.keywords,
    tags: normalized.tags,
  };
};

/** PostgREST `or` filter: published, or a scheduled post whose time has come. */
const enhancedVisibilityFilter = () =>
  `status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${new Date().toISOString()})`;

/** Public list — published posts only, no full content. */
export const listPublicPosts = async (): Promise<PublicBlogSummary[]> => {
  if (useLocalBlogs) {
    const all = await loadLocalBlogs();
    if (all.length) {
      return all
        .map(localToSummary)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
    return staticPosts.map(staticToSummary);
  }
  if (!supabaseConfigured || !supabase) {
    return staticPosts.map(staticToSummary);
  }
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`${BLOG_POST_ENHANCED_SELECT},category:blog_categories(name)`)
    .or(enhancedVisibilityFilter());

  let rows = data as
    | Array<BlogPostSummary & { category: { name: string } | null }>
    | null;
  let listError = error;
  if (listError && isMissingBlogEnhancementColumn(listError.message)) {
    const fallback = await supabase
      .from("blog_posts")
      .select(`${BLOG_POST_BASE_SELECT},category:blog_categories(name)`)
      .eq("status", "published");
    rows = fallback.data as
      | Array<BlogPostSummary & { category: { name: string } | null }>
      | null;
    listError = fallback.error;
  }

  if (listError || !rows) {
    // Silent fallback so a backend hiccup never breaks the public site.
    return staticPosts.map(staticToSummary);
  }
  return rows
    .map((row) => dbToSummary(withBlogPostDefaults(row)))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

/** Single post by slug. */
export const getPublicPostBySlug = async (
  slug: string | undefined
): Promise<PublicBlogDetail | null> => {
  if (!slug) return null;

  if (useLocalBlogs) {
    const all = await loadLocalBlogs();
    const found = all.find((x) => x.slug === slug);
    if (found) return localToDetail(found);
    const s = staticPosts.find((x) => x.slug === slug);
    return s ? staticToDetail(s) : null;
  }

  if (!supabaseConfigured || !supabase) {
    const p = staticPosts.find((x) => x.slug === slug);
    return p ? staticToDetail(p) : null;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*,category:blog_categories(name)")
    .eq("slug", slug)
    .or(enhancedVisibilityFilter())
    .maybeSingle();

  let row = data as (BlogPost & { category: { name: string } | null }) | null;
  let detailError = error;
  if (detailError && isMissingBlogEnhancementColumn(detailError.message)) {
    const fallback = await supabase
      .from("blog_posts")
      .select("*,category:blog_categories(name)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    row = fallback.data as (BlogPost & { category: { name: string } | null }) | null;
    detailError = fallback.error;
  }

  if (detailError || !row) {
    const p = staticPosts.find((x) => x.slug === slug);
    return p ? staticToDetail(p) : null;
  }
  return dbToDetail(row);
};
