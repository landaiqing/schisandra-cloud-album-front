<template>
  <AConfigProvider
      :locale="lang.lang === 'en' ? enUS : zhCN"
      :theme="app.themeConfig"
  >
    <router-view v-slot="{ Component }">
      <!--      <transition name="animation" mode="out-in">-->
      <component :is="Component"/>
      <!--      </transition>-->
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
</style>
