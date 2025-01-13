import * as faceapi from '@vladmandic/face-api/dist/face-api.esm-nobundle.js';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs';

export async function loadFaceExtractorModel() {
    tf.setBackend('webgl'); // set webgl backend
    // 模型文件访问路径
    const modelsPath = `/tfjs/face_api/model/ssd_mobilenetv1_model-weights_manifest.json`;
    // 模型参数-ssdMobilenetv1
    await faceapi.nets.ssdMobilenetv1.load(modelsPath);
    return new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5, // 0 ~ 1
        maxResults: 50, // 0 ~ 100
    });
}

export async function fnDetectFace(img: HTMLImageElement) {
    const options = await loadFaceExtractorModel();
    const detections = await faceapi.detectSingleFace(
        img,
        options,
    );
    if (!detections) {
        return null;
    }
    const faceImages = await faceapi.extractFaces(img, [detections]);
    return faceImages[0].toDataURL('image/png');
}
