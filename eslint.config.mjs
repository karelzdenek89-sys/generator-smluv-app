import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "**/.next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".claude/**",
    "**/worktrees/**",
    "node_modules/**",
    "sample-pdfs/**",
    "scripts/**/*.mjs",
  ]),
  {
    files: ["app/blog/**/*.tsx"],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
