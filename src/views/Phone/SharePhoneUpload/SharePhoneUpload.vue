<template>
  <div class="share-upload-content">
    <AUploadDragger
        name="file"
        accept="image/*"
        :multiple="true"
        :directory="false"
        :maxCount="1"
        :beforeUpload="beforeUpload"
        :custom-request="customRequest"
        v-model:fileList="fileList"
        :loading="uploading"
        :showUploadList="false">
      <div class="share-upload-content-main">
        <ABadge :offset="[-10, 10]">
          <template #count>
            <AAvatar :size="25" :src="succeed" v-if="fileList.length > 0"/>
            <AAvatar :size="25" :src="warn" v-if="fileList.length === 0"/>
          </template>
          <AAvatar shape="square" :size="70" :src="file"/>
        </ABadge>
        <span class="share-upload-text">
            点击上传图片
            </span>
      </div>
    </AUploadDragger>
    <ADivider orientation="center" :plain="true">
      <span class="share-divider-title">图片预览</span>
    </ADivider>
    <div class="share-upload-image" v-if="fileList.length > 0">
      <ABadge>
        <template #count>
          <AButton type="text" size="small" class="share-file-btn" @click="fileList = []">
            <template #icon>
              <AAvatar shape="square" :size="25" :src="remove"/>
            </template>
          </AButton>
        </template>
        <AAvatar shape="square" :size="100">
          <template #icon>
            <AImage :src="convertFileToUrl(fileList?.[0].originFileObj)" width="100%" height="100%"/>
          </template>
        </AAvatar>
      </ABadge>
    </div>
    <AEmpty v-else :image="empty" :description="null"/>
    <ADivider/>
    <div>
      <AButton type="primary" size="large" :disabled="fileList.length === 0" :loading="uploading"
               class="share-upload-btn" @click="sendImage()">
        发送图片
      </AButton>
    </div>
    <ADivider/>
  </div>
</template>
<script setup lang="ts">
import file from "@/assets/svgs/file.svg";
import succeed from '@/assets/svgs/success.svg';
import warn from '@/assets/svgs/warn.svg';
import remove from '@/assets/svgs/remove.svg';
import empty from '@/assets/svgs/empty.svg';
import {message} from "ant-design-vue";
import i18n from "@/locales";
import {initNSFWJs, predictNSFW} from "@/utils/tfjs/nsfw.ts";
import {NSFWJS} from "nsfwjs";
import {sharePhoneUploadApi} from "@/api/phone";
import {useI18n} from "vue-i18n";
import {fileToBase64} from "@/utils/imageUtils/fileToBase64.ts";


const route = useRoute();


const fileList = ref<any[]>([]);

const {t} = useI18n();

const uploading = ref(false);

async function sendImage() {
  if (fileList.value.length === 0) {
    return;
  }
  const base64 = await fileToBase64(fileList.value?.[0].originFileObj);
  const data: any = {
    origin_file_obj: base64,
    name: fileList.value?.[0].name,
    size: fileList.value?.[0].size,
    access_token: route.query.token as string,
    user_id: route.query.user_id as string,
    type: fileList.value?.[0].type,
  };
  const res: any = await sharePhoneUploadApi(data);
  if (res && res && res.code === 200) {
    message.success(t('upload.uploadSuccess'));
    fileList.value = [];
  } else {
    message.error(res.message);
  }
}

/**
 * 上传文件前置
 * @param file
 */
async function beforeUpload(file: any) {
  if (!window.FileReader) return false; // 判断是否支持FileReader
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
        return false;
      }
    };
  };
  return true;
}

function customRequest() {
  return;
}


/**
 *  转换文件为 URL
 * @param file
 */
function convertFileToUrl(file: any) {
  return URL.createObjectURL(file);
}

</script>
<style scoped lang="scss">
.share-upload-content {
  width: 90%;
  height: 40vh;
  padding: 15px;
  margin: 0 auto;

  .share-upload-content-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    overflow: scroll;


    .share-upload-text {
      font-size: 20px;
      font-weight: bold;
    }

    .share-upload-btn {
      width: 60%;
    }

    .share-upload-tip {
      font-size: 12px;
      color: rgba(126, 126, 135, 0.99);
    }
  }

  .share-divider-title {
    font-size: 13px;
    color: rgba(126, 126, 135, 0.99);
  }

  .share-upload-image {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .share-upload-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}
</style>
