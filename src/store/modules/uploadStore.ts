import {initNSFWJs, predictNSFW} from "@/utils/nsfw/nsfw.ts";
import i18n from "@/locales";

import {NSFWJS} from "nsfwjs";
import {message} from "ant-design-vue";

// import {loadCocoSsd, loadMobileNet} from "@/utils/tfjs/tfjs.ts";
import {loadModel, predictImage} from "@/utils/tfjs/anime_classifier.ts";

export const useUploadStore = defineStore(
    'upload',
    () => {
        const openUploadDrawer = ref<boolean>(false);
        const image: HTMLImageElement = document.createElement('img');

        /**
         * 图片上传前的校验
         * @param file
         */
        async function beforeUpload(file: File) {
            image.src = URL.createObjectURL(file);
            // 图片 NSFW 检测
            const nsfw: NSFWJS = await initNSFWJs();
            const isNSFW: boolean = await predictNSFW(nsfw, image);
            if (isNSFW) {
                message.error(i18n.global.t('comment.illegalImage'));
                return false;
            }
            // const predictions = await loadMobileNet(image);
            // console.log(predictions);
            //
            // const prediction = await loadCocoSsd(image);
            // console.log(prediction);

            const model = await loadModel('/tfjs/anime_classifier/model.json');

            // 进行预测
            const output = await predictImage(model, image);
            console.log(output);

            // console.log('Predicted Class:', predictedClass);
            return true;
        }

        /**
         * 自定义上传请求
         * @param file
         */
        async function customUploadRequest(file: any) {

            const progress = {percent: 1};


            const intervalId = setInterval(() => {
                if (progress.percent < 100) {
                    progress.percent++;
                    file.onProgress(progress);
                } else {
                    clearInterval(intervalId);
                }
            }, 100);
            file.onSuccess(true);

            // file.onSuccess = () => {
            //     message.success(i18n.global.t('comment.uploadSuccess'));
            // };
            // file.onError = () => {
            //     message.error(i18n.global.t('comment.uploadError'));
            // };
            // return Promise.resolve(file);

        }

        return {
            openUploadDrawer,
            beforeUpload,
            customUploadRequest
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: false,
            storage: localStorage,
            key: 'upload',
            includePaths: []
        }
    }
);
