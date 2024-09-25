<template>
  <div class="comment">
    <AFlex :vertical="false">
      <AFlex :vertical="true">
        <AAvatar :size="50" shape="circle" src="https://api.multiavatar.com/Starcrasher.svg"/>
      </AFlex>
      <AFlex :vertical="true" class="comment-content">
        <ATextarea :rows="4" class="comment-text" @focus="onFocusHandler"
                   v-model:value="commentContent"
                   @keyup.ctrl.enter="showSlideCaptcha"
                   :placeholder="commentTextAreaPlaceholder" allow-clear :showCount="false"/>
        <AFlex :vertical="false" align="center" justify="space-between" class="comment-actions"
               v-if="showCommentActions">
          <AFlex :vertical="false" align="center">
            <AFlex :vertical="false" align="center" class="comment-action-item">
              <APopover trigger="click" placement="bottom">
                <template #content>
                  <div style="width: 170px;height: 200px;overflow: auto;">
                    <template v-for="(item) in EMOJI" :key="item">
                      <AButton @click="insertEmoji(item)" type="text" size="large">{{ item }}</AButton>
                    </template>
                  </div>
                </template>
                <AButton type="text" size="small" :icon="h(SmileOutlined)" class="comment-action-icon">
                  {{ t('comment.emoji') }}
                </AButton>
              </APopover>
            </AFlex>
            <AFlex :vertical="false" align="center" class="comment-action-item">
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
                           class="comment-action-icon">
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
            <AButton
                @click="showSlideCaptcha"
                :disabled="commentContent.trim().length === 0"
                type="primary" size="middle" class="comment-action-btn">{{ t('comment.sendComment') }}
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
  </div>
</template>

<script lang="ts" setup>
import EMOJI from "@/constant/emoji.js";
import {h, ref} from "vue";
import {PictureOutlined, SmileOutlined} from "@ant-design/icons-vue";
import {useI18n} from "vue-i18n";
import useStore from "@/store";
import {message} from "ant-design-vue";
import {commentSubmitApi} from "@/api/comment";
import {useDebounceFn, useThrottleFn} from "@vueuse/core";
import imageCompression from "browser-image-compression";
import {useRouter} from "vue-router";

const {t} = useI18n();

const showCommentActions = ref<boolean>(false);
const commentContent = ref<string>("");
const fileList = ref<any[]>([]);
const imageList = ref<any[]>([]);
const user = useStore().user;
const commentTextAreaPlaceholder = ref<string>(t('comment.placeholder'));
const topicId = ref<string>("123");
const showSubmitCaptcha = ref<boolean>(false);
const comment = useStore().comment;
const router = useRouter();
const commentSlideCaptchaEvent = {
  confirm: async (point: any) => {
    await commentSubmitDebounced(point);
  },
  close: async () => {
    showSubmitCaptcha.value = false;
  },
  refresh: () => {
    getSlideCaptchaDataThrottled();
  },
};

/**
 * 聚焦事件
 */
async function onFocusHandler() {
  showCommentActions.value = true;
}

/**
 *  插入表情
 * @param emoji
 */
async function insertEmoji(emoji: string) {
  commentContent.value += emoji;
}


/**
 *  评论提交 debounce
 */
const commentSubmitDebounced = useDebounceFn(commentSubmit, 500);

/**
 *  评论提交
 */
async function commentSubmit(point: any) {
  if (commentContent.value.trim() === "") {
    message.error(t('comment.commentContentNotEmpty'));
    return;
  }
  if (imageList.value.length > 3) {
    message.error(t('comment.maxImageCount'));
    return;
  }
  const content = commentContent.value.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');

  const commentParams: object = {
    user_id: user.user.uid,
    topic_id: topicId.value,
    content: content,
    images: imageList.value,
    author: user.user.uid,
    point: [point.x, point.y],
    key: comment.slideCaptchaData.key,
  };
  const result: any = await commentSubmitApi(commentParams);
  if (result.code === 200 && result.success) {
    message.success(t('comment.commentSuccess'));
    commentContent.value = "";
    fileList.value = [];
    imageList.value = [];
    showSubmitCaptcha.value = false;
    await getCommentList();
  } else {
    message.error(result.message || t('comment.commentError'));
  }
}

/**
 *  获取评论列表
 */
async function getCommentList(page: number = 1, size: number = 5, hot: boolean = true) {
  const params = {
    user_id: user.user.uid,
    topic_id: topicId.value,
    page: page,
    size: size,
    is_hot: router.currentRoute.value.query.type === "hot" || hot,
  };
  await comment.getCommentList(params);
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

<style src="./index.scss" lang="scss" scoped>
</style>
