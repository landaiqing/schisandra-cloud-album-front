// import localforage from 'localforage';

import imageCompression from "browser-image-compression";
import {message, type UploadProps} from "ant-design-vue";
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

interface UploadPredictResult {
    isAnime: boolean;
    tagName: string | null;
    landscape: 'building' | 'forest' | 'glacier' | 'mountain' | 'sea' | 'street' | null;
    isScreenshot: boolean;
    topCategory: string | undefined;
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
        });

        const storageSelected = ref<any[]>([]);

        const albumSelected = ref<number>();

        const predicting = ref<boolean>(false);
        const progressPercent = ref<number>(0);
        const progressStatus = ref<string>('active');
        const image = new Image();
        // 压缩图片配置
        const options = reactive({
            maxSizeMB: 0.2,
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
                        // 取置信度最高的结果
                        // 如果只有一个结果，直接取第一个
                        if (cocoResults.length === 1) {
                            predictResult.topCategory = getCategoryByLabel(cocoResults[0].class);
                            predictResult.tagName = cocoResults[0].class;
                        } else {
                            // 多个结果时，按 score 排序，取置信度最高的结果
                            const sortedResults = cocoResults.sort((a, b) => b.score - a.score);
                            predictResult.topCategory = getCategoryByLabel(sortedResults[0].class);
                            predictResult.tagName = sortedResults[0].class;
                        }
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
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'upload',
            includePaths: ["storageSelected", "albumSelected", "uploadSetting"]
        }
    }
);
