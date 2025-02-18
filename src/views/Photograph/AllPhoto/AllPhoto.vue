<template>
  <div class="all-photo">
    <div class="photo-header">
      <AButton type="primary" shape="round" size="middle" @click="upload.openUploadDrawerFn()">
        <template #icon>
          <PlusOutlined/>
        </template>
        上传照片
      </AButton>
      <AButton type="default" shape="round" size="middle">
        <template #icon>
          <PlusSquareOutlined/>
        </template>
        创建相册
      </AButton>
    </div>
    <image-toolbar :selected="selected"/>
    <div class="photo-list">
      <ATabs size="small" :tabBarGutter="50" type="line" tabPosition="top" :tabBarStyle="{position:'unset'}"
             style="width: 99%;">
        <template #rightExtra>
          <ASwitch size="small" v-model:checked="switchValue"/>
        </template>
        <ATabPane key="image" tab="全部">
          <div style="width:100%;height:100%;">
            <div v-for="(itemList, index) in images" :key="index">
              <span style="margin-left: 10px;font-size: 13px">{{ itemList.date }}</span>
              <AImagePreviewGroup>
                <Vue3JustifiedLayout v-model:list="itemList.list" :options="options" style="line-height: 0 !important;">
                  <template #default="{ item }">
                    <CheckCard :key="index"
                               class="photo-item"
                               margin="0"
                               border-radius="0"
                               v-model="selected"
                               :showHoverCircle="true"
                               :iconSize="20"
                               :showSelectedEffect="true"
                               :value="item.id">
                      <AImage :src="item.thumbnail"
                              :alt="item.file_name"
                              :key="index"
                              :height="200"
                              :preview="{
                                src: item.url,
                               }"
                              loading="lazy">
                        <template #previewMask>
                        </template>
                      </AImage>
                    </CheckCard>
                  </template>
                </Vue3JustifiedLayout>
              </AImagePreviewGroup>
            </div>
          </div>
        </ATabPane>
        <ATabPane key="video" tab="视频">
          <div style="width:100%;height:100%;">

          </div>
        </ATabPane>
        <ATabPane key="gif" tab="动图">

        </ATabPane>
        <ATabPane key="screenshot" tab="截图">

        </ATabPane>
      </ATabs>
    </div>
    <ImageUpload/>
  </div>
</template>

<script setup lang="ts">

import Vue3JustifiedLayout from "vue3-justified-layout";
import 'vue3-justified-layout/dist/style.css';
import ImageUpload from "@/views/Photograph/ImageUpload/ImageUpload.vue";
import useStore from "@/store";
import {queryAllImagesApi} from "@/api/storage";
import ImageToolbar from "@/views/Photograph/ImageToolbar/ImageToolbar.vue";


const selected = ref<(string | number)[]>([]);
const switchValue = ref<boolean>(false);
const upload = useStore().upload;

const options = reactive({
  targetRowHeight: 200 // 高度
});

const images = ref<any[]>([]);

/**
 * 获取所有图片
 */
async function getAllImages() {
  const res: any = await queryAllImagesApi("image", false, upload.storageSelected[0], upload.storageSelected[1]);
  if (res && res.code === 200) {
    images.value = res.data.records;
  }
}


onMounted(() => {
  getAllImages();
});
</script>
<style scoped lang="scss">
.all-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  position: relative;

  .photo-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

  }

  .photo-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: calc(100% - 65px);
  }
}

.photo-item:hover {
  transition: all 0.3s ease-in-out, transform 0.3s ease-in-out;
  //transform: scale(0.99);
  box-shadow: 0 0 10px 0 rgba(77, 167, 255, 0.89);
}
</style>
