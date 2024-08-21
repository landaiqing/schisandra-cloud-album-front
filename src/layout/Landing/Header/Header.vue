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
                  changeTheme(e.key)
                }">
                  <AMenuItem v-for="(color, name) in variables" :key="name" :value="color">
                    <div
                        v-bind:style="{ backgroundColor: name as string, width: '20px', height: '20px', borderRadius: '20%' }">
                    </div>
                  </AMenuItem>
                </AMenu>
              </template>
              <AButton type="text" size="large">
                <div
                    v-bind:style="{ backgroundColor: app.themeName, width: '20px', height: '20px', borderRadius: '20%' }">
                </div>
              </AButton>
            </ADropdown>

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
              <AButton type="text" size="large">
                {{ lang.lang === 'zh' ? '中文' : 'English' }}
                <DownOutlined/>
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

import router from "@/router/router.ts";
import useStore from "@/store/index.ts";
import {ref} from "vue";
import {DownOutlined} from '@ant-design/icons-vue';
import {useI18n} from "vue-i18n";
import variables from "@/assets/styles/colors.module.scss";

const lang = useStore().lang;
const {t, locale} = useI18n();


async function changeLang(language: any) {
  lang.lang = language;
  locale.value = language;
}

async function changeTheme(theme: any) {
  app.setThemeName(theme);
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  if (!document.startViewTransition) {
    app.toggleDarkMode();
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
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
<style src="./index.scss" scoped>

</style>
