/**
 * Product sync — dashboard data layer.
 *
 * Two concerns live here:
 *   1. CRUD/reads against the sync tables (connected_websites, overrides,
 *      sync_logs, website_product_sync, sync_settings) via the admin Supabase
 *      session. RLS restricts every one of these to admins.
 *   2. `callSync()` — invokes the server-side `product-sync` Edge Function with
 *      the logged-in admin's access token. The function holds the secrets and
 *      does the actual pushing; the browser never sees site tokens at push time.
 *
 * Mirrors db/migrations/0006_product_sync.sql.
 */
import { supabase, supabaseConfigured } from "./supabase";

const client = () => {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
};

/* ── types ─────────────────────────────────────────────────────────────── */
export type SyncType = "full" | "price" | "images" | "descriptions";
export type SyncState = "pending" | "success" | "failed";
export type WebsiteStatus = "success" | "partial" | "failed" | null;

export interface ConnectedWebsite {
  id: string;
  name: string;
  domain: string;
  sync_endpoint: string;
  secret_token: string;
  platform: string;
  active: boolean;
  last_sync_at: string | null;
  last_status: WebsiteStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type WebsiteInput = Partial<
  Omit<ConnectedWebsite, "id" | "created_at" | "updated_at">
> & { name: string; domain: string; sync_endpoint: string };

export interface WebsiteProductOverride {
  id: string;
  website_id: string;
  product_id: string;
  enabled: boolean;
  price: string | null;
  sale_price: string | null;
  title: string | null;
  short_description: string | null;
  full_description: string | null;
  featured_image: string | null;
  status: string | null;
  button_url: string | null;
  created_at: string;
  updated_at: string;
}

export const OVERRIDE_FIELDS = [
  "price",
  "sale_price",
  "title",
  "featured_image",
  "status",
  "button_url",
  "short_description",
  "full_description",
] as const;
export type OverrideField = (typeof OVERRIDE_FIELDS)[number];

export interface WebsiteProductSync {
  id: string;
  website_id: string;
  product_id: string;
  status: SyncState;
  last_synced_at: string | null;
  last_synced_hash: string | null;
  last_error: string | null;
  retry_count: number;
}

export interface SyncLog {
  id: string;
  website_id: string | null;
  product_id: string | null;
  website_name: string | null;
  product_name: string | null;
  product_sku: string | null;
  sync_type: SyncType;
  status: SyncState;
  error: string | null;
  retry_count: number;
  created_at: string;
  finished_at: string | null;
}

export interface SyncSettings {
  id: number;
  batch_size: number;
  concurrency: number;
  request_timeout_s: number;
  compress_images: boolean;
  updated_at: string;
}

export interface SyncResult {
  ok: boolean;
  success: number;
  failed: number;
  skipped?: number;
  message?: string;
  error?: string;
  results?: Array<{
    website: string;
    product: string;
    ok: boolean;
    error?: string | null;
    images?: string[];
  }>;
}

/* ── connected websites ────────────────────────────────────────────────── */
export const listWebsites = async (): Promise<ConnectedWebsite[]> => {
  const { data, error } = await client()
    .from("connected_websites")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ConnectedWebsite[];
};

export const createWebsite = async (input: WebsiteInput): Promise<ConnectedWebsite> => {
  const { data, error } = await client()
    .from("connected_websites")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as ConnectedWebsite;
};

export const updateWebsite = async (
  id: string,
  patch: Partial<WebsiteInput>
): Promise<ConnectedWebsite> => {
  const { data, error } = await client()
    .from("connected_websites")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as ConnectedWebsite;
};

export const deleteWebsite = async (id: string): Promise<void> => {
  const { error } = await client().from("connected_websites").delete().eq("id", id);
  if (error) throw error;
};

/* ── overrides ─────────────────────────────────────────────────────────── */
export const listOverridesForWebsite = async (
  websiteId: string
): Promise<WebsiteProductOverride[]> => {
  const { data, error } = await client()
    .from("website_product_overrides")
    .select("*")
    .eq("website_id", websiteId);
  if (error) throw error;
  return (data ?? []) as WebsiteProductOverride[];
};

export const upsertOverride = async (
  override: Partial<WebsiteProductOverride> & { website_id: string; product_id: string }
): Promise<WebsiteProductOverride> => {
  const { data, error } = await client()
    .from("website_product_overrides")
    .upsert(override, { onConflict: "website_id,product_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data as WebsiteProductOverride;
};

export const deleteOverride = async (id: string): Promise<void> => {
  const { error } = await client().from("website_product_overrides").delete().eq("id", id);
  if (error) throw error;
};

/* ── sync state ────────────────────────────────────────────────────────── */
export const listSyncState = async (): Promise<WebsiteProductSync[]> => {
  const { data, error } = await client().from("website_product_sync").select("*");
  if (error) throw error;
  return (data ?? []) as WebsiteProductSync[];
};

/* ── logs ──────────────────────────────────────────────────────────────── */
export const listSyncLogs = async (limit = 200): Promise<SyncLog[]> => {
  const { data, error } = await client()
    .from("sync_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as SyncLog[];
};

export const clearSyncLogs = async (): Promise<void> => {
  // delete all rows (admin only via RLS)
  const { error } = await client()
    .from("sync_logs")
    .delete()
    .not("id", "is", null);
  if (error) throw error;
};

/* ── settings ──────────────────────────────────────────────────────────── */
export const getSyncSettings = async (): Promise<SyncSettings | null> => {
  const { data, error } = await client()
    .from("sync_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return (data as SyncSettings) ?? null;
};

export const updateSyncSettings = async (
  patch: Partial<Omit<SyncSettings, "id" | "updated_at">>
): Promise<SyncSettings> => {
  const { data, error } = await client()
    .from("sync_settings")
    .update(patch)
    .eq("id", 1)
    .select("*")
    .single();
  if (error) throw error;
  return data as SyncSettings;
};

/* ── the orchestrator call ─────────────────────────────────────────────── */
export interface SyncArgs {
  action?: "sync" | "retry-failed" | "test-connection";
  productIds?: string[] | "all";
  websiteIds?: string[] | "all";
  syncType?: SyncType;
  force?: boolean;
  websiteId?: string;
  productId?: string;
}

/** Low-level invoker for the product-sync Edge Function. */
const invokeSync = async <T,>(payload: Record<string, unknown>): Promise<T> => {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured.");
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) throw new Error("You must be signed in to sync.");

  const baseUrl = (import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/, "");
  const res = await fetch(`${baseUrl}/functions/v1/product-sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    },
    body: JSON.stringify(payload),
  });

  let body: T & { error?: string };
  try {
    body = (await res.json()) as T & { error?: string };
  } catch {
    throw new Error(
      `Sync function returned a non-JSON response (HTTP ${res.status}). ` +
        `Is the product-sync Edge Function deployed?`
    );
  }
  if (!res.ok) {
    throw new Error(body?.error || `Sync failed (HTTP ${res.status}).`);
  }
  return body;
};

/** Push products to websites (or retry failures). */
export const callSync = (args: SyncArgs): Promise<SyncResult> =>
  invokeSync<SyncResult>({ action: "sync", ...args });

export interface TestConnectionResult {
  ok: boolean;
  status: number;
  error?: string;
  response?: {
    ok?: boolean;
    version?: string;
    product_count?: number;
    writable?: boolean;
    [k: string]: unknown;
  } | null;
}

export const testConnection = (websiteId: string): Promise<TestConnectionResult> =>
  invokeSync<TestConnectionResult>({ action: "test-connection", websiteId });
