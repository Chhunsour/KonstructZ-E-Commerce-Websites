/**
 * Supabase client for the blog admin dashboard.
 *
 * Requires two env vars (set in `.env.local` for dev, and in your Hostinger
 * build env for production):
 *
 *   VITE_SUPABASE_URL       — e.g. https://abcdefgh.supabase.co
 *   VITE_SUPABASE_ANON_KEY  — public anon key (safe to ship in the client;
 *                              row-level security guards every write)
 *
 * If either is missing, `supabase` is null and the public blog falls back to
 * the static `src/data/blogPosts.ts` so the site still renders for visitors
 * and during early dev. Admin routes will refuse to load without Supabase.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anon);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url!, anon!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: "konstructz-admin-auth",
      },
    })
  : null;

/* ── Domain types — mirror the SQL schema ─────────────────────────────── */

export type PostStatus = "draft" | "published";

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

/** Lightweight row for list views (no `content` to keep payloads small). */
export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  author: string | null;
  category_id: string | null;
  category?: BlogCategory | null;
  status: PostStatus;
  seo_title: string | null;
  seo_description: string | null;
  keywords: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

/** Full row including body content — used in the editor and on detail pages. */
export interface BlogPost extends BlogPostSummary {
  content: string;
}

/* ── Storage helpers ─────────────────────────────────────────────────── */

export const BLOG_IMAGE_BUCKET = "blog-images";

/** Returns the public CDN URL for a path inside the blog-images bucket. */
export const blogImagePublicUrl = (path: string | null | undefined): string | null => {
  if (!path || !supabase) return null;
  // already an absolute URL — leave as is
  if (/^https?:\/\//.test(path)) return path;
  return supabase.storage.from(BLOG_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
};
