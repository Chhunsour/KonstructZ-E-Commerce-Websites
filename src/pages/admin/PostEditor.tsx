import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BLOG_IMAGE_BUCKET,
  BlogCategory,
  BlogPost,
  PostStatus,
  blogImagePublicUrl,
  supabase,
} from "../../lib/supabase";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  category_id: string;
  status: PostStatus;
  seo_title: string;
  seo_description: string;
  keywords: string;
  published_at: string | null;
}

const empty: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image: "",
  author: "",
  category_id: "",
  status: "draft",
  seo_title: "",
  seo_description: "",
  keywords: "",
  published_at: null,
};

export const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(empty);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [slugDirty, setSlugDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── load ────────────────────────────────────────────────────────── */
  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) return;
      const catRes = await supabase
        .from("blog_categories")
        .select("id,name,slug")
        .order("name");
      if (active) setCategories((catRes.data as BlogCategory[] | null) ?? []);

      if (!isNew && id) {
        const { data, error: err } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .single();
        if (!active) return;
        if (err) {
          setError(err.message);
        } else if (data) {
          const p = data as BlogPost;
          setForm({
            title: p.title ?? "",
            slug: p.slug ?? "",
            excerpt: p.excerpt ?? "",
            content: p.content ?? "",
            featured_image: p.featured_image ?? "",
            author: p.author ?? "",
            category_id: p.category_id ?? "",
            status: p.status,
            seo_title: p.seo_title ?? "",
            seo_description: p.seo_description ?? "",
            keywords: p.keywords ?? "",
            published_at: p.published_at,
          });
          setSlugDirty(true);
        }
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, isNew]);

  /* ── auto-slug while title is being typed (only for new posts) ──── */
  const onTitle = (v: string) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug: slugDirty ? f.slug : slugify(v),
    }));
  };

  const setField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  /* ── image upload ────────────────────────────────────────────────── */
  const onPickImage = () => fileInputRef.current?.click();

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-uploading same file
    if (!file || !supabase) return;
    setUploading(true);
    setError(null);
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const safe = file.name.replace(/[^a-z0-9._-]/gi, "_");
    const path = `${Date.now()}-${safe}`;
    const { error: err } = await supabase.storage
      .from(BLOG_IMAGE_BUCKET)
      .upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });
    setUploading(false);
    if (err) {
      setError(`Upload failed: ${err.message}`);
      return;
    }
    setField("featured_image", path);
    void ext;
  };

  /* ── save ────────────────────────────────────────────────────────── */
  const save = async (publish?: boolean) => {
    if (!supabase) return;
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);

    const nextStatus: PostStatus =
      publish === true ? "published" : publish === false ? "draft" : form.status;

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content,
      featured_image: form.featured_image || null,
      author: form.author.trim() || null,
      category_id: form.category_id || null,
      status: nextStatus,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      keywords: form.keywords.trim() || null,
      published_at:
        nextStatus === "published" && !form.published_at
          ? new Date().toISOString()
          : form.published_at,
    };

    let savedId = id;
    if (isNew) {
      const { data, error: err } = await supabase
        .from("blog_posts")
        .insert(payload)
        .select("id")
        .single();
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
      savedId = (data as { id: string }).id;
    } else {
      const { error: err } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", id);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    }

    setForm((f) => ({ ...f, status: nextStatus, published_at: payload.published_at }));
    setSaving(false);
    setSuccess(
      nextStatus === "published" ? "Published." : "Saved."
    );
    if (isNew && savedId) {
      navigate(`/sour/posts/${savedId}`, { replace: true });
    }
    setTimeout(() => setSuccess(null), 2500);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    save();
  };

  const previewUrl = useMemo(
    () => blogImagePublicUrl(form.featured_image),
    [form.featured_image]
  );

  if (loading) {
    return (
      <div className="py-20 text-center font-glonimove text-theme-muted">
        Loading…
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <Link
            to="/sour/dashboard"
            className="font-googleSans text-xs uppercase tracking-wider text-theme-muted hover:text-theme-accent"
          >
            ← All posts
          </Link>
          <h1 className="mt-1 font-clofieBold text-2xl md:text-3xl text-theme-heading">
            {isNew ? "New post" : "Edit post"}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => save(false)}
            className="font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-4 py-2.5 rounded transition-colors disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save(true)}
            className="font-googleSans text-xs font-bold uppercase tracking-wider bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white px-4 py-2.5 rounded transition-colors disabled:opacity-50"
          >
            {form.status === "published" ? "Update & publish" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 p-3 border border-emerald-500/40 bg-emerald-500/5 rounded font-glonimove text-sm text-emerald-200">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* ── main column ───────────────────────────────────────────── */}
        <div className="space-y-5">
          <div>
            <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => onTitle(e.target.value)}
              className="w-full bg-theme-card border border-theme-border/20 focus:border-theme-accent rounded px-4 py-3 font-clofieBold text-xl text-theme-heading focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
              Slug
            </label>
            <div className="flex items-stretch bg-theme-card border border-theme-border/20 rounded overflow-hidden focus-within:border-theme-accent transition-colors">
              <span className="px-3 flex items-center font-googleSans text-sm text-theme-muted bg-theme-bg/50">
                /blog/
              </span>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugDirty(true);
                  setField("slug", slugify(e.target.value));
                }}
                className="flex-1 bg-transparent px-3 py-3 font-mono text-sm text-theme-text focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
              Excerpt
            </label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
              placeholder="One or two sentences shown in lists and previews."
              className="w-full bg-theme-card border border-theme-border/20 focus:border-theme-accent rounded px-4 py-3 font-glonimove text-base text-theme-text focus:outline-none transition-colors resize-y"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted">
                Content (Markdown)
              </label>
              <div className="flex gap-1 bg-theme-card border border-theme-border/20 rounded p-1">
                {(["write", "preview"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`px-3 py-1 font-googleSans text-[11px] uppercase tracking-wider rounded transition-colors ${
                      tab === t
                        ? "bg-theme-accent text-theme-bg"
                        : "text-theme-muted hover:text-theme-text"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {tab === "write" ? (
              <textarea
                rows={20}
                value={form.content}
                onChange={(e) => setField("content", e.target.value)}
                placeholder={"# Heading\n\nWrite your post using **Markdown**. Lists, links, code blocks and tables are all supported."}
                className="w-full bg-theme-card border border-theme-border/20 focus:border-theme-accent rounded px-4 py-3 font-mono text-sm leading-relaxed text-theme-text focus:outline-none transition-colors resize-y"
              />
            ) : (
              <div className="min-h-[400px] bg-theme-card border border-theme-border/20 rounded px-5 py-4 prose-inverted">
                <article className="font-glonimove text-theme-text [&_h1]:font-clofieBold [&_h1]:text-3xl [&_h1]:text-theme-heading [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:font-clofieBold [&_h2]:text-2xl [&_h2]:text-theme-heading [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:font-clofieBold [&_h3]:text-xl [&_h3]:text-theme-heading [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:my-3 [&_p]:leading-relaxed [&_a]:text-theme-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-theme-accent/60 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-theme-muted [&_code]:bg-theme-bg [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-theme-accent [&_pre]:bg-theme-bg [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_img]:rounded [&_img]:my-4 [&_table]:w-full [&_table]:my-4 [&_th]:text-left [&_th]:border-b [&_th]:border-theme-border/30 [&_th]:p-2 [&_td]:border-b [&_td]:border-theme-border/20 [&_td]:p-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {form.content || "_Nothing to preview yet._"}
                  </ReactMarkdown>
                </article>
              </div>
            )}
          </div>

          {/* SEO section */}
          <fieldset className="bg-theme-card border border-theme-border/20 rounded p-5 space-y-4">
            <legend className="font-googleSans text-xs uppercase tracking-wider text-theme-accent px-2">
              SEO
            </legend>
            <div>
              <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
                SEO title <span className="normal-case text-theme-muted/70">(falls back to post title)</span>
              </label>
              <input
                type="text"
                value={form.seo_title}
                onChange={(e) => setField("seo_title", e.target.value)}
                className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded px-4 py-2.5 font-glonimove text-sm text-theme-text focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
                SEO description <span className="normal-case text-theme-muted/70">(150–160 chars)</span>
              </label>
              <textarea
                rows={3}
                value={form.seo_description}
                onChange={(e) => setField("seo_description", e.target.value)}
                className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded px-4 py-2.5 font-glonimove text-sm text-theme-text focus:outline-none transition-colors resize-y"
              />
              <p className="mt-1 font-googleSans text-[11px] text-theme-muted">
                {form.seo_description.length} characters
              </p>
            </div>
            <div>
              <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
                Keywords <span className="normal-case text-theme-muted/70">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => setField("keywords", e.target.value)}
                className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded px-4 py-2.5 font-glonimove text-sm text-theme-text focus:outline-none transition-colors"
              />
            </div>
          </fieldset>
        </div>

        {/* ── sidebar ───────────────────────────────────────────────── */}
        <aside className="space-y-5">
          {/* Status */}
          <div className="bg-theme-card border border-theme-border/20 rounded p-5">
            <p className="font-googleSans text-xs uppercase tracking-wider text-theme-accent mb-3">
              Status
            </p>
            <p className="font-clofieBold text-lg text-theme-heading capitalize">
              {form.status}
            </p>
            {form.published_at && (
              <p className="mt-1 font-glonimove text-xs text-theme-muted">
                Published {new Date(form.published_at).toLocaleString()}
              </p>
            )}
            {!isNew && form.status === "published" && form.slug && (
              <a
                href={`#/blog/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-googleSans text-xs uppercase tracking-wider text-theme-accent hover:underline"
              >
                Open public ↗
              </a>
            )}
          </div>

          {/* Featured image */}
          <div className="bg-theme-card border border-theme-border/20 rounded p-5">
            <p className="font-googleSans text-xs uppercase tracking-wider text-theme-accent mb-3">
              Featured image
            </p>
            {previewUrl ? (
              <div className="mb-3">
                <img
                  src={previewUrl}
                  alt=""
                  loading="lazy"
                  className="w-full aspect-[16/9] object-cover rounded border border-theme-border/20"
                />
              </div>
            ) : (
              <div className="mb-3 aspect-[16/9] grid place-items-center bg-theme-bg/50 border border-dashed border-theme-border/30 rounded font-glonimove text-xs text-theme-muted">
                No image
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={onUpload}
              className="hidden"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onPickImage}
                disabled={uploading}
                className="flex-1 font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-3 py-2 rounded transition-colors disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload"}
              </button>
              {form.featured_image && (
                <button
                  type="button"
                  onClick={() => setField("featured_image", "")}
                  className="font-googleSans text-xs uppercase tracking-wider text-red-300 hover:text-red-200 border border-red-500/30 px-3 py-2 rounded transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="mt-3 font-googleSans text-[11px] text-theme-muted">
              WebP/AVIF preferred. Stored in the public <code>blog-images</code> bucket.
            </p>
          </div>

          {/* Category & author */}
          <div className="bg-theme-card border border-theme-border/20 rounded p-5 space-y-4">
            <div>
              <p className="font-googleSans text-xs uppercase tracking-wider text-theme-accent mb-2">
                Category
              </p>
              <select
                value={form.category_id}
                onChange={(e) => setField("category_id", e.target.value)}
                className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded px-3 py-2 font-glonimove text-sm text-theme-text focus:outline-none transition-colors"
              >
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Link
                to="/sour/categories"
                className="mt-2 inline-block font-googleSans text-[11px] uppercase tracking-wider text-theme-muted hover:text-theme-accent"
              >
                Manage categories →
              </Link>
            </div>
            <div>
              <p className="font-googleSans text-xs uppercase tracking-wider text-theme-accent mb-2">
                Author
              </p>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setField("author", e.target.value)}
                placeholder="Konstructz Editorial"
                className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded px-3 py-2 font-glonimove text-sm text-theme-text focus:outline-none transition-colors"
              />
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
};

export default PostEditor;
