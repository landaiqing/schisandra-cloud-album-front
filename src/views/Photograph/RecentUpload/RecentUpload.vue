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
    <image-toolbar :selected="imageStore.selected" :image-list="imageList"/>
    <div class="photo-list">
      <div class="photo-list-container">
        <ImageWaterfallList :image-list="imageList"/>
      </div>
    </div>
    <ImageUpload/>
  </div>
</template>
<script setup lang="ts">

import useStore from "@/store";
import ImageUpload from "@/components/ImageUpload/ImageUpload.vue";
import {createAlbumApi, queryRecentImagesApi} from "@/api/storage";
import ImageToolbar from "@/components/ImageToolbar/ImageToolbar.vue";

import {message} from "ant-design-vue";
import router from "@/router/router.ts";
import ImageWaterfallList from "@/components/ImageWaterfallList/ImageWaterfallList.vue";

const imageStore = useStore().image;
const upload = useStore().upload;
const imageList = ref<any[]>([]);


const getRecentImages = async () => {
  imageStore.imageListLoading = true;
  const res: any = await queryRecentImagesApi(upload.storageSelected?.[0], upload.storageSelected?.[1]);
  if (res && res.code === 200) {
    imageList.value = res.data.records;
  }
  imageStore.imageListLoading = false;
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
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: calc(100% - 65px);
    margin-top: 10px;
    .photo-list-container {
       width: 100%;
       height: 100%;
       display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;

    }
  }
}
</style>
