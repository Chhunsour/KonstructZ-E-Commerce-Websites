import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  BLOG_ENHANCEMENT_MIGRATION,
  BLOG_POST_BASE_SELECT,
  BLOG_POST_ENHANCED_SELECT,
  BlogCategory,
  BlogPost,
  BlogPostSummary,
  PostStatus,
  blogImagePublicUrl,
  isMissingBlogEnhancementColumn,
  supabase,
  withBlogPostDefaults,
} from "../../lib/supabase";
import {
  PublishState,
  STATE_META,
  StateFilter,
  matchesStateFilter,
  publishStateOf,
} from "../../lib/blogPublishState";
import PostPreviewOverlay, {
  PostPreviewData,
} from "../../components/admin/PostPreviewOverlay";
import { Toast } from "../../components/admin/ui";
import PostEditorPanel from "./PostEditorPanel";

const formatRelative = (iso: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const STATE_FILTERS: StateFilter[] = ["all", "draft", "ready", "scheduled", "published"];

export const BlogStudio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isNewRoute = location.pathname.endsWith("/posts/new");
  const selectedId = isNewRoute ? "new" : id;
  const isEditing = Boolean(selectedId);

  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [hasBlogEnhancements, setHasBlogEnhancements] = useState(true);
  const [schemaNotice, setSchemaNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<PostPreviewData | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  const markFailed = (postId: string, failed: boolean) =>
    setFailedIds((prev) => {
      const next = new Set(prev);
      if (failed) next.add(postId);
      else next.delete(postId);
      return next;
    });

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    setSchemaNotice(null);

    const [postsRes, catsRes] = await Promise.all([
      supabase
        .from("blog_posts")
        .select(BLOG_POST_ENHANCED_SELECT)
        .order("updated_at", { ascending: false }),
      supabase.from("blog_categories").select("id,name,slug").order("name", { ascending: true }),
    ]);

    let postRows = postsRes.data as BlogPostSummary[] | null;
    let postError = postsRes.error;
    if (postError && isMissingBlogEnhancementColumn(postError.message)) {
      const fallback = await supabase
        .from("blog_posts")
        .select(BLOG_POST_BASE_SELECT)
        .order("updated_at", { ascending: false });
      postRows = fallback.data as BlogPostSummary[] | null;
      postError = fallback.error;
      setHasBlogEnhancements(false);
      setSchemaNotice(
        `The blog enhancement migration is not installed yet, so tags and scheduled publishing are disabled. Run ${BLOG_ENHANCEMENT_MIGRATION} to enable them.`
      );
    } else {
      setHasBlogEnhancements(true);
    }

    if (postError) setError(postError.message);
    setPosts((postRows ?? []).map(withBlogPostDefaults));
    setCategories((catsRes.data as BlogCategory[] | null) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Close the open row menu on any outside click.
  useEffect(() => {
    if (!menuId) return;
    const close = () => setMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuId]);

  const catMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const visiblePosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = posts.filter((p) => {
      if (!matchesStateFilter(p, stateFilter)) return false;
      if (catFilter !== "all" && p.category_id !== catFilter) return false;
      if (q) {
        const hay = `${p.title} ${p.excerpt ?? ""} ${p.slug} ${p.author ?? ""} ${(
          p.tags ?? []
        ).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    filtered.sort((a, b) => {
      const da = new Date(a.published_at ?? a.scheduled_at ?? a.created_at).getTime();
      const db = new Date(b.published_at ?? b.scheduled_at ?? b.created_at).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return filtered;
  }, [posts, stateFilter, catFilter, query, sort]);

  /* ── actions ───────────────────────────────────────────────────────── */
  const upsertPost = useCallback((summary: BlogPostSummary) => {
    markFailed(summary.id, false);
    setPosts((prev) => {
      const next = withBlogPostDefaults(summary);
      const idx = prev.findIndex((p) => p.id === summary.id);
      if (idx === -1) return [next, ...prev];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...next };
      return copy;
    });
  }, []);

  const setStatus = async (post: BlogPostSummary, next: PostStatus) => {
    if (!supabase) return;
    setBusyId(post.id);
    const nowIso = new Date().toISOString();
    const patch: Partial<BlogPostSummary> = { status: next, updated_at: nowIso };
    if (next === "published" && !post.published_at) patch.published_at = nowIso;
    if (next === "draft" && hasBlogEnhancements) patch.scheduled_at = null;

    const dbPatch: Record<string, unknown> = { status: next };
    if (patch.published_at) dbPatch.published_at = patch.published_at;
    if (next === "draft" && hasBlogEnhancements) dbPatch.scheduled_at = null;

    const { error: err } = await supabase
      .from("blog_posts")
      .update(dbPatch)
      .eq("id", post.id);
    setBusyId(null);
    if (err) {
      markFailed(post.id, true);
      flash(`Error: ${err.message}`);
      return;
    }
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, ...patch } : p)));
    flash(next === "published" ? "Post published." : "Post moved to draft.");
  };

  const duplicate = async (post: BlogPostSummary) => {
    if (!supabase) return;
    setBusyId(post.id);
    const { data: full, error: fetchErr } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", post.id)
      .single();
    if (fetchErr || !full) {
      setBusyId(null);
      flash(`Error: ${fetchErr?.message ?? "could not load post"}`);
      return;
    }
    const src = full as BlogPost;
    const payload: Record<string, unknown> = {
      title: `${src.title} (copy)`,
      slug: `${src.slug}-copy-${Date.now().toString(36).slice(-4)}`,
      excerpt: src.excerpt,
      content: src.content,
      featured_image: src.featured_image,
      author: src.author,
      category_id: src.category_id,
      status: "draft" as PostStatus,
      seo_title: src.seo_title,
      seo_description: src.seo_description,
      keywords: src.keywords,
      published_at: null,
    };
    if (hasBlogEnhancements) {
      payload.tags = src.tags ?? [];
      payload.scheduled_at = null;
    }
    const { data, error: err } = await supabase
      .from("blog_posts")
      .insert(payload)
      .select(hasBlogEnhancements ? BLOG_POST_ENHANCED_SELECT : BLOG_POST_BASE_SELECT)
      .single();
    setBusyId(null);
    if (err) {
      flash(`Error: ${err.message}`);
      return;
    }
    setPosts((prev) => [withBlogPostDefaults(data as BlogPostSummary), ...prev]);
    flash("Duplicated as a new draft.");
  };

  const deletePost = async (post: BlogPostSummary) => {
    if (!supabase) return;
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setBusyId(post.id);
    const { error: err } = await supabase.from("blog_posts").delete().eq("id", post.id);
    setBusyId(null);
    if (err) {
      flash(`Error: ${err.message}`);
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    flash("Post deleted.");
    if (selectedId === post.id) navigate("/sour/dashboard");
  };

  const openPreview = async (post: BlogPostSummary) => {
    if (!supabase) return;
    setPreviewLoading(true);
    setPreview({
      title: post.title,
      excerpt: post.excerpt ?? "",
      author: post.author ?? "Denvor",
      category: post.category_id ? catMap.get(post.category_id)?.name ?? "" : "",
      image: blogImagePublicUrl(post.featured_image),
      content: "",
      tags: post.tags ?? [],
    });
    const { data } = await supabase
      .from("blog_posts")
      .select("content")
      .eq("id", post.id)
      .single();
    setPreview((prev) =>
      prev ? { ...prev, content: (data as { content: string } | null)?.content ?? "" } : prev
    );
    setPreviewLoading(false);
  };

  const counts = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      draft: posts.filter((p) => p.status === "draft").length,
    }),
    [posts]
  );

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6 lg:gap-8">
      {/* ── Left: post list ─────────────────────────────────────────── */}
      <aside className={isEditing ? "hidden lg:block" : "block"}>
        <div className="lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="font-clofieBold text-2xl text-theme-heading">Posts</h1>
              <p className="mt-0.5 font-glonimove text-xs text-theme-muted">
                {counts.total} total · {counts.published} live · {counts.draft} drafts
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/sour/posts/new")}
              className="inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white font-googleSans font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors"
            >
              + New
            </button>
          </div>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full bg-theme-card border border-theme-border/20 rounded-lg px-4 py-2.5 font-glonimove text-sm text-theme-text focus:outline-none focus:border-theme-accent mb-3"
          />

          <div className="flex flex-wrap gap-1 mb-3">
            {STATE_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStateFilter(f)}
                className={`px-2.5 py-1 font-googleSans text-[11px] uppercase tracking-wider rounded-lg border transition-colors ${
                  stateFilter === f
                    ? "bg-theme-accent text-theme-bg border-theme-accent"
                    : "text-theme-muted border-theme-border/20 hover:text-theme-text hover:border-theme-border/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="flex-1 min-w-0 bg-theme-card border border-theme-border/20 rounded-lg px-2.5 py-2 font-googleSans text-[11px] uppercase tracking-wider text-theme-text focus:outline-none focus:border-theme-accent"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
              className="bg-theme-card border border-theme-border/20 rounded-lg px-2.5 py-2 font-googleSans text-[11px] uppercase tracking-wider text-theme-text focus:outline-none focus:border-theme-accent"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {schemaNotice && (
            <div className="mb-3 p-3 border border-yellow-500/40 bg-yellow-500/5 rounded-lg font-glonimove text-xs text-yellow-100">
              {schemaNotice}
            </div>
          )}
          {error && (
            <div className="mb-3 p-3 border border-red-500/40 bg-red-500/5 rounded-lg font-glonimove text-xs text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-2 lg:max-h-[calc(100vh-19rem)] lg:overflow-y-auto lg:pr-1">
            {loading ? (
              <div className="p-8 text-center font-glonimove text-sm text-theme-muted">
                Loading posts…
              </div>
            ) : visiblePosts.length === 0 ? (
              <div className="p-8 text-center font-glonimove text-sm text-theme-muted border border-dashed border-theme-border/30 rounded-lg">
                {posts.length === 0 ? "No posts yet. Create your first article." : "No posts match your filters."}
              </div>
            ) : (
              visiblePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  active={selectedId === post.id}
                  busy={busyId === post.id}
                  failed={failedIds.has(post.id)}
                  categoryName={post.category_id ? catMap.get(post.category_id)?.name ?? null : null}
                  menuOpen={menuId === post.id}
                  onSelect={() => navigate(`/sour/posts/${post.id}`)}
                  onToggleMenu={(e) => {
                    e.stopPropagation();
                    setMenuId(menuId === post.id ? null : post.id);
                  }}
                  onPreview={() => { setMenuId(null); openPreview(post); }}
                  onPublishToggle={() => {
                    setMenuId(null);
                    setStatus(post, post.status === "published" ? "draft" : "published");
                  }}
                  onDuplicate={() => { setMenuId(null); duplicate(post); }}
                  onDelete={() => { setMenuId(null); deletePost(post); }}
                />
              ))
            )}
          </div>
        </div>
      </aside>

      {/* ── Right: editor ───────────────────────────────────────────── */}
      <section className={isEditing ? "block" : "hidden lg:block"}>
        {isEditing ? (
          <PostEditorPanel
            key={selectedId}
            id={selectedId}
            categories={categories}
            hasBlogEnhancements={hasBlogEnhancements}
            onSaved={upsertPost}
            onBack={() => navigate("/sour/dashboard")}
          />
        ) : (
          <div className="h-full min-h-[60vh] grid place-items-center rounded-lg border border-dashed border-theme-border/30 bg-theme-card/40 p-10 text-center">
            <div>
              <p className="font-clofieBold text-lg text-theme-heading mb-2">
                Select a post to edit
              </p>
              <p className="font-glonimove text-sm text-theme-muted mb-5">
                Pick a post from the list, or start a new article.
              </p>
              <button
                type="button"
                onClick={() => navigate("/sour/posts/new")}
                className="inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white font-googleSans font-bold text-sm uppercase tracking-wider px-5 py-3 rounded-lg transition-colors"
              >
                + New post
              </button>
            </div>
          </div>
        )}
      </section>

      <Toast message={toast} />

      {preview && (
        <PostPreviewOverlay
          {...preview}
          loading={previewLoading}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
};

/* ── Post card ─────────────────────────────────────────────────────────── */
const StateBadge: React.FC<{ state: PublishState | "failed" }> = ({ state }) => {
  const meta = STATE_META[state];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full font-googleSans text-[9px] uppercase tracking-wider border ${meta.className}`}
    >
      {meta.label}
    </span>
  );
};

interface PostCardProps {
  post: BlogPostSummary;
  active: boolean;
  busy: boolean;
  failed: boolean;
  categoryName: string | null;
  menuOpen: boolean;
  onSelect: () => void;
  onToggleMenu: (e: React.MouseEvent) => void;
  onPreview: () => void;
  onPublishToggle: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  active,
  busy,
  failed,
  categoryName,
  menuOpen,
  onSelect,
  onToggleMenu,
  onPreview,
  onPublishToggle,
  onDuplicate,
  onDelete,
}) => {
  const img = blogImagePublicUrl(post.featured_image);
  const state: PublishState | "failed" = failed ? "failed" : publishStateOf(post);
  const updated =
    post.status === "scheduled" && post.scheduled_at
      ? `Scheduled ${formatRelative(post.scheduled_at)}`
      : `Updated ${formatRelative(post.updated_at)}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative flex gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
        active
          ? "border-theme-accent/60 bg-theme-accent/10"
          : "border-theme-border/20 bg-theme-card hover:border-theme-border/40 hover:bg-theme-bg/40"
      } ${busy ? "opacity-50" : ""}`}
    >
      <div className="shrink-0 w-16 h-16 bg-theme-bg rounded-md overflow-hidden border border-theme-border/20">
        {img ? (
          <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-[10px] text-theme-muted">—</div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-clofieBold text-sm text-theme-heading truncate leading-snug">
            {post.title || "Untitled"}
          </h3>
          <div className="relative shrink-0">
            <button
              type="button"
              aria-label="More actions"
              onClick={onToggleMenu}
              className="w-6 h-6 grid place-items-center rounded text-theme-muted hover:text-theme-accent opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              ⋯
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 z-20 w-40 bg-theme-card border border-theme-border/30 rounded-lg shadow-xl py-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MenuItem onClick={onPreview}>Preview</MenuItem>
                <MenuItem onClick={onPublishToggle}>
                  {post.status === "published" ? "Unpublish" : "Publish now"}
                </MenuItem>
                <MenuItem onClick={onDuplicate}>Duplicate</MenuItem>
                {post.status === "published" && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="block px-3 py-2 font-googleSans text-[11px] uppercase tracking-wider text-theme-text hover:bg-theme-bg hover:text-theme-accent transition-colors"
                  >
                    View live ↗
                  </a>
                )}
                <div className="my-1 border-t border-theme-border/20" />
                <MenuItem destructive onClick={onDelete}>
                  Delete
                </MenuItem>
              </div>
            )}
          </div>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <StateBadge state={state} />
          {categoryName && (
            <span className="font-googleSans text-[10px] uppercase tracking-wider text-theme-muted truncate">
              {categoryName}
            </span>
          )}
        </div>
        <p className="mt-1 font-googleSans text-[10px] text-theme-muted truncate">{updated}</p>
      </div>
    </div>
  );
};

const MenuItem: React.FC<{
  onClick: () => void;
  destructive?: boolean;
  children: React.ReactNode;
}> = ({ onClick, destructive, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`block w-full text-left px-3 py-2 font-googleSans text-[11px] uppercase tracking-wider transition-colors ${
      destructive
        ? "text-red-300 hover:bg-red-500/10 hover:text-red-200"
        : "text-theme-text hover:bg-theme-bg hover:text-theme-accent"
    }`}
  >
    {children}
  </button>
);

export default BlogStudio;
