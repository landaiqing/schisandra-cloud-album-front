/// <reference types="vite/client" />
declare interface ImportMetaEnv {
    readonly VITE_APP_BASE_API: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_NODE_ENV: string;
    readonly VITE_TITLE_NAME: string;
    readonly VITE_APP_TOKEN_KEY: string;
    readonly VITE_QR_SOCKET_URL: string;
    readonly VITE_MESSAGE_SOCKET_URL: string;
    readonly VITE_FINGERPRINT_KEY: string;
    readonly VITE_FILE_SOCKET_URL: string;
    readonly VITE_APP_WEB_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module '*.vue' {
    import type {DefineComponent} from 'vue';
    const component: DefineComponent<object, object, any>;
    export default component;
}

declare module '*.svg' {
    const content: any;
    export default content;
}

import type {IFilerobotImageEditorConfig} from '@/types/imageEditorConfig.ts';

declare module '@/assets/lib/ImageEditor/filerobot-image-editor.min.js' {
    export default class ImageEditor {
        constructor(config: IFilerobotImageEditorConfig)

        render(): void

        terminate(): void
    }
}


