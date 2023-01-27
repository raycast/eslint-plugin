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

            // In the case of a simple string
            // <Action title="Submit form" />
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

              // If the title is an expression (= starts with a bracket)
              if (value.type === AST_NODE_TYPES.JSXExpressionContainer) {
                const expression = value.expression;

                // If the expression is a simple string
                // <Action title={"Submit form"} />
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

                // If the expression is a simple ternary condition
                // <Action title={isAssignedToMe ? "Assign to Me" : "Unassign from Me"} />
                if (expression.type === AST_NODE_TYPES.ConditionalExpression) {
                  const consequent = expression.consequent;
                  const alternate = expression.alternate;

                  if (
                    consequent.type === AST_NODE_TYPES.Literal &&
                    consequent.value &&
                    typeof consequent.value === "string"
                  ) {
                    const formattedTitle = titleCase(consequent.value);

                    if (consequent.value !== formattedTitle) {
                      context.report({
                        node: titleAttribute,
                        messageId: "isNotTitleCased",
                        fix: (fixer) =>
                          fixer.replaceText(consequent, `"${formattedTitle}"`),
                      });
                    }
                  }

                  if (
                    alternate.type === AST_NODE_TYPES.Literal &&
                    alternate.value &&
                    typeof alternate.value === "string"
                  ) {
                    const formattedTitle = titleCase(alternate.value);

                    if (alternate.value !== formattedTitle) {
                      context.report({
                        node: titleAttribute,
                        messageId: "isNotTitleCased",
                        fix: (fixer) =>
                          fixer.replaceText(alternate, `"${formattedTitle}"`),
                      });
                    }
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
