<template>
  <AConfigProvider
      :theme="{
      token: {
        colorPrimary: '#00b96b',
      },
    }"
  >
    <router-view>
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
