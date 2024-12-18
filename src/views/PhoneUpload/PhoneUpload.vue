<template>
  <div class="upscale-upload-content">
    <AUploadDragger
        name="image"
        accept="image/*"
        :multiple="false"
        :directory="false"
        :maxCount="1"
        :beforeUpload="upscale.beforeUpload"
        :custom-request="upscale.customUploadRequest"
        :disabled="upscale.uploading"
        :showUploadList="false">
      <div class="upscale-upload-content-main">
        <ABadge :offset="[-10, 10]">
          <template #count>
            <AAvatar :size="25" :src="sueccess" v-if="upscale.imageData"/>
            <AAvatar :size="25" :src="warn" v-if="!upscale.imageData"/>
          </template>
          <AAvatar shape="square" :size="70" :src="file"/>
        </ABadge>
        <span class="upscale-upload-text">
            点击上传图片
            </span>
      </div>
    </AUploadDragger>
    <ADivider orientation="center" :plain="true">
      <span class="upscale-divider-title">图片预览</span>
    </ADivider>
    <div class="upscale-upload-image" v-if="upscale.imageData">
      <ABadge>
        <template #count>
          <AButton type="text" size="small" class="upscale-file-btn" @click="upscale.imageData = ''">
            <template #icon>
              <AAvatar shape="square" :size="25" :src="remove"/>
            </template>
          </AButton>
        </template>
        <AAvatar shape="square" :size="100">
          <template #icon>
            <AImage :src="upscale.imageData" width="100%" height="100%"/>
          </template>
        </AAvatar>
      </ABadge>
    </div>
    <AEmpty v-else :image="empty" :description="null"/>
    <ADivider/>
    <div>
      <AButton type="primary" size="large" :disabled="!upscale.imageData" :loading="upscale.uploading"
               @click="sendImage()"
               class="upscale-upload-btn">
        发送图片
      </AButton>
    </div>
    <ADivider/>
  </div>
</template>
<script setup lang="ts">
import file from "@/assets/svgs/file.svg";
import useStore from "@/store";
import sueccess from '@/assets/svgs/success.svg';
import warn from '@/assets/svgs/warn.svg';
import remove from '@/assets/svgs/remove.svg';
import empty from '@/assets/svgs/empty.svg';
import {blobToBase64} from "@/utils/imageUtils/blobToBase64.ts";
import {uploadImage} from "@/api/upscale";
import {uploadImageRequest} from "@/types/upscale";
import {message} from "ant-design-vue";
import {useI18n} from "vue-i18n";

const upscale = useStore().upscale;

const route = useRoute();

const {t} = useI18n();

async function sendImage() {
  if (!upscale.imageData) {
    return;
  }
  const base64 = await blobToBase64(upscale.imageData);
  const data: uploadImageRequest = {
    image: base64,
    access_token: route.query.token as string,
    user_id: route.query.user_id as string,
  };
  const res: any = await uploadImage(data);
  if (res && res && res.code === 200) {
    message.success(t('upload.uploadSuccess'));
  } else {
    message.error(res.message);
  }
}

</script>
<style scoped lang="scss">
.upscale-upload-content {
  width: 90%;
  height: 40vh;
  padding: 15px;
  margin: 0 auto;

  .upscale-upload-content-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    overflow: scroll;


    .upscale-upload-text {
      font-size: 20px;
      font-weight: bold;
    }

    .upscale-upload-btn {
      width: 60%;
    }

    .upscale-upload-tip {
      font-size: 12px;
      color: rgba(126, 126, 135, 0.99);
    }
  }

  .upscale-divider-title {
    font-size: 13px;
    color: rgba(126, 126, 135, 0.99);
  }

  .upscale-upload-image {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upscale-upload-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}
</style>
