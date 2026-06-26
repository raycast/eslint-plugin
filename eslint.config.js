const { defineConfig } = require("eslint/config");
const js = require("@eslint/js");
const globals = require("globals");
const plugin = require("eslint-plugin-eslint-plugin").default;

module.exports = defineConfig([
  {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
    },
  },
  plugin.configs.recommended,
]);
