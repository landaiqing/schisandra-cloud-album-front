import {defineStore} from 'pinia';
import {initNSFWJs, predictNSFW} from "@/utils/nsfw/nsfw.ts";
import i18n from "@/locales";

import {NSFWJS} from "nsfwjs";
import localForage from "localforage";
import {message} from "ant-design-vue";
import Img from "@/workers/upscale/image.ts";
import Module from "@/workers/upscale/imghelper.ts";


export const useUpscaleStore = defineStore(
        'upscale',
        () => {

            // 模型参数
            const TypeData = ref<string[]>(['realesrgan', 'realcugan']);

            const model_type = ref<string>(TypeData.value[0]);

            const ModelConfig = reactive({
                realesrgan: {
                    model: ["anime_fast", "anime_plus", "general_fast", "general_plus"],
                    factor: [4],
                    tile_size: [32, 48, 64, 96, 128, 192, 256],
                },
                realcugan: {
                    factor: [2, 4],
                    denoise: {
                        2: [
                            "conservative",
                            "no-denoise",
                            "denoise1x",
                            "denoise2x",
                            "denoise3x",
                        ],
                        3: ["conservative", "denoise3x"],
                        4: ["conservative", "no-denoise", "denoise3x"],
                    },
                    tile_size: [32, 48, 64, 96, 128, 192, 256, 384, 512],
                }
            });
            const factor = ref<number>(4);
            const model = ref(ModelConfig[model_type.value].model[0]);
            const modes = computed(() => {
                if (model_type.value === "realesrgan") {
                    return ModelConfig[model_type.value].model;
                } else {
                    return ModelConfig[model_type.value].denoise[factor.value];
                }
            });

            watch(model_type, val => {
                if (model_type.value === "realesrgan") {
                    model.value = ModelConfig[val].model[0];
                } else {
                    model.value = ModelConfig[val].denoise[factor.value][0];
                }
            });


            // Scale
            const scales = computed(() => {
                return ModelConfig[model_type.value].factor;
            });

            //tile size
            const tile_size = ref<number>(128);
            const tileSize = computed(() => {
                return ModelConfig[model_type.value].tile_size;
            });

            // overlap
            const overlapList = ref<number[]>([0, 4, 8, 12, 16, 20]);
            const min_lap = ref<number>(overlapList.value[3]);

            // run on
            const backendList = ref<string[]>(['webgl', 'webgpu']);
            const backend = ref<string>(backendList.value[0]);

            // ***************图片处理***************
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
            const status = ref<string>('loading');


            const dragging = ref<boolean>(false);
            const linePosition = ref(0);
            const draggingLine = ref(false);


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
                await clear();
                fileData.value = urlData;
                await loadImg(image);
                uploading.value = false;

                return true;
            }

            /**
             *  自定义上传图片请求
             */
            async function customUploadRequest(_file: any) {
                imageData.value = fileData.value;
            }

            /**
             *  清空数据
             */
            async function clear() {
                imageData.value = "";
                processedImg.value = "";
                isDone.value = false;
                msg.value = "";
                progressBar.value = 0;
                isProcessing.value = false;
                dragging.value = false;
                linePosition.value = 0;
                draggingLine.value = false;
                input.value = null;
                inputAlpha.value = null;
                wasmModule.value = null;
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
                TypeData,
                model_type,
                ModelConfig,
                model,
                modes,
                factor,
                tile_size,
                tileSize,
                scales,
                overlapList,
                min_lap,
                backend,
                backendList,
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
                status,
                dragging,
                linePosition,
                draggingLine,
                loadImg,
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
