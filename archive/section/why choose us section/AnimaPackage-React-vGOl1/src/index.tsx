import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TemplateGrid } from "./screens/TemplateGrid";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <TemplateGrid />
  </StrictMode>,
);
