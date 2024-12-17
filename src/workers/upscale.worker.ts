import Img from "./image.ts";
import upscale from "./upscale.ts";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgpu";

self.onmessage = async function (e: MessageEvent): Promise<void> {
    const {data} = e;
    let model_url: string;
    let model_name: string;
    if (data?.model_type === "realesrgan") {
        model_url = `/tfjs/realesrgan/${data?.model}-${data?.tile_size}/model.json`;
        model_name = `realesrgan-${data?.model}-${data?.tile_size}`;
    } else {
        model_url = `/tfjs/realcugan/${data?.factor}x-${data?.model}-${data?.tile_size}/model.json`;
        model_name = `realcugan-${data?.factor}x-${data?.model}-${data?.tile_size}`;
    }
    await tf.ready();
    if (!(await tf.setBackend(data?.backend || "webgl"))) {
        self.postMessage({
            error: `${data?.backend} is not supported in your browser.`,
        });
        return;
    }
    let Model: tf.GraphModel;
    try {
        Model = await tf.loadGraphModel(`indexeddb://${model_name}`);
        self.postMessage({info: "Model loaded from cache successfully"});
    } catch (_error) {
        self.postMessage({info: "Downloading model..."});
        Model = await (async () => {
            const fetchedModel = await tf.loadGraphModel(model_url);
            await fetchedModel.save(`indexeddb://${model_name}`);
            return fetchedModel;
        })();
    }
    if (!Model) {
        self.postMessage({error: "Failed to load model"});
        return;
    }
    const input = new Img(data.width, data.height, new Uint8Array(data.input));
    const width_ori = input.width;
    const height_ori = input.height;
    input.padToTileSize(data?.tile_size || 64);
    let withPadding = false;
    if (input.width !== width_ori || input.height !== height_ori) {
        withPadding = true;
    }
    const hasAlpha = data.hasAlpha;

    function sendProgress(progress: number) {
        if (hasAlpha) {
            self.postMessage({
                progress: progress,
                info: `Processing Alpha ${progress.toFixed(2)}%`,
            });
            return;
        }
        self.postMessage({
            progress: progress,
            info: `Processing ${progress.toFixed(2)}%`,
        });
    }

    async function enlargeImageWithFixedInput(
        model: tf.GraphModel,
        inputImg: Img,
        factor = 4,
        input_size = 64,
        min_lap = 12
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
        const total = num_x * num_y;
        let current = 0;
        const useModel = new Array(total).fill(false);
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
                            useModel[current] = true;
                            break;
                        }
                    }
                    if (useModel[current]) {
                        current++;
                        continue;
                    }
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
                    current++;
                }
            }
            current = 0;
            for (let i = 0; i < num_x; i++) {
                for (let j = 0; j < num_y; j++) {
                    if (!useModel[current]) {
                        current++;
                        const progress = (current / total) * 100;
                        sendProgress(progress);
                        continue;
                    }
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
                    current++;
                    const progress = (current / total) * 100;
                    sendProgress(progress);
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
                    current++;
                    const progress = (current / total) * 100;
                    sendProgress(progress);
                }
            }
        }
        return output;
    }

    const factor = data?.factor || 4;
    const tile_size = data?.tile_size || 64;
    const min_lap = data?.min_lap || 12;
    let output: any;
    try {
        output = await enlargeImageWithFixedInput(
            Model,
            input,
            factor,
            tile_size,
            min_lap
        );
    } catch (e: any) {
        self.postMessage({error: e.toString()});
    }
    if (withPadding) {
        output.cropToOriginalSize(width_ori * factor, height_ori * factor);
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
    self.postMessage({
        progress: 100,
        info: `Processing image...`,
    });
    self.postMessage(
        {
            progress: 100,
            done: true,
            output: output.data.buffer,
            info: `Processing image...`,
        },
        [output.data.buffer]
    );
};
