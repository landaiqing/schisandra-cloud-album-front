<template>
  <div class="location-album">
    <div class="location-album-header">
      <AButton type="link" size="large" class="location-album-button">地点</AButton>
      <span class="location-album-count">你一共在2个地点留下足迹</span>
    </div>
    <div class="location-album-content">
      <div class="location-album-container" @click="handleClick">
        <img class="background-image" src="/test/5.png" alt=""/>
        <div class="overlay">
          <span>乌鲁木齐市</span>
          <span class="location-album-overlay-count">---</span>
          <span class="location-album-overlay-count">16张照片</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const router = useRouter();

function handleClick() {
  router.push({ path: route.path + '/1' });
}
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
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding-top: 20px;
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

    .location-album-container:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
