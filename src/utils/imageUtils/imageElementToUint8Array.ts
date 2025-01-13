import * as tf from '@tensorflow/tfjs';

export async function imageToUint8Array(imageElement) {
    // 创建一个 TensorFlow.js 图像张量
    const tensor = tf.browser.fromPixels(imageElement, 3).toFloat();

    // 获取图像的宽度和高度
    const width = imageElement.width;
    const height = imageElement.height;

    // 将张量转为 Uint8Array（RGB 格式，值范围从 0 到 255）
    const uint8Array = await tensor.data();

    return {
        width,
        height,
        uint8Array
    };
}
