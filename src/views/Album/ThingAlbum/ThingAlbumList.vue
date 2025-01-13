<template>
  <div class="thing-album">
    <div class="thing-album-header">

      <AButton type="link" size="large" class="thing-album-button">事物</AButton>

    </div>
    <div class="thing-album-content">
      <span class="thing-album-title">动物</span>
      <div class="thing-album-container">
        <img class="background-image" src="/test/7.png" alt=""/>
        <div class="overlay">
          <span>猫</span>
          <span class="thing-album-overlay-count">---</span>
          <span class="thing-album-overlay-count">16张照片</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

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

    .thing-album-title {
      font-size: 14px;
      color: #999;
    }

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

    .thing-album-container:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
