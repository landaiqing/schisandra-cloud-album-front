import {useAuthStore} from '@/store/modules/userStore.ts';
import {useThemeStore} from "@/store/modules/themeStore.ts";
import {langStore} from "@/store/modules/langStore.ts";
import {useCommentStore} from "@/store/modules/commentStore.ts";
import {useWebSocketStore} from "@/store/modules/websocketStore.ts";

export default function useStore() {
    return {
        user: useAuthStore(),
        theme: useThemeStore(),
        lang: langStore(),
        comment: useCommentStore(),
        websocket: useWebSocketStore(),
    };
}
