<template>
  <div>
    <h1>Welcome to Main Page</h1>
    <AButton @click="handleClick">获取用户数据</AButton>
    {{ data }}
  </div>
</template>
<script setup lang="ts">
import {useRequest} from "alova/client";
import {getUserInfo} from "@/api/user";

const {data, send} = useRequest(getUserInfo, {
  immediate: false
});
const handleClick = () => {
  send();
};
</script>
<style scoped>

</style>
