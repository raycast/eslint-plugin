import path from "path";

// @ts-ignore
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../lib/rules/no-ambiguous-platform-shortcut";

const multiPlatformFile = path.join(
  __dirname,
  "fixtures",
  "multi-platform",
  "src",
  "command.tsx"
);

const singlePlatformFile = path.join(
  __dirname,
  "fixtures",
  "single-platform",
  "src",
  "command.tsx"
);

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: 2020,
      sourceType: "module",
    },
  },
});

ruleTester.run("no-ambiguous-platform-shortcut", rule, {
  valid: [
    // Not multi-platform file (single platform config)
    {
      filename: singlePlatformFile,
      code: `<Action shortcut={{ modifiers: ["cmd"], key: "o" }} />`,
    },
    // Multi-platform but includes both modifiers => not ambiguous
    {
      filename: multiPlatformFile,
      code: `<Action shortcut={{ modifiers: ["cmd", "ctrl"], key: "o" }} />`,
    },
    // Multi-platform but platform-specific object literal (ignored)
    {
      filename: multiPlatformFile,
      code: `<Action shortcut={{ macOS: { modifiers: ["cmd"], key: "o" }, Windows: { modifiers: ["ctrl"], key: "o" } }} />`,
    },
    // Non-shortcut attribute
    {
      filename: multiPlatformFile,
      code: `<Action title="Foo" />`,
    },
  ],
  invalid: [
    {
      filename: multiPlatformFile,
      code: `<Action shortcut={{ modifiers: ["cmd"], key: "o" }} />`,
      errors: [{ messageId: "ambiguous" }],
    },
    {
      filename: multiPlatformFile,
      code: `<Action shortcut={{ modifiers: ["ctrl"], key: "o" }} />`,
      errors: [{ messageId: "ambiguous" }],
    },
  ],
});
