<template>
  <div class="landing-header">
    <div class="landing-header-content">
      <div class="logo" @click="router.push('/')">
        <img class="landing-header-logo" src="@/assets/svgs/logo-album.svg" alt="logo">
        <span class="landing-header-logo-text">S.Album</span>
      </div>
      <div class="menu">
        <AButton type="text" size="large">{{ t('landing.community') }}</AButton>
        <AButton type="text" size="large">{{ t('landing.help') }}</AButton>
        <AButton type="text" size="large">{{ t('landing.development') }}</AButton>
        <AButton href="/login" type="primary" size="large">
          {{ t("landing.immediately") }}
        </AButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


import {useI18n} from "vue-i18n";

const {t} = useI18n();
const router = useRouter();


</script>
<style src="./index.scss" lang="scss" scoped>

</style>
