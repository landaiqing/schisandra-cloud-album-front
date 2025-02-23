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
    <image-toolbar :selected="imageStore.selected" :image-list="images"/>
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
            <ASwitch size="default" v-model:checked="imageStore.switchValue"/>
          </AFlex>
        </template>
        <ATabPane key="all" :tab="imageStore.homeTabMap['all']">
          <ASpin size="large" :spinning="loading" :delay="500" wrapper-class-name="spin-wrapper">
            <div style="width:100%;height:100%;" v-if="images">
              <div v-for="(itemList, index) in images" :key="index">
                <span style="margin-left: 10px;font-size: 13px">{{ itemList.date }}</span>
                <AImagePreviewGroup>
                  <Vue3JustifiedLayout v-model:list="itemList.list" :options="options"
                                       style="line-height: 0 !important;">
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
            </div>
            <div v-else class="empty-content">
              <AEmpty :image="empty"
                      :image-style="{
                   height: '100%',
                   width: '100%',
                 }">
                <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  还没检测到任何图片，快去上传吧！
                </span>
                </template>
              </AEmpty>
            </div>
          </ASpin>
        </ATabPane>
        <ATabPane key="video" :tab="imageStore.homeTabMap['video']">
          <ASpin size="large" :spinning="loading" :delay="500">
            <div style="width:100%;height:100%;" v-if="images">
              <div v-for="(itemList, index) in images" :key="index">
                <span style="margin-left: 10px;font-size: 13px">{{ itemList.date }}</span>
                <AImagePreviewGroup>
                  <Vue3JustifiedLayout v-model:list="itemList.list" :options="options"
                                       style="line-height: 0 !important;">
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
            </div>
            <div v-else class="empty-content">
              <AEmpty
                  :image="empty"
                  :image-style="{
                   height: '100%',
                   width: '100%',
                 }"
              >
                <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  还没检测到任何视频，快去上传吧！
                </span>
                </template>
              </AEmpty>
            </div>
          </ASpin>
        </ATabPane>
        <ATabPane key="gif" :tab="imageStore.homeTabMap['gif']">
          <ASpin size="large" :spinning="loading" :delay="500">
            <div style="width:100%;height:100%;" v-if="images">
              <div v-for="(itemList, index) in images" :key="index">
                <span style="margin-left: 10px;font-size: 13px">{{ itemList.date }}</span>
                <AImagePreviewGroup>
                  <Vue3JustifiedLayout v-model:list="itemList.list" :options="options"
                                       style="line-height: 0 !important;">
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
            </div>
            <div v-else class="empty-content">
              <AEmpty
                  :image="empty"
                  :image-style="{
                   height: '100%',
                   width: '100%',
                 }"
              >
                <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  还没检测到任何动图，快去上传吧！
                </span>
                </template>
              </AEmpty>
            </div>
          </ASpin>
        </ATabPane>
        <ATabPane key="screenshot" :tab="imageStore.homeTabMap['screenshot']">
          <ASpin size="large" :spinning="loading" :delay="500">
            <div style="width:100%;height:100%;" v-if="images">
              <div v-for="(itemList, index) in images" :key="index">
                <span style="margin-left: 10px;font-size: 13px">{{ itemList.date }}</span>
                <AImagePreviewGroup>
                  <Vue3JustifiedLayout v-model:list="itemList.list" :options="options"
                                       style="line-height: 0 !important;">
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
            </div>
            <div v-else class="empty-content">
              <AEmpty
                  :image="empty"
                  :image-style="{
                   height: '100%',
                   width: '100%',
                 }"
              >
                <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  还没检测到任何屏幕截图，快去上传吧！
                </span>
                </template>
              </AEmpty>
            </div>
          </ASpin>
        </ATabPane>
      </ATabs>
    </div>
    <ImageUpload/>
  </div>
</template>

<script setup lang="ts">

import Vue3JustifiedLayout from "vue3-justified-layout";
import 'vue3-justified-layout/dist/style.css';
import ImageUpload from "@/views/Photograph/ImageUpload/ImageUpload.vue";
import useStore from "@/store";
import {createAlbumApi, queryAllImagesApi} from "@/api/storage";
import ImageToolbar from "@/views/Photograph/ImageToolbar/ImageToolbar.vue";
import empty from "@/assets/svgs/empty.svg";
import {message} from "ant-design-vue";

const imageStore = useStore().image;


const upload = useStore().upload;

const options = reactive({
  targetRowHeight: 200 // 高度
});

const images = ref<any[]>([]);
const loading = ref<boolean>(false);
const router = useRouter();

/**
 * 获取所有图片
 */
async function getAllImages(type: string) {
  images.value = [];
  loading.value = true;
  const res: any = await queryAllImagesApi(type, imageStore.switchValue, upload.storageSelected?.[0], upload.storageSelected?.[1]);
  if (res && res.code === 200) {
    images.value = res.data.records;
  }
  loading.value = false;
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

.spin-wrapper {
}

</style>
