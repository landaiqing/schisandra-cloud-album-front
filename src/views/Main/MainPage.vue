<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <Header/>

    <CommentReply/>
  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
import CommentReply from "@/components/CommentReply/index.vue";
import {onMounted} from "vue";
import Header from "@/layout/default/Header/Header.vue";

const websocket = useStore().websocket;
const userInfo = useStore().user;


const wsOptions = {
  url: import.meta.env.VITE_WEB_SOCKET_URL + "?client_id=" + userInfo.user.uid,
};

onMounted(() => {
  websocket.initialize(wsOptions);
  websocket.on("message", async (_data: any) => {
    // notification.open({
    //   message: '消息来了',
    //   description:
    //   data,
    //   icon: () => h(SmileOutlined, {style: 'color: #108ee9'}),
    // });
  });
});


</script>
<style scoped>

</style>
