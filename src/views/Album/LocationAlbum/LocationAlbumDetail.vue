<template>
  <div class="location-album-detail">
    <div class="location-album-detail-header">
      <div class="location-detail-content-nav">
        <AButton size="large" type="text" class="location-detail-content-nav-title" @click="goBack">地点</AButton>
        <span class="location-detail-content-nav-separator"> > </span>
        <span class="location-detail-content-nav-name">乌鲁木齐</span>
      </div>
    </div>
    <div class="location-album-detail-info">
      <span style="font-size: 14px;color: #999999">共12张照片</span>
    </div>
    <div class="location-album-detail-list">
      <div style="width:100%;height:100%;">
        <div v-for="(itemList, index) in albumList" :key="index">
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
                  <AImage :src="item.thumbnail"
                          :alt="item.file_name"
                          :key="index"
                          :height="200"
                          :previewMask="false"
                          :preview="{
                                src: item.url,
                               }"
                          loading="lazy"/>
                </CheckCard>
              </template>
            </Vue3JustifiedLayout>
          </AImagePreviewGroup>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import Vue3JustifiedLayout from "vue3-justified-layout";
import 'vue3-justified-layout/dist/style.css';
import {queryLocationDetailListApi} from "@/api/storage";
import useStore from "@/store";

const selected = ref<(string | number)[]>([]);
const albumList = ref<any[]>([]);

const route = useRoute();
const router = useRouter();
const upload = useStore().upload;
const options = reactive({
  targetRowHeight: 200 // 高度
});

async function getImageList(id: number) {
  const res: any = await queryLocationDetailListApi(id, upload.storageSelected[0], upload.storageSelected[1]);
  console.log(res);
  if (res && res.code === 200) {
    albumList.value = res.data.records;
  }
}

onMounted(() => {
  const idParam = route.params.id;
  const albumId = Array.isArray(idParam) ? idParam[0] : idParam;
  getImageList(parseInt(albumId, 10));
});

/**
 * 返回上一页
 */
function goBack(): void {
  router.go(-1);
}
</script>
<style scoped lang="scss">
.location-album-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  gap: 10px;
  position: relative;

  .location-album-detail-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .location-detail-content-nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      width: 1000%;
      height: 100%;
      gap: 5px;

      .location-detail-content-nav-title {
        font-size: 20px;
        color: rgb(59, 117, 255);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .location-detail-content-nav-separator {
        font-size: 20px;
        font-weight: bold;
        color: rgba(90, 90, 90, 0.62);
      }

      .location-detail-content-nav-name {
        font-size: 20px;
        color: #333333;
      }
    }
  }

  .location-album-detail-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-left: 30px;
    width: 100%;
    height: 22px;
  }

  .location-album-detail-list {
    width: 99%;
    height: 100%;
  }

}

</style>
