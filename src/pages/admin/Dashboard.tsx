import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BlogCategory,
  BlogPostSummary,
  PostStatus,
  blogImagePublicUrl,
  supabase,
} from "../../lib/supabase";

const StatusPill: React.FC<{ status: PostStatus }> = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-0.5 rounded-full font-googleSans text-[10px] uppercase tracking-wider border ${
      status === "published"
        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
        : "bg-yellow-500/10 text-yellow-200 border-yellow-500/40"
    }`}
  >
    {status}
  </span>
);

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | PostStatus>("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);

    const [postsRes, catsRes] = await Promise.all([
      supabase
        .from("blog_posts")
        .select(
          "id,slug,title,excerpt,featured_image,author,category_id,status,seo_title,seo_description,keywords,created_at,updated_at,published_at"
        )
        .order("updated_at", { ascending: false }),
      supabase
        .from("blog_categories")
        .select("id,name,slug")
        .order("name", { ascending: true }),
    ]);

    if (postsRes.error) setError(postsRes.error.message);
    setPosts((postsRes.data as BlogPostSummary[] | null) ?? []);
    setCategories((catsRes.data as BlogCategory[] | null) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const catMap = new Map(categories.map((c) => [c.id, c]));

  const visiblePosts = posts.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (
        !p.title.toLowerCase().includes(q) &&
        !(p.excerpt ?? "").toLowerCase().includes(q) &&
        !p.slug.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const togglePublish = async (post: BlogPostSummary) => {
    if (!supabase) return;
    const next: PostStatus = post.status === "published" ? "draft" : "published";
    const patch: Partial<BlogPostSummary> = { status: next };
    if (next === "published" && !post.published_at) {
      patch.published_at = new Date().toISOString();
    }
    const { error: err } = await supabase
      .from("blog_posts")
      .update(patch)
      .eq("id", post.id);
    if (err) {
      alert(err.message);
      return;
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, status: next, published_at: patch.published_at ?? p.published_at }
          : p
      )
    );
  };

  const deletePost = async (post: BlogPostSummary) => {
    if (!supabase) return;
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    const { error: err } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", post.id);
    if (err) {
      alert(err.message);
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-clofieBold text-3xl md:text-4xl text-theme-heading">
            Posts
          </h1>
          <p className="mt-2 font-glonimove text-sm text-theme-muted">
            {posts.length} total · {posts.filter((p) => p.status === "published").length}{" "}
            published · {posts.filter((p) => p.status === "draft").length} drafts
          </p>
        </div>
        <Link
          to="/sour/posts/new"
          className="inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white font-googleSans font-bold text-sm uppercase tracking-wider px-5 py-3 rounded transition-colors"
        >
          + New post
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1 bg-theme-card border border-theme-border/20 rounded p-1">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 font-googleSans text-xs uppercase tracking-wider rounded transition-colors ${
                filter === f
                  ? "bg-theme-accent text-theme-bg"
                  : "text-theme-muted hover:text-theme-text"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, slug or excerpt…"
          className="flex-1 min-w-[200px] bg-theme-card border border-theme-border/20 rounded px-4 py-2 font-googleSans text-sm text-theme-text focus:outline-none focus:border-theme-accent"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="bg-theme-card border border-theme-border/20 rounded overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-glonimove text-theme-muted">
            Loading…
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="p-12 text-center font-glonimove text-theme-muted">
            No posts. <Link to="/sour/posts/new" className="text-theme-accent hover:underline">Create the first one</Link>.
          </div>
        ) : (
          <ul className="divide-y divide-theme-border/20">
            {visiblePosts.map((post) => {
              const cat = post.category_id ? catMap.get(post.category_id) : null;
              const img = blogImagePublicUrl(post.featured_image);
              return (
                <li
                  key={post.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 hover:bg-theme-bg/40 transition-colors"
                >
                  <div className="shrink-0 w-full sm:w-28 h-28 sm:h-20 bg-theme-bg rounded overflow-hidden border border-theme-border/20">
                    {img ? (
                      <img
                        src={img}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-theme-muted text-xs">
                        no image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusPill status={post.status} />
                      {cat && (
                        <span className="font-googleSans text-[10px] uppercase tracking-wider text-theme-muted">
                          {cat.name}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 font-clofieBold text-lg text-theme-heading truncate">
                      <Link
                        to={`/sour/posts/${post.id}`}
                        className="hover:text-theme-accent"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-1 font-glonimove text-sm text-theme-muted line-clamp-2">
                      {post.excerpt || "—"}
                    </p>
                    <p className="mt-2 font-googleSans text-[11px] uppercase tracking-wider text-theme-muted">
                      Updated {formatDate(post.updated_at)}
                      {post.published_at && ` · Published ${formatDate(post.published_at)}`}
                      {` · /blog/${post.slug}`}
                    </p>
                  </div>
                  <div className="flex sm:flex-col gap-2 sm:items-end">
                    <Link
                      to={`/sour/posts/${post.id}`}
                      className="font-googleSans text-xs uppercase tracking-wider text-theme-text hover:text-theme-accent border border-theme-border/30 hover:border-theme-accent px-3 py-1.5 rounded transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => togglePublish(post)}
                      className="font-googleSans text-xs uppercase tracking-wider text-theme-text hover:text-theme-accent border border-theme-border/30 hover:border-theme-accent px-3 py-1.5 rounded transition-colors"
                    >
                      {post.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePost(post)}
                      className="font-googleSans text-xs uppercase tracking-wider text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-400 px-3 py-1.5 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
