<template>
  <div class="upload-setting">
    <div class="upload-setting-item">
      <AFlex :vertical="false" align="center" justify="flex-start" gap="middle">
        <AAvatar size="default" shape="square" :src="nsfw"/>
        <span class="upload-setting-item-name">违规图片检测</span>
      </AFlex>
      <ASwitch v-model:checked="uploadStore.uploadSetting.nsfw_detection">
        <template #checkedChildren>
          <check-outlined/>
        </template>
        <template #unCheckedChildren>
          <close-outlined/>
        </template>
      </ASwitch>
    </div>
    <div class="upload-setting-item">
      <AFlex :vertical="false" align="center" justify="flex-start" gap="middle">
        <AAvatar size="default" shape="square" :src="anime"/>
        <span class="upload-setting-item-name">动漫图片识别</span>
      </AFlex>
      <ASwitch v-model:checked="uploadStore.uploadSetting.anime_detection">
        <template #checkedChildren>
          <check-outlined/>
        </template>
        <template #unCheckedChildren>
          <close-outlined/>
        </template>
      </ASwitch>
    </div>

    <div class="upload-setting-item">
      <AFlex :vertical="false" align="center" justify="flex-start" gap="middle">
        <AAvatar size="default" shape="square" :src="landscape"/>
        <span class="upload-setting-item-name">图片风景检测</span>
      </AFlex>
      <ASwitch v-model:checked="uploadStore.uploadSetting.landscape_detection">
        <template #checkedChildren>
          <check-outlined/>
        </template>
        <template #unCheckedChildren>
          <close-outlined/>
        </template>
      </ASwitch>
    </div>
    <div class="upload-setting-item">
      <AFlex :vertical="false" align="center" justify="flex-start" gap="middle">
        <AAvatar size="default" shape="square" :src="screenshot"/>
        <span class="upload-setting-item-name">屏幕截图检测</span>
      </AFlex>
      <ASwitch v-model:checked="uploadStore.uploadSetting.screenshot_detection">
        <template #checkedChildren>
          <check-outlined/>
        </template>
        <template #unCheckedChildren>
          <close-outlined/>
        </template>
      </ASwitch>
    </div>
    <div class="upload-setting-item">
      <AFlex :vertical="false" align="center" justify="flex-start" gap="middle">
        <AAvatar size="default" shape="square" :src="gps"/>
        <span class="upload-setting-item-name">地理位置检测</span>
      </AFlex>
      <ASwitch v-model:checked="uploadStore.uploadSetting.gps_detection">
        <template #checkedChildren>
          <check-outlined/>
        </template>
        <template #unCheckedChildren>
          <close-outlined/>
        </template>
      </ASwitch>
    </div>
    <div class="upload-setting-item">
      <AFlex :vertical="false" align="center" justify="flex-start" gap="middle">
        <AAvatar size="default" shape="square" :src="target"/>
        <span class="upload-setting-item-name">图片内容识别</span>
      </AFlex>
      <ASwitch v-model:checked="uploadStore.uploadSetting.target_detection">
        <template #checkedChildren>
          <check-outlined/>
        </template>
        <template #unCheckedChildren>
          <close-outlined/>
        </template>
      </ASwitch>
    </div>
    <div class="upload-setting-item">
      <AFlex :vertical="false" align="center" justify="flex-start" gap="middle">
        <AAvatar size="default" shape="square" :src="qr"/>
        <span class="upload-setting-item-name">二维码检测</span>
      </AFlex>
      <ASwitch v-model:checked="uploadStore.uploadSetting.qrcode_detection">
        <template #checkedChildren>
          <check-outlined/>
        </template>
        <template #unCheckedChildren>
          <close-outlined/>
        </template>
      </ASwitch>
    </div>
    <div class="upload-setting-item">
      <AFlex :vertical="false" align="center" justify="flex-start" gap="middle">
        <AAvatar size="default" shape="square" :src="face_detection"/>
        <span class="upload-setting-item-name">人脸识别</span>
      </AFlex>
      <ASwitch v-model:checked="uploadStore.uploadSetting.face_detection">
        <template #checkedChildren>
          <check-outlined/>
        </template>
        <template #unCheckedChildren>
          <close-outlined/>
        </template>
      </ASwitch>
    </div>
    <div class="upload-setting-item">
      <AFlex :vertical="false" align="center" justify="flex-start" gap="middle">
        <AAvatar size="default" shape="square" :src="lock"/>
        <span class="upload-setting-item-name">图像加密</span>
      </AFlex>
      <ASwitch v-model:checked="uploadStore.uploadSetting.encrypt">
        <template #checkedChildren>
          <check-outlined/>
        </template>
        <template #unCheckedChildren>
          <close-outlined/>
        </template>
      </ASwitch>
    </div>
    <div class="upload-setting-item">
      <AFlex :vertical="false" align="center" justify="flex-start" gap="middle">
        <AAvatar size="default" shape="square" :src="blur"/>
        <span class="upload-setting-item-name">模糊检测</span>
      </AFlex>
      <ASwitch v-model:checked="uploadStore.uploadSetting.blur_detection">
        <template #checkedChildren>
          <check-outlined/>
        </template>
        <template #unCheckedChildren>
          <close-outlined/>
        </template>
      </ASwitch>
    </div>
  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
import nsfw from "@/assets/svgs/nsfw.svg";
import anime from "@/assets/svgs/anime.svg";
import landscape from "@/assets/svgs/landscape.svg";
import screenshot from "@/assets/svgs/screenshot.svg";
import gps from "@/assets/svgs/gps.svg";
import target from "@/assets/svgs/target.svg";
import qr from "@/assets/svgs/qr.svg";
import face_detection from "@/assets/svgs/face_detection.svg";
import lock from "@/assets/svgs/lock.svg";
import blur from "@/assets/svgs/blur.svg";
const uploadStore = useStore().upload;


</script>
<style scoped lang="scss">
.upload-setting {
  width: 200px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .upload-setting-item {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .upload-setting-item-name {
      font-size: 14px;
      color: #333;
      font-weight: bold;
    }
  }
}
</style>
