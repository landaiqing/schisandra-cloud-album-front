<template>
  <div class="comment-main">
    <AFlex :vertical="false" justify="flex-start" class="comment-header">
      <span class="comment-header-title">{{ t('comment.comment') }}</span>
    </AFlex>
    <!-- 评论输入框 -->
    <CommentInput/>
    <ADivider/>
    <!-- 回复列表 -->
    <CommentList/>
  </div>
</template>
<script setup lang="ts">
import CommentInput from "@/components/CommentReply/Components/CommentInput/CommentInput.vue";
import {useI18n} from "vue-i18n";
import CommentList from "@/components/CommentReply/Components/CommentList/CommentList.vue";

const {t} = useI18n();
</script>
<style src="./index.scss" lang="scss" scoped>

</style>
