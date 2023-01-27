"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const avoid_long_titles_1 = __importDefault(require("./rules/avoid-long-titles"));
const use_title_case_1 = __importDefault(require("./rules/use-title-case"));
module.exports = {
    configs: {
        recommended: {
            plugins: ["raycast"],
            rules: {
                "raycast/avoid-long-titles": "warn",
                "raycast/use-title-case": "error",
            },
        },
    },
    rules: {
        "avoid-long-titles": avoid_long_titles_1.default,
        "use-title-case": use_title_case_1.default,
    },
};
