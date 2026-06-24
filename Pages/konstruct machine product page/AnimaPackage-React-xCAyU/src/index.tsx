import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProductSingle } from "./screens/ProductSingle";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ProductSingle />
  </StrictMode>,
);
