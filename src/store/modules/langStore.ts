import {defineStore} from 'pinia';
import {ref} from "vue";


export const langStore = defineStore(
    'lang',
    () => {
        const lang = ref<string>('zh');
        return {
            lang,
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'STORE-LANGUAGE',
            includePaths: ['lang']
        }
    }
);
