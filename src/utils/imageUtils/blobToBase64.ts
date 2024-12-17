export async function blobToBase64(blobUrl: string): Promise<string> {
    try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise<string>((resolve, reject) => {
            reader.onload = function () {
                // 直接使用 reader.result，包含 MIME 类型前缀
                const base64StringWithPrefix = reader.result!.toString();
                resolve(base64StringWithPrefix);
            };
            reader.onerror = function () {
                reject("File could not be read");
            };
            // 读取 Blob 文件到 Data URL 格式
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        throw new Error("Error fetching blob from URL: " + error);
    }
}
