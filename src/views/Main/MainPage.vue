<template>
  <div>
    <h1>Welcome to Main Page</h1>
    <AButton @click="handleClick">获取登录用户角色</AButton>
    {{ data }}
    <CommentReply/>
  </div>
</template>
<script setup lang="ts">
import {useRequest} from "alova/client";
import {getUserPermissions} from "@/api/user";
import useStore from "@/store";
import CommentReply from "@/components/CommentReply/CommentReply.vue";

const {data, send} = useRequest(getUserPermissions, {
  immediate: false
});
const handleClick = () => {
  const userInfo = useStore().user;
  const userId: string = userInfo.user.uid;
  send(userId);
};
</script>
<style scoped>

</style>
