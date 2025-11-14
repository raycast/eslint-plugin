import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { createRule } from "../utils";

type SimpleShortcut = { modifiers: string[]; key: string };

interface ReservedShortcutDefinition extends SimpleShortcut {
  name: string;
}

// Source list copied from @raycast/api Keyboard.Shortcut.Reserved
const RESERVED: ReservedShortcutDefinition[] = [
  { name: "CloseWindow", modifiers: ["cmd"], key: "w" },
  { name: "Delete", modifiers: [], key: "delete" },
  { name: "DeleteForward", modifiers: [], key: "deleteForward" },
  { name: "DeleteLineBackward", modifiers: ["cmd"], key: "delete" },
  { name: "DeleteWordBackward", modifiers: ["opt"], key: "delete" },
  { name: "GoBack", modifiers: [], key: "escape" },
  { name: "OpenActionPanel", modifiers: ["cmd"], key: "k" },
  { name: "OpenPreferences", modifiers: ["cmd"], key: "," },
  { name: "OpenSearchBarDropdown", modifiers: ["cmd"], key: "p" },
  { name: "OpenSearchBarLink", modifiers: ["shift", "cmd"], key: "/" },
  { name: "PrimaryAction", modifiers: [], key: "enter" },
  { name: "Quit", modifiers: ["cmd"], key: "q" },
  { name: "ReturnToRoot", modifiers: ["cmd"], key: "escape" },
  { name: "SecondaryAction", modifiers: ["cmd"], key: "enter" },
  { name: "SelectAll", modifiers: ["cmd"], key: "a" },
];

function parseSimpleShortcut(
  node: TSESTree.ObjectExpression
): SimpleShortcut | null {
  const props = new Map<string, TSESTree.Property>();
  for (const p of node.properties) {
    if (
      p.type === AST_NODE_TYPES.Property &&
      p.key.type === AST_NODE_TYPES.Identifier
    ) {
      const name = p.key.name;
      if (name !== "modifiers" && name !== "key") {
        // Extra property -> not a pure simple shortcut literal
        return null;
      }
      props.set(name, p);
    } else {
      // Spread or other patterns => ignore
      return null;
    }
  }
  const modifiersProp = props.get("modifiers");
  const keyProp = props.get("key");
  if (!keyProp || !modifiersProp) return null;
  // Must have exactly two properties
  if (props.size !== 2) return null;
  if (
    modifiersProp.value.type !== AST_NODE_TYPES.ArrayExpression ||
    keyProp.value.type !== AST_NODE_TYPES.Literal ||
    typeof keyProp.value.value !== "string"
  ) {
    return null;
  }
  const modifiers: string[] = [];
  for (const el of modifiersProp.value.elements) {
    if (!el) continue;
    if (el.type !== AST_NODE_TYPES.Literal || typeof el.value !== "string")
      return null;
    modifiers.push(el.value);
  }
  return { modifiers, key: keyProp.value.value };
}

function matchesReserved(
  sc: SimpleShortcut
): ReservedShortcutDefinition | null {
  for (const r of RESERVED) {
    if (r.key !== sc.key) continue;
    if (r.modifiers.length !== sc.modifiers.length) continue;
    const a = [...r.modifiers].sort();
    const b = [...sc.modifiers].sort();
    if (a.every((v, i) => v === b[i])) return r;
  }
  return null;
}

export default createRule({
  name: "no-reserved-shortcut",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Warn when a shortcut prop defines a reserved shortcut that Raycast uses.",
    },
    schema: [],
    messages: {
      reserved:
        "Shortcut matches reserved shortcut '{{name}}' and will be ignored by Raycast.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        if (
          node.name.type === AST_NODE_TYPES.JSXIdentifier &&
          node.name.name === "shortcut" &&
          node.value &&
          node.value.type === AST_NODE_TYPES.JSXExpressionContainer &&
          node.value.expression.type === AST_NODE_TYPES.ObjectExpression
        ) {
          const obj = node.value.expression;
          const simple = parseSimpleShortcut(obj);
          if (!simple) return; // Ignore platform form or dynamic shapes
          const match = matchesReserved(simple);
          if (!match) return;
          context.report({
            node: node.value,
            messageId: "reserved",
            data: { name: match.name },
          });
        }
      },
    };
  },
});
