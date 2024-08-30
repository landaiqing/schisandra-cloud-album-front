import {useAuthStore} from '@/store/modules/userStore.ts';
import {useThemeStore} from "@/store/modules/themeStore.ts";
import {langStore} from "@/store/modules/langStore.ts";
import {useClientStore} from "@/store/modules/clientStore.ts";

export default function useStore() {
    return {
        user: useAuthStore(),
        theme: useThemeStore(),
        lang: langStore(),
        client: useClientStore(),
    };
}
