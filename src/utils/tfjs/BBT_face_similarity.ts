import * as faceapi from '@vladmandic/face-api/dist/face-api.esm-nobundle.js';

export async function loadModel() {
    const modelsPath = `/tfjs/face_api/model`;
    // 面部识别模型
    await faceapi.nets.faceRecognitionNet.load(modelsPath);
}

export async function faceSimilarity(img1: HTMLImageElement, img2: HTMLImageElement) {
    const descriptor1 = await faceapi.computeFaceDescriptor(img1);
    const descriptor2 = await faceapi.computeFaceDescriptor(img2);
    if (descriptor1 instanceof Float32Array && descriptor2 instanceof Float32Array) {
        return faceapi.euclideanDistance(descriptor1, descriptor2).toFixed(2);
    }
    return -1;
}
