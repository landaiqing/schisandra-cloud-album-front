import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import {fileURLToPath} from "node:url";
import {dirname, resolve} from "path";
import {readFileSync} from "node:fs";
import vueI18n from '@intlify/eslint-plugin-vue-i18n';
// 动态读取 .eslintrc-auto-import.json 文件内容
const autoImportConfig = JSON.parse(
    readFileSync(
        resolve(dirname(fileURLToPath(import.meta.url)), ".eslintrc-auto-import.json"),
        "utf-8",
    ),
);

export default [
    ...vueI18n.configs['flat/recommended'],
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
            "vue/multi-word-component-names": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "args": "all",
                    "argsIgnorePattern": "^_",
                    "caughtErrors": "all",
                    "caughtErrorsIgnorePattern": "^_",
                    "destructuredArrayIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "ignoreRestSiblings": true
                }
            ],
            '@intlify/vue-i18n/no-dynamic-keys': 'error',
            '@intlify/vue-i18n/no-unused-keys': [
                'error',
                {
                    extensions: ['.ts', '.vue']
                }
            ],
            "@intlify/vue-i18n/no-duplicate-keys-in-locale": [
                "error",
                {
                    "ignoreI18nBlock": false
                }
            ],
            "@intlify/vue-i18n/no-raw-text": 'off',
        },
        settings: {
            'vue-i18n': {
                localeDir: '/src/locales/language/*.{ts}',
                messageSyntaxVersion: '^9.0.0'
            }
        }
    }
];
