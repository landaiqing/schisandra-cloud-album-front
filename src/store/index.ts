import {useAuthStore} from '@/store/modules/userStore.ts';
import {useThemeStore} from "@/store/modules/themeStore.ts";

export default function useStore() {
    return {
        user: useAuthStore(),
        theme: useThemeStore()
    };
}
