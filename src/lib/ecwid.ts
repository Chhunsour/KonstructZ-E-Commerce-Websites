/**
 * Shared Ecwid integration.
 *
 * The Ecwid store (mounted on /product) holds the real catalog, cart, and
 * payment gateway. This module loads Ecwid's `script.js` exactly once and
 * configures hashbang routing so every entry point behaves consistently:
 *
 *   - /product            → the full storefront (xProductBrowser)
 *   - /product#!/...       → product/category deep links (Typhon buy buttons)
 *   - /product#!/~/cart    → the cart (header cart button)
 *
 * It also exposes a live cart item-count subscription for the header cart icon.
 */

const STORE_ID = "80100025";
const SCRIPT_ID = "ecwid-script";
const SRC = `https://app.ecwid.com/script.js?${STORE_ID}&data_platform=code&data_date=2026-02-23`;

/**
 * Public Storefront API token (read-only; safe to ship in the client). Set it
 * in `.env.local` / build env as VITE_ECWID_PUBLIC_TOKEN. It lets the site
 * resolve a product's Ecwid id from its SKU so "Add to Cart" adds the exact
 * product. Without it, Add-to-Cart stays hidden and Buy Now / View Cart are
 * used instead.
 */
const PUBLIC_TOKEN = (import.meta.env.VITE_ECWID_PUBLIC_TOKEN as string | undefined) || "";

/** Public store id, used by the storefront container element id. */
export const ECWID_STORE_ID = STORE_ID;
/** Path of the Ecwid cart on this site (hashbang under the /product store). */
export const ECWID_CART_PATH = "/product#!/~/cart";
/** Whether SKU-based Add-to-Cart is available (a public token is configured). */
export const ecwidAddToCartEnabled = (): boolean => !!PUBLIC_TOKEN;

interface EcwidEvent {
  add: (cb: (...args: unknown[]) => void) => void;
}
interface EcwidCart {
  addProduct: (
    arg: number | { id: number; quantity?: number; callback?: (success: boolean) => void }
  ) => void;
}
interface EcwidGlobal {
  OnAPILoaded?: EcwidEvent;
  OnCartChanged?: EcwidEvent;
  Cart?: EcwidCart;
  openPage?: (page: string) => void;
}
type EcwidWindow = Window & {
  ec?: {
    config?: { storefrontUrls?: { cleanUrls?: boolean }; baseUrl?: string };
  };
  Ecwid?: EcwidGlobal;
  xProductBrowser?: (...args: string[]) => void;
};

let loadPromise: Promise<void> | null = null;
const subscribers = new Set<(count: number) => void>();
let lastCount = 0;
let cartWired = false;

/** Force hashbang URLs + the /product base. Must run before script.js loads. */
const configure = () => {
  const w = window as EcwidWindow;
  w.ec = w.ec || {};
  w.ec.config = w.ec.config || {};
  w.ec.config.storefrontUrls = w.ec.config.storefrontUrls || {};
  w.ec.config.storefrontUrls.cleanUrls = false;
  w.ec.config.baseUrl = "/product";
};

/** Inject Ecwid's loader once; resolves when the script has loaded. */
export const loadEcwid = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if (loadPromise) return loadPromise;
  configure();
  loadPromise = new Promise<void>((resolve, reject) => {
    if (document.getElementById(SCRIPT_ID)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SRC;
    script.async = true;
    script.charset = "utf-8";
    script.setAttribute("data-cfasync", "false");
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null; // allow a retry on the next call
      reject(new Error("Ecwid script failed to load"));
    };
    document.body.appendChild(script);
  });
  return loadPromise;
};

/** Wire a single Ecwid cart listener that fans out to all subscribers. */
const wireCart = () => {
  if (cartWired) return;
  const ecwid = (window as EcwidWindow).Ecwid;
  if (!ecwid?.OnCartChanged) return;
  cartWired = true;
  ecwid.OnCartChanged.add((...args: unknown[]) => {
    const cart = args[0] as { productsQuantity?: number } | null;
    lastCount = cart && typeof cart.productsQuantity === "number" ? cart.productsQuantity : 0;
    subscribers.forEach((cb) => cb(lastCount));
  });
};

/**
 * Subscribe to live cart item count. Calls back immediately with the last
 * known count, then on every cart change. Returns an unsubscribe function.
 */
export const subscribeCartCount = (cb: (count: number) => void): (() => void) => {
  subscribers.add(cb);
  cb(lastCount);
  loadEcwid()
    .then(() => {
      const ecwid = (window as EcwidWindow).Ecwid;
      if (!ecwid) return;
      // OnCartChanged is reliable once the API has finished initializing.
      ecwid.OnAPILoaded?.add(() => wireCart());
      wireCart();
    })
    .catch(() => {
      /* offline / blocked — header still shows an empty cart link */
    });
  return () => {
    subscribers.delete(cb);
  };
};

/* ── Add to cart by SKU ───────────────────────────────────────────────────
   The cart adds by Ecwid's numeric product id, which our CSV catalog doesn't
   store. We resolve it from the product's SKU via the Storefront API (cached),
   then add it through the JS API so the item lands in the real cart. */

const skuIdCache = new Map<string, number | null>();

/** Resolve a product's Ecwid id from its SKU (cached). Null if not found. */
export const resolveEcwidProductId = async (sku: string): Promise<number | null> => {
  const key = (sku || "").trim();
  if (!key || !PUBLIC_TOKEN) return null;
  if (skuIdCache.has(key)) return skuIdCache.get(key)!;
  try {
    const url = `https://app.ecwid.com/api/v3/${STORE_ID}/products?sku=${encodeURIComponent(
      key
    )}&token=${PUBLIC_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) {
      skuIdCache.set(key, null);
      return null;
    }
    const data = (await res.json()) as { items?: { id: number }[] };
    const id = data.items?.[0]?.id ?? null;
    skuIdCache.set(key, id);
    return id;
  } catch {
    return null;
  }
};

export type AddToCartResult = "added" | "not-found" | "disabled" | "error";

/** Add a product to the Ecwid cart by its Ecwid numeric id (no token needed). */
export const addToCartByEcwidId = async (id: number): Promise<AddToCartResult> => {
  if (!id) return "not-found";
  await loadEcwid();
  return new Promise<AddToCartResult>((resolve) => {
    const ecwid = (window as EcwidWindow).Ecwid;
    if (!ecwid?.Cart?.addProduct) return resolve("error");
    let settled = false;
    const done = (r: AddToCartResult) => {
      if (!settled) {
        settled = true;
        resolve(r);
      }
    };
    ecwid.Cart.addProduct({
      id,
      quantity: 1,
      callback: (success: boolean) => done(success ? "added" : "error"),
    });
    // Safety net in case the callback never fires.
    setTimeout(() => done("added"), 4000);
  });
};

/** Add a product to the Ecwid cart by SKU. Resolves to the outcome. */
export const addToCartBySku = async (sku: string): Promise<AddToCartResult> => {
  if (!PUBLIC_TOKEN) return "disabled";
  await loadEcwid();
  const id = await resolveEcwidProductId(sku);
  if (!id) return "not-found";
  return new Promise<AddToCartResult>((resolve) => {
    const ecwid = (window as EcwidWindow).Ecwid;
    if (!ecwid?.Cart?.addProduct) return resolve("error");
    ecwid.Cart.addProduct({
      id,
      quantity: 1,
      callback: (success: boolean) => resolve(success ? "added" : "error"),
    });
    // Safety timeout in case the callback never fires.
    setTimeout(() => resolve("added"), 4000);
  });
};
