<template>
  <div class="phoalbum-detail">
    <div class="phoalbum-detail-header">
      <AButton type="primary" shape="round" size="middle" @click="openUploadModal()">
        <template #icon>
          <CloudUploadOutlined/>
        </template>
        上传
      </AButton>
      <APopover placement="right" trigger="click">
        <AButton type="default" shape="round" size="middle">
          <template #icon>
            <EditOutlined/>
          </template>
          重命名
        </AButton>
        <template #content>
          <AInput :placeholder="route.query.name"
                  v-model:value="albumRenameValue">
            <template #suffix>
              <AButton type="text" @click.prevent size="small" style="color: #0e87cc"
                       @click="renameAlbum(albumRenameValue)">
                确认
              </AButton>
            </template>
          </AInput>
        </template>
      </APopover>
      <AButton type="default" shape="round" size="middle" @click="deleteAlbum">
        <template #icon>
          <DeleteOutlined/>
        </template>
        删除相册
      </AButton>
      <AButton type="default" shape="round" size="middle">
        <template #icon>
          <DownloadOutlined/>
        </template>
        下载相册
      </AButton>
    </div>
    <ImageUpload/>
    <ImageToolbar :selected="imageStore.selected" :image-list="imageList"/>
    <div class="phoalbum-detail-content">
      <div class="phoalbum-detail-content-nav">
        <div class="phoalbum-detail-content-nav-left">
          <AButton type="text" size="large" class="phoalbum-detail-content-nav-title" @click="goBack()">
            {{ imageStore.tabMap[imageStore.tabActiveKey] }}
          </AButton>
          <span class="phoalbum-detail-content-nav-separator"> > </span>
          <span class="phoalbum-detail-content-nav-name">{{ route.query.name }}</span>
        </div>
        <div class="phoalbum-detail-content-nav-right">
          <span class="phoalbum-detail-content-nav-date">共 {{ imageStore.countTotalImages(imageList) }} 张照片</span>
        </div>
      </div>
      <div class="phoalbum-detail-content-desc">
        <span>描述：</span>
        <span>相册描述</span>
      </div>
      <div class="phoalbum-detail-content-list">
        <ImageWaterfallList :image-list="imageList"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {deleteAlbumApi, queryAlbumDetailListApi, renameAlbumApi} from "@/api/storage";
import ImageToolbar from "@/components/ImageToolbar/ImageToolbar.vue";
import useStore from "@/store";

import ImageUpload from "@/components/ImageUpload/ImageUpload.vue";
import {message} from "ant-design-vue";
import ImageWaterfallList from "@/components/ImageWaterfallList/ImageWaterfallList.vue";


const imageStore = useStore().image;
const imageList = ref<any[]>([]);

const route = useRoute();
const router = useRouter();

const upload = useStore().upload;


async function getImageList(id: number) {
  imageStore.imageListLoading = true;
  const res: any = await queryAlbumDetailListApi(id, upload.storageSelected?.[0], upload.storageSelected?.[1]);
  if (res && res.code === 200) {
    imageList.value = res.data.records;
  }
  imageStore.imageListLoading = false;
}

onMounted(() => {
  const idParam = route.params.id;
  const albumId = Array.isArray(idParam) ? idParam[0] : idParam;
  getImageList(parseInt(albumId, 10));
});

function openUploadModal(): void {
  upload.openUploadDrawerFn();
  const idParam = route.params.id;
  const albumId = Array.isArray(idParam) ? idParam[0] : idParam;
  upload.albumSelected = parseInt(albumId);
}

const albumRenameValue = ref<string>("");

/**
 * 重命名相册
 * @param name
 */
async function renameAlbum(name: string) {
  if (name.trim() === "") {
    message.warning("相册名称不能为空");
    return;
  }
  const idParam = route.params.id;
  const albumId = Array.isArray(idParam) ? idParam[0] : idParam;
  const res: any = await renameAlbumApi(parseInt(albumId), name);
  if (res && res.code === 200) {
    albumRenameValue.value = "";
    goBack();
  }
}

/**
 * 删除相册
 */
async function deleteAlbum() {
  const idParam = route.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const res: any = await deleteAlbumApi(parseInt(id));
  if (res && res.code === 200) {
    goBack();
  } else {
    message.error("删除相册失败");
  }
}

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
