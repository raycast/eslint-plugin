import { ESLintUtils } from "@typescript-eslint/utils";
import rule from "./prefer-placeholders-text-fields";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run("prefer-placeholders-text-fields", rule, {
  valid: [
    {
      code: `
        <Form.TextField placeholder="John Doe" />
      `,
    },
    {
      code: `
        <Form.TextArea placeholder="John Doe" />
      `,
    },
    {
      code: `
        <Foobar foo="bar" />
      `,
    },
  ],
  invalid: [
    {
      code: `
        <Form.TextField title="Name" />
      `,
      errors: [{ messageId: "hasNoPlaceholder" }],
    },
    {
      code: `
        <Form.TextArea title="Name" />
      `,
      errors: [{ messageId: "hasNoPlaceholder" }],
    },
  ],
});
