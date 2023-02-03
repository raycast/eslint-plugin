import preferTitleCase from "./rules/prefer-title-case";
import avoidLongTitles from "./rules/avoid-long-titles";

export = {
  configs: {
    recommended: {
      plugins: ["raycast"],
      rules: {
        "raycast/prefer-title-case": "warn",
        "raycast/avoid-long-titles": "warn",
      },
    },
  },
  rules: {
    "prefer-title-case": preferTitleCase,
    "avoid-long-titles": avoidLongTitles,
  },
};
