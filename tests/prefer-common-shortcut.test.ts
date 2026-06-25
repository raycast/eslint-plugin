// @ts-ignore
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../lib/rules/prefer-common-shortcut";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: 2020,
      sourceType: "module",
    },
  },
});

ruleTester.run("prefer-common-shortcut", rule, {
  valid: [
    // Already using Common
    {
      code: `
        import { Keyboard } from "@raycast/api";
        const C = () => <Action shortcut={Keyboard.Shortcut.Common.MoveUp} />;
      `,
    },
    // Not a shortcut attribute
    { code: `<Action title="Foo" />` },
    // Non-literal expression
    { code: `<Action shortcut={shortcut} />` },
    // Single-form that doesn't match any 'same across platforms' common shortcut
    {
      code: `<Action shortcut={{ modifiers: ["opt"], key: "arrowUp" }} />`,
    },
  ],
  invalid: [
    // Platform specific form
    {
      code: `
        const C = () => (
          <Action shortcut={{ macOS: { modifiers: ["cmd", "shift"], key: "arrowUp" }, Windows: { modifiers: ["ctrl", "shift"], key: "arrowUp" } }} />
        );
      `,
      errors: [{ messageId: "useCommon" }],
      output: `
        import { Keyboard } from "@raycast/api";
const C = () => (
          <Action shortcut={Keyboard.Shortcut.Common.MoveUp} />
        );
      `,
    },
    // Simple form matching a cross-platform identical common shortcut (Remove)
    {
      code: `
        import { Keyboard } from "@raycast/api";
        const C = () => <Action shortcut={{ modifiers: ["ctrl"], key: "d" }} />;
      `,
      errors: [{ messageId: "useCommon" }],
      output: `
        import { Keyboard } from "@raycast/api";
        const C = () => <Action shortcut={Keyboard.Shortcut.Common.Remove} />;
      `,
    },
    // Adds named import when there is an existing import without Keyboard
    {
      code: `
        import { Icon } from "@raycast/api";
        const C = () => <Action shortcut={{ modifiers: ["cmd"], key: "n" }} />;
      `,
      errors: [{ messageId: "useCommon" }],
      output: `
        import { Icon, Keyboard } from "@raycast/api";
        const C = () => <Action shortcut={Keyboard.Shortcut.Common.New} />;
      `,
    },
    // Creates a new import if none exists
    {
      code: `
        const C = () => <Action shortcut={{ modifiers: ["cmd"], key: "r" }} />;
      `,
      errors: [{ messageId: "useCommon" }],
      output: `
        import { Keyboard } from "@raycast/api";
const C = () => <Action shortcut={Keyboard.Shortcut.Common.Refresh} />;
      `,
    },
    // Adds a runtime import when existing import is type-only
    {
      code: `
        import type { Icon } from "@raycast/api";
        const C = () => <Action shortcut={{ modifiers: ["cmd"], key: "s" }} />;
      `,
      errors: [{ messageId: "useCommon" }],
      output: `
        import { Keyboard } from "@raycast/api";
import type { Icon } from "@raycast/api";
        const C = () => <Action shortcut={Keyboard.Shortcut.Common.Save} />;
      `,
    },
    // Uses existing namespace imports
    {
      code: `
        import * as Raycast from "@raycast/api";
        const C = () => <Action shortcut={{ modifiers: ["cmd"], key: "e" }} />;
      `,
      errors: [{ messageId: "useCommon" }],
      output: `
        import * as Raycast from "@raycast/api";
        const C = () => <Action shortcut={Raycast.Keyboard.Shortcut.Common.Edit} />;
      `,
    },
    // Uses existing aliased Keyboard imports
    {
      code: `
        import { Keyboard as RaycastKeyboard } from "@raycast/api";
        const C = () => <Action shortcut={{ modifiers: ["cmd"], key: "o" }} />;
      `,
      errors: [{ messageId: "useCommon" }],
      output: `
        import { Keyboard as RaycastKeyboard } from "@raycast/api";
        const C = () => <Action shortcut={RaycastKeyboard.Shortcut.Common.Open} />;
      `,
    },
  ],
});
