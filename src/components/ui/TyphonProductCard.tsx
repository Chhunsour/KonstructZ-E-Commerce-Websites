import React from "react";
import { Link } from "react-router-dom";
import { TyphonProduct, getTyphonProductHref } from "../../data/typhonProducts";
import { useI18n } from "../../context/I18nContext";

interface TyphonProductCardProps {
  product: TyphonProduct;
}

// Quick specs worth comparing across the catalog. Restricted to the two
// CSV-generated fields that are reliably clean and unit-bearing — Weight Class
// and Engine Power. Capacity / Lift Height / Digging Depth are excluded because
// in the source data they're often truncated prose fragments ("of 0", "of 4"),
// which would read as placeholder junk on the card.
const QUICK_SPECS: { label: string; short: string }[] = [
  { label: "Weight Class", short: "Weight" },
  { label: "Engine Power", short: "Power" },
];

const useFallbackImage = (
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string | undefined,
) => {
  const img = event.currentTarget;
  if (!fallback || img.dataset.fallbackApplied === "true") return;
  img.dataset.fallbackApplied = "true";
  img.src = fallback;
};

/**
 * Typhon Machinery catalog card — a clean, bright white card built for scanning
 * many products. Intentionally distinct from the dark Konstructz `ProductCard`,
 * but still links to the Typhon single-product route.
 */
export const TyphonProductCard: React.FC<TyphonProductCardProps> = ({ product }) => {
  const { t } = useI18n();
  const detailHref = getTyphonProductHref(product);
  const quoteHref = `/contact?product=${product.id}`;
  const cardImage = product.originalImageSource || product.thumbnailImage || product.image;
  const fallbackImage =
    cardImage === product.image ? product.originalImageSource : product.image || product.thumbnailImage;

  const quickSpecs = QUICK_SPECS.map((spec) => {
    const match = product.specs?.find(
      (p) => p.label === spec.label && p.value && p.value.trim()
    );
    return match ? { label: spec.short, value: match.value.trim() } : null;
  })
    .filter((s): s is { label: string; value: string } => s !== null)
    .slice(0, 3);

  return (
    <article className="group mx-auto flex h-fit w-full max-w-[293px] flex-col bg-white transition-shadow duration-200 hover:shadow-[0_10px_28px_rgba(21,61,40,0.12)]">
      {/* IMAGE — large, white, uncluttered, consistent height, never cropped */}
      <Link
        to={detailHref}
        aria-label={t("product.viewDetailsFor", {
          values: { name: product.name },
          fallback: `View details for ${product.name}`,
        })}
        className="block bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#153d28]"
      >
        <div className="flex aspect-square items-center justify-center overflow-hidden bg-white p-2">
          <img
            src={cardImage}
            alt={product.name}
            loading="lazy"
            onError={(event) => useFallbackImage(event, fallbackImage)}
            className="h-full w-full object-contain scale-[1.08] transition-transform duration-300 group-hover:scale-[1.12]"
            // Neutralize the cream/beige backdrop baked into some source photos —
            // slight brightness lifts near-white pixels to pure white, mild
            // desaturation removes the yellow cast without dulling the machine.
            style={{ filter: "brightness(1.04) saturate(0.94)" }}
          />
        </div>
      </Link>

      {/* BODY */}
      <div className="flex flex-col px-4 pb-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <p className="font-googleSans text-[10px] font-bold uppercase tracking-[0.08em] text-[#68825B]">
            {product.categoryLabel}
          </p>

          {product.currentPrice && (
            <p className="shrink-0 font-googleSans text-[13px] font-bold leading-none text-[#153d28]">
              {product.currentPrice}
            </p>
          )}
        </div>

        <h3 className="mt-2 font-googleSans text-[15px] font-bold leading-snug text-[#1a1a1a] line-clamp-2">
          <Link to={detailHref} className="transition-colors hover:text-[#153d28]">
            {product.name}
          </Link>
        </h3>

        {/* Quick specs — compact, only what's available */}
        {quickSpecs.length > 0 && (
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {quickSpecs.map((spec) => (
              <div key={spec.label} className="flex min-w-0 flex-col">
                <dt className="font-googleSans text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#9aa09a]">
                  {spec.label}
                </dt>
                <dd className="font-googleSans text-[12.5px] font-semibold leading-tight text-[#1f2420]">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* ACTIONS — sharp-edged, primary View Details + secondary Quote */}
        <div className="flex items-stretch gap-2 pt-4">
          <Link
            to={detailHref}
            aria-label={`View details for ${product.name}`}
            className="flex h-[38px] flex-1 items-center justify-center gap-1.5 bg-[#153d28] font-googleSans text-[14px] font-medium text-white transition-colors hover:bg-[#0e2b1c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153d28]"
          >
            <span>View Details</span>
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
              <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            to={quoteHref}
            aria-label={`Request quote for ${product.name}`}
            className="flex h-[38px] min-w-[88px] items-center justify-center border border-[#153d28] px-3 font-googleSans text-[14px] font-medium text-[#153d28] transition-colors hover:bg-[#153d28] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153d28]"
          >
            Quote
          </Link>
        </div>
      </div>
    </article>
  );
};
