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
                    <AImage :src="item.url"
                            :alt="item.file_name"
                            :key="index"
                            style="height: 200px"
                            :previewMask="false"
                            fallback="data:image/png;base64,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"
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


const selected = ref<(string | number)[]>([]);
const albumList = ref<any[]>([]);

const route = useRoute();
const router = useRouter();
const options = reactive({
  targetRowHeight: 200 // 高度
});

async function getAlbumList(id: number) {
  const res: any = await queryAlbumDetailListApi(id, "ali", "schisandra-album");
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
