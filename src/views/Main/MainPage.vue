<template>
  <div class="main-page">
    <div class="main-header">
      <Header/>
    </div>
    <div class="main-content">
      <Sidebar/>

      <div class="main-content-container">
<!--        <ACard class="main-container-card">-->
          <router-view/>
<!--        </ACard>-->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
import {h, onMounted, onUnmounted} from "vue";
import Header from "@/layout/default/Header/Header.vue";
import {notification} from "ant-design-vue";
import {SmileOutlined} from "@ant-design/icons-vue";
import Sidebar from "@/layout/default/Sidebar/Sidebar.vue";


const websocket = useStore().websocket;
const userInfo = useStore().user;
const wsOptions = {
  url: import.meta.env.VITE_MESSAGE_SOCKET_URL + "?user_id=" + userInfo.user.uid + "&token=" + userInfo.user.access_token,
};

onMounted(() => {
  websocket.initialize(wsOptions);
  websocket.on("message", async (data: any) => {
    notification.open({
      message: '消息来了',
      description:
      data,
      icon: () => h(SmileOutlined, {style: 'color: #108ee9'}),
    });
  });
});
onUnmounted(() => {
  websocket.close(false);
});
</script>
<style scoped lang="less" src="./index.scss">

</style>
