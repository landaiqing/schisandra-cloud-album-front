<template>
  <div class="upscale-upload-container" ref="containerRef">
    <div class="upscale-upload-content" ref="uploadDraggerRef">
      <Spin :spinning="upscale.uploading" indicator="magic-ring">
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
            点击或拖拽上传图片
            </span>
          </div>
        </AUploadDragger>
      </Spin>
    </div>
  </div>
</template>
<script setup lang="ts">
import file from "@/assets/svgs/file.svg";
import useStore from "@/store";
import Spin from "@/components/MyUI/Spin/Spin.vue";
import sueccess from '@/assets/svgs/success.svg';
import warn from '@/assets/svgs/warn.svg';

const upscale = useStore().upscale;

const uploadDraggerRef = ref<HTMLDivElement | null>(null);




</script>
<style scoped lang="scss">
.upscale-upload-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;


  .upscale-upload-content {
    width: 100%;
    height: 30vh;

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
  }
}

.upscale-file-list-title {
  font-size: 13px;
  color: rgba(126, 126, 135, 0.99);
}

.upscale-file-list {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.upscale-file-remove-icon {
  cursor: pointer;
  font-size: 18px;
  color: #ff0000;
  //transform: scale(1.2);
}

@media (max-width: 1300px) {
  .upscale-upload-text {
    display: none !important;
  }
  .upscale-upload-btn {
    display: none !important;
  }
  .upscale-upload-qr-text {
    display: none !important;
  }
  .upscale-upload-content-left {
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
  }
}
</style>
