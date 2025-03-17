# Prefer Title Case (`@raycast/prefer-title-case`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Actions in Raycast's action panel should follow the [**Title Case**](https://en.wikipedia.org/wiki/Title_case) naming convention for consistency reasons.

## Rule Details

This rule checks your titles in the different `<Action>` components as well as `<ActionPanel.Submenu>`.

Examples of **incorrect** code for this rule:

```tsx
<Action title="Submit form" />
```

```tsx
<ActionPanel.Submenu title="Submit form" />
```

```tsx
<Action title={isAssignedToMe ? "Assign to me" : "unassign from me"} />
```

```tsx
<Action title={`Submit form to ${service}`} />
```

Examples of **correct** code for this rule:

```tsx
<Action title="Submit Form" />
```

```tsx
<ActionPanel.Submenu title="Submit Form" />
```

```tsx
<Action title={isAssignedToMe ? "Assign to Me" : "Unassign from Me"} />
```

```tsx
<Action title={`Submit Form to ${service}`} />
```

Note that since ESLint is a statistical analysis tool, it's not possible to cover every edge case possible, especially dynamic ones. For example, it's hard to check the title if you pass it from a prop:

```tsx
<Action title={props.item.title} />
```
