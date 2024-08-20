<template>
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 20px;">
    <div style="height: 100px;margin-top: 50px;">
      <span style="font-size: 50px; font-weight: bold;">{{ t('landing.title') }}</span>
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
<style scoped lang="scss">

</style>
