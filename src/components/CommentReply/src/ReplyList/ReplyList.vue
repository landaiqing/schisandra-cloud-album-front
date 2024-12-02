<template>
  <AFlex :vertical="true" class="reply-item-child">
    <ASpin :delay="500" :spinning="comment.replyLoading[item.id]" size="default">
      <AFlex :vertical="true" v-if="comment.replyVisibility[item.id]?.data.comments">
        <AFlex :vertical="false" style="margin-top: 5px"
               v-for="(child, index) in comment.replyVisibility[item.id]?.data.comments"
               :key="index">
          <AFlex :vertical="true">
            <Popover trigger="click" :arrow="false" :offset-x="170" :contentStyle="{padding: 0}">
              <template #content>
                <UserInfoCard :user="child" :padding="0"/>
              </template>
              <ABadge :offset="[0,35]" :dot="false">
                <template #count v-if="true">
                  <img src="/level_icon/up.svg" style="width: 20px;height: 20px;" alt="up">
                </template>
                <AAvatar :size="40" shape="circle" class="reply-item-child-avatar" :src="child.avatar"/>
              </ABadge>
            </Popover>
          </AFlex>
          <AFlex :vertical="true" class="reply-item-child-content">
            <AFlex :vertical="true">
              <AFlex :vertical="false" align="center">
                <Popover trigger="click" :arrow="false" :offset-x="170" :contentStyle="{padding: 0}">
                  <template #content>
                    <UserInfoCard :user="child" :padding="0"/>
                  </template>
                  <span class="reply-name-child">{{ child.nickname }}</span>
                </Popover>
                <Popover trigger="click" :arrow="false" :offset-x="170" :contentStyle="{padding: 0}">
                  <template #content>
                    <UserInfoCard :user="child" :padding="0"/>
                  </template>
                  <span
                      class="reply-at">@{{ child.reply_nickname }}</span>
                </Popover>
                <a-tag color="cyan" class="reply-tag-child" size="small">Lv.5</a-tag>
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
                      <ASpace direction="horizontal">
                        <AImage :width="80" :height="80" v-for="(image, index) in child.images" :key="index"
                                :src="image">
                          <template #previewMask>
                            <EyeOutlined style="font-size: 20px;"/>
                          </template>
                        </AImage>
                      </ASpace>
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
                          <AMenuItem key="report" @click="comment.openReportMessage(child.id)">
                            <WarningOutlined/>
                            {{ t('comment.report') }}
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
        <APagination v-if="comment.replyVisibility[item.id]?.data.total > 5" class="reply-pagination-child" size="small"
                     :total="comment.replyVisibility[item.id]?.data.total"
                     :current="comment.replyVisibility[item.id]?.data.current"
                     :page-size="comment.replyVisibility[item.id]?.data.size"
                     :default-page-size="comment.replyVisibility[item.id]?.data.size"
                     @change="replyListThrottled"

        />
      </AFlex>
      <AEmpty :description="null" v-show="!comment.replyVisibility[item.id]?.data.comments"/>
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
import UserInfoCard from "@/components/CommentReply/src/UserInfoCard/UserInfoCard.vue";

const {t} = useI18n();

const comment = useStore().comment;
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
  if (seconds < 60) {
    return '刚刚';
  }
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
  };
  await comment.getReplyList(params);
}
</script>
<style scoped lang="scss" src="./index.scss">

</style>
