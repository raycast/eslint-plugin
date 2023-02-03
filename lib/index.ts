import avoidLongTitles from "./rules/avoid-long-titles";
import preferTitleCase from "./rules/prefer-title-case";

export = {
  configs: {
    recommended: {
      plugins: ["raycast"],
      rules: {
        "raycast/avoid-long-titles": "warn",
        "raycast/prefer-title-case": "warn",
      },
    },
  },
  rules: {
    "avoid-long-titles": avoidLongTitles,
    "prefer-title-case": preferTitleCase,
  },
};
