<template>
  <AButton> 测试页面</AButton>
</template>
<script setup lang="ts">
import useStore from "@/store";

const store = useStore().user;
store.setUser({
  token: "test",
  userId: "1",
});
console.log(store.getUser()?.userId);
</script>
<style src="./index.scss" scoped>
</style>
