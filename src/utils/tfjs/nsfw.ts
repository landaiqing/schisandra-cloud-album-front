import * as nsfwjs from "nsfwjs";
import {NSFWJS} from "nsfwjs";
import * as tf from "@tensorflow/tfjs";


const initNSFWJs = async (): Promise<NSFWJS> => {
    let nsfwModelCache: NSFWJS | null = null; // 缓存模型实例
    // 如果模型已经加载，则直接返回缓存
    try {
        // 首先尝试从 IndexedDB 加载模型
        nsfwModelCache = await nsfwjs.load("indexeddb://nsfwjs-model", {size: 224, type: "graph"});
        console.log("NSFWJS 模型成功从 IndexedDB 加载");
    } catch (_error) {
        console.warn("IndexedDB 中未找到模型，正在从网络加载...");
        // 如果 IndexedDB 加载失败，从 URL 加载模型并保存到 IndexedDB
        nsfwModelCache = await nsfwjs.load("/nsfw/mobilenet_v2_mid/", {size: 224, type: "graph"});
        await nsfwModelCache.model.save("indexeddb://nsfwjs-model");
        console.log("NSFWJS 模型已从网络加载并保存到 IndexedDB");
    }

    return nsfwModelCache;
};
/**
 * Predicts the NSFW score of an image using the NSFWJS model.
 * @param model
 * @param image
 */
const predictNSFW = async (model: NSFWJS, image: tf.Tensor3D | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): Promise<boolean> => {
    const predictions = await model.classify(image, 5);
    // 定义阈值与对应的类别
    const thresholds = {
        'Porn': 0.6,
        'Hentai': 0.3,
        'Sexy': 0.6
    };

    // 使用一个变量来确定是否为色情内容
    let isNSFW: boolean = false;

    // 遍历预测结果，并检查是否满足阈值
    for (const prediction of predictions) {
        const className = prediction.className;
        const probability = prediction.probability;

        // 检查预测类别是否在阈值对象中
        if (thresholds[className] !== undefined && probability >= thresholds[className]) {
            isNSFW = true;
            break; // 早期退出，如果满足任一条件
        }
    }

    return isNSFW; // 返回是否为色情图片
};

export {initNSFWJs, predictNSFW};
