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
    <ImageToolbar :selected="imageStore.selected" :imageList="images"/>
    <div class="people-album-detail-info">
      <span style="font-size: 14px;color: #999999">共{{ imageStore.countTotalImages(images) }}张照片</span>
    </div>
    <div class="people-album-detail-list">
      <div style="width:100%;height:100%;" v-if="images &&images.length !== 0">
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
      <div v-else class="empty-content">
        <AEmpty :image="empty" :image-style="{width: '100%', height: '100%'}">
          <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  暂无照片，快去上传吧
                </span>
          </template>
        </AEmpty>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Vue3JustifiedLayout from "vue3-justified-layout";
import 'vue3-justified-layout/dist/style.css';
import {getFaceSamplesDetailList} from "@/api/storage";
import ImageToolbar from "@/views/Photograph/ImageToolbar/ImageToolbar.vue";
import useStore from "@/store";
import empty from "@/assets/svgs/empty.svg";


const imageStore = useStore().image;
const images = ref<any[]>([]);

const route = useRoute();
const router = useRouter();
const upload = useStore().upload;

const options = reactive({
  targetRowHeight: 200 // 高度
});

async function getAlbumList(id: number) {
  const res: any = await getFaceSamplesDetailList(id, upload.storageSelected?.[0], upload.storageSelected?.[1]);
  if (res && res.code === 200) {
    images.value = res.data.records;
  }
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
