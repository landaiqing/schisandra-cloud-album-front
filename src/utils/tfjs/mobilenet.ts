import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-webgl';

// 确保 TensorFlow.js 已准备好并设置后端
async function initializeTensorFlow(backend = "webgl") {
    await tf.ready();
    if (!(await tf.setBackend(backend))) {
        console.error(`${backend} is not supported in your browser.`);
        return false;
    }
    return true;
}

// 加载 MobileNet 模型的工具函数
export async function loadMobileNet(image) {
    const modelName = "mobilenet-model";
    const modelUrl = '/tfjs/mobilenet/mobilenet-v3-tfjs-large-100-224-feature-vector-v1/model.json';

    // 初始化 TensorFlow.js
    if (!(await initializeTensorFlow())) {
        return;
    }

    let model;

    try {
        // 尝试从 IndexedDB 加载模型
        model = await mobilenet.load({
            version: 2,
            alpha: 1.0,
            modelUrl: `indexeddb://${modelName}`,
        });
        console.log("MobileNet model loaded from IndexedDB successfully");
    } catch (_error) {
        console.log("Downloading MobileNet model...");
        // 如果 IndexedDB 中没有模型则从 URL 加载并保存到 IndexedDB
        model = await mobilenet.load({
            version: 2,
            alpha: 1.0,
            modelUrl: modelUrl,
        });
        const Model = await tf.loadGraphModel(modelUrl);
        await Model.save(`indexeddb://${modelName}`);
        console.log("MobileNet model downloaded and saved to IndexedDB");
    }

    // 使用模型进行分类
    return await model.classify(image, 3);
}

// 工具函数：加载或缓存模型
export async function loadCocoSsdModel() {
    const modelName = "cocoSsd-model";
    const modelUrl = '/tfjs/mobilenet/ssd-mobilenet-v2-tfjs-default-v1/model.json';
    let model;
    try {
        // 尝试从 IndexedDB 加载模型
        model = await cocoSsd.load({
            base: 'mobilenet_v2',
            modelUrl: `indexeddb://${modelName}`,
        });
        console.log(`${modelName} loaded from IndexedDB successfully`);
    } catch (_error) {
        console.log(`Downloading ${modelName}...`);
        // 如果 IndexedDB 中没有模型则从 URL 加载并保存到 IndexedDB
        model = await cocoSsd.load({
            base: 'mobilenet_v2',
            modelUrl: modelUrl,
        });
        const graphModel = await tf.loadGraphModel(modelUrl);
        await graphModel.save(`indexeddb://${modelName}`);
        console.log(`${modelName} downloaded and saved to IndexedDB`);
    }
    return model;
}

// 加载 COCO SSD 模型的工具函数
export async function cocoSsdPredict(image: any) {
    if (!(await initializeTensorFlow())) {
        return [];
    }
    // 加载模型
    const model = await loadCocoSsdModel();
    // 使用模型进行检测
    return await model.detect(image);
}

