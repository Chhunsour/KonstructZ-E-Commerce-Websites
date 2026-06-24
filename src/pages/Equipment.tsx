import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../data/products";
import { categories } from "../data/categories";
import { ProductCard } from "../components/ui/ProductCard";
import { useI18n } from "../context/I18nContext";
import { categoryKey, productDescriptionKey, productTaglineKey } from "../i18n/keys";

export const Equipment: React.FC = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Read category filter from URL parameter
  const activeCategory = searchParams.get("category") || "all";

  // Filter products based on active category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(productTaglineKey(product.id), { fallback: product.tagline }).toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(productDescriptionKey(product.id), { fallback: product.description }).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategory]);

  return (
    <div className="bg-theme-bg min-h-screen pt-32 pb-24 text-theme-text transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-theme-accent text-sm uppercase tracking-widest font-googleSans font-bold block">
            {t("equipment.eyebrow")}
          </span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide text-theme-heading">
            {t("equipment.title")}
          </h1>
          <div className="w-16 h-1 bg-theme-accent mx-auto my-2" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">
            {t("equipment.intro")}
          </p>
        </div>

        {/* Filter controls */}
        <div className="space-y-6 mb-12">
          {/* Search bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={t("equipment.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-theme-card text-theme-text border-2 border-theme-border/20 focus:border-theme-accent px-4 py-3 rounded font-googleSans text-sm focus:outline-none shadow-sm transition-colors"
              />
              <span className="absolute right-4 top-3.5 text-theme-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-theme-border/10 pb-6">
            <button
              onClick={() => handleCategorySelect("all")}
              className={`px-5 py-2.5 font-googleSans font-bold text-xs uppercase tracking-wider transition-all border ${
                activeCategory === "all"
                  ? "bg-brand-green border-brand-green text-brand-sand"
                  : "bg-theme-card border-theme-border/30 text-theme-text hover:border-brand-green"
              }`}
            >
              {t("category.all")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-5 py-2.5 font-googleSans font-bold text-xs uppercase tracking-wider transition-all border ${
                  activeCategory === cat.id
                    ? "bg-brand-green border-brand-green text-brand-sand"
                    : "bg-theme-card border-theme-border/30 text-theme-text hover:border-brand-green"
                }`}
              >
                {t(categoryKey(cat.id), { fallback: cat.name })}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,293px))] justify-center gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="animate-fade-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-theme-card border border-theme-border/20 rounded max-w-lg mx-auto transition-colors duration-200">
            <span className="text-4xl">🚜</span>
            <h3 className="text-xl font-heading text-theme-heading mt-4">
              {t("equipment.noMachineryFound")}
            </h3>
            <p className="text-theme-muted font-glonimove text-sm mt-1">
              {t("equipment.noMachineryText")}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
export default Equipment;
