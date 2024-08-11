import {defineStore} from 'pinia';
import {ref} from 'vue';
import pinia from "@/store/pinia.ts";
import {parse, stringify} from "zipson/lib";

export const langStore = defineStore(
    'lang',
    () => {
        const lang = ref<string>('zh');

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
        persist: {
            key: 'lang',
            storage: localStorage,
            paths: ["lang"],
            serializer: {
                deserialize: parse,
                serialize: stringify,
            },
        }
    }
);

export function useLangStoreWithOut() {
    return langStore(pinia);
}
