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
        <div class="share-content-verify" v-if="images && images.length <= 0">
          <AInputPassword size="large" placeholder="请输入访问密码" style="width: 20%" @pressEnter="getShareImages"/>
          <p style="font-size: 12px;color: #999;">回车后可查看图片列表</p>
        </div>
        <ASpin :spinning="loading" size="large">
          <div v-if="images && images.length !== 0">
            <AImagePreviewGroup>
              <Vue3JustifiedLayout v-model:list="images" :options="options">
                <template #default="{ item }">
                  <CheckCard
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
        </ASpin>

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import Header from "@/layout/default/Header/Header.vue";
import ShareSidebar from "@/views/Share/ShareViewList/ShareSidebar.vue";
import Vue3JustifiedLayout from "vue3-justified-layout";
import 'vue3-justified-layout/dist/style.css';
import {queryShareImageApi} from "@/api/share";

const selected = ref<(string | number)[]>([]);
const images = ref<any[]>([]);
const options = reactive({
  targetRowHeight: 200 // 高度
});
const route = useRoute();
const loading = ref<boolean>(false);

/**
 * 获取分享图片列表
 * @param e
 */
async function getShareImages(e) {
  loading.value = true;
  const invite_code = route.params.id;
  const code = Array.isArray(invite_code) ? invite_code[0] : invite_code;
  const res: any = await queryShareImageApi(code, e.target.value);
  if (res && res.code === 200) {
    images.value = res.data.records;
  }
  loading.value = false;
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
