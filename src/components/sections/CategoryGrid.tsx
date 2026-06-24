import { useI18n } from "../../context/I18nContext";
import React from "react";
import { categories } from "../../data/categories";
import { CategoryCard } from "../ui/CategoryCard";

export const CategoryGrid: React.FC = () => {
  const { t } = useI18n();
  return (
    <section className="bg-brand-beige/30 py-24 border-b border-brand-beige relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-brand-green text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.categorygrid.machinery.categories")}</span>
          <h2 className="text-3xl md:text-5xl font-heading font-normal text-brand-dark uppercase tracking-wide">{t("auto.categorygrid.select.category")}</h2>
          <div className="w-16 h-1 bg-brand-green mx-auto my-2" />
          <p className="text-neutral-600 font-glonimove text-sm leading-relaxed">{t("auto.categorygrid.find.the.right")}</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
