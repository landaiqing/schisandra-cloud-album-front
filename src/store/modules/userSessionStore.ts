import {defineStore} from 'pinia';
import {reactive} from 'vue';


export const useAuthSessionStore = defineStore(
    'user',
    () => {
        const user: any = reactive({
            accessToken: '',
            uid: '',
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
            storage: sessionStorage,
            paths: ['user'],
        }
    }
);
