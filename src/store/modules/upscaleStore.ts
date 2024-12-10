import {defineStore} from 'pinia';
import {initNSFWJs, predictNSFW} from "@/utils/nsfw/nsfw.ts";
import i18n from "@/locales";
import message from "@/components/MyUI/Message/Message.vue";
import {NSFWJS} from "nsfwjs";
import localForage from "localforage";

export const useUpscaleStore = defineStore(
        'upscale',
        () => {
            const imageList = ref<string[]>([]);
            const fileList = ref<string[]>([]);
            const uploading = ref<boolean>(false);

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
                reader.onloadend = async function () {
                    const img: HTMLImageElement = document.createElement('img');
                    img.src = reader.result as string;
                    img.onload = async () => {
                        // 图片 NSFW 检测
                        const nsfw: NSFWJS = await initNSFWJs();
                        const isNSFW: boolean = await predictNSFW(nsfw, img);
                        if (isNSFW) {
                            message.error(i18n.global.t('comment.illegalImage'));
                            fileList.value.pop();
                            return false;
                        }
                        fileList.value.push(img.src);
                    };

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

            return {
                imageList,
                fileList,
                uploading,
                beforeUpload,
                customUploadRequest,
                removeImage
            };
        }

        ,
        {
            // 开启数据持久化
            persistedState: {
                persist: true,
                storage:
                localForage,
                key:
                    'upscale',
                includePaths:
                    ['imageList', 'fileList']
            }
        }
    )
;
