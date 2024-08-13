# Prefer Placeholders for Text Fields (`@raycast/prefer-placeholders`)

<!-- end auto-generated rule header -->

For a better visual experience, add placeholders in text field and text area components.

## Rule Details

This rule checks if you have added a placeholder in the `<Form.TextField>` and `<Form.TextAarea>` components.

Examples of **incorrect** code for this rule:

```tsx
<Form.TextField title="Name" />
```

```tsx
<Form.TextArea title="Summary" />
```

Examples of **correct** code for this rule:

```tsx
<Form.TextField placeholder="John Doe" title="Name" />
```

```tsx
<Form.TextArea
  placeholder="Write a brief description here..."
  title="Summary"
/>
```
