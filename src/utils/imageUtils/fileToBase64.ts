/**
 * 将 File 对象转换为包含前缀的 Base64 字符串
 * @param file - 要转换的 File 对象
 * @returns 返回一个 Promise，解析为包含前缀的 Base64 字符串
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        // 创建 FileReader 对象
        const reader = new FileReader();

        // 读取文件内容
        reader.readAsDataURL(file);

        // 读取成功时触发
        reader.onload = () => {
            // 获取 Base64 字符串（包含前缀）
            const base64String = reader.result as string;
            resolve(base64String);
        };

        // 读取失败时触发
        reader.onerror = (error) => {
            reject(error);
        };
    });
}
