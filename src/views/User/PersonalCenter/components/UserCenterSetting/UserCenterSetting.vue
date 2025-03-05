<template>
  <div class="user-center-setting">
    <h2>用户设置</h2>
    <div class="user-center-setting-content">
      <div class="user-center-setting-item">
        <span class="user-center-setting-item-title">是否开启AI识别</span>
        <ASwitch/>
      </div>
      <div class="user-center-setting-item">
        <span class="user-center-setting-item-title">是否开启手机上传</span>
        <ASwitch/>
      </div>
      <div class="user-center-setting-item">
        <span class="user-center-setting-item-title">是否公开个人资料</span>
        <ASwitch/>
      </div>
      <div class="user-center-setting-item">
        <span class="user-center-setting-item-title">是否公开个人资料</span>
        <ASwitch/>
      </div>
      <div class="user-center-setting-item">
        <span class="user-center-setting-item-title">是否开启搜索记录</span>
        <ASwitch/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

</script>
<style scoped lang="scss">
.user-center-setting {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .user-center-setting-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 50px;

    .user-center-setting-item {
      width: 350px;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .user-center-setting-item-title {
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
        color: #333333;
      }
    }
  }
}
</style>
