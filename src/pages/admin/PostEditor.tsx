import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BLOG_ENHANCEMENT_MIGRATION,
  BLOG_IMAGE_BUCKET,
  BLOG_STORAGE_MIGRATION,
  BlogCategory,
  BlogPost,
  PostStatus,
  blogImagePublicUrl,
  isMissingBlogEnhancementColumn,
  isMissingBlogImageBucket,
  supabase,
} from "../../lib/supabase";
import { sanitizeHtml, contentTextLength } from "../../lib/sanitizeHtml";
import RichTextEditor from "../../components/admin/RichTextEditor";
import PostPreviewOverlay from "../../components/admin/PostPreviewOverlay";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** datetime-local <-> ISO helpers (datetime-local has no timezone). */
const isoToLocalInput = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};
const localInputToIso = (local: string): string | null =>
  local ? new Date(local).toISOString() : null;

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  category_id: string;
  status: PostStatus;
  tags: string[];
  seo_title: string;
  seo_description: string;
  keywords: string;
  published_at: string | null;
  scheduled_at: string | null;
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
  tags: [],
  seo_title: "",
  seo_description: "",
  keywords: "",
  published_at: null,
  scheduled_at: null,
};

type SaveIntent = "draft" | "publish" | "schedule";

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
  const [showPreview, setShowPreview] = useState(false);
  const [hasBlogEnhancements, setHasBlogEnhancements] = useState(true);
  const [tagDraft, setTagDraft] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── load ────────────────────────────────────────────────────────── */
  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) return;
      const [catRes, schemaRes] = await Promise.all([
        supabase.from("blog_categories").select("id,name,slug").order("name"),
        supabase.from("blog_posts").select("tags,scheduled_at").limit(1),
      ]);
      if (active) setCategories((catRes.data as BlogCategory[] | null) ?? []);
      if (active && schemaRes.error) {
        setHasBlogEnhancements(!isMissingBlogEnhancementColumn(schemaRes.error.message));
      }

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
            tags: p.tags ?? [],
            seo_title: p.seo_title ?? "",
            seo_description: p.seo_description ?? "",
            keywords: p.keywords ?? "",
            published_at: p.published_at,
            scheduled_at: p.scheduled_at ?? null,
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

  /* ── field helpers ───────────────────────────────────────────────── */
  const onTitle = (v: string) => {
    setForm((f) => ({ ...f, title: v, slug: slugDirty ? f.slug : slugify(v) }));
  };

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
    },
    []
  );

  const commitTag = () => {
    const t = tagDraft.trim().replace(/,$/, "").trim();
    if (!t) return;
    setForm((f) =>
      f.tags.includes(t) ? f : { ...f, tags: [...f.tags, t] }
    );
    setTagDraft("");
  };
  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== tag) }));

  /* ── featured image upload ───────────────────────────────────────── */
  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !supabase) return;
    setUploading(true);
    setError(null);
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
      setError(
        isMissingBlogImageBucket(err.message)
          ? `Upload failed: Supabase Storage bucket "${BLOG_IMAGE_BUCKET}" does not exist. Run ${BLOG_STORAGE_MIGRATION} in the Supabase SQL editor, then try again.`
          : `Upload failed: ${err.message}`
      );
      return;
    }
    setField("featured_image", path);
  };

  /* ── validation ──────────────────────────────────────────────────── */
  const validate = (intent: SaveIntent): string | null => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.slug.trim()) return "Slug is required.";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug))
      return "Slug can only contain lowercase letters, numbers and hyphens.";
    if (intent !== "draft") {
      if (contentTextLength(form.content) === 0)
        return "Add some content before publishing.";
      if (!form.excerpt.trim())
        return "A short excerpt is required before publishing.";
      if (!form.featured_image.trim())
        return "A featured image is required before publishing.";
    }
    if (intent === "schedule") {
      if (!hasBlogEnhancements)
        return `Scheduled publishing requires ${BLOG_ENHANCEMENT_MIGRATION}.`;
      if (!form.scheduled_at) return "Pick a date and time to schedule.";
      if (new Date(form.scheduled_at).getTime() <= Date.now())
        return "Scheduled time must be in the future.";
    }
    return null;
  };

  /* ── save ────────────────────────────────────────────────────────── */
  const save = async (intent: SaveIntent) => {
    if (!supabase) return;
    const problem = validate(intent);
    if (problem) {
      setError(problem);
      setSuccess(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);

    const nextStatus: PostStatus =
      intent === "publish" ? "published" : intent === "schedule" ? "scheduled" : "draft";

    const scheduledAt =
      hasBlogEnhancements && nextStatus === "scheduled" ? form.scheduled_at : null;
    const publishedAt =
      nextStatus === "published"
        ? form.published_at ?? new Date().toISOString()
        : nextStatus === "draft"
        ? form.published_at
        : null;

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || null,
      content: sanitizeHtml(form.content),
      featured_image: form.featured_image.trim() || null,
      author: form.author.trim() || null,
      category_id: form.category_id || null,
      status: nextStatus,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      keywords: form.keywords.trim() || null,
      published_at: publishedAt,
    };
    if (hasBlogEnhancements) {
      payload.tags = form.tags;
      payload.scheduled_at = scheduledAt;
    }

    let savedId = id;
    if (isNew) {
      const { data, error: err } = await supabase
        .from("blog_posts")
        .insert(payload)
        .select("id")
        .single();
      if (err) {
        setError(humanizeError(err.message));
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
        setError(humanizeError(err.message));
        setSaving(false);
        return;
      }
    }

    setForm((f) => ({
      ...f,
      status: nextStatus,
      published_at: publishedAt,
      scheduled_at: scheduledAt,
    }));
    setSaving(false);
    setSuccess(
      nextStatus === "published"
        ? "Published — it's live now."
        : nextStatus === "scheduled"
        ? "Scheduled. It will publish automatically."
        : "Draft saved."
    );
    if (isNew && savedId) {
      navigate(`/sour/posts/${savedId}`, { replace: true });
    }
    setTimeout(() => setSuccess(null), 3500);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    save("draft");
  };

  const previewImageUrl = useMemo(
    () => blogImagePublicUrl(form.featured_image),
    [form.featured_image]
  );

  const scheduledIsFuture =
    hasBlogEnhancements &&
    !!form.scheduled_at &&
    new Date(form.scheduled_at).getTime() > Date.now();

  if (loading) {
    return (
      <div className="py-20 text-center font-glonimove text-theme-muted">
        Loading…
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {/* ── header / actions ─────────────────────────────────────────── */}
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
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-4 py-2.5 rounded transition-colors"
          >
            Preview
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save("draft")}
            className="font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-4 py-2.5 rounded transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
          {scheduledIsFuture ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => save("schedule")}
              className="font-googleSans text-xs font-bold uppercase tracking-wider bg-blue-500 text-white hover:bg-blue-600 px-4 py-2.5 rounded transition-colors disabled:opacity-50"
            >
              Schedule
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() => save("publish")}
              className="font-googleSans text-xs font-bold uppercase tracking-wider bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white px-4 py-2.5 rounded transition-colors disabled:opacity-50"
            >
              {form.status === "published" ? "Update & publish" : "Publish"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-300 flex items-start gap-2">
          <span aria-hidden>⚠</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-5 p-3 border border-emerald-500/40 bg-emerald-500/5 rounded font-glonimove text-sm text-emerald-300 flex items-start gap-2">
          <span aria-hidden>✓</span>
          <span>{success}</span>
        </div>
      )}
      {!hasBlogEnhancements && (
        <div className="mb-5 p-3 border border-yellow-500/40 bg-yellow-500/5 rounded font-glonimove text-sm text-yellow-100">
          Tags and scheduled publishing are disabled because the database is
          missing the blog enhancement columns. Run {BLOG_ENHANCEMENT_MIGRATION}
          {" "}to enable them.
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* ── main column ───────────────────────────────────────────── */}
        <div className="space-y-5">
          <div>
            <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => onTitle(e.target.value)}
              placeholder="Give your post a clear headline"
              className="w-full bg-theme-card border border-theme-border/20 focus:border-theme-accent rounded px-4 py-3 font-clofieBold text-xl text-theme-heading focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
              Slug / URL <span className="text-red-400">*</span>
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
              Short description / excerpt
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
            <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
              Content
            </label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setField("content", html)}
              placeholder="Write your post — use the toolbar for headings, links, images and buttons."
            />
            <p className="mt-1.5 font-googleSans text-[11px] text-theme-muted">
              {contentTextLength(form.content)} characters · Use the toolbar to
              format. Click <span className="text-theme-accent">Preview</span> to
              see the public layout.
            </p>
          </div>

          {/* SEO section */}
          <fieldset className="bg-theme-card border border-theme-border/20 rounded p-5 space-y-4">
            <legend className="font-googleSans text-xs uppercase tracking-wider text-theme-accent px-2">
              SEO
            </legend>
            <div>
              <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
                SEO title{" "}
                <span className="normal-case text-theme-muted/70">
                  (falls back to post title)
                </span>
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
                SEO description{" "}
                <span className="normal-case text-theme-muted/70">(150–160 chars)</span>
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
                SEO keywords{" "}
                <span className="normal-case text-theme-muted/70">(comma-separated)</span>
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
          {/* Status & schedule */}
          <div className="bg-theme-card border border-theme-border/20 rounded p-5 space-y-4">
            <div>
              <p className="font-googleSans text-xs uppercase tracking-wider text-theme-accent mb-2">
                Status
              </p>
              <StatusBadge status={form.status} />
              {form.published_at && form.status === "published" && (
                <p className="mt-2 font-glonimove text-xs text-theme-muted">
                  Published {new Date(form.published_at).toLocaleString()}
                </p>
              )}
              {!isNew && form.status === "published" && form.slug && (
                <a
                  href={`/blog/${form.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-googleSans text-xs uppercase tracking-wider text-theme-accent hover:underline"
                >
                  Open public ↗
                </a>
              )}
            </div>
            {hasBlogEnhancements && (
              <div>
                <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
                  Scheduled publish date
                </label>
                <input
                  type="datetime-local"
                  value={isoToLocalInput(form.scheduled_at)}
                  onChange={(e) =>
                    setField("scheduled_at", localInputToIso(e.target.value))
                  }
                  className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded px-3 py-2 font-glonimove text-sm text-theme-text focus:outline-none transition-colors [color-scheme:dark]"
                />
                <p className="mt-1 font-googleSans text-[11px] text-theme-muted">
                  {scheduledIsFuture
                    ? "Use “Schedule” to queue this post — it stays hidden until then."
                    : "Set a future date, then use “Schedule”."}
                </p>
              </div>
            )}
          </div>

          {/* Featured image */}
          <div className="bg-theme-card border border-theme-border/20 rounded p-5">
            <p className="font-googleSans text-xs uppercase tracking-wider text-theme-accent mb-3">
              Main featured image
            </p>
            {previewImageUrl ? (
              <div className="mb-3">
                <img
                  src={previewImageUrl}
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
              type="text"
              value={form.featured_image}
              onChange={(e) => setField("featured_image", e.target.value)}
              placeholder="Paste an image URL…"
              className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded px-3 py-2 font-mono text-xs text-theme-text focus:outline-none transition-colors mb-2"
            />
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
                onClick={() => fileInputRef.current?.click()}
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
              Paste any URL, or upload to the <code>blog-images</code> bucket.
            </p>
          </div>

          {/* Category, author & tags */}
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
            {hasBlogEnhancements && (
              <div>
                <p className="font-googleSans text-xs uppercase tracking-wider text-theme-accent mb-2">
                  Tags
                </p>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-theme-bg border border-theme-border/30 rounded px-2 py-0.5 font-googleSans text-xs text-theme-text"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          aria-label={`Remove ${tag}`}
                          className="text-theme-muted hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      commitTag();
                    } else if (e.key === "Backspace" && !tagDraft && form.tags.length) {
                      removeTag(form.tags[form.tags.length - 1]);
                    }
                  }}
                  onBlur={commitTag}
                  placeholder="Type a tag and press Enter"
                  className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded px-3 py-2 font-glonimove text-sm text-theme-text focus:outline-none transition-colors"
                />
              </div>
            )}
          </div>
        </aside>
      </div>

      {showPreview && (
        <PostPreviewOverlay
          title={form.title}
          excerpt={form.excerpt}
          author={form.author || "Konstructz Editorial"}
          category={
            categories.find((c) => c.id === form.category_id)?.name ?? ""
          }
          image={previewImageUrl}
          content={form.content}
          tags={hasBlogEnhancements ? form.tags : []}
          onClose={() => setShowPreview(false)}
        />
      )}
    </form>
  );
};

/* ── status badge ──────────────────────────────────────────────────── */
const StatusBadge: React.FC<{ status: PostStatus }> = ({ status }) => {
  const styles: Record<PostStatus, string> = {
    published: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
    scheduled: "bg-blue-500/10 text-blue-300 border-blue-500/40",
    draft: "bg-yellow-500/10 text-yellow-200 border-yellow-500/40",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full font-googleSans text-[11px] uppercase tracking-wider border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const humanizeError = (msg: string): string => {
  if (/duplicate key|unique/i.test(msg) && /slug/i.test(msg))
    return "That slug is already in use. Choose a different one.";
  return msg;
};

export default PostEditor;
