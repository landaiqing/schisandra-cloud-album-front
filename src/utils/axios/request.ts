/** @format */

import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {message} from "ant-design-vue";
import useStore from "@/store";

class Request {
    private instance: AxiosInstance | undefined;

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config);
        // 全局请求拦截
        this.instance.interceptors.request.use(
            (config) => {
                const user = useStore().user;
                const token: string | undefined = user.getUser()?.token;
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
                    this.handleCode(response.status);
                }
                if (!window.navigator.onLine) {
                    message.error("网络连接失败");
                    return Promise.reject(error);
                }
            },
        );
    }

    handleCode(code: number): void {
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
