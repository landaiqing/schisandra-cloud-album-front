import {defineStore} from 'pinia';
import {initNSFWJs, predictNSFW} from "@/utils/nsfw/nsfw.ts";
import i18n from "@/locales";

import {NSFWJS} from "nsfwjs";
import localForage from "localforage";
import {message} from "ant-design-vue";
import Img from "@/workers/image.ts";
import Module from "@/workers/imghelper.ts";


export const useUpscaleStore = defineStore(
        'upscale',
        () => {
            const image: HTMLImageElement = document.createElement('img');
            const imageData = ref<string>();
            const fileData = ref<string>();
            const uploading = ref<boolean>(false);

            // 加载图片数据
            const hasAlpha = ref(false);
            const input = ref<Img | null>(null);
            const inputAlpha = ref<Img | null>(null);

            const wasmModule = ref<any>(null);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', {willReadFrequently: true});


            // 处理后的图片
            const processedImg = ref<string>('');
            const isDone = ref<boolean>(false);
            const isProcessing = ref<boolean>(false);
            const msg = ref<string>("");
            const progressBar = ref<number>(0);

            /**
             * 图片上传前的校验
             * @param file
             */
            async function beforeUpload(file: File) {
                uploading.value = true;
                const urlData = URL.createObjectURL(file);
                image.src = urlData;
                // 图片 NSFW 检测
                const nsfw: NSFWJS = await initNSFWJs();
                const isNSFW: boolean = await predictNSFW(nsfw, image);
                if (isNSFW) {
                    message.error(i18n.global.t('comment.illegalImage'));
                    fileData.value = '';
                    uploading.value = false;
                    return false;
                }
                fileData.value = urlData;
                await loadImg(image);
                uploading.value = false;

                imageData.value = "";
                processedImg.value = "";
                isDone.value = false;
                msg.value = "";
                progressBar.value = 0;

                return true;
            }

            /**
             *  自定义上传图片请求
             */
            async function customUploadRequest(_file: any) {

                imageData.value = fileData.value;
            }

            /**
             *  加载图片
             * @param img
             */
            async function loadImg(img: HTMLImageElement) {
                wasmModule.value = await Module();
                if (ctx && wasmModule.value) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    const data = new Uint8Array(imageData.data.buffer);
                    input.value = new Img(img.width, img.height, data);
                    const numPixels = input.value.width * input.value.height;
                    const bytesPerImage = numPixels * 4;
                    const sourcePtr = wasmModule.value._malloc(bytesPerImage);
                    const targetPtr = wasmModule.value._malloc(bytesPerImage);
                    wasmModule.value.HEAPU8.set(input.value.data, sourcePtr);
                    hasAlpha.value = wasmModule.value._check_alpha(sourcePtr, numPixels);
                    if (hasAlpha.value) {
                        inputAlpha.value = new Img(img.width, img.height);
                        wasmModule.value._copy_alpha_to_rgb(sourcePtr, targetPtr, numPixels);
                        inputAlpha.value.data.set(
                            wasmModule.value.HEAPU8.subarray(targetPtr, targetPtr + bytesPerImage)
                        );
                    }
                    wasmModule.value._free(sourcePtr);
                    wasmModule.value._free(targetPtr);
                }

            }


            return {
                uploading,
                imageData,
                input,
                hasAlpha,
                inputAlpha,
                processedImg,
                wasmModule,
                isDone,
                isProcessing,
                msg,
                progressBar,
                beforeUpload,
                customUploadRequest,
            };
        }

        ,
        {
            // 开启数据持久化
            persistedState: {
                persist: false,
                storage: localForage,
                key: 'upscale',
                includePaths: [],
            }
        }
    )
;
