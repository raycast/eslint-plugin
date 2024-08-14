import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { isActionComponent, createRule } from "../utils";

export default createRule({
  create: (context) => {
    return {
      JSXOpeningElement: (node) => {
        if (isActionComponent(node.name)) {
          const titleAttribute = node.attributes.find((attribute) => {
            return (
              attribute.type === "JSXAttribute" &&
              attribute.name.name === "title"
            );
          });

          if (titleAttribute) {
            const value =
              titleAttribute.type === "JSXAttribute" && titleAttribute.value;

            // In the case of a simple string
            // <Action title="Submit form" />
            if (value) {
              if (
                value.type === AST_NODE_TYPES.Literal &&
                typeof value.value === "string"
              ) {
                const originalTitle = value.value;

                const formattedTitle = titleCase(originalTitle);

                if (originalTitle !== formattedTitle) {
                  context.report({
                    node: value,
                    messageId: "isNotTitleCased",
                    fix: (fixer) =>
                      fixer.replaceText(value, `"${formattedTitle}"`),
                  });
                }
              }

              // If the title is an expression (= starts with a bracket)
              if (value.type === AST_NODE_TYPES.JSXExpressionContainer) {
                const expression = value.expression;

                // If the expression is a simple string
                // <Action title={"Submit form"} />
                if (
                  expression.type === AST_NODE_TYPES.Literal &&
                  expression.value &&
                  typeof expression.value === "string"
                ) {
                  const formattedTitle = titleCase(expression.value);

                  if (expression.value !== formattedTitle) {
                    context.report({
                      node: expression,
                      messageId: "isNotTitleCased",
                      fix: (fixer) =>
                        fixer.replaceText(expression, `"${formattedTitle}"`),
                    });
                  }
                }

                // If the expression is a simple ternary condition
                // <Action title={isAssignedToMe ? "Assign to Me" : "Unassign from Me"} />
                if (expression.type === AST_NODE_TYPES.ConditionalExpression) {
                  const consequent = expression.consequent;
                  const alternate = expression.alternate;

                  if (
                    consequent.type === AST_NODE_TYPES.Literal &&
                    consequent.value &&
                    typeof consequent.value === "string"
                  ) {
                    const formattedTitle = titleCase(consequent.value);

                    if (consequent.value !== formattedTitle) {
                      context.report({
                        node: consequent,
                        messageId: "isNotTitleCased",
                        fix: (fixer) =>
                          fixer.replaceText(consequent, `"${formattedTitle}"`),
                      });
                    }
                  }

                  if (
                    alternate.type === AST_NODE_TYPES.Literal &&
                    alternate.value &&
                    typeof alternate.value === "string"
                  ) {
                    const formattedTitle = titleCase(alternate.value);

                    if (alternate.value !== formattedTitle) {
                      context.report({
                        node: alternate,
                        messageId: "isNotTitleCased",
                        fix: (fixer) =>
                          fixer.replaceText(alternate, `"${formattedTitle}"`),
                      });
                    }
                  }
                }

                // If the expression is a template literal
                // <Action title={`Submit form`} />
                // or
                // <Action title={`Submit ${formName} form`} />
                if (expression.type === AST_NODE_TYPES.TemplateLiteral) {
                  const quasis = expression.quasis;

                  var hasQuasiWithoutTitleCase = false;

                  quasis.forEach((quasi) => {
                    if (
                      quasi.type === AST_NODE_TYPES.TemplateElement &&
                      quasi.value &&
                      typeof quasi.value.raw === "string"
                    ) {
                      const formattedTitle = titleCase(quasi.value.raw);

                      if (quasi.value.raw !== formattedTitle) {
                        hasQuasiWithoutTitleCase = true;
                      }
                    }
                  });

                  if (hasQuasiWithoutTitleCase) {
                    return context.report({
                      node: expression,
                      messageId: "isNotTitleCased",
                    });
                  }
                }
              }
            }
          }
        }
      },
    };
  },
  name: "prefer-title-case",
  meta: {
    fixable: "code",
    messages: {
      isNotTitleCased:
        "Prefer Title Case naming convention for action titles (e.g Copy to Clipboard).",
    },
    type: "suggestion",
    docs: {
      description: "Prefer Title Case",
    },
    schema: [],
  },
  defaultOptions: [],
});

// When using title-style capitalization, don’t capitalize:

// - Articles (`a`, `an`, `the`), unless an article is the first word or follows a colon
// - Coordinating conjunctions (`and`, `but`, `or`, `nor`, `for`, `yet`, and `so`)
// - The word `to` in infinitives (How to Start Your Computer)
// - The word `as`, regardless of the part of speech
// - Words that always begin with a lowercase letter, such as `iPad` and `macOS`
// - Prepositions of four letters or fewer (`at`, `by`, `for`, `from`, `in`, `into`, `of`, `off`, `on`, `onto`, `out`, `over`, `to`, `up`, and `with`), except when the word is part of a verb phrase or is used as another part of speech (such as an adverb, adjective, noun, or verb)
//   - Starting Up the Computer
//   - Logging In to the Server
//   - Getting Started with Your MacBook Pro

// When using title-style capitalization, capitalize:
// - The first and last word, regardless of the part of speech
// - The second word in a hyphenated compound (except for `Built-in` and `Plug-in`)
//   - High-Level Events
//   - 32-Bit Addressing
function titleCase(s: string): string {
  // Define the words that should not be capitalized unless they are the first or last word in the title or follow a colon.
  const noCaps: { [key: string]: boolean } = {
    and: true,
    but: true,
    or: true,
    nor: true,
    for: true,
    yet: true,
    so: true,
    to: true,
    as: true,
    at: true,
    by: true,
    from: true,
    in: true,
    into: true,
    of: true,
    off: true,
    on: true,
    onto: true,
    out: true,
    over: true,
    up: true,
    with: true,
  };

  const articles: { [key: string]: boolean } = {
    a: true,
    an: true,
    the: true,
  };

  const fixedCaseWords: { [key: string]: boolean } = {
    npm: true,
    "crates.io": true,
    dbt: true,
    "pub.dev": true,
    kubectx: true,
    "monday.com": true,
    "ray.so": true,
    flomo: true,
    iterm: true,
    xkcd: true,
    macos: true,
    iphone: true,
    github: true,
    ide: true,
    url: true,
    vs: true,
  };

  const fixedCaseWordsMap: { [key: string]: string } = {
    npm: "npm",
    "crates.io": "crates.io",
    dbt: "dbt",
    "pub.dev": "pub.dev",
    kubectx: "kubectx",
    "monday.com": "monday.com",
    "ray.so": "ray.so",
    flomo: "flomo",
    iterm: "iTerm",
    xkcd: "xkcd",
    macos: "macOS",
    iphone: "iPhone",
    github: "GitHub",
    ide: "IDE",
    url: "URL",
    vs: "VS",
  };

  // Replace all instances of '...' with '…'
  s = s.replace(/\.\.\./g, "…");

  const words = s.split(" ");
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const lowerWord = word.toLowerCase();
    const ok = noCaps[lowerWord];
    const isArticle = articles[lowerWord];
    const isFixedCase = fixedCaseWords[lowerWord];

    if (isFixedCase) {
      words[i] = fixedCaseWordsMap[lowerWord];
    } else if (
      (!ok && !isArticle) ||
      i === 0 ||
      i === words.length - 1 ||
      (isArticle && words[i - 1].endsWith(":"))
    ) {
      words[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    } else {
      words[i] = word.toLowerCase();
    }
  }

  return words.join(" ");
}
