// @ts-ignore
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../lib/rules/prefer-ellipsis";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run("prefer-ellipsis", rule, {
  valid: [
    {
      code: `
        <Action title="Loading…" />
      `,
    },
    {
      code: `
        <ActionPanel.Submenu title="Select File…" />
      `,
    },
    {
      code: `
        <Action.CopyToClipboard title="Copy Path…" />
      `,
    },
    // Not an action component -> ignored
    {
      code: `
        <Foobar title="Wait..." />
      `,
    },
    // Expression container with correct ellipsis
    {
      code: `
        <Action title={"Open…"} />
      `,
    },
    // Conditional expression already correct
    {
      code: `
        <Action title={isLoading ? "Stop…" : "Start…"} />
      `,
    },
    // Template literal with correct ellipsis
    {
      code: `
        <Action title={\`Upload … File\`} />
      `,
    },
    // Template literal with dynamic parts but no three consecutive dots
    {
      code: `
        <Action title={\`Upload \${fileName} Now\`} />
      `,
    },
  ],
  invalid: [
    // Simple literal replacement
    {
      code: `
        <Action title="Loading..." />
      `,
      errors: [{ messageId: "isNotEllipsisCharacter" }],
      output: `
        <Action title="Loading…" />
      `,
    },
    // Member expression ActionPanel.Submenu
    {
      code: `
        <ActionPanel.Submenu title="Select File..." />
      `,
      errors: [{ messageId: "isNotEllipsisCharacter" }],
      output: `
        <ActionPanel.Submenu title="Select File…" />
      `,
    },
    // Namespaced action member (CopyToClipboard)
    {
      code: `
        <Action.CopyToClipboard title="Copy Path..." />
      `,
      errors: [{ messageId: "isNotEllipsisCharacter" }],
      output: `
        <Action.CopyToClipboard title="Copy Path…" />
      `,
    },
    // Expression container with literal inside
    {
      code: `
        <Action title={"Open..."} />
      `,
      errors: [{ messageId: "isNotEllipsisCharacter" }],
      output: `
        <Action title={"Open…"} />
      `,
    },
    // Conditional expression - both sides
    {
      code: `
        <Action title={isLoading ? "Stop..." : "Start..."} />
      `,
      errors: [
        { messageId: "isNotEllipsisCharacter" },
        { messageId: "isNotEllipsisCharacter" },
      ],
      output: `
        <Action title={isLoading ? "Stop…" : "Start…"} />
      `,
    },
    // Conditional expression - only alternate
    {
      code: `
        <Action title={isLoading ? "Stop…" : "Start..."} />
      `,
      errors: [{ messageId: "isNotEllipsisCharacter" }],
      output: `
        <Action title={isLoading ? "Stop…" : "Start…"} />
      `,
    },
    // Template literal with static part containing ... (cannot auto-fix because rule reports on entire expression when template literal)
    {
      code: `<Action title={\`Uploading...\`} />`,
      errors: [{ messageId: "isNotEllipsisCharacter" }],
    },
    // Template literal with multiple static parts containing ...
    {
      code: `<Action title={\`Upload \${fileName}... to \${target}...\`} />`,
      errors: [{ messageId: "isNotEllipsisCharacter" }],
    },
  ],
});
