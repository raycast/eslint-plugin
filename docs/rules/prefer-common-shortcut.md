# Warn when a shortcut matches a common one; prefer Keyboard.Shortcut.Common.* from @raycast/api (`@raycast/prefer-common-shortcut`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

When a React component uses a `shortcut` prop with a literal object that matches a
well-known shortcut, prefer using `Keyboard.Shortcut.Common.*` from `@raycast/api`.

This keeps shortcuts consistent across platforms and makes intent explicit.

## Rule Details

This rule inspects JSX attributes named `shortcut` and looks for object literals in either of these forms:

- Single form: `{ modifiers: ["cmd"], key: "s" }`
- Platform form: `{ macOS: { modifiers: ["cmd"], key: "s" }, Windows: { modifiers: ["ctrl"], key: "s" } }`

If the value equals a known common shortcut, the rule suggests replacing it with the corresponding
`Keyboard.Shortcut.Common.Name` and will also add `Keyboard` to your `@raycast/api` import or create
one if missing.

### Examples

Incorrect code:

```tsx
<Action shortcut={{ modifiers: ["cmd"], key: "n" }} />
```

```tsx
<Action
  shortcut={{
    macOS: { modifiers: ["cmd", "shift"], key: "arrowUp" },
    Windows: { modifiers: ["ctrl", "shift"], key: "arrowUp" },
  }}
/>
```

Correct code:

```tsx
import { Keyboard } from "@raycast/api";

<Action shortcut={Keyboard.Shortcut.Common.New} />;
```

```tsx
<Action shortcut={Keyboard.Shortcut.Common.MoveUp} />
```

Note that the rule only flags "single" (non-platform) object literals when the common shortcut is exactly the same on macOS and Windows. For platform-specific differences, use the `platform` object form in your code or the corresponding `Keyboard.Shortcut.Common.*` reference.
