import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import PostPreviewOverlay, {
  PostPreviewData,
} from "../../components/admin/PostPreviewOverlay";

const STATUS_STYLE: Record<PostStatus, string> = {
  published: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  scheduled: "bg-blue-500/10 text-blue-300 border-blue-500/40",
  draft: "bg-yellow-500/10 text-yellow-200 border-yellow-500/40",
};

const StatusPill: React.FC<{ status: PostStatus }> = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-0.5 rounded-full font-googleSans text-[10px] uppercase tracking-wider border ${STATUS_STYLE[status]}`}
  >
    {status}
  </span>
);

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/** The date that matters for sorting/display, by status. */
const effectiveDate = (p: BlogPostSummary): string =>
  p.published_at ?? p.scheduled_at ?? p.created_at;

export const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [hasBlogEnhancements, setHasBlogEnhancements] = useState(true);
  const [schemaNotice, setSchemaNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PostPreviewData | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

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
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
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
      const da = new Date(effectiveDate(a)).getTime();
      const db = new Date(effectiveDate(b)).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return filtered;
  }, [posts, statusFilter, catFilter, query, sort]);

  /* ── actions ───────────────────────────────────────────────────────── */
  const setStatus = async (post: BlogPostSummary, next: PostStatus) => {
    if (!supabase) return;
    setBusyId(post.id);
    const patch: Partial<BlogPostSummary> = { status: next };
    if (next === "published" && !post.published_at) {
      patch.published_at = new Date().toISOString();
    }
    if (next === "draft" && hasBlogEnhancements) {
      patch.scheduled_at = null;
    }
    const { error: err } = await supabase
      .from("blog_posts")
      .update(patch)
      .eq("id", post.id);
    setBusyId(null);
    if (err) {
      flash(`Error: ${err.message}`);
      return;
    }
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, ...patch } : p))
    );
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
    const { error: err } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", post.id);
    setBusyId(null);
    if (err) {
      flash(`Error: ${err.message}`);
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    flash("Post deleted.");
  };

  const openPreview = async (post: BlogPostSummary) => {
    if (!supabase) return;
    setPreviewLoading(true);
    setPreview({
      title: post.title,
      excerpt: post.excerpt ?? "",
      author: post.author ?? "Konstructz Editorial",
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
      scheduled: posts.filter((p) => p.status === "scheduled").length,
      draft: posts.filter((p) => p.status === "draft").length,
    }),
    [posts]
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-clofieBold text-3xl md:text-4xl text-theme-heading">
            Posts
          </h1>
          <p className="mt-2 font-glonimove text-sm text-theme-muted">
            {counts.total} total · {counts.published} published · {counts.scheduled}{" "}
            scheduled · {counts.draft} drafts
          </p>
        </div>
        <Link
          to="/sour/posts/new"
          className="inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white font-googleSans font-bold text-sm uppercase tracking-wider px-5 py-3 rounded transition-colors"
        >
          + New post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1 bg-theme-card border border-theme-border/20 rounded p-1">
          {(["all", "published", "scheduled", "draft"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 font-googleSans text-xs uppercase tracking-wider rounded transition-colors ${
                statusFilter === f
                  ? "bg-theme-accent text-theme-bg"
                  : "text-theme-muted hover:text-theme-text"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="bg-theme-card border border-theme-border/20 rounded px-3 py-2 font-googleSans text-xs uppercase tracking-wider text-theme-text focus:outline-none focus:border-theme-accent"
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
          className="bg-theme-card border border-theme-border/20 rounded px-3 py-2 font-googleSans text-xs uppercase tracking-wider text-theme-text focus:outline-none focus:border-theme-accent"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, slug, author or tag…"
          className="flex-1 min-w-[200px] bg-theme-card border border-theme-border/20 rounded px-4 py-2 font-googleSans text-sm text-theme-text focus:outline-none focus:border-theme-accent"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-200">
          {error}
        </div>
      )}

      {schemaNotice && !error && (
        <div className="mb-6 p-4 border border-yellow-500/40 bg-yellow-500/5 rounded font-glonimove text-sm text-yellow-100">
          {schemaNotice}
        </div>
      )}

      {/* Table */}
      <div className="bg-theme-card border border-theme-border/20 rounded overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-glonimove text-theme-muted">
            Loading posts…
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-clofieBold text-lg text-theme-heading mb-2">
              No posts yet
            </p>
            <p className="font-glonimove text-sm text-theme-muted mb-5">
              Create your first article to get the blog going.
            </p>
            <Link
              to="/sour/posts/new"
              className="inline-block bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white font-googleSans font-bold text-sm uppercase tracking-wider px-5 py-3 rounded transition-colors"
            >
              + New post
            </Link>
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="p-12 text-center font-glonimove text-theme-muted">
            No posts match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-theme-border/20 bg-theme-bg/40">
                  {["Title", "Category", "Status", "Author", "Date", ""].map(
                    (h, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 font-googleSans text-[10px] uppercase tracking-wider text-theme-muted whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border/15">
                {visiblePosts.map((post) => {
                  const cat = post.category_id ? catMap.get(post.category_id) : null;
                  const img = blogImagePublicUrl(post.featured_image);
                  const dateLabel =
                    post.status === "scheduled"
                      ? `Scheduled ${formatDate(post.scheduled_at)}`
                      : post.status === "published"
                      ? `Published ${formatDate(post.published_at)}`
                      : `Updated ${formatDate(post.updated_at)}`;
                  const isBusy = busyId === post.id;
                  return (
                    <tr
                      key={post.id}
                      className={`hover:bg-theme-bg/40 transition-colors ${
                        isBusy ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0 w-14 h-10 bg-theme-bg rounded overflow-hidden border border-theme-border/20">
                            {img ? (
                              <img
                                src={img}
                                alt=""
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full grid place-items-center text-[9px] text-theme-muted">
                                —
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/sour/posts/${post.id}`}
                              className="block font-clofieBold text-sm text-theme-heading hover:text-theme-accent truncate max-w-[260px]"
                            >
                              {post.title}
                            </Link>
                            <span className="font-mono text-[11px] text-theme-muted truncate block max-w-[260px]">
                              /blog/{post.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-googleSans text-xs text-theme-muted whitespace-nowrap">
                        {cat?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={post.status} />
                      </td>
                      <td className="px-4 py-3 font-glonimove text-sm text-theme-text whitespace-nowrap">
                        {post.author || "—"}
                      </td>
                      <td className="px-4 py-3 font-googleSans text-[11px] uppercase tracking-wider text-theme-muted whitespace-nowrap">
                        {dateLabel}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/sour/posts/${post.id}`}
                            className="font-googleSans text-xs uppercase tracking-wider text-theme-text hover:text-theme-accent border border-theme-border/30 hover:border-theme-accent px-3 py-1.5 rounded transition-colors"
                          >
                            Edit
                          </Link>
                          <div className="relative">
                            <button
                              type="button"
                              aria-label="More actions"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuId(menuId === post.id ? null : post.id);
                              }}
                              className="w-8 h-8 grid place-items-center rounded border border-theme-border/30 hover:border-theme-accent text-theme-text hover:text-theme-accent transition-colors"
                            >
                              ⋯
                            </button>
                            {menuId === post.id && (
                              <div
                                className="absolute right-0 top-full mt-1 z-20 w-44 bg-theme-card border border-theme-border/30 rounded shadow-xl py-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MenuItem onClick={() => { setMenuId(null); openPreview(post); }}>
                                  Preview
                                </MenuItem>
                                {post.status === "published" ? (
                                  <MenuItem onClick={() => { setMenuId(null); setStatus(post, "draft"); }}>
                                    Unpublish
                                  </MenuItem>
                                ) : (
                                  <MenuItem onClick={() => { setMenuId(null); setStatus(post, "published"); }}>
                                    Publish now
                                  </MenuItem>
                                )}
                                <MenuItem onClick={() => { setMenuId(null); duplicate(post); }}>
                                  Duplicate
                                </MenuItem>
                                {post.status === "published" && (
                                  <a
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMenuId(null)}
                                    className="block px-4 py-2 font-googleSans text-xs uppercase tracking-wider text-theme-text hover:bg-theme-bg hover:text-theme-accent transition-colors"
                                  >
                                    View live ↗
                                  </a>
                                )}
                                <div className="my-1 border-t border-theme-border/20" />
                                <MenuItem
                                  destructive
                                  onClick={() => { setMenuId(null); deletePost(post); }}
                                >
                                  Delete
                                </MenuItem>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-theme-card border border-theme-border/40 rounded px-5 py-3 shadow-xl font-glonimove text-sm text-theme-text">
          {toast}
        </div>
      )}

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

const MenuItem: React.FC<{
  onClick: () => void;
  destructive?: boolean;
  children: React.ReactNode;
}> = ({ onClick, destructive, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`block w-full text-left px-4 py-2 font-googleSans text-xs uppercase tracking-wider transition-colors ${
      destructive
        ? "text-red-300 hover:bg-red-500/10 hover:text-red-200"
        : "text-theme-text hover:bg-theme-bg hover:text-theme-accent"
    }`}
  >
    {children}
  </button>
);

export default AdminDashboard;
