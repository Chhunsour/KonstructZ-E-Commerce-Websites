import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";
import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && screenGraphPlugin()],
  publicDir: "./static",
  // Absolute base so hashed JS/CSS load correctly from any route depth under
  // BrowserRouter (e.g. /product/mini-excavators), not just the site root.
  base: "/",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
}));
