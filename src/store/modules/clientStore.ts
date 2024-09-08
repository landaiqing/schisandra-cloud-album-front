import {defineStore} from 'pinia';
import {ref} from "vue";

const expiresTime: number = 60 * 30; // 自定义过期时间 30 分钟
const expiredStorage: Storage = getExpiredStorage(localStorage, expiresTime);

function getExpiredStorage(storage: Storage, expiresTime: string | number | Date) {
    return {
        getItem(key: string) {
            const itemStr = storage.getItem(key);
            if (!itemStr) {
                return null;
            }
            // 读取的时候是字符串，需要转换为对象
            const item = JSON.parse(itemStr);
            const now: Date = new Date();
            if (now.getTime() > item.expiry) {
                storage.removeItem(key);
                return null;
            }
            // pinia 的持久化插件要求返回JSON字符串
            return JSON.stringify(item.value);
        },
        setItem(key: string, value: string) {
            const now = new Date();
            const item = {
                value: JSON.parse(value), // value是JSON字符串，需要转换为对象
                expiry: now.getTime() + Number(expiresTime) * 1000,
            };
            storage.setItem(key, JSON.stringify(item)); // 存储又要转为JSON字符串
        },
        removeItem(key: string) {
            storage.removeItem(key);
        },
        clear() {
            Object.keys(storage).forEach((key: string) => {
                storage.removeItem(key);
            });
        },
        key(index: number): string | null {
            const keys = Object.keys(storage);
            return keys[index] || null;
        },
        length: Object.keys(storage).length,
    } as Storage;
}

export const useClientStore = defineStore(
    'clientId',
    () => {
        const clientId = ref<string>();

        function setClientId(id: string) {
            clientId.value = id;
        }

        function getClientId() {
            return clientId.value;
        }

        return {
            clientId,
            setClientId,
            getClientId
        };
    },
    {
        // 开启数据持久化
        persist: {
            key: 'clientId',
            storage: expiredStorage,
            paths: ["clientId"],
        }
    }
);

