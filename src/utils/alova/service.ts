import {createAlova} from 'alova';

import VueHook from 'alova/vue';
import useStore from "@/store";
import {localforageStorageAdapter} from "@/utils/alova/adapter/localforageStorageAdapter.ts";
import {createServerTokenAuthentication} from "alova/client";
import {AxiosError, AxiosResponse} from "axios";
import {handleCode} from "@/utils/errorCode/errorCodeHandler.ts";
import {message} from "ant-design-vue";
import i18n from "@/locales";
import {axiosRequestAdapter} from "@alova/adapter-axios";
import {refreshToken} from "@/api/user";

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
            const res: any = await refreshToken(user.user?.refreshToken);
            if (res.code === 0 && res.data) {
                const {access_token, refresh_token, uid} = res.data;
                user.user.accessToken = access_token;
                user.user.refreshToken = refresh_token;
                user.user.uid = uid;
            } else {
                message.error(i18n.global.t('error.loginExpired'));
                localStorage.removeItem('user');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
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
            method.config.headers.Authorization = `${import.meta.env.VITE_APP_TOKEN_KEY} ${user.user.accessToken}`;
        }
        const lang = useStore().lang;
        method.config.headers['Accept-Language'] = lang.lang || 'zh';
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
                message.open({
                    type: 'error',
                    content: i18n.global.t('error.loginExpired'),
                    duration: 2,
                });
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
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


