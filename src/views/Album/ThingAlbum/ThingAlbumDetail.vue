<template>
  <div class="thing-album-detail">
    <div class="thing-album-detail-header">
      <div class="thing-detail-content-nav">
        <AButton size="large" type="text" class="thing-detail-content-nav-title" @click="goBack">
          {{ getZhCategoryNameByEnName(route.query.category as string) }}
        </AButton>
        <span class="thing-detail-content-nav-separator"> > </span>
        <span class="thing-detail-content-nav-name">{{ getZhLabelNameByEnName(route.query.tag as string) }}</span>
      </div>
    </div>
    <ImageToolbar :selected="imageStore.selected" :image-list="imageList"/>
    <div class="thing-album-detail-info">
      <span style="font-size: 14px;color: #999999">共{{ imageStore.countTotalImages(imageList) }}张照片</span>
    </div>
    <div class="thing-album-detail-list">
      <ImageWaterfallList :image-list="imageList"/>
    </div>
  </div>
</template>
<script setup lang="ts">

import {queryThingDetailListApi} from "@/api/storage";
import ImageToolbar from "@/components/ImageToolbar/ImageToolbar.vue";
import useStore from "@/store";
import {getZhCategoryNameByEnName, getZhLabelNameByEnName} from "@/constant/coco_ssd_label_category.ts";
import ImageWaterfallList from "@/components/ImageWaterfallList/ImageWaterfallList.vue";


const imageStore = useStore().image;
const imageList = ref<any[]>([]);
const upload = useStore().upload;
const route = useRoute();
const router = useRouter();

async function getImageList(tag_name: string) {
  imageStore.imageListLoading = true;
  const res: any = await queryThingDetailListApi(tag_name, upload.storageSelected?.[0], upload.storageSelected?.[1]);
  if (res && res.code === 200) {
    imageList.value = res.data.records;
  }
  imageStore.imageListLoading = false;
}

onMounted(() => {
  const idParam = route.params.id;
  const tag_name = Array.isArray(idParam) ? idParam[0] : idParam;
  getImageList(tag_name);
});

/**
 * 返回上一页
 */
function goBack(): void {
  router.go(-1);
}

</script>
<style scoped lang="scss">
.thing-album-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  gap: 10px;
  position: relative;

  .thing-album-detail-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .thing-detail-content-nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      width: 1000%;
      height: 100%;
      gap: 5px;

      .thing-detail-content-nav-title {
        font-size: 20px;
        color: rgb(59, 117, 255);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 7px;
      }

      .thing-detail-content-nav-separator {
        font-size: 20px;
        font-weight: bold;
        color: rgba(90, 90, 90, 0.62);
      }

      .thing-detail-content-nav-name {
        font-size: 20px;
        color: #333333;
      }
    }
  }

  .thing-album-detail-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-left: 15px;
    width: 100%;
    height: 22px;
  }

  .thing-album-detail-list {
    width: 100%;
    height: 100%;
    //margin-left: 5px;
  }

}

</style>
