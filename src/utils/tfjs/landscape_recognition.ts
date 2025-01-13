import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export async function loadLandscapeRecognitionModel() {
    const modelName = 'landscape_recognition';
    const modelUrl = '/tfjs/landscape_recognition/model.json';
    let model: tf.LayersModel;
    tf.setBackend('webgl');
    try {
        // 尝试从 IndexedDB 加载模型
        model = await tf.loadLayersModel(`indexeddb://${modelName}-model`);
        console.log("模型成功从 IndexedDB 加载");
    } catch (_error) {
        console.log("从 URL 下载模型...");
        // 如果 IndexedDB 中没有模型，则从 URL 加载模型
        model = await tf.loadLayersModel(modelUrl);
        await model.save(`indexeddb://${modelName}-model`);
        console.log("模型已从 URL 下载并保存到 IndexedDB");
    }

    return model;
}

export const predictLandscape = async (imgElement) => {
    if (!imgElement) return;
    const model = await loadLandscapeRecognitionModel();
    const img = tf.cast(tf.browser.fromPixels(imgElement), 'float32').resizeBilinear([150, 150]);

    const offset = tf.scalar(127.5);
    const normalized = img.sub(offset).div(offset);
    const batched = normalized.reshape([1, 150, 150, 3]);

    const results: any = model.predict(batched);
    return getCategory(results.dataSync().indexOf(results.max().dataSync()[0]));
};

const getCategory = (index: number) => {
    switch (index) {
        case 0:
            return "building";
        case 1:
            return "forest";
        case 2:
            return "glacier";
        case 3:
            return "mountain";
        case 4:
            return "sea";
        case 5:
            return "street";
        default:
            return "none";
    }
};
