<template>
  <div class="all-photo">
    <div class="photo-header">
      <AButton type="primary" shape="round" size="middle" @click="upload.openUploadDrawerFn()">
        <template #icon>
          <PlusOutlined/>
        </template>
        上传照片
      </AButton>
      <APopover placement="right" trigger="click">
        <AButton type="default" shape="round" size="middle">
          <template #icon>
            <PlusSquareOutlined/>
          </template>
          创建相册
        </AButton>

        <template #content>
          <span style="color: #999; font-size: 15px;">创建相册</span>
          <AInput placeholder="请填写相册名称" class="phoalbum-create-input"
                  style="margin-top: 15px"
                  v-model:value="albumNameValue" size="large">
            <template #suffix>
              <AButton type="text" @click.prevent size="middle" style="color: #0e87cc" @click="createAlbumSubmit">
                确认
              </AButton>
            </template>
          </AInput>
        </template>
      </APopover>
    </div>
    <image-toolbar :selected="imageStore.selected" :image-list="imageList"/>
    <div class="photo-list">
      <ATabs size="small" :tabBarGutter="50" type="line" tabPosition="top" :tabBarStyle="{position:'unset'}"
             @change="handleTabChange"
             v-model:activeKey="imageStore.homeTabActiveKey"
             style="width: 99%;">
        <template #rightExtra>
          <AFlex :vertical="false" align="center" gap="10">
            <span style="color: #999999;">清爽模式</span>
            <ATooltip title="开启后即可隐藏已添加到相册的照片" placement="bottom">
              <QuestionCircleOutlined/>
            </ATooltip>
            <ASwitch size="default" v-model:checked="imageStore.switchValue" @change="handleSwitchChange"/>
          </AFlex>
        </template>
        <ATabPane key="all" :tab="imageStore.homeTabMap['all']">
          <ImageWaterfallList :image-list="imageList"/>
        </ATabPane>
        <ATabPane key="video" :tab="imageStore.homeTabMap['video']">
          <ImageWaterfallList :image-list="imageList"/>
        </ATabPane>
        <ATabPane key="gif" :tab="imageStore.homeTabMap['gif']">
          <ImageWaterfallList :image-list="imageList"/>
        </ATabPane>
        <ATabPane key="screenshot" :tab="imageStore.homeTabMap['screenshot']">
          <ImageWaterfallList :image-list="imageList"/>
        </ATabPane>
      </ATabs>
    </div>
    <ImageUpload/>
  </div>
</template>

<script setup lang="ts">
import ImageUpload from "@/components/ImageUpload/ImageUpload.vue";
import useStore from "@/store";
import {createAlbumApi, queryAllImagesApi} from "@/api/storage";

import {message} from "ant-design-vue";
import ImageWaterfallList from "@/components/ImageWaterfallList/ImageWaterfallList.vue";

const imageStore = useStore().image;


const upload = useStore().upload;


const imageList = ref<any[]>([]);

const router = useRouter();

/**
 * 获取所有图片
 */
async function getAllImages(type: string) {
  imageList.value = [];
  imageStore.imageListLoading = true;
  const res: any = await queryAllImagesApi(type, imageStore.switchValue, upload.storageSelected?.[0], upload.storageSelected?.[1]);
  if (res && res.code === 200) {
    imageList.value = res.data.records;
  }
  imageStore.imageListLoading = false;
}

async function handleTabChange(activeKey: string) {
  imageStore.homeTabActiveKey = activeKey;
  await getAllImages(activeKey);
}

const albumNameValue = ref<string>("未命名相册");

/**
 * 创建相册
 */
async function createAlbumSubmit() {
  if (albumNameValue.value.trim() === "") {
    message.error("相册名称不能为空");
    return;
  }
  const res: any = await createAlbumApi(albumNameValue.value);
  if (res && res.code === 200) {
    router.push({
      path: "/main/album/albums/" + `${res.data.id}`,
      query: {name: albumNameValue.value}
    });
  } else {
    message.error("创建相册失败");
  }
}

function handleSwitchChange(_checked: boolean) {
  getAllImages(imageStore.homeTabActiveKey);
}


onMounted(() => {
  getAllImages(imageStore.homeTabActiveKey);
});
</script>
<style scoped lang="scss">
.all-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  position: relative;

  .photo-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

  }

  .photo-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: calc(100% - 65px);
  }
}

.photo-item:hover {
  transition: all 0.3s ease-in-out, transform 0.3s ease-in-out;
  //transform: scale(0.99);
  box-shadow: 0 0 10px 0 rgba(77, 167, 255, 0.89);
}

</style>
