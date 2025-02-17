export function convertToImageBasedOnType(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject('Failed to get canvas context');
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // 根据文件的 MIME 类型判断是否需要转换
                const mimeType = file.type;

                if (mimeType === 'image/png') {
                    // 如果是 PNG 格式，转换为 JPEG 格式
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);  // 返回 JPEG 格式的图像
                        } else {
                            reject('Failed to convert to JPEG');
                        }
                    }, 'image/jpeg');
                } else if (mimeType === 'image/jpeg') {
                    // 如果是 JPEG 格式，不需要转换
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);  // 返回 JPEG 格式的图像
                        } else {
                            reject('Failed to convert to JPEG');
                        }
                    }, 'image/jpeg');
                } else {
                    reject('Unsupported image format');
                }
            };

            img.onerror = () => {
                reject('Failed to load image');
            };
        };

        reader.onerror = () => {
            reject('Failed to read file');
        };

        reader.readAsDataURL(file); // 读取文件为 DataURL
    });
}
