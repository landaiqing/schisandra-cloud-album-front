<template>


</template>
<script setup lang="ts">
import useStore from "@/store";
import {getPrivateImageListApi} from "@/api/storage";

const uploadStore = useStore().upload;

async function getPrivateImageList() {
  const res: any = await getPrivateImageListApi(uploadStore.storageSelected?.[0], uploadStore.storageSelected?.[1], "111");
  console.log(res);
  if (res && res.code === 200) { /* empty */
  }
}

onMounted(() => {
  getPrivateImageList();
});
</script>
<style scoped lang="scss">

</style>
