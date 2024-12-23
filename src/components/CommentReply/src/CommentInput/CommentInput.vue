<template>
  <div class="comment">
    <AFlex :vertical="false">
      <AFlex :vertical="true">
        <AAvatar :size="50" class="comment-avatar" shape="circle" :src="user.user.avatar"/>
      </AFlex>
      <AFlex :vertical="true" class="comment-content">
        <ATextarea :rows="4" class="comment-text" @focus="onFocusHandler"
                   v-model:value="commentContent"
                   @keyup.ctrl.enter="showSlideCaptcha"
                   :placeholder="t('comment.placeholder')" allow-clear :showCount="false"/>
        <AFlex :vertical="false" align="center" justify="space-between" class="comment-actions"
               v-if="showCommentActions">
          <AFlex :vertical="false" align="center">
            <AFlex :vertical="false" align="center" class="comment-action-item">
              <APopover trigger="click" placement="bottom">
                <template #content>
                  <div style="width: 250px;height: 200px;overflow: auto;">
                    <AList :grid="{ gutter: 0, column: 4 }" :data-source="comment.emojiList">
                      <template #renderItem="{ item }">
                        <AListItem style="display: flex;align-items: center;justify-content: center;">
                          <AButton @click="insertEmoji(item.name)" type="text" shape="circle" size="large"
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
                <AButton type="text" size="small" :icon="h(SmileOutlined)" class="comment-action-icon">
                  {{ t('comment.emoji') }}
                </AButton>
              </APopover>
            </AFlex>
            <AFlex :vertical="false" align="center" class="comment-action-item">
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
                           class="comment-action-icon" :loading="comment.uploadLoading">
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
import {h, ref} from "vue";
import {PictureOutlined, SmileOutlined} from "@ant-design/icons-vue";
import {useI18n} from "vue-i18n";
import useStore from "@/store";
import {message} from "ant-design-vue";
import {commentSubmitApi} from "@/api/comment";
import {useDebounceFn, useThrottleFn} from "@vueuse/core";

const {t} = useI18n();

const showCommentActions = ref<boolean>(false);
const commentContent = ref<string>("");

const user = useStore().user;
const topicId = ref<string>("123");
const showSubmitCaptcha = ref<boolean>(false);
const comment = useStore().comment;

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
  commentContent.value += "[" + emoji + "]";
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
  if (comment.imageList.length > 3) {
    message.error(t('comment.maxImageCount'));
    return;
  }
  const content = commentContent.value.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
  const regex = /\[((1[0-6][0-6]|[1-9]?[0-9])\.gif)]/g; // 匹配 [1.gif] 的字符串
  const contentWithEmoji = content.replace(regex, (_match, p1) => {
    return `<img width="30px" height="30px" loading="lazy" src="/emoji/qq/gif/${p1}" alt="emoji ${p1}" />`;
  });
  const commentParams: object = {
    topic_id: topicId.value,
    content: contentWithEmoji,
    images: comment.imageList,
    author: user.user.uid,
    point: [point.x, point.y],
    key: comment.slideCaptchaData.captKey,
  };
  const result: any = await commentSubmitApi(commentParams);
  if (result && result.code === 200) {
    const tmpData: any = {
      user_id: user.user.uid,
      content: result.data.content,
      images: comment.imageList,
      nickname: user.user.nickname,
      avatar: user.user.avatar,
      id: result.data.id,
      created_time: result.data.created_time,
      browser: result.data.browser,
      operating_system: result.data.operating_system,
      reply_count: 0,
      likes: 0,
      author: result.data.author,
      location: result.data.location,
      is_liked: false,
    };

    if (!comment.commentList.comments) {
      comment.commentList.comments = []; // 初始化 comments 数组
    }
    comment.commentList.comments.unshift(tmpData);
    comment.commentMap[result.data.id] = tmpData;

    commentContent.value = "";
    await comment.clearFileList();
    showSubmitCaptcha.value = false;
    message.success(t('comment.commentSuccess'));
  } else {
    await comment.getSlideCaptchaData();
    message.warning(result.msg || t('comment.commentError'));
  }
}


const getSlideCaptchaDataThrottled = useThrottleFn(comment.getSlideCaptchaData, 1000);


/**
 * 显示滑动验证码
 */
async function showSlideCaptcha() {
  if (commentContent.value.trim() === "") {
    return;
  }
  if (comment.imageList.length > 3) {
    message.warning(t('comment.maxImageCount'));
    return;
  }
  const res = await comment.getSlideCaptchaData();
  if (res) {
    showSubmitCaptcha.value = true;
  }
}

</script>

<style src="./index.scss" lang="scss" scoped>
</style>
