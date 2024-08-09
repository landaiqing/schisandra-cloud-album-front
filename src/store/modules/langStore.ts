import {defineStore} from 'pinia';
import {ref} from 'vue';
import pinia from "@/store/pinia.ts";

export const langStore = defineStore(
    'lang',
    () => {
        const lang = ref<string>('');

        function setLang(value: string) {
            lang.value = value;
        }

        function getLang() {
            return lang.value;
        }

        return {
            lang,
            setLang,
            getLang,
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            key: 'lang',
            storage: localStorage,
            includePaths: ["lang"],
            overwrite: true,
        }
    }
);

export function useLangStoreWithOut() {
    return langStore(pinia);
}
