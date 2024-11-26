<template>
  <div class="landing-header">
    <div
        class="landing-header-content">
      <AFlex :vertical="false" align-items="center" justify-content="space-between">
        <div class="logo" @click="router.push('/')">
          <img class="landing-header-logo" src="@/assets/svgs/logo-album.svg" alt="logo">
          <span class="landing-header-logo-text">S.Album</span>
        </div>
      </AFlex>
      <AFlex :vertical="false" justify="space-between">
        <AFlex :vertical="false" justify="space-between" class="landing-header-menu">
          <!--          <div class="toggle-box" style="margin-top: 20px;margin-right: 20px;">-->
          <!--            <input @click="toggleTheme" v-model="isDarkMode" type="checkbox" name="checkbox1"-->
          <!--                   id="toggle-box-checkbox">-->
          <!--            <label for="toggle-box-checkbox" class="toggle-box-label-left"></label>-->
          <!--            <label for="toggle-box-checkbox" class="toggle-box-label"></label>-->
          <!--          </div>-->
          <!--          <div style="margin-right: 20px;">-->
          <!--            <ADropdown>-->
          <!--              <template #overlay>-->
          <!--                <AMenu @click="(e: any)=>{-->
          <!--                  changeLang(e.key)-->
          <!--                }">-->
          <!--                  <AMenuItem key="zh">{{ t("landing.chinese") }}</AMenuItem>-->
          <!--                  <AMenuItem key="en">{{ t("landing.english") }}</AMenuItem>-->
          <!--                </AMenu>-->
          <!--              </template>-->
          <!--              <AButton type="text" size="large" :icon="h(TranslationOutlined)">-->
          <!--              </AButton>-->
          <!--            </ADropdown>-->
          <!--          </div>-->
          <AFlex :vertical="false" justify="space-around" style="padding: 0 20px; ">
            <AButton type="text" size="large">{{ t('landing.home') }}</AButton>
            <AButton type="text" size="large">{{ t('landing.community') }}</AButton>
            <AButton type="text" size="large">{{ t('landing.help') }}</AButton>
            <AButton type="text" size="large">{{ t('landing.development') }}</AButton>
          </AFlex>
          <AButton href="/login" type="primary" size="large" style="margin-right: 10px;">
            {{ t("landing.immediately") }}
          </AButton>
        </AFlex>
      </AFlex>
    </div>
  </div>
</template>
<script setup lang="ts">


import {useI18n} from "vue-i18n";

const {t} = useI18n();
const router = useRouter();
// const lang = useStore().lang;

// async function changeLang(language: any) {
//   lang.lang = language;
//   locale.value = language;
// }
//
//
// const app = useStore().theme;
// const isDarkMode = ref<boolean>(app.darkMode === "dark");
//
// const toggleTheme = (event: any) => {
//   const x = event.clientX;
//   const y = event.clientY;
//   const endRadius = Math.hypot(
//       Math.max(x, innerWidth - x),
//       Math.max(y, innerHeight - y)
//   );
//
//   // 兼容性处理
//   if (!document.startViewTransition) {
//     app.toggleDarkMode();
//     return;
//   }
//
//   const transition = document.startViewTransition(async () => {
//     app.toggleDarkMode();
//   });
//
//   transition.ready.then(() => {
//     const clipPath = [
//       `circle(0px at ${x}px ${y}px)`,
//       `circle(${endRadius}px at ${x}px ${y}px)`,
//     ];
//     document.documentElement.animate(
//         {
//           clipPath: app.darkMode === "dark" ? [...clipPath].reverse() : clipPath,
//         },
//         {
//           duration: 400,
//           easing: "ease-in",
//           pseudoElement: app.darkMode === "dark"
//               ? "::view-transition-old(root)"
//               : "::view-transition-new(root)",
//         }
//     );
//   });
// };

</script>
<style src="./index.scss" lang="scss" scoped>

</style>
