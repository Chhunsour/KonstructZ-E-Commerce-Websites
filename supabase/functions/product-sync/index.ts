// ────────────────────────────────────────────────────────────────────────────
//  product-sync — the sync orchestrator (Supabase Edge Function, Deno runtime)
//
//  The admin dashboard is a static SPA and cannot securely reach external sites
//  (CORS + would leak per-site secrets into the browser). This function runs
//  server-side with the service role key, so it can:
//    • read products + per-site secret tokens                (service role)
//    • apply per-website overrides and skip unchanged products (hash)
//    • POST batched payloads to each site's receiver, with the secret header
//    • record sync_logs + website_product_sync state
//
//  Auth: the caller must pass a logged-in admin's access token in the
//  Authorization header. We verify the user and confirm the email is in
//  public.admins. Anonymous/non-admin callers are rejected.
//
//  Deploy once with the Supabase CLI:
//    supabase functions deploy product-sync
//  (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.)
// ────────────────────────────────────────────────────────────────────────────
import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

/* ── types ─────────────────────────────────────────────────────────────── */
type SyncType = "full" | "price" | "images" | "descriptions";

interface SyncRequest {
  action: "sync" | "retry-failed" | "test-connection";
  productIds?: string[] | "all";
  websiteIds?: string[] | "all";
  syncType?: SyncType;
  force?: boolean;
  websiteId?: string; // test-connection / scoped retry
  productId?: string; // scoped retry
}

interface Website {
  id: string;
  name: string;
  domain: string;
  sync_endpoint: string;
  secret_token: string;
  active: boolean;
}

/* ── stable hash for change detection ──────────────────────────────────── */
const stableStringify = (v: unknown): string => {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(",")}]`;
  const obj = v as Record<string, unknown>;
  return `{${Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
    .join(",")}}`;
};

const sha256 = async (s: string): Promise<string> => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

/* ── build the per-website payload, applying overrides ─────────────────── */
// deno-lint-ignore no-explicit-any
const buildPayload = (product: any, override: any, force: boolean) => {
  const pick = (field: string, master: unknown) =>
    !force && override && override[field] != null && override[field] !== ""
      ? override[field]
      : master;

  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: pick("title", product.name),
    brand: product.brand,
    category: product.category?.name ?? null,
    category_slug: product.category?.slug ?? null,
    product_line: product.product_line,
    product_type: product.product_type,
    short_description: pick("short_description", product.short_description),
    full_description: pick("full_description", product.full_description),
    price: pick("price", product.price),
    sale_price: pick("sale_price", product.sale_price),
    stock_status: product.stock_status,
    condition: product.condition,
    status: pick("status", product.status),
    featured_image: pick("featured_image", product.featured_image),
    gallery_images: product.gallery_images ?? [],
    specs: {
      engine: product.engine,
      horsepower: product.horsepower,
      operating_weight: product.operating_weight,
      lift_capacity: product.lift_capacity,
      digging_depth: product.digging_depth,
      width: product.width,
      height: product.height,
      length: product.length,
      fuel_type: product.fuel_type,
      machine_type: product.machine_type,
    },
    extra_specs: product.extra_specs ?? [],
    compatible_attachments: product.compatible_attachments ?? [],
    related_products: product.compatible_attachments ?? [],
    warranty_info: product.warranty_info,
    shipping_info: product.shipping_info,
    financing_info: product.financing_info,
    button_text: product.button_text,
    button_url: pick("button_url", product.button_url),
    seo_title: product.seo_title,
    seo_description: product.seo_description,
    seo_keywords: product.seo_keywords,
    updated_at: product.updated_at,
  };
};

// Reduce a full payload down to a single sync category. The receiver merges
// partial payloads into the existing local product, so unrelated fields stay.
// deno-lint-ignore no-explicit-any
const narrowPayload = (full: any, type: SyncType) => {
  if (type === "full") return full;
  const base = { id: full.id, slug: full.slug, sku: full.sku };
  if (type === "price")
    return { ...base, price: full.price, sale_price: full.sale_price, stock_status: full.stock_status };
  if (type === "images")
    return { ...base, featured_image: full.featured_image, gallery_images: full.gallery_images };
  if (type === "descriptions")
    return {
      ...base,
      short_description: full.short_description,
      full_description: full.full_description,
      name: full.name,
    };
  return full;
};

/* ── post a batch to one website's receiver ────────────────────────────── */
const postBatch = async (
  site: Website,
  type: SyncType,
  force: boolean,
  // deno-lint-ignore no-explicit-any
  products: any[],
  timeoutMs: number
): Promise<{ ok: boolean; status: number; body: any; error?: string }> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(site.sync_endpoint, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", "X-Sync-Token": site.secret_token },
      body: JSON.stringify({ action: "sync", type, force, products }),
    });
    const text = await res.text();
    let body: unknown = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { raw: text.slice(0, 500) };
    }
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      body: null,
      error: e instanceof Error ? e.message : String(e),
    };
  } finally {
    clearTimeout(timer);
  }
};

/* ── run with limited concurrency ──────────────────────────────────────── */
async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  const workers = new Array(Math.min(limit, items.length || 1)).fill(0).map(async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/* ── entry ─────────────────────────────────────────────────────────────── */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin: SupabaseClient = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  // ── verify the caller is a logged-in admin ──
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Missing Authorization token." }, 401);

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  const email = userData?.user?.email ?? null;
  if (userErr || !email) return json({ error: "Invalid session." }, 401);

  const { data: adminRow } = await admin
    .from("admins")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  if (!adminRow) return json({ error: "Not authorized (admin only)." }, 403);

  let body: SyncRequest;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  // ── settings ──
  const { data: settings } = await admin.from("sync_settings").select("*").eq("id", 1).maybeSingle();
  const batchSize = settings?.batch_size ?? 5;
  const concurrency = settings?.concurrency ?? 3;
  const timeoutMs = (settings?.request_timeout_s ?? 60) * 1000;

  /* ── action: test-connection ──────────────────────────────────────── */
  if (body.action === "test-connection") {
    if (!body.websiteId) return json({ error: "websiteId required." }, 400);
    const { data: site } = await admin
      .from("connected_websites")
      .select("*")
      .eq("id", body.websiteId)
      .maybeSingle();
    if (!site) return json({ error: "Website not found." }, 404);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(site.sync_endpoint, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", "X-Sync-Token": site.secret_token },
        body: JSON.stringify({ action: "ping" }),
      });
      const text = await res.text();
      let parsed: unknown = null;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch {
        parsed = { raw: text.slice(0, 300) };
      }
      return json({ ok: res.ok, status: res.status, response: parsed });
    } catch (e) {
      return json({ ok: false, status: 0, error: e instanceof Error ? e.message : String(e) });
    } finally {
      clearTimeout(timer);
    }
  }

  // ── resolve target websites ──
  let websiteIds = body.websiteIds;
  if (body.action === "retry-failed" && body.websiteId) websiteIds = [body.websiteId];

  let wq = admin.from("connected_websites").select("*").eq("active", true);
  if (Array.isArray(websiteIds)) wq = wq.in("id", websiteIds);
  const { data: sites, error: sitesErr } = await wq;
  if (sitesErr) return json({ error: sitesErr.message }, 500);
  if (!sites || sites.length === 0) return json({ error: "No active websites to sync." }, 400);

  const syncType: SyncType = body.syncType ?? "full";

  /* ── action: retry-failed → derive product set from failed state ──── */
  let productIds = body.productIds;
  if (body.action === "retry-failed") {
    let fq = admin.from("website_product_sync").select("product_id,website_id").eq("status", "failed");
    if (body.websiteId) fq = fq.eq("website_id", body.websiteId);
    if (body.productId) fq = fq.eq("product_id", body.productId);
    const { data: failed } = await fq;
    productIds = [...new Set((failed ?? []).map((r) => r.product_id))];
    if (productIds.length === 0) return json({ ok: true, message: "Nothing to retry.", success: 0, failed: 0, results: [] });
  }

  // ── load products ──
  let pq = admin.from("products").select("*,category:product_categories(slug,name)");
  if (Array.isArray(productIds)) pq = pq.in("id", productIds);
  const { data: products, error: prodErr } = await pq;
  if (prodErr) return json({ error: prodErr.message }, 500);
  if (!products || products.length === 0) return json({ error: "No products found to sync." }, 400);

  const force = Boolean(body.force);

  // ── overrides + last sync state for these (websites × products) ──
  const siteIdList = sites.map((s) => s.id);
  const prodIdList = products.map((p) => p.id);
  const [{ data: overrides }, { data: states }] = await Promise.all([
    admin.from("website_product_overrides").select("*").in("website_id", siteIdList).in("product_id", prodIdList),
    admin.from("website_product_sync").select("*").in("website_id", siteIdList).in("product_id", prodIdList),
  ]);
  const ovKey = (w: string, p: string) => `${w}:${p}`;
  const ovMap = new Map((overrides ?? []).map((o) => [ovKey(o.website_id, o.product_id), o]));
  const stMap = new Map((states ?? []).map((s) => [ovKey(s.website_id, s.product_id), s]));

  let successCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  // deno-lint-ignore no-explicit-any
  const logRows: any[] = [];
  // deno-lint-ignore no-explicit-any
  const stateUpserts: any[] = [];
  // deno-lint-ignore no-explicit-any
  const results: any[] = [];

  // ── process each website (concurrency-limited) ──
  await pool(sites as Website[], concurrency, async (site) => {
    // Build per-product payloads for this site, skipping unchanged + disabled.
    // deno-lint-ignore no-explicit-any
    const toSend: { product: any; payload: any; hash: string }[] = [];
    for (const product of products) {
      const ov = ovMap.get(ovKey(site.id, product.id));
      if (ov && ov.enabled === false) {
        skippedCount++;
        continue;
      }
      const fullPayload = buildPayload(product, ov, force);
      const payload = narrowPayload(fullPayload, syncType);
      const hash = await sha256(stableStringify(fullPayload) + `|${syncType}`);
      const prev = stMap.get(ovKey(site.id, product.id));
      // Skip only on a clean, unchanged FULL sync that already succeeded.
      if (!force && syncType === "full" && prev?.status === "success" && prev.last_synced_hash === hash) {
        skippedCount++;
        continue;
      }
      toSend.push({ product, payload, hash });
    }

    if (toSend.length === 0) return;

    let siteHadFailure = false;
    let siteHadSuccess = false;

    for (const group of chunk(toSend, batchSize)) {
      const res = await postBatch(site, syncType, force, group.map((g) => g.payload), timeoutMs);
      // Map receiver per-product results back by slug/id when available.
      // deno-lint-ignore no-explicit-any
      const perProduct: Record<string, any> = {};
      if (res.ok && res.body && Array.isArray(res.body.results)) {
        for (const r of res.body.results) perProduct[r.slug ?? r.id] = r;
      }

      for (const g of group) {
        const pr = perProduct[g.payload.slug] ?? perProduct[g.payload.id];
        const ok = res.ok && (pr ? pr.ok !== false : true);
        const errMsg = !res.ok
          ? res.error ?? `Receiver returned HTTP ${res.status}` +
            (res.body?.error ? `: ${res.body.error}` : "")
          : pr && pr.ok === false
          ? pr.error ?? "Receiver rejected product"
          : null;

        const prev = stMap.get(ovKey(site.id, g.product.id));
        if (ok) {
          successCount++;
          siteHadSuccess = true;
        } else {
          failedCount++;
          siteHadFailure = true;
        }

        const now = new Date().toISOString();
        logRows.push({
          website_id: site.id,
          product_id: g.product.id,
          website_name: site.name,
          product_name: g.product.name,
          product_sku: g.product.sku,
          sync_type: syncType,
          status: ok ? "success" : "failed",
          error: errMsg,
          retry_count: prev?.retry_count ?? 0,
          finished_at: now,
        });
        stateUpserts.push({
          website_id: site.id,
          product_id: g.product.id,
          status: ok ? "success" : "failed",
          last_synced_at: ok ? now : prev?.last_synced_at ?? null,
          // Only advance the stored hash on success so a fix re-syncs next time.
          last_synced_hash: ok ? g.hash : prev?.last_synced_hash ?? null,
          last_error: errMsg,
          retry_count: ok ? prev?.retry_count ?? 0 : (prev?.retry_count ?? 0) + 1,
        });
        results.push({
          website: site.name,
          product: g.product.name,
          ok,
          error: errMsg,
          images: pr?.images ?? undefined,
        });
      }
    }

    await admin
      .from("connected_websites")
      .update({
        last_sync_at: new Date().toISOString(),
        last_status: siteHadFailure ? (siteHadSuccess ? "partial" : "failed") : "success",
      })
      .eq("id", site.id);
  });

  // ── persist logs + state (upsert on the unique pair) ──
  if (logRows.length) await admin.from("sync_logs").insert(logRows);
  if (stateUpserts.length)
    await admin.from("website_product_sync").upsert(stateUpserts, { onConflict: "website_id,product_id" });

  return json({
    ok: failedCount === 0,
    success: successCount,
    failed: failedCount,
    skipped: skippedCount,
    results,
  });
});
