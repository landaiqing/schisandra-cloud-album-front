<template>
  <AFlex :vertical="true" class="reply-input-main">
    <AFlex :vertical="false" align="center" class="reply-input-header">
      <span class="reply-input-title">{{ t('comment.reply') + '：' }}</span>
      <span class="reply-input-author">{{ props.item.nickname }}</span>
      <AButton @click="comment.closeReplyInput" type="dashed" size="small" :icon="h(CloseOutlined )"
               class="reply-input-cancel">
        {{ t('comment.cancelReply') }}
      </AButton>
    </AFlex>

    <AFlex :vertical="false" class="reply-input-content">
      <!-- 评论输入框 -->
      <AFlex :vertical="true" class="reply-input-content-text">
        <ATextarea :rows="3" class="comment-text-reply"
                   v-model:value="replyContent"
                   @keyup.ctrl.enter="showSlideCaptcha"
                   :placeholder="t('comment.placeholder')" allow-clear :showCount="false"/>
        <AFlex :vertical="false" align="center" justify="space-between" class="comment-actions-reply"
        >
          <AFlex :vertical="false" align="center">
            <AFlex :vertical="false" align="center" class="comment-action-item-reply">
              <APopover trigger="click" placement="bottom">
                <template #content>
                  <div style="width: 250px;height: 200px;overflow: auto;">
                    <AList :grid="{ gutter: 0, column: 4 }" :data-source="comment.emojiList">
                      <template #renderItem="{ item }">
                        <AListItem style="display: flex;align-items: center;justify-content: center;">
                          <AButton @click="insertEmojiToReplyContent(item.name)" type="text" shape="circle"
                                   size="large"
                                   class="comment-emoji-item">
                            <template #icon>
                              <img :width="35" :height="35" loading="lazy" :src="item.path"
                                   :alt="item.name"/>
                            </template>
                          </AButton>
                        </AListItem>
                      </template>
                    </AList>
                  </div>
                </template>
                <AButton type="text" size="small" :icon="h(SmileOutlined)"
                         class="comment-action-icon-reply">
                  {{ t('comment.emoji') }}
                </AButton>
              </APopover>
            </AFlex>
            <AFlex :vertical="false" align="center" class="comment-action-item-reply">
              <AUpload
                  :accept="'image/jpg, image/png, image/jpeg'"
                  name="images"
                  :max-count="3"
                  :multiple="true"
                  method="post"
                  :directory="false"
                  :show-upload-list="false"
                  :custom-request="comment.customUploadRequest"
                  :before-upload="comment.beforeUpload"
                  :disabled="comment.uploadLoading"
              >
                <ABadge>
                  <AButton type="text" size="small" :icon="h(PictureOutlined)"
                           class="comment-action-icon-reply" :loading="comment.uploadLoading">
                    {{ t('comment.picture') }}
                  </AButton>
                </ABadge>
              </AUpload>
              <template v-if="comment.imageList">
                <AImagePreviewGroup>
                  <ABadge style="margin-left: 10px;">
                    <template #count>
                      <CloseCircleOutlined @click="comment.removeBase64Image()" style="color: #f5222d"/>
                    </template>
                    <AAvatar shape="square" size="small">
                      <template #icon>
                        <AImage  :width="24" :height="24" :src="comment.imageList"/>
                      </template>
                    </AAvatar>
                  </ABadge>
                </AImagePreviewGroup>
              </template>
            </AFlex>
          </AFlex>
          <AFlex :vertical="false" align="center">
            <AButton @click="showSlideCaptcha" type="primary" size="middle"
                     :disabled="replyContent.trim().length === 0"
                     class="comment-action-btn-reply">
              {{ t('comment.sendComment') }}
            </AButton>
          </AFlex>
        </AFlex>
      </AFlex>
    </AFlex>

    <AModal v-model:open="showSubmitCaptcha" :footer="null" :closable="false" width="375" :centered="true"
            :maskClosable="false" :bodyStyle="{padding: 0}">
      <gocaptcha-slide
          :config="{}"
          :data="comment.slideCaptchaData"
          :events="commentSlideCaptchaEvent"
      />
    </AModal>
  </AFlex>
</template>
<script lang="ts" setup>

import {h, ref} from "vue";
import {message} from "ant-design-vue";
import {CloseOutlined, PictureOutlined, SmileOutlined} from "@ant-design/icons-vue";
import {useI18n} from "vue-i18n";
import useStore from "@/store";
import {useDebounceFn, useThrottleFn} from "@vueuse/core";
import {replySubmitApi} from "@/api/comment";

const {t} = useI18n();
const comment = useStore().comment;
const user = useStore().user;
const replyContent = ref<string>("");
const showSubmitCaptcha = ref<boolean>(false);
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  topicId: {
    type: String,
    required: true
  },
});
const commentSlideCaptchaEvent = {
  confirm: async (point: any) => {
    await replySubmitDebounced(point);
  },
  close: async () => {
    showSubmitCaptcha.value = false;
  },
  refresh: () => {
    getSlideCaptchaDataThrottled();
  },
};

/**
 *  插入表情到回复内容
 * @param emoji
 */
async function insertEmojiToReplyContent(emoji: string) {
  replyContent.value += "[" + emoji + "]";
}


/**
 *  回复提交 throttled
 */
const replySubmitDebounced = useDebounceFn(replySubmit, 500);

/**
 *  回复提交
 */
async function replySubmit(point: any) {
  if (replyContent.value.trim() === "") {
    return;
  }
  const content = replyContent.value.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
  const regex = /\[((1[0-6][0-6]|[1-9]?[0-9])\.gif)\]/g; // 匹配 [1.gif] 的字符串
  const contentWithEmoji = content.replace(regex, (_match, p1) => {
    return `<img width="30px" height="30px" loading="lazy" src="/emoji/qq/gif/${p1}" alt="emoji ${p1}" />`;
  });
  const replyParams: {
    images: any;
    reply_id: number;
    reply_user: string;
    author: any;
    topic_id: string;
    content: any;
    point: [number, number];
    key: any;
  } = {
    topic_id: props.topicId,
    content: contentWithEmoji,
    images: comment.imageList,
    author: user.user.uid,
    reply_id: props.item.id,
    reply_user: props.item.user_id,
    point: [point.x, point.y],
    key: comment.slideCaptchaData.captKey,
  };
  const result: any = await replySubmitApi(replyParams);
  if (result && result.code === 200) {
    const tmpData: any = {
      id: result.data.id,
      content: result.data.content,
      images: comment.imageList,
      reply_id: result.data.reply_id,
      user_id: result.data.user_id,
      author: result.data.author,
      created_time: result.data.created_time,
      browser: result.data.browser,
      operating_system: result.data.operating_system,
      location: result.data.location,
      reply_count: 0,
      likes: 0,
      reply_user: result.data.reply_user,
      nickname: user.user.nickname,
      avatar: user.user.avatar,
      is_liked: false,
      reply_nickname: props.item.nickname,
    };
    if (!comment.replyVisibility[props.item.id].data) {
      comment.replyVisibility[props.item.id].data.comments = []; // 初始化 comments 数组
    }
    comment.replyVisibility[props.item.id].data.comments.unshift(tmpData);
    comment.commentMap[props.item.id].reply_count++;
    comment.replyVisibility[props.item.id].visible = true;
    comment.closeReplyInput();
    replyContent.value = "";
    await comment.clearFileList();
    showSubmitCaptcha.value = false;
    comment.replyLoading[props.item.id] = false;
    message.success(t('comment.replySuccess'));
  } else {
    await comment.getSlideCaptchaData();
    message.warning(t('comment.replyError'));
  }
}

const getSlideCaptchaDataThrottled = useThrottleFn(comment.getSlideCaptchaData, 1000);

/**
 * 显示滑动验证码
 */
async function showSlideCaptcha() {
  if (replyContent.value.trim() === "") {
    message.warning(t('comment.commentContentNotEmpty'));
    return;
  }
  const res = await comment.getSlideCaptchaData();
  if (res) {
    showSubmitCaptcha.value = true;
  }
}
</script>
<style scoped lang="scss" src="./index.scss">

</style>
