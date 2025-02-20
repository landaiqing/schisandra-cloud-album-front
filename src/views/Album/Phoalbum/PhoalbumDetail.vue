<template>
  <div class="phoalbum-detail">
    <div class="phoalbum-detail-header">
      <AButton type="primary" shape="round" size="middle">
        <template #icon>
          <PlusSquareOutlined/>
        </template>
        上传
      </AButton>
      <AButton type="default" shape="round" size="middle">
        <template #icon>
          <PlusSquareOutlined/>
        </template>
        重命名
      </AButton>
      <AButton type="default" shape="round" size="middle">
        <template #icon>
          <PlusSquareOutlined/>
        </template>
        删除相册
      </AButton>
      <AButton type="default" shape="round" size="middle">
        <template #icon>
          <PlusSquareOutlined/>
        </template>
        下载相册
      </AButton>
    </div>
    <ImageToolbar :selected="selected"/>
    <div class="phoalbum-detail-content">
      <div class="phoalbum-detail-content-nav">
        <div class="phoalbum-detail-content-nav-left">
          <AButton type="text" size="large" class="phoalbum-detail-content-nav-title" @click="goBack()">全部相册
          </AButton>
          <span class="phoalbum-detail-content-nav-separator"> > </span>
          <span class="phoalbum-detail-content-nav-name">网盘导入</span>
        </div>
        <div class="phoalbum-detail-content-nav-right">
          <span class="phoalbum-detail-content-nav-date">共15张照片,1个视频，创建于2025年1月1日</span>
        </div>
      </div>
      <div class="phoalbum-detail-content-desc">
        <span>描述：</span>
        <span>相册描述</span>
      </div>
      <div class="phoalbum-detail-content-list">
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
  </div>
</template>
<script setup lang="ts">
import Vue3JustifiedLayout from "vue3-justified-layout";
import 'vue3-justified-layout/dist/style.css';
import {queryAlbumDetailListApi} from "@/api/storage";
import ImageToolbar from "@/views/Photograph/ImageToolbar/ImageToolbar.vue";
import useStore from "@/store";


const selected = ref<(string | number)[]>([]);
const albumList = ref<any[]>([]);

const route = useRoute();
const router = useRouter();
const options = reactive({
  targetRowHeight: 200 // 高度
});
const upload = useStore().upload;


async function getAlbumList(id: number) {
  const res: any = await queryAlbumDetailListApi(id, upload.storageSelected?.[0], upload.storageSelected?.[1]);
  if (res && res.code === 200) {
    albumList.value = res.data.records;
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
.phoalbum-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  position: relative;

  .phoalbum-detail-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;
  }

  .phoalbum-detail-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    gap: 10px;
    height: calc(100% - 65px);

    .phoalbum-detail-content-nav {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      width: 100%;
      height: 40px;

      .phoalbum-detail-content-nav-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        width: 50%;
        height: 100%;
        gap: 5px;

        .phoalbum-detail-content-nav-title {
          font-size: 20px;
          color: rgb(59, 117, 255);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }

        .phoalbum-detail-content-nav-separator {
          font-size: 20px;
          font-weight: bold;
          color: rgba(90, 90, 90, 0.62);
        }

        .phoalbum-detail-content-nav-name {
          font-size: 20px;
          color: #333333;
        }
      }

      .phoalbum-detail-content-nav-right {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        width: 50%;
        height: 100%;

        .phoalbum-detail-content-nav-date {
          font-size: 14px;
          color: #999999;
        }
      }
    }

    .phoalbum-detail-content-desc {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 15px;
      font-size: 13px;
      color: #333333;
      padding-left: 10px;
    }

    .phoalbum-detail-content-list {
      width: 100%;
      //height: 100%;
      margin-top: 10px;
    }
  }
}

</style>
