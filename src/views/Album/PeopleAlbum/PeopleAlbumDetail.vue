<template>
  <div class="people-album-detail">
    <div class="people-album-detail-header">
      <div class="people-album-detail-nav">
        <AButton type="text" size="large" class="people-album-detail-nav-button" @click="goBack">
          <template #icon>
            <LeftOutlined style="font-size: 13px;font-weight: bolder"/>
          </template>
          返回
        </AButton>
      </div>
      <div class="people-album-detail-toolbar">
        <AAvatar shape="circle" size="default" :src="route.query.thumb"></AAvatar>
        <span style="font-size: 14px;color: #333333">{{ route.query.name }}</span>
      </div>
    </div>
    <ImageToolbar :selected="imageStore.selected" :imageList="imageList"/>
    <div class="people-album-detail-info">
      <span style="font-size: 14px;color: #999999">共{{ imageStore.countTotalImages(imageList) }}张照片</span>
    </div>
    <div class="people-album-detail-list">
      <ImageWaterfallList :image-list="imageList"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {getFaceSamplesDetailList} from "@/api/storage";
import ImageToolbar from "@/components/ImageToolbar/ImageToolbar.vue";
import useStore from "@/store";

import ImageWaterfallList from "@/components/ImageWaterfallList/ImageWaterfallList.vue";


const imageStore = useStore().image;
const imageList = ref<any[]>([]);

const route = useRoute();
const router = useRouter();
const upload = useStore().upload;

async function getAlbumList(id: number) {
  imageStore.imageListLoading = true;
  const res: any = await getFaceSamplesDetailList(id, upload.storageSelected?.[0], upload.storageSelected?.[1]);
  if (res && res.code === 200) {
    imageList.value = res.data.records;
  }
  imageStore.imageListLoading = false;
}

onMounted(() => {
  const idParam = route.params.id;
  const albumId = Array.isArray(idParam) ? idParam[0] : idParam;
  getAlbumList(parseInt(albumId, 10));
});

/**
 * 返回上一页
 */
function goBack(): void {
  router.go(-1);
}
</script>
<style scoped lang="scss">
.people-album-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  gap: 10px;
  position: relative;

  .people-album-detail-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .people-album-detail-nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      width: 8%;
      height: 100%;

      .people-album-detail-nav-button {
        font-size: 20px;
        color: rgb(59, 117, 255);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 8px;
      }
    }

    .people-album-detail-toolbar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      width: 72%;
      height: 100%;
    }
  }

  .people-album-detail-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-left: 10px;
    width: 100%;
    height: 22px;
  }

  .people-album-detail-list {
    width: 99%;
    height: 100%;
  }
}

</style>
