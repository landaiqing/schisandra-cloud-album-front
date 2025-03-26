<template>
  <div class="account-setting">
    <div class="personal-center-header">
      <Header :logo-color="'black'"/>
    </div>
    <div class="account-setting-container">
      <AccountSettingSidebar/>
      <div class="account-setting-view">
        <router-view/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Header from "@/layout/default/Header/Header.vue";
import AccountSettingSidebar
  from "@/views/User/AccountSetting/components/AccountSettingSidebar/AccountSettingSidebar.vue";
</script>
<style scoped lang="scss">
.account-setting {
  background-color: #eaeef6;

  .personal-center-header {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    background-color: white;
    position: relative;
    z-index: 10;
  }

  .account-setting-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100vh - 70px);
    position: relative;

    .account-setting-view {
      width: calc(100vw - 230px);
      height: calc(100vh - 120px);
      max-height: calc(100vh - 100px);
      padding: 20px;
      overflow: auto;
      transition: all 0.3s ease;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }
    }
  }
}
</style>
