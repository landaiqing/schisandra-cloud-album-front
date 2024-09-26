<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <AButton @click="handleClick">获取登录用户角色</AButton>
    {{ data }}

    <CommentReply/>
  </div>
</template>
<script setup lang="ts">
import {useRequest} from "alova/client";
import {getUserPermissions} from "@/api/user";
import useStore from "@/store";
import CommentReply from "@/components/CommentReply/index.vue";
import {h, onMounted} from "vue";
import {notification} from "ant-design-vue";
import {SmileOutlined} from "@ant-design/icons-vue";

const websocket = useStore().websocket;
const userInfo = useStore().user;
const {data, send} = useRequest(getUserPermissions, {
  immediate: false
});
const handleClick = () => {

  const userId: string = userInfo.user.uid;
  send(userId);
};

const wsOptions = {
  url: import.meta.env.VITE_WEB_SOCKET_URL + "?client_id=" + userInfo.user.uid,
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


</script>
<style scoped>

</style>
