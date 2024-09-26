// index.ts
import {createI18n} from 'vue-i18n';
import zh from './language/zh.ts';
import en from './language/en.ts';

const messages = {
    en,
    zh
};


const language: string = (navigator.language || 'en').toLocaleLowerCase(); // 获取浏览器的语言
function getLanguage(): string | null {
    let lang: string | null = null;
    const langStr: string | null = localStorage.getItem('lang');
    if (langStr) {
        lang = JSON.parse(langStr).lang;
    }
    return lang;
}

const i18n: any = createI18n({
        legacy: false,
        compositionOnly: false,
        globalInjection: true,
        silentTranslationWarn: true,
        locale: getLanguage() || language.split('-')[0] || 'zh', // 首先从缓存里拿，没有的话就用浏览器语言，
        silentFallbackWarn: true,
        missingWarn: true,
        fallbackWarn: false,
        messages
    })
;
export default i18n;
