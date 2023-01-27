import avoidLongTitles from "./rules/avoid-long-titles";
import useTitleCase from "./rules/use-title-case";

export = {
  configs: {
    recommended: {
      plugins: ["raycast"],
      rules: {
        "raycast/avoid-long-titles": "warn",
        "raycast/use-title-case": "warn",
      },
    },
  },
  rules: {
    "avoid-long-titles": avoidLongTitles,
    "use-title-case": useTitleCase,
  },
};
