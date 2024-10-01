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
    <!-- 回复头像-->
    <AFlex :vertical="false" class="reply-input-content">
      <AFlex :vertical="true" class="reply-input-avatar">
        <AAvatar :size="40" shape="circle" src="https://api.multiavatar.com/landaiqing.svg"/>
      </AFlex>
      <!-- 评论输入框 -->
      <AFlex :vertical="true" class="reply-input-content-text">
        <ATextarea :rows="3" class="comment-text-reply"
                   v-model:value="replyContent"
                   @keyup.ctrl.enter="showSlideCaptcha"
                   :placeholder="commentTextAreaPlaceholder" allow-clear :showCount="false"/>
        <AFlex :vertical="false" align="center" justify="space-between" class="comment-actions-reply"
        >
          <AFlex :vertical="false" align="center">
            <AFlex :vertical="false" align="center" class="comment-action-item-reply">
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
                        <template v-for="(item) in comment.emojiList" :key="item">
                          <AButton @click="insertEmojiToReplyContent(item.name)" type="text" shape="circle" size="large"
                                   class="comment-emoji-item">
                            <template #icon>
                              <AAvatar shape="circle" size="default" :src="item.path"/>
                            </template>
                          </AButton>
                        </template>
                      </div>
                    </ATabPane>
                    <ATabPane key="lottie">
                      <template #tab>
                        <AFlex :vertical="false" align="center">
                          <StarOutlined style="font-size: 18px;"/>
                        </AFlex>
                      </template>
                      <div style="width: 250px;height: 200px;overflow: auto;">
                        <AFlex :vertical="false" align="center" justify="space-between" wrap="wrap">
                          <template v-for="(item) in comment.lottieEmojiList" :key="item">
                            <AButton @click="insertEmojiToReplyContent(item.name)" type="text" shape="default"
                                     size="large"
                                     class="comment-emoji-item" style="width: 75px;height: 75px;">
                              <template #icon>
                                <AAvatar shape="square" :size="70" :src="item.path"/>
                              </template>
                            </AButton>
                          </template>
                        </AFlex>
                      </div>
                    </ATabPane>
                  </ATabs>
                </template>
                <AButton type="text" size="small" :icon="h(SmileOutlined)"
                         class="comment-action-icon-reply">
                  {{ t('comment.emoji') }}
                </AButton>
              </APopover>
            </AFlex>
            <AFlex :vertical="false" align="center" class="comment-action-item-reply">
              <AUpload
                  :accept="'image/jpg, image/png, image/jpeg, image/gif, image/svg+xml, image/webp'"
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
                           class="comment-action-icon-reply" :loading="comment.uploadLoading">
                    {{ t('comment.picture') }}
                  </AButton>
                </ABadge>
              </AUpload>
              <template v-if="comment.imageList.length > 0">
                <AImagePreviewGroup>
                  <ABadge style="margin-left: 10px;" v-for="(item, index) in comment.imageList" :key="index">
                    <template #count>
                      <CloseCircleOutlined @click="comment.removeBase64Image(index)" style="color: #f5222d"/>
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
const commentTextAreaPlaceholder = ref<string>(t('comment.placeholder'));
const replyContent = ref<string>("");
const topicId = ref<string>("123");
const showSubmitCaptcha = ref<boolean>(false);
const props = defineProps({
  item: {
    type: Object,
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
const emojiType = ref<string>("qq");

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
    message.error(t('comment.commentContentNotEmpty'));
    return;
  }
  if (comment.imageList.length > 3) {
    message.error(t('comment.maxImageCount'));
    return;
  }
  const content = replyContent.value.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
  const regex = /\[((1[0-6][0-6]|[1-9]?[0-9])\.gif)\]/g; // 匹配 [1.gif] 的字符串
  const contentWithEmoji = content.replace(regex, (match, p1) => {
    if (emojiType.value === "qq") {
      return `<img style="width: 30px; height: 30px;" src="/emoji/qq/gif/${p1}" alt="emoji ${p1}" />`;
    } else if (emojiType.value === "lottie") {
      return `<img style="width: 80px; height: 80px;" src="/emoji/qq/lottie/${p1}" alt="emoji ${p1}" />`;
    } else {
      return match;
    }
  });
  const replyParams: {
    images: any;
    reply_id: number;
    reply_user: string;
    user_id: any;
    author: any;
    topic_id: string;
    content: any;
    point: [number, number];
    key: any;
  } = {
    user_id: user.user.uid,
    topic_id: topicId.value,
    content: contentWithEmoji,
    images: comment.imageList,
    author: user.user.uid,
    reply_id: props.item.id,
    reply_user: props.item.user_id,
    point: [point.x, point.y],
    key: comment.slideCaptchaData.key,
  };
  const result: any = await replySubmitApi(replyParams);
  if (result.code === 200 && result.success) {
    replyContent.value = "";
    await comment.clearFileList();
    showSubmitCaptcha.value = false;
    await getReplyList();
    comment.closeReplyInput();
    comment.commentMap[props.item.id].reply_count++;
    message.success(t('comment.replySuccess'));
  } else {
    message.error(t('comment.replyError'));
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

const getSlideCaptchaDataThrottled = useThrottleFn(comment.getSlideCaptchaData, 1000);

/**
 * 显示滑动验证码
 */
async function showSlideCaptcha() {
  const res = await comment.getSlideCaptchaData();
  if (res) {
    showSubmitCaptcha.value = true;
  }
}
</script>
<style scoped lang="scss" src="./index.scss">

</style>
