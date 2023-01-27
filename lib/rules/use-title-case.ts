import {
  ESLintUtils,
  TSESTree,
  AST_NODE_TYPES,
} from "@typescript-eslint/utils";
import { titleCase } from "title-case";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}/test`
);

function isValidComponent(node: TSESTree.JSXTagNameExpression) {
  if (node.type === AST_NODE_TYPES.JSXIdentifier) {
    return node.name === "Action";
  }

  if (node.type === AST_NODE_TYPES.JSXMemberExpression) {
    if (
      node.object.type === AST_NODE_TYPES.JSXIdentifier &&
      node.object.name === "Action"
    ) {
      return true;
    }

    return (
      node.object.type === AST_NODE_TYPES.JSXIdentifier &&
      node.object.name === "ActionPanel" &&
      node.property.type === AST_NODE_TYPES.JSXIdentifier &&
      node.property.name === "Submenu"
    );
  }

  return false;
}

export default createRule({
  create: (context) => {
    return {
      JSXOpeningElement: (node) => {
        if (isValidComponent(node.name)) {
          const titleAttribute = node.attributes.find((attribute) => {
            return (
              attribute.type === "JSXAttribute" &&
              attribute.name.name === "title"
            );
          });

          if (titleAttribute) {
            const value =
              titleAttribute.type === "JSXAttribute" && titleAttribute.value;
            if (
              value &&
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
        "Please follow the Title Case naming convention (e.g Copy to Clipboard).",
    },
    type: "suggestion",
    docs: {
      recommended: "error",
      description: "Avoid long titles",
    },
    schema: [],
  },
  defaultOptions: [],
});
