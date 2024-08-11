<template>
  <div>
    <AConfigProvider :theme="app.themeConfig">
      <ASelect v-model:value="app.themeName" style="width: 240px">
        <ASelectOption v-for="(color, name) in variables" :key="color" :value="name"> {{ name }}:{{
            color
          }}
        </ASelectOption>
      </ASelect>
      <ASelect v-model:value="app.darkMode" style="width: 120px">
        <ASelectOption value="dark">dark</ASelectOption>
        <ASelectOption value="light">light</ASelectOption>
      </ASelect>
      <AButtonGroup>
        <AButton type="primary">切换主题- {{ app.themeName }}</AButton>
        <AButton @click="app.toggleDarkMode">切换模式{{ app.darkModeComp }}</AButton>
      </AButtonGroup>
      <div class="test">test</div>
    </AConfigProvider>
    <DynamicTitle/>
  </div>
</template>
<script setup>

import variables from "@/assets/styles/colors.module.scss";
import useStore from "@/store/index.ts";
import DynamicTitle from "@/components/DynamicTitle/DynamicTitle.vue";


const app = useStore().theme;


</script>
<style lang="scss" scoped>
@import "@/assets/styles/theme.scss";

.test {
  @include useTheme {
    background: getModeVar('primary');
    color: getColor('info');;
  }
}
</style>

