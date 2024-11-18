import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const rsaPublicKey = "-----BEGIN PUBLIC KEY-----" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCFe70Zi3OF7NuFi2saenJPjADW" +
    "Ln402d142LOLBeN6cuWpItE3qgFsaMSorQApSM0recmAHMg4M4ly7+NgFPsaTzte" +
    "MrO/LFCagwLWyyFJeqV4oQWRNQcFcGev8sTkUbIhhKpNAcmg37q8cmfI2eumycfl" +
    "2FXuSyoJOa7hJgYNNQIDAQAB" +
    "-----END PUBLIC KEY-----";

/**
 * 生成前端密钥
 * @param {string} type 请求类型（0或1）
 * @param {string} method 请求方法（大写）
 * @param {string} reqPath 请求路径（不包含host）
 * @param {Object} reqQuery 请求参数
 * @param {string} reqBody 请求体
 */
export default function generateKeySecretSignature(type: number, method: string, reqPath: string, reqQuery: any, reqBody: any): string {
    const time = (Date.now() / 1000).toFixed();
    const fingerprint = import.meta.env.VITE_FINGERPRINT_KEY as string;
    // 生成 secret
    const base64Key = btoa(fingerprint);
    const secret = `type=${type};key=${base64Key};time=${time}`;

    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(rsaPublicKey);
    const encryptedSecret = encryptor.encrypt(secret);

    // 生成 signature
    const sha256Hash = CryptoJS.SHA256(typeof reqBody === 'object' ? JSON.stringify(reqBody) : reqBody).toString();

    const signContent = [
        time,
        method,
        reqPath,
        isEmptyObject(reqQuery) ? '' : JSON.stringify(reqQuery),
        sha256Hash
    ].join('\n');

    const hmacHash = CryptoJS.HmacSHA256(signContent, fingerprint);
    const signature = CryptoJS.enc.Base64.stringify(hmacHash);

    return `key=${fingerprint};secret=${encryptedSecret};signature=${signature}`;
}
/**
 * 判断对象是否为空
 * @param obj
 */
const isEmptyObject = (obj: any): boolean => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};
