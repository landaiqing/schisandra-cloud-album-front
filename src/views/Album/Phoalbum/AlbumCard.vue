<template>
  <Spin tip="Loading..." :spinning="imageStore.albumListLoading" size="middle">
    <div class="phoalbum-item-container" v-if="imageStore.albumList">
      <div class="phoalbum-item"
           v-for="(album, index) in imageStore.albumList"
           :key="album.id"
           @click.prevent="handleClick(album.id,album.name,album.type)"
           @mouseover="isHovered = index"
           @mouseleave="isHovered = null">
        <PhotoStack :src="album.cover_image ?`data:image/png;base64,`+album.cover_image: ``"
                    :default-src="default_cover"/>
        <div class="phoalbum-item-info">
          <span class="phoalbum-item-name">{{ album.name }}</span>
          <span class="phoalbum-item-date">{{ album.created_at }}</span>
        </div>
        <div class="phoalbum-item-operation"
             :class="{ 'fade-in': isHovered === index, 'fade-out': isHovered !== index }">
          <ADropdown trigger="click" @click.stop>
            <AButton type="text" shape="circle" size="small" @click.prevent>
              <template #icon>
                <AAvatar shape="circle" size="small" :src="more"/>
              </template>
            </AButton>
            <template #overlay>
              <AMenu>
                <APopover placement="left" trigger="click">
                  <AMenuItem key="1">重命名相册</AMenuItem>
                  <template #content>
                    <AInput :placeholder="album.name" class="phoalbum-create-input"
                            v-model:value="albumRenameValue">
                      <template #suffix>
                        <AButton type="text" @click.prevent size="small" style="color: #0e87cc"
                                 @click="renameAlbum(album.id, albumRenameValue)">
                          确认
                        </AButton>
                      </template>
                    </AInput>
                  </template>
                </APopover>
                <AMenuItem key="2"
                           @click.prevent="imageStore.openAlbumShareDialogHandler(true,album.cover_image ?`data:image/png;base64,`+album.cover_image: ``,album.id)">
                  分享相册
                </AMenuItem>
                <AMenuItem key="3" @click.prevent="deleteAlbum(album.id)">删除相册</AMenuItem>
                <AMenuItem key="4" @click.prevent="downloadAlbumImage(album.id)">下载相册</AMenuItem>
              </AMenu>
            </template>
          </ADropdown>
        </div>
      </div>
    </div>
    <div v-else class="empty-content">
      <AEmpty :image="empty" :image-style="{ width: '100%', height: '100%' }">
        <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  暂无相册，快去创建一个吧！
                </span>
        </template>
      </AEmpty>
    </div>
  </Spin>
</template>
<script setup lang="ts">

import default_cover from "@/assets/images/default-cover.png";
import more from "@/assets/svgs/more.svg";
import empty from "@/assets/svgs/empty.svg";
import useStore from "@/store";
import {message} from "ant-design-vue";
import {deleteAlbumApi, downloadAlbumImagesApi, renameAlbumApi} from "@/api/storage";
import {downloadImagesAsZip} from "@/utils/imageUtils/downloadImagesAsZip.ts";

const imageStore = useStore().image;
const uploadStore = useStore().upload;
const isHovered = ref<number | null>(null);
const router = useRouter();
const route = useRoute();

const albumRenameValue = ref<string>("");

/**
 *  点击相册跳转到详情页
 * @param id
 * @param albumName
 * @param type
 */
function handleClick(id: number, albumName: string, type: number) {
  router.push({
    path: route.path + `/${id}`, query: {name: albumName, type: type}
  });
}

/**
 * 重命名相册
 * @param id
 * @param name
 */
async function renameAlbum(id: number, name: string) {
  if (name.trim() === "") {
    message.warning("相册名称不能为空");
    return;
  }
  const res: any = await renameAlbumApi(id, name);
  if (res && res.code === 200) {
    albumRenameValue.value = "";
    await imageStore.getAlbumList();
  }
}

/**
 * 删除相册
 * @param id
 */
async function deleteAlbum(id: number) {
  const res: any = await deleteAlbumApi(id);
  if (res && res.code === 200) {
    await imageStore.getAlbumList();
  } else {
    message.error("删除相册失败");
  }
}

/**
 * 下载相册图片
 * @param id
 */
async function downloadAlbumImage(id: number) {
  if (!id) {
    return;
  }
  const res: any = await downloadAlbumImagesApi(id, uploadStore.storageSelected?.[0], uploadStore.storageSelected?.[1]);
  if (res && res.code === 200) {
    if (!res.data.records) {
      message.warning("相册中没有图片");
      return;
    }
    await downloadImagesAsZip(res.data.records);
  }

}

</script>
<style scoped lang="scss">
.phoalbum-item-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 40px;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .phoalbum-item {
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 15px;
    padding: 10px;
    position: relative;
    cursor: pointer;

    .phoalbum-item-info {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .phoalbum-item-name {
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }

      .phoalbum-item-date {
        font-size: 12px;
        color: #999;
      }
    }

    .phoalbum-item-operation {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
      opacity: 0;
      transform: scale(0);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .fade-in {
      opacity: 1; /* 显示时透明度为1 */
      transform: scale(1); /* 显示时缩放为1 */
      z-index: 10; /* 显示时z-index为10 */
    }

    .fade-out {
      opacity: 0; /* 隐藏时透明度为0 */
      transform: scale(0); /* 隐藏时缩放为0 */
    }
  }
}
</style>
