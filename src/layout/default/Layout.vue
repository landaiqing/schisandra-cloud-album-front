<template>
  <AConfigProvider
      :theme="{
      token: {
        colorPrimary: '#00b96b',
      },
    }"
  >
    <router-view v-slot="{ Component, route }">
      <transition name="animation" mode="out-in">
        <component :is="Component" :key="route.path"/>
      </transition>
    </router-view>
  </AConfigProvider>
</template>
<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "LayOut"
});
</script>
<style scoped>

</style>
