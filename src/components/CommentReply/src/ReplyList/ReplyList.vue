<template>
  <AFlex :vertical="true" class="reply-item-child">
    <ASpin :spinning="comment.replyLoading" size="default">
      <AFlex :vertical="true" v-if="comment.replyList.comments">
        <AFlex :vertical="false" style="margin-top: 5px" v-for="(child, index) in comment.replyList.comments"
               :key="index">
          <AFlex :vertical="true" class="reply-item-child-avatar">
            <AAvatar :size="40" shape="circle" :src="child.avatar"/>
          </AFlex>
          <AFlex :vertical="true" class="reply-item-child-content">
            <AFlex :vertical="true">
              <AFlex :vertical="false" align="center">
                <span class="reply-name-child">{{ child.nickname }}</span>
                <span
                    class="reply-at">@{{ child.reply_username }}</span>
                <a-tag color="cyan" class="reply-tag-child" size="small">Lv.5</a-tag>
                <!--                      <a-tag color="red" class="reply-tag" size="small">UP</a-tag>-->
              </AFlex>
              <AFlex :vertical="false" align="flex-end" justify="space-between">
                <AFlex :vertical="false" align="center" justify="space-between">
                  <span class="reply-ip-child"> {{ child.location }} </span>
                </AFlex>
                <span class="reply-time-child">{{ formatTimeAgo(child.created_time) }}</span>
              </AFlex>
            </AFlex>
            <AFlex :vertical="true" align="center">
              <ACard class="reply-card-child" :body-style="{padding: '10px'}">
                <div class="reply-text-child" v-dompurify-html="child.content">
                </div>
                <AFlex :vertical="false" align="center" class="reply-images" v-if="child.images">
                  <AImagePreviewGroup>
                    <AImagePreviewGroup>
                      <AImage :width="80" :height="80" v-for="(image, index) in child.images" :key="index" :src="image">
                        <template #previewMask>
                          <EyeOutlined style="font-size: 20px;"/>
                        </template>
                      </AImage>
                    </AImagePreviewGroup>
                  </AImagePreviewGroup>
                </AFlex>
                <AFlex :vertical="false" justify="space-between" align="center">
                  <!--评论操作按钮 -->
                  <AFlex :vertical="false" align="center" justify="space-between"
                         class="reply-action-item-child">
                    <AFlex :vertical="false" align="center">
                      <AButton v-if="!child.is_liked" @click="commentLikeThrottled(child)" type="text" size="small"
                               :icon="h(LikeOutlined)" class="reply-action-btn-child">
                        {{ child.likes }}
                      </AButton>
                      <AButton v-if="child.is_liked" @click="cancelCommentLikeThrottled(child)" type="text"
                               size="small"
                               :icon="h(LikeFilled)" style="color: red" class="reply-action-btn-child">
                        {{ child.likes }}
                      </AButton>
                    </AFlex>
                    <AButton
                        @click="comment.handleShowReplyInput(child.id)"
                        type="text" size="small" :icon="h(CommentOutlined)"
                        class="reply-action-btn-child">
                      {{ t('comment.reply') }}
                    </AButton>
                  </AFlex>
                  <!-- 评论操作系统信息-->
                  <AFlex :vertical="false" align="center" justify="flex-end"
                         class="reply-action-item-right-child">
                    <AButton type="text" disabled size="small" :icon="h(WindowsOutlined)"
                             class="reply-action-info-child">
                      {{ child.operating_system }}
                    </AButton>
                    <AButton type="text" disabled size="small" :icon="h(ChromeOutlined)"
                             class="reply-action-info-child">
                      {{ child.browser }}
                    </AButton>
                    <!-- 评论操作按钮 -->
                    <ADropdown trigger="click">
                      <AButton type="text" size="small" :icon="h(EllipsisOutlined)"
                               class="reply-action-btn-child"
                               @click.prevent>
                      </AButton>
                      <template #overlay>
                        <AMenu>
                          <AMenuItem key="report">
                            {{ t('comment.report') }}
                          </AMenuItem>
                          <AMenuItem key="copy">
                            {{ t('comment.copy') }}
                          </AMenuItem>
                          <AMenuItem key="delete">
                            {{ t('comment.delete') }}
                          </AMenuItem>
                        </AMenu>
                      </template>
                    </ADropdown>
                  </AFlex>
                </AFlex>
              </ACard>

              <!-- 子评论回复输入框 -->
              <ReplyReply :child="child" :item="props.item"
                          v-if="comment.showReplyInput && comment.showReplyInput === child.id"/>
            </AFlex>
          </AFlex>
        </AFlex>
        <APagination v-if="comment.replyList.total > 0" class="reply-pagination-child" size="small"
                     :total="comment.replyList.total"
                     :current="comment.replyList.current" :page-size="comment.replyList.size"
                     :default-page-size="comment.replyList.size"
                     @change="replyListThrottled"

        />
      </AFlex>
      <AEmpty :description="null" v-show="!comment.replyList.comments"/>
    </ASpin>
  </AFlex>
</template>
<script lang="ts" setup>

import {h, ref} from "vue";
import {
  ChromeOutlined,
  CommentOutlined,
  EllipsisOutlined,
  LikeFilled,
  LikeOutlined,
  WindowsOutlined
} from "@ant-design/icons-vue";
import {useI18n} from "vue-i18n";
import useStore from "@/store";
import ReplyReply from "@/components/CommentReply/src/ReplyReplyInput/ReplyReply.vue";
import {useThrottleFn} from "@vueuse/core";

const {t} = useI18n();

const comment = useStore().comment;
const user = useStore().user;
const topicId = ref<string>("123");
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

/**
 * 格式化时间
 * @param dateString
 */
function formatTimeAgo(dateString: string) {
  const now: any = new Date();
  const date: any = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    {label: '年', seconds: 31536000},
    {label: '个月', seconds: 2592000},
    {label: '天', seconds: 86400},
    {label: '小时', seconds: 3600},
    {label: '分钟', seconds: 60}
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}前`;
    }
  }

  return `${seconds} 秒前`;
}


const commentLikeThrottled = useThrottleFn(commentLike, 1000);

/**
 *  评论点赞
 * @param item
 */
async function commentLike(item: any) {
  const params: any = {
    comment_id: item.id,
    user_id: user.user.uid,
    topic_id: topicId.value,
  };
  const res: boolean = await comment.commentLike(params);
  if (res) {
    item.is_liked = true;
    item.likes++;
  }
}

const cancelCommentLikeThrottled = useThrottleFn(cancelCommentLike, 1000);

/**
 *  取消评论点赞
 * @param item
 */
async function cancelCommentLike(item: any) {
  const params: any = {
    comment_id: item.id,
    user_id: user.user.uid,
    topic_id: topicId.value,
  };
  const res: boolean = await comment.cancelCommentLike(params);
  if (res) {
    item.is_liked = false;
    item.likes--;
  }
}

/**
 *  获取回复列表 throttled
 */
const replyListThrottled = useThrottleFn(getReplyList, 1000);

/**
 *  获取回复列表
 * @param page
 * @param pageSize
 */
async function getReplyList(page: number, pageSize: number) {
  const params: any = {
    topic_id: topicId.value,
    page: page,
    size: pageSize,
    comment_id: props.item.id,
    user_id: user.user.uid,
  };
  await comment.getReplyList(params);
}
</script>
<style scoped lang="scss" src="./index.scss">

</style>
