/** @format */

import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {message} from "ant-design-vue";
import useStore from "@/store";
import {handleCode} from "@/utils/errorCode/errorCodeHandler.ts";

class Request {
    private instance: AxiosInstance | undefined;

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config);
        // 全局请求拦截
        this.instance.interceptors.request.use(
            (config) => {
                const user = useStore().user;
                const token: string | undefined = user.user.accessToken;
                if (token) {
                    config.headers.Authorization = `${import.meta.env.VITE_APP_TOKEN_KEY} ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            },
        );

        // 全局响应拦截
        this.instance.interceptors.response.use(
            (response) => {
                if (response.data instanceof Blob) {
                    return response;
                } else {
                    return response.data;
                }
            },
            (error) => {
                const {response} = error;
                if (response) {
                    handleCode(response.status);
                }
                if (!window.navigator.onLine) {
                    message.error("网络连接失败");
                    return Promise.reject(error);
                }
            },
        );
    }

    request<T>(config: AxiosRequestConfig<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.instance
                ?.request<T, T>(config)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

export default Request;
