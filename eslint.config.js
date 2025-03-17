const { defineConfig } = require("eslint/config");
const js = require("@eslint/js");
const globals = require("globals");
const plugin = require("eslint-plugin-eslint-plugin");

module.exports = defineConfig([
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
    },
  },
  plugin.configs["flat/recommended"],
]);
