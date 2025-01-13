export function imageToBase64(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(img, 0, 0);
    }
    return canvas.toDataURL('image/png'); // 或者 'image/jpeg'
}
