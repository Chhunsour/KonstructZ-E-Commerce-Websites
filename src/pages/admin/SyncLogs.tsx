/**
 * Sync Logs — detailed, filterable history of every sync attempt.
 * Covers the "Sync Logs" and "Failed Syncs" requirements (filter = failed).
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SyncLog,
  SyncState,
  SyncType,
  callSync,
  clearSyncLogs,
  listSyncLogs,
} from "../../lib/sync";
import { Card, Pill, Toast, btnGhost, formatDateTime } from "../../components/admin/ui";

const STATUSES: ("all" | SyncState)[] = ["all", "success", "failed", "pending"];
const TYPES: ("all" | SyncType)[] = ["all", "full", "price", "images", "descriptions"];

export const SyncLogs: React.FC = () => {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | SyncState>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | SyncType>("all");
  const [query, setQuery] = useState("");
  const [retrying, setRetrying] = useState<string | null>(null);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLogs(await listSyncLogs(300));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return logs.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (typeFilter !== "all" && l.sync_type !== typeFilter) return false;
      if (q) {
        const hay = `${l.product_name ?? ""} ${l.product_sku ?? ""} ${l.website_name ?? ""} ${
          l.error ?? ""
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [logs, statusFilter, typeFilter, query]);

  const retryOne = async (l: SyncLog) => {
    if (!l.website_id || !l.product_id) return;
    setRetrying(l.id);
    try {
      const r = await callSync({
        action: "retry-failed",
        websiteId: l.website_id,
        productId: l.product_id,
      });
      flash(`Retry: ${r.success} ok · ${r.failed} failed`);
      await load();
    } catch (e) {
      flash(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setRetrying(null);
    }
  };

  const clearAll = async () => {
    if (!confirm("Clear all sync logs? History cannot be recovered.")) return;
    try {
      await clearSyncLogs();
      setLogs([]);
      flash("Logs cleared.");
    } catch (e) {
      flash(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const counts = useMemo(
    () => ({
      total: logs.length,
      success: logs.filter((l) => l.status === "success").length,
      failed: logs.filter((l) => l.status === "failed").length,
    }),
    [logs]
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-clofieBold text-3xl md:text-4xl text-theme-heading">Sync Logs</h1>
          <p className="mt-2 font-glonimove text-sm text-theme-muted">
            {counts.total} entries · {counts.success} success · {counts.failed} failed
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} className={btnGhost}>
            Refresh
          </button>
          <button type="button" onClick={clearAll} className={btnGhost}>
            Clear logs
          </button>
        </div>
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1 bg-theme-card border border-theme-border/20 rounded p-1">
          {STATUSES.map((f) => (
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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "all" | SyncType)}
          className="bg-theme-card border border-theme-border/20 rounded px-3 py-2 font-googleSans text-xs uppercase tracking-wider text-theme-text focus:outline-none focus:border-theme-accent"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All types" : t}
            </option>
          ))}
        </select>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search product, SKU, website or error…"
          className="flex-1 min-w-[200px] bg-theme-card border border-theme-border/20 rounded px-4 py-2 font-googleSans text-sm text-theme-text focus:outline-none focus:border-theme-accent"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-200">
          {error}
        </div>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-glonimove text-theme-muted">Loading logs…</div>
        ) : visible.length === 0 ? (
          <div className="p-12 text-center font-glonimove text-theme-muted">
            No log entries match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead>
                <tr className="border-b border-theme-border/20 bg-theme-bg/40">
                  {["Product / SKU", "Website", "Type", "Status", "Error", "Created", "Finished", ""].map(
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
                {visible.map((l) => (
                  <tr key={l.id} className="hover:bg-theme-bg/40 transition-colors align-top">
                    <td className="px-4 py-3">
                      <p className="font-clofieBold text-sm text-theme-heading">
                        {l.product_name ?? "—"}
                      </p>
                      {l.product_sku && (
                        <p className="font-mono text-[11px] text-theme-muted">{l.product_sku}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-googleSans text-xs text-theme-muted whitespace-nowrap">
                      {l.website_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-googleSans text-[10px] uppercase tracking-wider text-theme-muted">
                        {l.sync_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Pill value={l.status} />
                      {l.retry_count > 0 && (
                        <span className="block font-googleSans text-[10px] text-theme-muted mt-1">
                          retry ×{l.retry_count}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-glonimove text-[12px] text-red-200 max-w-[260px]">
                      {l.error ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-googleSans text-[11px] text-theme-muted whitespace-nowrap">
                      {formatDateTime(l.created_at)}
                    </td>
                    <td className="px-4 py-3 font-googleSans text-[11px] text-theme-muted whitespace-nowrap">
                      {formatDateTime(l.finished_at)}
                    </td>
                    <td className="px-4 py-3">
                      {l.status === "failed" && l.website_id && l.product_id && (
                        <button
                          type="button"
                          onClick={() => retryOne(l)}
                          disabled={retrying === l.id}
                          className={btnGhost}
                        >
                          {retrying === l.id ? "…" : "Retry"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Toast message={toast} />
    </div>
  );
};

export default SyncLogs;
