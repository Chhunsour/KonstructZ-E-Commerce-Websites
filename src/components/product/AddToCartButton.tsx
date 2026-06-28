import React, { useState } from "react";
import { addToCartByEcwidId } from "../../lib/ecwid";
import { useI18n } from "../../context/I18nContext";

interface AddToCartButtonProps {
  /** The product's Ecwid numeric id (resolved from the SKU→id mapping). */
  ecwidId: number;
  className?: string;
}

/**
 * Adds the product to the real Ecwid cart by its Ecwid id. The header cart
 * count updates automatically (via the OnCartChanged subscription).
 */
export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ ecwidId, className = "" }) => {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "adding" | "added" | "error">("idle");

  const onClick = async () => {
    if (state === "adding") return;
    setState("adding");
    const result = await addToCartByEcwidId(ecwidId);
    if (result === "added") {
      setState("added");
      setTimeout(() => setState("idle"), 3000);
    } else {
      setState("error");
      setTimeout(() => setState("idle"), 3500);
    }
  };

  const label =
    state === "adding"
      ? t("action.cart.adding", { fallback: "Adding…" })
      : state === "added"
        ? t("action.cart.added", { fallback: "Added to cart" })
        : state === "error"
          ? t("action.cart.error", { fallback: "Couldn't add" })
          : t("action.cart.add", { fallback: "Add to Cart" });

  const Icon = () => {
    if (state === "adding")
      return (
        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" /><path className="opacity-75" d="M4 12a8 8 0 018-8" />
        </svg>
      );
    if (state === "added")
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    );
  };

  return (
    <button type="button" onClick={onClick} disabled={state === "adding"} className={className} aria-live="polite">
      <span className="flex items-center gap-2">
        <Icon />
        {label}
      </span>
    </button>
  );
};

export default AddToCartButton;
