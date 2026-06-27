import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  TyphonProduct,
  typhonProducts,
} from "../../data/typhonProducts";
import {
  buildDescriptionBlocks,
  DESCRIPTION_FALLBACK,
} from "./formatDescription";
import { TyphonProductCard } from "../../components/ui/TyphonProductCard";
import {
  MachineComparison,
  ComparableMachine,
} from "../../components/product/MachineComparison";
import { ImageLightbox } from "../../components/product/ImageLightbox";
import { ShareMenu } from "../../components/product/ShareMenu";
import { AddToCartButton } from "../../components/product/AddToCartButton";
import { getEcwidProductId } from "../../data/ecwidProductIds";

// The CSV "Button URL" field is the canonical purchase link for a Typhon
// machine (always a /product/<slug> path). Fall back to the original source
// URL only when the button URL is blank — we never construct or guess a link.
//
// The buy button opens the product inside the embedded Ecwid store, which uses
// hashbang routing (/product#!/...). So we rewrite the CSV's /product/<slug>
// to /product#!/<slug>; otherwise the link hits the /product/:slug Konstructz
// category route instead of the store. Only the path separator changes — the
// slug itself comes straight from the CSV.
const getTyphonBuyUrl = (product: TyphonProduct): string | undefined => {
  const raw = product.buttonUrl || product.sourceUrl;
  if (!raw) return undefined;
  return raw.replace(/^\/product\//, "/product#!/");
};

const toComparable = (product: TyphonProduct): ComparableMachine => ({
  id: product.id,
  name: product.name,
  categoryLabel: product.categoryLabel,
  image: product.image,
  specs: product.specs,
  priceLabel: product.currentPrice || undefined,
  weightLabel: product.weight || undefined,
  features: product.features,
  buyUrl: getTyphonBuyUrl(product),
});

const LeadParagraph: React.FC<{ text: string; emphasizeLead?: boolean }> = ({
  text,
  emphasizeLead = false,
}) => {
  if (!emphasizeLead) return <>{text}</>;

  const match = text.match(/^(.+?[.!?])\s+(.+)$/s);
  if (!match) return <>{text}</>;

  return (
    <>
      <strong className="font-googleSans font-bold text-white">{match[1]}</strong>{" "}
      {match[2]}
    </>
  );
};

interface TyphonProductSingleProps {
  product: TyphonProduct;
}

export const TyphonProductSingle: React.FC<TyphonProductSingleProps> = ({ product }) => {
  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Thumbnails stay on a single row of 4; the 4th tile shows a "+N" overlay for
  // any extra images, and clicking it reveals the full set.
  const [thumbsExpanded, setThumbsExpanded] = useState(false);
  const showAllThumbs = thumbsExpanded || gallery.length <= 4;
  const visibleThumbs = showAllThumbs ? gallery : gallery.slice(0, 4);
  const hiddenThumbCount = gallery.length - 4;

  // Full description, split into readable intro paragraphs + feature points.
  const descriptionBlocks = useMemo(
    () => buildDescriptionBlocks(product.description, product.tagline),
    [product.description, product.tagline]
  );

  useEffect(() => {
    setActiveImage(0);
    setThumbsExpanded(false);
    setLightboxOpen(false);
  }, [product.id]);

  const relatedProducts = useMemo(() => {
    const sameCategory = typhonProducts.filter(
      (item) =>
        item.id !== product.id &&
        item.category === product.category &&
        item.productType === product.productType,
    );
    const fallback = typhonProducts.filter(
      (item) => item.id !== product.id && item.productType === product.productType && item.category !== product.category,
    );
    const finalFallback = typhonProducts.filter(
      (item) => item.id !== product.id && item.productType !== product.productType,
    );
    return [...sameCategory, ...fallback, ...finalFallback].slice(0, 4);
  }, [product]);

  const buyUrl = getTyphonBuyUrl(product);
  // Ecwid product id for this machine (present only when it exists in the store).
  const ecwidId = getEcwidProductId(product.id);

  // Comparison candidates: ONLY machines from the same category (excavators vs
  // excavators, forklifts vs forklifts, etc.). Never cross-category.
  const comparisonCandidates = useMemo<ComparableMachine[]>(
    () =>
      typhonProducts
        .filter(
          (item) =>
            item.id !== product.id &&
            item.category === product.category &&
            item.productType === product.productType
        )
        .map(toComparable),
    [product]
  );

  return (
    <main className="bg-[#282828] text-white">
      <section className="mx-auto flex w-full max-w-[1480px] flex-col gap-8 px-4 pb-12 pt-24 sm:px-6 lg:px-10 lg:pb-16 lg:pt-32">
        <nav className="flex flex-wrap items-center gap-2 text-[13px] text-[#d8c79a]" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <span className="text-white/55">/</span>
          <Link to="/typhon-machinery" className="hover:text-white">
            Typhon Machinery
          </Link>
          <span className="text-white/55">/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        {/* Image column is sized so the square placeholder renders ~27% smaller
            than the original full-width layout; info column expands to fill. */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.69fr)_minmax(420px,1fr)] lg:items-start">
          <section aria-label="Product image gallery" className="min-w-0">
            <div className="relative aspect-square w-full bg-neutral-100">
              <img
                src={gallery[activeImage] ?? product.image}
                alt={product.name}
                onClick={() => setLightboxOpen(true)}
                className="h-full w-full cursor-zoom-in object-cover"
              />
              {/* View full image */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="View full image"
                title="View full image"
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center bg-black/55 text-white transition hover:bg-[#d8c79a] hover:text-[#153d28]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage((i) => (i - 1 + gallery.length) % gallery.length)
                    }
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-black/55 text-white transition hover:bg-[#d8c79a] hover:text-[#153d28]"
                  >
                    <svg width="11" height="18" viewBox="0 0 11 18" fill="none" aria-hidden="true">
                      <path d="M10 1L2 9l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImage((i) => (i + 1) % gallery.length)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-black/55 text-white transition hover:bg-[#d8c79a] hover:text-[#153d28]"
                  >
                    <svg width="11" height="18" viewBox="0 0 11 18" fill="none" aria-hidden="true">
                      <path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {visibleThumbs.map((image, index) => {
                const isOverflowTile = !showAllThumbs && index === 3 && hiddenThumbCount > 0;
                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => {
                      setActiveImage(index);
                      if (isOverflowTile) setThumbsExpanded(true);
                    }}
                    aria-label={
                      isOverflowTile
                        ? `Show ${hiddenThumbCount} more ${product.name} images`
                        : `View ${product.name} image ${index + 1}`
                    }
                    className={`relative aspect-square bg-neutral-100 p-1.5 transition ${
                      activeImage === index && !isOverflowTile
                        ? "ring-4 ring-[#d8c79a]"
                        : "ring-1 ring-white/10 hover:ring-[#d8c79a]/70"
                    }`}
                  >
                    <img src={image} alt="" aria-hidden="true" className="h-full w-full object-contain" />
                    {isOverflowTile && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/60 font-googleSans text-2xl font-bold text-white transition hover:bg-black/50">
                        +{hiddenThumbCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="min-w-0 lg:pt-6" aria-labelledby="typhon-product-title">
            <p className="font-googleSans text-xs font-bold uppercase tracking-wide text-[#d8c79a]">
              {product.categoryLabel}
            </p>
            <h1
              id="typhon-product-title"
              className="mt-2.5 font-clofieBold text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
            >
              {product.name}
            </h1>
            <p className="mt-3.5 max-w-xl font-glonimove text-lg leading-7 text-white/82">
              {product.tagline}
            </p>

            <div className="mt-7 grid gap-2.5" aria-label="Product specifications">
              {product.specs.slice(1, 5).map((spec) => (
                <div key={spec.label} className="grid grid-cols-[140px_minmax(0,1fr)] items-center gap-4 border-b border-white/14 py-2.5">
                  <span className="font-glonimove text-[13px] text-white/62">{spec.label}</span>
                  <strong className="font-googleSans text-sm text-white">{spec.value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-7 space-y-3">
              {/* ── Primary purchase actions ── */}
              <div className="flex flex-col gap-2.5 sm:flex-row">
                {/* Add to Cart — only when this machine exists in the Ecwid
                    store (matched by SKU). Adds the exact product to the cart. */}
                {ecwidId && (
                  <AddToCartButton
                    ecwidId={ecwidId}
                    className="flex-1 inline-flex min-h-[52px] items-center justify-center gap-2 bg-[#d8c79a] px-6 font-googleSans text-[15px] font-bold text-[#153d28] shadow-[0_6px_20px_rgba(216,199,154,0.25)] transition hover:bg-white disabled:opacity-70"
                  />
                )}
                {buyUrl && (
                  <a
                    href={buyUrl}
                    className={`flex-1 inline-flex min-h-[52px] items-center justify-center gap-2 px-6 font-googleSans text-[15px] font-bold transition ${
                      ecwidId
                        ? "border-2 border-[#d8c79a] text-[#d8c79a] hover:bg-[#d8c79a] hover:text-[#153d28]"
                        : "bg-[#d8c79a] text-[#153d28] shadow-[0_6px_20px_rgba(216,199,154,0.25)] hover:bg-white"
                    }`}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                    </svg>
                    Buy Now
                  </a>
                )}
              </div>

              {/* ── Secondary actions ── */}
              <div className="flex items-stretch gap-2.5">
                <Link
                  to={`/contact?product=${product.id}&brand=typhon`}
                  className="flex flex-1 min-h-[44px] items-center justify-center gap-2 border border-white/20 px-4 font-googleSans text-sm font-medium text-white/85 transition hover:border-white/60 hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Request a Quote
                </Link>
                <ShareMenu
                  title={product.name}
                  className="flex min-h-[44px] items-center justify-center gap-2 border border-white/20 px-4 font-googleSans text-sm font-medium text-white/85 transition hover:border-white/60 hover:text-white"
                />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#202020]">
        <div className="mx-auto grid max-w-[1480px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-10">
          {[
            ["Series", product.series],
            ["Category", product.categoryLabel],
            ["Weight Class", product.weight],
          ].map(([label, value]) => (
            <div key={label} className="border-l-4 border-[#d8c79a] pl-5">
              <p className="font-glonimove text-sm text-white/58">{label}</p>
              <p className="mt-2 font-googleSans text-lg font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1480px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10 lg:py-20">
        <article>
          <h2 className="font-clofieBold text-4xl font-bold text-white">Product Description</h2>
          <div className="mt-6 h-1.5 w-full bg-[#d9d9d9]" />

          {descriptionBlocks.fallback ? (
            <p className="mt-8 max-w-4xl font-glonimove text-lg leading-8 text-white/78">
              {DESCRIPTION_FALLBACK}
            </p>
          ) : (
            <div className="mt-8 max-w-5xl">
              {descriptionBlocks.blocks.map((block, index) => {
                if (block.kind === "heading") {
                  return (
                    <div key={index} className="mt-10 border-l-4 border-[#d8c79a] pl-4 first:mt-0">
                      <h3 className="font-googleSans text-2xl font-bold leading-tight text-white">
                        {block.text}
                      </h3>
                    </div>
                  );
                }
                if (block.kind === "paragraph") {
                  return (
                    <p
                      key={index}
                      className="mt-4 font-glonimove text-lg leading-8 text-white/78"
                    >
                      <LeadParagraph text={block.text} emphasizeLead={index === 0} />
                    </p>
                  );
                }
                if (block.kind === "table") {
                  return (
                    <div key={index} className="mt-8 overflow-hidden border border-white/12 bg-[#232323]">
                      <div className="border-b border-white/10 bg-[#1f1f1f] px-5 py-4">
                        <h3 className="font-googleSans text-xl font-bold text-white">
                          {block.title}
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] border-collapse text-left">
                          <caption className="sr-only">{block.title}</caption>
                          <tbody className="divide-y divide-white/10">
                            {block.rows.map((row) => (
                              <tr key={`${row.label}-${row.value}`}>
                                <th
                                  scope="row"
                                  className="w-[34%] bg-white/[0.03] px-5 py-3 align-top font-googleSans text-[13px] font-bold text-[#d8c79a]"
                                >
                                  {row.label}
                                </th>
                                <td className="px-5 py-3 align-top font-glonimove text-[15px] leading-7 text-white/84">
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }
                return (
                  <ul key={index} className="mt-5 space-y-3.5">
                    {block.items.map((feature, i) => (
                      <li
                        key={i}
                        className="flex gap-3 font-glonimove text-lg leading-8 text-white/78"
                      >
                        <span className="mt-3 h-2 w-2 shrink-0 bg-[#d8c79a]" />
                        <span>
                          {feature.title && (
                            <strong className="font-googleSans font-bold text-white">
                              {feature.title}.{" "}
                            </strong>
                          )}
                          {feature.body}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              })}
            </div>
          )}

          <div className="mt-10">
            <h3 className="font-googleSans text-2xl font-bold text-white">Common Applications</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {product.applications.map((application) => (
                <li key={application} className="flex gap-3 font-glonimove text-white/76">
                  <span className="mt-2 h-2 w-2 shrink-0 bg-[#d8c79a]" />
                  <span>{application}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="border-t border-white/18 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h2 className="font-clofieBold text-4xl font-bold text-white">Need Help?</h2>
          <div className="mt-6 h-1.5 w-full bg-[#d9d9d9]" />
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-googleSans text-2xl font-bold text-white">Product Help</h3>
              <Link to={`/contact?product=${product.id}&brand=typhon`} className="mt-3 block font-glonimove text-xl text-[#e8e8e8] hover:text-[#d8c79a]">
                Request configuration support
              </Link>
            </div>
            <div>
              <h3 className="font-googleSans text-2xl font-bold text-white">Compare Category</h3>
              <Link to={`/typhon-machinery?category=${product.category}`} className="mt-3 block font-glonimove text-xl text-[#e8e8e8] hover:text-[#d8c79a]">
                View {product.categoryLabel} models
              </Link>
            </div>
            <div>
              <h3 className="font-googleSans text-2xl font-bold text-white">Product Source</h3>
              {product.sourceUrl ? (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block font-glonimove text-xl text-[#e8e8e8] hover:text-[#d8c79a]"
                >
                  View original Typhon record
                </a>
              ) : (
                <p className="mt-3 font-glonimove text-lg leading-7 text-[#e8e8e8]">
                  Imported from the Typhon Machinery CSV.
                </p>
              )}
            </div>
          </div>
        </aside>
      </section>

      <MachineComparison
        current={toComparable(product)}
        candidates={comparisonCandidates}
        categoryLabel={product.categoryLabel}
        variant="typhon"
        buyLabel="View Product"
      />

      <section className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
        <div className="flex flex-col justify-between gap-4 border-t border-white/14 pt-10 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-clofieBold text-4xl font-bold text-white">Related Products</h2>
            <p className="mt-2 font-glonimove text-white/64">Typhon products from the same category and product type appear first.</p>
          </div>
          <Link to="/typhon-machinery" className="font-googleSans text-sm font-bold uppercase text-[#d8c79a] hover:text-white">
            View Typhon Catalog
          </Link>
        </div>

        <div className="mt-8 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <TyphonProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <ImageLightbox
        images={gallery}
        index={activeImage}
        open={lightboxOpen}
        alt={product.name}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setActiveImage}
      />
    </main>
  );
};

export default TyphonProductSingle;
