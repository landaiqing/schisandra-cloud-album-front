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
                  <div style="width: 170px;height: 200px;overflow: auto;">
                    <template v-for="(emoji) in EMOJI" :key="emoji">
                      <AButton @click="insertEmojiToReplyContent(emoji)" type="text" size="large">
                        {{ emoji }}
                      </AButton>
                    </template>
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
                  :accept="'image/jpg, image/png, image/jpeg, image/gif, image/svg+xml, image/webp'"
                  name="images"
                  :max-count="3"
                  :multiple="true"
                  method="post"
                  :directory="false"
                  :show-upload-list="false"
                  :custom-request="customUploadRequest"
                  :before-upload="beforeUpload"
                  :disabled="imageList.length >= 3"
              >
                <ABadge :count="imageList.length">
                  <AButton type="text" size="small" :icon="h(PictureOutlined)"
                           class="comment-action-icon-reply">
                    {{ t('comment.picture') }}
                  </AButton>
                </ABadge>
              </AUpload>
              <template v-if="imageList.length > 0">
                <ABadge style="margin-left: 10px;" v-for="(item, index) in imageList" :key="index">
                  <template #count>
                    <CloseCircleOutlined @click="removeBase64Image(index)" style="color: #f5222d"/>
                  </template>
                  <AAvatar shape="square" size="small">
                    <template #icon>
                      <AImage v-if="item" :width="24" :height="24" :src="item"/>
                    </template>
                  </AAvatar>
                </ABadge>
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
import imageCompression from "browser-image-compression";
import {CloseOutlined, PictureOutlined, SmileOutlined} from "@ant-design/icons-vue";
import EMOJI from "@/constant/emoji.ts";
import {useI18n} from "vue-i18n";
import useStore from "@/store";
import {useDebounceFn, useThrottleFn} from "@vueuse/core";
import {replySubmitApi} from "@/api/comment";

const {t} = useI18n();
const comment = useStore().comment;
const user = useStore().user;
const commentTextAreaPlaceholder = ref<string>(t('comment.placeholder'));
const fileList = ref<any[]>([]);
const imageList = ref<any[]>([]);
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

/**
 *  插入表情到回复内容
 * @param emoji
 */
async function insertEmojiToReplyContent(emoji: string) {
  replyContent.value += emoji;
}

// 压缩图片配置
const options = {
  maxSizeMB: 0.4,
  maxWidthOrHeight: 750,
  maxIteration: 2
};

/**
 * 上传文件前置
 * @param file
 */
async function beforeUpload(file: any) {
  if (!window.FileReader) return false; // 判断是否支持FileReader
  const compressedFile = await imageCompression(file, options);
  const reader = new FileReader();
  reader.readAsDataURL(compressedFile); // 文件转换
  reader.onloadend = async function () {
    if (fileList.value.length >= 5) {
      message.error(t('comment.maxImageCount'));
      return false;
    }
    fileList.value.push(reader.result);
  };
  return true;
}

/**
 *  自定义上传图片请求
 */
async function customUploadRequest() {
  imageList.value = fileList.value;
}

/**
 *  移除图片
 * @param index
 */
async function removeBase64Image(index: number) {
  fileList.value.splice(index, 1);
  imageList.value.splice(index, 1);
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
  if (imageList.value.length > 3) {
    message.error(t('comment.maxImageCount'));
    return;
  }
  const content = replyContent.value.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');

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
    content: content,
    images: imageList.value,
    author: user.user.uid,
    reply_id: props.item.id,
    reply_user: props.item.user_id,
    point: [point.x, point.y],
    key: comment.slideCaptchaData.key,
  };
  const result: any = await replySubmitApi(replyParams);
  if (result.code === 200 && result.success) {
    replyContent.value = "";
    fileList.value = [];
    imageList.value = [];
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
