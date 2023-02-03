import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isActionComponent } from "../utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}/test`
);

const ACTION_MAX_LENGTH = 39;

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
            if (
              value &&
              value.type === AST_NODE_TYPES.Literal &&
              typeof value.value === "string"
            ) {
              const title = value.value;
              if (title.length > ACTION_MAX_LENGTH) {
                context.report({
                  node: titleAttribute,
                  messageId: "titleTooLong",
                });
              }
            }
          }
        }
      },
    };
  },
  name: "avoid-long-titles",
  meta: {
    messages: {
      titleTooLong:
        "The title has more than 30 characters. Consider keeping it nice and short.",
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
