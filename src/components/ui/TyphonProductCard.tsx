import React from "react";
import { Link } from "react-router-dom";
import { TyphonProduct, getTyphonProductHref } from "../../data/typhonProducts";
import { useI18n } from "../../context/I18nContext";

interface TyphonProductCardProps {
  product: TyphonProduct;
}

/**
 * Typhon product card — mirrors the Konstructz `ProductCard` layout, typography,
 * colours, hover behaviour and responsive sizing exactly, but typed for
 * `TyphonProduct` data and linked to the Typhon single-product route.
 */
export const TyphonProductCard: React.FC<TyphonProductCardProps> = ({ product }) => {
  const { t } = useI18n();
  const detailHref = getTyphonProductHref(product);
  const quoteHref = `/contact?product=${product.id}`;

  return (
    <article className="group bg-[#d9d9d9] w-full max-w-[293px] mx-auto flex flex-col text-[#153d28] k-card-hover rounded-sm overflow-hidden border border-[#153d28]/10">
      {/* IMAGE AREA + WEIGHT BADGE */}
      <Link
        to={detailHref}
        aria-label={t("product.viewDetailsFor", { values: { name: product.name }, fallback: `View details for ${product.name}` })}
        className="relative block aspect-[293/315] overflow-hidden k-image-zoom focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#153d28]"
      >
        <span className="absolute top-3 left-3 z-10 bg-[#153d28] text-[#d9d9d9] border border-[#d8c79a]/40 px-2.5 py-1 [font-family:'Google_Sans_Flex',Helvetica] text-[10px] font-bold uppercase tracking-wider">
          {product.weight || product.categoryLabel}
        </span>

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="k-image absolute inset-0 m-auto w-[86%] h-[82%] object-contain"
        />
      </Link>

      {/* TITLE + CATEGORY ROW */}
      <div className="px-3 pt-2 flex items-start justify-between gap-2 min-h-[58px]">
        <h3 className="[font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-xl sm:text-2xl leading-tight flex-1 min-w-0 truncate">
          <Link to={detailHref} className="hover:opacity-80 transition-opacity">
            {product.name}
          </Link>
        </h3>
        <span className="[font-family:'Google_Sans_Flex',Helvetica] font-bold text-black/65 text-[11px] uppercase tracking-wide text-right max-w-[92px] shrink-0 leading-tight">
          {product.categoryLabel}
        </span>
      </div>

      {/* Top divider line */}
      <div className="mx-2.5 mt-2 h-0.5 bg-[#153d28]" />

      {/* SHORT DESCRIPTION — real CSV short description, clamped */}
      <div className="px-3 py-2 min-h-[82px]">
        <p
          className="[font-family:'Glonimove-Regular',Helvetica] font-normal text-[#3a3a3a] text-[13px] leading-[1.45]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.tagline}
        </p>
      </div>

      {/* Bottom divider line */}
      <div className="mx-2 mb-2 h-0.5 bg-[#153d28]" />

      {/* ACTION BUTTONS */}
      <div className="px-2 pb-3 flex items-stretch gap-2">
        <Link
          to={quoteHref}
          aria-label={`Request quote for ${product.name}`}
          className="w-[40%] min-w-[100px] h-[36px] border-2 border-[#153d28] text-[#153d28] [font-family:'Google_Sans_Flex',Helvetica] text-sm sm:text-[15px] inline-flex items-center justify-center gap-1.5 hover:bg-[#153d28] hover:text-[#d9d9d9] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153d28]"
        >
          <span>Quote</span>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link
          to={detailHref}
          aria-label={`View details for ${product.name}`}
          className="flex-1 h-[36px] bg-[#153d28] text-[#d9d9d9] [font-family:'Google_Sans_Flex',Helvetica] text-sm sm:text-[15px] inline-flex items-center justify-center gap-1.5 hover:bg-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153d28]"
        >
          <span>VIEW DETAILS</span>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  );
};
