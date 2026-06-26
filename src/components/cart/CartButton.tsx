import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { subscribeCartCount, ECWID_CART_PATH } from "../../lib/ecwid";

interface CartButtonProps {
  /** Wrapper classes (sizing/border/colors to match surrounding header buttons). */
  className?: string;
  /** Icon size classes. */
  iconClassName?: string;
}

/**
 * Header cart icon. Shows the live Ecwid item count and opens the cart
 * (/product#!/~/cart) where the customer checks out through Ecwid's payment
 * gateway. The count syncs from Ecwid via `subscribeCartCount`.
 */
export const CartButton: React.FC<CartButtonProps> = ({
  className = "",
  iconClassName = "w-4 h-4",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => subscribeCartCount(setCount), []);

  const label =
    count > 0
      ? `Shopping cart, ${count} item${count === 1 ? "" : "s"}`
      : "Shopping cart";

  return (
    <Link
      to={ECWID_CART_PATH}
      aria-label={label}
      title={label}
      className={`relative ${className}`}
    >
      <svg
        className={iconClassName}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-theme-accent px-1 text-[10px] font-bold leading-none text-theme-bg">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
