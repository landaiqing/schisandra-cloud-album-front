/// <reference types="vite/client" />
declare interface ImportMetaEnv {
    readonly VITE_APP_BASE_API: string;
    readonly VITE_APP_TITLE: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_NODE_ENV: string;
    readonly VITE_TITLE_NAME: string;
    readonly VITE_APP_TOKEN_KEY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}



