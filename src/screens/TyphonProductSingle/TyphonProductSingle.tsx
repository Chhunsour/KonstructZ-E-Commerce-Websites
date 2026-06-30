import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TyphonProduct } from "../../data/typhonProducts";
import {
  buildDescriptionBlocks,
  DESCRIPTION_FALLBACK,
} from "./formatDescription";
import { useProducts } from "../../context/ProductsContext";
import ProductMarkdown from "../../components/product/ProductMarkdown";
import { TyphonProductCard } from "../../components/ui/TyphonProductCard";
import {
  MachineComparison,
  ComparableMachine,
} from "../../components/product/MachineComparison";
import { ImageLightbox } from "../../components/product/ImageLightbox";
import { ShareMenu } from "../../components/product/ShareMenu";
import { AddToCartButton } from "../../components/product/AddToCartButton";
import { getEcwidProductId } from "../../data/ecwidProductIds";
import { useI18n } from "../../context/I18nContext";
import { normalizeBrandCopy } from "../../lib/brandCopy";

const translateSpecLabel = (label: string, t: any): string => {
  const specKey = `spec.${label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}`;
  return t(specKey, { fallback: label });
};

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
  fallbackImage: product.originalImageSource,
  specs: product.specs,
  priceLabel: product.currentPrice || undefined,
  weightLabel: product.weight || undefined,
  features: product.features,
  buyUrl: getTyphonBuyUrl(product),
});

const useFallbackImage = (
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string | undefined,
) => {
  const img = event.currentTarget;
  if (!fallback || img.dataset.fallbackApplied === "true") return;
  img.dataset.fallbackApplied = "true";
  img.src = fallback;
};

const LeadParagraph: React.FC<{ text: string; emphasizeLead?: boolean }> = ({
  text,
  emphasizeLead = false,
}) => {
  if (!emphasizeLead) return <>{text}</>;

  const match = text.match(/^(.+?[.!?])\s+(.+)$/s);
  if (!match) return <>{text}</>;

  return (
    <>
      <strong className="font-googleSans font-bold text-neutral-900">{match[1]}</strong>{" "}
      {match[2]}
    </>
  );
};

interface TyphonProductSingleProps {
  product: TyphonProduct;
}

export const TyphonProductSingle: React.FC<TyphonProductSingleProps> = ({ product }) => {
  const { t } = useI18n();
  const { typhon: typhonProducts, getDbProduct } = useProducts();
  const displayTagline = normalizeBrandCopy(product.tagline);
  // When this product is backed by a published DB row, render its rich
  // (Markdown) description; otherwise fall back to the parsed static blocks.
  const richDescription = getDbProduct("typhon", product.id)?.full_description?.trim();
  const localGallery = product.gallery.filter(Boolean);
  const originalGallery = product.originalGallerySources?.filter(Boolean) ?? [];
  const baseGallery =
    localGallery.length > 0
      ? localGallery
      : originalGallery.length > 0
        ? originalGallery
        : [product.image, product.originalImageSource].filter(Boolean);
  // Lead with the feature image (product.image = featured_image), de-duplicated,
  // so the single page opens on the same image shown on the card.
  const feat = product.image;
  const gallery = feat
    ? [feat, ...baseGallery.filter((u) => u && u !== feat)]
    : baseGallery;
  const fallbackGallery =
    originalGallery.length > 0 ? originalGallery : [product.originalImageSource].filter(Boolean);
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
    <main className="bg-[#fafafc] dark:bg-[#282828] text-neutral-800 dark:text-white transition-colors duration-200">
      <section className="mx-auto flex w-full max-w-[1480px] flex-col gap-8 px-4 pb-12 pt-24 sm:px-6 lg:px-10 lg:pb-16 lg:pt-32">
        <nav className="flex flex-wrap items-center gap-2 text-[13px] text-[#8c7a52] dark:text-[#d8c79a]" aria-label={t("allProducts.breadcrumbs", { fallback: "Breadcrumb" })}>
          <Link to="/" className="hover:text-[#153d28] dark:hover:text-[#d8c79a] text-neutral-600 dark:text-white/60 transition-colors">
            {t("nav.home", { fallback: "Home" })}
          </Link>
          <span className="text-neutral-400 dark:text-white/30">/</span>
          <Link to="/typhon-machinery" className="hover:text-[#153d28] dark:hover:text-[#d8c79a] text-neutral-600 dark:text-white/60 transition-colors">
            {t("nav.typhonMachinery", { fallback: "Typhon" })}
          </Link>
          <span className="text-neutral-400 dark:text-white/30">/</span>
          <span className="text-neutral-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        {/* Image column is sized so the square placeholder renders ~27% smaller
            than the original full-width layout; info column expands to fill. */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.69fr)_minmax(420px,1fr)] lg:items-start">
          <section aria-label="Product image gallery" className="min-w-0">
            <div className="relative aspect-[4/3] w-full bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-white/10 shadow-sm rounded-sm sm:aspect-square transition-colors">
              <img
                src={gallery[activeImage] ?? product.image}
                alt={product.name}
                onClick={() => setLightboxOpen(true)}
                onError={(event) =>
                  useFallbackImage(
                    event,
                    fallbackGallery[activeImage] || product.originalImageSource,
                  )
                }
                className="h-full w-full cursor-zoom-in object-cover"
              />
              {/* View full image */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={t("product.viewFullImage", { fallback: "View full image" })}
                title={t("product.viewFullImage", { fallback: "View full image" })}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center bg-neutral-900/60 text-white transition hover:bg-[#153d28] hover:text-white"
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
                    aria-label={t("product.prevImage", { fallback: "Previous image" })}
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-neutral-900/60 text-white transition hover:bg-[#153d28] hover:text-white"
                  >
                    <svg width="11" height="18" viewBox="0 0 11 18" fill="none" aria-hidden="true">
                      <path d="M10 1L2 9l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImage((i) => (i + 1) % gallery.length)}
                    aria-label={t("product.nextImage", { fallback: "Next image" })}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-neutral-900/60 text-white transition hover:bg-[#153d28] hover:text-white"
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
                        ? t("product.showMoreImages", { values: { count: hiddenThumbCount, name: product.name }, fallback: `Show ${hiddenThumbCount} more ${product.name} images` })
                        : t("product.viewImageIndex", { values: { name: product.name, index: index + 1 }, fallback: `View ${product.name} image ${index + 1}` })
                    }
                    className={`relative aspect-square bg-white dark:bg-[#1e1e1e] p-1.5 transition rounded-sm shadow-sm ${
                      activeImage === index && !isOverflowTile
                        ? "ring-4 ring-[#153d28]"
                        : "ring-1 ring-neutral-200 dark:ring-white/10 hover:ring-[#153d28]/70 dark:hover:ring-[#d8c79a]/80"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      aria-hidden="true"
                      onError={(event) =>
                        useFallbackImage(
                          event,
                          fallbackGallery[index] || product.originalImageSource,
                        )
                      }
                      className="h-full w-full object-contain"
                    />
                    {isOverflowTile && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/60 font-googleSans text-2xl font-bold text-white transition hover:bg-black/50 rounded-sm">
                        +{hiddenThumbCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="min-w-0 lg:pt-6" aria-labelledby="typhon-product-title">
            <p className="font-googleSans text-xs font-bold uppercase tracking-wide text-[#153d28] dark:text-[#d8c79a]">
              {t(`category.${product.category}`, { fallback: product.categoryLabel })}
            </p>
            <h1
              id="typhon-product-title"
              className="mt-2.5 font-clofieBold text-4xl font-bold leading-[1.05] text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              {product.name}
            </h1>
            <p className="mt-3.5 max-w-xl font-glonimove text-lg leading-7 text-neutral-600 dark:text-white">
              {displayTagline}
            </p>

            <div className="mt-7 grid gap-2.5" aria-label={t("product.specifications", { fallback: "Product specifications" })}>
              {product.specs.slice(1, 5).map((spec) => (
                <div key={spec.label} className="grid grid-cols-[140px_minmax(0,1fr)] items-center gap-4 border-b border-neutral-200 dark:border-white/10 py-2.5">
                  <span className="font-glonimove text-[13px] text-neutral-500 dark:text-white/60">{translateSpecLabel(spec.label, t)}</span>
                  <strong className="font-googleSans text-sm text-neutral-800 dark:text-white">{spec.value}</strong>
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
                    className="flex-1 inline-flex min-h-[52px] items-center justify-center gap-2 bg-[#d8c79a] px-6 font-googleSans text-[15px] font-bold text-[#153d28] shadow-[0_6px_20px_rgba(216,199,154,0.15)] transition hover:bg-[#153d28] hover:text-white disabled:opacity-70 rounded-sm"
                  />
                )}
                {buyUrl && (
                  <a
                    href={buyUrl}
                    className={`flex-1 inline-flex min-h-[52px] items-center justify-center gap-2 px-6 font-googleSans text-[15px] font-bold transition rounded-sm ${
                      ecwidId
                        ? "border-2 border-solid border-[#153d28] dark:border-[#d8c79a] text-[#153d28] dark:text-[#d8c79a] hover:bg-[#153d28] dark:hover:bg-[#d8c79a] hover:text-white dark:hover:text-[#153d28]"
                        : "bg-[#153d28] dark:bg-[#d8c79a] text-white dark:text-[#153d28] shadow-[0_6px_20px_rgba(21,61,40,0.15)] hover:bg-neutral-800 dark:hover:bg-white"
                    }`}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                    </svg>
                    {t("action.buyNow", { fallback: "Buy Now" })}
                  </a>
                )}
              </div>

              {/* ── Secondary actions ── */}
              <div className="flex items-stretch gap-2.5">
                <Link
                  to={`/contact?product=${product.id}&brand=typhon`}
                  className="flex flex-1 min-h-[44px] items-center justify-center gap-2 border border-solid border-neutral-300 dark:border-white/10 px-4 font-googleSans text-sm font-medium text-neutral-600 dark:text-white/80 transition hover:border-neutral-500 dark:hover:border-white/30 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-[#232323] shadow-sm rounded-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {t("action.requestAQuote", { fallback: "Request a Quote" })}
                </Link>
                <ShareMenu
                  title={product.name}
                  className="flex min-h-[44px] items-center justify-center gap-2 border border-solid border-neutral-300 dark:border-white/10 px-4 font-googleSans text-sm font-medium text-neutral-600 dark:text-white/80 transition hover:border-neutral-500 dark:hover:border-white/30 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-[#232323] shadow-sm rounded-sm"
                />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="border-y border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#1e1e1e] transition-colors">
        <div className="mx-auto grid max-w-[1480px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-10">
          {[
            [t("product.series", { fallback: "Series" }), product.series],
            [t("equipment.categories", { fallback: "Category" }), t(`category.${product.category}`, { fallback: product.categoryLabel })],
            [t("catalog.filters.weight", { fallback: "Weight Class" }), product.weight],
          ].map(([label, value]) => (
            <div key={label} className="border-l-4 border-[#153d28] dark:border-[#d8c79a] pl-5">
              <p className="font-glonimove text-sm text-neutral-500 dark:text-white/50">{label}</p>
              <p className="mt-2 font-googleSans text-lg font-bold text-neutral-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1480px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10 lg:py-20">
        <article className="min-w-0">
          <h2 className="font-clofieBold text-4xl font-bold text-neutral-900 dark:text-white">{t("product.descriptionHeader", { fallback: "Product Description" })}</h2>
          <div className="mt-6 h-1.5 w-full bg-[#153d28] dark:bg-[#d8c79a]" />

          {richDescription ? (
            <div className="mt-8 max-w-5xl font-glonimove text-lg leading-8 text-neutral-700 dark:text-white [&_h1]:text-neutral-900 dark:[&_h1]:text-white [&_h2]:text-neutral-900 dark:[&_h2]:text-white [&_h2]:font-clofieBold [&_h2]:text-2xl [&_h3]:text-neutral-900 dark:[&_h3]:text-white [&_h3]:font-bold [&_strong]:text-neutral-900 dark:[&_strong]:text-white [&_a]:text-[#153d28] dark:[&_a]:text-[#d8c79a] [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1 [&_p]:mt-4 transition-colors">
              <ProductMarkdown content={richDescription} />
            </div>
          ) : descriptionBlocks.fallback ? (
            <p className="mt-8 max-w-4xl font-glonimove text-lg leading-8 text-neutral-600 dark:text-white transition-colors">
              {t("product.descriptionFallback", { fallback: DESCRIPTION_FALLBACK })}
            </p>
          ) : (
            <div className="mt-8 max-w-5xl">
              {descriptionBlocks.blocks.map((block, index) => {
                if (block.kind === "heading") {
                  return (
                    <div key={index} className="mt-10 border-l-4 border-[#153d28] dark:border-[#d8c79a] pl-4 first:mt-0 transition-colors">
                      <h3 className="font-googleSans text-2xl font-bold leading-tight text-neutral-900 dark:text-white">
                        {block.text}
                      </h3>
                    </div>
                  );
                }
                if (block.kind === "paragraph") {
                  return (
                    <p
                      key={index}
                      className="mt-4 font-glonimove text-lg leading-8 text-neutral-600 dark:text-white transition-colors"
                    >
                      <LeadParagraph text={block.text} emphasizeLead={index === 0} />
                    </p>
                  );
                }
                if (block.kind === "table") {
                  return (
                    <div key={index} className="mt-8 overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#181818] shadow-sm rounded-none transition-colors">
                      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#202020] px-6 py-4 transition-colors">
                        <h3 className="font-googleSans text-sm font-bold text-[#153d28] dark:text-[#d8c79a] uppercase tracking-wider">
                          {block.title}
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] border-collapse text-left">
                          <caption className="sr-only">{block.title}</caption>
                          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
                            {block.rows.map((row) => (
                              <tr key={`${row.label}-${row.value}`} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10 transition-colors">
                                <th
                                  scope="row"
                                  className="w-[34%] bg-neutral-50/20 dark:bg-neutral-900/40 px-6 py-4 align-top font-googleSans text-[13px] font-bold text-neutral-600 dark:text-neutral-400 border-r border-neutral-200/60 dark:border-neutral-800/60 transition-colors"
                                >
                                  {translateSpecLabel(row.label, t)}
                                </th>
                                <td className="px-6 py-4 align-top font-glonimove text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
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
                        className="flex gap-3 font-glonimove text-lg leading-8 text-neutral-600 dark:text-white"
                      >
                        <span className="mt-3 h-2 w-2 shrink-0 bg-[#153d28] dark:bg-[#d8c79a]" />
                        <span>
                          {feature.title && (
                            <strong className="font-googleSans font-bold text-neutral-900 dark:text-white">
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
            <h3 className="font-googleSans text-2xl font-bold text-neutral-900 dark:text-white">{t("product.commonApplications", { fallback: "Common Applications" })}</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {product.applications.map((application) => (
                <li key={application} className="flex gap-3 font-glonimove text-neutral-650 dark:text-white">
                  <span className="mt-2 h-2 w-2 shrink-0 bg-[#153d28] dark:bg-[#d8c79a]" />
                  <span>{application}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="border-t lg:border-t-0 border-neutral-200 dark:border-white/10 pt-8 lg:border-l lg:border-neutral-200 lg:dark:border-white/10 lg:pl-8 lg:pt-0">
          <h2 className="font-clofieBold text-4xl font-bold text-neutral-900 dark:text-white">{t("product.needHelp", { fallback: "Need Help?" })}</h2>
          <div className="mt-6 h-1.5 w-full bg-[#153d28] dark:bg-[#d8c79a]" />
          <div className="mt-8 space-y-4">
            <div className="group relative border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-[#151515] p-5 transition-all duration-300 hover:border-[#153d28]/40 dark:hover:border-[#d8c79a]/40 hover:bg-neutral-50/60 dark:hover:bg-[#1a1a1a]">
              <h3 className="font-googleSans text-sm font-bold uppercase tracking-wider text-[#153d28] dark:text-[#d8c79a]">{t("product.productHelp", { fallback: "Product Help" })}</h3>
              <Link to={`/contact?product=${product.id}&brand=typhon`} className="mt-2.5 flex items-center justify-between gap-4 font-glonimove text-base text-neutral-800 dark:text-neutral-200">
                <span>{t("product.requestSupport", { fallback: "Request configuration support" })}</span>
                <svg className="w-5 h-5 shrink-0 text-neutral-400 group-hover:text-[#153d28] dark:group-hover:text-[#d8c79a] group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="group relative border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-[#151515] p-5 transition-all duration-300 hover:border-[#153d28]/40 dark:hover:border-[#d8c79a]/40 hover:bg-neutral-50/60 dark:hover:bg-[#1a1a1a]">
              <h3 className="font-googleSans text-sm font-bold uppercase tracking-wider text-[#153d28] dark:text-[#d8c79a]">{t("product.compareCategory", { fallback: "Compare Category" })}</h3>
              <Link to={`/typhon-machinery?category=${product.category}`} className="mt-2.5 flex items-center justify-between gap-4 font-glonimove text-base text-neutral-800 dark:text-neutral-200">
                <span>{t("product.viewCategoryModels", { values: { category: t(`category.${product.category}`, { fallback: product.categoryLabel }) }, fallback: `View ${product.categoryLabel} models` })}</span>
                <svg className="w-5 h-5 shrink-0 text-neutral-400 group-hover:text-[#153d28] dark:group-hover:text-[#d8c79a] group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="group relative border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/30 dark:bg-[#151515] p-5 transition-all duration-300 hover:border-[#153d28]/40 dark:hover:border-[#d8c79a]/40 hover:bg-neutral-50/60 dark:hover:bg-[#1a1a1a]">
              <h3 className="font-googleSans text-sm font-bold uppercase tracking-wider text-[#153d28] dark:text-[#d8c79a]">{t("product.productSource", { fallback: "Product Source" })}</h3>
              {product.sourceUrl ? (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2.5 flex items-center justify-between gap-4 font-glonimove text-base text-neutral-800 dark:text-neutral-200"
                >
                  <span>{t("product.viewOriginalRecord", { fallback: "View original Typhon record" })}</span>
                  <svg className="w-5 h-5 shrink-0 text-neutral-400 group-hover:text-[#153d28] dark:group-hover:text-[#d8c79a] group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <div className="mt-2.5 flex items-center justify-between gap-4 font-glonimove text-base text-neutral-500 dark:text-neutral-400">
                  <span>{t("product.importedFromCsv", { fallback: "Imported from the Typhon CSV." })}</span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </section>

      <MachineComparison
        current={toComparable(product)}
        candidates={comparisonCandidates}
        categoryLabel={t(`category.${product.category}`, { fallback: product.categoryLabel })}
        variant="typhon"
        buyLabel={t("action.viewProduct", { fallback: "View Product" })}
      />

      <section className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
        <div className="flex flex-col justify-between gap-4 border-t border-neutral-200 dark:border-white/10 pt-10 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-clofieBold text-4xl font-bold text-neutral-900 dark:text-white">{t("product.relatedProducts", { fallback: "Related Products" })}</h2>
            <p className="mt-2 font-glonimove text-neutral-500 dark:text-white/60">{t("product.relatedProductsSub", { fallback: "Typhon products from the same category and product type appear first." })}</p>
          </div>
          <Link to="/typhon-machinery" className="font-googleSans text-sm font-bold uppercase text-[#8c7a52] dark:text-[#d8c79a] hover:text-[#153d28] dark:hover:text-white transition-colors">
            {t("product.viewCatalog", { fallback: "View Typhon Catalog" })}
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 items-start gap-2.5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <TyphonProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <ImageLightbox
        images={gallery}
        fallbackImages={fallbackGallery}
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
