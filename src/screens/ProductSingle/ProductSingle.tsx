import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Product, products } from "../../data/products";
import { useI18n } from "../../context/I18nContext";
import {
  MachineComparison,
  ComparableMachine,
} from "../../components/product/MachineComparison";
import { ImageLightbox } from "../../components/product/ImageLightbox";
import { AppointmentCalloutSection } from "./sections/AppointmentCalloutSection";
import { HeroBannerSection } from "./sections/HeroBannerSection";
import { ProductDescriptionSection } from "./sections/ProductDescriptionSection";
import { ProductSummarySection } from "./sections/ProductSummarySection";
import { RelatedMachinesSection } from "./sections/RelatedMachinesSection";

interface ProductSingleProps {
  product: Product;
}

export const ProductSingle: React.FC<ProductSingleProps> = ({ product }) => {
  const { t } = useI18n();
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveImgIdx(0);
    setLightboxOpen(false);
  }, [product.id]);

  const toComparable = (item: Product): ComparableMachine => ({
    id: item.id,
    name: item.name,
    categoryLabel: item.categoryLabel,
    image: item.image,
    specs: item.specs,
    weightLabel: item.weight || undefined,
    features: item.features,
    // No buyUrl: Konstructz machines keep their existing links/buttons untouched.
  });

  // Comparison candidates: ONLY machines from the same category. Never
  // cross-category (skid steers vs skid steers, mini excavators vs mini
  // excavators, etc.). Konstructz buttons/links are left untouched.
  const comparisonCandidates = useMemo<ComparableMachine[]>(
    () =>
      products
        .filter((p) => p.id !== product.id && p.category === product.category)
        .map(toComparable),
    [product]
  );

  const thumbs = [0, 1, 2, 3].map((i) => gallery[i] ?? gallery[gallery.length - 1] ?? product.image);

  return (
    <main
      className="w-full min-w-[1920px] relative bg-theme-bg transition-colors duration-200"
      data-model-id="2170:5142"
    >
      {/* Static relative container for all the absolutely positioned upper components */}
      <div className="relative w-[1920px] h-[2725px]">
        <div
          className="absolute top-0 left-0 w-[1920px] h-full bg-theme-bg transition-colors duration-200"
          aria-hidden="true"
        />
        <img
          className="absolute top-0 left-0 w-[1920px] h-[720px] object-cover"
          alt={t("product.heroBackground", { values: { name: product.name } })}
          src="/img/single-product-page-banner.png"
        />
        <div
          className="absolute top-0 left-0 w-[1920px] h-[720px] bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <header className="absolute top-[276px] left-[97px] w-[565px] h-36 shadow-[0px_4px_4px_#00000040]">
          <Link
            to="/"
            className="absolute top-2 left-0 flex items-center gap-[7px] group transition-colors duration-200 text-white hover:text-theme-accent"
            aria-label="Go to home page"
          >
            <img
              className="w-[38px] h-[38px] dark:invert-0 invert group-hover:opacity-85 transition-opacity"
              alt=""
              src="/img/home.svg"
              aria-hidden="true"
            />
            <span className="[font-family:'Google_Sans_Flex',Helvetica] font-normal text-2xl tracking-[0] leading-[normal] group-hover:underline">
              {t("nav.home")}
            </span>
          </Link>
          <h1 className="top-[57px] left-0 [font-family:'Malking-Regular',Helvetica] text-theme-heading text-[90px] absolute font-normal tracking-[0] leading-[normal] whitespace-nowrap">
            {product.name}
          </h1>
        </header>
        <HeroBannerSection product={product} />
        <ProductSummarySection />
        <section
          className="absolute top-[1985px] left-[91px] w-[790px] h-[630px]"
          aria-label={t("auto.productsingle.product.image.gallery")}
        >
          {thumbs.map((src, idx) => {
            const tops = ["top-0", "top-40", "top-80", "top-[480px]"];
            return (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => setActiveImgIdx(idx)}
                className={`absolute left-0 ${tops[idx]} w-[150px] h-[150px] bg-theme-sec border border-theme-border/20 overflow-hidden ${
                  activeImgIdx === idx ? "outline outline-4 outline-theme-accent" : ""
                }`}
                aria-label={t("product.thumbnail", { values: { name: product.name, index: idx + 1 } })}
              >
                <img
                  className="w-full h-full object-contain p-2"
                  alt=""
                  src={src}
                  aria-hidden="true"
                />
              </button>
            );
          })}

          <div className="absolute top-0 left-40 w-[630px] h-[630px] bg-theme-sec border border-theme-border/20 overflow-hidden">
            <img
              key={activeImgIdx}
              className="w-full h-full object-contain p-4 animate-gallery-swap cursor-zoom-in"
              alt={t("product.mainImage", { values: { name: product.name } })}
              src={gallery[activeImgIdx] ?? product.image}
              onClick={() => setLightboxOpen(true)}
            />
            {/* View full image */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={t("product.viewFullImage", { fallback: "View full image" })}
              title={t("product.viewFullImage", { fallback: "View full image" })}
              className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-theme-bg/70 text-theme-text hover:bg-theme-accent hover:text-theme-bg transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          </div>
        </section>
        <section
          className="absolute top-[2092px] left-[986px] w-[915px]"
          aria-label={t("auto.productsingle.product.overview")}
        >
          <h2 className="[text-shadow:-6px_5px_10.4px_#00000040] [font-family:'Mission_X-Regular',Helvetica] font-normal text-theme-heading text-[75px] tracking-[0] leading-[normal] transition-colors duration-200">
            {product.name.toUpperCase()}
          </h2>
          <p className="mt-6 w-[731px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-accent text-[24px] tracking-[0] leading-[34px] transition-colors duration-200">
            {t("product.overviewText")}
          </p>
          <div className="relative mt-10 w-[519px] h-[111px]">
            {/* Get a Quote */}
            <Link
              to={`/contact?product=${product.id}`}
              className="absolute top-0 left-0 w-[220px] h-[50px] flex items-center justify-center bg-theme-accent hover:bg-brand-green transition-all"
              aria-label={t("action.getAQuote")}
            >
              <span className="flex items-center gap-2">
                <span className="[font-family:'Google_Sans_Flex',Helvetica] font-bold text-theme-bg text-xl tracking-[-0.24px] leading-none">
                  {t("action.getAQuote")}
                </span>
                <img
                  className="w-6 h-6 dark:invert-0 invert object-contain"
                  alt=""
                  src="/img/message.svg"
                  aria-hidden="true"
                />
              </span>
            </Link>

            {/* Share */}
            <button
              type="button"
              className="absolute top-[60px] left-0 w-[110px] h-[36px] flex items-center justify-center bg-theme-sec border border-theme-border/20 transition-colors"
              aria-label={t("action.share")}
            >
              <span className="flex items-center gap-2">
                <span className="[font-family:'Google_Sans_Flex',Helvetica] font-medium text-theme-accent text-[17px] tracking-[0] leading-none">
                  {t("action.share")}
                </span>
                <img
                  className="w-4 h-4 dark:invert-0 invert object-contain"
                  alt=""
                  src="/img/refund-ring-back.svg"
                  aria-hidden="true"
                />
              </span>
            </button>

            {/* Favorite */}
            <button
              type="button"
              className="absolute top-[60px] left-[120px] w-[36px] h-[36px] flex items-center justify-center bg-theme-accent hover:bg-brand-green transition-colors"
              aria-label={t("auto.productsingle.favorite.product")}
            >
              <img
                className="w-4.5 h-4.5 dark:invert-0 invert object-contain"
                alt=""
                src="/img/vector-15.svg"
                aria-hidden="true"
              />
            </button>
          </div>
        </section>
      </div>

      {/* Dynamic flowing sections */}
      <ProductDescriptionSection product={product} />
      <MachineComparison
        current={toComparable(product)}
        candidates={comparisonCandidates}
        categoryLabel={product.categoryLabel}
        variant="konstructz"
      />
      <RelatedMachinesSection product={product} />
      <AppointmentCalloutSection />

      <ImageLightbox
        images={gallery}
        index={activeImgIdx}
        open={lightboxOpen}
        alt={product.name}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setActiveImgIdx}
      />
    </main>
  );
};
