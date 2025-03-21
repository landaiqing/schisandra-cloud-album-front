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

        const privacyImageData = reactive<Record<string, string>>({});

        const getPrivacyImage = (key: string): string | undefined => {
            return privacyImageData[key];
        };

        // 添加密码（保持相同API）
        const addPrivacyImage = (key: string, imageData: string) => {
            privacyImageData[key] = imageData;
        };

        return {
            isCollapsed,
            admin,
            token,
            privacyPassword,
            privacyImageData,
            getPrivacyImage,
            addPrivacyImage,
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localForage,
            key: 'STORE-SYSTEM',
            includePaths: ['isCollapsed', 'admin', "privacyPassword", "privacyImageData"],
        },
    }
);
