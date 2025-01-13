<template>
  <ADrawer v-model:open="upload.openUploadDrawer" width="40%" placement="right" title="上传照片">
    <template #extra>
      <AFlex :vertical="false" justify="center" align="center" gap="large">
        <ASelect size="middle" style="width: 150px">

        </ASelect>
        <ASelect size="middle" style="width: 150px">

        </ASelect>
      </AFlex>
    </template>
    <div class="upload-container">
      <Spin :spinning="predicting" indicator="magic-ring">
        <AUploadDragger
            v-model:fileList="fileList"
            accept="image/*"
            name="file"
            :directory="false"
            :multiple="true"
            method="post"
            :beforeUpload="beforeUpload"
            :customRequest="customUploadRequest"
            :progress="progress"
            :maxCount="10"
            list-type="picture"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">单击或拖动文件到此区域以上传</p>
          <p class="ant-upload-hint">
            支持单次或批量上传，严禁上传非法图片，违者将受到法律惩戒。
          </p>
        </AUploadDragger>
      </Spin>
    </div>
    <template #footer>
      <AFlex :vertical="false" justify="end" align="center" gap="large">
        <AButton type="default" size="middle" style="width: 100px">取消</AButton>
        <AButton type="primary" size="middle" style="width: 100px">上传</AButton>
      </AFlex>
    </template>
  </ADrawer>
</template>
<script setup lang="ts">
import useStore from "@/store";
import {InboxOutlined} from '@ant-design/icons-vue';
import type {UploadProps} from 'ant-design-vue';
import {message} from "ant-design-vue";
import {initNSFWJs, predictNSFW} from "@/utils/nsfw/nsfw.ts";
import i18n from "@/locales";

import {NSFWJS} from "nsfwjs";
import {animePredictImage} from "@/utils/tfjs/anime_classifier.ts";
import {animePredictImagePro} from "@/utils/tfjs/anime_classifier_pro.ts";
import {fnDetectFace} from "@/utils/tfjs/face_extraction.ts";
import {cocoSsdPredict} from "@/utils/tfjs/mobilenet.ts";
import {predictLandscape} from "@/utils/tfjs/landscape_recognition.ts";
import Spin from "@/components/MyUI/Spin/Spin.vue";

const predicting = ref<boolean>(false);


const upload = useStore().upload;
const image: HTMLImageElement = document.createElement('img');

const fileList = ref([]);

const progress: UploadProps['progress'] = {
  strokeColor: {
    '0%': '#108ee9',
    '100%': '#87d068',
  },
  strokeWidth: 3,
  format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
  class: 'progress-bar',
};

/**
 * 图片上传前的校验
 * @param file
 */
async function beforeUpload(file: File) {
  predicting.value = true;
  image.src = URL.createObjectURL(file);
  // 图片 NSFW 检测
  const nsfw: NSFWJS = await initNSFWJs();
  const isNSFW: boolean = await predictNSFW(nsfw, image);
  if (isNSFW) {
    message.error(i18n.global.t('comment.illegalImage'));
    predicting.value = false;
    return false;
  }
  predicting.value = false;
  return true;
}

/**
 * 自定义上传请求
 * @param file
 */
async function customUploadRequest(file: any) {
  upload.clearPredictResult();
  let percent = 1; // 初始化进度
  const totalSteps = 5; // 总任务数，用于计算进度百分比

  // 更新进度条函数
  const updateProgress = (completedSteps: number) => {
    const targetPercent = Math.min((completedSteps / totalSteps) * 100, 100); // 目标进度
    if (percent < targetPercent) {
      // 每次进度更新时，增加一个小增量
      const increment = Math.min(1, targetPercent - percent);  // 每次增量
      percent += increment;

      // 更新进度条
      file.onProgress({percent});

      // 控制进度条更新的速度
      if (percent < targetPercent) {
        setTimeout(() => updateProgress(completedSteps), 50); // 每50ms更新一次
      }
    }
  };

  let completedSteps = 0; // 已完成的步骤计数

  try {
    // Step 1: 动漫预测
    const prediction1 = await animePredictImage(image);
    completedSteps++;
    updateProgress(completedSteps);

    const prediction2 = await animePredictImagePro(image);
    completedSteps++;
    updateProgress(completedSteps);

    if (prediction1 === 'Anime' && (prediction2 === 'Furry' || prediction2 === 'Anime')) {
      upload.predictResult.isAnime = true;

      // 任务提前完成，直接设置进度为 100%
      percent = 100;
      file.onProgress({percent});
      setTimeout(() => {
        file.onSuccess();
      });
      return true;
    }

    // Step 2: 人脸检测
    const faceImageData = await fnDetectFace(image);
    completedSteps++;
    updateProgress(completedSteps);

    if (faceImageData) {
      upload.predictResult.hasFace = true;

      // 任务提前完成，直接设置进度为 100%
      percent = 100;
      file.onProgress({percent});
      setTimeout(() => {
        file.onSuccess();
      });
      return true;
    }

    // Step 3: 目标识别
    const cocoResults = await cocoSsdPredict(image);
    completedSteps++;
    updateProgress(completedSteps);

    if (cocoResults.length > 0) {
      const classSet = new Set(cocoResults.map(result => result.class));
      upload.predictResult.objectArray = Array.from(classSet);
    }

    // Step 4: 风景识别
    upload.predictResult.landscape = await predictLandscape(image);
    completedSteps++;
    updateProgress(completedSteps);

    // 任务完成，确保进度条到达 100%
    percent = 100;
    file.onProgress({percent});

    setTimeout(() => {
      file.onSuccess();
    });
  } catch (error) {
    // 出现错误，直接设置进度为 100%，并调用错误回调
    percent = 100;
    file.onProgress({percent});
    file.onError(error);
  }
}


</script>
<style scoped lang="less">

</style>
