# ESLint

Raycast makes it possible to lint your extensions out of the box in a simple way using the `ray lint` script.

## ESLint Config

Raycast provides a configuration by default that includes everything you need to lint your Raycast extensions.

### Installation

Install `@raycast/eslint-config` as part of your dev dependencies:

```sh
npm install @raycast/eslint-config --save-dev
```

Note that this package requires `eslint`, `prettier` and `typescript` to be installed.

### Usage

Add `@raycast` to the `extends` section of your `.eslintrc` configuration file.

```json
{ 
  "extends": [
    "@raycast"
  ]
}
```

### Configuration

Configure the rules you want to use under the `rules` section:

```json
{
  "extends": [
    "@raycast"
  ],
  "rules": {
    "@raycast/prefer-placeholders": "warn"
  }
}
```

## ESLint Plugin

This ESLint plugin is designed to help you follow best practices as you build Raycast extensions.

> Note that this plugin is provided by default in the configuration shared above. Follow the installation steps below only if you want to have more control over the default configuration.

### Installation

Install `@raycast/eslint-plugin` as part of your dev dependencies:

```sh
npm install @raycast/eslint-plugin --save-dev
```

### Usage

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
