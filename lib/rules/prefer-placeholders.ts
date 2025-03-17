import { isTextField, createRule } from "../utils";

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
  name: "prefer-placeholders",
  meta: {
    messages: {
      hasNoPlaceholder:
        "For a better visual experience, please add placeholders in text field and text area components.",
    },
    type: "suggestion",
    docs: {
      description: "Prefer Placeholders for Text Fields",
    },
    schema: [],
  },
  defaultOptions: [],
});
