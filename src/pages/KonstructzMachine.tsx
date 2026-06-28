import React, { useEffect, useRef } from "react";
import { useI18n } from "../context/I18nContext";

declare global {
  interface Window {
    xProductBrowser?: (...args: string[]) => void;
  }
}

const ECWID_SCRIPT_ID = "ecwid-storefront-80100025";
const ECWID_SCRIPT_SRC =
  "https://app.ecwid.com/script.js?80100025&data_platform=code&data_date=2026-02-23";
const ECWID_CONTAINER_ID = "my-store-80100025";

export const KonstructzMachine: React.FC = () => {
  const { t } = useI18n();
  const initializedRef = useRef(false);

  useEffect(() => {
    document.title = `${t("nav.konstructzMachine", { fallback: "Konstructz Machine" })} | KonstructZ`;

    const mountStore = () => {
      if (initializedRef.current || typeof window.xProductBrowser !== "function") {
        return;
      }

      initializedRef.current = true;
      window.xProductBrowser(
        "categoriesPerRow=3",
        "views=grid(20,3) list(60) table(60)",
        "categoryView=grid",
        "searchView=list",
        `id=${ECWID_CONTAINER_ID}`,
      );
    };

    const existingScript = document.getElementById(ECWID_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      if (typeof window.xProductBrowser === "function") {
        mountStore();
      } else {
        existingScript.addEventListener("load", mountStore, { once: true });
      }

      return () => existingScript.removeEventListener("load", mountStore);
    }

    const script = document.createElement("script");
    script.id = ECWID_SCRIPT_ID;
    script.dataset.cfasync = "false";
    script.type = "text/javascript";
    script.src = ECWID_SCRIPT_SRC;
    script.charset = "utf-8";
    script.addEventListener("load", mountStore, { once: true });
    document.body.appendChild(script);

    return () => script.removeEventListener("load", mountStore);
  }, []);

  return (
    <div className="min-h-screen bg-theme-bg pt-24 pb-16 text-theme-text transition-colors duration-200">
      <div id={ECWID_CONTAINER_ID} />
    </div>
  );
};

export default KonstructzMachine;
