// image-converter.ts
import {ref} from 'vue';


/**
 * 图片加载状态
 */
export const imageLoading = ref(false);

/**
 * 将File类型的图片转换为ArrayBuffer
 * @param file 图片文件
 * @returns Promise 包含图片的宽度、高度和ArrayBuffer数据
 */
export const fileToArrayBuffer = (file: File): Promise<{ width: number; height: number; buffer: ArrayBuffer }> => {
    imageLoading.value = true;

    return new Promise((resolve, reject) => {
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            imageLoading.value = false;
            reject(new Error('文件类型必须是图片'));
            return;
        }

        // 创建FileReader实例读取文件
        const reader = new FileReader();

        // 读取完成后的处理
        reader.onload = (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;

            // 创建一个临时的Image对象来获取图片尺寸
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                // 获取图片尺寸
                const width = img.width;
                const height = img.height;

                // 释放URL对象
                URL.revokeObjectURL(url);
                imageLoading.value = false;

                // 返回包含尺寸和数据的对象
                resolve({
                    width,
                    height,
                    buffer: arrayBuffer
                });
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                imageLoading.value = false;
                reject(new Error('图片加载失败'));
            };

            img.src = url;
        };

        reader.onerror = () => {
            imageLoading.value = false;
            reject(new Error('文件读取失败'));
        };

        // 开始读取文件为ArrayBuffer
        reader.readAsArrayBuffer(file);
    });
};


/**
 * 将 File 对象转换为 ImageData
 * @param {File} file - 用户上传的文件
 * @returns {Promise<ImageData>} - 返回解析后的 ImageData
 */
export async function fileToImageData(file: File): Promise<ImageData> {
    // 1. 验证文件类型
    if (!file.type.startsWith('image/')) {
        throw new Error('文件类型必须是图像');
    }

    // 2. 创建 Image 对象
    const img = await loadImage(file);

    // 3. 创建 Canvas 并绘制图像
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('无法创建 Canvas 上下文');
    }

    // 确保 img 是 HTMLImageElement
    if (!(img instanceof HTMLImageElement)) {
        throw new Error('加载的图像不是有效的 HTMLImageElement');
    }

    // 绘制图像到 Canvas
    ctx.drawImage(img, 0, 0);

    // 4. 提取 ImageData
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * 加载 File 为 Image 对象
 * @param {File} file - 用户上传的文件
 * @returns {Promise<HTMLImageElement>} - 返回加载完成的 Image 对象
 */
function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url); // 释放内存
            resolve(img);
        };

        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(new Error(`图像加载失败: ${err}`));
        };

        img.src = url;
    });
}
