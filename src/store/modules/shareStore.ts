export const useShareStore = defineStore(
    'share',
    () => {
        const sharePassword = reactive<Record<string, string>>({});

        // 获取密码（保持相同API）
        const getPassword = (key: string): string | undefined => {
            return sharePassword[key];
        };

        // 添加密码（保持相同API）
        const addPassword = (key: string, password: string) => {
            sharePassword[key] = password;
        };
        return {
            sharePassword,
            getPassword,
            addPassword
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'share',
            includePaths: ['sharePassword']
        }
    }
);
