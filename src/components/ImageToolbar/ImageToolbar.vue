<template>
  <transition name="slide-fade">
    <div v-show="props.selected.length > 0" class="photo-toolbar-header">
      <div class="photo-toolbar-left">
        <AButton type="text" shape="circle" size="large" class="photo-toolbar-btn" @click="clearSelected">
          <template #icon>
            <CloseOutlined class="photo-toolbar-icon"/>
          </template>
        </AButton>
        <span style="font-size: 16px;font-weight: bold">
          已选择 {{ props.selected.length }} 张照片
        </span>
        <AButton type="text" shape="default" class="photo-toolbar-btn" size="middle" @click="selectAll"
                 :disabled="isAllSelected">
          全选
        </AButton>
      </div>
      <div class="photo-toolbar-right">
        <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn">
          <template #icon>
            <PlusSquareOutlined class="photo-toolbar-icon"/>
          </template>
          <APopover placement="bottom" trigger="click">
            <template #content>
              <div class="add-to-popover">
                <div class="add-to-popover-top">
                  <AInput autofocus placeholder="搜索相册" v-model:value="searchValue"
                          @pressEnter="(e)=>searchAlbum(e.target.value)">
                    <template #suffix>
                      <AAvatar size="small" shape="circle" :src="search" @click="searchAlbum(searchValue)"/>
                    </template>
                  </AInput>
                </div>
                <div class="add-to-popover-bottom">
                  <div class="add-to-popover-album-item"
                       @click="addImagesToAlbum(album.id)"
                       v-for="(album, index) in albumList" :key="index">
                    <div>
                      <AAvatar :size="50" shape="square" :src="album.cover_image?album.cover_image:defaultAlbumCover"/>
                    </div>
                    <div class="add-to-popover-album-item-name">
                      <span style="font-size: 14px;font-weight: bold">{{ album.name }}</span>
                      <ATag color="blue" :bordered="false">{{ album.created_at }}</ATag>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            添加到
          </APopover>
        </AButton>
        <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn" @click="downloadImages">
          <template #icon>
            <DownloadOutlined class="photo-toolbar-icon"/>
          </template>
          下载原图
        </AButton>
        <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn" @click="editImages">
          <template #icon>
            <BgColorsOutlined class="photo-toolbar-icon"/>
          </template>
          编辑
        </AButton>
        <!--        <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn">-->
        <!--          <template #icon>-->
        <!--            <ShareAltOutlined class="photo-toolbar-icon"/>-->
        <!--          </template>-->
        <!--          分享-->
        <!--        </AButton>-->
        <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn" @click="deleteImages">
          <template #icon>
            <DeleteOutlined class="photo-toolbar-icon"/>
          </template>
          删除
        </AButton>
      </div>
    </div>
  </transition>
  <AModal v-model:open="imageStore.imageEditVisible" width="60%" :mask-closable="false"
          :keyboard="false" wrap-class-name="full-modal" :footer="null" @cancel="handleImageEditClose">
    <FilerobotImageEditor class="editor-container" :config="config"/>
  </AModal>
</template>
<script setup lang="ts">
import FilerobotImageEditor from '@/components/FilerobotImageEditor/FilerobotImageEditor.vue';
import useStore from "@/store";
import {ImageList, ImageRecord} from "@/types/image";
import {albumListApi, albumSearchApi, deletedImagesApi, imageToAlbumApi} from "@/api/storage";
import {message} from "ant-design-vue";
import {downloadImagesAsZip} from "@/utils/imageUtils/downloadImagesAsZip.ts";
import search from "@/assets/svgs/search.svg";
import confidential from '@/assets/images/confidential.png';
import topSecret from '@/assets/images/top-secret.png';
import {type IFilerobotImageEditorConfig, TABS, TOOLS} from '@/types/imageEditorConfig.ts';
import defaultAlbumCover from "@/assets/images/default-cover.png";

const props = defineProps({
  selected: {
    type: Array as () => number[],
    default: () => []
  },
  imageList: {
    type: Array as () => ImageList,
    default: () => []
  }
});
const imageStore = useStore().image;
const uploadStore = useStore().upload;
const clearSelected = () => {
  imageStore.selected = [];
};
const image = new Image();

/**
 * Download file
 * @param base64Data
 * @param fileName
 */
function uriDownload(base64Data: string, fileName: string) {
  // Create a link element
  const link = document.createElement('a');

  link.href = base64Data;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 根据id 列表获取url 列表
 */
const idToUrlMap = computed(() => {
  const map: { [key: number]: string } = {};
  props.imageList.forEach((record: ImageRecord) => {
    record.list.forEach((image: any) => {
      map[image.id] = image.url;
    });
  });
  return map;
});
/**
 * 根据id 获取url
 * @param id
 */
const getUrlById = (id: number): string => {
  return idToUrlMap.value[id];
};
const config: IFilerobotImageEditorConfig = {
  source: image,
  [TOOLS.WATERMARK]: {
    gallery: [confidential, topSecret],
    textScalingRatio: 0.33,
    imageScalingRatio: 0.33,
  },
  [TOOLS.TEXT]: {
    text: '双击编辑文本...',
  },
  language: 'zh',
  avoidChangesNotSavedAlertOnLeave: false,
  // tabsIds: [TABS.ADJUST, TABS.ANNOTATE, TABS.FINETUNE, TABS.WATERMARK],
  previewPixelRatio: window.devicePixelRatio * 4,
  defaultTabId: TABS.ADJUST,
  onSave: (savedImageData) => {
    try {
      uriDownload(savedImageData.imageBase64!, savedImageData.fullName!);
    } catch (error) {
      console.log(error);
    }
  },
  defaultSavedImageName: 'image',
  showBackButton: false,
  showSaveButton: true,
  disableSaveIfNoChanges: true,
  resetOnImageSourceChange: true,
  closeAfterSave: true,
};

/**
 * 全选
 */
const selectAll = () => {
  imageStore.selected = props.imageList.flatMap((record: ImageRecord) => record.list.map((image: any) => image.id));
};
/**
 * 删除图片
 */
const deleteImages = async () => {
  imageStore.imageListLoading = true;
  const res: any = await deletedImagesApi(props.selected, uploadStore.storageSelected?.[0], uploadStore.storageSelected?.[1]);
  if (res.code === 200) {
    imageStore.selected = [];
  }
  imageStore.imageListLoading = false;
};

const isAllSelected = computed(() => {
  // 确保 props.imageList 是一个数组
  const imageList = props.imageList || [];
  return props.selected.length === imageList.flatMap((record: ImageRecord) => record.list).length;
});


/**
 * 编辑图片
 */
const editImages = async () => {
  // 只能编辑一张图片
  if (props.selected.length !== 1) {
    message.warning("只能编辑一张图片");
    return;
  }
  image.crossOrigin = 'Anonymous';
  image.src = getUrlById(props.selected[0]);
  image.onload = () => {
    imageStore.imageEditVisible = true;
  };
  image.onerror = () => {
    message.warning("图片已过期，请刷新后重试");
    imageStore.selected = [];
    imageStore.imageEditVisible = false;
  };
};


// 根据id selected 列表获取url 列表
const selectedUrlList = computed(() => {
  return props.selected.map(id => idToUrlMap.value[id]);
});

/**
 * 下载图片
 */
function downloadImages() {
  if (selectedUrlList.value.length === 0) {
    message.warning("请选择图片");
    return;
  }
  downloadImagesAsZip(selectedUrlList.value);
  return;
}

const albumList = ref<any[]>([]);

async function getAlbumList(type: number = 0, sort: boolean = true) {
  const res: any = await albumListApi(type, sort);
  if (res && res.code === 200) {
    albumList.value = res.data.albums;
  }
}

const searchValue = ref<string>("");

/**
 * 搜索相册
 * @param keyword
 */
async function searchAlbum(keyword: string) {
  if (keyword.trim() === "") {
    await getAlbumList();
    return;
  }
  const res: any = await albumSearchApi(keyword);
  if (res && res.code === 200) {
    albumList.value = res.data.albums;
  }
}

/**
 * 添加到相册
 * @param albumId
 */
async function addImagesToAlbum(albumId: number) {
  if (props.selected.length === 0) {
    message.warning("请选择图片");
    return;
  }
  const res: any = await imageToAlbumApi(props.selected, albumId, uploadStore.storageSelected?.[0], uploadStore.storageSelected?.[1]);
  if (res && res.code === 200) {
    message.success("添加成功");
    imageStore.selected = [];
  } else {
    message.error("添加失败");
  }
}

/**
 * 关闭编辑图片弹窗
 */
function handleImageEditClose() {
  imageStore.selected = [];
  imageStore.imageEditVisible = false;
}

onMounted(() => {
  getAlbumList();
});

onBeforeUnmount(() => {
  imageStore.selected = [];
});
</script>
<style scoped lang="scss">
.photo-toolbar-header {
  position: fixed;
  width: calc(100% - 220px);
  height: 70px;
  top: 70px;
  z-index: 4;

  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(45deg, #5789ff, #5c7bff 100%);
  color: #fff;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .06);
  padding: 0 20px;


  .photo-toolbar-left {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;

  }

  .photo-toolbar-right {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 30px;
  }

  .photo-toolbar-icon {
    font-size: 20px;
    font-weight: bold;
    color: #fff !important;
  }

  .photo-toolbar-btn {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to { /* .slide-fade-leave-active 在离开之前 */
  transform: translateY(-20px);
  opacity: 0;
}

.slide-fade-enter-from {
  transform: translateY(-30px);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}


.add-to-popover {
  width: 230px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .add-to-popover-top {
    width: 100%;
    height: 40px;
  }

  .add-to-popover-bottom {
    width: 100%;
    height: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: auto;
    gap: 10px;

    .add-to-popover-album-item {
      width: 200px;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      cursor: pointer;
      padding: 10px;
      border-radius: 8px;
      background-color: rgba(191, 189, 189, 0.11);
      border: 1px solid #ddd; // 添加一圈线
      transition: transform 0.2s, box-shadow 0.2s; // 添加过渡效果
      &:hover {
        transform: scale(1.05); // 鼠标悬停时放大
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // 鼠标悬停时添加阴影
        background-color: rgba(129, 193, 214, 0.11);
      }

      .add-to-popover-album-item-name {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
      }
    }
  }
}
</style>
