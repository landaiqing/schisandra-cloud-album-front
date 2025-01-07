import * as tf from '@tensorflow/tfjs';

// 封装处理图像和推理的工具函数
export async function loadModel(modelPath) {
    const model = await tf.loadGraphModel(modelPath);
    console.log('Model Loaded');
    return model;
}

//   处理图片并进行推理
export async function predictImage(model, imageElement) {
    // 将图片转换为张量
    const tensor = tf.browser.fromPixels(imageElement).toFloat();
    const resized = tf.image.resizeBilinear(tensor, [224, 224]);  // 调整图片大小为模型输入大小
    const input = resized.expandDims(0);  // 增加批次维度

    // 进行推理
    const prediction = model.predict(input);

    // 获取预测结果并返回
    const resultArray = await prediction.array();
    return resultArray[0]; // 返回第一项的预测结果
}
