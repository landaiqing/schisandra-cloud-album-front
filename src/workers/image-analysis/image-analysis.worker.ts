// image-analysis.worker.ts
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import {NSFWJS} from 'nsfwjs';
import {initNSFWJs, predictNSFW} from '@/utils/tfjs/nsfw';
import {animePredictImageData} from '@/utils/tfjs/anime_classifier_pro';
import {predictLandscapeImageData} from '@/utils/tfjs/landscape_recognition';
import {cocoSsdPredict} from '@/utils/tfjs/mobilenet';
import {getCategoryByLabel} from '@/constant/coco_ssd_label_category';

tf.setBackend('webgl').then();

// 定义消息接口
interface ImageAnalysisRequest {
    imageData: ArrayBuffer;
    width: number;
    height: number;
    settings: {
        nsfw_detection: boolean;
        anime_detection: boolean;
        landscape_detection: boolean;
        target_detection: boolean;
    };
}

interface ImageAnalysisResponse {
    isNSFW?: boolean;
    isAnime?: boolean;
    landscape?: string | null;
    tagName?: string | null;
    topCategory?: string | null;
    error?: string;
}

// 主要的处理函数
async function processImage(data: ImageAnalysisRequest): Promise<ImageAnalysisResponse> {
    const {imageData, width, height, settings} = data;
    const result: ImageAnalysisResponse = {};

    try {
        const imgData: ImageData = new ImageData(new Uint8ClampedArray(imageData), width, height);
        // 并行执行所有启用的检测
        const tasks: Promise<any>[] = [];

        // NSFW检测
        if (settings.nsfw_detection) {
            tasks.push(
                (async () => {
                    const nsfw: NSFWJS = await initNSFWJs();
                    const isNSFW = await predictNSFW(nsfw, imgData);
                    return {isNSFW};
                })()
            );
        }

        // 动漫检测
        if (settings.anime_detection) {
            tasks.push(
                (async () => {
                    const prediction = await animePredictImageData(imgData);
                    const isAnime = prediction === 'Furry' || prediction === 'Anime';
                    return {isAnime};
                })()
            );
        }

        // 景观识别
        if (settings.landscape_detection) {
            tasks.push(
                (async () => {
                    const landscape = await predictLandscapeImageData(imgData);
                    return {landscape};
                })()
            );
        }

        // 目标检测
        if (settings.target_detection) {
            tasks.push(
                (async () => {

                    // 执行目标检测
                    const cocoResults = await cocoSsdPredict(imgData);
                    if (cocoResults && cocoResults.length > 0) {
                        // 多个结果时，按 score 排序，取置信度最高的结果
                        const sortedResults = cocoResults.sort((a: any, b: any) => b.score - a.score);
                        const topCategory = getCategoryByLabel(sortedResults[0].class);
                        const tagName = sortedResults[0].class;
                        return {tagName, topCategory};
                    }
                })()
            );
        }

        // 等待所有任务完成
        const results = await Promise.all(tasks);

        // 合并结果
        results.forEach(taskResult => {
            Object.assign(result, taskResult);
        });

        return result;
    } catch (error) {
        console.error('Worker处理图像时出错:', error);
        return {error: error instanceof Error ? error.message : String(error)};
    }
}

// 监听消息
self.onmessage = async function (e: MessageEvent) {
    const data = e.data as ImageAnalysisRequest;
    try {
        const result = await processImage(data);
        self.postMessage(result);
    } catch (error) {
        self.postMessage({error: error instanceof Error ? error.message : String(error)});
    }
};
