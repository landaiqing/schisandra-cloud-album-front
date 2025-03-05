<template>
  <div class="account-setting-sidebar">
    <AMenu
        :selectedKeys="[menuStore.accountSettingMenu]"
        :selectable="true"
        :multiple="false"
        mode="vertical"
        :inlineIndent="24"
        :inlineCollapsed="false"
        @select="handleClick"
        style="margin-top: 10px"
    >

      <AMenuItem title="首页" key="home" :style="menuCSSStyle">
        <template #icon>
          <AAvatar shape="square" size="small" :src="home"/>
        </template>
        <span class="ant-menu-item-title">首页</span>
      </AMenuItem>
      <AMenuItem title="我的信息" key="info" :style="menuCSSStyle">
        <template #icon>
          <AAvatar shape="square" size="small" :src="peopleAlbum"/>
        </template>
        <span class="ant-menu-item-title">我的信息</span>
      </AMenuItem>
      <AMenuItem title="存储管理" key="storage" :style="menuCSSStyle">
        <template #icon>
          <AAvatar shape="square" size="small" :src="storage"/>
        </template>
        <span class="ant-menu-item-title">存储管理</span>
      </AMenuItem>

    </AMenu>
  </div>
</template>
<script setup lang="ts">

import useStore from "@/store";
import home from "@/assets/svgs/home.svg";
import peopleAlbum from "@/assets/svgs/people-album.svg";
import storage from "@/assets/svgs/storage.svg";

const menuStore = useStore().menu;
const menuCSSStyle: any = reactive({
  display: 'flex',
  alignItems: 'center',
});
const router = useRouter();

// const route = useRoute();


function handleClick({key}) {
  menuStore.accountSettingMenu = key;
  router.push(`/main/user/setting/${key}`);
}
</script>
<style scoped lang="scss">
.account-setting-sidebar {
  width: 220px;
  height: calc(100vh - 70px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #fff;

  .ant-menu-item-title {
    font-size: 15px;
    margin-left: 10px;
    font-weight: bold;
  }
}
</style>
