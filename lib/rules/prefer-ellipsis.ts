import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { isActionComponent, createRule } from "../utils";

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
                const formattedTitle = originalTitle.replace(/\.\.\./g, "…");

                if (originalTitle !== formattedTitle) {
                  context.report({
                    node: value,
                    messageId: "isNotEllipsisCharacter",
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
                  const formattedTitle = expression.value.replace(
                    /\.\.\./g,
                    "…"
                  );

                  if (expression.value !== formattedTitle) {
                    context.report({
                      node: expression,
                      messageId: "isNotEllipsisCharacter",
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
                    const formattedTitle = consequent.value.replace(
                      /\.\.\./g,
                      "…"
                    );

                    if (consequent.value !== formattedTitle) {
                      context.report({
                        node: consequent,
                        messageId: "isNotEllipsisCharacter",
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
                    const formattedTitle = alternate.value.replace(
                      /\.\.\./g,
                      "…"
                    );

                    if (alternate.value !== formattedTitle) {
                      context.report({
                        node: alternate,
                        messageId: "isNotEllipsisCharacter",
                        fix: (fixer) =>
                          fixer.replaceText(alternate, `"${formattedTitle}"`),
                      });
                    }
                  }
                }

                // If the expression is a template literal
                // <Action title={`Submit form`} />
                // or
                // <Action title={`Submit ${formName} form`} />
                if (expression.type === AST_NODE_TYPES.TemplateLiteral) {
                  const quasis = expression.quasis;

                  var hasQuasiWithoutTitleCase = false;

                  quasis.forEach((quasi) => {
                    if (
                      quasi.type === AST_NODE_TYPES.TemplateElement &&
                      quasi.value &&
                      typeof quasi.value.raw === "string"
                    ) {
                      const formattedTitle = quasi.value.raw.replace(
                        /\.\.\./g,
                        "…"
                      );

                      if (quasi.value.raw !== formattedTitle) {
                        hasQuasiWithoutTitleCase = true;
                      }
                    }
                  });

                  if (hasQuasiWithoutTitleCase) {
                    return context.report({
                      node: expression,
                      messageId: "isNotEllipsisCharacter",
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
  name: "prefer-ellipsis",
  meta: {
    fixable: "code",
    messages: {
      isNotEllipsisCharacter: "Prefer `…` to `...`",
    },
    type: "suggestion",
    docs: {
      description: "Prefer Ellipsis Character",
    },
    schema: [],
  },
  defaultOptions: [{}],
});
