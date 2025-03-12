export const useSystemStore = defineStore(
    'system',
    () => {
        const isCollapsed = ref<boolean>(false);

        return {
            isCollapsed,
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'STORE-SYSTEM',
            includePaths: ['isCollapsed']
        }
    }
);
