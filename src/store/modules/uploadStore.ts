// import localforage from 'localforage';

import imageCompression from "browser-image-compression";
import {message, notification, type UploadProps} from "ant-design-vue";
import {initNSFWJs, predictNSFW} from "@/utils/tfjs/nsfw.ts";
import i18n from "@/locales";

import {NSFWJS} from "nsfwjs";
import {animePredictImagePro} from "@/utils/tfjs/anime_classifier_pro.ts";
import {cocoSsdPredict} from "@/utils/tfjs/mobilenet.ts";
import {predictLandscape} from "@/utils/tfjs/landscape_recognition.ts";
import {getCategoryByLabel} from "@/constant/coco_ssd_label_category.ts";
import exifr from "exifr";
import isScreenshot from "@/utils/imageUtils/isScreenshot.ts";
import {ready, scan} from 'qr-scanner-wechat';
import {initBlurDetect, detectBlurFromFile} from '@/utils/imageBlurDetect/blurDetect';
import {fileToImageData} from "@/utils/file/image-converter.ts";

// Web Worker图像分析响应接口
interface ImageAnalysisResponse {
    isNSFW?: boolean;
    isAnime?: boolean;
    landscape?: string | null;
    tagName?: string | null;
    topCategory?: string | undefined;
    error?: string;
}

interface UploadPredictResult {
    isAnime: boolean;
    tagName: string | null;
    landscape: 'building' | 'forest' | 'glacier' | 'mountain' | 'sea' | 'street' | null;
    isScreenshot: boolean;
    topCategory: string | null;
    width: number | null;
    height: number | null;
    latitude: number | null;
    longitude: number | null;
    thumb_w: number | null;
    thumb_h: number | null;
    thumb_size: number | null;
    hasQrcode: boolean;
}

export const useUploadStore = defineStore(
    'upload',
    () => {
        const openUploadDrawer = ref<boolean>(false);

        const predictResult = reactive<UploadPredictResult>({
            isAnime: false,
            tagName: null,
            landscape: null,
            isScreenshot: false,
            topCategory: '',
            width: null,
            height: null,
            latitude: null,
            longitude: null,
            thumb_w: null,
            thumb_h: null,
            thumb_size: null,
            hasQrcode: false,
        });

        const uploadSetting = reactive<any>({
            nsfw_detection: true,
            anime_detection: true,
            landscape_detection: true,
            screenshot_detection: true,
            gps_detection: true,
            target_detection: false,
            qrcode_detection: true,
            face_detection: true,
            encrypt: false,
            blur_detection: true,
        });

        // 用于控制模糊检测后的流程控制
        const blurDetectionControl = reactive({
            isPaused: false,
            continuePromise: null as Promise<boolean> | null,
            continueResolve: null as ((value: boolean) => void) | null,
            // 继续执行上传流程
            continueUpload(enhance = false) {
                if (this.continueResolve) {
                    this.continueResolve(enhance);
                    this.isPaused = false;
                    this.continuePromise = null;
                    this.continueResolve = null;
                }
            },
            // 创建一个新的暂停Promise
            createPausePromise() {
                this.isPaused = true;
                this.continuePromise = new Promise<boolean>((resolve) => {
                    this.continueResolve = resolve;
                });
                return this.continuePromise;
            }
        });
        // 模糊检测阈值
        const thresholdValue = ref<number>(200);

        const storageSelected = ref<any[]>([]);

        const albumSelected = ref<number>();

        const predicting = ref<boolean>(false);
        const progressPercent = ref<number>(0);
        const progressStatus = ref<string>('active');
        const image = new Image();
        // 压缩图片配置
        const options = reactive({
            maxSizeMB: 0.3,
            maxWidthOrHeight: 750,
            maxIteration: 2,
            useWebWorker: true,
        });
        const progress: UploadProps['progress'] = {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
            class: 'progress-bar',
        };
        const fileList = ref<any[]>([]);

        /**
         * 打开上传抽屉
         */
        async function openUploadDrawerFn() {
            openUploadDrawer.value = true;
        }

        /**
         *  清除预测结果
         */
        function clearPredictResult() {
            predictResult.isAnime = false;
            predictResult.tagName = null;
            predictResult.landscape = null;
            predictResult.isScreenshot = false;
            predictResult.topCategory = '';
            predictResult.width = null;
            predictResult.height = null;
            predictResult.latitude = null;
            predictResult.longitude = null;
            predictResult.thumb_w = null;
            predictResult.thumb_h = null;
            predictResult.thumb_size = null;
            predictResult.hasQrcode = false;
        }

        /**
         * 图片上传前的校验
         * @param file
         * @param fileList
         */
        async function beforeUpload(file: File, fileList: File[]) {
            predicting.value = true;
            clearPredictResult();
            progressPercent.value = 0; // 初始化进度条
            progressStatus.value = 'active'; // 开始状态
            // 压缩图片
            const compressedFile = await imageCompression(file, options);
            // 创建图片对象
            image.src = URL.createObjectURL(compressedFile);
            // 获取图片宽高
            image.onload = async () => {
                const {width, height} = image;
                predictResult.width = width;
                predictResult.height = height;
                // 二维码检测
                if (uploadSetting.qrcode_detection) {
                    await ready();
                    const result = await scan(image);
                    if (result.text) {
                        predictResult.hasQrcode = true;
                    }
                }
            };

            // 更新进度条函数，逐步增加
            const smoothUpdateProgress = async (targetPercent, duration) => {
                const increment = (targetPercent - progressPercent.value) / (duration / 50);
                return new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (progressPercent.value >= targetPercent) {
                            clearInterval(interval);
                            resolve(false);
                        } else {
                            progressPercent.value = Math.min(progressPercent.value + increment, targetPercent);
                        }
                    }, 50);
                });
            };

            try {
                // 动态计算启用的检测步骤及进度分配
                const enabledSteps = [
                    uploadSetting.nsfw_detection,
                    uploadSetting.gps_detection,
                    uploadSetting.screenshot_detection,
                    uploadSetting.anime_detection,
                    uploadSetting.target_detection || uploadSetting.landscape_detection
                ].filter(Boolean).length;

                const stepIncrement = enabledSteps > 0 ? Math.floor(100 / enabledSteps) : 100;
                let currentProgress = 0;

                // NSFW 检测
                if (uploadSetting.nsfw_detection) {
                    const nsfw: NSFWJS = await initNSFWJs();
                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                    currentProgress += stepIncrement;

                    const isNSFW: boolean = await predictNSFW(nsfw, image);
                    if (isNSFW) {
                        message.error(i18n.global.t('comment.illegalImage'));
                        progressStatus.value = 'exception';
                        fileList.pop();
                        predicting.value = false;
                        return false;
                    }
                }

                // GPS 数据提取
                if (uploadSetting.gps_detection) {
                    const gpsData = await extractGPSExifData(file);
                    if (gpsData) {
                        predictResult.longitude = gpsData.longitude;
                        predictResult.latitude = gpsData.latitude;
                    }
                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                    currentProgress += stepIncrement;
                }

                // 截图检测
                if (uploadSetting.screenshot_detection) {
                    predictResult.isScreenshot = await isScreenshot(file);
                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                    currentProgress += stepIncrement;
                }

                // 模糊检测
                if (uploadSetting.blur_detection) {
                    const result = await detectBlurFromFile(file, thresholdValue.value);
                    if (result.isBlurry) {
                        // 显示通知并暂停执行
                        notification.open({
                            message: "检测到图片模糊，是否继续上传？",
                            type: "warning",
                            style: {
                                color: "rgba(96,165,250,.9)",
                                cursor: "pointer",
                            },
                            duration: 3,
                            btn:
                                h('a-button', {
                                    type: 'primary',
                                    onClick: () => {
                                        // 继续上传
                                        blurDetectionControl.continueUpload(false);
                                        notification.close('blur-notification');
                                    }
                                }, '继续上传'),
                            key: 'blur-notification',
                            onClose: () => {
                                // 如果通知被关闭但没有点击按钮，默认继续上传
                                if (blurDetectionControl.isPaused) {
                                    blurDetectionControl.continueUpload(false);
                                }
                            }
                        });

                        // 创建暂停Promise并等待用户操作
                        const shouldEnhance = await blurDetectionControl.createPausePromise();

                        // 这里可以添加处理的代码
                        if (shouldEnhance) { /* empty */
                        }
                    }
                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                    currentProgress += stepIncrement;
                }

                // 动漫检测
                if (uploadSetting.anime_detection) {
                    const prediction = await animePredictImagePro(image);
                    if (prediction === 'Furry' || prediction === 'Anime') {
                        predictResult.isAnime = true;
                        predicting.value = false;
                        progressPercent.value = 100;
                        return true;
                    }
                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                    currentProgress += stepIncrement;
                }

                // 目标检测
                if (uploadSetting.target_detection) {
                    const cocoResults: any = await cocoSsdPredict(image);
                    if (cocoResults.length > 0) {
                        // 多个结果时，按 score 排序，取置信度最高的结果
                        const sortedResults = cocoResults.sort((a, b) => b.score - a.score);
                        predictResult.topCategory = getCategoryByLabel(sortedResults[0].class);
                        predictResult.tagName = sortedResults[0].class;

                    }
                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                    currentProgress += stepIncrement;
                }
                if (uploadSetting.landscape_detection) {
                    const landscape = await predictLandscape(image);
                    predictResult.landscape = landscape as 'building' | 'forest' | 'glacier' | 'mountain' | 'sea' | 'street' | null;
                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                }

                // 确保进度条到100%
                if (currentProgress < 100) {
                    await smoothUpdateProgress(100, 500);
                }


                predicting.value = false;
                return true;

            } catch (error) {
                console.error('识别过程中发生错误:', error);
                predicting.value = false;
                progressPercent.value = 0; // 重置进度条
                return false;
            }
        }

        /**
         *  上传前的预处理
         * @param file
         * @param _fileList
         */
        async function beforeUploadWithWebWorker(file: File, _fileList: File[]) {
            predicting.value = true;
            clearPredictResult();
            progressPercent.value = 0; // 初始化进度条
            progressStatus.value = 'active'; // 开始状态
            // 压缩图片
            // const compressedFile = await imageCompression(file, options);

            const imageData: ImageData = await fileToImageData(file);

            predictResult.width = imageData.width;
            predictResult.height = imageData.height;

            // 更新进度条函数，逐步增加
            const smoothUpdateProgress = async (targetPercent, duration) => {
                const increment = (targetPercent - progressPercent.value) / (duration / 50);
                return new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (progressPercent.value >= targetPercent) {
                            clearInterval(interval);
                            resolve(false);
                        } else {
                            progressPercent.value = Math.min(progressPercent.value + increment, targetPercent);
                        }
                    }, 50);
                });
            };

            try {
                // 创建Web Worker进行图像分析
                const worker = new Worker(new URL('@/workers/image-analysis/image-analysis.worker.ts', import.meta.url), {type: 'module'});

                // 计算启用的检测步骤及进度分配
                const enabledSteps = [
                    uploadSetting.nsfw_detection,
                    uploadSetting.anime_detection,
                    uploadSetting.landscape_detection,
                    uploadSetting.target_detection,
                    uploadSetting.gps_detection,
                    uploadSetting.screenshot_detection,
                    uploadSetting.qrcode_detection,
                    uploadSetting.blur_detection
                ].filter(Boolean).length;

                const stepIncrement = enabledSteps > 0 ? Math.floor(100 / (enabledSteps + 1)) : 100;
                let currentProgress = 0;

                // 二维码检测
                if (uploadSetting.qrcode_detection) {
                    await ready();
                    const result = await scan(imageData);
                    if (result.text) {
                        predictResult.hasQrcode = true;
                    }
                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                    currentProgress += stepIncrement;
                }

                // GPS 数据提取
                if (uploadSetting.gps_detection) {
                    const gpsData = await extractGPSExifData(file);
                    if (gpsData) {
                        predictResult.longitude = gpsData.longitude;
                        predictResult.latitude = gpsData.latitude;
                    }
                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                    currentProgress += stepIncrement;
                }

                // 截图检测
                if (uploadSetting.screenshot_detection) {
                    predictResult.isScreenshot = await isScreenshot(file);
                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                    currentProgress += stepIncrement;
                }

                // 模糊检测
                if (uploadSetting.blur_detection) {
                    const result = await detectBlurFromFile(file, thresholdValue.value);
                    if (result.isBlurry) {
                        // 显示通知并暂停执行
                        notification.open({
                            message: "检测到图片模糊，是否继续上传？",
                            type: "warning",
                            style: {
                                color: "rgba(96,165,250,.9)",
                                cursor: "pointer",
                            },
                            duration: 3,
                            btn:
                                h('a-button', {
                                    type: 'primary',
                                    onClick: () => {
                                        // 继续上传
                                        blurDetectionControl.continueUpload(false);
                                        notification.close('blur-notification');
                                    }
                                }, '继续上传'),
                            key: 'blur-notification',
                            onClose: () => {
                                // 如果通知被关闭但没有点击按钮，默认继续上传
                                if (blurDetectionControl.isPaused) {
                                    blurDetectionControl.continueUpload(false);
                                }
                            }
                        });

                        // 创建暂停Promise并等待用户操作
                        const shouldEnhance = await blurDetectionControl.createPausePromise();

                        // 这里可以添加处理的代码
                        if (shouldEnhance) { /* empty */
                        }
                    }
                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                    currentProgress += stepIncrement;
                }

                // 使用Web Worker进行图像分析（NSFW、动漫、景观、目标检测）
                if (uploadSetting.nsfw_detection || uploadSetting.anime_detection ||
                    uploadSetting.landscape_detection || uploadSetting.target_detection) {

                    // 创建一个Promise来处理Worker的响应
                    const workerPromise = new Promise<ImageAnalysisResponse>((resolve, reject) => {
                        worker.onmessage = (e) => {
                            resolve(e.data);
                        };

                        worker.onerror = (error) => {
                            reject(error);
                        };
                    });

                    // 发送数据到Worker
                    worker.postMessage({
                        imageData: imageData.data.buffer,
                        width: imageData.width,
                        height: imageData.height,
                        settings: {
                            nsfw_detection: uploadSetting.nsfw_detection,
                            anime_detection: uploadSetting.anime_detection,
                            landscape_detection: uploadSetting.landscape_detection,
                            target_detection: uploadSetting.target_detection
                        },
                    }, [imageData.data.buffer]);

                    // 等待Worker处理结果
                    const analysisResult = await workerPromise;

                    // 处理Worker返回的结果
                    if (analysisResult.error) {
                        console.error('Worker处理图像时出错:', analysisResult.error);
                    } else {
                        // NSFW检测结果处理
                        if (uploadSetting.nsfw_detection && analysisResult.isNSFW) {
                            message.error(i18n.global.t('comment.illegalImage'));
                            progressStatus.value = 'exception';
                            fileList.value.pop();
                            predicting.value = false;
                            worker.terminate();
                            return false;
                        }

                        // 动漫检测结果处理
                        if (uploadSetting.anime_detection) {
                            predictResult.isAnime = analysisResult.isAnime || false;
                        }

                        // 景观识别结果处理
                        if (uploadSetting.landscape_detection && analysisResult.landscape) {
                            predictResult.landscape = analysisResult.landscape as 'building' | 'forest' | 'glacier' | 'mountain' | 'sea' | 'street' | null;
                        }

                        // 目标检测结果处理
                        if (uploadSetting.target_detection) {
                            predictResult.tagName = analysisResult.tagName || null;
                            predictResult.topCategory = analysisResult.topCategory || null;
                        }
                    }

                    // 终止Worker
                    worker.terminate();

                    await smoothUpdateProgress(currentProgress + stepIncrement, 500);
                    currentProgress += stepIncrement;
                }

                // 确保进度条到100%
                if (currentProgress < 100) {
                    await smoothUpdateProgress(100, 500);
                }

                predicting.value = false;
                return true;

            } catch (error) {
                console.error('识别过程中发生错误:', error);
                predicting.value = false;
                progressPercent.value = 0; // 重置进度条
                return false;
            }
        }


        /**
         * 提取 EXIF 数据
         * @param {File} file - 图片文件
         * @returns {Promise<Object|null>} - 返回所有 EXIF 数据或 null（如果格式不支持或提取失败）
         */
        async function extractGPSExifData(file): Promise<{ latitude: any; longitude: any; } | null> {
            const supportedFormats = ['image/jpeg', 'image/tiff', 'image/iiq', 'image/heif', 'image/heic', 'image/avif', 'image/png'];

            // 判断文件格式是否支持
            if (!supportedFormats.includes(file.type)) {
                return null;
            }
            const options: any = {
                ifd0: false,
                exif: false,
                gps: ['GPSLatitudeRef', 'GPSLatitude', 0x0003, 0x0004],
                interop: false,
                ifd1: false // thumbnail
            };

            // 提取GPS EXIF 数据
            const gpsData = await exifr.parse(file, options);
            if (!gpsData) {
                return null;
            }
            const {latitude, longitude} = gpsData;
            if (latitude && longitude) {
                return {latitude, longitude};
            }
            return null;
        }

        /**
         * 拒绝文件回调
         * @param fileList
         */
        function rejectFile(fileList: any) {
            fileList.value.pop();
        }

        /**
         *  删除文件
         * @param file
         */
        function removeFile(file: any) {
            fileList.value = fileList.value.filter((item: any) => item.uid !== file.uid);
        }

        onMounted(async () => {
            await ready();
            await initBlurDetect();
        });


        return {
            openUploadDrawer,
            predictResult,
            storageSelected,
            openUploadDrawerFn,
            clearPredictResult,
            beforeUpload,
            albumSelected,
            options,
            predicting,
            progressPercent,
            progressStatus,
            uploadSetting,
            progress,
            fileList,
            rejectFile,
            removeFile,
            blurDetectionControl,
            beforeUploadWithWebWorker
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'STORE-UPLOAD',
            includePaths: ["storageSelected", "albumSelected", "uploadSetting"]
        }
    }
);
