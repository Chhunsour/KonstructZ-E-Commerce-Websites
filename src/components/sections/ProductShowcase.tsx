import { useI18n } from "../../context/I18nContext";
import React from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/products";
import { ProductCard } from "../ui/ProductCard";
import { Button } from "../ui/Button";

export const ProductShowcase: React.FC = () => {
  const { t } = useI18n();
  // Select featured products
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <section className="bg-white py-24 relative border-b border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-brand-green text-sm uppercase tracking-widest font-googleSans font-bold block mb-2">{t("auto.productshowcase.machinery.series")}</span>
            <h2 className="text-3xl md:text-5xl font-heading font-normal text-brand-dark uppercase tracking-wide">{t("auto.productshowcase.featured.equipment")}</h2>
          </div>
          <p className="max-w-md text-neutral-600 font-glonimove text-sm leading-relaxed">
            Engineered to handle grueling conditions, our featured models are equipped with reinforced frames, high-output cooling, and proportional controls.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(270px,293px))] justify-center gap-2.5 sm:gap-6 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <Link to="/equipment" className="inline-block">
            <Button variant="outline">{t("auto.productshowcase.view.all.equipment")}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
