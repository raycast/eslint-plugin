import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../utils";
import { RuleFix } from "@typescript-eslint/utils/dist/ts-eslint";

type SimpleShortcut = { modifiers: string[]; key: string };

type CommonShortcut = {
  name: string;
  macOS: SimpleShortcut;
  Windows: SimpleShortcut;
};

// Source of truth copied from @raycast/api Keyboard.Shortcut.Common
const COMMON_SHORTCUTS: CommonShortcut[] = [
  {
    name: "Copy",
    macOS: { modifiers: ["cmd", "shift"], key: "c" },
    Windows: { modifiers: ["ctrl", "shift"], key: "c" },
  },
  {
    name: "CopyDeeplink",
    macOS: { modifiers: ["cmd", "shift"], key: "c" },
    Windows: { modifiers: ["ctrl", "shift"], key: "c" },
  },
  {
    name: "CopyName",
    macOS: { modifiers: ["cmd", "opt"], key: "c" },
    Windows: { modifiers: ["ctrl", "alt"], key: "c" },
  },
  {
    name: "CopyPath",
    macOS: { modifiers: ["cmd", "ctrl"], key: "c" },
    Windows: { modifiers: ["alt", "shift"], key: "c" },
  },
  {
    name: "Save",
    macOS: { modifiers: ["cmd"], key: "s" },
    Windows: { modifiers: ["ctrl"], key: "s" },
  },
  {
    name: "Duplicate",
    macOS: { modifiers: ["cmd", "shift"], key: "s" },
    Windows: { modifiers: ["ctrl", "shift"], key: "s" },
  },
  {
    name: "Edit",
    macOS: { modifiers: ["cmd"], key: "e" },
    Windows: { modifiers: ["ctrl"], key: "e" },
  },
  {
    name: "MoveDown",
    macOS: { modifiers: ["cmd", "shift"], key: "arrowDown" },
    Windows: { modifiers: ["ctrl", "shift"], key: "arrowDown" },
  },
  {
    name: "MoveUp",
    macOS: { modifiers: ["cmd", "shift"], key: "arrowUp" },
    Windows: { modifiers: ["ctrl", "shift"], key: "arrowUp" },
  },
  {
    name: "New",
    macOS: { modifiers: ["cmd"], key: "n" },
    Windows: { modifiers: ["ctrl"], key: "n" },
  },
  {
    name: "Open",
    macOS: { modifiers: ["cmd"], key: "o" },
    Windows: { modifiers: ["ctrl"], key: "o" },
  },
  {
    name: "OpenWith",
    macOS: { modifiers: ["cmd", "shift"], key: "o" },
    Windows: { modifiers: ["ctrl", "shift"], key: "o" },
  },
  {
    name: "Pin",
    macOS: { modifiers: ["cmd"], key: "." },
    Windows: { modifiers: ["ctrl"], key: "." },
  },
  {
    name: "Refresh",
    macOS: { modifiers: ["cmd"], key: "r" },
    Windows: { modifiers: ["ctrl"], key: "r" },
  },
  {
    name: "Remove",
    macOS: { modifiers: ["ctrl"], key: "d" },
    Windows: { modifiers: ["ctrl"], key: "d" },
  },
  {
    name: "RemoveAll",
    macOS: { modifiers: ["ctrl", "shift"], key: "d" },
    Windows: { modifiers: ["ctrl", "shift"], key: "d" },
  },
  {
    name: "ToggleQuickLook",
    macOS: { modifiers: ["cmd"], key: "y" },
    Windows: { modifiers: ["ctrl"], key: "y" },
  },
];

function eq(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const as = [...a].sort();
  const bs = [...b].sort();
  return as.every((v, i) => v === bs[i]);
}

function normalizeSimpleShortcut(
  node: TSESTree.ObjectExpression
): SimpleShortcut | null {
  const props = new Map<string, TSESTree.Property>();
  for (const p of node.properties) {
    if (
      p.type === AST_NODE_TYPES.Property &&
      p.key.type === AST_NODE_TYPES.Identifier
    ) {
      props.set(p.key.name, p);
    }
  }

  const modifiersProp = props.get("modifiers");
  const keyProp = props.get("key");
  if (!modifiersProp || !keyProp) return null;

  // modifiers: ["cmd", "shift"]
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

function parseShortcutValue(
  node: TSESTree.ObjectExpression
):
  | { kind: "single"; value: SimpleShortcut }
  | { kind: "platform"; macOS: SimpleShortcut; Windows: SimpleShortcut }
  | null {
  // Detect platform-specific keys (Windows/windows and macOS)
  const map = new Map<string, TSESTree.ObjectExpression>();
  for (const p of node.properties) {
    if (
      p.type === AST_NODE_TYPES.Property &&
      (p.key.type === AST_NODE_TYPES.Identifier ||
        p.key.type === AST_NODE_TYPES.Literal)
    ) {
      const k =
        p.key.type === AST_NODE_TYPES.Identifier
          ? p.key.name
          : String(p.key.value);
      if (p.value.type === AST_NODE_TYPES.ObjectExpression) {
        map.set(k, p.value);
      }
    }
  }

  const mac = map.get("macOS");
  const win = map.get("Windows") ?? map.get("windows");
  if (mac && win) {
    const macS = normalizeSimpleShortcut(mac);
    const winS = normalizeSimpleShortcut(win);
    if (macS && winS) return { kind: "platform", macOS: macS, Windows: winS };
    return null;
  }

  // Otherwise, try simple form
  const simple = normalizeSimpleShortcut(node);
  if (simple) return { kind: "single", value: simple };
  return null;
}

function findMatchingCommon(
  sc:
    | { kind: "single"; value: SimpleShortcut }
    | { kind: "platform"; macOS: SimpleShortcut; Windows: SimpleShortcut }
): CommonShortcut | null {
  if (sc.kind === "platform") {
    for (const c of COMMON_SHORTCUTS) {
      if (
        c.macOS.key === sc.macOS.key &&
        c.Windows.key === sc.Windows.key &&
        eq(c.macOS.modifiers, sc.macOS.modifiers) &&
        eq(c.Windows.modifiers, sc.Windows.modifiers)
      ) {
        return c;
      }
    }
    return null;
  }

  // For single-form, match either the macOS or Windows definition of a common shortcut
  for (const c of COMMON_SHORTCUTS) {
    const macMatch =
      c.macOS.key === sc.value.key && eq(c.macOS.modifiers, sc.value.modifiers);
    const winMatch =
      c.Windows.key === sc.value.key &&
      eq(c.Windows.modifiers, sc.value.modifiers);
    if (macMatch || winMatch) return c;
  }
  return null;
}

function ensureKeyboardImportFix(
  fixer: TSESLint.RuleFixer,
  program: TSESTree.Program
) {
  // Find an import from "@raycast/api"
  const imports = program.body.filter(
    (n): n is TSESTree.ImportDeclaration =>
      n.type === AST_NODE_TYPES.ImportDeclaration
  );
  const apiImport = imports.find((i) => i.source.value === "@raycast/api");

  if (!apiImport) {
    // Insert a new import at top
    return fixer.insertTextBefore(
      (program.body[0] as TSESTree.Node) ?? program,
      `import { Keyboard } from "@raycast/api";\n`
    );
  }

  // If already has Keyboard named import, do nothing
  const hasKeyboard = apiImport.specifiers.some(
    (s) =>
      s.type === AST_NODE_TYPES.ImportSpecifier &&
      s.imported.type === AST_NODE_TYPES.Identifier &&
      s.imported.name === "Keyboard"
  );
  if (hasKeyboard) return null;

  // If it's a named import, add Keyboard
  const lastSpecifier = apiImport.specifiers[apiImport.specifiers.length - 1];
  if (lastSpecifier && lastSpecifier.type === AST_NODE_TYPES.ImportSpecifier) {
    return fixer.insertTextAfter(lastSpecifier, `, Keyboard`);
  }

  // If it's a default or namespace import, add a named import group
  // Transform: import api from "@raycast/api"; -> import api, { Keyboard } from "@raycast/api";
  // Insert after the default/namespace specifier if present
  const spec = apiImport.specifiers[0];
  if (spec) {
    return fixer.insertTextAfter(spec, `, { Keyboard }`);
  }
  // No specifiers (e.g., `import "@raycast/api";`), add a new import above
  return fixer.insertTextBefore(
    apiImport,
    `import { Keyboard } from "@raycast/api";\n`
  );
}

export default createRule({
  name: "prefer-common-shortcut",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Warn when a shortcut matches a common one; prefer Keyboard.Shortcut.Common.* from @raycast/api.",
    },
    fixable: "code",
    schema: [],
    messages: {
      useCommon:
        "This shortcut matches Common.{{name}}. Prefer using Keyboard.Shortcut.Common.{{name}} from @raycast/api.",
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
          const shortcutAst = node.value.expression;
          const parsed = parseShortcutValue(shortcutAst);
          if (!parsed) return;

          const match = findMatchingCommon(parsed);
          if (!match) return;

          // Provide a fix to replace object with Keyboard.Shortcut.Common.<Name> and ensure import
          context.report({
            node: node.value,
            messageId: "useCommon",
            data: { name: match.name },
            fix: (fixer) => {
              const fixes = [] as RuleFix[];
              // Replace object literal
              fixes.push(
                fixer.replaceText(
                  node.value as TSESTree.Node,
                  `{Keyboard.Shortcut.Common.${match.name}}`
                )
              );
              // Ensure import
              const program = context.sourceCode.ast;
              const importFix = ensureKeyboardImportFix(fixer, program);
              if (importFix) fixes.push(importFix);
              return fixes;
            },
          });
        }
      },
    };
  },
});
