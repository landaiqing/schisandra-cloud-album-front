<template>
  <div class="reply">
    <div class="reply-header">
      <!-- 评论列表头部 -->
      <AFlex :vertical="false" justify="space-between" align="center">
        <AFlex :vertical="false">
          <span class="reply-header-title">{{ t('comment.allComments') }}</span>
        </AFlex>
        <AFlex :vertical="false" justify="flex-end">
          <AButton type="text" size="small" @click="getHotCommentList" :icon="h(FireOutlined)"
                   :style="{color: router.currentRoute.value.query.type === 'hot'? '#08a327' : 'var(--text-color)'}"
                   class="reply-header-hot">
            {{ t('comment.hot') }}
          </AButton>
          <AButton type="text" size="small" @click="getLatestCommentList" :icon="h(ClockCircleOutlined)"
                   :style="{color: router.currentRoute.value.query.type === 'latest'? '#08a327' : 'var(--text-color)'}"
                   class="reply-header-latest">
            {{ t('comment.latest') }}
          </AButton>
        </AFlex>
      </AFlex>
    </div>
    <ASkeleton :loading="comment.commentLoading" avatar active :paragraph="{ rows: 4 }">
      <div class="reply-list" v-if="comment.commentList">
        <div class="reply-item" v-for="(item, index) in comment.commentList.comments" :key="index">
          <AFlex :vertical="false" style="margin-top: 5px">
            <!-- 评论头像 -->
            <ABadge :offset="[0,40]" :dot="false">
              <template #count v-if="true">
                <img src="/level_icon/up.svg" style="width: 25px;height: 25px;" alt="up">
              </template>

              <AFlex :vertical="true" class="reply-avatar" v-if="item.avatar">
                <Popover trigger="click" :arrow="false" :offset-x="170" :contentStyle="{padding: 0}" @openChange="(open: boolean)=>{
                  console.log(open);
                }">
                  <template #content>
                    <UserInfoCard :user="item" :padding="0"/>
                  </template>
                  <AAvatar :size="50" class="reply-avatar-img" shape="circle" :src="item.avatar"/>
                </Popover>
              </AFlex>
            </ABadge>
            <!-- 评论内容 -->
            <AFlex :vertical="true" class="reply-content">
              <AFlex :vertical="true">
                <AFlex :vertical="false" align="center" justify="flex-start">
                  <Popover trigger="click" :arrow="false" :offset-x="170" :contentStyle="{padding: 0}">
                    <template #content>
                      <UserInfoCard :user="item" :padding="0"/>
                    </template>
                    <span class="reply-name">{{ item.nickname }}</span>
                  </Popover>
                  <img src="/level_icon/icon/lv1.png" class="reply-level-icon" alt="level">
                </AFlex>
                <AFlex :vertical="false" align="flex-end" justify="space-between">
                  <AFlex :vertical="false" align="center" justify="space-between">
                    <span class="reply-ip"> {{ item.location }} </span>
                  </AFlex>
                  <span class="reply-time">{{ formatTimeAgo(item.created_time) }}</span>
                </AFlex>
              </AFlex>
              <AFlex :vertical="false" align="center">

                <ACard class="reply-card" :body-style="{padding: '10px'}">
                  <div class="reply-text" v-dompurify-html="item.content">
                  </div>
                  <AFlex :vertical="false" align="center" class="reply-images" v-if="item.images">
                    <AImagePreviewGroup>
                      <ASpace direction="horizontal">
                        <AImage :width="80" :height="80" v-for="(image, index) in item.images" :key="index"
                                :src="image">
                          <template #previewMask>
                            <EyeOutlined style="font-size: 20px;"/>
                          </template>
                        </AImage>
                      </ASpace>
                    </AImagePreviewGroup>
                  </AFlex>
                  <AFlex :vertical="false" justify="space-between" align="center">
                    <!--评论操作按钮 -->
                    <AFlex :vertical="false" align="center" justify="space-between" class="reply-action-item">
                      <AFlex :vertical="false" align="center">
                        <AButton v-if="!item.is_liked" @click="commentLikeThrottled(item)" type="text" size="small"
                                 :icon="h(LikeOutlined)" class="reply-action-btn">
                          {{ item.likes }}
                        </AButton>
                        <AButton v-if="item.is_liked" @click="cancelCommentLikeThrottled(item)" type="text"
                                 size="small"
                                 :icon="h(LikeFilled)" style="color: red" class="reply-action-btn">
                          {{ item.likes }}
                        </AButton>
                      </AFlex>
                      <AButton @click="()=>{
                          comment.handleShowCommentReply(item.id);
                          replyListThrottled(item.id)}" type="text" size="small"
                               :icon="h(MessageOutlined)"
                               :disabled="item.reply_count === 0"
                               v-show="item.reply_count > 0"
                               class="reply-action-btn">
                        {{ t('comment.view') }}{{
                          item.reply_count >= 99 ? '99+' : item.reply_count
                        }}{{ t("comment.replies") }}
                      </AButton>
                      <AButton
                          @click="comment.handleShowReplyInput(item.id)"
                          type="text" size="small" :icon="h(CommentOutlined)"
                          class="reply-action-btn">
                        {{ t('comment.reply') }}
                      </AButton>
                    </AFlex>
                    <!-- 评论操作系统信息-->
                    <AFlex :vertical="false" align="center" justify="flex-end" class="reply-action-item-right">
                      <AButton type="text" disabled size="small" :icon="h(WindowsOutlined)" class="reply-action-info">
                        {{ item.operating_system }}
                      </AButton>
                      <AButton type="text" disabled size="small" :icon="h(ChromeOutlined)" class="reply-action-info">
                        {{ item.browser }}
                      </AButton>
                      <!-- 评论操作按钮 -->
                      <ADropdown trigger="click" @click.prevent>
                        <AButton type="text" size="small" :icon="h(EllipsisOutlined)" class="reply-action-btn"
                                 @click.prevent>
                        </AButton>
                        <template #overlay>
                          <AMenu>
                            <AMenuItem key="report" @click="comment.openReportMessage(item.id)">
                              <WarningOutlined/>
                              {{ t('comment.report') }}
                            </AMenuItem>
                          </AMenu>
                        </template>
                      </ADropdown>
                    </AFlex>
                  </AFlex>
                </ACard>

              </AFlex>
              <!-- 回复输入框 -->
              <ReplyInput :item="item" v-show="comment.showReplyInput && item.id === comment.showReplyInput"/>
              <!-- 子回复列表 -->
              <ReplyList :item="item" v-show="comment.showCommentReply && item.id === comment.showCommentReply"/>
            </AFlex>
          </AFlex>
        </div>
        <APagination v-if="comment.commentList.total > 5" class="reply-pagination" @change="paginationCommentChange"
                     :current="Number(router.currentRoute.value.query.page) ||  comment.commentList.current"
                     :page-size="comment.commentList.size" :total="comment.commentList.total"
                     :default-page-size="comment.commentList.size"
                     :show-less-items="true"/>
      </div>
      <AEmpty :description="null" v-show="!comment.commentList.comments"/>
    </ASkeleton>

    <MessageReport/>
  </div>
</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {h, onMounted, ref} from "vue";
import {
  ChromeOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  EllipsisOutlined,
  FireOutlined,
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  WindowsOutlined
} from "@ant-design/icons-vue";
import {useThrottleFn} from "@vueuse/core";
import useStore from "@/store";
import {useRouter} from "vue-router";
import ReplyInput from "@/components/CommentReply/src/ReplyInput/ReplyInput.vue";
import ReplyList from "@/components/CommentReply/src/ReplyList/ReplyList.vue";
import MessageReport from "@/components/CommentReply/src/MessageReport/MessageReport.vue";
import UserInfoCard from "@/components/CommentReply/src/UserInfoCard/UserInfoCard.vue";


const {t} = useI18n();
const router = useRouter();
const comment = useStore().comment;


const topicId = ref<string>("123");


/**
 *  获取评论列表
 */
async function getCommentList(page: number = 1, size: number = 5, hot: boolean = true) {
  const params = {
    topic_id: topicId.value,
    page: page,
    size: size,
    is_hot: hot,
  };
  await comment.getCommentList(params);
}

/**
 *  格式化时间
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


/**
 *  获取回复列表 throttled
 */
const replyListThrottled = useThrottleFn(getReplyList, 1000);

/**
 *  获取回复列表
 * @param reply_id
 * @param page
 * @param size
 */
async function getReplyList(reply_id: number, page: number = 1, size: number = 5) {
  const params: any = {
    topic_id: topicId.value,
    page: page,
    size: size,
    comment_id: reply_id,
  };
  await comment.getReplyList(params);
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
 *  评论分页器 change 事件
 * @param page
 * @param pageSize
 */
async function paginationCommentChange(page: number, pageSize: number) {
  router.push({
    path: "/main",
    query: {
      type: router.currentRoute.value.query.type,
      page: page,
    }
  });
  await getCommentList(page, pageSize);
}

/**
 *  热门评论
 */
async function getHotCommentList() {
  comment.commentLoading = true;
  getCommentList(1, 5, true).then(() => {
    router.push({
      path: "/main",
      query: {
        type: "hot",
        page: router.currentRoute.value.query.page,
      }
    });
    comment.commentLoading = false;
  });

}

/**
 *  最新评论
 */
async function getLatestCommentList() {
  comment.commentLoading = true;
  getCommentList(1, 5, false).then(() => {
    router.push({
      path: "/main",
      query: {
        type: "latest",
        page: router.currentRoute.value.query.page,
      }
    });
    comment.commentLoading = false;
  });

}

onMounted(() => {
  const page = Number(router.currentRoute.value.query.page) || 1;
  getCommentList(page);
});
</script>

<style scoped lang="scss" src="./index.scss">
</style>
