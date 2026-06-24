import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BlogPage } from "./screens/BlogPage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BlogPage />
  </StrictMode>,
);
