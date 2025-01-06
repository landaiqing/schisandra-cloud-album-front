<template>
  <div class="recent-upload">
    <div class="photo-header">
      <AButton type="primary" shape="round" size="middle">
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
    <div class="photo-list">
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
                         margin="0"
                         border-radius="0"
                         v-model="selected"
                         :showHoverCircle="true"
                         :iconSize="20"
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
    </div>
  </div>
</template>
<script setup lang="ts">
import {Waterfall} from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';
import loading from '@/assets/gif/loading.gif';
import error from '@/assets/svgs/no-image.svg';

const selected = ref<(string | number)[]>([]);
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
  }
}

onBeforeMount(() => { // 组件已完成响应式状态设置，但未创建DOM节点
  loadImages();
});

</script>
<style scoped lang="scss">
.recent-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;

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
    margin-top: 10px;
  }
}
</style>
