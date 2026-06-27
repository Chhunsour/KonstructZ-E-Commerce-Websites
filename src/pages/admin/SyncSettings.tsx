/**
 * Sync Settings — global performance/safety tuning for the orchestrator.
 * Stored in the single-row sync_settings table and read by the Edge Function.
 */
import React, { useEffect, useState } from "react";
import {
  SyncSettings as Settings,
  getSyncSettings,
  updateSyncSettings,
} from "../../lib/sync";
import { Card, Field, Toast, btnPrimary, inputCls } from "../../components/admin/ui";

export const SyncSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getSyncSettings()
      .then((s) => setSettings(s))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setSettings((s) => (s ? { ...s, [k]: v } : s));

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateSyncSettings({
        batch_size: settings.batch_size,
        concurrency: settings.concurrency,
        request_timeout_s: settings.request_timeout_s,
        compress_images: settings.compress_images,
      });
      setSettings(updated);
      setToast("Settings saved.");
      setTimeout(() => setToast(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-clofieBold text-3xl md:text-4xl text-theme-heading mb-2">
        Sync Settings
      </h1>
      <p className="font-glonimove text-sm text-theme-muted mb-8">
        Performance and safety tuning for the sync orchestrator.
      </p>

      {error && (
        <div className="mb-6 p-4 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <p className="font-glonimove text-sm text-theme-muted">Loading…</p>
      ) : !settings ? (
        <Card className="p-6">
          <p className="font-glonimove text-sm text-yellow-200">
            Settings row not found. Run the 0006_product_sync.sql migration.
          </p>
        </Card>
      ) : (
        <Card className="p-6 max-w-2xl">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field
              label="Batch size"
              hint="Products per HTTP request to a website. Lower = safer for small servers."
            >
              <input
                type="number"
                min={1}
                max={100}
                className={inputCls}
                value={settings.batch_size}
                onChange={(e) => set("batch_size", Number(e.target.value) || 1)}
              />
            </Field>
            <Field
              label="Website concurrency"
              hint="How many websites are pushed to in parallel."
            >
              <input
                type="number"
                min={1}
                max={20}
                className={inputCls}
                value={settings.concurrency}
                onChange={(e) => set("concurrency", Number(e.target.value) || 1)}
              />
            </Field>
            <Field label="Request timeout (seconds)" hint="Per request to a receiver.">
              <input
                type="number"
                min={5}
                max={300}
                className={inputCls}
                value={settings.request_timeout_s}
                onChange={(e) => set("request_timeout_s", Number(e.target.value) || 60)}
              />
            </Field>
            <Field label="Compress images" hint="Hint receivers to recompress images (GD).">
              <label className="flex items-center gap-3 h-[42px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.compress_images}
                  onChange={(e) => set("compress_images", e.target.checked)}
                  className="accent-theme-accent"
                />
                <span className="font-glonimove text-sm text-theme-text">
                  Enabled
                </span>
              </label>
            </Field>
          </div>
          <div className="mt-6">
            <button type="button" onClick={save} disabled={saving} className={btnPrimary}>
              {saving ? "Saving…" : "Save settings"}
            </button>
          </div>
        </Card>
      )}

      <Toast message={toast} />
    </div>
  );
};

export default SyncSettings;
