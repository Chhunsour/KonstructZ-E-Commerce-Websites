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
  "local";
const useLocalBlogs = BLOG_SOURCE === "local";
// Blogs are served from public Supabase Storage (written by the blog-sync Edge
// Function), not the git-deployed /data/blogs.json — deploy-proof, same as the
// product catalog.
const BLOG_STORAGE_URL =
  "https://kaaekveaaoriacwzzrnf.supabase.co/storage/v1/object/public/site-catalog/konstructz.com/blogs.json";
const LOCAL_BLOG_URL =
  (import.meta.env.VITE_BLOG_LOCAL_URL as string | undefined) ?? BLOG_STORAGE_URL;

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
  author: p.author || "Denvor",
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
    author: row.author ?? "Denvor",
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

export interface Comment {
  id: string | number;
  avatar: string;
  name: string;
  message: string;
  date: string;
  replies?: Comment[];
}

export interface DBComment {
  id: string;
  created_at: string;
  post_slug: string;
  name: string;
  email: string | null;
  message: string;
  avatar: string | null;
  parent_id: string | null;
}

const dbCommentToComment = (
  c: DBComment,
  allComments: DBComment[]
): Comment => {
  const replies = allComments
    .filter((reply) => reply.parent_id === c.id)
    .map((reply) => dbCommentToComment(reply, allComments));

  return {
    id: c.id,
    avatar: c.avatar || "",
    name: c.name,
    message: c.message,
    date: new Date(c.created_at).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    replies,
  };
};

/** Get all comments (and nested replies) for a post by slug. */
export const getCommentsForPost = async (
  slug: string
): Promise<Comment[]> => {
  if (!supabaseConfigured || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("post_slug", slug)
      .order("created_at", { ascending: true });

    if (error) throw error;
    if (!data) return [];

    const dbComments = data as DBComment[];
    return dbComments
      .filter((c) => !c.parent_id)
      .map((c) => dbCommentToComment(c, dbComments));
  } catch (e) {
    console.error("Failed to fetch comments from Supabase", e);
    return [];
  }
};

/** Add a new comment for a post. Returns the saved Comment representation. */
export const addComment = async (
  slug: string,
  name: string,
  email: string,
  message: string,
  avatar = "",
  parentId: string | null = null
): Promise<Comment | null> => {
  if (!supabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("blog_comments")
      .insert({
        post_slug: slug,
        name,
        email: email || null,
        message,
        avatar: avatar || null,
        parent_id: parentId,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) return null;

    const saved = data as DBComment;
    return {
      id: saved.id,
      avatar: saved.avatar || "",
      name: saved.name,
      message: saved.message,
      date: new Date(saved.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      replies: [],
    };
  } catch (e) {
    console.error("Failed to add comment to Supabase", e);
    return null;
  }
};
