// 定义返回数据的类型
interface ThumbnailResult {
    binaryData: Blob | null;
    width: number;
    height: number;
    size: number;  // 添加 size 字段，表示缩略图的大小
}

// 工具函数：生成视频或图片缩略图并返回二进制数据（Blob）及宽高和大小
export const generateThumbnail = (file: File): Promise<ThumbnailResult> => {
    return new Promise((resolve, reject) => {
        const fileType = file.type.toLowerCase();
        const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
        const supportedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

        // 判断文件类型
        if (supportedImageTypes.includes(fileType)) {
            // 如果是图片文件
            createImageThumbnail(file)
                .then((result) => resolve(result))
                .catch(reject);
        } else if (supportedVideoTypes.includes(fileType)) {
            // 如果是视频文件
            createVideoThumbnail(file)
                .then((result) => resolve(result))
                .catch(reject);
        } else {
            reject(new Error('不支持的文件类型'));
        }
    });
};

// 生成图片的缩略图
const createImageThumbnail = (file: File): Promise<ThumbnailResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const fixedHeight = 200;
                const scaleFactor = fixedHeight / img.height;
                const width = img.width * scaleFactor;
                const height = fixedHeight;

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                // 转换为二进制数据（Blob）
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve({
                            binaryData: blob,
                            width: width,
                            height: height,
                            size: blob.size, // 获取缩略图的大小
                        });
                    } else {
                        reject(new Error('生成二进制数据失败'));
                    }
                }, file.type);
            };
            img.src = event.target?.result as string;
        };
        reader.onerror = () => {
            reject(new Error('读取文件失败'));
        };

        reader.readAsDataURL(file);
    });
};

// 生成视频的缩略图
const createVideoThumbnail = (file: File): Promise<ThumbnailResult> => {
    return new Promise((resolve, reject) => {
        const videoElement = document.createElement('video');
        const objectURL = URL.createObjectURL(file);
        videoElement.src = objectURL;

        videoElement.onloadeddata = () => {
            // 在第一帧加载完成时获取图像
            videoElement.currentTime = 2;  // 设置视频播放位置为 2 秒（可调节）

            videoElement.onseeked = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // 将视频帧绘制到 canvas 上
                    const fixedHeight = 200;
                    const scaleFactor = fixedHeight / videoElement.videoHeight;
                    const width = videoElement.videoWidth * scaleFactor;
                    const height = fixedHeight;

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(videoElement, 0, 0, width, height);

                    // 将 canvas 转为图像 URL
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve({
                                binaryData: blob,
                                width: width,
                                height: height,
                                size: blob.size,  // 获取缩略图的大小
                            });
                        } else {
                            reject(new Error('生成视频缩略图失败'));
                        }
                    });
                } else {
                    reject(new Error('无法获取 canvas 上下文'));
                }
            };
        };

        videoElement.onerror = () => {
            reject(new Error('加载视频失败'));
        };
    });
};
