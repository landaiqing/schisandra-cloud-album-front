export const useMenuStore = defineStore(
    'menu',
    () => {
        const currentMenu = ref<string>('photo/all');

        const userCenterMenu = ref<string>('home');

        const accountSettingMenu = ref<string>('home');
        return {
            currentMenu,
            userCenterMenu,
            accountSettingMenu
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'STORE-MENU',
            includePaths: ['currentMenu', 'userCenterMenu', 'accountSettingMenu']
        }
    }
);
