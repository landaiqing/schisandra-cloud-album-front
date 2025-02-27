<template>

  <div class="share-view-main">
    <div class="main-header">
      <Header/>
    </div>
    <div class="share-view-content">
      <ShareSidebar/>
      <div class="share-view-content-container">
        <div class="share-content-header">
          <AButton type="link" size="large" class="share-content-header-button">图片列表</AButton>
        </div>
        <div class="share-content-verify" v-if="imageList && imageList.length <= 0">
          <AInputPassword size="large" placeholder="请输入访问密码" style="width: 20%" @pressEnter="getShareImages"/>
          <p style="font-size: 12px;color: #999;">回车后可查看图片列表</p>
        </div>
        <ImageWaterfallList :image-list="imageList"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import Header from "@/layout/default/Header/Header.vue";
import ShareSidebar from "@/views/Share/ShareViewList/ShareSidebar.vue";

import {queryShareImageApi} from "@/api/share";
import ImageWaterfallList from "@/components/ImageWaterfallList/ImageWaterfallList.vue";
import useStore from "@/store";

const imageList = ref<any[]>([]);

const route = useRoute();

const imageStore = useStore().image;

/**
 * 获取分享图片列表
 * @param e
 */
async function getShareImages(e) {
  imageStore.imageListLoading = true;
  const invite_code = route.params.id;
  const code = Array.isArray(invite_code) ? invite_code[0] : invite_code;
  const res: any = await queryShareImageApi(code, e.target.value);
  if (res && res.code === 200) {
    imageList.value = res.data.records;
  }
  imageStore.imageListLoading = false;
}


</script>
<style scoped lang="scss">
.share-view-main {
  display: flex;
  flex-direction: column;
  background-color: #eaeef6;
  color: var(--text-color);
  width: 100vw;
  height: 100%;

  .share-view-content {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100vh - 70px);

    .share-view-content-container {
      width: calc(100vw - 230px);
      height: calc(100vh - 100px);
      max-height: calc(100vh - 100px);
      padding: 15px;
      overflow: auto;

      .share-content-header {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        border-bottom: 1px solid #e2e2e2;

        .share-content-header-button {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
      }

      .share-content-verify {
        width: 100%;
        height: calc(100vh - 155px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
    }

  }
}

</style>
