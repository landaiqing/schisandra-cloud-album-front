import exifr from 'exifr';

/**
 * 判断图片是否是截图
 * @param {File} file - 要判断的图片文件
 * @returns {Promise<boolean>} - 返回是否是截图
 */
async function isScreenshot(file) {
    // 常见屏幕宽高比
    const commonAspectRatios = [16 / 9, 16 / 10, 4 / 3, 3 / 2, 1];
    const aspectRatioTolerance = 0.02; // 容差，用于宽高比校验
    const maxScreenshotSizeMB = 2; // 截图通常较小，限制最大 2MB

    // 文件名关键词（大小写不敏感）
    const screenshotFilenameKeywords = [
        'screenshot', '屏幕截图', '截屏', 'Snip', 'Capture', 'Snapshot', '截图'
    ];

    try {
        // 文件名匹配
        const fileName = file.name.toLowerCase();
        const matchesFilename = screenshotFilenameKeywords.some(keyword =>
            fileName.includes(keyword.toLowerCase())
        );
        if (matchesFilename) {
            return true; // 如果文件名包含截图相关关键词，直接判断为截图
        }

        // 提取 EXIF 数据
        const exifData = await exifr.parse(file, ['ImageWidth', 'ImageHeight', 'Software', 'XResolution', 'YResolution']);
        const {ImageWidth, ImageHeight, Software} = exifData || {};

        // 如果图片没有宽高信息，直接返回 false
        if (!ImageWidth || !ImageHeight) {
            return false;
        }

        // 校验宽高比是否接近常见屏幕比例
        const aspectRatio = Math.max(ImageWidth, ImageHeight) / Math.min(ImageWidth, ImageHeight);
        const matchesAspectRatio = commonAspectRatios.some(
            (ratio) => Math.abs(ratio - aspectRatio) <= aspectRatioTolerance
        );

        // 如果宽高比匹配，进一步检查
        if (matchesAspectRatio) {
            // 检查软件标记是否与截图工具相关
            const screenshotSoftwareKeywords = ['Screenshot', 'Snipping Tool', 'Screen Capture', 'Grab', 'Sketch'];
            if (Software && screenshotSoftwareKeywords.some((keyword) => Software.includes(keyword))) {
                return true;
            }

            // 检查文件大小（截图通常较小）
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB <= maxScreenshotSizeMB) {
                return true;
            }
        }

        // 无 EXIF 数据或不匹配时，通过宽高比的容差检测
        const img: any = await getImageDimensions(file);
        const imgAspectRatio = img.width / img.height;
        const imgMatchesAspectRatio = commonAspectRatios.some(
            (ratio) => Math.abs(ratio - imgAspectRatio) <= aspectRatioTolerance
        );

        return imgMatchesAspectRatio;

    } catch (error) {
        console.error('判断截图时发生错误:', error);
        return false;
    }
}

/**
 * 获取图片的宽高信息（无 EXIF 时使用）
 * @param {File} file
 * @returns {Promise<{width: number, height: number}>}
 */
function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({width: img.width, height: img.height});
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

export default isScreenshot;
