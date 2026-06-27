import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DbProduct, SpecRow } from "../../lib/supabase";
import { getProduct } from "../../lib/adminProducts";
import ProductMarkdown from "../../components/product/ProductMarkdown";

/** Admin-only preview of a single product — works for drafts and hidden too. */
export const ProductPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (id) {
          const p = await getProduct(id);
          if (active) setProduct(p);
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading)
    return <div className="py-20 text-center font-glonimove text-theme-muted">Loading…</div>;
  if (error || !product)
    return (
      <div className="py-20 text-center font-glonimove text-theme-muted">
        {error ?? "Product not found."}{" "}
        <Link to="/sour/products" className="text-theme-accent underline">Back</Link>
      </div>
    );

  const p = product;
  const typedSpecs: SpecRow[] = [
    ["Engine", p.engine],
    ["Horsepower", p.horsepower],
    ["Operating weight", p.operating_weight],
    ["Lift capacity", p.lift_capacity],
    ["Digging depth", p.digging_depth],
    ["Width", p.width],
    ["Height", p.height],
    ["Length", p.length],
    ["Fuel type", p.fuel_type],
    ["Machine type", p.machine_type],
    ["Condition", p.condition],
    ["Availability", p.stock_status],
  ]
    .filter(([, v]) => v)
    .map(([label, value]) => ({ label: label as string, value: value as string }))
    .concat(p.extra_specs ?? []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-6">
        <Link to={`/sour/products/${p.id}`} className="font-googleSans text-xs uppercase tracking-wider text-theme-muted hover:text-theme-accent">← Back to editor</Link>
        <span className="font-googleSans text-[11px] uppercase tracking-wider text-theme-muted">
          Preview · status: {p.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-[4/3] bg-theme-card border border-theme-border/20 rounded overflow-hidden">
            {p.featured_image ? (
              <img src={p.featured_image} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-theme-muted">No image</div>
            )}
          </div>
          {p.gallery_images?.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {p.gallery_images.slice(0, 8).map((g, i) => (
                <img key={i} src={g} alt="" loading="lazy" className="aspect-square object-cover rounded border border-theme-border/20" />
              ))}
            </div>
          )}
        </div>

        <div>
          {p.brand && <p className="font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-1">{p.brand}</p>}
          <h1 className="font-clofieBold text-3xl text-theme-heading">{p.name}</h1>
          {(p.sale_price || p.price) && (
            <p className="mt-2 font-clofieBold text-2xl text-theme-accent">
              {p.sale_price || p.price}
              {p.sale_price && p.price && (
                <span className="ml-2 text-base text-theme-muted line-through">{p.price}</span>
              )}
            </p>
          )}
          {p.short_description && (
            <p className="mt-3 font-glonimove text-base text-theme-text">{p.short_description}</p>
          )}
          {p.button_text && p.button_url && (
            <a
              href={p.button_url}
              className="mt-5 inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white font-googleSans font-bold text-sm uppercase tracking-wider px-6 py-3 rounded transition-colors"
            >
              {p.button_text}
            </a>
          )}

          {typedSpecs.length > 0 && (
            <table className="w-full mt-6 text-left border-collapse">
              <tbody>
                {typedSpecs.map((s, i) => (
                  <tr key={i} className="border-b border-theme-border/15">
                    <th className="py-2 pr-4 font-googleSans text-xs uppercase tracking-wider text-theme-muted align-top whitespace-nowrap">{s.label}</th>
                    <td className="py-2 font-glonimove text-sm text-theme-text">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {p.full_description && (
        <div className="mt-10 pt-8 border-t border-theme-border/20">
          <ProductMarkdown content={p.full_description} />
        </div>
      )}
    </div>
  );
};

export default ProductPreview;
