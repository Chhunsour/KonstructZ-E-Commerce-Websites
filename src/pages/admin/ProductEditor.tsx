import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AttachmentRef,
  DbProductCategory,
  ProductInput,
  ProductKind,
  ProductLine,
  ProductStatus,
  SpecRow,
} from "../../lib/supabase";
import {
  createProduct,
  getProduct,
  listCategories,
  slugTaken,
  updateProduct,
  upsertCategory,
} from "../../lib/adminProducts";
import MarkdownField from "../../components/admin/MarkdownField";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** http(s) absolute, or a site-relative path. Empty is allowed (optional). */
const isValidUrl = (raw: string): boolean => {
  const u = raw.trim();
  if (!u) return true;
  if (u.startsWith("/")) return true;
  return /^https?:\/\/\S+$/i.test(u);
};

const TABS = [
  "Basic Info",
  "Images",
  "Specs",
  "Pricing",
  "Compatibility",
  "SEO",
  "Publish Settings",
] as const;
type Tab = (typeof TABS)[number];

interface FormState {
  name: string;
  slug: string;
  brand: string;
  category_id: string;
  product_line: ProductLine;
  product_type: ProductKind;
  short_description: string;
  full_description: string;
  featured_image: string;
  gallery: string[];
  price: string;
  sale_price: string;
  sku: string;
  gtin: string;
  stock_status: string;
  condition: string;
  engine: string;
  horsepower: string;
  operating_weight: string;
  lift_capacity: string;
  digging_depth: string;
  width: string;
  height: string;
  length: string;
  fuel_type: string;
  machine_type: string;
  extra_specs: SpecRow[];
  compatible_attachments: { name: string; url: string }[];
  warranty_info: string;
  shipping_info: string;
  financing_info: string;
  button_text: string;
  button_url: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  status: ProductStatus;
  published_at: string | null;
  sort_order: number;
}

const empty: FormState = {
  name: "",
  slug: "",
  brand: "",
  category_id: "",
  product_line: "konstructz",
  product_type: "equipment",
  short_description: "",
  full_description: "",
  featured_image: "",
  gallery: [],
  price: "",
  sale_price: "",
  sku: "",
  gtin: "",
  stock_status: "",
  condition: "",
  engine: "",
  horsepower: "",
  operating_weight: "",
  lift_capacity: "",
  digging_depth: "",
  width: "",
  height: "",
  length: "",
  fuel_type: "",
  machine_type: "",
  extra_specs: [],
  compatible_attachments: [],
  warranty_info: "",
  shipping_info: "",
  financing_info: "",
  button_text: "",
  button_url: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  status: "draft",
  published_at: null,
  sort_order: 0,
};

const normalizeAttachments = (raw: AttachmentRef[]): { name: string; url: string }[] =>
  (raw ?? []).map((a) =>
    typeof a === "string" ? { name: a, url: "" } : { name: a.name, url: a.url ?? "" }
  );

type Intent = "draft" | "publish" | "hidden";

export const ProductEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(empty);
  const [categories, setCategories] = useState<DbProductCategory[]>([]);
  const [tab, setTab] = useState<Tab>("Basic Info");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [slugDirty, setSlugDirty] = useState(false);
  const [newCat, setNewCat] = useState("");

  /* ── load ────────────────────────────────────────────────────────── */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const cats = await listCategories();
        if (active) setCategories(cats);
        if (!isNew && id) {
          const p = await getProduct(id);
          if (!active) return;
          if (!p) {
            setError("Product not found.");
          } else {
            setForm({
              name: p.name ?? "",
              slug: p.slug ?? "",
              brand: p.brand ?? "",
              category_id: p.category_id ?? "",
              product_line: p.product_line,
              product_type: p.product_type,
              short_description: p.short_description ?? "",
              full_description: p.full_description ?? "",
              featured_image: p.featured_image ?? "",
              gallery: Array.isArray(p.gallery_images) ? p.gallery_images : [],
              price: p.price ?? "",
              sale_price: p.sale_price ?? "",
              sku: p.sku ?? "",
              gtin: p.gtin ?? "",
              stock_status: p.stock_status ?? "",
              condition: p.condition ?? "",
              engine: p.engine ?? "",
              horsepower: p.horsepower ?? "",
              operating_weight: p.operating_weight ?? "",
              lift_capacity: p.lift_capacity ?? "",
              digging_depth: p.digging_depth ?? "",
              width: p.width ?? "",
              height: p.height ?? "",
              length: p.length ?? "",
              fuel_type: p.fuel_type ?? "",
              machine_type: p.machine_type ?? "",
              extra_specs: Array.isArray(p.extra_specs) ? p.extra_specs : [],
              compatible_attachments: normalizeAttachments(p.compatible_attachments),
              warranty_info: p.warranty_info ?? "",
              shipping_info: p.shipping_info ?? "",
              financing_info: p.financing_info ?? "",
              button_text: p.button_text ?? "",
              button_url: p.button_url ?? "",
              seo_title: p.seo_title ?? "",
              seo_description: p.seo_description ?? "",
              seo_keywords: p.seo_keywords ?? "",
              status: p.status,
              published_at: p.published_at,
              sort_order: p.sort_order ?? 0,
            });
            setSlugDirty(true);
          }
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, isNew]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onName = (v: string) =>
    setForm((f) => ({ ...f, name: v, slug: slugDirty ? f.slug : slugify(v) }));

  const addCategory = async () => {
    const name = newCat.trim();
    if (!name) return;
    try {
      const cat = await upsertCategory({ name, slug: slugify(name) });
      setCategories((prev) =>
        prev.some((c) => c.id === cat.id) ? prev : [...prev, cat]
      );
      set("category_id", cat.id);
      setNewCat("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  /* ── validation ──────────────────────────────────────────────────── */
  const validate = (intent: Intent): string | null => {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.slug.trim()) return "Slug is required.";
    if (!SLUG_RE.test(form.slug))
      return "Slug can only contain lowercase letters, numbers and hyphens.";
    if (!isValidUrl(form.featured_image))
      return "Featured image must be a valid URL or a site path starting with /.";
    if (form.gallery.some((g) => !isValidUrl(g)))
      return "One or more gallery image URLs are invalid.";
    if (!isValidUrl(form.button_url))
      return "Button URL must be a valid URL or a site path starting with /.";
    if (intent === "publish") {
      if (!form.category_id) return "Pick a category before publishing.";
      if (!form.price.trim()) return "A price is required before publishing.";
      if (!form.featured_image.trim())
        return "A featured image is required before publishing.";
    }
    return null;
  };

  const buildPayload = (status: ProductStatus): ProductInput => ({
    name: form.name.trim(),
    slug: form.slug.trim(),
    brand: form.brand.trim() || null,
    category_id: form.category_id || null,
    product_line: form.product_line,
    product_type: form.product_type,
    short_description: form.short_description.trim() || null,
    full_description: form.full_description,
    featured_image: form.featured_image.trim() || null,
    gallery_images: form.gallery.map((g) => g.trim()).filter(Boolean),
    price: form.price.trim() || null,
    sale_price: form.sale_price.trim() || null,
    sku: form.sku.trim() || null,
    gtin: form.gtin.trim() || null,
    stock_status: form.stock_status.trim() || null,
    condition: form.condition.trim() || null,
    engine: form.engine.trim() || null,
    horsepower: form.horsepower.trim() || null,
    operating_weight: form.operating_weight.trim() || null,
    lift_capacity: form.lift_capacity.trim() || null,
    digging_depth: form.digging_depth.trim() || null,
    width: form.width.trim() || null,
    height: form.height.trim() || null,
    length: form.length.trim() || null,
    fuel_type: form.fuel_type.trim() || null,
    machine_type: form.machine_type.trim() || null,
    extra_specs: form.extra_specs.filter((s) => s.label.trim() || s.value.trim()),
    compatible_attachments: form.compatible_attachments
      .filter((a) => a.name.trim())
      .map((a) => (a.url.trim() ? { name: a.name.trim(), url: a.url.trim() } : a.name.trim())),
    warranty_info: form.warranty_info.trim() || null,
    shipping_info: form.shipping_info.trim() || null,
    financing_info: form.financing_info.trim() || null,
    button_text: form.button_text.trim() || null,
    button_url: form.button_url.trim() || null,
    seo_title: form.seo_title.trim() || null,
    seo_description: form.seo_description.trim() || null,
    seo_keywords: form.seo_keywords.trim() || null,
    status,
    sort_order: form.sort_order,
  });

  const save = async (intent: Intent) => {
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
    const status: ProductStatus =
      intent === "publish" ? "published" : intent === "hidden" ? "hidden" : "draft";
    try {
      if (await slugTaken(form.slug.trim(), isNew ? undefined : id)) {
        setError("That slug is already used by another product. Choose a different one.");
        setSaving(false);
        return;
      }
      const payload = buildPayload(status);
      if (isNew) {
        const created = await createProduct(payload);
        setSuccess(statusMessage(status));
        navigate(`/sour/products/${created.id}`, { replace: true });
      } else {
        const updated = await updateProduct(id!, payload);
        setForm((f) => ({ ...f, status, published_at: updated.published_at }));
        setSuccess(statusMessage(status));
      }
      setTimeout(() => setSuccess(null), 3500);
    } catch (e) {
      setError(humanizeError(e instanceof Error ? e.message : String(e)));
    } finally {
      setSaving(false);
    }
  };

  const galleryText = useMemo(() => form.gallery.join("\n"), [form.gallery]);

  if (loading) {
    return (
      <div className="py-20 text-center font-glonimove text-theme-muted">Loading…</div>
    );
  }

  return (
    <div>
      {/* header / actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <Link
            to="/sour/products"
            className="font-googleSans text-xs uppercase tracking-wider text-theme-muted hover:text-theme-accent"
          >
            ← All products
          </Link>
          <h1 className="mt-1 font-clofieBold text-2xl md:text-3xl text-theme-heading">
            {isNew ? "New product" : "Edit product"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isNew && (
            <Link
              to={`/sour/products/${id}/preview`}
              className="font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-4 py-2.5 rounded transition-colors"
            >
              Preview
            </Link>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => save("draft")}
            className="font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-4 py-2.5 rounded transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save("publish")}
            className="font-googleSans text-xs font-bold uppercase tracking-wider bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white px-4 py-2.5 rounded transition-colors disabled:opacity-50"
          >
            {form.status === "published" ? "Update & publish" : "Publish"}
          </button>
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

      {/* tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-theme-border/20">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 font-googleSans text-xs uppercase tracking-wider rounded-t transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-theme-accent text-theme-accent"
                : "border-transparent text-theme-muted hover:text-theme-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-5 max-w-3xl">
        {/* ── Basic Info ─────────────────────────────────────────────── */}
        {tab === "Basic Info" && (
          <>
            <Field label="Product name" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => onName(e.target.value)}
                placeholder="e.g. STOMP V980"
                className={inputXl}
              />
            </Field>
            <Field label="Slug / product URL" required>
              <div className="flex items-stretch bg-theme-card border border-theme-border/20 rounded overflow-hidden focus-within:border-theme-accent transition-colors">
                <span className="px-3 flex items-center font-googleSans text-sm text-theme-muted bg-theme-bg/50">
                  {form.product_line === "typhon" ? "/typhon-machinery/" : "/equipment/"}
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugDirty(true);
                    set("slug", slugify(e.target.value));
                  }}
                  className="flex-1 bg-transparent px-3 py-3 font-mono text-sm text-theme-text focus:outline-none"
                />
              </div>
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Brand">
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                  placeholder="Konstructz / Typhon …"
                  className={input}
                />
              </Field>
              <Field label="Product line">
                <select
                  value={form.product_line}
                  onChange={(e) => set("product_line", e.target.value as ProductLine)}
                  className={input}
                >
                  <option value="konstructz">Konstructz</option>
                  <option value="typhon">Typhon</option>
                </select>
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Product type">
                <select
                  value={form.product_type}
                  onChange={(e) => set("product_type", e.target.value as ProductKind)}
                  className={input}
                >
                  <option value="equipment">Equipment</option>
                  <option value="attachment">Attachment</option>
                </select>
              </Field>
              <Field label="Category">
                <select
                  value={form.category_id}
                  onChange={(e) => set("category_id", e.target.value)}
                  className={input}
                >
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    placeholder="New category name…"
                    className={`${input} text-xs`}
                  />
                  <button
                    type="button"
                    onClick={addCategory}
                    className="font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-3 rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
              </Field>
            </div>
            <Field label="Short description">
              <textarea
                rows={2}
                value={form.short_description}
                onChange={(e) => set("short_description", e.target.value)}
                placeholder="One or two sentences shown on cards and previews."
                className={`${input} resize-y`}
              />
            </Field>
            <Field label="Full description">
              <MarkdownField
                value={form.full_description}
                onChange={(v) => set("full_description", v)}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Button text">
                <input
                  type="text"
                  value={form.button_text}
                  onChange={(e) => set("button_text", e.target.value)}
                  placeholder="Get a quote / Buy now"
                  className={input}
                />
              </Field>
              <Field label="Button URL">
                <input
                  type="text"
                  value={form.button_url}
                  onChange={(e) => set("button_url", e.target.value)}
                  placeholder="/contact or https://store…"
                  className={`${input} font-mono text-xs`}
                />
              </Field>
            </div>
          </>
        )}

        {/* ── Images ─────────────────────────────────────────────────── */}
        {tab === "Images" && (
          <>
            <Field label="Featured image URL">
              {form.featured_image && isValidUrl(form.featured_image) && (
                <img
                  src={form.featured_image}
                  alt=""
                  loading="lazy"
                  className="mb-2 w-full max-w-sm aspect-[16/9] object-cover rounded border border-theme-border/20"
                />
              )}
              <input
                type="text"
                value={form.featured_image}
                onChange={(e) => set("featured_image", e.target.value)}
                placeholder="https://… or /img/…"
                className={`${input} font-mono text-xs`}
              />
            </Field>
            <Field label="Gallery image URLs (one per line)">
              <textarea
                rows={8}
                value={galleryText}
                onChange={(e) =>
                  set(
                    "gallery",
                    e.target.value.split("\n").map((l) => l.trim())
                  )
                }
                placeholder={"/img/one.png\n/img/two.png"}
                className={`${input} font-mono text-xs resize-y`}
              />
              <p className="mt-1 font-googleSans text-[11px] text-theme-muted">
                {form.gallery.filter(Boolean).length} image(s).
              </p>
            </Field>
          </>
        )}

        {/* ── Specs ──────────────────────────────────────────────────── */}
        {tab === "Specs" && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Engine"><input className={input} value={form.engine} onChange={(e) => set("engine", e.target.value)} /></Field>
              <Field label="Horsepower"><input className={input} value={form.horsepower} onChange={(e) => set("horsepower", e.target.value)} /></Field>
              <Field label="Operating weight"><input className={input} value={form.operating_weight} onChange={(e) => set("operating_weight", e.target.value)} /></Field>
              <Field label="Lift capacity"><input className={input} value={form.lift_capacity} onChange={(e) => set("lift_capacity", e.target.value)} /></Field>
              <Field label="Digging depth"><input className={input} value={form.digging_depth} onChange={(e) => set("digging_depth", e.target.value)} /></Field>
              <Field label="Width"><input className={input} value={form.width} onChange={(e) => set("width", e.target.value)} /></Field>
              <Field label="Height"><input className={input} value={form.height} onChange={(e) => set("height", e.target.value)} /></Field>
              <Field label="Length"><input className={input} value={form.length} onChange={(e) => set("length", e.target.value)} /></Field>
              <Field label="Fuel type"><input className={input} value={form.fuel_type} onChange={(e) => set("fuel_type", e.target.value)} /></Field>
              <Field label="Machine type"><input className={input} value={form.machine_type} onChange={(e) => set("machine_type", e.target.value)} /></Field>
              <Field label="Condition"><input className={input} value={form.condition} onChange={(e) => set("condition", e.target.value)} placeholder="New / Used" /></Field>
              <Field label="Stock / availability"><input className={input} value={form.stock_status} onChange={(e) => set("stock_status", e.target.value)} placeholder="In stock / Made to order" /></Field>
            </div>
            <RowEditor
              label="Additional specs"
              rows={form.extra_specs}
              cols={["label", "value"]}
              placeholders={["Spec name", "Value"]}
              onChange={(rows) => set("extra_specs", rows as SpecRow[])}
              makeEmpty={() => ({ label: "", value: "" })}
            />
          </>
        )}

        {/* ── Pricing ────────────────────────────────────────────────── */}
        {tab === "Pricing" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Price"><input className={input} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="$6,508.95" /></Field>
            <Field label="Sale price"><input className={input} value={form.sale_price} onChange={(e) => set("sale_price", e.target.value)} placeholder="optional" /></Field>
            <Field label="SKU"><input className={input} value={form.sku} onChange={(e) => set("sku", e.target.value)} /></Field>
            <Field label="GTIN"><input className={input} value={form.gtin} onChange={(e) => set("gtin", e.target.value)} /></Field>
          </div>
        )}

        {/* ── Compatibility ──────────────────────────────────────────── */}
        {tab === "Compatibility" && (
          <>
            <RowEditor
              label="Compatible attachments"
              rows={form.compatible_attachments}
              cols={["name", "url"]}
              placeholders={["Attachment name", "Link (optional)"]}
              onChange={(rows) =>
                set("compatible_attachments", rows as { name: string; url: string }[])
              }
              makeEmpty={() => ({ name: "", url: "" })}
            />
            <Field label="Warranty info">
              <textarea rows={2} className={`${input} resize-y`} value={form.warranty_info} onChange={(e) => set("warranty_info", e.target.value)} />
            </Field>
            <Field label="Shipping info">
              <textarea rows={2} className={`${input} resize-y`} value={form.shipping_info} onChange={(e) => set("shipping_info", e.target.value)} />
            </Field>
            <Field label="Financing info">
              <textarea rows={2} className={`${input} resize-y`} value={form.financing_info} onChange={(e) => set("financing_info", e.target.value)} />
            </Field>
          </>
        )}

        {/* ── SEO ────────────────────────────────────────────────────── */}
        {tab === "SEO" && (
          <>
            <Field label="SEO title">
              <input className={input} value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} placeholder="Falls back to product name" />
            </Field>
            <Field label="SEO description">
              <textarea rows={3} className={`${input} resize-y`} value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} />
              <p className="mt-1 font-googleSans text-[11px] text-theme-muted">{form.seo_description.length} characters</p>
            </Field>
            <Field label="SEO keywords (comma-separated)">
              <input className={input} value={form.seo_keywords} onChange={(e) => set("seo_keywords", e.target.value)} />
            </Field>
          </>
        )}

        {/* ── Publish Settings ───────────────────────────────────────── */}
        {tab === "Publish Settings" && (
          <div className="bg-theme-card border border-theme-border/20 rounded p-5 space-y-4">
            <div>
              <p className="font-googleSans text-xs uppercase tracking-wider text-theme-accent mb-2">Current status</p>
              <StatusBadge status={form.status} />
              {form.published_at && form.status === "published" && (
                <p className="mt-2 font-glonimove text-xs text-theme-muted">
                  Published {new Date(form.published_at).toLocaleString()}
                </p>
              )}
            </div>
            <Field label="Sort order (lower shows first)">
              <input
                type="number"
                className={input}
                value={form.sort_order}
                onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
              />
            </Field>
            <div className="flex flex-wrap gap-2 pt-2">
              <button type="button" disabled={saving} onClick={() => save("draft")} className="font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-4 py-2.5 rounded transition-colors disabled:opacity-50">Save as draft</button>
              <button type="button" disabled={saving} onClick={() => save("publish")} className="font-googleSans text-xs font-bold uppercase tracking-wider bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white px-4 py-2.5 rounded transition-colors disabled:opacity-50">Publish</button>
              <button type="button" disabled={saving} onClick={() => save("hidden")} className="font-googleSans text-xs uppercase tracking-wider text-amber-300 border border-amber-600/40 hover:bg-amber-600/10 px-4 py-2.5 rounded transition-colors disabled:opacity-50">Hide from site</button>
            </div>
            <p className="font-glonimove text-xs text-theme-muted">
              Draft and hidden products never appear on the public website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── small shared bits ─────────────────────────────────────────────── */
const input =
  "w-full bg-theme-card border border-theme-border/20 focus:border-theme-accent rounded px-4 py-2.5 font-glonimove text-sm text-theme-text focus:outline-none transition-colors";
const inputXl =
  "w-full bg-theme-card border border-theme-border/20 focus:border-theme-accent rounded px-4 py-3 font-clofieBold text-xl text-theme-heading focus:outline-none transition-colors";

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({
  label,
  required,
  children,
}) => (
  <div>
    <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

/** Generic add/remove list editor for {col1, col2} rows. */
function RowEditor<T extends Record<string, string>>({
  label,
  rows,
  cols,
  placeholders,
  onChange,
  makeEmpty,
}: {
  label: string;
  rows: T[];
  cols: [keyof T & string, keyof T & string];
  placeholders: [string, string];
  onChange: (rows: T[]) => void;
  makeEmpty: () => T;
}) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={`${input} flex-1`}
              value={row[cols[0]]}
              placeholder={placeholders[0]}
              onChange={(e) => {
                const next = rows.slice();
                next[i] = { ...row, [cols[0]]: e.target.value };
                onChange(next);
              }}
            />
            <input
              className={`${input} flex-1`}
              value={row[cols[1]]}
              placeholder={placeholders[1]}
              onChange={(e) => {
                const next = rows.slice();
                next[i] = { ...row, [cols[1]]: e.target.value };
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(rows.filter((_, j) => j !== i))}
              aria-label="Remove row"
              className="px-3 rounded border border-theme-border/30 text-theme-muted hover:text-red-300 hover:border-red-400 transition-colors"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...rows, makeEmpty()])}
          className="font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-3 py-2 rounded transition-colors"
        >
          + Add row
        </button>
      </div>
    </Field>
  );
}

const StatusBadge: React.FC<{ status: ProductStatus }> = ({ status }) => {
  const styles: Record<ProductStatus, string> = {
    published: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
    draft: "bg-yellow-500/10 text-yellow-200 border-yellow-500/40",
    hidden: "bg-amber-600/10 text-amber-300 border-amber-600/40",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full font-googleSans text-[11px] uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
};

const statusMessage = (s: ProductStatus): string =>
  s === "published"
    ? "Published — it's live now."
    : s === "hidden"
    ? "Saved and hidden from the site."
    : "Draft saved.";

const humanizeError = (msg: string): string => {
  if (/duplicate key|unique/i.test(msg) && /slug/i.test(msg))
    return "That slug is already in use. Choose a different one.";
  return msg;
};

export default ProductEditor;
