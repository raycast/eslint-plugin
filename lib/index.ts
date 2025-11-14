import fs from "fs";
import path from "path";

import preferEllipis from "./rules/prefer-ellipsis";
import preferPlaceholders from "./rules/prefer-placeholders";
import preferTitleCase from "./rules/prefer-title-case";
import preferCommonShortcut from "./rules/prefer-common-shortcut";
import noReservedShortcut from "./rules/no-reserved-shortcut";

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  configs: {},
  rules: {
    "prefer-ellipsis": preferEllipis,
    "prefer-title-case": preferTitleCase,
    "prefer-placeholders": preferPlaceholders,
    "prefer-common-shortcut": preferCommonShortcut,
    "no-reserved-shortcut": noReservedShortcut,
  },
};

Object.assign(plugin.configs, {
  recommended: [
    {
      plugins: {
        "@raycast": plugin,
      },
      rules: {
        "@raycast/prefer-ellipsis": "warn",
        "@raycast/prefer-title-case": "warn",
        "@raycast/prefer-common-shortcut": "warn",
        "@raycast/no-reserved-shortcut": "warn",
      },
    },
  ],
});

export = plugin;
