import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { TyphonProductSingle } from "../screens/TyphonProductSingle/TyphonProductSingle";
import { useTyphonProducts } from "../context/ProductsContext";
import { useI18n } from "../context/I18nContext";

export const TyphonProductDetail: React.FC = () => {
  const { t } = useI18n();
  const { productId } = useParams<{ productId: string }>();
  const typhonProducts = useTyphonProducts();
  const product = typhonProducts.find((p) => p.id === productId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#282828] px-4 pt-28 text-center text-white">
        <h1 className="font-clofieBold text-4xl font-bold">
          {t("catalog.productNotFound", { fallback: "Typhon product not found" })}
        </h1>
        <p className="mt-3 max-w-md font-glonimove text-white/70">
          {t("catalog.productNotFoundDesc", { fallback: "We couldn't match this URL to a Typhon Machinery product. It may have been moved or renamed." })}
        </p>
        <Link
          to="/typhon-machinery"
          className="mt-7 inline-flex min-h-[48px] items-center justify-center bg-[#d8c79a] px-6 font-googleSans font-bold text-[#153d28]"
        >
          {t("catalog.backToCatalog", { fallback: "Back to Typhon catalog" })}
        </Link>
      </div>
    );
  }

  return <TyphonProductSingle product={product} />;
};

export default TyphonProductDetail;
