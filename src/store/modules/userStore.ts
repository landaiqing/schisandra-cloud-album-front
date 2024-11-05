import {defineStore} from 'pinia';
import {reactive} from 'vue';


export const useAuthStore = defineStore(
    'user',
    () => {
        const user: any = reactive({
            access_token: '',
            uid: '',
            username: '',
            nickname: '',
            avatar: '',
            status: '',
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
