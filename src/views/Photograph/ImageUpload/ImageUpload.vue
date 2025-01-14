<template>
  <ADrawer v-model:open="upload.openUploadDrawer" placement="right" title="上传照片" width="40%" @close="cancelUpload">
    <template #extra>
      <AFlex :vertical="false" align="center" gap="large" justify="center">
        <ASelect size="middle" style="width: 150px">

        </ASelect>
        <ASelect size="middle" style="width: 150px">

        </ASelect>
      </AFlex>
    </template>
    <div class="upload-container">
      <AUploadDragger
          v-model:fileList="fileList"
          :beforeUpload="beforeUpload"
          :customRequest="customUploadRequest"
          :directory="false"
          :maxCount="10"
          :multiple="true"
          :disabled="predicting"
          :progress="progress"
          @remove="removeFile"
          accept="image/*"
          list-type="picture"
          method="post"
          name="file"
      >
        <p class="ant-upload-drag-icon">
          <FileImageOutlined/>
        </p>
        <p v-show="!predicting" class="ant-upload-text">单击或拖动文件到此区域以上传</p>
        <p v-show="!predicting" class="ant-upload-hint">
          支持单次或批量上传，严禁上传非法图片，违者将受到法律惩戒。
        </p>
        <p v-show="predicting" class="ant-upload-hint">
          AI 正在识别图片，请稍候...
        </p>
        <AProgress :stroke-color="{'0%': '#108ee9','100%': '#87d068',}" :percent="progressPercent" status="active"
                   :show-info="true" size="small" type="line" v-show="predicting" style="width: 80%"/>
      </AUploadDragger>
    </div>
  </ADrawer>
</template>
<script lang="ts" setup>
import useStore from "@/store";
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
import {useRequest} from 'alova/client';
import {uploadFile} from "@/api/file";

const predicting = ref<boolean>(false);
const progressPercent = ref<number>(0);

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
  upload.clearPredictResult();
  progressPercent.value = 0; // 初始化进度条

  // 创建图片对象
  image.src = URL.createObjectURL(file);

  image.addEventListener('webglcontextlost', (_event) => {
    window.location.reload();
  });

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

  // 图片 NSFW 检测
  const nsfw: NSFWJS = await initNSFWJs();
  await smoothUpdateProgress(10, 500); // 平滑更新进度条

  const isNSFW: boolean = await predictNSFW(nsfw, image);
  await smoothUpdateProgress(20, 500); // 平滑更新进度条

  if (isNSFW) {
    message.error(i18n.global.t('comment.illegalImage'));
    predicting.value = false;
    progressPercent.value = 0; // 重置进度条
    return false;
  }

  // Step 1: 动漫预测
  const prediction1 = await animePredictImage(image);
  await smoothUpdateProgress(40, 500); // 平滑更新进度条

  const prediction2 = await animePredictImagePro(image);
  await smoothUpdateProgress(60, 500); // 平滑更新进度条

  upload.predictResult.isAnime = prediction1 === 'Anime' && (prediction2 === 'Furry' || prediction2 === 'Anime');

  // Step 2: 人脸检测
  const faceImageData = await fnDetectFace(image);
  await smoothUpdateProgress(80, 500); // 平滑更新进度条

  upload.predictResult.hasFace = !!faceImageData;

  // Step 3: 目标识别
  const cocoResults = await cocoSsdPredict(image);
  await smoothUpdateProgress(90, 500); // 平滑更新进度条

  if (cocoResults.length > 0) {
    const classSet = new Set(cocoResults.map(result => result.class));
    upload.predictResult.objectArray = Array.from(classSet);
  }

  // Step 4: 风景识别
  upload.predictResult.landscape = await predictLandscape(image);
  await smoothUpdateProgress(100, 500); // 平滑更新进度条

  // 完成
  predicting.value = false;
  image.removeEventListener('webglcontextlost', () => void 0);
  return true;
}

const {uploading, send: submitFile, abort} = useRequest(uploadFile, {
  immediate: false,
  debounce: 500,
});

/**
 * 自定义上传请求
 * @param file
 */
async function customUploadRequest(file: any) {

  const formData = new FormData();
  formData.append("file", file.file);
  formData.append("result", JSON.stringify({
    uid: file.file.uid,
    fileName: file.file.name, // 添加文件名
    fileType: file.file.type, // 添加文件类型
    detectionResult: upload.predictResult,
  }));
  watch(
      () => uploading.value,
      (upload) => {
        if (upload && upload.loaded && upload.total) {
          file.onProgress({percent: Number(Math.round((upload.loaded / upload.total) * 100).toFixed(2))}, file);
        }
      },
  );
  submitFile(formData).then((response: any) => {
    file.onSuccess(response.data, file);
  }).catch(file.onError);
}

/**
 * 取消上传
 */
function cancelUpload() {
  abort();
  fileList.value = [];
  upload.clearPredictResult();
  predicting.value = false;
  progressPercent.value = 0; // 重置进度条
}

/**
 *  删除文件
 * @param file
 */
function removeFile(file: any) {
  fileList.value = fileList.value.filter((item: any) => item.uid !== file.uid);
}

</script>
<style lang="less" scoped>

</style>
