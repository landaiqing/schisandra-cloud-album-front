export const useShareStore = defineStore(
    'share',
    () => {
        const sharePassword = reactive<Record<string, string>>({});

        const openCommentDrawer = ref<boolean>(false);

        // 获取密码（保持相同API）
        const getPassword = (key: string): string | undefined => {
            return sharePassword[key];
        };

        // 添加密码（保持相同API）
        const addPassword = (key: string, password: string) => {
            sharePassword[key] = password;
        };

        function setOpenCommentDrawer(value: boolean): void {
            openCommentDrawer.value = value;
        };
        return {
            sharePassword,
            getPassword,
            addPassword,
            openCommentDrawer,
            setOpenCommentDrawer
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: sessionStorage,
            key: 'STORE-SHARE',
            includePaths: ['sharePassword']
        }
    }
);
