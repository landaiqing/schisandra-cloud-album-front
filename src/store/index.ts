import {useAuthStore} from '@/store/modules/userStore.ts';
import {useThemeStore} from "@/store/modules/themeStore.ts";
import {langStore} from "@/store/modules/langStore.ts";
import {useCommentStore} from "@/store/modules/commentStore.ts";
import {useWebSocketStore} from "@/store/modules/websocketStore.ts";
import {useUpscaleStore} from "@/store/modules/upscaleStore.ts";
import {useMenuStore} from "@/store/modules/menuStore.ts";
import {useUploadStore} from "@/store/modules/uploadStore.ts";
import {useImageStore} from "@/store/modules/imageStore.ts";

export default function useStore() {
    return {
        user: useAuthStore(),
        theme: useThemeStore(),
        lang: langStore(),
        comment: useCommentStore(),
        websocket: useWebSocketStore(),
        upscale: useUpscaleStore(),
        menu: useMenuStore(),
        upload: useUploadStore(),
        image: useImageStore(),
    };
}
