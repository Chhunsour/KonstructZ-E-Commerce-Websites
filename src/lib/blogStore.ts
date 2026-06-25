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
  BlogPost,
  BlogPostSummary,
  blogImagePublicUrl,
  supabase,
  supabaseConfigured,
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
});

const dbToSummary = (
  row: BlogPostSummary & { category?: { name: string } | null }
): PublicBlogSummary => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt ?? "",
  image: blogImagePublicUrl(row.featured_image) ?? "",
  author: row.author ?? "Konstructz Editorial",
  category: row.category?.name ?? "",
  date: fmtDate(row.published_at ?? row.created_at),
  publishedAt: row.published_at ?? row.created_at,
});

const dbToDetail = (
  row: BlogPost & { category?: { name: string } | null }
): PublicBlogDetail => ({
  ...dbToSummary(row),
  content: row.content,
  seoTitle: row.seo_title,
  seoDescription: row.seo_description,
  keywords: row.keywords,
});

/** Public list — published posts only, no full content. */
export const listPublicPosts = async (): Promise<PublicBlogSummary[]> => {
  if (!supabaseConfigured || !supabase) {
    return staticPosts.map(staticToSummary);
  }
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id,slug,title,excerpt,featured_image,author,category_id,status,seo_title,seo_description,keywords,created_at,updated_at,published_at,category:blog_categories(name)"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data) {
    // Silent fallback so a backend hiccup never breaks the public site.
    return staticPosts.map(staticToSummary);
  }
  return (data as unknown as Array<BlogPostSummary & { category: { name: string } | null }>).map(dbToSummary);
};

/** Single post by slug. */
export const getPublicPostBySlug = async (
  slug: string | undefined
): Promise<PublicBlogDetail | null> => {
  if (!slug) return null;

  if (!supabaseConfigured || !supabase) {
    const p = staticPosts.find((x) => x.slug === slug);
    return p ? staticToDetail(p) : null;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*,category:blog_categories(name)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    const p = staticPosts.find((x) => x.slug === slug);
    return p ? staticToDetail(p) : null;
  }
  return dbToDetail(data as unknown as BlogPost & { category: { name: string } | null });
};
