// @ts-ignore
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../lib/rules/prefer-placeholders";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run("prefer-placeholders", rule, {
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
