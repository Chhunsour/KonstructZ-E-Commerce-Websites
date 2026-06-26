import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SingleProduct } from "./screens/SingleProduct";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <SingleProduct />
  </StrictMode>,
);
