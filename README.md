# Raycast ESLint Plugin

This ESLint plugin is designed to help you follow best practices as you build Raycast extensions.

> This plugin is not to be confused with the ESLint configuration we provide.
>
> `@raycast/eslint-plugin` exposes the rules for Raycast extensions while `@raycast/eslint-config` abstracts Raycast's extensions configuration so you can set it up in a simple way.

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

Then configure the rules you want to use under the rules section:

```json
{
    "rules": {
        "@raycast/prefer-placeholders": "warn"
    }
}
```

Note that a recommended configuration is exposed from the plugin to use the rules as recommended by Raycast:

```json
{
    "extends": [
        "plugin:@raycast/recommended"
    ]
}
```

## Rules

<!-- begin auto-generated rules list -->

⚠️ Configurations set to warn in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                     | Description                         | ⚠️ | 🔧 |
| :------------------------------------------------------- | :---------------------------------- | :- | :- |
| [prefer-placeholders](docs/rules/prefer-placeholders.md) | Prefer Placeholders for Text Fields |    |    |
| [prefer-title-case](docs/rules/prefer-title-case.md)     | Prefer Title Case                   | ✅  | 🔧 |

<!-- end auto-generated rules list -->


