import * as nsfwjs from "nsfwjs";
import {NSFWJS} from "nsfwjs";
import * as tf from "@tensorflow/tfjs";

/**
 * Initializes the NSFWJS model and returns it.
 */
let isInit: boolean = false;
const initNSFWJs = async (): Promise<NSFWJS> => {
    tf.enableProdMode();
    if (!isInit) {
        const initialLoad: nsfwjs.NSFWJS = await nsfwjs.load("/nsfw/model/mobilenet_v2_mid/", {
            size: 224,
            type: "graph"
        });
        await initialLoad.model.save("indexeddb://nsfwjs-model");
        isInit = true;
    }
    return await nsfwjs.load("indexeddb://nsfwjs-model", {size: 224, type: "graph"});
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
        'Porn': 0.5,
        'Hentai': 0.3,
        'Sexy': 0.5
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
