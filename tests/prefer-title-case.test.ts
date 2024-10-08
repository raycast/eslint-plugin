// @ts-ignore
import { RuleTester } from "eslint";
import rule from "../lib/rules/prefer-title-case";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run("prefer-title-case", rule, {
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
        <Foobar title="submit form" />
      `,
    },
    {
      code: `
        <ActionPanel.Submenu title={"Select Profile"} />
      `,
    },
    {
      code: `
        <Action title="Unassign from Me" />
      `,
    },
    {
      code: `
        <Action title={isAssignedToMe ? "Assign to Me" : "Unassign from Me"} />
      `,
    },
    {
      code: `
        <Action title={\`Select Firefox Profile\`} />
      `,
    },
    {
      code: `
        <Action title={\`Select Firefox Profile (\$\{profile\})\`} />
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
        <Action title="Submit macos" />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <Action title="Submit macOS" />
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
        <Action title="Send My Message To Someone" />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <Action title="Send My Message to Someone" />
      `,
    },
    {
      code: `
        <Action title="manage language sets…" />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <Action title="Manage Language Sets…" />
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
        <Action title={isAssignedToMe ? "Assign to me" : "Unassign from Me"} />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <Action title={isAssignedToMe ? "Assign to Me" : "Unassign from Me"} />
      `,
    },
    {
      code: `
        <Action title={isAssignedToMe ? "Assign to Me" : "Unassign from me"} />
      `,
      errors: [{ messageId: "isNotTitleCased" }],
      output: `
        <Action title={isAssignedToMe ? "Assign to Me" : "Unassign from Me"} />
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
        <Action title={isAssignedToMe ? "Assign to Me" : "Unassign from Me"} />
      `,
    },
    {
      code: "<Action title={`Submit form`} />",
      errors: [{ messageId: "isNotTitleCased" }],
    },
    {
      code: "<Action title={`Submit form to ${service}`} />",
      errors: [{ messageId: "isNotTitleCased" }],
    },
    {
      code: "<Action title={`Submit form to ${service} and also to ${service2}`} />",
      errors: [{ messageId: "isNotTitleCased" }],
    },
  ],
});
