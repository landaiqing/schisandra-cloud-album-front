/// <reference types="vite/client" />
declare interface ImportMetaEnv {
    readonly VITE_APP_BASE_API: string;
    readonly VITE_APP_TITLE: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_NODE_ENV: string;
    readonly VITE_TITLE_NAME: string;
    readonly VITE_APP_TOKEN_KEY: string;
    readonly VITE_QR_SOCKET_URL: string;
    readonly VITE_MESSAGE_SOCKET_URL: string;
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


