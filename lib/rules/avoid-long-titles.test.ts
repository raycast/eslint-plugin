import { ESLintUtils } from "@typescript-eslint/utils";
import rule from "./avoid-long-titles";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
});

const longActionTitle = `This is a very long title that should be avoided`;
const shortTitle = `Submit Form`;

ruleTester.run("avoid-long-titles", rule, {
  valid: [
    {
      code: `
        <Action title="${shortTitle}" />
      `,
    },
    {
      code: `
        <ActionPanel.Submenu title="${shortTitle}" />
      `,
    },
    {
      code: `
        <Foobar title="${longActionTitle}" />
      `,
    },
  ],
  invalid: [
    {
      code: `
        <Action title="${longActionTitle}" />
      `,
      errors: [{ messageId: "titleTooLong" }],
    },
    {
      code: `
        <ActionPanel.Submenu title="${longActionTitle}" />
      `,
      errors: [{ messageId: "titleTooLong" }],
    },
  ],
});
