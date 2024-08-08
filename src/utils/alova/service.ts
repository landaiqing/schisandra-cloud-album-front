import {createAlova} from 'alova';

import VueHook from 'alova/vue';
import useStore from "@/store";
import {axiosRequestAdapter} from "@alova/adapter-axios";
import {AxiosError, AxiosResponse} from "axios";
import {message} from "ant-design-vue";
import {localforageStorageAdapter} from "@/utils/alova/adapter/localforageStorageAdapter.ts";

export const service = createAlova({
    timeout: 5000,
    baseURL: import.meta.env.VITE_APP_BASE_API,
    statesHook: VueHook,
    // 请求适配器
    requestAdapter: axiosRequestAdapter(),
    l2Cache: localforageStorageAdapter,
    cacheFor: {
        GET: {
            mode: 'restore',
            expire: 60 * 10 * 1000
        },
    },
    cacheLogger: import.meta.env.VITE_NODE_ENV === 'development',
    // 设置全局的请求拦截器
    beforeRequest(method) {
        if (!method.meta?.ignoreToken) {
            const user = useStore().user;
            method.config.headers.token = user.getUser()?.token;
        }

    },
    // 响应拦截器
    responded: {
        onSuccess: async (response: AxiosResponse) => {
            if (response.data instanceof Blob) {
                return response;
            } else {
                return response.data;
            }
        },
        onError(error: AxiosError) {
            const {response} = error;
            if (response) {
                handleCode(response.status);
            }
            if (!window.navigator.onLine) {
                message.error("网络连接失败").then();
                return Promise.reject(error);
            }
        }
    }
});

function handleCode(code: number): void {
    switch (code) {
        case 400:
            message
                .open({
                    content: "请求错误(400)",
                    type: "error",
                })
                .then();
            break;
        case 401:
            message
                .open({
                    content: "未授权，请重新登录(401)",
                    type: "error",
                })
                .then();
            break;
        case 403:
            message
                .open({
                    content: "拒绝访问(403)",
                    type: "error",
                })
                .then();
            break;
        case 404:
            message
                .open({
                    content: "请求出错(404)",
                    type: "error",
                })
                .then();
            break;
        case 408:
            message
                .open({
                    content: "请求超时(408)",
                    type: "error",
                })
                .then();
            break;
        case 500:
            message
                .open({
                    content: "服务器错误(500)",
                    type: "error",
                })
                .then();
            break;
        case 501:
            message
                .open({
                    content: "服务未实现(501)",
                    type: "error",
                })
                .then();
            break;
        case 502:
            message
                .open({
                    content: "网络错误(502)",
                    type: "error",
                })
                .then();
            break;
        case 503:
            message
                .open({
                    content: "服务不可用(503)",
                    type: "error",
                })
                .then();
            break;
        case 504:
            message
                .open({
                    content: "网络超时(504)",
                    type: "error",
                })
                .then();
            break;
        case 505:
            message
                .open({
                    content: "HTTP版本不受支持(505)",
                    type: "error",
                })
                .then();
            break;
        default:
            message
                .open({
                    content: `连接出错(${code})!`,
                    type: "error",
                })
                .then();
            break;
    }
}
