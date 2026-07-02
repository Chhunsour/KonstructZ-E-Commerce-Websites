import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductSingle } from "../screens/ProductSingle/ProductSingle";
import { MobileProductSingle } from "../screens/ProductSingle/MobileProductSingle";
import { AnimaScaler } from "../components/layout/AnimaScaler";
import { Button } from "../components/ui/Button";
import { useI18n } from "../context/I18nContext";
import { useKonstructzProducts, useProducts } from "../context/ProductsContext";
import { useNoindexNotFound } from "../hooks/useNoindexNotFound";

export const ProductDetail: React.FC = () => {
  const { t } = useI18n();
  const { productId } = useParams<{ productId: string }>();
  const products = useKonstructzProducts();
  const { loading } = useProducts();
  const product = products.find((p) => p.id === productId);

  // Only a definitive miss (after the Supabase merge settles) is a 404.
  useNoindexNotFound(!loading && !product, "Machine Not Found | Konstructz");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="bg-theme-bg min-h-screen pt-32 pb-24 text-center text-theme-text flex flex-col justify-center items-center font-googleSans">
        <span className="text-5xl">🚜</span>
        <h1 className="text-3xl font-heading uppercase tracking-wide mt-4 text-theme-heading">
          {t("product.notFound")}
        </h1>
        <p className="text-theme-muted font-glonimove text-sm mt-2 mb-6">
          {t("product.notFoundText")}
        </p>
        <Link to="/equipment">
          <Button variant="outline" className="btn border-theme-border text-theme-text hover:bg-theme-accent/20">
            {t("action.backToCatalog")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <AnimaScaler bgColor="var(--theme-bg)" mobile={<MobileProductSingle product={product} />}>
      <ProductSingle product={product} />
    </AnimaScaler>
  );
};

export default ProductDetail;
