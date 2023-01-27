import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { titleCase } from "title-case";

import { isActionComponent } from "../utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}/test`
);

export default createRule({
  create: (context) => {
    return {
      JSXOpeningElement: (node) => {
        if (isActionComponent(node.name)) {
          const titleAttribute = node.attributes.find((attribute) => {
            return (
              attribute.type === "JSXAttribute" &&
              attribute.name.name === "title"
            );
          });

          if (titleAttribute) {
            const value =
              titleAttribute.type === "JSXAttribute" && titleAttribute.value;

            if (value) {
              if (
                value.type === AST_NODE_TYPES.Literal &&
                typeof value.value === "string"
              ) {
                const originalTitle = value.value;

                const formattedTitle = titleCase(originalTitle);

                if (originalTitle !== formattedTitle) {
                  context.report({
                    node: titleAttribute,
                    messageId: "isNotTitleCased",
                    fix: (fixer) =>
                      fixer.replaceText(value, `"${formattedTitle}"`),
                  });
                }
              }

              if (value.type === AST_NODE_TYPES.JSXExpressionContainer) {
                const expression = value.expression;

                if (
                  expression.type === AST_NODE_TYPES.Literal &&
                  expression.value &&
                  typeof expression.value === "string"
                ) {
                  const formattedTitle = titleCase(expression.value);

                  if (expression.value !== formattedTitle) {
                    context.report({
                      node: titleAttribute,
                      messageId: "isNotTitleCased",
                      fix: (fixer) =>
                        fixer.replaceText(expression, `"${formattedTitle}"`),
                    });
                  }
                }
              }
            }
          }
        }
      },
    };
  },
  name: "use-title-case",
  meta: {
    fixable: "code",
    messages: {
      isNotTitleCased:
        "Prefer Title Case naming convention for action titles (e.g Copy to Clipboard).",
    },
    type: "suggestion",
    docs: {
      recommended: "warn",
      description: "Avoid long titles",
    },
    schema: [],
  },
  defaultOptions: [],
});
