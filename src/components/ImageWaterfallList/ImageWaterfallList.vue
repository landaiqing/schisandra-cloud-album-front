<template>
  <Spin size="middle" :spinning="imageStore.imageListLoading" indicator="spin-dot" tip="loading..." :rotate="true">
    <div style="width:100%;height:100%;" v-if="props.imageList">
      <div v-for="(itemList, index) in props.imageList" :key="index">
        <span style="margin-left: 10px;font-size: 13px">{{ itemList.date }}</span>
        <AImagePreviewGroup>
          <Vue3JustifiedLayout v-model:list="itemList.list" :options="imageStore.JustifiedLayoutOptions"
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
    <div v-if="!imageStore.imageListLoading && !props.imageList" class="empty-content">
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
  </Spin>
</template>
<script setup lang="ts">
import Vue3JustifiedLayout from "vue3-justified-layout";
import 'vue3-justified-layout/dist/style.css';
import empty from "@/assets/svgs/empty.svg";
import useStore from "@/store";

const props = defineProps({
  imageList: {
    type: Array as () => any[],
    default: () => []
  }
});

const imageStore = useStore().image;
</script>


<style scoped lang="scss">
</style>
