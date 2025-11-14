# Warn when a shortcut prop defines a reserved shortcut that Raycast uses (`@raycast/no-reserved-shortcut`)

<!-- end auto-generated rule header -->

Warns when you define a literal shortcut that conflicts with one of Raycast's reserved shortcuts. Reserved shortcuts are used internally by the Raycast UI and reusing them in extensions may create confusing experiences.

## Rule Details

This rule inspects JSX `shortcut` attributes with a direct object literal of the simple form:

```tsx
<Action shortcut={{ modifiers: ["cmd"], key: "w" }} />
```

Platform form objects (with `macOS` / `Windows`) and dynamically built shortcuts are ignored.

### Examples of incorrect code

```tsx
<Action shortcut={{ modifiers: ["cmd"], key: "w" }} />
```

```tsx
<Action shortcut={{ modifiers: [], key: "delete" }} />
```

### Examples of correct code

```tsx
<Action shortcut={{ modifiers: ["cmd"], key: "x" }} />
```

```tsx
<Action
  shortcut={{
    macOS: { modifiers: ["cmd"], key: "w" },
    Windows: { modifiers: ["ctrl"], key: "w" },
  }}
/>
```

## Reserved Shortcuts Checked

- CloseWindow: cmd + w
- Delete: delete
- DeleteForward: deleteForward
- DeleteLineBackward: cmd + delete
- DeleteWordBackward: opt + delete
- GoBack: escape
- OpenActionPanel: cmd + k
- OpenPreferences: cmd + ,
- OpenSearchBarDropdown: cmd + p
- OpenSearchBarLink: shift + cmd + /
- PrimaryAction: enter
- Quit: cmd + q
- ReturnToRoot: cmd + escape
- SecondaryAction: cmd + enter
- SelectAll: cmd + a

Note: The rule does not attempt an autofix; choose an alternate shortcut instead.
