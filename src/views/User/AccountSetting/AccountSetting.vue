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

  .account-setting-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100vh - 70px);

    .account-setting-view {
      width: calc(100vw - 230px);
      height: calc(100vh - 100px);
      max-height: calc(100vh - 100px);
      padding: 15px;
      overflow: auto;
    }
  }
}
</style>
