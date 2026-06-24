import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AllProducts } from "./screens/AllProducts";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <AllProducts />
  </StrictMode>,
);
