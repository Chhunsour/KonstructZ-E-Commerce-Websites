/**
 * WebsiteOverrides — per-website, per-product field overrides.
 *
 * Master data is the default. For a given site you can pin a custom price,
 * sale price, title, etc., or disable a product entirely. A normal sync respects
 * these (never overwrites them); only a "force" sync pushes raw master values.
 */
import React, { useEffect, useMemo, useState } from "react";
import { DbProduct } from "../../lib/supabase";
import { listAllProducts } from "../../lib/adminProducts";
import {
  ConnectedWebsite,
  WebsiteProductOverride,
  deleteOverride,
  listOverridesForWebsite,
  upsertOverride,
} from "../../lib/sync";
import { Modal, Toast, btnDanger, btnGhost, btnPrimary, inputCls } from "./ui";

const OVERRIDABLE: { key: keyof WebsiteProductOverride; label: string; area?: boolean }[] = [
  { key: "title", label: "Product title" },
  { key: "price", label: "Price" },
  { key: "sale_price", label: "Sale price" },
  { key: "status", label: "Status" },
  { key: "featured_image", label: "Featured image URL" },
  { key: "button_url", label: "Button / product URL" },
  { key: "short_description", label: "Short description", area: true },
  { key: "full_description", label: "Full description", area: true },
];

const WebsiteOverrides: React.FC<{
  website: ConnectedWebsite;
  onClose: () => void;
}> = ({ website, onClose }) => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [overrides, setOverrides] = useState<Map<string, WebsiteProductOverride>>(new Map());
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    Promise.all([listAllProducts(), listOverridesForWebsite(website.id)])
      .then(([prods, ovs]) => {
        setProducts(prods);
        setOverrides(new Map(ovs.map((o) => [o.product_id, o])));
      })
      .catch((e) => flash(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [website.id]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      `${p.name} ${p.slug} ${p.sku ?? ""}`.toLowerCase().includes(q)
    );
  }, [products, query]);

  const overrideSummary = (o?: WebsiteProductOverride): string => {
    if (!o) return "Master data";
    if (o.enabled === false) return "Disabled on this site";
    const fields = OVERRIDABLE.filter((f) => o[f.key] != null && o[f.key] !== "");
    return fields.length ? `${fields.length} override${fields.length > 1 ? "s" : ""}` : "Master data";
  };

  const save = async (draft: Partial<WebsiteProductOverride> & { product_id: string }) => {
    try {
      const saved = await upsertOverride({ ...draft, website_id: website.id });
      setOverrides((prev) => new Map(prev).set(saved.product_id, saved));
      flash("Override saved.");
      setEditing(null);
    } catch (e) {
      flash(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const clear = async (productId: string) => {
    const existing = overrides.get(productId);
    if (!existing) {
      setEditing(null);
      return;
    }
    try {
      await deleteOverride(existing.id);
      setOverrides((prev) => {
        const next = new Map(prev);
        next.delete(productId);
        return next;
      });
      flash("Reverted to master data.");
      setEditing(null);
    } catch (e) {
      flash(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <Modal title={`Overrides · ${website.name}`} onClose={onClose} wide>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        className={`${inputCls} mb-4`}
      />
      {loading ? (
        <p className="font-glonimove text-sm text-theme-muted py-8 text-center">Loading…</p>
      ) : (
        <div className="max-h-[55vh] overflow-y-auto divide-y divide-theme-border/15">
          {visible.map((p) => {
            const o = overrides.get(p.id);
            const disabled = o?.enabled === false;
            return (
              <div key={p.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="font-clofieBold text-sm text-theme-heading truncate">{p.name}</p>
                  <p className="font-mono text-[11px] text-theme-muted truncate">{p.slug}</p>
                </div>
                <span
                  className={`font-glonimove text-[11px] ${
                    disabled
                      ? "text-red-300"
                      : o
                      ? "text-theme-accent"
                      : "text-theme-muted"
                  }`}
                >
                  {overrideSummary(o)}
                </span>
                <button type="button" onClick={() => setEditing(p)} className={btnGhost}>
                  Edit
                </button>
              </div>
            );
          })}
          {visible.length === 0 && (
            <p className="font-glonimove text-sm text-theme-muted py-8 text-center">
              No products match.
            </p>
          )}
        </div>
      )}

      {editing && (
        <OverrideEditor
          product={editing}
          existing={overrides.get(editing.id) ?? null}
          onCancel={() => setEditing(null)}
          onSave={save}
          onClear={() => clear(editing.id)}
        />
      )}
      <Toast message={toast} />
    </Modal>
  );
};

const OverrideEditor: React.FC<{
  product: DbProduct;
  existing: WebsiteProductOverride | null;
  onCancel: () => void;
  onSave: (draft: Partial<WebsiteProductOverride> & { product_id: string }) => void;
  onClear: () => void;
}> = ({ product, existing, onCancel, onSave, onClear }) => {
  const [enabled, setEnabled] = useState(existing?.enabled ?? true);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of OVERRIDABLE) {
      const v = existing?.[f.key];
      init[f.key as string] = typeof v === "string" ? v : "";
    }
    return init;
  });

  // Master value shown as the placeholder so it's clear what "blank" inherits.
  const masterValue = (key: string): string => {
    const map: Record<string, unknown> = {
      title: product.name,
      price: product.price,
      sale_price: product.sale_price,
      status: product.status,
      featured_image: product.featured_image,
      button_url: product.button_url,
      short_description: product.short_description,
      full_description: product.full_description,
    };
    const v = map[key];
    return typeof v === "string" && v ? v : "—";
  };

  const submit = () => {
    const draft: Partial<WebsiteProductOverride> & { product_id: string } = {
      product_id: product.id,
      enabled,
    };
    for (const f of OVERRIDABLE) {
      const v = values[f.key as string]?.trim();
      (draft as Record<string, unknown>)[f.key as string] = v ? v : null;
    }
    onSave(draft);
  };

  return (
    <Modal title={`Override · ${product.name}`} onClose={onCancel}>
      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="accent-theme-accent"
          />
          <span className="font-glonimove text-sm text-theme-text">
            Include this product on this website
          </span>
        </label>

        <p className="font-glonimove text-[11px] text-theme-muted">
          Leave a field blank to inherit master data (shown as the placeholder).
        </p>

        <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
          {OVERRIDABLE.map((f) => (
            <div key={f.key as string}>
              <label className="block font-googleSans text-[11px] uppercase tracking-wider text-theme-muted mb-1.5">
                {f.label}
              </label>
              {f.area ? (
                <textarea
                  rows={2}
                  value={values[f.key as string]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key as string]: e.target.value }))
                  }
                  placeholder={masterValue(f.key as string)}
                  className={`${inputCls} resize-y`}
                />
              ) : (
                <input
                  type="text"
                  value={values[f.key as string]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key as string]: e.target.value }))
                  }
                  placeholder={masterValue(f.key as string)}
                  className={inputCls}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={onClear}
            disabled={!existing}
            className={btnDanger}
          >
            Revert to master
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onCancel} className={btnGhost}>
              Cancel
            </button>
            <button type="button" onClick={submit} className={btnPrimary}>
              Save override
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WebsiteOverrides;
