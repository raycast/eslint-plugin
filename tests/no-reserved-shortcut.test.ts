// @ts-ignore
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../lib/rules/no-reserved-shortcut";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: 2020,
      sourceType: "module",
    },
  },
});

ruleTester.run("no-reserved-shortcut", rule, {
  valid: [
    { code: `<Action shortcut={{ modifiers: ["cmd"], key: "x" }} />` }, // not reserved
    {
      code: `<Action shortcut={{ modifiers: ["cmd"], key: "w", foo: "bar" }} />`,
    }, // extra prop -> ignored
    {
      code: `<Action shortcut={{ macOS: { modifiers: ["cmd"], key: "w" }, Windows: { modifiers: ["ctrl"], key: "w" } }} />`,
    }, // platform form ignored
    { code: `<Action />` },
  ],
  invalid: [
    {
      code: `<Action shortcut={{ modifiers: ["cmd"], key: "w" }} />`,
      errors: [{ messageId: "reserved" }],
    },
    {
      code: `<Action shortcut={{ modifiers: [], key: "delete" }} />`,
      errors: [{ messageId: "reserved" }],
    },
    {
      code: `<Action shortcut={{ modifiers: ["cmd"], key: "," }} />`,
      errors: [{ messageId: "reserved" }],
    },
    {
      code: `<Action shortcut={{ modifiers: ["shift", "cmd"], key: "/" }} />`,
      errors: [{ messageId: "reserved" }],
    },
  ],
});
