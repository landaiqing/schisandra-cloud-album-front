<template>
  <AConfigProvider
      :locale="lang.lang === 'en' ? enUS : zhCN"
      :theme="app.themeConfig"
  >
    <router-view v-slot="{ Component, route }">
      <transition name="animation" mode="out-in">
        <component :is="Component" :key="route.path"/>
      </transition>
    </router-view>
  </AConfigProvider>
</template>
<script setup lang="ts">
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import useStore from "@/store/index.ts";

const app = useStore().theme;
const lang = useStore().lang;
</script>
<style scoped lang="scss">
.animation-enter {
  opacity: 0; /* 初始透明 */
}
.animation-enter-active {
  transition: opacity 0.2s; /* 渐入效果 */
}
.animation-leave-active {
  transition: opacity 0.2s; /* 渐出效果 */
}
.animation-leave-to {
  opacity: 0; /* 离开时透明 */
}
</style>
