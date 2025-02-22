<template>
  <div class="location-album">
    <div class="location-album-header">
      <AButton type="link" size="large" class="location-album-button">地点</AButton>
      <span class="location-album-count">你一共在{{ locationAlbums ? locationAlbums.length : 0 }}个地点留下足迹</span>
    </div>
    <div class="location-album-content">
      <div class="location-album-content-item" v-for="(item, index) in locationAlbums" :key="index">
        <span class="location-album-description">{{ item.location }}</span>
        <div class="location-album-location-list">
          <div class="location-album-container" @click="handleClick(itemList.id,itemList.city)"
               v-for="(itemList, indexItem) in item.list" :key="indexItem">
            <img class="background-image" :src="itemList.cover_image" :alt="itemList.city"/>
            <div class="overlay">
              <span>{{ itemList.city }}</span>
              <span class="location-album-overlay-count">---</span>
              <span class="location-album-overlay-count">{{ itemList.total }}张照片</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {queryLocationAlbumApi} from "@/api/storage";
import useStore from "@/store";

const route = useRoute();
const router = useRouter();
const upload = useStore().upload;

function handleClick(id: number,name: string) {
  router.push({path: route.path + `/${id}`, query: {name: name}});
}

const locationAlbums = ref<any[]>([]);

async function getLocationAlbums(provider: string, bucket: string) {
  const res: any = await queryLocationAlbumApi(provider, bucket);
  if (res && res.code === 200) {
    locationAlbums.value = res.data.records;
  }
}

onMounted(() => {
  getLocationAlbums(upload.storageSelected?.[0], upload.storageSelected?.[1]);
});
</script>
<style scoped lang="scss">
.location-album {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  position: relative;

  .location-album-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .location-album-button {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
      color: #333;
    }

    .location-album-count {
      font-size: 12px;
      color: #999;
    }
  }

  .location-album-content {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding-top: 20px;
    padding-left: 25px;
    gap: 20px;

    .location-album-content-item {
      display: flex;
      flex-direction: column;

      .location-album-description {
        font-size: 13px;
        color: #333;
        padding-bottom: 10px;
      }

      .location-album-location-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 20px;

        .location-album-container {
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

            .location-album-overlay-count {
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


    .location-album-container:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
