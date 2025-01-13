import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

async function loadModelFromIndexedDBOrUrl(modelName: string, modelUrl: string) {
    let model: tf.GraphModel;
    tf.setBackend('webgl');
    try {
        // 尝试从 IndexedDB 加载模型
        model = await tf.loadGraphModel(`indexeddb://${modelName}-model`);
        console.log("模型成功从 IndexedDB 加载");
    } catch (_error) {
        console.log("从 URL 下载模型...");
        // 如果 IndexedDB 中没有模型，则从 URL 加载并保存到 IndexedDB
        model = await tf.loadGraphModel(modelUrl);
        await model.save(`indexeddb://${modelName}-model`);
        console.log("模型已从 URL 下载并保存到 IndexedDB");
    }
    return model;
}

// 封装处理图像和推理的工具函数
export async function loadAnimeClassifierModel() {
    const modelName = 'anime_classifier';
    const modelUrl = '/tfjs/anime_classifier/model.json';
    return await loadModelFromIndexedDBOrUrl(modelName, modelUrl);
}

//   处理图片并进行推理
export async function animePredictImage(imageElement) {

    const model: tf.GraphModel = await loadAnimeClassifierModel();
    // 将图片转换为张量
    const tensor = tf.browser.fromPixels(imageElement, 3).toFloat();
    const resized = tf.image.resizeBilinear(tensor, [224, 224]);  // 调整图片大小为模型输入大小
    const input = resized.expandDims(0);  // 增加批次维度

    // 进行推理
    const prediction: any = model.predict(input);

    // 获取预测结果并返回
    const resultArray = await prediction.array();
    const result = resultArray[0]; // 获取预测结果数组
    return result.indexOf(1) === 0 ? 'Anime' : 'Neutral';
}

// export async function animePredictImage(width: number, height: number, uint8Array: Uint8Array) {
//     const model: tf.GraphModel = await loadModel();
//
//     // 将 Uint8Array 转换为 Tensor
//     const tensor = tf.tensor3d(uint8Array, [height, width, 3], 'int32').toFloat();
//
//     // 调整图片大小为模型输入大小
//     const resized = tf.image.resizeBilinear(tensor, [224, 224]);
//
//     // 增加批次维度
//     const input = resized.expandDims(0);
//
//     // 进行推理
//     const prediction: any = model.predict(input);
//
//     // 获取预测结果并返回
//     const resultArray = await prediction.array();
//     const result = resultArray[0]; // 获取预测结果数组
//     return result.indexOf(1) === 0 ? 'Anime' : 'Neutral';
// }



