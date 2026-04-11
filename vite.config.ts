import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "lux-js-sdk": path.resolve(__dirname, "modules", "lux-js-sdk"),
      "proxy-uri-parser": path.resolve(
        __dirname,
        "modules",
        "proxy-uri-parser",
      ),
    },
  },
});
