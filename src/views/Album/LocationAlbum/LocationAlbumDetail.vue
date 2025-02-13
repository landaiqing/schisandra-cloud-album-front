<template>
  <div class="location-album-detail">
    <div class="location-album-detail-header">
      <div class="location-detail-content-nav">
        <AButton size="large" type="text" class="location-detail-content-nav-title">地点</AButton>
        <span class="location-detail-content-nav-separator"> > </span>
        <span class="location-detail-content-nav-name">乌鲁木齐</span>
      </div>
    </div>
    <div class="location-album-detail-info">
      <span style="font-size: 14px;color: #999999">共12张照片</span>
    </div>
    <div class="location-album-detail-list">

    </div>

  </div>
</template>
<script setup lang="ts">

</script>
<style scoped lang="scss">
.location-album-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  gap: 10px;
  position: relative;

  .location-album-detail-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .location-detail-content-nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      width: 1000%;
      height: 100%;
      gap: 10px;

      .location-detail-content-nav-title {
        font-size: 20px;
        color: rgb(59, 117, 255);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .location-detail-content-nav-separator {
        font-size: 20px;
        font-weight: bold;
        color: rgba(90, 90, 90, 0.62);
      }

      .location-detail-content-nav-name {
        font-size: 20px;
        color: #333333;
      }
    }
  }

  .location-album-detail-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-left: 15px;
    width: 100%;
    height: 22px;
  }

  .location-album-detail-list {
    width: 99%;
    height: 100%;
    margin-left: 5px;
    background: #e2e2e2;
  }

}

</style>
