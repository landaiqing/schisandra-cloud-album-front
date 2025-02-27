<template>
  <div class="recycling-bin">
    <div class="recycling-bin-header">
      <AButton type="link" size="large" class="recycling-bin-title">回收站</AButton>
      <span class="recycling-bin-desc">保存最近10天从云端删除的内容</span>
    </div>
    <div class="photo-list">
      <ImageWaterfallList :image-list="imageList"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {getDeletedRecordApi} from "@/api/storage";
import useStore from "@/store";
import ImageWaterfallList from "@/components/ImageWaterfallList/ImageWaterfallList.vue";

const imageList = ref<any[]>([]);
const upload = useStore().upload;
const imageStore = useStore().image;
/**
 * 查询回收站
 */
async function queryRecyclingBin() {
  imageStore.imageListLoading = true;
  const res: any = await getDeletedRecordApi(upload.storageSelected?.[0], upload.storageSelected?.[1]);
  if (res && res.code === 200) {
    imageList.value = res.data.records;
  }
  imageStore.imageListLoading = false;
}

onMounted(() => {
  queryRecyclingBin();
});

</script>
<style scoped lang="scss">
.recycling-bin {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;

  .recycling-bin-header {
    width: 100%;
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .recycling-bin-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }

    .recycling-bin-desc {
      font-size: 12px;
      color: #333;
    }
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

</style>
