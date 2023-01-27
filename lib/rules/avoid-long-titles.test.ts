import { ESLintUtils } from "@typescript-eslint/utils";
import rule from "./avoid-long-titles";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run("avoid-long-titles", rule, {
  valid: [
    {
      code: `
        <Action title="Not so long title" />
      `,
    },
  ],
  invalid: [
    {
      code: `
        <Action title="This is a very long title that should be avoided" />
      `,
      errors: [{ messageId: "titleTooLong" }],
    },
  ],
});
