export const useMenuStore = defineStore(
    'menu',
    () => {
        const currentMenu = ref<string>('photo/all');

        const userCenterMenu = ref<string>('home');
        return {
            currentMenu,
            userCenterMenu,
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'menu',
            includePaths: ['currentMenu', 'userCenterMenu']
        }
    }
);
