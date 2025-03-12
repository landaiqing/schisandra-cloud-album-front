<template>
  <ADrawer v-model:open="upload.openUploadDrawer" placement="right" title="上传照片" width="40%" @close="cancelUpload">
    <template #extra>
      <AFlex :vertical="false" align="center" gap="large" justify="center">

        <ATooltip title="手机扫码上传">
          <AButton type="text" shape="default" size="middle" @click="initWebSocket">
            <template #icon>
              <APopover placement="bottom" trigger="click">
                <AAvatar size="small" shape="square" :src="qr"/>
                <template #content>
                  <AQrcode :bordered="false" color="rgba(126, 126, 135, 0.48)"
                           :size="qrcodeSize"
                           :value="generateQrCodeUrl()"
                           :icon="phone"
                           :iconSize="iconSize"
                           :status="qrStatus"
                           @refresh="initWebSocket"
                  />
                </template>
              </APopover>
            </template>
          </AButton>
        </ATooltip>

        <AButton type="text" shape="circle" size="middle">
          <template #icon>
            <APopover placement="bottom" trigger="click">
              <template #content>
                <UploadSetting/>
              </template>
              <AAvatar size="small" shape="circle" :src="setting"/>
            </APopover>
          </template>
        </AButton>
        <ASelect size="middle" style="width: 150px" placeholder="选择上传的相册"
                 :options="albumList"
                 v-model:value="upload.albumSelected"
                 :allow-clear="true"
                 :field-names="{label: 'name', value: 'id'}"
        >
        </ASelect>
      </AFlex>
    </template>
    <div class="upload-container">
      <AUploadDragger
          v-model:fileList="upload.fileList"
          :beforeUpload="upload.beforeUploadWithWebWorker"
          :customRequest="customUploadRequest"
          :directory="false"
          :maxCount="10"
          :multiple="true"
          :disabled="upload.predicting"
          :progress="upload.progress"
          @remove="upload.removeFile"
          @reject="upload.rejectFile"
          :openFileDialogOnClick="true"
          accept="image/*,video/*"
          list-type="picture"
          method="post"
          name="file"
      >
        <p class="ant-upload-drag-icon">
          <FileImageOutlined/>
        </p>
        <p v-show="!upload.predicting" class="ant-upload-text">单击或拖动文件到此区域以上传</p>
        <p v-show="!upload.predicting" class="ant-upload-hint">
          支持单次或批量上传，严禁上传非法图片，违者将受到法律惩戒。
        </p>
        <p v-show="upload.predicting" class="ant-upload-hint">
          AI 正在识别图片，请稍候...
        </p>
        <AProgress :stroke-color="{'0%': '#108ee9','100%': '#87d068',}" :percent="upload.progressPercent"
                   :status="upload.progressStatus"
                   :show-info="true" size="small" type="line" v-show="upload.predicting" style="width: 80%"/>
      </AUploadDragger>
      <AEmpty :image="empty" v-if="upload.fileList.length === 0">
        <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  上传列表为空，可直接拖动文件到此区域上传。
                </span>
        </template>
      </AEmpty>
    </div>
  </ADrawer>
</template>
<script lang="ts" setup>
import useStore from "@/store";

import {useRequest} from 'alova/client';
import {albumListApi, uploadFile} from "@/api/storage";
import imageCompression from "browser-image-compression";

import {generateThumbnail} from "@/utils/imageUtils/generateThumb.ts";
import empty from "@/assets/svgs/empty.svg";
import setting from "@/assets/svgs/setting.svg";
import qr from "@/assets/svgs/qr.svg";
import phone from "@/assets/svgs/qr-phone.svg";
import UploadSetting from "@/components/ImageUpload/UploadSetting.vue";


const qrcodeSize = ref<number>(220);
const iconSize = ref<number>(30);
const user = useStore().user;
const websocket = useStore().websocket;
const wsOptions = {
  url: import.meta.env.VITE_FILE_SOCKET_URL + "?user_id=" + user.user.uid,
  protocols: [user.token.accessToken],
};

function generateQrCodeUrl(): string {
  console.log(import.meta.env.VITE_APP_WEB_URL + "/main/image/phone/app?user_id=" + user.user.uid + "&token=" + user.token.accessToken);
  return import.meta.env.VITE_APP_WEB_URL + "/main/image/phone/app?user_id=" + user.user.uid + "&token=" + user.token.accessToken;
}

const qrStatus = ref<string>('loading');
watch(
    () => websocket.readyState,
    (newStatus) => {
      if (newStatus === WebSocket.OPEN) {
        qrStatus.value = 'active';
      } else {
        qrStatus.value = 'expired';
      }
    }
);

/**
 *  初始化 WebSocket
 */
function initWebSocket() {
  websocket.initialize(wsOptions);
  websocket.on("message", async (res: any) => {
    if (res && res.code === 200) {
      const {data} = res;
      console.log(data);
    }
  });
}


const upload = useStore().upload;


const {uploading, send: submitFile, abort} = useRequest(uploadFile, {
  immediate: false,
  debounce: 500,
});

/**
 * 自定义上传请求
 * @param file
 */
async function customUploadRequest(file: any) {
  const compressedFile = await imageCompression(file.file, upload.options);
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
    provider: upload.storageSelected?.[0],
    bucket: upload.storageSelected?.[1],
    fileType: file.file.type,
    albumId: upload.albumSelected ? upload.albumSelected : 0,
    ...upload.predictResult,
  }));
  formData.append("setting", JSON.stringify({
    ...upload.uploadSetting,
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
  upload.fileList = [];
  upload.clearPredictResult();
  upload.predicting = false;
  upload.progressPercent = 0; // 重置进度条
}


const albumList = ref<any[]>([]);

async function getAlbumList(type: number = 0, sort: boolean = true) {
  const res: any = await albumListApi(type, sort);
  if (res && res.code === 200) {
    albumList.value = res.data.albums;
  }
}

onMounted(() => {
  getAlbumList();
});
</script>
<style lang="less" scoped>

</style>
