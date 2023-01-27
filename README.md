# eslint-plugin-raycast

ESLint plugin designed specifically for Raycast extensions

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


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "raycast/rule-name": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

| Name                                             |
| :----------------------------------------------- |
| [async-func-name](docs/rules/async-func-name.md) |

<!-- end auto-generated rules list -->


