/**
 * Derived publish-state for the blog studio list.
 *
 * This repo authors posts into Supabase and the public site renders them; there
 * is no external push pipeline here (that lives in the KiuQ master controller).
 * So the "sync" badges are computed entirely from real `blog_posts` fields —
 * nothing is invented or persisted:
 *
 *   draft     → "Draft"   (not ready) / "Ready" (passes the publish checks)
 *   scheduled → "Scheduled"
 *   published → "Published" / "Published · edited" (edited since it went live)
 *
 * A transient "Failed" state is layered on top by the studio when a save errors;
 * it is not derived here.
 */
import { BlogPostSummary } from "./supabase";

export type PublishState =
  | "draft"
  | "ready"
  | "scheduled"
  | "published"
  | "published-edited";

/** Filter buckets shown above the list. */
export type StateFilter = "all" | "draft" | "ready" | "scheduled" | "published";

/** Edits within this window of publish time are treated as the same save. */
const EDIT_BUFFER_MS = 60_000;

export const publishStateOf = (p: BlogPostSummary): PublishState => {
  if (p.status === "scheduled") return "scheduled";
  if (p.status === "published") {
    const pub = p.published_at ? new Date(p.published_at).getTime() : 0;
    const upd = p.updated_at ? new Date(p.updated_at).getTime() : 0;
    return pub && upd - pub > EDIT_BUFFER_MS ? "published-edited" : "published";
  }
  // draft: "Ready" once it would pass the editor's publish validation.
  const ready = Boolean(p.excerpt?.trim() && p.featured_image?.trim());
  return ready ? "ready" : "draft";
};

/** Does a post belong to the given filter bucket? */
export const matchesStateFilter = (
  p: BlogPostSummary,
  filter: StateFilter
): boolean => {
  if (filter === "all") return true;
  const state = publishStateOf(p);
  if (filter === "published")
    return state === "published" || state === "published-edited";
  return state === filter;
};

export const STATE_META: Record<
  PublishState | "failed",
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-theme-bg text-theme-muted border-theme-border/40",
  },
  ready: {
    label: "Ready",
    className: "bg-amber-500/10 text-amber-300 border-amber-500/40",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-500/10 text-blue-300 border-blue-500/40",
  },
  published: {
    label: "Published",
    className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  },
  "published-edited": {
    label: "Published · edited",
    className: "bg-emerald-500/10 text-emerald-200 border-amber-500/50",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-300 border-red-500/50",
  },
};
