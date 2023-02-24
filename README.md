# Raycast ESLint Plugin

This ESLint plugin is designed to help you follow best practices as you build Raycast extensions.

> Note that this plugin is provided by default in `@raycast/eslint-config`. Follow the installation steps below only if you want to have more control over the default configuration.

## Installation

Install `@raycast/eslint-plugin` as part of your dev dependencies:

```sh
npm install @raycast/eslint-plugin --save-dev
```

## Usage

Add `@raycast` to the `plugins` section of your `.eslintrc` configuration file.

```json
{
  "plugins": [
    "@raycast"
  ]
}
```

Then configure the rules you want to use under the `rules` section:

```json
{
  "plugins": [
    "@raycast"
  ],
  "rules": {
    "@raycast/prefer-placeholders": "warn"
  }
}
```

Note that a configuration is exposed from the plugin to use the recommended rules by Raycast:

```json
{
  "extends": [
    "plugin:@raycast/recommended"
  ]
}
```

## Rules

You'll find below a summary of all the rules included in our ESLint plugin.

<!-- begin auto-generated rules list -->

⚠️ Configurations set to warn in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                     | Description                         | ⚠️ | 🔧 |
| :------------------------------------------------------- | :---------------------------------- | :- | :- |
| [prefer-placeholders](docs/rules/prefer-placeholders.md) | Prefer Placeholders for Text Fields |    |    |
| [prefer-title-case](docs/rules/prefer-title-case.md)     | Prefer Title Case                   | ✅  | 🔧 |

<!-- end auto-generated rules list -->


