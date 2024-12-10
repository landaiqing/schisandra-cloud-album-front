<template>
  <div class="upscale-comparison-result">
    <div class="upscale-comparison-top">
      <div class="upscale-comparison-top-left">

        <VueCompareImage :left-image="bg" :right-image="bg2"
                         style="width: 45vw; height: 60vh;border-radius: 10px;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);"
                         rightImageLabel="修复后"
                         leftImageLabel="原图"
        />

      </div>
      <div class="upscale-comparison-top-right" ref="avatarContainer">
        <ABadge style="margin-top: 5px;" v-for="(item, index) in upscale.imageList"
                :key="index">
          <template #count>
            <AButton type="text" size="small" class="upscale-file-btn" @click="upscale.removeImage(index)">
              <template #icon>
                <AAvatar shape="square" :size="20" :src="remove"/>
              </template>
            </AButton>
          </template>
          <AAvatar shape="square" :size="avatarSize" @click="bg = item">
            <template #icon>
              <AImage :src="item" width="100%" height="100%" :preview="true"/>
            </template>
          </AAvatar>
        </ABadge>
      </div>
    </div>
    <ADivider orientation="center" :plain="true"><span class="upscale-comparison-divider-text">保存下载</span>
    </ADivider>
    <div class="upscale-comparison-bottom">
      <AFlex :vertical="false" align="center" justify="space-between" gap="large">
        <AButton type="text" size="large" style="width: 50px; height: 50px;">
          <template #icon>
            <AAvatar shape="square" :size="40" :src="download"/>
          </template>
        </AButton>
        <AButton type="text" style="width: 50px; height: 50px;">
          <template #icon>
            <AAvatar shape="square" :size="40" :src="save"/>
          </template>
        </AButton>
        <AButton type="text" style="width: 50px; height: 50px;">
          <template #icon>
            <AAvatar shape="square" :size="35" :src="share"/>
          </template>
        </AButton>
        <AButton type="text" style="width: 50px; height: 50px;">
          <template #icon>
            <AAvatar shape="square" :size="35" :src="packageDownload"/>
          </template>
        </AButton>
      </AFlex>
      <ADivider type="vertical" style="height: 30px;"/>
      <AFlex :vertical="false" align="center" justify="space-between" gap="large" style="margin-left: 1%">
        <AFlex :vertical="true" align="flex-start" justify="flex-start" gap="small">
          <AFlex :vertical="false" align="center" justify="space-between">
            <span class="upscale-comparison-bottom-text">处理数量：</span>
            <ATag color="orange">{{ 5 }}</ATag>
          </AFlex>
          <AFlex :vertical="false" align="center" justify="space-between">
            <span class="upscale-comparison-bottom-text">处理大小：</span>
            <ATag color="green">{{ upscale.imageList.length }} /mb</ATag>

          </AFlex>
        </AFlex>
        <AFlex :vertical="true" align="flex-start" justify="center" gap="small">
          <AFlex :vertical="false" align="center" justify="space-between">
            <span class="upscale-comparison-bottom-text">消耗时间：</span>
            <ATag color="cyan">{{ upscale.imageList.length }} /s</ATag>
          </AFlex>
          <AFlex :vertical="false" align="center" justify="space-between">
            <span class="upscale-comparison-bottom-text">内存消耗：</span>
            <ATag color="purple">{{ upscale.imageList.length }} /mb</ATag>
          </AFlex>
        </AFlex>
      </AFlex>
    </div>
  </div>
</template>
<script setup lang="ts">

import {VueCompareImage} from "@/components/VueCompareImage";
import bg1 from "@/assets/images/background.jpg";
import bg2 from "@/assets/images/background.png";
import useStore from "@/store";
import remove from "@/assets/svgs/remove.svg";
import download from "@/assets/svgs/download.svg";
import save from "@/assets/svgs/save.svg";
import share from "@/assets/svgs/share.svg";
import packageDownload from "@/assets/svgs/package-download.svg";

const upscale = useStore().upscale;
const avatarSize = ref<number>(60);
const avatarContainer = ref<HTMLDivElement | null>();
const bg = ref<string>(bg1);


/**
 * 更新大小
 */
const updateSize = () => {
  if (avatarContainer.value) {
    // 设置图片列表大小
    const container = avatarContainer.value?.clientWidth || 0;
    avatarSize.value = Math.min(0.7 * container, 300); // 设置头像大小为容器宽度的10%，最大不超过100
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
.upscale-comparison-result {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .upscale-comparison-top {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;


    .upscale-comparison-top-left {
      width: 85%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .upscale-comparison-image {
        width: 40vw;
        height: 60vh;
      }
    }

    .upscale-comparison-top-right {
      width: 14%;
      height: 60vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      overflow-y: scroll;
      border: 1px solid rgba(126, 126, 135, 0.48);
      border-radius: 10px;
    }
  }

  .upscale-comparison-divider-text {
    font-size: 13px;
    color: rgba(126, 126, 135, 0.99);
  }

  .upscale-comparison-bottom {
    width: 100%;
    height: 20%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;

    .upscale-comparison-bottom-text {
      font-size: 13px;
      color: rgba(126, 126, 135, 0.99);
    }
  }
}
</style>
