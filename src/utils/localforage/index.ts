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
export const encrypt = (data: string, output?: undefined) => {
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
export const decrypt = (data: string | unknown) => {
    if (data === null) {
        return;
    }
    const encryptedHex = CryptoJS.enc.Hex.parse(data as string);
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
    setItem: (key: string, value: any) => {
        localforage.setItem(key, encrypt(value));
    },
    getItem: (key: string) => {
        let value: unknown = null;
        localforage.getItem(key).then((res: unknown) => {
            value = res;
        });
        return decrypt(value) as string;
    },
    removeItem: (key: string) => {
        localforage.removeItem(key);
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
