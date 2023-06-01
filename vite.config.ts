import { resolve } from "path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import svg from "vite-plugin-solid-svg";
import { version } from "./package.json";

export default () => defineConfig({
  base: "./",
  plugins: [solid(), svg()],

  resolve: {
    alias: { "@": resolve("src") },
    conditions: ["development", "browser"]
  },

  css: {
    modules: {
      localsConvention: "camelCaseOnly"
    }
  },

  define: {
    VERSION: JSON.stringify(version)
  },

  server: {
    host: "0.0.0.0",
    port: 8080
  }
});
