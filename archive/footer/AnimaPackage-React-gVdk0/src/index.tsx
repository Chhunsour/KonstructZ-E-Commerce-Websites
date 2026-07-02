import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SourFooter } from "./screens/SourFooter";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <SourFooter />
  </StrictMode>,
);
