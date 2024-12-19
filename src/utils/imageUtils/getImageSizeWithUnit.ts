async function getImageSizeWithUnit(url: string): Promise<string> {
    let sizeInBytes: number;

    // 处理 base64 格式的图片 URL
    if (url.startsWith('data:')) {
        sizeInBytes = atob(url.split(',')[1]).length * 0.75;
    }
    // 处理 blob 格式的图片 URL
    else if (url.startsWith('blob:')) {
        const response = await fetch(url);
        const blob = await response.blob();
        sizeInBytes = blob.size;
    } else {
        throw new Error('Unsupported URL format');
    }

    let unit = 'Bytes';
    if (sizeInBytes >= 1024 * 1024) {
        sizeInBytes /= (1024 * 1024);
        unit = 'MB';
    } else if (sizeInBytes >= 1024) {
        sizeInBytes /= 1024;
        unit = 'KB';
    }

    return `${parseFloat(sizeInBytes.toFixed(2))} ${unit}`;
}

export default getImageSizeWithUnit;
