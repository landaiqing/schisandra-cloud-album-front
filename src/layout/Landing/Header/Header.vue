<template>
  <div class="landing-header">
    <div
        style="display: flex; align-items: center;justify-content: space-between; width: 1200px;min-width: 1200px; max-width: 1200px;">
      <AFlex :vertical="false" align-items="center" justify-content="space-between">
        <div class="logo" style="display: flex; align-items: center;justify-content: center;cursor: pointer;">
          <img class="landing-header-logo" src="@/assets/svgs/logo-schisandra.svg" alt="logo">
          <img style="width: 200px;" src="@/assets/images/logo.png" alt="logo">
        </div>
      </AFlex>
      <AFlex :vertical="false" justify="space-between">
        <div style="display: flex; align-items: center;justify-content: center;">
          <div class="toggle-box" style="margin-top: 20px;margin-right: 20px;">
            <input @click="toggleTheme" v-model="isDarkMode" type="checkbox" name="checkbox1"
                   id="toggle-box-checkbox">
            <label for="toggle-box-checkbox" class="toggle-box-label-left"></label>
            <label for="toggle-box-checkbox" class="toggle-box-label"></label>
          </div>
          <div style="margin-right: 20px;">
            <ADropdown>
              <template #overlay>
                <AMenu @click="(e: any)=>{
                  changeLang(e.key)
                }">
                  <AMenuItem key="zh">{{ t("landing.chinese") }}</AMenuItem>
                  <AMenuItem key="en">{{ t("landing.english") }}</AMenuItem>
                </AMenu>
              </template>
              <AButton type="text" size="large" :icon="h(TranslationOutlined)">
              </AButton>
            </ADropdown>

          </div>

          <AButton @click="router.push('/login')" type="primary" size="large" style="margin-right: 10px;">
            {{ t("landing.immediately") }}
          </AButton>
        </div>
      </AFlex>
    </div>
  </div>
</template>
<script setup lang="ts">


import useStore from "@/store/index.ts";
import {h, ref} from "vue";
import {TranslationOutlined} from '@ant-design/icons-vue';
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";

const {t, locale} = useI18n();
const router = useRouter();
const lang = useStore().lang;

async function changeLang(language: any) {
  lang.lang = language;
  locale.value = language;
}


const app = useStore().theme;
const isDarkMode = ref<boolean>(app.darkMode === "dark");

const toggleTheme = (event: any) => {
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
  );

  // 兼容性处理
  if (!document.startViewTransition) {
    app.toggleDarkMode();
    return;
  }

  const transition = document.startViewTransition(async () => {
    app.toggleDarkMode();
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
        {
          clipPath: app.darkMode === "dark" ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          easing: "ease-in",
          pseudoElement: app.darkMode === "dark"
              ? "::view-transition-old(root)"
              : "::view-transition-new(root)",
        }
    );
  });
};

</script>
<style src="./index.scss" lang="scss" scoped>

</style>
