/**
 * Sync Center — the operational hub.
 *
 * Shows what's waiting to sync, what recently synced, and what failed across all
 * websites; runs batch syncs (all products → all sites) with live progress; and
 * retries failures. Numbers are derived cheaply from products + sync state +
 * recent logs, so it doesn't hammer Supabase.
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DbProduct } from "../../lib/supabase";
import { listAllProducts } from "../../lib/adminProducts";
import {
  ConnectedWebsite,
  SyncLog,
  SyncResult,
  WebsiteProductSync,
  callSync,
  listSyncLogs,
  listSyncState,
  listWebsites,
} from "../../lib/sync";
import {
  Card,
  Pill,
  Toast,
  btnGhost,
  btnPrimary,
  formatDateTime,
} from "../../components/admin/ui";

const Stat: React.FC<{ label: string; value: number | string; tone?: string }> = ({
  label,
  value,
  tone = "text-theme-heading",
}) => (
  <Card className="p-5">
    <p className={`font-clofieBold text-3xl ${tone}`}>{value}</p>
    <p className="mt-1 font-googleSans text-[11px] uppercase tracking-wider text-theme-muted">
      {label}
    </p>
  </Card>
);

export const SyncCenter: React.FC = () => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [websites, setWebsites] = useState<ConnectedWebsite[]>([]);
  const [state, setState] = useState<WebsiteProductSync[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [running, setRunning] = useState<null | string>(null);
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, w, s, l] = await Promise.all([
        listAllProducts(),
        listWebsites(),
        listSyncState(),
        listSyncLogs(50),
      ]);
      setProducts(p);
      setWebsites(w);
      setState(s);
      setLogs(l);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeSites = useMemo(() => websites.filter((w) => w.active), [websites]);

  // For each active website × published product, classify as waiting/synced/failed.
  const metrics = useMemo(() => {
    const stateMap = new Map(state.map((s) => [`${s.website_id}:${s.product_id}`, s]));
    let waiting = 0;
    let synced = 0;
    let failed = 0;
    const syncable = products.filter((p) => p.status !== "draft");
    for (const w of activeSites) {
      for (const p of syncable) {
        const st = stateMap.get(`${w.id}:${p.id}`);
        if (!st || st.status === "pending") {
          waiting++;
        } else if (st.status === "failed") {
          failed++;
        } else {
          // success — but stale if the product changed since last sync
          const stale =
            st.last_synced_at && new Date(p.updated_at) > new Date(st.last_synced_at);
          if (stale) waiting++;
          else synced++;
        }
      }
    }
    return { waiting, synced, failed, pairs: activeSites.length * syncable.length };
  }, [products, activeSites, state]);

  const recent = useMemo(() => logs.slice(0, 12), [logs]);
  const failures = useMemo(() => logs.filter((l) => l.status === "failed").slice(0, 12), [logs]);

  const runSync = async (label: string, fn: () => Promise<SyncResult>) => {
    setRunning(label);
    setLastResult(null);
    try {
      const r = await fn();
      setLastResult(r);
      flash(
        `${label}: ${r.success} ok · ${r.failed} failed` +
          (typeof r.skipped === "number" ? ` · ${r.skipped} unchanged` : "")
      );
      await load();
    } catch (e) {
      flash(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setRunning(null);
    }
  };

  const syncAll = () =>
    runSync("Sync all", () =>
      callSync({ productIds: "all", websiteIds: "all", syncType: "full" })
    );

  const retryFailed = () =>
    runSync("Retry failed", () => callSync({ action: "retry-failed" }));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-clofieBold text-3xl md:text-4xl text-theme-heading">Sync Center</h1>
          <p className="mt-2 font-glonimove text-sm text-theme-muted">
            {activeSites.length} active website{activeSites.length === 1 ? "" : "s"} ·{" "}
            {products.length} products
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} className={btnGhost} disabled={!!running}>
            Refresh
          </button>
          <button
            type="button"
            onClick={retryFailed}
            className={btnGhost}
            disabled={!!running || metrics.failed === 0}
          >
            {running === "Retry failed" ? "Retrying…" : "Retry failed"}
          </button>
          <button
            type="button"
            onClick={syncAll}
            className={btnPrimary}
            disabled={!!running || activeSites.length === 0}
          >
            {running === "Sync all" ? "Syncing…" : "Sync all → all sites"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-200">
          {error}
        </div>
      )}

      {running && (
        <div className="mb-6 p-4 border border-theme-accent/40 bg-theme-accent/5 rounded flex items-center gap-3">
          <span className="h-4 w-4 border-2 border-theme-accent border-t-transparent rounded-full animate-spin" />
          <span className="font-glonimove text-sm text-theme-text">
            {running} in progress… this runs server-side in batches; you can wait here.
          </span>
        </div>
      )}

      {lastResult && !running && (
        <div className="mb-6 p-4 border border-theme-border/30 bg-theme-bg/40 rounded font-glonimove text-sm text-theme-text">
          Last run: <span className="text-emerald-300">{lastResult.success} succeeded</span> ·{" "}
          <span className={lastResult.failed ? "text-red-300" : "text-theme-muted"}>
            {lastResult.failed} failed
          </span>
          {typeof lastResult.skipped === "number" && ` · ${lastResult.skipped} unchanged`}
        </div>
      )}

      {/* metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Waiting to sync" value={loading ? "—" : metrics.waiting} tone="text-blue-300" />
        <Stat label="Synced & current" value={loading ? "—" : metrics.synced} tone="text-emerald-300" />
        <Stat label="Failed" value={loading ? "—" : metrics.failed} tone="text-red-300" />
        <Stat label="Active websites" value={loading ? "—" : activeSites.length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* per-website status */}
        <Card className="p-5">
          <h2 className="font-clofieBold text-lg text-theme-heading mb-4">Website status</h2>
          {activeSites.length === 0 ? (
            <p className="font-glonimove text-sm text-theme-muted">No active websites.</p>
          ) : (
            <ul className="space-y-3">
              {websites.map((w) => (
                <li key={w.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-clofieBold text-sm text-theme-heading truncate">{w.name}</p>
                    <p className="font-mono text-[11px] text-theme-muted truncate">{w.domain}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-googleSans text-[11px] text-theme-muted">
                      {formatDateTime(w.last_sync_at)}
                    </span>
                    <Pill value={w.active ? w.last_status ?? "pending" : "inactive"} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* recently synced */}
        <Card className="p-5">
          <h2 className="font-clofieBold text-lg text-theme-heading mb-4">Recent activity</h2>
          {recent.length === 0 ? (
            <p className="font-glonimove text-sm text-theme-muted">No syncs yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {recent.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-glonimove text-sm text-theme-text truncate">
                      {l.product_name ?? "—"}{" "}
                      <span className="text-theme-muted">→ {l.website_name ?? "—"}</span>
                    </p>
                    <p className="font-googleSans text-[10px] uppercase tracking-wider text-theme-muted">
                      {l.sync_type} · {formatDateTime(l.created_at)}
                    </p>
                  </div>
                  <Pill value={l.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* failures */}
      {failures.length > 0 && (
        <Card className="p-5 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-clofieBold text-lg text-theme-heading">Recent failures</h2>
            <button type="button" onClick={retryFailed} className={btnGhost} disabled={!!running}>
              Retry failed
            </button>
          </div>
          <ul className="space-y-2.5">
            {failures.map((l) => (
              <li
                key={l.id}
                className="flex items-start justify-between gap-3 border-b border-theme-border/10 pb-2.5"
              >
                <div className="min-w-0">
                  <p className="font-glonimove text-sm text-theme-text truncate">
                    {l.product_name ?? "—"}{" "}
                    <span className="text-theme-muted">→ {l.website_name ?? "—"}</span>
                  </p>
                  <p className="font-glonimove text-[12px] text-red-200">{l.error}</p>
                </div>
                <span className="font-googleSans text-[10px] uppercase tracking-wider text-theme-muted shrink-0">
                  {formatDateTime(l.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Toast message={toast} />
    </div>
  );
};

export default SyncCenter;
