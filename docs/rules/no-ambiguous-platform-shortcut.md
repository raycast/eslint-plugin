# @raycast/no-ambiguous-platform-shortcut

📝 Warn when a shortcut is ambiguous in cross-platform extensions.

⚠️ This rule _warns_ in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Warns when a single-form shortcut literal (one modifiers/key object) uses only `cmd` or only `ctrl` in an extension that targets multiple platforms. In multi-platform extensions, you should either provide platform-specific shortcuts (with `macOS`/`Windows` sections) or include both modifiers to ensure parity.

## Rule Details

This rule checks JSX attributes named `shortcut`. It only inspects literal objects of the simple form:

```tsx
<Action shortcut={{ modifiers: ["cmd"], key: "s" }} />
```

Platform-specific shortcut objects (those with `macOS`/`Windows`) and dynamic expressions are ignored.

The rule first locates the closest `package.json` to the file being linted. If the package declares a `platforms` array with more than one value, the rule activates and warns about ambiguous shortcuts.

### Examples of incorrect code

```tsx
<Action shortcut={{ modifiers: ["cmd"], key: "s" }} />
```

```tsx
<Action shortcut={{ modifiers: ["ctrl"], key: "s" }} />
```

### Examples of correct code

```tsx
<Action shortcut={{ modifiers: ["cmd", "ctrl"], key: "s" }} />
```

```tsx
<Action
  shortcut={{
    macOS: { modifiers: ["cmd"], key: "s" },
    Windows: { modifiers: ["ctrl"], key: "s" },
  }}
/>
```

```tsx
// Single-platform extension ⇒ rule does not apply
<Action shortcut={{ modifiers: ["cmd"], key: "s" }} />
```

> ℹ️ The rule only warns; it does not provide an autofix. Choose platform-specific shortcuts or include both modifiers manually.
