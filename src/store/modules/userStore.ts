import {defineStore} from 'pinia';
import {reactive} from 'vue';


export const useAuthStore = defineStore(
    'user',
    () => {
        const user: any = reactive({
            accessToken: '',
            userId: '',
            refreshToken: '',
            expiresAt: 0,
        });

        return {
            user,
        };
    },
    {
        // 开启数据持久化
        persist: {
            key: 'user',
            storage: localStorage,
            paths: ['user'],
        }
    }
);
