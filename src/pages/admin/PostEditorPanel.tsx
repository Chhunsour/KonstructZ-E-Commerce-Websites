import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BLOG_ENHANCEMENT_MIGRATION,
  BlogCategory,
  BlogPost,
  BlogPostSummary,
  PostStatus,
  blogImagePublicUrl,
  supabase,
} from "../../lib/supabase";
import { sanitizeHtml, contentTextLength } from "../../lib/sanitizeHtml";
import {
  uploadBlogImage,
  looksLikeImageUrl,
} from "../../lib/blogImageUpload";
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

interface PostEditorPanelProps {
  /** Route id — undefined or "new" means a fresh post. */
  id?: string;
  categories: BlogCategory[];
  hasBlogEnhancements: boolean;
  /** Fired after a successful save so the list can update in place. */
  onSaved: (summary: BlogPostSummary) => void;
  /** Mobile "back to list" affordance. */
  onBack?: () => void;
}

export const PostEditorPanel: React.FC<PostEditorPanelProps> = ({
  id,
  categories,
  hasBlogEnhancements,
  onSaved,
  onBack,
}) => {
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [tagDraft, setTagDraft] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);
  const [bodyUploads, setBodyUploads] = useState(0);
  const createdAtRef = useRef<string | null>(null);

  /* ── load the open post ───────────────────────────────────────────── */
  useEffect(() => {
    let active = true;
    setError(null);
    setSuccess(null);
    if (isNew) {
      setForm(empty);
      createdAtRef.current = null;
      setSlugDirty(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      if (!supabase || !id) return;
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
        createdAtRef.current = p.created_at ?? null;
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
    setForm((f) => (f.tags.includes(t) ? f : { ...f, tags: [...f.tags, t] }));
    setTagDraft("");
  };
  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== tag) }));

  const uploadBodyImage = useCallback(
    (file: File) => uploadBlogImage(file, form.slug).then((r) => r.url),
    [form.slug]
  );

  /* ── validation ──────────────────────────────────────────────────── */
  const validate = (intent: SaveIntent): string | null => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.slug.trim()) return "Slug is required.";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug))
      return "Slug can only contain lowercase letters, numbers and hyphens.";
    if (bodyUploads > 0)
      return "Wait for the images in your article to finish uploading.";
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

  /** Drop any image placeholders left behind by an in-flight upload. */
  const cleanContent = (html: string): string => {
    if (typeof DOMParser === "undefined") return html;
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("img[data-uploading]").forEach((el) => el.remove());
    return doc.body.innerHTML;
  };

  /* ── save ────────────────────────────────────────────────────────── */
  const save = async (intent: SaveIntent) => {
    if (!supabase) return;
    const problem = validate(intent);
    if (problem) {
      setError(problem);
      setSuccess(null);
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);

    const nextStatus: PostStatus =
      intent === "publish"
        ? "published"
        : intent === "schedule"
        ? "scheduled"
        : "draft";

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
      content: sanitizeHtml(cleanContent(form.content)),
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

    const nowIso = new Date().toISOString();
    let savedId = id;
    if (isNew) {
      const { data, error: err } = await supabase
        .from("blog_posts")
        .insert(payload)
        .select("id,created_at")
        .single();
      if (err) {
        setError(humanizeError(err.message));
        setSaving(false);
        return;
      }
      const row = data as { id: string; created_at?: string };
      savedId = row.id;
      createdAtRef.current = row.created_at ?? nowIso;
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

    // Push the fresh summary up so the list re-renders without a refetch.
    onSaved({
      id: savedId as string,
      slug: form.slug.trim(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || null,
      featured_image: form.featured_image.trim() || null,
      author: form.author.trim() || null,
      category_id: form.category_id || null,
      status: nextStatus,
      tags: hasBlogEnhancements ? form.tags : [],
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      keywords: form.keywords.trim() || null,
      created_at: createdAtRef.current ?? nowIso,
      updated_at: nowIso,
      published_at: publishedAt,
      scheduled_at: scheduledAt,
    });

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
    <div>
      {/* ── header / actions ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="lg:hidden font-googleSans text-xs uppercase tracking-wider text-theme-muted hover:text-theme-accent"
            >
              ← All posts
            </button>
          )}
          <h1 className="mt-1 font-clofieBold text-2xl text-theme-heading truncate">
            {isNew ? "New post" : form.title || "Untitled post"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-4 py-2.5 rounded-lg transition-colors"
          >
            Preview
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save("draft")}
            className="font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
          {scheduledIsFuture ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => save("schedule")}
              className="font-googleSans text-xs font-bold uppercase tracking-wider bg-blue-500 text-white hover:bg-blue-600 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              Schedule
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() => save("publish")}
              className="font-googleSans text-xs font-bold uppercase tracking-wider bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {form.status === "published" ? "Update & publish" : "Publish"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 border border-red-500/40 bg-red-500/5 rounded-lg font-glonimove text-sm text-red-300 flex items-start gap-2">
          <span aria-hidden>⚠</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-5 p-3 border border-emerald-500/40 bg-emerald-500/5 rounded-lg font-glonimove text-sm text-emerald-300 flex items-start gap-2">
          <span aria-hidden>✓</span>
          <span>{success}</span>
        </div>
      )}

      <div className="grid xl:grid-cols-[1fr_300px] gap-6">
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
              className="w-full bg-theme-card border border-theme-border/20 focus:border-theme-accent rounded-lg px-4 py-3 font-clofieBold text-xl text-theme-heading focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
              Slug / URL <span className="text-red-400">*</span>
            </label>
            <div className="flex items-stretch bg-theme-card border border-theme-border/20 rounded-lg overflow-hidden focus-within:border-theme-accent transition-colors">
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

          <FeaturedImageField
            value={form.featured_image}
            previewUrl={previewImageUrl}
            slug={form.slug}
            onChange={(v) => setField("featured_image", v)}
            onError={setError}
          />

          <div>
            <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
              Short description / excerpt
            </label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
              placeholder="One or two sentences shown in lists and previews."
              className="w-full bg-theme-card border border-theme-border/20 focus:border-theme-accent rounded-lg px-4 py-3 font-glonimove text-base text-theme-text focus:outline-none transition-colors resize-y"
            />
          </div>

          <div>
            <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
              Full article content
            </label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setField("content", html)}
              onUploadImage={uploadBodyImage}
              onUploadingChange={setBodyUploads}
              onError={setError}
              placeholder="Write your post — paste or drop an image to upload it inline."
            />
            <p className="mt-1.5 font-googleSans text-[11px] text-theme-muted">
              {contentTextLength(form.content)} characters
              {bodyUploads > 0 && (
                <span className="text-theme-accent"> · uploading {bodyUploads} image{bodyUploads > 1 ? "s" : ""}…</span>
              )}
              {" "}· Paste or drag an image into the editor to add it inline.
            </p>
          </div>

          {/* SEO section */}
          <SeoSection
            seoTitle={form.seo_title}
            seoDescription={form.seo_description}
            keywords={form.keywords}
            slug={form.slug}
            onChange={setField}
          />
        </div>

        {/* ── sidebar ───────────────────────────────────────────────── */}
        <aside className="space-y-5">
          {/* Status & schedule */}
          <div className="bg-theme-card border border-theme-border/20 rounded-lg p-5 space-y-4">
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
                  className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded-lg px-3 py-2 font-glonimove text-sm text-theme-text focus:outline-none transition-colors [color-scheme:dark]"
                />
                <p className="mt-1 font-googleSans text-[11px] text-theme-muted">
                  {scheduledIsFuture
                    ? "Use “Schedule” to queue this post — it stays hidden until then."
                    : "Set a future date, then use “Schedule”."}
                </p>
              </div>
            )}
          </div>

          {/* Category, author & tags */}
          <div className="bg-theme-card border border-theme-border/20 rounded-lg p-5 space-y-4">
            <div>
              <p className="font-googleSans text-xs uppercase tracking-wider text-theme-accent mb-2">
                Category
              </p>
              <select
                value={form.category_id}
                onChange={(e) => setField("category_id", e.target.value)}
                className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded-lg px-3 py-2 font-glonimove text-sm text-theme-text focus:outline-none transition-colors"
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
                placeholder="Denvor"
                className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded-lg px-3 py-2 font-glonimove text-sm text-theme-text focus:outline-none transition-colors"
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
                    } else if (
                      e.key === "Backspace" &&
                      !tagDraft &&
                      form.tags.length
                    ) {
                      removeTag(form.tags[form.tags.length - 1]);
                    }
                  }}
                  onBlur={commitTag}
                  placeholder="Type a tag and press Enter"
                  className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded-lg px-3 py-2 font-glonimove text-sm text-theme-text focus:outline-none transition-colors"
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
          author={form.author || "Denvor"}
          category={categories.find((c) => c.id === form.category_id)?.name ?? ""}
          image={previewImageUrl}
          content={form.content}
          tags={hasBlogEnhancements ? form.tags : []}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

/* ── Featured image drop zone ──────────────────────────────────────────── */
const FeaturedImageField: React.FC<{
  value: string;
  previewUrl: string | null;
  slug: string;
  onChange: (val: string) => void;
  onError: (msg: string | null) => void;
}> = ({ value, previewUrl, slug, onChange, onError }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    onError(null);
    try {
      const { path } = await uploadBlogImage(file, slug);
      onChange(path);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const file = Array.from(e.clipboardData.files).find((f) =>
      f.type.startsWith("image/")
    );
    if (file) {
      e.preventDefault();
      void handleFile(file);
      return;
    }
    const text = e.clipboardData.getData("text/plain").trim();
    if (text && looksLikeImageUrl(text)) {
      e.preventDefault();
      onChange(text);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = Array.from(e.dataTransfer.files).find((f) =>
      f.type.startsWith("image/")
    );
    if (file) void handleFile(file);
  };

  return (
    <div>
      <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
        Featured image
      </label>
      <div
        tabIndex={0}
        role="button"
        aria-label="Featured image drop zone — paste, drop, or click to upload"
        onPaste={onPaste}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !previewUrl && fileRef.current?.click()}
        className={`relative rounded-lg border border-dashed transition-colors overflow-hidden focus:outline-none focus:border-theme-accent ${
          dragOver
            ? "border-theme-accent bg-theme-accent/5"
            : "border-theme-border/40 bg-theme-bg/40"
        }`}
      >
        {previewUrl ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt=""
              loading="lazy"
              className="w-full aspect-[16/9] object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileRef.current?.click();
                }}
                className="font-googleSans text-xs uppercase tracking-wider bg-theme-card/90 text-theme-text border border-theme-border/40 px-3 py-1.5 rounded"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="font-googleSans text-xs uppercase tracking-wider bg-theme-card/90 text-red-300 border border-red-500/40 px-3 py-1.5 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="aspect-[16/9] grid place-items-center text-center px-6">
            <div>
              <p className="font-clofieBold text-sm text-theme-heading">
                Paste, drop, or click to upload
              </p>
              <p className="mt-1 font-glonimove text-xs text-theme-muted">
                JPG, PNG, WebP or AVIF · or paste an image URL below
              </p>
            </div>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-theme-bg/70 grid place-items-center">
            <div className="text-center">
              <div className="mx-auto mb-2 h-1.5 w-32 overflow-hidden rounded-full bg-theme-border/30">
                <div className="h-full w-full animate-pulse rounded-full bg-theme-accent" />
              </div>
              <p className="font-googleSans text-xs uppercase tracking-wider text-theme-accent">
                Uploading…
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void handleFile(f);
        }}
        className="hidden"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL"
        className="mt-2 w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded-lg px-3 py-2 font-mono text-xs text-theme-text focus:outline-none transition-colors"
      />
    </div>
  );
};

/* ── SEO section ───────────────────────────────────────────────────────── */
const SeoSection: React.FC<{
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  slug: string;
  onChange: (key: "seo_title" | "seo_description" | "keywords", val: string) => void;
}> = ({ seoTitle, seoDescription, keywords, slug, onChange }) => {
  const titleLen = seoTitle.length;
  const descLen = seoDescription.length;
  const counter = (len: number, lo: number, hi: number) =>
    len === 0
      ? "text-theme-muted"
      : len > hi
      ? "text-red-300"
      : len >= lo
      ? "text-emerald-300"
      : "text-amber-300";

  return (
    <fieldset className="bg-theme-card border border-theme-border/20 rounded-lg p-5 space-y-4">
      <legend className="font-googleSans text-xs uppercase tracking-wider text-theme-accent px-2">
        SEO settings
      </legend>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-googleSans text-xs uppercase tracking-wider text-theme-muted">
            SEO page title
          </label>
          <span className={`font-mono text-[11px] ${counter(titleLen, 30, 60)}`}>
            {titleLen}/60
          </span>
        </div>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => onChange("seo_title", e.target.value)}
          placeholder="Falls back to the post title"
          className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded-lg px-4 py-2.5 font-glonimove text-sm text-theme-text focus:outline-none transition-colors"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-googleSans text-xs uppercase tracking-wider text-theme-muted">
            SEO meta description
          </label>
          <span className={`font-mono text-[11px] ${counter(descLen, 120, 160)}`}>
            {descLen}/160
          </span>
        </div>
        <textarea
          rows={3}
          value={seoDescription}
          onChange={(e) => onChange("seo_description", e.target.value)}
          placeholder="150–160 characters describing the post for search results."
          className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded-lg px-4 py-2.5 font-glonimove text-sm text-theme-text focus:outline-none transition-colors resize-y"
        />
      </div>
      <div>
        <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
          SEO keywords{" "}
          <span className="normal-case text-theme-muted/70">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => onChange("keywords", e.target.value)}
          className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded-lg px-4 py-2.5 font-glonimove text-sm text-theme-text focus:outline-none transition-colors"
        />
      </div>
      <p className="font-mono text-[11px] text-theme-muted truncate">
        konstructz.com/blog/{slug || "your-post-slug"}
      </p>
    </fieldset>
  );
};

/* ── status badge ──────────────────────────────────────────────────────── */
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

export default PostEditorPanel;
