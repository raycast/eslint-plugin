import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";

import { isTextField } from "../utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}/test`
);

export default createRule({
  create: (context) => {
    return {
      JSXOpeningElement: (node) => {
        if (isTextField(node.name)) {
          const placeholderAttribute = node.attributes.find((attribute) => {
            return (
              attribute.type === "JSXAttribute" &&
              attribute.name.name === "placeholder"
            );
          });

          if (!placeholderAttribute) {
            context.report({
              node,
              messageId: "hasNoPlaceholder",
            });
          }
        }
      },
    };
  },
  name: "prefer-title-case",
  meta: {
    messages: {
      hasNoPlaceholder:
        "For a better visual experience, please add placeholders in text field and text area components.",
    },
    type: "suggestion",
    docs: {
      recommended: "warn",
      description: "Prefer Placeholders for Text Fields",
    },
    schema: [],
  },
  defaultOptions: [],
});
