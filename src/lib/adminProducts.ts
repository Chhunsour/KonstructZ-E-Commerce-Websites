/**
 * Admin product CRUD — used by the dashboard table and the product editor.
 *
 * Every write goes through Supabase with row-level security: only a session
 * whose email is in `public.admins` (i.e. `is_admin()` is true) can insert,
 * update or delete. `full_description` is sanitized on save so stored content
 * is always safe to render.
 */
import {
  DbProduct,
  DbProductCategory,
  ProductInput,
  ProductStatus,
  supabase,
} from "./supabase";
import { sanitizeHtml } from "./sanitizeHtml";

const client = () => {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
};

const currentEmail = async (): Promise<string | null> => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
};

/** Clean the editable payload before it hits the DB. */
const prepare = (input: ProductInput): ProductInput => {
  const out: ProductInput = { ...input };
  if (typeof out.full_description === "string") {
    out.full_description = sanitizeHtml(out.full_description);
  }
  if (typeof out.slug === "string") out.slug = out.slug.trim();
  if (typeof out.name === "string") out.name = out.name.trim();
  return out;
};

/** Admin list — every product (drafts/hidden included), newest activity first. */
export const listAllProducts = async (): Promise<DbProduct[]> => {
  const { data, error } = await client()
    .from("products")
    .select("*,category:product_categories(slug,name)")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as DbProduct[];
};

export const getProduct = async (id: string): Promise<DbProduct | null> => {
  const { data, error } = await client()
    .from("products")
    .select("*,category:product_categories(slug,name)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as DbProduct) ?? null;
};

export const createProduct = async (input: ProductInput): Promise<DbProduct> => {
  const email = await currentEmail();
  const payload = prepare(input);
  if (payload.status === "published" && !payload.published_at) {
    payload.published_at = new Date().toISOString();
  }
  const { data, error } = await client()
    .from("products")
    .insert({ ...payload, created_by: email, updated_by: email })
    .select("*")
    .single();
  if (error) throw error;
  return data as unknown as DbProduct;
};

export const updateProduct = async (
  id: string,
  input: ProductInput
): Promise<DbProduct> => {
  const email = await currentEmail();
  const payload = prepare(input);
  if (payload.status === "published" && !payload.published_at) {
    payload.published_at = new Date().toISOString();
  }
  const { data, error } = await client()
    .from("products")
    .update({ ...payload, updated_by: email })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as unknown as DbProduct;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await client().from("products").delete().eq("id", id);
  if (error) throw error;
};

/** Publish/unpublish/hide. Stamps published_at the first time it goes live. */
export const setProductStatus = async (
  id: string,
  status: ProductStatus,
  hasPublishedAt: boolean
): Promise<void> => {
  const email = await currentEmail();
  const patch: ProductInput = { status, updated_by: email };
  if (status === "published" && !hasPublishedAt) {
    patch.published_at = new Date().toISOString();
  }
  const { error } = await client().from("products").update(patch).eq("id", id);
  if (error) throw error;
};

/** Duplicate a product as a fresh draft with a unique slug. */
export const duplicateProduct = async (id: string): Promise<DbProduct> => {
  const source = await getProduct(id);
  if (!source) throw new Error("Product not found.");
  const {
    id: _id,
    created_at: _c,
    updated_at: _u,
    published_at: _p,
    category: _cat,
    ...rest
  } = source;
  const copy: ProductInput = {
    ...rest,
    name: `${source.name} (copy)`,
    slug: `${source.slug}-copy-${Date.now().toString(36)}`,
    status: "draft",
    published_at: null,
  };
  return createProduct(copy);
};

/* ── categories ────────────────────────────────────────────────────────── */

export const listCategories = async (): Promise<DbProductCategory[]> => {
  const { data, error } = await client()
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DbProductCategory[];
};

export const upsertCategory = async (
  cat: Partial<DbProductCategory> & { slug: string; name: string }
): Promise<DbProductCategory> => {
  const { data, error } = await client()
    .from("product_categories")
    .upsert(cat, { onConflict: "slug" })
    .select("*")
    .single();
  if (error) throw error;
  return data as DbProductCategory;
};

/** True if `slug` is already used by a different product. */
export const slugTaken = async (
  slug: string,
  exceptId?: string
): Promise<boolean> => {
  let q = client().from("products").select("id").eq("slug", slug);
  if (exceptId) q = q.neq("id", exceptId);
  const { data, error } = await q;
  if (error) throw error;
  return (data?.length ?? 0) > 0;
};
