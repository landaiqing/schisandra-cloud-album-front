import {defineStore} from 'pinia';
import {initNSFWJs, predictNSFW} from "@/utils/nsfw/nsfw.ts";
import i18n from "@/locales";

import {NSFWJS} from "nsfwjs";
import localForage from "localforage";
import {message} from "ant-design-vue";
import Module from "@/workers/imghelper.ts";
import Img from "@/workers/image.ts";


export const useUpscaleStore = defineStore(
        'upscale',
        () => {
            const image: HTMLImageElement = document.createElement('img');
            const imageList = ref<string[]>([]);
            const fileList = ref<string[]>([]);
            const uploading = ref<boolean>(false);

            // 加载图片数据
            const img = ref<HTMLImageElement>(new Image());
            const wasmModule = ref<any>();
            const hasAlpha = ref(false);
            const input = ref<Img | null>(null);
            const inputAlpha = ref<Img | null>(null);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', {willReadFrequently: true});

            const imgLoaded = ref<boolean>(false);

            // 处理后的图片
            const processedImg = ref<HTMLImageElement>(new Image());

            /**
             * 图片上传前的校验
             * @param file
             */
            async function beforeUpload(file: any) {
                if (fileList.value.length >= 5) {
                    return false;
                }
                uploading.value = true;
                if (!window.FileReader) return false;
                const reader = new FileReader();
                reader.readAsDataURL(file); // 文件转换
                reader.onload = async function () {
                    image.src = reader.result as string;
                    // 图片 NSFW 检测
                    const nsfw: NSFWJS = await initNSFWJs();
                    const isNSFW: boolean = await predictNSFW(nsfw, image);
                    if (isNSFW) {
                        message.error(i18n.global.t('comment.illegalImage'));
                        fileList.value.pop();
                        uploading.value = false;
                        return false;
                    }
                    fileList.value.push(image.src);
                    // 加载图片
                    await loadImg(image.src);
                    uploading.value = false;
                    return true;
                };
            }

            /**
             *  自定义上传图片请求
             */
            async function customUploadRequest() {
                imageList.value = fileList.value;
            }

            /**
             *  移除图片
             * @param index
             */
            async function removeImage(index: number) {
                fileList.value.splice(index, 1);
                imageList.value.splice(index, 1);
            }

            /**
             *  加载图片
             * @param src
             */
            async function loadImg(src: string) {
                img.value.src = src;
                img.value.onload = async () => {
                    wasmModule.value = await Module();
                    if (ctx) {
                        canvas.width = img.value.width;
                        canvas.height = img.value.height;
                        ctx.drawImage(img.value, 0, 0);
                        const imageData = ctx.getImageData(0, 0, img.value.width, img.value.height);
                        const data = new Uint8Array(imageData.data.buffer);
                        input.value = new Img(img.value.width, img.value.height, data);
                        const numPixels = input.value.width * input.value.height;
                        const bytesPerImage = numPixels * 4;
                        const sourcePtr = wasmModule.value._malloc(bytesPerImage);
                        const targetPtr = wasmModule.value._malloc(bytesPerImage);
                        wasmModule.value.HEAPU8.set(input.value.data, sourcePtr);
                        hasAlpha.value = wasmModule.value._check_alpha(sourcePtr, numPixels);
                        if (hasAlpha.value) {
                            inputAlpha.value = new Img(img.value.width, img.value.height);
                            wasmModule.value._copy_alpha_to_rgb(sourcePtr, targetPtr, numPixels);
                            inputAlpha.value.data.set(
                                wasmModule.value.HEAPU8.subarray(targetPtr, targetPtr + bytesPerImage)
                            );
                        }
                        wasmModule.value._free(sourcePtr);
                        wasmModule.value._free(targetPtr);
                        imgLoaded.value = true;
                    }
                };

            }


            return {
                imageList,
                fileList,
                uploading,
                input,
                hasAlpha,
                inputAlpha,
                wasmModule,
                img,
                processedImg,
                imgLoaded,
                beforeUpload,
                customUploadRequest,
                removeImage,
            };
        }

        ,
        {
            // 开启数据持久化
            persistedState: {
                persist: true,
                storage: localForage,
                key: 'upscale',
                includePaths: [
                    'imageList',
                    'fileList',
                    'img',
                    'processedImg',
                ]
            }
        }
    )
;
