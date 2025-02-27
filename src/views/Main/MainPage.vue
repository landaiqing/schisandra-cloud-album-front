<template>
  <div class="main-page">
    <div class="main-header">
      <Header :logo-color="`black`"/>
    </div>
    <div class="main-content">
      <Sidebar/>
      <div class="main-content-container">
        <router-view/>
      </div>
    </div>
    <AFloatButtonGroup trigger="click" type="default">
      <template #icon>
        <AAvatar shape="square" :size="20" :src="other"/>
      </template>
      <AFloatButton @click="changeLanguage" tooltip="切换语言">
        <template #icon>
          <AAvatar shape="square" :size="20" :src="translation"/>
        </template>
      </AFloatButton>
      <AFloatButton tooltip="切换主题">
        <template #icon>
          <AAvatar shape="square" :size="20" :src="darkMode"/>
        </template>
      </AFloatButton>
    </AFloatButtonGroup>
  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
import Header from "@/layout/default/Header/Header.vue";
import Sidebar from "@/layout/default/Sidebar/Sidebar.vue";
import {useI18n} from "vue-i18n";
import translation from '@/assets/svgs/translation.svg';
import darkMode from '@/assets/svgs/dark-mode.svg';
import other from '@/assets/svgs/other.svg';

const lang = useStore().lang;
const {locale} = useI18n();

/**
 *  切换语言
 */
async function changeLanguage() {
  lang.lang = lang.lang === 'en' ? 'zh' : 'en';
  locale.value = lang.lang;
}

</script>
<style scoped lang="less" src="./index.scss">

</style>
