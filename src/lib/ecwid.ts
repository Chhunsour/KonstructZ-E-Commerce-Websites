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

/** Public store id, used by the storefront container element id. */
export const ECWID_STORE_ID = STORE_ID;
/** Path of the Ecwid cart on this site (hashbang under the /product store). */
export const ECWID_CART_PATH = "/product#!/~/cart";

interface EcwidEvent {
  add: (cb: (...args: unknown[]) => void) => void;
}
interface EcwidGlobal {
  OnAPILoaded?: EcwidEvent;
  OnCartChanged?: EcwidEvent;
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
