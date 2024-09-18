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
                    :max-count="5"
                    :multiple="true"
                    method="post"
                    :directory="false"
                    :show-upload-list="false"
                    :custom-request="customUploadRequest"
                    :before-upload="beforeUpload"
                    :disabled="imageList.length >= 5"
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
                        <AImage v-if="item" :src="item"/>
                      </template>
                    </AAvatar>
                  </ABadge>
                </template>
              </AFlex>
            </AFlex>
            <AFlex :vertical="false" align="center">
              <AButton
                  @click="console.log(commentContent.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' '))"
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
      <div class="reply-list">
        <div class="reply-item">
          <AFlex :vertical="false">
            <!-- 评论头像 -->
            <AFlex :vertical="true" class="reply-avatar">
              <AAvatar :size="50" shape="circle" src="https://api.multiavatar.com/landaiqing.svg"/>
            </AFlex>
            <!-- 评论内容 -->
            <AFlex :vertical="true" class="reply-content">
              <AFlex :vertical="true">
                <AFlex :vertical="false" align="flex-start">
                  <span class="reply-name">张立国</span>
                  <a-tag color="cyan" class="reply-tag" size="small">Lv.5</a-tag>
                  <a-tag color="red" class="reply-tag" size="small">UP</a-tag>
                </AFlex>
                <AFlex :vertical="false" align="flex-end" justify="space-between">
                  <AFlex :vertical="false" align="center" justify="space-between">
                    <span class="reply-ip"> 成都市 </span>
                    <span class="reply-ip" style="margin-left: 10px;">IP: 192.168.1.100 </span>
                  </AFlex>
                  <span class="reply-time">{{ new Date().toLocaleString() }}</span>
                </AFlex>
              </AFlex>
              <AFlex :vertical="false" align="center">

                <ACard class="reply-card" :body-style="{padding: '10px'}">
                  <span class="reply-text">
                    床前明月光，疑是地上霜。<br>
                    举头望明月，低头思故乡。
                  </span>
                  <AFlex :vertical="false" justify="space-between" align="center">
                    <!--评论操作按钮 -->
                    <AFlex :vertical="false" align="center" justify="space-between" class="reply-action-item">
                      <AFlex :vertical="false" align="center">
                        <AButton type="text" size="small" :icon="h(LikeOutlined)" class="reply-action-btn">
                          10
                        </AButton>
                      </AFlex>
                      <AFlex :vertical="false" align="center">
                        <AButton type="text" size="small" :icon="h(DislikeOutlined)" class="reply-action-btn">
                          1
                        </AButton>
                      </AFlex>
                      <AButton type="text" size="small" :icon="h(MessageOutlined)" class="reply-action-btn">
                        11
                      </AButton>
                      <AButton
                          @click="replyInputVisible === true? (replyInputVisible = false) : (replyInputVisible = true) "
                          type="text" size="small" :icon="h(CommentOutlined)"
                          class="reply-action-btn">
                        {{ t('comment.reply') }}
                      </AButton>
                    </AFlex>
                    <!-- 评论操作系统信息-->
                    <AFlex :vertical="false" align="center" justify="flex-end" class="reply-action-item-right">
                      <AButton type="text" disabled size="small" :icon="h(WindowsOutlined)" class="reply-action-info">
                        windows 10
                      </AButton>
                      <AButton type="text" disabled size="small" :icon="h(ChromeOutlined)" class="reply-action-info">
                        chrome
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
              <AFlex :vertical="true" class="reply-input-main" v-show="replyInputVisible">
                <AFlex :vertical="false" align="center" class="reply-input-header">
                  <span class="reply-input-title">{{ t('comment.reply') + '：' }}</span>
                  <span class="reply-input-author">张立国</span>
                  <AButton @click="replyInputVisible = false" type="dashed" size="small" :icon="h(CloseOutlined )"
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
                               :placeholder="commentTextAreaPlaceholder" allow-clear :showCount="false"/>
                    <AFlex :vertical="false" align="center" justify="space-between" class="comment-actions-reply"
                    >
                      <AFlex :vertical="false" align="center">
                        <AFlex :vertical="false" align="center" class="comment-action-item-reply">
                          <AButton type="text" size="small" :icon="h(SmileOutlined)" class="comment-action-icon-reply">
                            {{ t('comment.emoji') }}
                          </AButton>
                        </AFlex>
                        <AFlex :vertical="false" align="center" class="comment-action-item-reply">
                          <AButton type="text" size="small" :icon="h(PictureOutlined)"
                                   class="comment-action-icon-reply">
                            {{ t('comment.picture') }}
                          </AButton>
                        </AFlex>
                      </AFlex>
                      <AFlex :vertical="false" align="center">
                        <AButton type="primary" size="middle" class="comment-action-btn-reply">
                          {{ t('comment.sendComment') }}
                        </AButton>
                      </AFlex>
                    </AFlex>
                  </AFlex>
                </AFlex>
              </AFlex>

              <!-- 子回复列表 -->
              <AFlex :vertical="false" class="reply-item-child">
                <AFlex :vertical="true" class="reply-item-child-avatar">
                  <AAvatar :size="40" shape="circle" src="https://api.multiavatar.com/landaiqing.svg"/>
                </AFlex>
                <AFlex :vertical="true" class="reply-item-child-content">
                  <AFlex :vertical="true">
                    <AFlex :vertical="false" align="center">
                      <span class="reply-name-child">沈建明</span> <span class="reply-at">@张立国</span>
                      <a-tag color="cyan" class="reply-tag-child" size="small">Lv.5</a-tag>
                      <!--                      <a-tag color="red" class="reply-tag" size="small">UP</a-tag>-->
                    </AFlex>
                    <AFlex :vertical="false" align="flex-end" justify="space-between">
                      <AFlex :vertical="false" align="center" justify="space-between">
                        <span class="reply-ip-child"> 成都市 </span>
                        <span class="reply-ip-child" style="margin-left: 10px;">IP: 192.168.1.100 </span>
                      </AFlex>
                      <span class="reply-time-child">{{ new Date().toLocaleString() }}</span>
                    </AFlex>
                  </AFlex>
                  <AFlex :vertical="true" align="center">
                    <ACard class="reply-card-child" :body-style="{padding: '10px'}">
                      <span class="reply-text-child">
                    床前明月光，疑是地上霜。<br>
                    举头望明月，低头思故乡。
                  </span>
                      <AFlex :vertical="false" justify="space-between" align="center">
                        <!--评论操作按钮 -->
                        <AFlex :vertical="false" align="center" justify="space-between" class="reply-action-item-child">
                          <AFlex :vertical="false" align="center">
                            <AButton type="text" size="small" :icon="h(LikeOutlined)" class="reply-action-btn-child">
                              10
                            </AButton>
                          </AFlex>
                          <AFlex :vertical="false" align="center">
                            <AButton type="text" size="small" :icon="h(DislikeOutlined)" class="reply-action-btn-child">
                              1
                            </AButton>
                          </AFlex>
                          <AButton type="text" size="small" :icon="h(MessageOutlined)" class="reply-action-btn-child">
                            11
                          </AButton>
                          <AButton
                              @click="replyInputVisible === true? (replyInputVisible = false) : (replyInputVisible = true) "
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
                            windows 10
                          </AButton>
                          <AButton type="text" disabled size="small" :icon="h(ChromeOutlined)"
                                   class="reply-action-info-child">
                            chrome
                          </AButton>
                          <!-- 评论操作按钮 -->
                          <ADropdown trigger="click">
                            <AButton type="text" size="small" :icon="h(EllipsisOutlined)" class="reply-action-btn-child"
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
                    <AFlex :vertical="true" class="reply-input-main-child" v-show="replyInputVisible">
                      <AFlex :vertical="false" align="center" class="reply-input-header-child">
                        <span class="reply-input-title-child">{{ t('comment.reply') + '：' }}</span>
                        <span class="reply-input-author-child">沈建明</span>
                        <AButton @click="replyInputVisible = false" type="dashed" size="small" :icon="h(CloseOutlined )"
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
                                     :placeholder="commentTextAreaPlaceholder" allow-clear :showCount="false"/>
                          <AFlex :vertical="false" align="center" justify="space-between"
                                 class="comment-actions-reply-child"
                          >
                            <AFlex :vertical="false" align="center">
                              <AFlex :vertical="false" align="center" class="comment-action-item-reply-child">
                                <AButton type="text" size="small" :icon="h(SmileOutlined)"
                                         class="comment-action-icon-reply-child">
                                  {{ t('comment.emoji') }}
                                </AButton>
                              </AFlex>
                              <AFlex :vertical="false" align="center" class="comment-action-item-reply-child">
                                <AButton type="text" size="small" :icon="h(PictureOutlined)"
                                         class="comment-action-icon-reply-child">
                                  {{ t('comment.picture') }}
                                </AButton>
                              </AFlex>
                            </AFlex>
                            <AFlex :vertical="false" align="center">
                              <AButton type="primary" size="middle" class="comment-action-btn-reply-child">
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
            </AFlex>

          </AFlex>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {useI18n} from "vue-i18n";
import {h, reactive, ref} from "vue";
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

const {t} = useI18n();
const showCommentActions = ref<boolean>(false);
const commentTextAreaPlaceholder = ref<string>(t('comment.placeholder'));
const data = reactive([t('comment.latest'), t('comment.hot')]);
const segmentedValue = ref<string>(data[0]);
const replyInputVisible = ref<boolean>(false);
const commentContent = ref<string>("");
const fileList = ref<any[]>([]);
const imageList = ref<any[]>([]);

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
</script>
<style src="./index.scss" lang="scss" scoped>

</style>
