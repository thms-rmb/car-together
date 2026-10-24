import js from "@eslint/js";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  { ignores: ["node_modules/**", "dist/**", "test-results/**", "playwright-report/**"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [js.configs.recommended],
  },
  {
    files: ["**/*.css"],
    language: "css/css",
    plugins: { css },
    extends: ["css/recommended"],
  },
  {
    files: ["app/**/*.js", "tests/**/*.spec.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["*.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
