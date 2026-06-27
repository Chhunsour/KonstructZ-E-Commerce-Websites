import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DbProduct, DbProductCategory, ProductStatus } from "../../lib/supabase";
import {
  deleteProduct,
  duplicateProduct,
  listAllProducts,
  listCategories,
  setProductStatus,
} from "../../lib/adminProducts";

const STATUS_STYLE: Record<ProductStatus, string> = {
  published: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  draft: "bg-yellow-500/10 text-yellow-200 border-yellow-500/40",
  hidden: "bg-amber-600/10 text-amber-300 border-amber-600/40",
};

const StatusPill: React.FC<{ status: ProductStatus }> = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-0.5 rounded-full font-googleSans text-[10px] uppercase tracking-wider border ${STATUS_STYLE[status]}`}
  >
    {status}
  </span>
);

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const priceLabel = (p: DbProduct): string => {
  if (p.sale_price && p.price) return `${p.sale_price} (was ${p.price})`;
  return p.sale_price || p.price || "—";
};

/** Public route for a product, by line. Mirrors src/App.tsx routes. */
const publicHref = (p: DbProduct): string =>
  p.product_line === "typhon"
    ? `/typhon-machinery/${p.slug}`
    : `/equipment/${p.slug}`;

export const ProductsDashboard: React.FC = () => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | ProductStatus>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [lineFilter, setLineFilter] = useState<"all" | "konstructz" | "typhon">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rows, cats] = await Promise.all([listAllProducts(), listCategories()]);
      setProducts(rows);
      setCategories(cats);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!menuId) return;
    const close = () => setMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuId]);

  const catMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (lineFilter !== "all" && p.product_line !== lineFilter) return false;
      if (catFilter !== "all" && p.category_id !== catFilter) return false;
      if (q) {
        const hay = `${p.name} ${p.slug} ${p.brand ?? ""} ${p.sku ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    filtered.sort((a, b) => {
      const da = new Date(a.updated_at).getTime();
      const db = new Date(b.updated_at).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return filtered;
  }, [products, statusFilter, lineFilter, catFilter, query, sort]);

  /* ── actions ───────────────────────────────────────────────────────── */
  const changeStatus = async (p: DbProduct, next: ProductStatus) => {
    setBusyId(p.id);
    try {
      await setProductStatus(p.id, next, Boolean(p.published_at));
      setProducts((prev) =>
        prev.map((x) =>
          x.id === p.id
            ? {
                ...x,
                status: next,
                published_at:
                  next === "published" && !x.published_at
                    ? new Date().toISOString()
                    : x.published_at,
              }
            : x
        )
      );
      flash(
        next === "published"
          ? "Product published."
          : next === "hidden"
          ? "Product hidden."
          : "Product unpublished."
      );
    } catch (e) {
      flash(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusyId(null);
    }
  };

  const duplicate = async (p: DbProduct) => {
    setBusyId(p.id);
    try {
      const copy = await duplicateProduct(p.id);
      await load();
      flash(`Duplicated "${copy.name}".`);
    } catch (e) {
      flash(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p: DbProduct) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setBusyId(p.id);
    try {
      await deleteProduct(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      flash("Product deleted.");
    } catch (e) {
      flash(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(
    () => ({
      total: products.length,
      published: products.filter((p) => p.status === "published").length,
      draft: products.filter((p) => p.status === "draft").length,
      hidden: products.filter((p) => p.status === "hidden").length,
    }),
    [products]
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-clofieBold text-3xl md:text-4xl text-theme-heading">
            Products
          </h1>
          <p className="mt-2 font-glonimove text-sm text-theme-muted">
            {counts.total} total · {counts.published} published · {counts.draft}{" "}
            drafts · {counts.hidden} hidden
          </p>
        </div>
        <Link
          to="/sour/products/new"
          className="inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white font-googleSans font-bold text-sm uppercase tracking-wider px-5 py-3 rounded transition-colors"
        >
          + New product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1 bg-theme-card border border-theme-border/20 rounded p-1">
          {(["all", "published", "draft", "hidden"] as const).map((f) => (
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
          value={lineFilter}
          onChange={(e) => setLineFilter(e.target.value as typeof lineFilter)}
          className="bg-theme-card border border-theme-border/20 rounded px-3 py-2 font-googleSans text-xs uppercase tracking-wider text-theme-text focus:outline-none focus:border-theme-accent"
        >
          <option value="all">All lines</option>
          <option value="konstructz">Konstructz</option>
          <option value="typhon">Typhon</option>
        </select>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="bg-theme-card border border-theme-border/20 rounded px-3 py-2 font-googleSans text-xs uppercase tracking-wider text-theme-text focus:outline-none focus:border-theme-accent"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          className="bg-theme-card border border-theme-border/20 rounded px-3 py-2 font-googleSans text-xs uppercase tracking-wider text-theme-text focus:outline-none focus:border-theme-accent"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, slug, brand or SKU…"
          className="flex-1 min-w-[200px] bg-theme-card border border-theme-border/20 rounded px-4 py-2 font-googleSans text-sm text-theme-text focus:outline-none focus:border-theme-accent"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-theme-card border border-theme-border/20 rounded overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-glonimove text-theme-muted">
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-clofieBold text-lg text-theme-heading mb-2">
              No products yet
            </p>
            <p className="font-glonimove text-sm text-theme-muted mb-5">
              Add your first product, or run the seed script to import the
              existing catalog.
            </p>
            <Link
              to="/sour/products/new"
              className="inline-block bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white font-googleSans font-bold text-sm uppercase tracking-wider px-5 py-3 rounded transition-colors"
            >
              + New product
            </Link>
          </div>
        ) : visible.length === 0 ? (
          <div className="p-12 text-center font-glonimove text-theme-muted">
            No products match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-theme-border/20 bg-theme-bg/40">
                  {["Product", "Category", "Brand", "Price", "Status", "Updated", ""].map(
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
                {visible.map((p) => {
                  const cat = p.category_id ? catMap.get(p.category_id) : null;
                  const isBusy = busyId === p.id;
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-theme-bg/40 transition-colors ${
                        isBusy ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0 w-14 h-10 bg-theme-bg rounded overflow-hidden border border-theme-border/20">
                            {p.featured_image ? (
                              <img
                                src={p.featured_image}
                                alt=""
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full grid place-items-center text-[9px] text-theme-muted">
                                —
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/sour/products/${p.id}`}
                              className="block font-clofieBold text-sm text-theme-heading hover:text-theme-accent truncate max-w-[280px]"
                            >
                              {p.name}
                            </Link>
                            <span className="font-mono text-[11px] text-theme-muted truncate block max-w-[280px]">
                              {p.product_line === "typhon" ? "typhon" : "konstructz"} ·{" "}
                              {p.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-googleSans text-xs text-theme-muted whitespace-nowrap">
                        {cat?.name ?? p.category?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-googleSans text-xs text-theme-muted whitespace-nowrap">
                        {p.brand || "—"}
                      </td>
                      <td className="px-4 py-3 font-glonimove text-sm text-theme-text whitespace-nowrap">
                        {priceLabel(p)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={p.status} />
                      </td>
                      <td className="px-4 py-3 font-googleSans text-[11px] uppercase tracking-wider text-theme-muted whitespace-nowrap">
                        {formatDate(p.updated_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/sour/products/${p.id}`}
                            className="font-googleSans text-xs uppercase tracking-wider text-theme-text hover:text-theme-accent border border-theme-border/30 hover:border-theme-accent px-3 py-1.5 rounded transition-colors"
                          >
                            Edit
                          </Link>
                          <div className="relative">
                            <button
                              type="button"
                              aria-label="More actions"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuId(menuId === p.id ? null : p.id);
                              }}
                              className="w-8 h-8 grid place-items-center rounded border border-theme-border/30 hover:border-theme-accent text-theme-text hover:text-theme-accent transition-colors"
                            >
                              ⋯
                            </button>
                            {menuId === p.id && (
                              <div
                                className="absolute right-0 top-full mt-1 z-20 w-44 bg-theme-card border border-theme-border/30 rounded shadow-xl py-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Link
                                  to={`/sour/products/${p.id}/preview`}
                                  onClick={() => setMenuId(null)}
                                  className="block px-4 py-2 font-googleSans text-xs uppercase tracking-wider text-theme-text hover:bg-theme-bg hover:text-theme-accent transition-colors"
                                >
                                  Preview
                                </Link>
                                {p.status === "published" ? (
                                  <MenuItem onClick={() => { setMenuId(null); changeStatus(p, "draft"); }}>
                                    Unpublish
                                  </MenuItem>
                                ) : (
                                  <MenuItem onClick={() => { setMenuId(null); changeStatus(p, "published"); }}>
                                    Publish now
                                  </MenuItem>
                                )}
                                {p.status !== "hidden" ? (
                                  <MenuItem onClick={() => { setMenuId(null); changeStatus(p, "hidden"); }}>
                                    Hide
                                  </MenuItem>
                                ) : (
                                  <MenuItem onClick={() => { setMenuId(null); changeStatus(p, "draft"); }}>
                                    Unhide (draft)
                                  </MenuItem>
                                )}
                                <MenuItem onClick={() => { setMenuId(null); duplicate(p); }}>
                                  Duplicate
                                </MenuItem>
                                {p.status === "published" && (
                                  <a
                                    href={publicHref(p)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMenuId(null)}
                                    className="block px-4 py-2 font-googleSans text-xs uppercase tracking-wider text-theme-text hover:bg-theme-bg hover:text-theme-accent transition-colors"
                                  >
                                    View live ↗
                                  </a>
                                )}
                                <div className="my-1 border-t border-theme-border/20" />
                                <MenuItem
                                  destructive
                                  onClick={() => { setMenuId(null); remove(p); }}
                                >
                                  Delete
                                </MenuItem>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-theme-card border border-theme-border/40 rounded px-5 py-3 shadow-xl font-glonimove text-sm text-theme-text">
          {toast}
        </div>
      )}
    </div>
  );
};

const MenuItem: React.FC<{
  onClick: () => void;
  destructive?: boolean;
  children: React.ReactNode;
}> = ({ onClick, destructive, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`block w-full text-left px-4 py-2 font-googleSans text-xs uppercase tracking-wider transition-colors ${
      destructive
        ? "text-red-300 hover:bg-red-500/10 hover:text-red-200"
        : "text-theme-text hover:bg-theme-bg hover:text-theme-accent"
    }`}
  >
    {children}
  </button>
);

export default ProductsDashboard;
