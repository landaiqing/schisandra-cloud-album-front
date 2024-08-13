<template>
  <div class="test">
    <AButton @click="handleClick"> {{ t('login.title') }}</AButton>
    <AButton @click="changeLang('zh')"> 切换中文</AButton>
    <AButton @click="changeLang('en')"> 切换英文</AButton>

    <ADatePicker/>
    <ATimePicker/>
    {{ data }}
  </div>
</template>
<script setup lang="ts">
import {useRequest} from "alova/client";
import {getUserInfo} from "@/api/user";
import {useI18n} from "vue-i18n";
import useStore from "@/store";

const {t, locale} = useI18n();
const {data, send} = useRequest(getUserInfo, {
  immediate: false
});
const handleClick = () => {
  send();
};


const lang = useStore().lang;

async function changeLang(language: any) {
  lang.lang = language;
  locale.value = language;
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/theme.scss";

.test {
  @include useTheme {
    background: getModeVar('primary');
    color: getColor('info');
  }
}
</style>
