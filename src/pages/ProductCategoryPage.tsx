import React from "react";
import { Link, useParams } from "react-router-dom";
import { getCategoryBySlug } from "../data/productCategories";
import { CategoryLanding } from "../components/sections/CategoryLanding";
import { useI18n } from "../context/I18nContext";
import { useNoindexNotFound } from "../hooks/useNoindexNotFound";

/**
 * Dynamic category landing page.
 *
 * Rendered at /product/:slug AND /equipment/:slug (both routes resolve here
 * via App.tsx). Looks up the category config by slug and renders the shared
 * CategoryLanding template. Optional `slugOverride` prop is used by the
 * thin per-category wrapper files (kept for backwards-compatible URLs).
 */
interface ProductCategoryPageProps {
  /** When passed, this overrides the URL slug — used by static category routes. */
  slugOverride?: string;
}

export const ProductCategoryPage: React.FC<ProductCategoryPageProps> = ({
  slugOverride,
}) => {
  const { t } = useI18n();
  const params = useParams<{ slug?: string; productId?: string }>();
  const slug = slugOverride ?? params.slug ?? params.productId ?? "";
  const category = getCategoryBySlug(slug);

  // Category list is static, so a miss is definitive — flag it as a 404.
  useNoindexNotFound(!category, "Category Not Found | Konstructz");

  if (!category) {
    return (
      <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center pt-32 pb-24 px-5">
        <div className="max-w-md text-center">
          <p className="font-googleSans text-xs font-bold uppercase tracking-[0.22em] text-theme-accent">
            {t("catalog.categoryNotFound", { fallback: "Category not found" })}
          </p>
          <h1 className="mt-3 font-heading uppercase tracking-wide text-3xl md:text-4xl text-theme-heading">
            {t("catalog.categoryNotFoundTitle", { fallback: "We couldn't find that category" })}
          </h1>
          <p className="mt-5 font-glonimove text-base leading-relaxed text-theme-muted">
            {t("catalog.categoryNotFoundDesc", { fallback: "The URL might be out of date. Browse the full Konstructz equipment catalog below." })}
          </p>
          <Link
            to="/categories"
            className="mt-8 inline-flex items-center gap-2 bg-theme-accent px-6 py-3 font-googleSans text-sm font-bold uppercase tracking-wider text-theme-bg hover:bg-brand-green hover:text-white transition-colors"
          >
            {t("categories.viewAllCategories", { fallback: "All Equipment Categories" })}
          </Link>
        </div>
      </div>
    );
  }

  return <CategoryLanding category={category} />;
};

export default ProductCategoryPage;
