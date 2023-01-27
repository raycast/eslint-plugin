import { ESLintUtils } from "@typescript-eslint/utils";
import rule from "./use-title-case";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run("use-title-case", rule, {
  valid: [
    {
      code: `
        <Action title="Submit Form" />
      `,
    },
    {
      code: `
        <ActionPanel.Submenu title="Submit Form" />
      `,
    },
    {
      code: `
        <Action.CopyToClipboard title="Copy Action" />
      `,
    },
    {
      code: `
        <Foobar title="Submit form" />
      `,
    },
  ],
  invalid: [
    {
      code: `
        <Action title="Submit form" />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <Action title="Submit Form" />
      `,
    },
    {
      code: `
        <ActionPanel.Submenu title="Submit form" />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <ActionPanel.Submenu title="Submit Form" />
      `,
    },
    {
      code: `
        <Action.CopyToClipboard title="Submit form" />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <Action.CopyToClipboard title="Submit Form" />
      `,
    },
    {
      code: `
        <Action title="Send my message to someone" />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <Action title="Send My Message to Someone" />
      `,
    },
    {
      code: `
        <Action title={"Send my message to someone"} />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <Action title={"Send My Message to Someone"} />
      `,
    },
    {
      code: `
        <Action title={isAssignedToMe ? "Assign to me" : "Unassign From Me"} />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <Action title={isAssignedToMe ? "Assign to Me" : "Unassign From Me"} />
      `,
    },
    {
      code: `
        <Action title={isAssignedToMe ? "Assign to Me" : "Unassign from me"} />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <Action title={isAssignedToMe ? "Assign to Me" : "Unassign From Me"} />
      `,
    },
    {
      code: `
        <Action title={isAssignedToMe ? "Assign to me" : "Unassign from me"} />
      `,
      errors: [
        { messageId: "isNotTitleCased" },
        { messageId: "isNotTitleCased" },
      ],
      output: `
        <Action title={isAssignedToMe ? "Assign to Me" : "Unassign From Me"} />
      `,
    },
  ],
});
