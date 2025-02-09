<template>
  <div class="all-photo">
    <div class="photo-header">
      <AButton type="primary" shape="round" size="middle" @click="upload.openUploadDrawerFn()">
        <template #icon>
          <PlusOutlined/>
        </template>
        上传照片
      </AButton>
      <AButton type="default" shape="round" size="middle">
        <template #icon>
          <PlusSquareOutlined/>
        </template>
        创建相册
      </AButton>
    </div>
    <transition name="slide-fade">
      <div v-show="selected.length !== 0" class="photo-toolbar-header">
        <div class="photo-toolbar-left">
          <AButton type="text" shape="circle" size="large" class="photo-toolbar-btn">
            <template #icon>
              <CloseOutlined class="photo-toolbar-icon"/>
            </template>
          </AButton>
          <span style="font-size: 16px;font-weight: bold">
          已选择 {{ selected.length }} 张照片
        </span>
          <AButton type="text" shape="default" class="photo-toolbar-btn" size="middle">
            全选
          </AButton>
        </div>
        <div class="photo-toolbar-right">
          <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn">
            <template #icon>
              <PlusSquareOutlined class="photo-toolbar-icon"/>
            </template>
            添加到
          </AButton>
          <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn">
            <template #icon>
              <DownloadOutlined class="photo-toolbar-icon"/>
            </template>
            下载原图
          </AButton>
          <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn">
            <template #icon>
              <ShareAltOutlined class="photo-toolbar-icon"/>
            </template>
            分享
          </AButton>
          <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn">
            <template #icon>
              <DeleteOutlined class="photo-toolbar-icon"/>
            </template>
            删除
          </AButton>
        </div>
      </div>
    </transition>
    <div class="photo-list">
      <ATabs size="small" :tabBarGutter="50" type="line" tabPosition="top" :tabBarStyle="{position:'unset'}"
             style="width: 99%;">
        <template #rightExtra>
          <ASwitch size="small" v-model:checked="switchValue"/>
        </template>
        <ATabPane key="image" tab="全部">
          <div style="width:100%;height:100%;">
            <div v-for="(itemList, index) in images" :key="index">
              <span style="margin-left: 10px;font-size: 14px">{{ itemList.date }}</span>
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
                              loading="lazy"/>
                    </CheckCard>
                  </template>
                </Vue3JustifiedLayout>
              </AImagePreviewGroup>
            </div>
          </div>
        </ATabPane>
        <ATabPane key="video" tab="视频">
          <div style="width:100%;height:100%;">

          </div>
        </ATabPane>
        <ATabPane key="gif" tab="动图">

        </ATabPane>
        <ATabPane key="screenshot" tab="截图">

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
import {queryAllImagesApi} from "@/api/storage";


const selected = ref<(string | number)[]>([]);
const switchValue = ref<boolean>(false);
const upload = useStore().upload;

const options = reactive({
  targetRowHeight: 200 // 高度
});

const images = ref<any[]>([]);


async function getAllImages() {
  const res: any = await queryAllImagesApi("image", false, "ali", "schisandra-album");
  if (res && res.code === 200) {
    console.log(res);
    images.value = res.data.records;
  }
}


onMounted(() => {
  getAllImages();
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

  .photo-toolbar-header {
    position: fixed;
    width: calc(100% - 220px);
    height: 70px;
    top: 70px;
    z-index: 3;

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
      color: #fff;
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

  .photo-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: calc(100% - 65px);
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

.photo-item:hover {
  transition: all 0.3s ease-in-out, transform 0.3s ease-in-out;
  //transform: scale(0.99);
  box-shadow: 0 0 10px 0 rgba(77, 167, 255, 0.89);
}
</style>
