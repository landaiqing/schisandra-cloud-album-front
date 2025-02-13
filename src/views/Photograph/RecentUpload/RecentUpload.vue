<template>
  <div class="recent-upload">
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
    <image-toolbar :selected="selected" />
    <div class="photo-list">
      <div style="width:100%;height:100%;" v-if="images.length !== 0">
        <div v-for="(itemList, index) in images" :key="index">
          <span style="margin-left: 10px;font-size: 13px">{{ itemList.date }}</span>
          <AImagePreviewGroup>
            <Vue3JustifiedLayout v-model:list="itemList.list" :options="options">
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
                  <AImage :src="item.url"
                          :alt="item.file_name"
                          :key="index"
                          style="height: 200px"
                          :previewMask="false"
                          loading="lazy"/>
                </CheckCard>
              </template>
            </Vue3JustifiedLayout>
          </AImagePreviewGroup>
        </div>
      </div>
    </div>
    <ImageUpload/>
  </div>
</template>
<script setup lang="ts">

import Vue3JustifiedLayout from "vue3-justified-layout";
import 'vue3-justified-layout/dist/style.css';
import useStore from "@/store";
import ImageUpload from "@/views/Photograph/ImageUpload/ImageUpload.vue";
import {queryRecentImagesApi} from "@/api/storage";
import ImageToolbar from "@/views/Photograph/ImageToolbar/ImageToolbar.vue";

const selected = ref<(string | number)[]>([]);
const upload = useStore().upload;
const images = ref<any[]>([]);
const options = reactive({
  targetRowHeight: 200 // 高度
});

const getRecentImages = async () => {
  const res: any = await queryRecentImagesApi();
  console.log(res);
  if (res && res.code === 200) {
    images.value = res.data.records;
  }
};

onMounted(() => {
  getRecentImages();
});

</script>
<style scoped lang="scss">
.recent-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;

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
    margin-top: 10px;
  }
}
</style>
