import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SingleBlog } from "./screens/SingleBlog";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <SingleBlog />
  </StrictMode>,
);
