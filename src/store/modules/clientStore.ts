import {defineStore} from 'pinia';
import {ref} from "vue";

export const useClientStore = defineStore(
    'clientId',
    () => {
        const clientId = ref<string>();

        function setClientId(id: string) {
            clientId.value = id;
        }

        function getClientId() {
            return clientId.value;
        }

        return {
            clientId,
            setClientId,
            getClientId
        };
    },
    {
        // 开启数据持久化
        persist: {
            key: 'clientId',
            storage: localStorage,
            paths: ["clientId"],
        }
    }
);
