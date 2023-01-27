import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export function isActionComponent(node: TSESTree.JSXTagNameExpression) {
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
