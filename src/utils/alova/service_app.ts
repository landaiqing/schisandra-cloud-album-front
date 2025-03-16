import {createAlova} from 'alova';
import CryptoJS from 'crypto-js';
import VueHook from 'alova/vue';
import useStore from "@/store";
import {localforageStorageAdapter} from "@/utils/alova/adapter/localforageStorageAdapter.ts";
import {createServerTokenAuthentication} from "alova/client";
import {AxiosError, AxiosResponse} from "axios";
import {message, Modal} from "ant-design-vue";
import i18n from "@/locales";
import {axiosRequestAdapter} from "@alova/adapter-axios";
import {refreshToken} from "@/api/user";
import generateKeySecretSignature from "@/utils/signature/signature.ts";
import {handleErrorCode} from "@/utils/errorCode/errorCodeHandler.ts";


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
            if (res && res.code === 200) {
                const {access_token, expire_at} = res.data;
                user.token.accessToken = access_token;
                user.token.expireAt = expire_at;
            }
        }
    }
});
export const service = createAlova({
    timeout: 10000,
    baseURL: import.meta.env.VITE_APP_BASE_API,
    statesHook: VueHook,
    // 请求适配器
    requestAdapter: axiosRequestAdapter(),
    l2Cache: localforageStorageAdapter,
    cacheLogger: import.meta.env.VITE_NODE_ENV === 'development',
    cacheFor: null,
    // 设置全局的请求拦截器
    beforeRequest: onAuthRequired(async (method: any) => {
        // if (!method.meta?.ignoreToken) {
        //     const user = useStore().user;
        //     method.config.headers.Authorization = `${import.meta.env.VITE_APP_TOKEN_KEY} ${user.token.accessToken}`;
        //     method.config.headers['X-UID'] = user.user.uid;
        //     // method.config.headers['X-Expire-At'] = user.token.expireAt;
        // }
        const lang = useStore().lang;
        method.config.headers['Accept-Language'] = lang.lang || 'zh';

        // 令牌
        method.config.headers['X-Nonce'] = CryptoJS.lib.WordArray.random(16).toString();
        // 签名
        if (method.meta?.signature) {
            method.config.headers['X-Content-Security'] = generateKeySecretSignature(0, method.type, method.url, method.config.params, method.data);
        }
    }),
    // 响应拦截器
    responded: onResponseRefreshToken({
        onSuccess: async (response: AxiosResponse, _method: any) => {
            if (response.data instanceof Blob) {
                return response;
            }
            const userStore = useStore().user;
            const {code} = response.data;
            if (code === 403) {
                await userStore.logout();
                Modal.warning({
                    title: i18n.global.t('error.loginExpired'),
                    content: i18n.global.t('error.authTokenExpired'),
                    onOk() {
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 1000);
                    },
                });
                return Promise.reject();
            }
            return response.data;
        },
        onError:
            (error: AxiosError, _method: any) => {
                const {response} = error;
                if (response) {
                    handleErrorCode(response.status);
                }
                if (!window.navigator.onLine) {
                    message.error(i18n.global.t('error.networkError')).then();
                    return Promise.reject(error);
                }
            },
    }),
});


