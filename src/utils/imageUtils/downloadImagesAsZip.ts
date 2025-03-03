import JSZip from 'jszip';
interface ImageData {
    blob: Blob;
    url: string;
    index: number;
}
/**
 * 打包下载图片工具方法
 * @param urls 图片URL数组
 */
export async function downloadImagesAsZip(urls: string[]): Promise<void> {
    const zip = new JSZip();

    // 1. 并行获取所有图片资源（添加明确的类型声明）
    const imagePromises = urls.map(async (url, index): Promise<ImageData | null> => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();
            return { blob, url, index };
        } catch (error) {
            console.error(`Failed to download ${url}:`, error);
            return null;
        }
    });

    // 2. 使用类型守卫过滤null值
    const images = (await Promise.all(imagePromises))
        .filter((img): img is ImageData => img !== null); // 类型谓词

    if (images.length === 0) {
        throw new Error('No images were successfully downloaded');
    }

    // 3. 将图片添加到压缩包
    images.forEach(({ blob, url, index }) => {
        const urlObj = new URL(url);
        let filename = urlObj.pathname.split('/').pop() || '';

        // 清理文件名中的查询参数
        filename = filename.split('?')[0];

        // 处理空文件名或无效文件名
        if (!filename || !/\.[a-z0-9]+$/i.test(filename)) {
            const extension = blob.type.split('/')[1] || 'bin';
            filename = `image-${index + 1}.${extension}`;
        }

        zip.file(filename, blob);
    });

    // 4. 生成ZIP文件并触发下载
    const blob = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `images-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();

    // 5. 清理资源
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
}
