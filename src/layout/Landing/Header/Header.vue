<template>
  <div class="landing-header">
    <AFlex :vertical="false" align-items="center" justify-content="space-between">
      <div class="logo">
        <img class="landing-header-logo" src="@/assets/svgs/logo-schisandra.svg" alt="logo">
      </div>
    </AFlex>
    <AFlex :vertical="false" justify="space-between">
      <div style="display: flex; align-items: center;justify-content: center;">
        <div class="toggle-box" style="margin-top: 20px;">
          <input @click="app.toggleDarkMode" v-model="isDarkMode" type="checkbox" name="checkbox1"
                 id="toggle-box-checkbox">
          <label for="toggle-box-checkbox" class="toggle-box-label-left"></label>
          <label for="toggle-box-checkbox" class="toggle-box-label"></label>
        </div>
        <AButton @click="router.push('/login')" type="primary" size="large" style="margin-right: 10px;">立即进入
        </AButton>
      </div>
    </AFlex>

  </div>
</template>
<script setup lang="ts">

import router from "@/router/router.ts";
import useStore from "@/store/index.ts";
import {ref} from "vue";

const app = useStore().theme;
const isDarkMode = ref<boolean>(app.darkMode === "dark");

</script>
<style src="./index.scss" scoped>

</style>
