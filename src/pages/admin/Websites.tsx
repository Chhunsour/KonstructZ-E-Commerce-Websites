/**
 * Connected Websites manager.
 *
 * Each row is an e-commerce framework site that receives synced product data.
 * Manage the receiver endpoint + secret token, toggle active, test the
 * connection (pings the receiver via the Edge Function), and open per-site
 * product overrides.
 */
import React, { useCallback, useEffect, useState } from "react";
import {
  ConnectedWebsite,
  WebsiteInput,
  createWebsite,
  deleteWebsite,
  listWebsites,
  testConnection,
  updateWebsite,
} from "../../lib/sync";
import {
  Card,
  Field,
  Modal,
  Pill,
  Toast,
  btnDanger,
  btnGhost,
  btnPrimary,
  formatDateTime,
  inputCls,
} from "../../components/admin/ui";
import WebsiteOverrides from "../../components/admin/WebsiteOverrides";

const blankForm: WebsiteInput = {
  name: "",
  domain: "",
  sync_endpoint: "",
  secret_token: "",
  platform: "konstructz-framework",
  active: true,
  notes: "",
};

export const Websites: React.FC = () => {
  const [sites, setSites] = useState<ConnectedWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editing, setEditing] = useState<ConnectedWebsite | "new" | null>(null);
  const [overridesFor, setOverridesFor] = useState<ConnectedWebsite | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [revealId, setRevealId] = useState<string | null>(null);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSites(await listWebsites());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleActive = async (s: ConnectedWebsite) => {
    try {
      const updated = await updateWebsite(s.id, { active: !s.active });
      setSites((prev) => prev.map((x) => (x.id === s.id ? updated : x)));
    } catch (e) {
      flash(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const remove = async (s: ConnectedWebsite) => {
    if (!confirm(`Delete "${s.name}"? Its overrides and sync history are removed too.`)) return;
    try {
      await deleteWebsite(s.id);
      setSites((prev) => prev.filter((x) => x.id !== s.id));
      flash("Website deleted.");
    } catch (e) {
      flash(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const test = async (s: ConnectedWebsite) => {
    setTestingId(s.id);
    try {
      const r = await testConnection(s.id);
      if (r.ok && r.response?.ok !== false) {
        const count = r.response?.product_count;
        flash(
          `✓ Connected to ${s.name}` +
            (typeof count === "number" ? ` · ${count} products on site` : "")
        );
      } else {
        flash(`✗ ${s.name}: ${r.error ?? `HTTP ${r.status}`}`);
      }
    } catch (e) {
      flash(`✗ ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setTestingId(null);
    }
  };

  const copyToken = (token: string) => {
    navigator.clipboard?.writeText(token).then(
      () => flash("Secret token copied."),
      () => flash("Could not copy.")
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-clofieBold text-3xl md:text-4xl text-theme-heading">
            Connected Websites
          </h1>
          <p className="mt-2 font-glonimove text-sm text-theme-muted">
            {sites.length} connected · {sites.filter((s) => s.active).length} active
          </p>
        </div>
        <button type="button" onClick={() => setEditing("new")} className={btnPrimary}>
          + Add website
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-200">
          {error}
        </div>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-glonimove text-theme-muted">Loading…</div>
        ) : sites.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-clofieBold text-lg text-theme-heading mb-2">No websites yet</p>
            <p className="font-glonimove text-sm text-theme-muted mb-5">
              Add your first e-commerce framework site to start pushing products to it.
            </p>
            <button type="button" onClick={() => setEditing("new")} className={btnPrimary}>
              + Add website
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-theme-border/20 bg-theme-bg/40">
                  {["Website", "Endpoint", "Secret", "Status", "Last sync", ""].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 font-googleSans text-[10px] uppercase tracking-wider text-theme-muted whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border/15">
                {sites.map((s) => (
                  <tr key={s.id} className="hover:bg-theme-bg/40 transition-colors align-top">
                    <td className="px-4 py-3">
                      <p className="font-clofieBold text-sm text-theme-heading">{s.name}</p>
                      <p className="font-mono text-[11px] text-theme-muted">{s.domain}</p>
                      <p className="font-googleSans text-[10px] uppercase tracking-wider text-theme-muted mt-1">
                        {s.platform}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-theme-muted max-w-[240px] truncate">
                      {s.sync_endpoint}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-[11px] text-theme-muted">
                          {revealId === s.id ? s.secret_token : "••••••••"}
                        </code>
                        <button
                          type="button"
                          onClick={() => setRevealId(revealId === s.id ? null : s.id)}
                          className="text-[11px] text-theme-accent hover:underline"
                        >
                          {revealId === s.id ? "hide" : "show"}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToken(s.secret_token)}
                          className="text-[11px] text-theme-accent hover:underline"
                        >
                          copy
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => toggleActive(s)} title="Toggle active">
                        <Pill value={s.active ? "active" : "inactive"} />
                      </button>
                      {s.last_status && (
                        <div className="mt-1">
                          <Pill value={s.last_status} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-googleSans text-[11px] text-theme-muted whitespace-nowrap">
                      {formatDateTime(s.last_sync_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => test(s)}
                          disabled={testingId === s.id}
                          className={btnGhost}
                        >
                          {testingId === s.id ? "Testing…" : "Test"}
                        </button>
                        <button type="button" onClick={() => setOverridesFor(s)} className={btnGhost}>
                          Overrides
                        </button>
                        <button type="button" onClick={() => setEditing(s)} className={btnGhost}>
                          Edit
                        </button>
                        <button type="button" onClick={() => remove(s)} className={btnDanger}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing && (
        <WebsiteForm
          site={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setSites((prev) => {
              const exists = prev.some((x) => x.id === saved.id);
              return exists ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved];
            });
            setEditing(null);
            flash("Website saved.");
          }}
        />
      )}

      {overridesFor && (
        <WebsiteOverrides website={overridesFor} onClose={() => setOverridesFor(null)} />
      )}

      <Toast message={toast} />
    </div>
  );
};

const WebsiteForm: React.FC<{
  site: ConnectedWebsite | null;
  onClose: () => void;
  onSaved: (s: ConnectedWebsite) => void;
}> = ({ site, onClose, onSaved }) => {
  const [form, setForm] = useState<WebsiteInput>(
    site
      ? {
          name: site.name,
          domain: site.domain,
          sync_endpoint: site.sync_endpoint,
          secret_token: site.secret_token,
          platform: site.platform,
          active: site.active,
          notes: site.notes ?? "",
        }
      : blankForm
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = (k: keyof WebsiteInput, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const genToken = () => {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    set(
      "secret_token",
      [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")
    );
  };

  const save = async () => {
    if (!form.name.trim() || !form.domain.trim() || !form.sync_endpoint.trim()) {
      setErr("Name, domain and sync endpoint are required.");
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const payload: WebsiteInput = {
        ...form,
        name: form.name.trim(),
        domain: form.domain.trim(),
        sync_endpoint: form.sync_endpoint.trim(),
        secret_token: form.secret_token?.trim() || undefined,
      };
      const saved = site
        ? await updateWebsite(site.id, payload)
        : await createWebsite(payload);
      onSaved(saved);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={site ? "Edit website" : "Add website"} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Website name" required>
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Konstructz Store"
            />
          </Field>
          <Field label="Domain" required>
            <input
              className={inputCls}
              value={form.domain}
              onChange={(e) => set("domain", e.target.value)}
              placeholder="store.konstructz.com"
            />
          </Field>
        </div>
        <Field
          label="API sync endpoint"
          required
          hint="Full URL of receiver.php on the target site."
        >
          <input
            className={inputCls}
            value={form.sync_endpoint}
            onChange={(e) => set("sync_endpoint", e.target.value)}
            placeholder="https://store.konstructz.com/api/receiver.php"
          />
        </Field>
        <Field label="Secret token" hint="Must match SYNC_TOKEN in the site's sync-config.php.">
          <div className="flex gap-2">
            <input
              className={`${inputCls} font-mono text-xs`}
              value={form.secret_token ?? ""}
              onChange={(e) => set("secret_token", e.target.value)}
              placeholder={site ? "" : "auto-generated if left blank"}
            />
            <button type="button" onClick={genToken} className={btnGhost}>
              Generate
            </button>
          </div>
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Platform / framework">
            <input
              className={inputCls}
              value={form.platform ?? ""}
              onChange={(e) => set("platform", e.target.value)}
              placeholder="konstructz-framework"
            />
          </Field>
          <Field label="Active">
            <label className="flex items-center gap-3 h-[42px] cursor-pointer">
              <input
                type="checkbox"
                checked={form.active ?? true}
                onChange={(e) => set("active", e.target.checked)}
                className="accent-theme-accent"
              />
              <span className="font-glonimove text-sm text-theme-text">
                Receive syncs
              </span>
            </label>
          </Field>
        </div>
        <Field label="Notes">
          <textarea
            rows={2}
            className={`${inputCls} resize-y`}
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>

        {err && (
          <div className="p-3 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-200">
            {err}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancel
          </button>
          <button type="button" onClick={save} disabled={saving} className={btnPrimary}>
            {saving ? "Saving…" : "Save website"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Websites;
