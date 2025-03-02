<template>
  <ADrawer v-model:open="shareStore.openCommentDrawer" placement="right" title="评论" width="750px"
           :bodyStyle="drawerCSS"
           @close="shareStore.setOpenCommentDrawer(false)">
    <CommentReply :topic-id="topicId"/>
  </ADrawer>
</template>
<script setup lang="ts">

import useStore from "@/store";
import CommentReply from "@/components/CommentReply/index.vue";

const shareStore = useStore().share;

defineProps({
  topicId: {
    type: String,
    required: true,
  },
});


const drawerCSS = computed(() => {
  return {
    'display': 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    'justify-content': 'flex-start',
  };
});

</script>
<style scoped lang="scss">

</style>
