import {useAuthStore} from '@/store/modules/userStore.ts';
import {useThemeStore} from "@/store/modules/themeStore.ts";
import {langStore} from "@/store/modules/langStore.ts";
import {useAuthSessionStore} from "@/store/modules/userSessionStore.ts";

export default function useStore() {
    // 是否自动登录 默认自动化登录
    function isAutoLogin() {
        const result: string | null = localStorage.getItem('auto_login');
        if (result) {
            return result === 'true';
        }
        return true;
    }

    return {
        user: isAutoLogin() ? useAuthStore() : useAuthSessionStore(), // 自动登录时使用 useAuthStore，否则使用 useAuthSessionStore
        theme: useThemeStore(),
        lang: langStore(),
    };
}
