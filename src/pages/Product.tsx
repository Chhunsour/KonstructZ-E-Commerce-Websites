import React, { useEffect } from "react";
import { loadEcwid, ECWID_STORE_ID } from "../lib/ecwid";

/**
 * /product — Ecwid storefront embed.
 *
 * Only the global header (Navbar) and footer wrap this page; everything in
 * between is rendered by Ecwid into the `my-store-<id>` container. The loader
 * (and its hashbang config) lives in `src/lib/ecwid.ts` so the storefront, the
 * Typhon buy-button deep links, and the header cart all share one script.
 */
export const Product: React.FC = () => {
  useEffect(() => {
    let cancelled = false;
    loadEcwid()
      .then(() => {
        if (cancelled) return;
        const w = window as unknown as {
          xProductBrowser?: (...args: string[]) => void;
        };
        w.xProductBrowser?.(
          "categoriesPerRow=3",
          "views=grid(20,3) list(60) table(60)",
          "categoryView=grid",
          "searchView=list",
          `id=my-store-${ECWID_STORE_ID}`
        );
      })
      .catch(() => {
        /* network/blocked — container simply stays empty */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-theme-bg min-h-screen pt-24 lg:pt-28 pb-16 transition-colors duration-200">
      <div className="max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10">
        <div id={`my-store-${ECWID_STORE_ID}`} />
      </div>
    </div>
  );
};

export default Product;
