<template>
  <div class="common-phone-upload">
    <div class="upload-controller">
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
      <ASelect size="middle" style="width: 150px" placeholder="选择相册"
               :options="albumList"
               v-model:value="upload.albumSelected"
               :allow-clear="true"
               :field-names="{label: 'name', value: 'id'}"
      >
      </ASelect>
    </div>
    <div class="upload-content">
      <div class="upload">
        <AUploadDragger
            v-model:fileList="upload.fileList"
            :beforeUpload="upload.beforeUpload"
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

      <AEmpty :image="empty" v-if="fileList.length === 0">
        <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  上传列表为空，点击或直接拖动文件到此区域上传。
                </span>
        </template>
      </AEmpty>
    </div>
  </div>
</template>
<script setup lang="ts">
import setting from "@/assets/svgs/setting.svg";
import {albumListApi, uploadFile} from "@/api/storage";
import useStore from "@/store";
import empty from "@/assets/svgs/empty.svg";
import {useRequest} from "alova/client";
import imageCompression from "browser-image-compression";
import {generateThumbnail} from "@/utils/imageUtils/generateThumb.ts";
import UploadSetting from "@/components/ImageUpload/UploadSetting.vue";

// const route = useRoute();

const fileList = ref([]);
const predicting = ref<boolean>(false);
const progressPercent = ref<number>(0);
const progressStatus = ref<string>('active');

// const accessToken = computed(() => {
//   const token = route.query.token;
//   return Array.isArray(token) ? token[0] : token;
// });
// const userId = computed(() => {
//   const uid = route.query.user_id;
//   return Array.isArray(uid) ? uid[0] : uid;
// });


const upload = useStore().upload;
const albumList = ref<any[]>([]);
/**
 * 获取相册列表
 */
const {send: getAlbumList} = useRequest(albumListApi, {
  immediate: false,
  debounce: 500,
}).onSuccess((res: any) => {
  if (res && res.code === 200) {
    albumList.value = res.data.albums;
  }
});

const {uploading, send: submitFile} = useRequest(uploadFile, {
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


onMounted(() => {
  getAlbumList(0, true);
});


</script>
<style scoped lang="scss">
.common-phone-upload {
  width: 90%;
  height: 95vh;
  padding: 15px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;

  .upload-controller {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
  }

  .upload-content {
    width: 100%;
    height: calc(95vh - 60px);

    .upload {
      width: 100%;
      height: 30vh;
    }
  }
}
</style>
