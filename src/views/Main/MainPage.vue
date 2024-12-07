<template>
  <div class="main-page">
    <div class="main-header">
      <Header/>
    </div>
    <div class="main-content">
      <Sidebar/>
      <div class="main-content-container">
        <router-view/>
      </div>
    </div>
    <AFloatButtonGroup trigger="click" type="default">
      <template #icon>
        <AAvatar shape="square" :size="20" :src="other"/>
      </template>
      <AFloatButton @click="changeLanguage" tooltip="切换语言">
        <template #icon>
          <AAvatar shape="square" :size="20" :src="translation"/>
        </template>
      </AFloatButton>
      <AFloatButton tooltip="切换主题">
        <template #icon>
          <AAvatar shape="square" :size="20" :src="darkMode"/>
        </template>
      </AFloatButton>
    </AFloatButtonGroup>
  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
// import {h, onMounted, onUnmounted} from "vue";
import Header from "@/layout/default/Header/Header.vue";
// import {notification} from "ant-design-vue";
// import {SmileOutlined} from "@ant-design/icons-vue";
import Sidebar from "@/layout/default/Sidebar/Sidebar.vue";
import {useI18n} from "vue-i18n";
import translation from '@/assets/svgs/translation.svg';
import darkMode from '@/assets/svgs/dark-mode.svg';
import other from '@/assets/svgs/other.svg';
// const websocket = useStore().websocket;
// const userInfo = useStore().user;
const lang = useStore().lang;
const {locale} = useI18n();

/**
 *  切换语言
 */
async function changeLanguage() {
  lang.lang = lang.lang === 'en' ? 'zh' : 'en';
  locale.value = lang.lang;
}

// const wsOptions = {
//   url: import.meta.env.VITE_MESSAGE_SOCKET_URL + "?user_id=" + userInfo.user.uid + "&token=" + userInfo.user.access_token,
// };
//
// onMounted(() => {
//   websocket.initialize(wsOptions);
//   websocket.on("message", async (data: any) => {
//     notification.open({
//       message: '消息来了',
//       description:
//       data,
//       icon: () => h(SmileOutlined, {style: 'color: #108ee9'}),
//     });
//   });
// });
// onUnmounted(() => {
//   websocket.close(false);
// });
</script>
<style scoped lang="less" src="./index.scss">

</style>
