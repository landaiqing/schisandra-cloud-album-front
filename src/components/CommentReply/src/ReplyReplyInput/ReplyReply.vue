<template>
  <AFlex :vertical="true" class="reply-input-main-child"
         v-if="comment.showReplyInput && child.id === comment.showReplyInput">
    <AFlex :vertical="false" align="center" class="reply-input-header-child">
      <span class="reply-input-title-child">{{ t('comment.reply') + '：' }}</span>
      <span class="reply-input-author-child">{{ props.child.nickname }}</span>
      <AButton @click="comment.closeReplyInput" type="dashed" size="small"
               :icon="h(CloseOutlined )"
               class="reply-input-cancel-child">
        {{ t('comment.cancelReply') }}
      </AButton>
    </AFlex>

    <AFlex :vertical="false" class="reply-input-content-child">
      <!-- 评论输入框 -->
      <AFlex :vertical="true" class="reply-input-content-text-child">
        <ATextarea :rows="3" class="comment-text-reply-child"
                   v-model:value="replyReplyContent"
                   @keyup.ctrl.enter="showSlideCaptcha"
                   :placeholder="commentTextAreaPlaceholder" allow-clear :showCount="false"/>
        <AFlex :vertical="false" align="center" justify="space-between"
               class="comment-actions-reply-child"
        >
          <AFlex :vertical="false" align="center">
            <AFlex :vertical="false" align="center" class="comment-action-item-reply-child">
              <APopover trigger="click" placement="bottom">
                <template #content>
                  <ATabs v-model:active-key="emojiType" @change="changeEmojiType">
                    <ATabPane key="qq">
                      <template #tab>
                        <AFlex :vertical="false" align="center">
                          <SmileOutlined style="font-size: 18px;"/>
                        </AFlex>
                      </template>
                      <div style="width: 250px;height: 200px;overflow: auto;">
                        <AList :grid="{ gutter: 0, column: 4 }" :data-source="currentEmojiList">
                          <template #loadMore>
                            <ADivider v-show="currentEmojiListSize<comment.emojiList.length">
                              <AButton type="text" size="small" @click="loadMoreEmoji">{{
                                  t('comment.loadingMore')
                                }}
                              </AButton>
                            </ADivider>
                            <ADivider v-show="currentEmojiListSize>=comment.emojiList.length">
                              {{ t('comment.noMore') }}
                            </ADivider>
                          </template>
                          <template #renderItem="{ item }">
                            <AListItem style="display: flex;align-items: center;justify-content: center;">
                              <AButton @click="insertEmojiToReplyReplyContent(item.name)" type="text" shape="circle"
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
                    </ATabPane>
                    <ATabPane key="lottie">
                      <template #tab>
                        <AFlex :vertical="false" align="center">
                          <StarOutlined style="font-size: 18px;"/>
                        </AFlex>
                      </template>
                      <div style="width: 250px;height: 200px;overflow: auto;">
                        <AList :grid="{ gutter: 0, column: 3 }" :data-source="currentLottieEmojiList">
                          <template #loadMore>
                            <ADivider v-show="currentLottieEmojiListSize<comment.lottieEmojiList.length">
                              <AButton type="text" size="small" @click="loadMoreLottieEmoji">{{
                                  t('comment.loadingMore')
                                }}
                              </AButton>
                            </ADivider>
                            <ADivider v-show="currentLottieEmojiListSize>=comment.lottieEmojiList.length">
                              {{ t('comment.noMore') }}
                            </ADivider>
                          </template>
                          <template #renderItem="{ item }">
                            <AListItem style="display: flex;align-items: center;justify-content: center;">
                              <AButton @click="insertEmojiToReplyReplyContent(item.name)" type="text" shape="default"
                                       size="large"
                                       class="comment-emoji-item" style="width: 75px;height: 75px;">
                                <template #icon>
                                  <img :width="70" :height="70" loading="lazy" :src="item.path"
                                       :alt="item.name"/>
                                </template>
                              </AButton>
                            </AListItem>
                          </template>
                        </AList>
                      </div>
                    </ATabPane>
                  </ATabs>
                </template>
                <AButton type="text" size="small" :icon="h(SmileOutlined)"
                         class="comment-action-icon-reply-child">
                  {{ t('comment.emoji') }}
                </AButton>
              </APopover>
            </AFlex>
            <AFlex :vertical="false" align="center" class="comment-action-item-reply-child">
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
                  :disabled="comment.imageList.length >= 3 || comment.uploadLoading"
              >
                <ABadge :count="comment.imageList.length">
                  <AButton type="text" size="small" :icon="h(PictureOutlined)"
                           class="comment-action-icon-reply-child" :loading="comment.uploadLoading">
                    {{ t('comment.picture') }}
                  </AButton>
                </ABadge>
              </AUpload>
              <template v-if="comment.imageList.length > 0">
                <AImagePreviewGroup>
                  <ABadge style="margin-left: 10px;" v-for="(item, index) in comment.imageList"
                          :key="index">
                    <template #count>
                      <CloseCircleOutlined @click="comment.removeBase64Image(index)"
                                           style="color: #f5222d"/>
                    </template>
                    <AAvatar shape="square" size="small">
                      <template #icon>
                        <AImage v-if="item" :width="24" :height="24" :src="item"/>
                      </template>
                    </AAvatar>
                  </ABadge>
                </AImagePreviewGroup>
              </template>
            </AFlex>
          </AFlex>
          <AFlex :vertical="false" align="center">
            <AButton
                @click="showSlideCaptcha"
                :disabled="replyReplyContent.trim().length === 0" type="primary" size="middle"
                class="comment-action-btn-reply-child">
              {{ t('comment.sendComment') }}
            </AButton>
          </AFlex>
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
</template>
<script lang="ts" setup>

import {h, ref} from "vue";
import {CloseOutlined, PictureOutlined, SmileOutlined} from "@ant-design/icons-vue";
import {useI18n} from "vue-i18n";
import useStore from "@/store";
import {message} from "ant-design-vue";
import {replyReplySubmitApi} from "@/api/comment";
import {ReplyCommentParams} from "@/types/comment";
import {useThrottleFn} from "@vueuse/core";

const {t} = useI18n();
const commentTextAreaPlaceholder = ref<string>(t('comment.placeholder'));
const comment = useStore().comment;
const replyReplyContent = ref<string>("");

const user = useStore().user;
const topicId = ref<string>("123");
const showSubmitCaptcha = ref<boolean>(false);
const props = defineProps({
  child: {
    type: Object,
    required: true
  },
  item: {
    type: Object,
    required: true
  }

});
const commentSlideCaptchaEvent = {
  confirm: async (point: any) => {
    await replyReplySubmitThrottled(point);
  },
  close: async () => {
    showSubmitCaptcha.value = false;
  },
  refresh: () => {
    getSlideCaptchaDataThrottled();
  },
};
const emojiType = ref<string>("qq");

const currentEmojiList = ref<any[]>(comment.emojiList.slice(0, 20));
const currentEmojiListSize = ref<number>(20);
const currentLottieEmojiList = ref<any[]>(comment.lottieEmojiList.slice(0, 15));
const currentLottieEmojiListSize = ref<number>(15);
/**
 * 加载更多表情
 */
const loadMoreEmoji = async () => {
  if (currentEmojiListSize.value >= comment.emojiList.length) {
    return;
  }
  currentEmojiListSize.value += 20;
  currentEmojiList.value = comment.emojiList.slice(0, currentEmojiListSize.value);
};
/**
 * 加载更多Lottie表情
 */
const loadMoreLottieEmoji = async () => {
  if (currentLottieEmojiListSize.value >= comment.lottieEmojiList.length) {
    return;
  }
  currentLottieEmojiListSize.value += 15;
  currentLottieEmojiList.value = comment.lottieEmojiList.slice(0, currentLottieEmojiListSize.value);
};

/**
 * 切换表情类型
 * @param type
 * @returns
 */
async function changeEmojiType(type: string) {
  emojiType.value = type;
}

/**
 *  插入表情到回复内容
 * @param emoji
 */
async function insertEmojiToReplyReplyContent(emoji: string) {
  if (emojiType.value === "qq") {
    replyReplyContent.value += "[" + emoji + "]";
  } else if (emojiType.value === "lottie") {
    replyReplyContent.value += ":" + emoji + ":";
  } else {
    return;
  }

}

/**
 *  回复提交 throttled
 */
const replyReplySubmitThrottled = useThrottleFn(replyReplySubmit, 1000);

/**
 *  回复评论提交
 */
async function replyReplySubmit(point: any) {
  if (replyReplyContent.value.trim() === "") {
    message.error(t('comment.commentContentNotEmpty'));
    return;
  }
  if (comment.imageList.length > 3) {
    message.error(t('comment.maxImageCount'));
    return;
  }
  const content = replyReplyContent.value.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
  const regex = /\[((1[0-6][0-6]|[1-9]?[0-9])\.gif)]/g; // 匹配 [1.gif] 的字符串
  const contentWithEmoji = content.replace(regex, (_match, p1) => {
    return `<img width="30px" height="30px" loading="lazy" src="/emoji/qq/gif/${p1}" alt="emoji ${p1}" />`;
  });
  const regexWithLottieEmoji = /:((1[0-0-8]|[1-9]?[0-9])\.gif):/g; // 匹配 :1.gif: 的字符串
  const contentWithLottieEmoji = contentWithEmoji.replace(regexWithLottieEmoji, (_match, p1) => {
    return `<img width="80px" height="80px" loading="lazy" src="/emoji/qq/lottie/${p1}" alt="emoji ${p1}" />`;
  });
  const replyParams: ReplyCommentParams = {
    user_id: user.user.uid,
    topic_id: topicId.value,
    content: contentWithLottieEmoji,
    images: comment.imageList,
    author: user.user.uid,
    reply_to: props.child.id,
    reply_id: props.item.id,
    reply_user: props.child.user_id,
    point: [point.x, point.y],
    key: comment.slideCaptchaData.key,
  };
  const result: any = await replyReplySubmitApi(replyParams);
  if (result.code === 200 && result.success) {

    replyReplyContent.value = "";
    await comment.clearFileList();
    showSubmitCaptcha.value = false;
    await getReplyList();
    comment.closeReplyInput();
    comment.commentMap[props.item.id].reply_count++;
    message.success(t('comment.replySuccess'));
  } else {
    showSubmitCaptcha.value = false;
    message.error(t('comment.replyError'));
  }
}

const getSlideCaptchaDataThrottled = useThrottleFn(comment.getSlideCaptchaData, 1000);

/**
 * 显示滑动验证码
 */
async function showSlideCaptcha() {
  if (replyReplyContent.value.trim() === "") {
    message.error(t('comment.commentContentNotEmpty'));
    return;
  }
  if (comment.imageList.length > 3) {
    message.error(t('comment.maxImageCount'));
    return;
  }
  const res = await comment.getSlideCaptchaData();
  if (res) {
    showSubmitCaptcha.value = true;
  }
}

/**
 *  获取回复列表
 */
async function getReplyList() {
  const params: any = {
    topic_id: topicId.value,
    page: 1,
    size: 5,
    comment_id: props.item.id,
    user_id: user.user.uid,
  };
  await comment.getReplyList(params);
}
</script>
<style scoped lang="scss" src="./index.scss">

</style>
