<template>
  <div class="recent-upload">
    <div class="photo-header">
      <AButton type="primary" shape="round" size="middle" @click="upload.openUploadDrawerFn()">
        <template #icon>
          <PlusOutlined/>
        </template>
        上传照片
      </AButton>
      <APopover placement="right" trigger="click">
        <AButton type="default" shape="round" size="middle">
          <template #icon>
            <PlusSquareOutlined/>
          </template>
          创建相册
        </AButton>

        <template #content>
          <span style="color: #999; font-size: 15px;">创建相册</span>
          <AInput placeholder="请填写相册名称" class="phoalbum-create-input"
                  style="margin-top: 15px"
                  v-model:value="albumNameValue" size="large">
            <template #suffix>
              <AButton type="text" @click.prevent size="middle" style="color: #0e87cc" @click="createAlbumSubmit">
                确认
              </AButton>
            </template>
          </AInput>
        </template>
      </APopover>
    </div>
    <image-toolbar :selected="imageStore.selected" :image-list="images"/>
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
                           v-model="imageStore.selected"
                           :showHoverCircle="true"
                           :iconSize="20"
                           :showSelectedEffect="true"
                           :value="item.id">
                  <AImage :src="item.thumbnail"
                          :alt="item.file_name"
                          :key="index"
                          style="height: 200px"
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
      <div v-else class="empty-content">
        <AEmpty :image="empty" :image-style="{
                   height: '100%',
                   width: '100%',
                 }">
          <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  暂无照片，快去上传吧
                </span>
          </template>
        </AEmpty>
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
import {createAlbumApi, queryRecentImagesApi} from "@/api/storage";
import ImageToolbar from "@/views/Photograph/ImageToolbar/ImageToolbar.vue";
import empty from "@/assets/svgs/empty.svg";
import {message} from "ant-design-vue";
import router from "@/router/router.ts";

const imageStore = useStore().image;
const upload = useStore().upload;
const images = ref<any[]>([]);
const options = reactive({
  targetRowHeight: 200 // 高度
});

const getRecentImages = async () => {
  const res: any = await queryRecentImagesApi(upload.storageSelected?.[0], upload.storageSelected?.[1]);
  if (res && res.code === 200) {
    images.value = res.data.records;
  }
};

const albumNameValue = ref<string>("未命名相册");

/**
 * 创建相册
 */
async function createAlbumSubmit() {
  if (albumNameValue.value.trim() === "") {
    message.error("相册名称不能为空");
    return;
  }
  const res: any = await createAlbumApi(albumNameValue.value);
  if (res && res.code === 200) {
    router.push({
      path: "/main/album/albums/" + `${res.data.id}`,
      query: {name: albumNameValue.value}
    });
  } else {
    message.error("创建相册失败");
  }
}

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
