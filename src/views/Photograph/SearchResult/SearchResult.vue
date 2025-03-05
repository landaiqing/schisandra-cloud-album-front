<template>
  <div class="search-upload">
    <div class="photo-header">
      <AButton type="text" shape="default" size="large" style="padding: 5px;" @click="router.go(-1)">
        <template #icon>
          <LeftOutlined/>
        </template>
        返回主页
      </AButton>
      <AButton type="link" size="large" class="search-btn">搜索结果</AButton>
    </div>
    <image-toolbar :selected="imageStore.selected" :image-list="searchStore.searchResult"/>
    <div class="photo-list">
      <div class="photo-list-container">
        <ImageWaterfallList :image-list="searchStore.searchResult"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import useStore from "@/store";

import ImageToolbar from "@/components/ImageToolbar/ImageToolbar.vue";

import ImageWaterfallList from "@/components/ImageWaterfallList/ImageWaterfallList.vue";
import {imageSearchApi} from "@/api/storage";

const searchStore = useStore().search;
const imageStore = useStore().image;
const router = useRouter();
const route = useRoute();

async function search() {
  const params: any = {
    type: route.query.type as string,
    keyword: route.query.keyword as string,
    provider: route.query.provider as string,
    bucket: route.query.bucket as string,
  };
  const res: any = await imageSearchApi(params);
  if (res && res.code === 200) {
    searchStore.searchResult = res.data.records;
  }
}

onMounted(() => {
  search();
});
onBeforeUnmount(() => {
  searchStore.searchResult = [];
});
</script>
<style scoped lang="scss">
.search-upload {
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

    .search-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: #333;

    }
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
