import fs from "fs";
import path from "path";

import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../utils";

type SimpleShortcut = { modifiers: string[]; key: string };

type PackagePlatformsCacheEntry = {
  hasMultiPlatform: boolean;
  mtimeMs: number;
  size: number;
};

const packagePlatformsCache = new Map<string, PackagePlatformsCacheEntry>();

function readPackagePlatformsConfig(pkgPath: string): boolean | undefined {
  let stats: ReturnType<typeof fs.statSync>;

  try {
    stats = fs.statSync(pkgPath);
  } catch {
    packagePlatformsCache.delete(pkgPath);
    return undefined;
  }

  if (!stats.isFile()) {
    packagePlatformsCache.delete(pkgPath);
    return undefined;
  }

  const cached = packagePlatformsCache.get(pkgPath);
  if (
    cached &&
    cached.mtimeMs === stats.mtimeMs &&
    cached.size === stats.size
  ) {
    return cached.hasMultiPlatform;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const platforms = pkg?.platforms;
    const hasMultiPlatform = Array.isArray(platforms) && platforms.length > 1;
    packagePlatformsCache.set(pkgPath, {
      hasMultiPlatform,
      mtimeMs: stats.mtimeMs,
      size: stats.size,
    });
    return hasMultiPlatform;
  } catch {
    packagePlatformsCache.set(pkgPath, {
      hasMultiPlatform: false,
      mtimeMs: stats.mtimeMs,
      size: stats.size,
    });
    return false;
  }
}

function hasMultiPlatformConfig(filename: string | undefined): boolean {
  if (!filename || filename.startsWith("<")) {
    return false;
  }

  let dir = path.dirname(filename);
  while (true) {
    const pkgPath = path.join(dir, "package.json");
    const hasMultiPlatform = readPackagePlatformsConfig(pkgPath);

    if (hasMultiPlatform !== undefined) {
      return hasMultiPlatform;
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  return false;
}

function parseSimpleShortcut(
  node: TSESTree.ObjectExpression
): SimpleShortcut | null {
  const props = new Map<string, TSESTree.Property>();
  for (const prop of node.properties) {
    if (
      prop.type !== AST_NODE_TYPES.Property ||
      prop.key.type !== AST_NODE_TYPES.Identifier
    ) {
      return null;
    }
    if (prop.key.name !== "modifiers" && prop.key.name !== "key") {
      return null;
    }
    props.set(prop.key.name, prop);
  }

  if (props.size !== 2) {
    return null;
  }

  const modifiersProp = props.get("modifiers");
  const keyProp = props.get("key");
  if (!modifiersProp || !keyProp) return null;
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
    if (el.type !== AST_NODE_TYPES.Literal || typeof el.value !== "string") {
      return null;
    }
    modifiers.push(el.value);
  }

  return { modifiers, key: keyProp.value.value };
}

function isAmbiguous(modifiers: string[]) {
  const hasCmd = modifiers.includes("cmd");
  const hasCtrl = modifiers.includes("ctrl");
  return (hasCmd || hasCtrl) && !(hasCmd && hasCtrl);
}

export default createRule({
  name: "no-ambiguous-platform-shortcut",
  meta: {
    type: "problem",
    docs: {
      description:
        "Warn when a shortcut is ambiguous in cross-platform extensions.",
    },
    schema: [],
    messages: {
      ambiguous:
        "This shortcut is ambiguous across platforms. Provide platform-specific shortcuts.",
    },
  },
  defaultOptions: [],
  create(context) {
    const hasMultiPlatform = hasMultiPlatformConfig(context.filename);

    if (!hasMultiPlatform) {
      return {};
    }

    return {
      JSXAttribute(node) {
        if (
          node.name.type === AST_NODE_TYPES.JSXIdentifier &&
          node.name.name === "shortcut" &&
          node.value &&
          node.value.type === AST_NODE_TYPES.JSXExpressionContainer &&
          node.value.expression.type === AST_NODE_TYPES.ObjectExpression
        ) {
          const simple = parseSimpleShortcut(node.value.expression);
          if (!simple) return;
          if (!isAmbiguous(simple.modifiers)) return;

          context.report({
            node: node.value,
            messageId: "ambiguous",
          });
        }
      },
    };
  },
});
