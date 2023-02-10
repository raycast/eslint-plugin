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
<Form.TextArea title="Name" />
```

Examples of **correct** code for this rule:

```tsx
<Form.TextField placeholder="John Doe" />
```

```tsx
<Form.TextArea placeholder="John Doe" />
```