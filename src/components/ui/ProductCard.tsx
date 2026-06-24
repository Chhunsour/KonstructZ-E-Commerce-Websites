import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../data/products";
import { useI18n } from "../../context/I18nContext";

interface ProductCardProps {
  product: Product;
}

/**
 * KonstructZ product card — Figma design.
 * Light grey body, dark green accents, weight badge, image, title + category,
 * two SPEC / N/A rows separated by green divider lines, and Quote / VIEW DETAILS
 * action buttons. Responsive via aspect-based image area and flex layout.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useI18n();
  const detailHref = `/equipment/${product.id}`;
  const quoteHref = `/contact?product=${product.id}`;

  return (
    <article className="group bg-[#d9d9d9] w-full max-w-[293px] mx-auto flex flex-col text-[#153d28] k-card-hover rounded-sm overflow-hidden">
      {/* IMAGE AREA + WEIGHT BADGE */}
      <Link
        to={detailHref}
        aria-label={t("product.viewDetailsFor", { values: { name: product.name }, fallback: `View details for ${product.name}` })}
        className="relative block aspect-[293/315] overflow-hidden k-image-zoom focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#153d28]"
      >
        {/* Weight badge (dumbbell icon with text overlay) */}
        <div className="absolute top-[9px] left-2.5 z-10 w-[41px] h-[49px]">
          <img
            src="/img/kilogram-kg-and-pound-lbs-weight-symbol-icon-dumbbell-vector-ill-12.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <span className="absolute inset-0 flex items-center justify-center pt-[12px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[11px] tracking-[0] leading-none whitespace-nowrap drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
            {product.weight}
          </span>
        </div>

        {/* Product image (centered, contained so shadows/details aren't cropped) */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="k-image absolute inset-0 m-auto w-[86%] h-[82%] object-contain"
        />
      </Link>

      {/* TITLE + CATEGORY ROW */}
      <div className="px-2.5 pt-1 flex items-baseline justify-between gap-2">
        <h3 className="[font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-xl sm:text-2xl leading-tight truncate">
          <Link to={detailHref} className="hover:opacity-80 transition-opacity">
            {product.name}
          </Link>
        </h3>
        <span className="[font-family:'Cal_Sans',Helvetica] font-normal text-black text-[13px] sm:text-[15px] whitespace-nowrap shrink-0">
          {product.categoryLabel}
        </span>
      </div>

      {/* Top divider line */}
      <div className="mx-2.5 mt-2 h-0.5 bg-[#153d28]" />

      {/* SPEC ROWS — first two product specs, with safe fallbacks */}
      <div className="px-2.5 py-2 flex flex-col gap-1">
        {[0, 1].map((i) => {
          const spec = product.specs?.[i];
          const label = spec?.label ?? (i === 0 ? "Category" : "Class");
          const value = spec?.value ?? (i === 0 ? product.categoryLabel : product.weight);
          return (
            <div key={i} className="flex items-center justify-between gap-2">
              <span className="[font-family:'Glonimove-Regular',Helvetica] font-normal text-[#3a3a3a] text-sm sm:text-base leading-tight truncate">
                {label}
              </span>
              <span className="[font-family:'Cal_Sans',Helvetica] font-normal text-[#153d28] text-sm sm:text-base leading-tight whitespace-nowrap shrink-0">
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom divider line */}
      <div className="mx-2 mb-2 h-0.5 bg-[#153d28]" />

      {/* ACTION BUTTONS */}
      <div className="px-2 pb-3 flex items-stretch gap-2">
        <Link
          to={quoteHref}
          aria-label={`Request quote for ${product.name}`}
          className="w-[40%] min-w-[100px] h-[33px] border-2 border-[#153d28] text-[#153d28] [font-family:'Google_Sans_Flex',Helvetica] text-sm sm:text-[15px] inline-flex items-center justify-center gap-1.5 hover:bg-[#153d28] hover:text-[#d9d9d9] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153d28]"
        >
          <span>Quote</span>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link
          to={detailHref}
          aria-label={`View details for ${product.name}`}
          className="flex-1 h-[33px] bg-[#153d28] text-[#d9d9d9] [font-family:'Google_Sans_Flex',Helvetica] text-sm sm:text-[15px] inline-flex items-center justify-center gap-1.5 hover:bg-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153d28]"
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
