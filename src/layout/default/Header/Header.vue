<template>
  <header class="header-main">
    <AFlex :vertical="false" align="center" justify="flex-end" class="header-logo-container">
      <AAvatar :size="50" :src="logo"/>
      <img style="width: 200px;" src="@/assets/images/logo.png" alt="logo">
    </AFlex>
    <AFlex :vertical="false" align="center" justify="flex-end" class="header-menu-container">
      <AFlex :vertical="false" align="center" justify="flex-start" class="header-menu-item">
        <ABadge count="0" :numberStyle="{
          marginTop: '5px',
        }">
          <AButton type="text" shape="circle" size="middle" class="header-menu-item-btn"
                   :icon="h(BellOutlined)"/>
        </ABadge>
      </AFlex>
      <AFlex :vertical="false" align="center" justify="flex-start" class="header-user-container">
        <AAvatar :size="35" class="header-user-avatar" :src="user.user.userInfo.avatar"/>
        <AButton type="text" size="small" class="header-user-btn">landaiqing</AButton>
      </AFlex>
    </AFlex>
  </header>
</template>
<script lang="ts" setup>
import logo from "@/assets/svgs/logo-schisandra.svg";
import useStore from "@/store";
import {BellOutlined} from "@ant-design/icons-vue";
import {h} from "vue";

const user = useStore().user;
</script>
<style scoped lang="scss" src="./index.scss">

</style>
