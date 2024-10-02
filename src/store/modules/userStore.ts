import {defineStore} from 'pinia';
import {reactive} from 'vue';


export const useAuthStore = defineStore(
    'user',
    () => {
        const user: any = reactive({
            accessToken: '',
            uid: '',
            refreshToken: '',
            expiresAt: 0,
            userInfo: {
                username: '',
                nickname: '',
                email: '',
                phone: '',
                avatar: '',
                gender: '',
                status: '',
                created_at: '',
            },
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
            pick: ['user'],
        }
    }
);
