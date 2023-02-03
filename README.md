# eslint-plugin-raycast

This ESLint plugin is designed to help you follow best practices as you build Raycast extensions.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-raycast`:

```sh
npm install eslint-plugin-raycast --save-dev
```

## Usage

Add `raycast` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "raycast"
    ]
}
```


Then configure the rules you want to use under the rules section:

```json
{
    "rules": {
        "raycast/prefer-title-case": "warn"
    }
}
```

Note that a recommended configuration is exposed from the plugin to use the rules as recommended by Raycast:

```json
{
    "extends": [
        "plugin:raycast/recommended"
    ]
}
```

## Rules

<!-- begin auto-generated rules list -->

⚠️ Configurations set to warn in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                                             | Description                         | ⚠️ | 🔧 |
| :------------------------------------------------------------------------------- | :---------------------------------- | :- | :- |
| [prefer-placeholders-text-fields](docs/rules/prefer-placeholders-text-fields.md) | Prefer Placeholders for Text Fields |    |    |
| [prefer-title-case](docs/rules/prefer-title-case.md)                             | Prefer Title Case                   | ✅  | 🔧 |

<!-- end auto-generated rules list -->


