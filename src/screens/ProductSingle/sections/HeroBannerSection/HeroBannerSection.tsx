import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../../../data/products";
import { useI18n } from "../../../../context/I18nContext";
import { specLabelKey } from "../../../../i18n/keys";

interface HeroBannerSectionProps {
  product: Product;
}

// Crisp Vector SVG Spec Icons
type SpecIcon = (props: { className?: string }) => JSX.Element;

const EngineIcon: SpecIcon = ({ className }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M14 22h26v22H14z" />
    <path d="M40 26h8v14h-8" />
    <path d="M48 30h6" />
    <path d="M10 26h4v14h-4z" />
    <path d="M22 22V14h10v8" />
    <circle cx="27" cy="33" r="4" />
  </svg>
);
const ValveIcon: SpecIcon = ({ className }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="14" />
    <path d="M32 8v10M32 46v10M8 32h10M46 32h10M16 16l7 7M41 41l7 7M48 16l-7 7M16 48l7-7" />
  </svg>
);
const GaugeIcon: SpecIcon = ({ className }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M10 44a22 22 0 1 1 44 0" />
    <path d="M32 44l12-12" />
    <circle cx="32" cy="44" r="2.5" fill="currentColor" />
  </svg>
);
const PerformanceIcon: SpecIcon = ({ className }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M14 50V34M28 50V22M42 50V10M14 14l8 6 8-6 8 6 8-6" />
  </svg>
);

const specificationIcons = [EngineIcon, ValveIcon, GaugeIcon, PerformanceIcon];

export const HeroBannerSection: React.FC<HeroBannerSectionProps> = ({ product }) => {
  const { t } = useI18n();
  const verticalLabel = product.name.split(" ")[0];

  // Render first 4 specs dynamically
  const displayedSpecs = product.specs.slice(0, 4);

  return (
    <section
      aria-labelledby="hero-banner-heading"
      className="absolute top-[678px] left-0 w-[1920px] h-[1080px] overflow-hidden text-white"
    >
      <div
        className="absolute left-0 top-[121px] h-[1557px] w-[1920px] bg-[#282828]"
        aria-hidden="true"
      />
      
      {/* Background vectors in a single SVG container to avoid alignment issues */}
      <svg
        className="absolute top-0 left-[1113px] w-[807px] h-[1080px] pointer-events-none select-none"
        viewBox="0 0 807 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Green Shape */}
        <path
          d="M286.423 -170 L2.54221 843.08 L0 844 L808 691.256 L803.763 -170 H286.423 Z"
          fill="#153D28"
        />
        {/* Grey Shape - corrected to align perfectly along the diagonal */}
        <path
          d="M873 678.97 L124 820.56 L873 1080 Z"
          fill="#D9D9D9"
        />
      </svg>

      <div
        className="absolute top-[236px] left-[1488px] -rotate-90 whitespace-nowrap [font-family:'Malking-Regular',Helvetica] text-[210px] font-normal leading-[normal] tracking-[0] text-[#1a442e] select-none"
        aria-hidden="true"
      >
        {verticalLabel}
      </div>
      <img
        className="absolute top-[296px] left-[906px] h-[761px] w-[932px] aspect-[1.23] object-contain"
        alt={`${product.name} product image`}
        src={product.image}
      />
      <header className="absolute left-[91px] top-[226px]">
        <h2
          id="hero-banner-heading"
          className="w-[915px] [text-shadow:-6px_5px_10.4px_#00000040] [font-family:'Mission_X-Regular',Helvetica] text-[75px] font-normal leading-[normal] tracking-[0] text-[#d8c79a]"
        >
          {product.name.toUpperCase()}
        </h2>
      </header>
      
      {/* Specifications Grid */}
      <div
        className="absolute top-[407px] left-[91px] h-52 w-[934px]"
        role="list"
        aria-label={t("product.productSpecifications")}
      >
        {displayedSpecs.map((spec, index) => {
          const leftOffsets = ["left-0", "left-[236px]", "left-[480px]", "left-[716px]"];
          const leftOffset = leftOffsets[index] || "left-0";
          const Icon = specificationIcons[index] || specificationIcons[0];

          return (
            <div
              key={`${spec.label}-${index}`}
              role="listitem"
              aria-label={`${t(specLabelKey(spec.label), { fallback: spec.label })}: ${spec.value}`}
              className={`absolute top-0 ${leftOffset} h-52 w-[210px] bg-[#1e1e1e] border border-[#d8c79a]/10 aspect-[1.01] flex flex-col items-center justify-between py-5 px-3`}
            >
              <Icon className="w-[88px] h-[88px] text-[#d8c79a]" />
              <div className="flex flex-col items-center text-center w-full mt-2">
                <span
                  className="[font-family:'Cal_Sans',Helvetica] text-xl font-normal leading-tight text-white line-clamp-2 break-words w-full"
                  title={spec.value}
                >
                  {spec.value}
                </span>
                {spec.label && (
                  <span
                    className="mt-1 font-googleSans text-[9px] font-bold uppercase tracking-wider text-neutral-400 truncate w-full"
                    title={t(specLabelKey(spec.label), { fallback: spec.label })}
                  >
                    {t(specLabelKey(spec.label), { fallback: spec.label })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute top-[670px] left-[91px] w-[805px]">
        <p className="[font-family:'Glonimove-Bold',Helvetica] text-[24px] font-bold leading-[30px] tracking-[0] text-[#d8c79a]">
          {product.tagline}
        </p>
        <p className="mt-3 [font-family:'Glonimove-Regular',Helvetica] text-[20px] font-normal leading-[30px] tracking-[0] text-white">
          {product.description}
        </p>
      </div>

      {/* Action Buttons Section */}
      <div className="absolute top-[864px] left-[91px] h-[111px] w-[519px]">
        {/* Fit Check Button */}
        <Link
          to={`/contact?product=${product.id}&topic=fit-check`}
          className="absolute top-0 left-0 w-[220px] h-[50px] flex items-center justify-center border-[3px] border-solid border-[#d8c79a] hover:border-white transition-colors cursor-pointer bg-transparent"
          aria-label={`Request a fit check for ${product.name}`}
        >
          <span className="flex items-center gap-2">
            <span className="[font-family:'Google_Sans_Flex',Helvetica] font-bold text-neutral-100 text-xl tracking-[-0.24px] leading-none">
              Fit Check
            </span>
            <img
              className="w-6 h-6 object-contain"
              alt=""
              aria-hidden="true"
              src="/img/search.svg"
            />
          </span>
        </Link>

        {/* Get a Quote Button */}
        <Link
          to={`/contact?product=${product.id}`}
          className="absolute top-0 left-[236px] w-[220px] h-[50px] flex items-center justify-center bg-[#d8c79a] hover:bg-[#c9b788] transition-colors border-0"
          aria-label={t("action.getAQuote")}
        >
          <span className="flex items-center gap-2">
            <span className="[font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#2f2f2f] text-xl tracking-[-0.24px] leading-none">
              {t("action.getAQuote")}
            </span>
            <img
              className="w-6 h-6 object-contain"
              alt=""
              aria-hidden="true"
              src="/img/message.svg"
            />
          </span>
        </Link>

        {/* Share Button */}
        <button
          type="button"
          className="absolute top-[60px] left-0 w-[110px] h-[36px] flex items-center justify-center bg-[#1e1e1e] border border-[#d8c79a]/10 hover:border-[#d8c79a]/30 transition-colors cursor-pointer rounded-[3px]"
          aria-label={t("action.share")}
        >
          <span className="flex items-center gap-2">
            <span className="[font-family:'Google_Sans_Flex',Helvetica] font-medium text-[#d8c79a] text-[17px] tracking-[0] leading-none">
              {t("action.share")}
            </span>
            <img
              className="w-4 h-4 object-contain"
              alt=""
              aria-hidden="true"
              src="/img/refund-ring-back.svg"
              style={{ filter: "invert(79%) sepia(35%) saturate(497%) hue-rotate(357deg) brightness(93%) contrast(90%)" }}
            />
          </span>
        </button>

        {/* Favorite Button */}
        <button
          type="button"
          className="absolute top-[60px] left-[120px] w-[36px] h-[36px] flex items-center justify-center bg-[#d8c79a] hover:bg-[#c9b788] transition-colors cursor-pointer border-0 rounded-[3px]"
          aria-label="Add to favorites"
        >
          <img
            className="w-4.5 h-4.5 object-contain"
            alt=""
            aria-hidden="true"
            src="/img/vector-15.svg"
          />
        </button>
      </div>
    </section>
  );
};
