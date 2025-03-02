<template>
  <div class="share-sidebar" v-if="shareInfo">
    <div class="share-sidebar-header">
      <AAvatar size="default" shape="circle" :src="shareInfo.sharer_avatar"/>
      <p class="share-sidebar-title">来自
        <span class="ellipsis" style="color: #00aced;cursor: pointer">{{ shareInfo.sharer_name }}</span>
        的分享</p>
    </div>
    <div class="share-sidebar-body">
      <div class="share-sidebar-body-top">
        <AAvatar :size="coverImageSize" shape="square">
          <template #icon>
            <AImage width="100%" height="100%"
                    :src="shareInfo.cover_image?`data:image/png;base64,`+shareInfo.cover_image:default_cover"
                    :preview="false">
            </AImage>
          </template>
        </AAvatar>
        <p>{{ shareInfo.album_name }}</p>
        <p style="color: #de3333; font-size: 12px">{{ formatTimeWithChinese(shareInfo.expire_time) }} 失效</p>
        <AButton type="primary" size="large" shape="round">已加入，去查看</AButton>
        <AButton type="link" size="small" style="font-size: 13px"
                 @click="()=>copyToClipboard(shareInfo.invite_code)">
          复制链接
        </AButton>
      </div>
      <div class="share-sidebar-body-bottom">
        <div class="share-sidebar-body-bottom-item">
          <p class="share-sidebar-body-bottom-item-title">照片</p>
          <p class="share-sidebar-body-bottom-item-title">{{ shareInfo.image_count }}</p>
        </div>
        <div class="share-sidebar-body-bottom-item">
          <p class="share-sidebar-body-bottom-item-title">共享人数</p>
          <p class="share-sidebar-body-bottom-item-title">{{ shareInfo.viewer_count }}</p>
        </div>
        <div class="share-sidebar-body-bottom-item">
          <p class="share-sidebar-body-bottom-item-title">浏览次数</p>
          <p class="share-sidebar-body-bottom-item-title">{{ shareInfo.visit_count }}</p>
        </div>
      </div>
    </div>
    <div class="share-sidebar-footer">
    </div>
  </div>
  <div v-else class="share-sidebar-verify">
    <AAvatar :size="80" :src="lock" shape="square"/>
    <p style="color: #999999">请先输入密码后查看</p>
  </div>
</template>
<script setup lang="ts">

import lock from "@/assets/svgs/lock.svg";
import default_cover from "@/assets/images/default-cover.png";
import {message} from "ant-design-vue";

const coverImageSize = ref<number>(130);

defineProps({
  shareInfo: {
    type: Object,
    default: () => {
    }
  }
});

function formatTimeWithChinese(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() 返回 0-11，需要加 1
  const day = date.getDate();

  return `${year}年${month}月${day}日`;
}

// 复制功能
function copyToClipboard(text: string) {
  const url: string = import.meta.env.VITE_APP_WEB_URL + '/main/share/list/' + text;
  navigator.clipboard.writeText(url).then(() => {
    message.success('复制成功');
  }).catch(() => {
    message.error('复制失败');
  });
}
</script>
<style scoped lang="scss">
.share-sidebar {
  width: 220px;
  height: 100%;
  //height: calc(100vh - 271px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;


  .share-sidebar-header {
    width: 100%;
    height: 15%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #eee;
    gap: 10px;

    .share-sidebar-title {
      font-size: 1.7vh;
      color: #333;
      width: 100px;
    }
  }

  .share-sidebar-body {
    width: 100%;
    height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 20px;

    .share-sidebar-body-top {
      width: 100%;
      height: 80%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 20px;
    }

    .share-sidebar-body-bottom {
      width: 80%;
      height: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 15px;
      padding-left: 10px;
      padding-right: 10px;

      .share-sidebar-body-bottom-item {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .share-sidebar-body-bottom-item-title {
          font-size: 1.8vh;
          color: #333;
        }
      }
    }
  }

  .share-sidebar-footer {
    width: 100%;
    height: 15%;
  }
}

.share-sidebar-verify {
  width: 220px;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
</style>
