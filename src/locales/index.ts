// index.ts
import {createI18n} from 'vue-i18n';
import zh from './language/zh.ts';
import en from './language/en.ts';

const messages = {
    en,
    zh
};

const language: string = (navigator.language || 'en').toLocaleLowerCase(); // 获取浏览器的语言
const i18n: any = createI18n({
        legacy: false,
        compositionOnly: false,
        globalInjection: true,
        silentTranslationWarn: true,
        locale: language.split('-')[0] || 'zh',
        silentFallbackWarn: true,
        missingWarn: true,
        fallbackWarn: false,
        messages
    })
;
export default i18n;
