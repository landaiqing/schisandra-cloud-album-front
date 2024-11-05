<template>
  <div class="main-page">
    <Header/>
    <CommentReply/>

  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
import CommentReply from "@/components/CommentReply/index.vue";
import {h, onMounted, onUnmounted} from "vue";
import Header from "@/layout/default/Header/Header.vue";
import {notification} from "ant-design-vue";
import {SmileOutlined} from "@ant-design/icons-vue";


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
