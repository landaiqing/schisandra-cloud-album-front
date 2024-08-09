import {createAlova} from 'alova';

import VueHook from 'alova/vue';
import useStore from "@/store";
import {axiosRequestAdapter} from "@alova/adapter-axios";
import {AxiosError, AxiosResponse} from "axios";
import {message} from "ant-design-vue";
import {localforageStorageAdapter} from "@/utils/alova/adapter/localforageStorageAdapter.ts";
import {handleCode} from "@/utils/errorCode/errorCodeHandler.ts";


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


