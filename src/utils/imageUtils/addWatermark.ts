/**
 * 添加水印
 * @param img
 * @param watermarkText
 */
function addWatermark(img: HTMLImageElement, watermarkText: string) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error('Failed to get canvas context');
        return;
    }

    ctx.drawImage(img, 0, 0);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textBaseline = 'middle';

    // 动态设置字体大小，假设字体大小为画布高度的 5%
    const fontSize = canvas.height * 0.05;  // 可以根据需要调整比例
    ctx.font = `${fontSize}px Microsoft Yahei`;

    // 计算文本的宽度和高度，以便将其放置在右下角
    const textWidth = ctx.measureText(watermarkText).width;
    const textHeight = fontSize; // 字体大小

    // 设置文本的位置到右下角
    const x: number = canvas.width - textWidth - 5; // 距离右边缘 5 像素
    const y: number = canvas.height - textHeight / 2 - 5; // 距离下边缘 5 像素

    ctx.fillText(watermarkText, x, y);

    return canvas.toDataURL(); // 返回带水印的图片数据
}

export default addWatermark;
