import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

async function loadModelFromIndexedDBOrUrl(modelName: string, modelUrl: string) {
    let model: tf.LayersModel;
    tf.setBackend('webgl');
    try {
        // 尝试从 IndexedDB 加载模型
        model = await tf.loadLayersModel(`indexeddb://${modelName}-model`);
        console.log("模型成功从 IndexedDB 加载");
    } catch (_error) {
        console.log("从 URL 下载模型...");
        // 如果 IndexedDB 中没有模型，则从 URL 加载并保存到 IndexedDB
        model = await tf.loadLayersModel(modelUrl);
        await model.save(`indexeddb://${modelName}-model`);
        console.log("模型已从 URL 下载并保存到 IndexedDB");
    }
    return model;
}

// 封装处理图像和推理的工具函数
export async function loadAnimeClassifierProModel() {
    const modelName = 'anime_classifier2';
    const modelUrl = '/tfjs/anime_classifier2/model.json';
    return await loadModelFromIndexedDBOrUrl(modelName, modelUrl);
}

//   处理图片并进行推理
export async function animePredictImagePro(imageElement) {

    const model: any = await loadAnimeClassifierProModel();
    // 将图片转换为张量
    const tensor = tf.browser.fromPixels(imageElement).toFloat();
    const imageResized = tf.image.resizeBilinear(tensor, [224, 224]);
    const imageReshaped = imageResized.reshape([1, 224, 224, 3]);
    const imageNormalized = imageReshaped.div(255);

    // 进行推理
    const prediction: any = model.predict(imageNormalized);


    const predictedClass = tf.argMax(prediction, 1).dataSync()[0];
    // const predictedClassConfidence = await prediction.dataSync()[predictedClass].toFixed(2);
    // console.log(`预测结果: ${predictedClassName}(${predictedClassConfidence})`);
    return ['Anime', 'Furry', 'Neutral'][predictedClass];
}

// export async function animePredictImagePro(width: number, height: number, uint8Array: Uint8Array) {
//
//     const model: any = await loadModel();
//     // 将图片转换为张量
//     const tensor = tf.tensor3d(uint8Array, [height, width, 3], 'int32').toFloat();
//     const imageResized = tf.image.resizeBilinear(tensor, [224, 224]);
//     const imageReshaped = imageResized.reshape([1, 224, 224, 3]);
//     const imageNormalized = imageReshaped.div(255);
//
//     // 进行推理
//     const prediction: any = model.predict(imageNormalized);
//
//
//     const predictedClass = tf.argMax(prediction, 1).dataSync()[0];
//     // const predictedClassConfidence = await prediction.dataSync()[predictedClass].toFixed(2);
//     // console.log(`预测结果: ${predictedClassName}(${predictedClassConfidence})`);
//     return ['Anime', 'Furry', 'Neutral'][predictedClass];
// }
