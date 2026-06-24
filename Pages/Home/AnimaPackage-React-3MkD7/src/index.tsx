import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Frontpage } from "./screens/Frontpage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Frontpage />
  </StrictMode>,
);
