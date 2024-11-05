import {createAlova} from 'alova';

import VueHook from 'alova/vue';
import useStore from "@/store";
import {localforageStorageAdapter} from "@/utils/alova/adapter/localforageStorageAdapter.ts";
import {createServerTokenAuthentication} from "alova/client";
import {AxiosError, AxiosResponse} from "axios";
import {handleCode} from "@/utils/errorCode/errorCodeHandler.ts";
import {message, Modal} from "ant-design-vue";
import i18n from "@/locales";
import {axiosRequestAdapter} from "@alova/adapter-axios";
import {refreshToken} from "@/api/user";
import createMD5Signature, {generateNonce} from "@/utils/signature/signature.ts";

let hasShownNetworkError: boolean = false;
const {onAuthRequired, onResponseRefreshToken} = createServerTokenAuthentication<typeof VueHook,
    typeof axiosRequestAdapter>({
    refreshTokenOnSuccess: {
        // 在请求前触发，将接收到method参数，并返回boolean表示token是否过期
        isExpired: (response: AxiosResponse<any, any>, _method: any) => {
            const code = response.data.code;
            return code === 401;
        },

        // 当token过期时触发，在此函数中触发刷新token
        handler: async () => {
            // 刷新token
            const user = useStore().user;
            const res: any = await refreshToken();
            if (res.code === 200 && res.data) {
                user.user.access_token = res.data;
            }
        }
    }
});
export const service = createAlova({
    timeout: 5000,
    baseURL: import.meta.env.VITE_APP_BASE_API,
    statesHook: VueHook,
    // 请求适配器
    requestAdapter: axiosRequestAdapter(),
    l2Cache: localforageStorageAdapter,
    cacheLogger: import.meta.env.VITE_NODE_ENV === 'development',
    cacheFor: {},
    // 设置全局的请求拦截器
    beforeRequest: onAuthRequired(async (method: any) => {
        if (!method.meta?.ignoreToken) {
            const user = useStore().user;
            method.config.headers.Authorization = `${import.meta.env.VITE_APP_TOKEN_KEY} ${user.user.access_token}`;
        }
        const lang = useStore().lang;
        method.config.headers['Accept-Language'] = lang.lang || 'zh';
        // 添加签名
        if (method.type === 'POST') {
            const nonce: string = generateNonce(); // 生成随机的 Nonce
            const {signature, timestamp}: { signature: string, timestamp: number } = createMD5Signature(method, nonce);
            method.config.headers['X-Sign'] = signature;
            method.config.headers['X-Timestamp'] = timestamp;
            method.config.headers['X-Nonce'] = nonce;
        }

    }),
    // 响应拦截器
    responded: onResponseRefreshToken({
        onSuccess: async (response: AxiosResponse, _method: any) => {
            if (response.data instanceof Blob) {
                return response;
            }
            const {code} = response.data;
            if (code === 403) {
                localStorage.removeItem('user');
                Modal.warning({
                    title: i18n.global.t('error.loginExpired'),
                    content: i18n.global.t('error.authTokenExpired'),
                    onOk() {
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 1000);
                    },
                    // onCancel() {
                    //     setTimeout(() => {
                    //         window.location.href = '/login';
                    //     },2000);
                    // }
                });
                return Promise.reject(response.data);
            }
            return response.data;


        },
        onError:
            (error: AxiosError, _method: any) => {
                const {response} = error;
                if (response && !hasShownNetworkError) {
                    hasShownNetworkError = true;
                    handleCode(response.status);
                }
                if (!window.navigator.onLine) {
                    message.error(i18n.global.t('error.networkError')).then();
                    return Promise.reject(error);
                }
            },
    }),
});


