"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const createRule = utils_1.ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}/test`);
exports.default = createRule({
    create: (context) => {
        return {
            JSXOpeningElement: (node) => {
                const titleAttribute = node.attributes.find((attribute) => {
                    return (attribute.type === "JSXAttribute" && attribute.name.name === "title");
                });
                if (titleAttribute) {
                    const value = titleAttribute.type === "JSXAttribute" && titleAttribute.value;
                    if (value &&
                        value.type === utils_1.AST_NODE_TYPES.Literal &&
                        typeof value.value === "string") {
                        const title = value.value;
                        if (title.length > 30) {
                            context.report({
                                node: titleAttribute,
                                messageId: "titleTooLong",
                            });
                        }
                    }
                }
            },
        };
    },
    name: "avoid-long-titles",
    meta: {
        messages: {
            titleTooLong: "The title has more than 30 characters. Consider keeping it nice and short.",
        },
        type: "suggestion",
        docs: {
            recommended: false,
            description: "Avoid long titles",
        },
        schema: [],
    },
    defaultOptions: [],
});
