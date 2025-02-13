<template>
  <div class="people-album-detail">
    <div class="people-album-detail-header">
      <div class="people-album-detail-nav">
        <AButton type="text" size="large" class="people-album-detail-nav-button">
          <template #icon>
            <LeftOutlined style="font-size: 13px;font-weight: bolder"/>
          </template>
          返回
        </AButton>
      </div>
      <div class="people-album-detail-toolbar">
        <AAvatar shape="circle" size="default"></AAvatar>
        <span style="font-size: 14px;color: #333333">张皓扬</span>
      </div>
    </div>
    <div class="people-album-detail-info">
      <span style="font-size: 14px;color: #999999">共12张照片</span>
    </div>
    <div class="people-album-detail-list">

    </div>
  </div>
</template>
<script setup lang="ts">

</script>
<style scoped lang="scss">
.people-album-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  gap: 10px;
  position: relative;

  .people-album-detail-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .people-album-detail-nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      width: 8%;
      height: 100%;

      .people-album-detail-nav-button {
        font-size: 20px;
        color: rgb(59, 117, 255);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    }

    .people-album-detail-toolbar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      width: 72%;
      height: 100%;
    }
  }

  .people-album-detail-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-left: 10px;
    width: 100%;
    height: 22px;
  }

  .people-album-detail-list {
    width: 99%;
    height: 100%;
    margin-left: 10px;
    background: #e2e2e2;
  }
}

</style>
