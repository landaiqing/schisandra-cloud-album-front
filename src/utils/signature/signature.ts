import CryptoJS from 'crypto-js';

/**
 * 生成 MD5 签名
 * @param method
 * @param nonce
 */
export default function createMD5Signature(method: any, nonce: string) {
    const secretKey: string = "38h0ex04du8qqf9ar2knn1quicdsm4s0"; // 密钥
    const timestamp: number = Date.now(); // 获取当前时间戳
    const payload: string = JSON.stringify(method.data || {}); // 获取请求数据

    // 创建待签名字符串
    const baseString: string = `${method.type}:${payload}:${timestamp}:${nonce}:${secretKey}`;

    // 生成 MD5 签名
    const signature: string = CryptoJS.MD5(baseString).toString();

    // 你可以根据需要返回包含时间戳的签名对象
    return {
        signature,
        timestamp,
        nonce
    };
}

/**
 * 生成随机字符串作为 nonce
 */
export function generateNonce() {
    return Math.random().toString(36).substring(2, 16); // 生成16位随机字符串
}

