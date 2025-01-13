import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@mediapipe/face_mesh';

/**
 * 检测人脸
 * @param image
 */
export async function detectFaces(image: HTMLImageElement) {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const detectorConfig: any = {
        runtime: 'tfjs',
        maxFaces: 1,
        modelType: 'short', //'short'|'full'
    };
    const detector = await faceDetection.createDetector(model, detectorConfig);
    const estimationConfig = {flipHorizontal: false};
    const faces = await detector.estimateFaces(image, estimationConfig);
    return faces;
}

/**
 * 检测人脸特征点
 * @param image
 */
export async function detectionFaceLandmarks(image: HTMLImageElement) {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig: any = {
        runtime: 'tfjs',
        maxFaces: 1,
        refineLandmarks: false,
    };
    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    const estimationConfig = {flipHorizontal: false};
    const faces = await detector.estimateFaces(image, estimationConfig);
    return faces;

}
