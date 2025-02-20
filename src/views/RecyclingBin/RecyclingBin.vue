<template>
  <div class="recycling-bin">
    <div class="recycling-bin-header">
      <AButton type="link" size="large" class="recycling-bin-title">回收站</AButton>
      <span class="recycling-bin-desc">保存最近10天从云端删除的内容</span>
    </div>
    <div class="photo-list">
      <div style="width:100%;height:100%;" v-if="images.length !== 0">
        <div v-for="(itemList, index) in images" :key="index">
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
                          loading="lazy"/>
                </CheckCard>
              </template>
            </Vue3JustifiedLayout>
          </AImagePreviewGroup>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Vue3JustifiedLayout from "vue3-justified-layout";
import 'vue3-justified-layout/dist/style.css';
import {queryShareImageApi} from "@/api/share";


const selected = ref<(string | number)[]>([]);
const images = ref<any[]>([]);
const options = reactive({
  targetRowHeight: 200 // 高度
});


async function getImages() {
  const res = await queryShareImageApi("c09e3c571303448798c878095fbaa521", "123456");
  console.log(res);
}

getImages();

</script>
<style scoped lang="scss">
.recycling-bin {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;

  .recycling-bin-header {
    width: 100%;
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .recycling-bin-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }

    .recycling-bin-desc {
      font-size: 12px;
      color: #333;
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

</style>
