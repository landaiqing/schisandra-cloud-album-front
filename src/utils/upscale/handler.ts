import * as tf from "@tensorflow/tfjs";

import Img from "@/workers/image.ts";
import {ImageData} from "@/types/upscale";
import upscale from "@/workers/upscale.ts";
// import "@tensorflow/tfjs-backend-webgpu";
import "@tensorflow/tfjs-backend-webgl";


/**
 * 加载模型
 * @param model_type  模型类型，可选值：realesrgan、realcugan
 * @param model  模型名称，例如 realesrgan_x4
 * @param tile_size  块大小，例如：64
 * @param factor  超分辨率因子，例如：4
 * @param backend   后端，可选值：webgpu、webgl
 */
export async function loadModel(model_type: string, model: string, tile_size: number, factor: number, backend: string): Promise<tf.GraphModel | null> {
    let model_url: string;
    let model_name: string;

    if (model_type === "realesrgan") {
        model_url = `/tfjs/realesrgan/${model}-${tile_size}/model.json`;
        model_name = `realesrgan-${model}-${tile_size}`;
    } else {
        model_url = `/tfjs/realcugan/${factor}x-${model}-${tile_size}/model.json`;
        model_name = `realcugan-${factor}x-${model}-${tile_size}`;
    }

    await tf.ready();
    if (backend === "webgpu") {
        await import("@tensorflow/tfjs-backend-webgpu");
    }
    try {
        if (!(await tf.setBackend(backend || "webgl"))) {
            console.error(`${backend} 后端在您的浏览器中不被支持。`);
            return null;
        }
        console.log(`当前使用后端: ${tf.getBackend()}`);
    } catch (error) {
        console.error("设置后端时发生错误:", error);
        console.log("支持的后端列表:", tf.getBackend());
        return null;
    }

    try {
        const Model = await tf.loadGraphModel(`indexeddb://${model_name}`);
        console.log("模型加载成功");
        return Model;
    } catch (error) {
        console.error("模型加载失败，开始下载模型:", error);
        try {
            const fetchedModel = await tf.loadGraphModel(model_url);
            await fetchedModel.save(`indexeddb://${model_name}`);
            console.log("模型下载并保存成功");
            return fetchedModel;
        } catch (error) {
            console.error("模型下载失败:", error);
            return null;
        }
    }
}

/**
 * 处理图片
 * @param data
 */
export async function processImage(data: ImageData) {
    const Model: tf.GraphModel | null = await loadModel(data.model_type, data.model, data.tile_size, data.factor, data.backend);
    if (!Model) {
        return null;
    }
    const input = new Img(data.width, data.height, new Uint8Array(data.input));
    const width_ori = input.width;
    const height_ori = input.height;
    input.padToTileSize(data.tile_size || 64);
    let withPadding = false;
    if (input.width !== width_ori || input.height !== height_ori) {
        withPadding = true;
    }
    const hasAlpha = data.hasAlpha;

    const factor = data.factor || 4;
    const tile_size = data.tile_size || 64;
    const min_lap = data.min_lap || 12;
    const start = Date.now();

    const output = await enlargeImageWithFixedInput(
        Model,
        input,
        factor,
        tile_size,
        min_lap,
        hasAlpha
    );

    if (withPadding) {
        output.cropToOriginalSize(width_ori * factor, height_ori * factor);
    }
    const end = Date.now();
    console.log("Time:", end - start);
    return output.data.buffer;

}

/**
 * 超分辨率
 * @param model
 * @param inputImg
 * @param factor
 * @param input_size
 * @param min_lap
 * @param hasAlpha
 */
async function enlargeImageWithFixedInput(
    model: tf.GraphModel,
    inputImg: Img,
    factor = 4,
    input_size = 64,
    min_lap = 12,
    hasAlpha = false,
) {
    const width = inputImg.width;
    const height = inputImg.height;
    const output = new Img(width * factor, height * factor);
    let num_x = 1;
    for (; (input_size * num_x - width) / (num_x - 1) < min_lap; num_x++) ;
    let num_y = 1;
    for (; (input_size * num_y - height) / (num_y - 1) < min_lap; num_y++) ;
    const locs_x = new Array(num_x);
    const locs_y = new Array(num_y);
    const pad_left = new Array(num_x);
    const pad_top = new Array(num_y);
    const pad_right = new Array(num_x);
    const pad_bottom = new Array(num_y);
    const total_lap_x = input_size * num_x - width;
    const total_lap_y = input_size * num_y - height;
    const base_lap_x = Math.floor(total_lap_x / (num_x - 1));
    const base_lap_y = Math.floor(total_lap_y / (num_y - 1));
    const extra_lap_x = total_lap_x - base_lap_x * (num_x - 1);
    const extra_lap_y = total_lap_y - base_lap_y * (num_y - 1);
    locs_x[0] = 0;
    for (let i = 1; i < num_x; i++) {
        if (i <= extra_lap_x) {
            locs_x[i] = locs_x[i - 1] + input_size - base_lap_x - 1;
        } else {
            locs_x[i] = locs_x[i - 1] + input_size - base_lap_x;
        }
    }
    locs_y[0] = 0;
    for (let i = 1; i < num_y; i++) {
        if (i <= extra_lap_y) {
            locs_y[i] = locs_y[i - 1] + input_size - base_lap_y - 1;
        } else {
            locs_y[i] = locs_y[i - 1] + input_size - base_lap_y;
        }
    }
    pad_left[0] = 0;
    pad_top[0] = 0;
    pad_right[num_x - 1] = 0;
    pad_bottom[num_y - 1] = 0;
    for (let i = 1; i < num_x; i++) {
        pad_left[i] = Math.floor((locs_x[i - 1] + input_size - locs_x[i]) / 2);
    }
    for (let i = 1; i < num_y; i++) {
        pad_top[i] = Math.floor((locs_y[i - 1] + input_size - locs_y[i]) / 2);
    }
    for (let i = 0; i < num_x - 1; i++) {
        pad_right[i] = locs_x[i] + input_size - locs_x[i + 1] - pad_left[i + 1];
    }
    for (let i = 0; i < num_y - 1; i++) {
        pad_bottom[i] = locs_y[i] + input_size - locs_y[i + 1] - pad_top[i + 1];
    }
    // const total = num_x * num_y;
    // let current = 0;
    // const useModel = new Array(total).fill(false);
    if (hasAlpha) {
        for (let i = 0; i < num_x; i++) {
            for (let j = 0; j < num_y; j++) {
                const x1 = locs_x[i];
                const y1 = locs_y[j];
                const x2 = locs_x[i] + input_size;
                const y2 = locs_y[j] + input_size;
                const tile = new Img(input_size, input_size);
                tile.getImageCrop(0, 0, inputImg, x1, y1, x2, y2);
                for (let k = 4; k < tile.data.length; k += 4) {
                    if (tile.data[k + 3] !== tile.data[3]) {
                        // useModel[current] = true;
                        break;
                    }
                }
                // if (useModel[current]) {
                //     current++;
                //     continue;
                // }
                const scaled = new Img(tile.width * factor, tile.height * factor);
                for (let k = 0; k < scaled.data.length; k += 4) {
                    scaled.data[k] = tile.data[3];
                    scaled.data[k + 1] = tile.data[3];
                    scaled.data[k + 2] = tile.data[3];
                }
                output.getImageCrop(
                    (x1 + pad_left[i]) * factor,
                    (y1 + pad_top[j]) * factor,
                    scaled,
                    pad_left[i] * factor,
                    pad_top[j] * factor,
                    scaled.width - pad_right[i] * factor,
                    scaled.height - pad_bottom[j] * factor
                );
                // current++;
            }
        }
        // current = 0;
        for (let i = 0; i < num_x; i++) {
            for (let j = 0; j < num_y; j++) {
                // if (!useModel[current]) {
                //     current++;
                //     const progress = (current / total) * 100;
                //     sendprogress(progress);
                //     continue;
                // }
                const x1 = locs_x[i];
                const y1 = locs_y[j];
                const x2 = locs_x[i] + input_size;
                const y2 = locs_y[j] + input_size;
                const tile = new Img(input_size, input_size);
                tile.getImageCrop(0, 0, inputImg, x1, y1, x2, y2);
                const scaled = await upscale(tile, model, true);
                output.getImageCrop(
                    (x1 + pad_left[i]) * factor,
                    (y1 + pad_top[j]) * factor,
                    scaled,
                    pad_left[i] * factor,
                    pad_top[j] * factor,
                    scaled.width - pad_right[i] * factor,
                    scaled.height - pad_bottom[j] * factor
                );
                // current++;
                // const progress = (current / total) * 100;
                // sendprogress(progress);
            }
        }
    } else {
        for (let i = 0; i < num_x; i++) {
            for (let j = 0; j < num_y; j++) {
                const x1 = locs_x[i];
                const y1 = locs_y[j];
                const x2 = locs_x[i] + input_size;
                const y2 = locs_y[j] + input_size;
                const tile = new Img(input_size, input_size);
                tile.getImageCrop(0, 0, inputImg, x1, y1, x2, y2);
                const scaled = await upscale(tile, model);
                output.getImageCrop(
                    (x1 + pad_left[i]) * factor,
                    (y1 + pad_top[j]) * factor,
                    scaled,
                    pad_left[i] * factor,
                    pad_top[j] * factor,
                    scaled.width - pad_right[i] * factor,
                    scaled.height - pad_bottom[j] * factor
                );
                // current++;
                // const progress = (current / total) * 100;
                // sendprogress(progress);
            }
        }
    }
    return output;
}
