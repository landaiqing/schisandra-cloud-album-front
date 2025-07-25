import * as tf from "@tensorflow/tfjs";
import Image from "./image.ts";

export default async function upscale(
    image: Image,
    model: tf.GraphModel,
    alpha = false
): Promise<Image> {
    const result = tf.tidy(() => {
        const tensor = img2tensor(image);
        let result = model.predict(tensor) as tf.Tensor;
        if (alpha) {
            result = tf.greater(result, 0.5);
        }
        return result;
    });
    const resultImage = await tensor2img(result);
    tf.dispose(result);
    return resultImage;
}

function img2tensor(image: Image): tf.Tensor {
    const imgdata = new ImageData(image.width, image.height);
    imgdata.data.set(image.data);
    const tensor = tf.browser.fromPixels(imgdata).div(255).toFloat().expandDims();
    return tensor;
}

async function tensor2img(tensor: tf.Tensor): Promise<Image> {
    const [_, height, width, __] = tensor.shape;

    const clipped = tf.tidy(() =>
        tensor
            .reshape([height, width, 3])
            .mul(255)
            .cast("int32")
            .clipByValue(0, 255)
    );
    tensor.dispose();
    const data = await tf.browser.toPixels(clipped as tf.Tensor3D);
    clipped.dispose();
    const image = new Image(width, height, data as unknown as Uint8Array);

    return image;
}
