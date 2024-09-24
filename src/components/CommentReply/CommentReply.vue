<template>
  <div class="comment-main">
    <AFlex :vertical="false" justify="flex-start" class="comment-header">
      <span class="comment-header-title">{{ t('comment.comment') }}</span>
    </AFlex>
    <!-- 评论输入框 -->
    <div class="comment">
      <AFlex :vertical="false">
        <AFlex :vertical="true">
          <AAvatar :size="50" shape="circle" src="https://api.multiavatar.com/Starcrasher.svg"/>
        </AFlex>
        <AFlex :vertical="true" class="comment-content">
          <ATextarea :rows="4" class="comment-text" @focus="onFocusHandler"
                     v-model:value="commentContent"
                     @keyup.ctrl.enter="commentSubmitThrottled"
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
                  @click="commentSubmitThrottled"
                  :disabled="commentContent.trim().length === 0"
                  type="primary" size="middle" class="comment-action-btn">{{ t('comment.sendComment') }}
              </AButton>
            </AFlex>
          </AFlex>
        </AFlex>
      </AFlex>
    </div>
    <ADivider/>
    <!-- 回复列表 -->
    <div class="reply">
      <div class="reply-header">
        <!-- 评论列表头部 -->
        <AFlex :vertical="true">
          <AFlex :vertical="false">
            <span class="reply-header-title">{{ t('comment.allComments') }}</span>
            <span class="reply-header-count">123</span>
          </AFlex>
          <ASegmented v-model:value="segmentedValue" :options="data" class="reply-header-sort"/>
        </AFlex>
      </div>
      <ASkeleton :loading="commentLoading" avatar active :paragraph="{ rows: 4 }"
      >
        <div class="reply-list" v-if="commentList?.comments">
          <div class="reply-item" v-for="(item, index) in commentList?.comments" :key="index">
            <AFlex :vertical="false" style="margin-top: 5px">
              <!-- 评论头像 -->
              <AFlex :vertical="true" class="reply-avatar" v-if="item.avatar">
                <AAvatar :size="50" shape="circle" :src="item.avatar"/>
              </AFlex>
              <!-- 评论内容 -->
              <AFlex :vertical="true" class="reply-content">
                <AFlex :vertical="true">
                  <AFlex :vertical="false" align="flex-start">
                    <span class="reply-name">{{ item.nickname }}</span>
                    <a-tag color="cyan" class="reply-tag" size="small">Lv.5</a-tag>
                    <a-tag color="red" class="reply-tag" size="small" v-if="item.author===1">UP</a-tag>
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
                    <div class="reply-text" v-html="item.content">
                    </div>
                    <AFlex :vertical="false" align="center" class="reply-images" v-if="item.images">
                      <AAvatar shape="square" size="large"
                               v-for="(image, index) in item.images" :key="index">
                        <template #icon>
                          <AImage :width="40" :height="40" :src="image">
                            <template #previewMask>
                              <EyeOutlined style="font-size: 18px;"/>
                            </template>
                          </AImage>
                        </template>
                      </AAvatar>
                    </AFlex>
                    <AFlex :vertical="false" justify="space-between" align="center">
                      <!--评论操作按钮 -->
                      <AFlex :vertical="false" align="center" justify="space-between" class="reply-action-item">
                        <AFlex :vertical="false" align="center">
                          <AButton type="text" size="small" :icon="h(LikeOutlined)" class="reply-action-btn">
                            {{ item.likes }}
                          </AButton>
                        </AFlex>
                        <AFlex :vertical="false" align="center">
                          <AButton type="text" size="small" :icon="h(DislikeOutlined)" class="reply-action-btn">
                            {{ item.dislikes }}
                          </AButton>
                        </AFlex>
                        <AButton @click="()=>{
                          handleShowReplyComment(item.id);
                          replyListThrottled(item.id)}" type="text" size="small"
                                 :icon="h(MessageOutlined)"
                                 class="reply-action-btn">
                          {{ item.reply_count }}
                        </AButton>
                        <AButton
                            @click="handleShowReplyInput(item.id)"
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
                        <ADropdown trigger="click">
                          <AButton type="text" size="small" :icon="h(EllipsisOutlined)" class="reply-action-btn"
                                   @click.prevent>
                          </AButton>
                          <template #overlay>
                            <AMenu>
                              <AMenuItem key="report">
                                <WarningOutlined/>
                                {{ t('comment.report') }}
                              </AMenuItem>
                              <AMenuItem key="copy">
                                <CopyOutlined/>
                                {{ t('comment.copy') }}
                              </AMenuItem>
                              <AMenuItem key="delete">
                                <DeleteOutlined/>
                                {{ t('comment.delete') }}
                              </AMenuItem>
                            </AMenu>
                          </template>
                        </ADropdown>
                      </AFlex>
                    </AFlex>
                  </ACard>

                </AFlex>
                <!-- 回复输入框 -->
                <AFlex :vertical="true" class="reply-input-main" v-if="showReplyInput && item.id === showReplyInput">
                  <AFlex :vertical="false" align="center" class="reply-input-header">
                    <span class="reply-input-title">{{ t('comment.reply') + '：' }}</span>
                    <span class="reply-input-author">{{ item.nickname }}</span>
                    <AButton @click="closeReplyInput" type="dashed" size="small" :icon="h(CloseOutlined )"
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
                                 @keyup.ctrl.enter="()=>{
                          const params: any ={
                            reply_id: item.id,
                            reply_user: item.user_id
                          }
                          replySubmitThrottled(params);
                        }"
                                 :placeholder="commentTextAreaPlaceholder" allow-clear :showCount="false"/>
                      <AFlex :vertical="false" align="center" justify="space-between" class="comment-actions-reply"
                      >
                        <AFlex :vertical="false" align="center">
                          <AFlex :vertical="false" align="center" class="comment-action-item-reply">
                            <APopover trigger="click" placement="bottom">
                              <template #content>
                                <div style="width: 170px;height: 200px;overflow: auto;">
                                  <template v-for="(emoji) in EMOJI" :key="emoji">
                                    <AButton @click="insertEmojiToReplyContent(emoji)" type="text" size="large">{{
                                        emoji
                                      }}
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
                          <AButton @click="()=>{
                          const params: any ={
                            reply_id: item.id,
                            reply_user: item.user_id
                          }
                          replySubmitThrottled(params);
                        }" type="primary" size="middle"
                                   :disabled="replyContent.trim().length === 0"
                                   class="comment-action-btn-reply">
                            {{ t('comment.sendComment') }}
                          </AButton>
                        </AFlex>
                      </AFlex>
                    </AFlex>
                  </AFlex>
                </AFlex>

                <!-- 子回复列表 -->

                <AFlex :vertical="true" class="reply-item-child"
                       v-if="showReplyComment && showReplyComment === item.id">
                  <ASpin :spinning="replyLoading" size="default">
                    <AFlex :vertical="true" v-if="replyList.comments">
                      <AFlex :vertical="false" style="margin-top: 5px" v-for="(child, index) in replyList.comments"
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
                              <div class="reply-text-child" v-html="child.content">
                              </div>
                              <AFlex :vertical="false" align="center" class="reply-images" v-if="child.images">
                                <AAvatar shape="square" size="large"
                                         v-for="(image, index) in child.images" :key="index">
                                  <template #icon>
                                    <AImage :width="40" :height="40" :src="image">
                                      <template #previewMask>
                                        <EyeOutlined style="font-size: 18px;"/>
                                      </template>
                                    </AImage>
                                  </template>
                                </AAvatar>
                              </AFlex>
                              <AFlex :vertical="false" justify="space-between" align="center">
                                <!--评论操作按钮 -->
                                <AFlex :vertical="false" align="center" justify="space-between"
                                       class="reply-action-item-child">
                                  <AFlex :vertical="false" align="center">
                                    <AButton type="text" size="small" :icon="h(LikeOutlined)"
                                             class="reply-action-btn-child">
                                      {{ child.likes }}
                                    </AButton>
                                  </AFlex>
                                  <AFlex :vertical="false" align="center">
                                    <AButton type="text" size="small" :icon="h(DislikeOutlined)"
                                             class="reply-action-btn-child">
                                      {{ child.dislikes }}
                                    </AButton>
                                  </AFlex>
                                  <AButton
                                      @click="handleShowReplyInput(child.id)"
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
                            <AFlex :vertical="true" class="reply-input-main-child"
                                   v-if="showReplyInput && child.id === showReplyInput">
                              <AFlex :vertical="false" align="center" class="reply-input-header-child">
                                <span class="reply-input-title-child">{{ t('comment.reply') + '：' }}</span>
                                <span class="reply-input-author-child">{{ child.nickname }}</span>
                                <AButton @click="closeReplyInput" type="dashed" size="small"
                                         :icon="h(CloseOutlined )"
                                         class="reply-input-cancel-child">
                                  {{ t('comment.cancelReply') }}
                                </AButton>
                              </AFlex>
                              <!-- 回复头像-->
                              <AFlex :vertical="false" class="reply-input-content-child">
                                <AFlex :vertical="true" class="reply-input-avatar-child">
                                  <AAvatar :size="40" shape="circle" src="https://api.multiavatar.com/landaiqing.svg"/>
                                </AFlex>
                                <!-- 评论输入框 -->
                                <AFlex :vertical="true" class="reply-input-content-text-child">
                                  <ATextarea :rows="3" class="comment-text-reply-child"
                                             v-model:value="replyReplyContent"
                                             @keyup.ctrl.enter="()=>{
                                      const params: any ={
                                        reply_to: child.id,
                                        reply_id: item.id,
                                        reply_user: child.user_id
                                        };
                                      replyReplySubmitThrottled(params);
                                    }"
                                             :placeholder="commentTextAreaPlaceholder" allow-clear :showCount="false"/>
                                  <AFlex :vertical="false" align="center" justify="space-between"
                                         class="comment-actions-reply-child"
                                  >
                                    <AFlex :vertical="false" align="center">
                                      <AFlex :vertical="false" align="center" class="comment-action-item-reply-child">
                                        <APopover trigger="click" placement="bottom">
                                          <template #content>
                                            <div style="width: 170px;height: 200px;overflow: auto;">
                                              <template v-for="(emoji) in EMOJI" :key="emoji">
                                                <AButton @click="insertEmojiToReplyReplyContent(emoji)" type="text"
                                                         size="large">{{
                                                    emoji
                                                  }}
                                                </AButton>
                                              </template>
                                            </div>
                                          </template>
                                          <AButton type="text" size="small" :icon="h(SmileOutlined)"
                                                   class="comment-action-icon-reply-child">
                                            {{ t('comment.emoji') }}
                                          </AButton>
                                        </APopover>
                                      </AFlex>
                                      <AFlex :vertical="false" align="center" class="comment-action-item-reply-child">
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
                                                     class="comment-action-icon-reply-child">
                                              {{ t('comment.picture') }}
                                            </AButton>
                                          </ABadge>
                                        </AUpload>
                                        <template v-if="imageList.length > 0">
                                          <ABadge style="margin-left: 10px;" v-for="(item, index) in imageList"
                                                  :key="index">
                                            <template #count>
                                              <CloseCircleOutlined @click="removeBase64Image(index)"
                                                                   style="color: #f5222d"/>
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
                                          @click="()=>{
                                      const params: any ={
                                        reply_to: child.id,
                                        reply_id: item.id,
                                        reply_user: child.user_id
                                        };
                                      replyReplySubmitThrottled(params);
                                    }"
                                          :disabled="replyReplyContent.trim().length === 0" type="primary" size="middle"
                                          class="comment-action-btn-reply-child">
                                        {{ t('comment.sendComment') }}
                                      </AButton>
                                    </AFlex>
                                  </AFlex>
                                </AFlex>
                              </AFlex>
                            </AFlex>
                          </AFlex>
                        </AFlex>
                      </AFlex>
                      <APagination class="reply-pagination-child" size="small" :total="replyList.total"
                                   :current="replyList.current" :page-size="replyList.size"
                                   :default-page-size="replyList.size"
                                   @change="(page: number, pageSize: number)=>{
                                    getReplyList(item.id, page, pageSize);}"/>
                    </AFlex>
                  </ASpin>
                </AFlex>


              </AFlex>


            </AFlex>
          </div>
          <APagination class="reply-pagination" @change="(page: number, pageSize: number)=>{
            getCommentList(page, pageSize);
          }" :current="commentList.current" :page-size="commentList.size" :total="commentList.total"
                       :default-page-size="commentList.size"
                       :show-less-items="true"/>
        </div>
      </ASkeleton>
    </div>
  </div>
</template>
<script setup lang="ts">

import {useI18n} from "vue-i18n";
import {h, onMounted, reactive, ref} from "vue";
import {
  ChromeOutlined,
  CloseOutlined,
  CommentOutlined,
  DislikeOutlined,
  EllipsisOutlined,
  LikeOutlined,
  MessageOutlined,
  PictureOutlined,
  SmileOutlined,
  WindowsOutlined
} from "@ant-design/icons-vue";
import EMOJI from "@/constant/emoji.ts";
import imageCompression from "browser-image-compression";
import {message} from "ant-design-vue";
import {useThrottleFn} from "@vueuse/core";
import {commentListApi, commentSubmitApi, replyListApi, replyReplySubmitApi, replySubmitApi} from "@/api/comment";
import useStore from "@/store";
import {Comment, ReplyCommentParams} from "@/types/comment";

const {t} = useI18n();
const showCommentActions = ref<boolean>(false);
const commentTextAreaPlaceholder = ref<string>(t('comment.placeholder'));
const data = reactive([t('comment.latest'), t('comment.hot')]);
const segmentedValue = ref<string>(data[0]);
const commentContent = ref<string>("");
const replyContent = ref<string>("");
const replyReplyContent = ref<string>("");
const fileList = ref<any[]>([]);
const imageList = ref<any[]>([]);
const user = useStore().user;
const commentList = ref<Comment>({} as Comment);
const showReplyInput = ref<number | null>(null);
const showReplyComment = ref<number | null>(null);
const replyList = ref<Comment>({} as Comment);
const commentLoading = ref<boolean>(true);
const replyLoading = ref<boolean>(true);
const topicId = ref<string>("123");

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
 *  插入表情到回复内容
 * @param emoji
 */
async function insertEmojiToReplyContent(emoji: string) {
  replyContent.value += emoji;
}

/**
 *  插入表情到回复内容
 * @param emoji
 */
async function insertEmojiToReplyReplyContent(emoji: string) {
  replyReplyContent.value += emoji;
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
      message.error("最多只能上传5张图片");
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
 *  评论提交 throttled
 */
const commentSubmitThrottled = useThrottleFn(commentSubmit, 1000);

/**
 *  评论提交
 */
async function commentSubmit() {
  if (commentContent.value.trim() === "") {
    message.error("评论内容不能为空");
    return;
  }
  if (imageList.value.length > 3) {
    message.error("最多只能上传3张图片");
    return;
  }
  const content = commentContent.value.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');

  const commentParams: object = {
    user_id: user.user.uid,
    topic_id: topicId.value,
    content: content,
    images: imageList.value,
    author: user.user.uid,
  };
  const result: any = await commentSubmitApi(commentParams);
  if (result.code === 200 && result.success) {
    message.success("评论成功");
    commentContent.value = "";
    fileList.value = [];
    imageList.value = [];
    commentList.value = {} as Comment;
    commentLoading.value = true;
    await getCommentList();
  } else {
    message.error("评论失败");
  }
}

/**
 *  回复提交 throttled
 */
const replySubmitThrottled = useThrottleFn(replySubmit, 1000);

/**
 *  回复提交
 */
async function replySubmit(data: ReplyCommentParams) {
  if (replyContent.value.trim() === "") {
    message.error("回复内容不能为空");
    return;
  }
  if (imageList.value.length > 3) {
    message.error("最多只能上传3张图片");
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
    content: any
  } = {
    user_id: user.user.uid,
    topic_id: topicId.value,
    content: content,
    images: imageList.value,
    author: user.user.uid,
    reply_id: data.reply_id,
    reply_user: data.reply_user,
  };
  const result: any = await replySubmitApi(replyParams);
  if (result.code === 200 && result.success) {
    message.success("回复成功");
    replyContent.value = "";
    fileList.value = [];
    imageList.value = [];
    replyList.value = {} as Comment;
    replyLoading.value = true;
    await getReplyList(data.reply_id);
  } else {
    message.error("回复失败");
  }
}

/**
 *  获取评论列表
 */
async function getCommentList(page: number = 1, size: number = 5) {
  const params = {
    topic_id: topicId.value,
    page: page,
    size: size,
  };
  commentLoading.value = true;
  commentList.value = {} as Comment;
  // 获取评论列表
  const result: any = await commentListApi(params);
  if (result.code === 200 && result.success && result.data) {
    commentList.value = result.data;
    commentLoading.value = false;
  }
}

/**
 *  格式化时间
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

/**
 *  显示回复输入框
 */
const handleShowReplyInput = (index: any) => {
  showReplyInput.value = showReplyInput.value === index ? null : index;
};
/**
 *  显示回复
 */
const handleShowReplyComment = (index: any) => {
  showReplyComment.value = showReplyComment.value === index ? null : index;
};
/**
 *  关闭回复输入框
 */
const closeReplyInput = () => {
  showReplyInput.value = null;
};
/**
 *  获取回复列表 throttled
 */
const replyListThrottled = useThrottleFn(getReplyList, 500);

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
  replyLoading.value = true;
  replyList.value = {} as Comment;
  // 获取评论列表
  const result: any = await replyListApi(params);
  if (result.code === 200 && result.success && result.data) {
    replyList.value = result.data;
    replyLoading.value = false;
  }
}

/**
 *  回复提交 throttled
 */
const replyReplySubmitThrottled = useThrottleFn(replyReplySubmit, 1000);

/**
 *  回复评论提交
 * @param data
 */
async function replyReplySubmit(data: any) {
  if (replyReplyContent.value.trim() === "") {
    message.error("回复内容不能为空");
    return;
  }
  if (imageList.value.length > 3) {
    message.error("最多只能上传3张图片");
    return;
  }
  const content = replyReplyContent.value.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');

  const replyParams: ReplyCommentParams = {
    user_id: user.user.uid,
    topic_id: topicId.value,
    content: content,
    images: imageList.value,
    author: user.user.uid,
    reply_to: data.reply_to,
    reply_id: data.reply_id,
    reply_user: data.reply_user,
  };
  const result: any = await replyReplySubmitApi(replyParams);
  if (result.code === 200 && result.success) {
    message.success("回复成功");
    replyReplyContent.value = "";
    fileList.value = [];
    imageList.value = [];
  } else {
    message.error("回复失败");
  }
}


onMounted(() => {
  getCommentList();
});

</script>
<style src="./index.scss" lang="scss" scoped>

</style>
