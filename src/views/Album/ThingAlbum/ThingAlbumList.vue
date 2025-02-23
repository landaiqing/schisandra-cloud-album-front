<template>
  <div class="thing-album">
    <div class="thing-album-header">

      <AButton type="link" size="large" class="thing-album-button">事物</AButton>

    </div>
    <div class="thing-album-content" v-if="thingAlbumList && thingAlbumList.length>0">
      <div class="thing-album-content-item" v-for="(item, index) in thingAlbumList" :key="index">
        <span class="thing-album-title">{{ getZhCategoryNameByEnName(item.category) }}</span>
        <div class="thing-album-wrapper">
          <div class="thing-album-container" v-for="(tags, indexList) in item.list" :key="indexList"
               @click="handleClick(tags.tag_name,item.category,tags.tag_name)">
            <img class="background-image" :src="tags.cover_image" :alt="tags.tag_name"/>
            <div class="overlay">
              <span>{{ getZhLabelNameByEnName(tags.tag_name) }}</span>
              <span class="thing-album-overlay-count">---</span>
              <span class="thing-album-overlay-count">{{ tags.tag_count }}张照片</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-content">
      <AEmpty :image="empty" :image-style="{width: '100%', height: '100%'}">
        <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  暂无照片，快去上传吧
                </span>
        </template>
      </AEmpty>
    </div>
  </div>
</template>
<script setup lang="ts">


import {queryThingAlbumApi} from "@/api/storage";
import {getZhCategoryNameByEnName, getZhLabelNameByEnName} from "@/constant/coco_ssd_label_category.ts";
import useStore from "@/store";
import empty from "@/assets/svgs/empty.svg";

const thingAlbumList = ref<any[]>([]);

async function getThingAlbumList(provider: string, bucket: string) {
  const res: any = await queryThingAlbumApi(provider, bucket);
  if (res && res.code === 200) {
    thingAlbumList.value = res.data.records;
  }
}

const route = useRoute();
const router = useRouter();
const upload = useStore().upload;

/**
 * 点击事件
 * @param id
 * @param tag
 * @param category
 */
function handleClick(id: string, category: string, tag: string) {
  router.push({path: route.path + `/${id}`, query: {category: category, tag: tag}});
}

onMounted(() => {
  getThingAlbumList(upload.storageSelected?.[0], upload.storageSelected?.[1]);
});

</script>
<style scoped lang="scss">
.thing-album {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  position: relative;

  .thing-album-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .thing-album-button {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
  }

  .thing-album-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding-top: 20px;
    padding-left: 25px;
    gap: 20px;

    .thing-album-content-item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 20px;

      .thing-album-title {
        font-size: 14px;
        color: #999;
      }

      .thing-album-wrapper {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 20px;

        .thing-album-container {
          width: 180px;
          height: 180px;
          position: relative;
          display: inline-block;
          background-color: #f5f5f5;

          .background-image {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.2); /* 黑色半透明 */
            backdrop-filter: blur(2px); /* 背景虚化 */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
            gap: 0;

            .thing-album-overlay-count {
              font-size: 12px;
              color: white;
            }
          }

          .overlay:hover {
            background-color: rgba(0, 0, 0, 0.1); /* 黑色半透明 */
            backdrop-filter: blur(0px); /* 背景虚化 */
            cursor: pointer;
          }
        }
      }

    }

    .thing-album-container:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
