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
        <ATabPane key="1" tab="全部">
          <div style="width:100%;height:100%;" v-if="images.length !== 0">
            <span style="margin-left: 10px;font-size: 13px">2024年12月27日 星期日</span>
            <AImagePreviewGroup>
              <Waterfall :list="images"
                         :backgroundColor="`transparent`"
                         :width="400"
                         :gutter="15"
                         align="left"
                         :lazyload="true"
                         :animationDelay="300"
                         :animationDuration="1000"
                         :animationCancel="false"
                         :hasAroundGutter="true"
                         rowKey="id"
                         :imgSelector="'src'"
                         :loadProps="loadProps"
                         :breakpoints="breakpoints">
                <template #default="{ item, url, index }">
                  <CheckCard :key="index"
                             class="photo-item"
                             margin="0"
                             border-radius="0"
                             v-model="selected"
                             :showHoverCircle="true"
                             :iconSize="20"
                             :showSelectedEffect="true"
                             :value="url">
                    <AImage :src="url"
                            :alt="item.title"
                            :key="index"
                            :previewMask="false"
                            loading="lazy"/>
                  </CheckCard>
                </template>
              </Waterfall>
            </AImagePreviewGroup>
          </div>
        </ATabPane>
        <ATabPane key="2" tab="视频">
          <div style="width:100%;height:100%;">

          </div>
        </ATabPane>
        <ATabPane key="3" tab="动图">

        </ATabPane>
        <ATabPane key="4" tab="截图">

        </ATabPane>
      </ATabs>
    </div>
    <ImageUpload/>
  </div>
</template>

<script setup lang="ts">
import {Waterfall} from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';
import loading from '@/assets/gif/loading.gif';
import error from '@/assets/svgs/no-image.svg';
import ImageUpload from "@/views/Photograph/ImageUpload/ImageUpload.vue";
import useStore from "@/store";

const selected = ref<(string | number)[]>([]);
const switchValue = ref<boolean>(false);
const upload = useStore().upload;
const breakpoints = reactive({
  breakpoints: {
    1200: {
      // 当屏幕宽度小于等于1200
      rowPerView: 4,
    },
    800: {
      // 当屏幕宽度小于等于800
      rowPerView: 3,
    },
    500: {
      // 当屏幕宽度小于等于500
      rowPerView: 2,
    },
  },
});
const loadProps = reactive({
  loading,
  error,
  ratioCalculator: (_width: number, _height: number) => {
    // 我设置了最小宽高比
    const minRatio = 3 / 4;
    const maxRatio = 4 / 3;
    return Math.random() > 0.5 ? minRatio : maxRatio;
  },
});

const images = ref<any[]>([]);

function loadImages() {
  for (let i = 1; i < 10; i++) {
    images.value.push({
      title: `image-${i}`,
      link: '',
      src: `https://cdn.jsdelivr.net/gh/themusecatcher/resources@0.0.5/${i}.jpg`,
      tag: '全部',
      date: '2022-01-01',
    });
    images.value.push({
      title: `image-${i}`,
      link: '',
      src: `/test/${i}.png`,
    });
  }
}

onBeforeMount(() => { // 组件已完成响应式状态设置，但未创建DOM节点
  loadImages();
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
