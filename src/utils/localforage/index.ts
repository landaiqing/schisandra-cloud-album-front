/** @format */

import localforage from "localforage";
import CryptoJS from "crypto-js";

const SECRET_KEY = CryptoJS.enc.Utf8.parse("3333e6e143439161"); //十六位十六进制数作为密钥
const SECRET_IV = CryptoJS.enc.Utf8.parse("e3bbe7e3ba84431a"); //十六位十六进制数作为密钥偏移量
/**
 * 加密
 * @param data
 * @param output
 */
export const encrypt = (data: string, output?: any) => {
    const dataHex = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString(output);
};

/**
 * 解密
 * @param data
 */
export const decrypt = (data: string | null) => {
    if (data === null) {
        return;
    }
    const encryptedHex = CryptoJS.enc.Hex.parse(data);
    const encryptedHexStr = CryptoJS.enc.Base64.stringify(encryptedHex);
    const decrypted = CryptoJS.AES.decrypt(encryptedHexStr, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
};

export const handleLocalforage = {
    config: async (options?: LocalForageOptions) => localforage.config(options || {}),
    setItem: async (key: string, value: string): Promise<void> => {
        await localforage.setItem(key, encrypt(value));
    },
    getItem: async function getItem<T>(key: string): Promise<T | string | null> {
        try {
            const value: any = decrypt(await localforage.getItem(key)) as any;
            // 如果值是 undefined，返回 null
            if (value === undefined) {
                return null;
            }
            // 如果值是 T 类型，直接返回
            if (typeof value === "object" && value !== null) {
                return value as T;
            }
            // 如果值是 string 类型，直接返回
            return value as string;
        } catch (error) {
            console.error("Error retrieving data from localforage:", error);
            return null;
        }
    },
    removeItem: async (key: string): Promise<void> => {
        await localforage.removeItem(key);
    },
    clear: async () => {
        return await localforage.clear();
    },
    createInstance: async (name: string) => {
        return localforage.createInstance({
            name,
        });
    },
};
