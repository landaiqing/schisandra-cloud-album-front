import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import {fileURLToPath} from "node:url";
import {dirname, resolve} from "path";
import {readFileSync} from "node:fs";
// 动态读取 .eslintrc-auto-import.json 文件内容
const autoImportConfig = JSON.parse(
    readFileSync(
        resolve(dirname(fileURLToPath(import.meta.url)), ".eslintrc-auto-import.json"),
        "utf-8",
    ),
);

export default [
    {files: ["**/*.{js,mjs,cjs,ts,vue}"]},
    {languageOptions: {globals: {...globals.browser, ...globals.node, ...autoImportConfig.globals}}},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/essential"],
    {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}},
    {
        rules: {
            semi: "error",
            "@typescript-eslint/no-explicit-any": "off",
            // "no-unused-vars": "off",
            // "@typescript-eslint/no-unused-vars": ["off"],
            "vue/multi-word-component-names": "off",
        }
    }
];
