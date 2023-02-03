import preferPlaceholdersTextFields from "./rules/prefer-placeholders-text-fields";
import preferTitleCase from "./rules/prefer-title-case";

export = {
  configs: {
    recommended: {
      plugins: ["raycast"],
      rules: {
        "raycast/prefer-title-case": "warn",
      },
    },
  },
  rules: {
    "prefer-title-case": preferTitleCase,
    "prefer-placeholders-text-fields": preferPlaceholdersTextFields,
  },
};
