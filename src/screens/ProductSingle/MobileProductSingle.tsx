import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Product, products } from "../../data/products";
import {
  MachineComparison,
  ComparableMachine,
} from "../../components/product/MachineComparison";
import { ImageLightbox } from "../../components/product/ImageLightbox";
import { useI18n } from "../../context/I18nContext";

const toComparable = (p: Product): ComparableMachine => ({
  id: p.id,
  name: p.name,
  categoryLabel: p.categoryLabel,
  image: p.image,
  specs: p.specs,
  weightLabel: p.weight || undefined,
  features: p.features,
  buyUrl: `/equipment/${p.id}`,
});

/**
 * Mobile-first Konstructz product page. The desktop `ProductSingle` is a fixed
 * 1920px absolute canvas that AnimaScaler shrinks on phones (unreadable), so on
 * mobile we render this natural-flow, theme-aware layout instead.
 */
export const MobileProductSingle: React.FC<{ product: Product }> = ({ product }) => {
  const { t } = useI18n();
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const candidates = sameCategory.map(toComparable);
  const related = (sameCategory.length > 0
    ? sameCategory
    : products.filter((p) => p.id !== product.id)
  ).slice(0, 4);

  return (
    <main className="bg-theme-bg text-theme-text transition-colors duration-200">
      <div className="px-4 pt-20 pb-10">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-[12px] text-theme-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-theme-accent">{t("nav.home")}</Link>
          <span className="opacity-40">/</span>
          <Link to="/equipment" className="hover:text-theme-accent">{t("nav.equipment")}</Link>
          <span className="opacity-40">/</span>
          <span className="text-theme-text">{product.name}</span>
        </nav>

        {/* Gallery */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label={t("product.mainImage", { values: { name: product.name }, fallback: product.name })}
            className="relative block aspect-[4/3] w-full overflow-hidden border border-theme-border/20 bg-theme-sec"
          >
            <img
              src={gallery[active] ?? product.image}
              alt={product.name}
              className="h-full w-full object-contain p-4"
            />
            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-black/55 text-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </span>
          </button>
          {gallery.length > 1 && (
            <div className="mt-2.5 grid grid-cols-4 gap-2">
              {gallery.slice(0, 4).map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={t("product.thumbnail", { values: { name: product.name, index: i + 1 }, fallback: `View image ${i + 1}` })}
                  className={`aspect-square overflow-hidden border bg-theme-sec p-1.5 transition ${
                    active === i ? "border-theme-accent ring-1 ring-theme-accent" : "border-theme-border/20"
                  }`}
                >
                  <img src={img} alt="" aria-hidden="true" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title block */}
        <p className="mt-6 font-googleSans text-xs font-bold uppercase tracking-[0.2em] text-theme-accent">
          {product.categoryLabel}
        </p>
        <h1 className="mt-2 font-heading uppercase tracking-wide text-3xl leading-tight text-theme-heading">
          {product.name}
        </h1>
        {product.tagline && (
          <p className="mt-3 font-glonimove text-base leading-7 text-theme-text/80">
            {product.tagline}
          </p>
        )}

        {/* CTAs */}
        <div className="mt-5 flex flex-col gap-2.5">
          <Link
            to={`/contact?product=${product.id}`}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-theme-accent px-6 font-googleSans text-sm font-bold uppercase tracking-wide text-theme-bg transition hover:bg-brand-green hover:text-white"
          >
            {t("action.getAQuote")}
          </Link>
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(window.location.href);
              }
            }}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-theme-border/40 px-5 font-googleSans text-sm font-bold uppercase tracking-wide text-theme-text transition hover:border-theme-accent hover:text-theme-accent"
          >
            {t("action.share", { fallback: "Share" })}
          </button>
        </div>

        {/* Specs */}
        {product.specs.length > 0 && (
          <section className="mt-8" aria-label="Specifications">
            <h2 className="font-clofieBold text-xl text-theme-heading">{t("product.specifications", { fallback: "Specifications" })}</h2>
            <dl className="mt-3 divide-y divide-theme-border/15 border-y border-theme-border/15">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[40%_minmax(0,1fr)] gap-3 py-3">
                  <dt className="font-glonimove text-[13px] text-theme-muted">{spec.label}</dt>
                  <dd className="font-googleSans text-sm font-semibold text-theme-text">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Description */}
        {product.description && (
          <section className="mt-8">
            <h2 className="font-clofieBold text-xl text-theme-heading">{t("product.overview", { fallback: "Overview" })}</h2>
            <p className="mt-3 font-glonimove text-base leading-7 text-theme-text/80">
              {product.description}
            </p>
          </section>
        )}

        {/* Features */}
        {product.features.length > 0 && (
          <section className="mt-8">
            <h2 className="font-clofieBold text-xl text-theme-heading">{t("product.keyFeatures", { fallback: "Key Features" })}</h2>
            <ul className="mt-3 space-y-3">
              {product.features.map((f, i) => (
                <li key={i} className="flex gap-3 font-glonimove text-[15px] leading-7 text-theme-text/80">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-theme-accent" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {candidates.length > 0 && (
        <MachineComparison
          current={toComparable(product)}
          candidates={candidates}
          categoryLabel={product.categoryLabel}
          variant="konstructz"
          buyLabel={t("action.viewProduct", { fallback: "View Product" })}
        />
      )}

      {/* Related machines */}
      {related.length > 0 && (
        <section className="px-4 pb-14 pt-2">
          <h2 className="font-clofieBold text-2xl text-theme-heading">
            {t("product.relatedMachines", { fallback: "Related Machines" })}
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/equipment/${item.id}`}
                className="group flex flex-col border border-theme-border/20 bg-theme-card transition hover:border-theme-accent"
              >
                <div className="aspect-[4/3] overflow-hidden bg-theme-sec p-2">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <p className="font-googleSans text-[10px] font-bold uppercase tracking-wider text-theme-accent">{item.categoryLabel}</p>
                  <p className="mt-1 font-clofieBold text-sm leading-tight text-theme-heading">{item.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ImageLightbox
        images={gallery}
        index={active}
        open={lightbox}
        alt={product.name}
        onClose={() => setLightbox(false)}
        onIndexChange={setActive}
      />
    </main>
  );
};

export default MobileProductSingle;
