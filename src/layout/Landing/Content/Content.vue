<template>
  <div class="landing-content">
    <div class="landing-content-title">
      <span class="landing-content-title-text">{{ t('landing.title') }}</span>
    </div>
    <Card3D/>
    <Clouds/>
  </div>
</template>
<script setup lang="ts">

import Card3D from "@/components/Card3D/Card3D.vue";
import Clouds from "@/components/Clouds/Clouds.vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
</script>
<style scoped lang="scss" src="./index.scss">

</style>
