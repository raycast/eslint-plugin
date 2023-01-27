"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const avoid_long_titles_1 = __importDefault(require("./avoid-long-titles"));
const ruleTester = new utils_1.ESLintUtils.RuleTester({
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: { jsx: true },
    },
});
ruleTester.run("avoid-long-titles", avoid_long_titles_1.default, {
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
