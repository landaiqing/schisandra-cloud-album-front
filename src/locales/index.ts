// index.ts
import {createI18n} from 'vue-i18n';
import zh from './language/zh.ts';
import en from './language/en.ts';

const messages = {
    en,
    zh
};


const language = (navigator.language || 'en').toLocaleLowerCase(); // 这是获取浏览器的语言
const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    silentTranslationWarn: true,
    locale: JSON.parse(localStorage.getItem("lang") as string).lang || language.split('-')[0] || 'zh', // 首先从缓存里拿，没有的话就用浏览器语言，
    silentFallbackWarn: true,
    missingWarn: true,
    fallbackWarn: false,
    messages
});
export default i18n;
