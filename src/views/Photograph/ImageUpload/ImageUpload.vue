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
          @reject="rejectFile"
          :openFileDialogOnClick="true"
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
        <AProgress :stroke-color="{'0%': '#108ee9','100%': '#87d068',}" :percent="progressPercent"
                   :status="progressStatus"
                   :show-info="true" size="small" type="line" v-show="predicting" style="width: 80%"/>
      </AUploadDragger>
    </div>
  </ADrawer>
</template>
<script lang="ts" setup>
import useStore from "@/store";
import type {UploadProps} from 'ant-design-vue';
import {message} from "ant-design-vue";
import {initNSFWJs, predictNSFW} from "@/utils/tfjs/nsfw.ts";
import i18n from "@/locales";

import {NSFWJS} from "nsfwjs";
import {animePredictImagePro} from "@/utils/tfjs/anime_classifier_pro.ts";
import {cocoSsdPredict} from "@/utils/tfjs/mobilenet.ts";
import {predictLandscape} from "@/utils/tfjs/landscape_recognition.ts";
import {useRequest} from 'alova/client';
import {uploadFile} from "@/api/storage";
import imageCompression from "browser-image-compression";
import exifr from 'exifr';
import isScreenshot from "@/utils/imageUtils/isScreenshot.ts";
import {getCategoryByLabel} from "@/constant/coco_ssd_label_category.ts";
import {generateThumbnail} from "@/utils/imageUtils/generateThumb.ts";

const predicting = ref<boolean>(false);
const progressPercent = ref<number>(0);
const progressStatus = ref<string>('active');

// 压缩图片配置
const options = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 750,
  maxIteration: 2,
  useWebWorker: true,
};

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
 * @param fileList
 */
async function beforeUpload(file: File, fileList: File[]) {
  predicting.value = true;
  upload.clearPredictResult();
  progressPercent.value = 0; // 初始化进度条
  progressStatus.value = 'active'; // 开始状态
  // 压缩图片
  const compressedFile = await imageCompression(file, options);
  // 创建图片对象
  image.src = URL.createObjectURL(compressedFile);
  // 获取图片宽高
  image.onload = () => {
    const {width, height} = image;
    upload.predictResult.width = width;
    upload.predictResult.height = height;
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
    // NSFW 检测
    const nsfw: NSFWJS = await initNSFWJs();
    await smoothUpdateProgress(30, 500); // 平滑更新进度条

    const isNSFW: boolean = await predictNSFW(nsfw, image);
    await smoothUpdateProgress(50, 500); // 平滑更新进度条

    if (isNSFW) {
      message.error(i18n.global.t('comment.illegalImage'));

      progressPercent.value = 100; // 重置进度条
      progressStatus.value = 'exception'; // 异常状态
      fileList.pop(); // 清空文件列表
      predicting.value = false;
      return false;
    }

    // 提取 EXIF 数据
    const gpsData: any = await extractGPSExifData(file);
    if (gpsData) {
      upload.predictResult.longitude = gpsData.longitude;
      upload.predictResult.latitude = gpsData.latitude;
    }

    // 判断是否为截图
    upload.predictResult.isScreenshot = await isScreenshot(file);

    // 动漫类型识别
    const prediction: string = await animePredictImagePro(image);
    await smoothUpdateProgress(70, 500); // 平滑更新进度条

    // 如果是动漫类型，直接返回
    if ((prediction === 'Furry' || prediction === 'Anime')) {
      upload.predictResult.isAnime = true;
      predicting.value = false;
      progressPercent.value = 100; // 直接完成
      return true;
    }

    //目标检测和风景检测并行处理
    const [cocoResults, landscape] = await Promise.all([
      cocoSsdPredict(image), // 目标检测
      predictLandscape(image), // 风景检测
    ]);
    await smoothUpdateProgress(100, 500); // 平滑更新进度条

    if (cocoResults.length > 0) {
      // 取置信度最高的结果
      // 如果只有一个结果，直接取第一个
      if (cocoResults.length === 1) {
        upload.predictResult.topCategory = getCategoryByLabel(cocoResults[0].class);
        upload.predictResult.tagName = cocoResults[0].class;
      } else {
        // 多个结果时，按 score 排序，取置信度最高的结果
        const sortedResults = cocoResults.sort((a, b) => b.score - a.score);
        upload.predictResult.topCategory = getCategoryByLabel(sortedResults[0].class);
        upload.predictResult.tagName = sortedResults[0].class;
      }
    }
    upload.predictResult.landscape = landscape as 'building' | 'forest' | 'glacier' | 'mountain' | 'sea' | 'street' | null;

    predicting.value = false;
    return true;

  } catch (error) {
    console.error('识别过程中发生错误:', error);
    predicting.value = false;
    progressPercent.value = 0; // 重置进度条
    return false;
  }
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
  const compressedFile = await imageCompression(file.file, options);
  // 生成缩略图
  const {binaryData, width, height, size} = await generateThumbnail(compressedFile);
  upload.predictResult.thumb_w = width;
  upload.predictResult.thumb_h = height;
  upload.predictResult.thumb_size = size;

  const formData = new FormData();
  formData.append("file", file.file);
  if (binaryData) {
    formData.append("thumbnail", binaryData);
  }
  formData.append("data", JSON.stringify({
    provider: upload.storageSelected[0],
    bucket: upload.storageSelected[1],
    fileType: file.file.type,
    ...upload.predictResult,
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
    if (response && response.code === 200) {
      file.onSuccess(response.data, file);
    } else {
      file.onError(response.data, file);
    }
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


/**
 * 提取 EXIF 数据
 * @param {File} file - 图片文件
 * @returns {Promise<Object|null>} - 返回所有 EXIF 数据或 null（如果格式不支持或提取失败）
 */
async function extractGPSExifData(file) {
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

</script>
<style lang="less" scoped>

</style>
