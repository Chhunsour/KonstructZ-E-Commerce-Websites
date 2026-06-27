/**
 * SyncModal — the dialog behind every "Sync" action in the Products dashboard.
 *
 * Lets the admin choose what to sync (full / price / images / descriptions),
 * which websites to target, and whether to force (ignore overrides + re-push
 * unchanged products). Calls the product-sync Edge Function and shows a result.
 */
import React, { useEffect, useMemo, useState } from "react";
import {
  ConnectedWebsite,
  SyncResult,
  SyncType,
  callSync,
  listWebsites,
} from "../../lib/sync";
import { Modal, btnGhost, btnPrimary } from "./ui";

const SYNC_TYPES: { value: SyncType; label: string; hint: string }[] = [
  { value: "full", label: "Full product", hint: "All fields + images" },
  { value: "price", label: "Price only", hint: "Price, sale price, stock" },
  { value: "images", label: "Images only", hint: "Featured + gallery" },
  { value: "descriptions", label: "Descriptions only", hint: "Title + short/full text" },
];

export interface SyncTarget {
  /** "all" syncs every product; otherwise these specific product ids. */
  productIds: string[] | "all";
  /** Human label, e.g. a product name or "12 selected products". */
  label: string;
}

const SyncModal: React.FC<{
  target: SyncTarget;
  onClose: () => void;
  onDone?: (r: SyncResult) => void;
}> = ({ target, onClose, onDone }) => {
  const [websites, setWebsites] = useState<ConnectedWebsite[]>([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [syncType, setSyncType] = useState<SyncType>("full");
  const [selectedSites, setSelectedSites] = useState<"all" | Set<string>>("all");
  const [force, setForce] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    listWebsites()
      .then((w) => setWebsites(w.filter((x) => x.active)))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoadingSites(false));
  }, []);

  const toggleSite = (id: string) => {
    setSelectedSites((prev) => {
      const next = prev === "all" ? new Set(websites.map((w) => w.id)) : new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const websiteIds = useMemo<string[] | "all">(() => {
    if (selectedSites === "all") return "all";
    return [...selectedSites];
  }, [selectedSites]);

  const canRun =
    websites.length > 0 &&
    (websiteIds === "all" || (Array.isArray(websiteIds) && websiteIds.length > 0));

  const run = async () => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const r = await callSync({
        productIds: target.productIds,
        websiteIds,
        syncType,
        force,
      });
      setResult(r);
      onDone?.(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <Modal title="Sync products" onClose={onClose}>
      <div className="space-y-5">
        <p className="font-glonimove text-sm text-theme-muted">
          Syncing <span className="text-theme-text">{target.label}</span>.
        </p>

        {/* sync type */}
        <div>
          <p className="font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
            What to sync
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SYNC_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setSyncType(t.value)}
                className={`text-left p-3 rounded border transition-colors ${
                  syncType === t.value
                    ? "border-theme-accent bg-theme-accent/10"
                    : "border-theme-border/20 hover:border-theme-accent/50"
                }`}
              >
                <span className="block font-clofieBold text-sm text-theme-heading">
                  {t.label}
                </span>
                <span className="block font-glonimove text-[11px] text-theme-muted">
                  {t.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* websites */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-googleSans text-xs uppercase tracking-wider text-theme-muted">
              Target websites
            </p>
            <button
              type="button"
              onClick={() => setSelectedSites("all")}
              className="font-googleSans text-[11px] uppercase tracking-wider text-theme-accent hover:underline"
            >
              All websites
            </button>
          </div>
          {loadingSites ? (
            <p className="font-glonimove text-sm text-theme-muted">Loading websites…</p>
          ) : websites.length === 0 ? (
            <p className="font-glonimove text-sm text-yellow-200">
              No active websites yet. Add one in Websites first.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {websites.map((w) => {
                const checked = selectedSites === "all" || selectedSites.has(w.id);
                return (
                  <label
                    key={w.id}
                    className="flex items-center gap-3 p-2.5 rounded border border-theme-border/20 hover:border-theme-accent/40 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSite(w.id)}
                      className="accent-theme-accent"
                    />
                    <span className="min-w-0">
                      <span className="block font-clofieBold text-sm text-theme-heading truncate">
                        {w.name}
                      </span>
                      <span className="block font-mono text-[11px] text-theme-muted truncate">
                        {w.domain}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* force */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={force}
            onChange={(e) => setForce(e.target.checked)}
            className="mt-1 accent-theme-accent"
          />
          <span>
            <span className="block font-clofieBold text-sm text-theme-heading">
              Force sync
            </span>
            <span className="block font-glonimove text-[11px] text-theme-muted">
              Ignore per-website overrides and re-push even unchanged products.
            </span>
          </span>
        </label>

        {error && (
          <div className="p-3 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-200">
            {error}
          </div>
        )}

        {result && (
          <div className="p-3 border border-theme-border/30 bg-theme-bg/40 rounded font-glonimove text-sm">
            <p className="text-theme-text">
              <span className="text-emerald-300">{result.success} succeeded</span>
              {" · "}
              <span className={result.failed ? "text-red-300" : "text-theme-muted"}>
                {result.failed} failed
              </span>
              {typeof result.skipped === "number" && (
                <>
                  {" · "}
                  <span className="text-theme-muted">{result.skipped} unchanged</span>
                </>
              )}
            </p>
            {result.results && result.results.some((r) => !r.ok) && (
              <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {result.results
                  .filter((r) => !r.ok)
                  .map((r, i) => (
                    <li key={i} className="text-[12px] text-red-200">
                      {r.website} · {r.product}: {r.error}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={btnGhost}>
            {result ? "Close" : "Cancel"}
          </button>
          <button type="button" onClick={run} disabled={!canRun || running} className={btnPrimary}>
            {running ? "Syncing…" : result ? "Sync again" : "Start sync"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SyncModal;
