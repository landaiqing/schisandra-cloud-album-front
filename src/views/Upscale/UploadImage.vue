<template>
  <div class="upscale-upload-container">
    <div class="upscale-upload-content">
      <Spin :spinning="upscale.uploading" indicator="magic-ring">
        <AUploadDragger
            name="image"
            accept="image/*"
            :multiple="false"
            :directory="false"
            :maxCount="5"
            :beforeUpload="upscale.beforeUpload"
            :custom-request="upscale.customUploadRequest"
            :disabled="upscale.uploading"
            :showUploadList="false">
          <div class="upscale-upload-content-main">
            <div class="upscale-upload-content-left">
              <ABadge :count="upscale.imageList.length" :offset="[-10, 10]">
                <AAvatar shape="square" :size="70" :src="file"/>
              </ABadge>
              <span class="upscale-upload-text">
            点击或拖拽上传图片
            </span>
              <span class="upscale-upload-tip">最多一次处理5张图片</span>
            </div>
            <div class="upscale-upload-content-right" ref="qrcodeContainer">
              <AQrcode :value="'https://www.baidu.com'"
                       class="upscale-upload-qrcode"
                       :icon="qrphone"
                       :iconSize="iconSize"
                       :bordered="false"
                       :size="qrcodeSize"
                       color="rgba(126, 126, 135, 1)"/>
              <span class="upscale-upload-qr-text">手机扫码上传</span>
            </div>
          </div>
        </AUploadDragger>
      </Spin>
    </div>
  </div>

  <ADivider orientation="center" :plain="true"><span class="upscale-file-list-title">图片列表</span></ADivider>
  <div class="upscale-file-list" ref="fileListContainer">
    <div v-if="upscale.imageList.length > 0">
      <AImagePreviewGroup>
        <ABadge style="margin-left: 10px;" v-for="(item, index) in upscale.imageList"
                :key="index">
          <template #count>
            <AButton type="text" size="small" class="upscale-file-btn" @click="upscale.removeImage(index)">
              <template #icon>
                <AAvatar shape="square" :size="20" :src="remove"/>
              </template>
            </AButton>
          </template>
          <AAvatar shape="square" :size="avatarSize" v-if="item">
            <template #icon>
              <AImage :src="item" width="100%" height="100%"/>
            </template>
          </AAvatar>
        </ABadge>
      </AImagePreviewGroup>
    </div>
  </div>
  <AEmpty :image="empty" v-if="upscale.imageList.length === 0" :description="null"/>
</template>
<script setup lang="ts">
import file from "@/assets/svgs/file.svg";
import qrphone from "@/assets/svgs/qr-phone.svg";
import empty from "@/assets/svgs/empty.svg";
import useStore from "@/store";
import Spin from "@/components/MyUI/Spin/Spin.vue";
import remove from '@/assets/svgs/remove.svg';

const upscale = useStore().upscale;
const qrcodeSize = ref<number>(160);
const iconSize = ref<number>(30);
const qrcodeContainer = ref<HTMLElement | null>(null);
const avatarSize = ref<number>(80);
const fileListContainer = ref<HTMLDivElement | null>(null);

/**
 * 更新大小
 */
const updateSize = () => {
  if (qrcodeContainer.value && fileListContainer.value) {
    // 设置 QRCode 大小
    const containerWidth = qrcodeContainer.value.clientWidth;
    qrcodeSize.value = containerWidth * 0.5; // 设置 QRCode 为父盒子宽度的80%
    iconSize.value = Math.min(containerWidth * 0.1, 50); // 设置 icon 大小为父盒子宽度的10%

    // 设置图片列表大小
    const container = fileListContainer.value.clientWidth;
    avatarSize.value = Math.min(0.17 * container, 300); // 设置头像大小为容器宽度的10%，最大不超过100
  }
};

onMounted(() => {
  updateSize();
  window.addEventListener('resize', updateSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize);
});


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
      flex-direction: row;
      align-items: center;
      overflow: scroll;

      .upscale-upload-content-left {
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;

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

      .upscale-upload-content-right {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .upscale-upload-qr-text {
          font-size: 12px;
          color: rgba(126, 126, 135, 0.99);
        }

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
  .upscale-upload-content-right {
    display: none !important;
  }
}
</style>
