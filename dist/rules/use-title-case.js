"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const title_case_1 = require("title-case");
const createRule = utils_1.ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}/test`);
function isValidComponent(node) {
    if (node.type === utils_1.AST_NODE_TYPES.JSXIdentifier) {
        return node.name === "Action";
    }
    if (node.type === utils_1.AST_NODE_TYPES.JSXMemberExpression) {
        if (node.object.type === utils_1.AST_NODE_TYPES.JSXIdentifier &&
            node.object.name === "Action") {
            return true;
        }
        return (node.object.type === utils_1.AST_NODE_TYPES.JSXIdentifier &&
            node.object.name === "ActionPanel" &&
            node.property.type === utils_1.AST_NODE_TYPES.JSXIdentifier &&
            node.property.name === "Submenu");
    }
    return false;
}
exports.default = createRule({
    create: (context) => {
        return {
            JSXOpeningElement: (node) => {
                if (isValidComponent(node.name)) {
                    const titleAttribute = node.attributes.find((attribute) => {
                        return (attribute.type === "JSXAttribute" &&
                            attribute.name.name === "title");
                    });
                    if (titleAttribute) {
                        const value = titleAttribute.type === "JSXAttribute" && titleAttribute.value;
                        if (value &&
                            value.type === utils_1.AST_NODE_TYPES.Literal &&
                            typeof value.value === "string") {
                            const originalTitle = value.value;
                            const formattedTitle = (0, title_case_1.titleCase)(originalTitle);
                            if (originalTitle !== formattedTitle) {
                                context.report({
                                    node: titleAttribute,
                                    messageId: "isNotTitleCased",
                                    fix: (fixer) => fixer.replaceText(value, `"${formattedTitle}"`),
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
            isNotTitleCased: "Please follow the Title Case naming convention (e.g Copy to Clipboard).",
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
