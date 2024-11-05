<template>
  <header class="header-main">
    <AFlex :vertical="false" align="center" justify="flex-end" class="header-logo-container">
      <AAvatar :size="50" :src="logo"/>
      <img style="width: 200px;" src="@/assets/images/logo.png" alt="logo">
    </AFlex>
    <AFlex :vertical="false" align="center" justify="flex-end" class="header-menu-container">
      <AFlex :vertical="false" align="center" justify="flex-start" class="header-menu-item">
        <ABadge count="0" :numberStyle="{
          marginTop: '5px',
        }">
          <AButton type="text" shape="circle" size="large" class="header-menu-item-btn"
                   :icon="h(BellOutlined)"/>
        </ABadge>
      </AFlex>
      <AFlex :vertical="false" align="center" justify="flex-start" class="header-menu-item">
        <ADropdown>
          <template #overlay>
            <AMenu @click="changeLang">
              <AMenuItem key="zh">{{ t("landing.chinese") }}</AMenuItem>
              <AMenuItem key="en">{{ t("landing.english") }}</AMenuItem>
            </AMenu>
          </template>
          <AButton type="text" shape="circle" size="large" :icon="h(TranslationOutlined)">
          </AButton>
        </ADropdown>
      </AFlex>
      <AFlex :vertical="false" align="center" justify="flex-start" class="header-user-container">
        <AAvatar :size="35" class="header-user-avatar" :src="user.user.avatar"/>
        <AButton type="text" size="small" class="header-user-btn">landaiqing</AButton>
      </AFlex>
    </AFlex>
  </header>
</template>
<script lang="ts" setup>
import logo from "@/assets/svgs/logo-schisandra.svg";
import useStore from "@/store";
import {BellOutlined, TranslationOutlined} from "@ant-design/icons-vue";
import {h} from "vue";
import {useI18n} from "vue-i18n";

const user = useStore().user;
const {t, locale} = useI18n();
const lang = useStore().lang;

/**
 *  切换语言
 * @param language
 */
async function changeLang(language: any) {
  lang.lang = language.key;
  locale.value = language.key;
}
</script>
<style scoped lang="scss" src="./index.scss">

</style>
