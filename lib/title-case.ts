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
export function titleCase(s: string): string {
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

  const fixedCaseWords: { [key: string]: string } = {
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
    ai: "AI",
    json: "JSON",
    ios: "iOS",
    id: "ID",
    "plug-in": "Plug-in",
    "built-in": "Built-in",
    vscode: "VS Code",
    css: "CSS",
    html: "HTML",
    ip: "IP",
    svg: "SVG",
    totp: "TOTP",
    mcp: "MCP"
  };

  // Replace all instances of '...' with '…'
  s = s.replace(/\.\.\./g, "…");

  const words = s.split(" ").map((x) => x.toString());
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let leadingNonLetter = "";
    let trailingNonLetter = "";

    // Handle leading/trailing non-letter characters
    const leadingMatch = word.match(/^[^a-zA-Z]+/);
    if (leadingMatch) {
      leadingNonLetter = leadingMatch[0];
      word = word.slice(leadingNonLetter.length);
    }
    const trailingMatch = word.match(/[^a-zA-Z]+$/);
    if (trailingMatch) {
      trailingNonLetter = trailingMatch[0];
      word = word.slice(0, word.length - trailingNonLetter.length);
    }

    const lowerWord = word.toLowerCase();
    const ok = noCaps[lowerWord];
    const isArticle = articles[lowerWord];
    const fixedCase = fixedCaseWords[lowerWord];

    if (fixedCase) {
      words[i] = fixedCase;
    } else if (word.startsWith("http://") || word.startsWith("https://")) {
      words[i] = word;
    } else if (
      (!ok && !isArticle) ||
      i === 0 ||
      (isArticle && words[i - 1].endsWith(":"))
    ) {
      words[i] = word
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("-");
    } else {
      words[i] = word.toLowerCase();
    }

    words[i] = leadingNonLetter + words[i] + trailingNonLetter;
  }

  return words.join(" ");
}
