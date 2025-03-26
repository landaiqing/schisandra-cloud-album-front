import localForage from "localforage";

export const useSystemStore = defineStore(
    'system',
    () => {
        const isCollapsed = ref<boolean>(false);
        const admin: any = reactive({
            uid: '',
            username: '',
            nickname: '',
            avatar: '',
            status: '',
        });
        const token: any = reactive({
            accessToken: '',
            expireAt: '',
        });

        const privacyPassword = ref<string>('');

        return {
            isCollapsed,
            admin,
            token,
            privacyPassword,
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localForage,
            key: 'STORE-SYSTEM',
            includePaths: ['isCollapsed', 'admin', "privacyPassword"],
        },
    }
);
