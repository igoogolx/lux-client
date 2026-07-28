import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    checker({
      typescript: true,
    }),
  ],
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
