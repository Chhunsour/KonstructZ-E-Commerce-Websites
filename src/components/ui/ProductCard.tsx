import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../data/products";
import { useI18n } from "../../context/I18nContext";

interface ProductCardProps {
  product: Product;
}

/**
 * Konstructz catalog card.
 * Keeps model identity clear while using safe planning values until final specs
 * are confirmed for each configuration.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useI18n();
  const detailHref = `/equipment/${product.id}`;
  const quoteHref = `/contact?product=${product.id}`;

  return (
    <article className="group bg-[#d9d9d9] w-full max-w-[293px] mx-auto flex flex-col text-[#153d28] k-card-hover rounded-sm overflow-hidden border border-[#153d28]/10">
      {/* IMAGE AREA + WEIGHT BADGE */}
      <Link
        to={detailHref}
        aria-label={t("product.viewDetailsFor", { values: { name: product.name }, fallback: `View details for ${product.name}` })}
        className="relative block aspect-[293/315] overflow-hidden k-image-zoom focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#153d28]"
      >
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-[#153d28] text-[#d9d9d9] border border-[#d8c79a]/40 px-2 py-0.5 sm:px-2.5 sm:py-1 [font-family:'Google_Sans_Flex',Helvetica] text-[8px] sm:text-[10px] font-bold uppercase tracking-wider">
          {product.weight}
        </span>

        {/* Product image (centered, contained so shadows/details aren't cropped) */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="k-image absolute inset-0 m-auto w-[86%] h-[82%] object-contain"
        />
      </Link>

      {/* TITLE + CATEGORY ROW */}
      <div className="px-2.5 sm:px-3 pt-2 flex items-start justify-between gap-1.5 min-h-[48px] sm:min-h-[58px]">
        <h3 className="[font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-base sm:text-2xl leading-tight flex-1 min-w-0 truncate">
          <Link to={detailHref} className="hover:opacity-80 transition-opacity">
            {product.name}
          </Link>
        </h3>
        <span className="[font-family:'Google_Sans_Flex',Helvetica] font-bold text-black/65 text-[9px] sm:text-[11px] uppercase tracking-wide text-right max-w-[92px] shrink-0 leading-tight">
          {product.categoryLabel}
        </span>
      </div>

      {/* Top divider line */}
      <div className="mx-2.5 mt-1.5 sm:mt-2 h-0.5 bg-[#153d28]" />

      {/* SPEC ROWS — first two product specs, with safe fallbacks */}
      <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 flex flex-col gap-1.5 sm:gap-2 min-h-[64px] sm:min-h-[82px]">
        {[0, 1].map((i) => {
          const spec = product.specs?.[i];
          const label = spec?.label ?? (i === 0 ? "Category" : "Class");
          const value = spec?.value ?? (i === 0 ? product.categoryLabel : product.weight);
          return (
            <div key={i} className="grid grid-cols-[0.85fr_1.15fr] items-start gap-1.5 sm:gap-3">
              <span className="[font-family:'Glonimove-Regular',Helvetica] font-normal text-[#3a3a3a] text-xs sm:text-sm leading-tight truncate">
                {label}
              </span>
              <span className="[font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#153d28] text-[10px] sm:text-[12px] leading-snug text-right truncate">
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom divider line */}
      <div className="mx-2 mb-1.5 sm:mb-2 h-0.5 bg-[#153d28]" />

      {/* ACTION BUTTONS */}
      <div className="px-2 pb-2.5 sm:pb-3 flex items-stretch gap-1.5 sm:gap-2">
        <Link
          to={quoteHref}
          aria-label={`Request quote for ${product.name}`}
          className="w-[35%] sm:w-[40%] min-w-[50px] sm:min-w-[100px] h-[32px] sm:h-[36px] border-2 border-[#153d28] text-[#153d28] [font-family:'Google_Sans_Flex',Helvetica] text-[10px] sm:text-[15px] inline-flex items-center justify-center gap-1 hover:bg-[#153d28] hover:text-[#d9d9d9] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153d28]"
        >
          <span>Quote</span>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true" className="hidden sm:block">
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link
          to={detailHref}
          aria-label={`View details for ${product.name}`}
          className="flex-1 h-[32px] sm:h-[36px] bg-[#153d28] text-[#d9d9d9] [font-family:'Google_Sans_Flex',Helvetica] text-[10px] sm:text-[15px] inline-flex items-center justify-center gap-1 hover:bg-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153d28]"
        >
          <span>VIEW DETAILS</span>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true" className="hidden sm:block">
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  );
};
