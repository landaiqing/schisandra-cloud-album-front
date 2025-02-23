<template>
  <AFlex :vertical="false" align="center" justify="flex-start" class="header-logo-container">
    <APopover placement="bottomRight" trigger="click" :arrow="false">
      <template #content>
        <div class="header-logo-popover">
          <div class="header-logo-popover-card" @click="router.push('/main/photo/all')">
            <AFlex :vertical="false" align="center" justify="space-between">
              <AAvatar class="avatar-bounce" size="default" shape="square" :src="allPhoto"/>
              <span class="header-logo-popover-text">{{ t('album.allAlbums') }}</span>
            </AFlex>
          </div>
          <div class="header-logo-popover-card" @click="router.push('/main/photo/recent')">
            <AFlex :vertical="false" align="center" justify="space-between">
              <AAvatar size="default" shape="square" :src="recentUpload"/>
              <span class="header-logo-popover-text">{{ t('album.recentUploads') }}</span>
            </AFlex>

          </div>
          <div class="header-logo-popover-card" @click="router.push('/main/album/albums')">
            <AFlex :vertical="false" align="center" justify="space-between">
              <AAvatar size="default" shape="square" :src="album"/>
              <span class="header-logo-popover-text">{{ t('album.albums') }}</span>
            </AFlex>

          </div>
          <div class="header-logo-popover-card" @click="router.push('/main/album/people')">
            <AFlex :vertical="false" align="center" justify="space-between">
              <AAvatar size="default" shape="square" :src="peopleAlbum"/>
              <span class="header-logo-popover-text">{{ t('album.peopleAlbums') }}</span>
            </AFlex>

          </div>
          <div class="header-logo-popover-card" @click="router.push('/main/album/location')">
            <AFlex :vertical="false" align="center" justify="space-between">
              <AAvatar size="default" shape="square" :src="locationAlbum"/>
              <span class="header-logo-popover-text">{{ t('album.locationAlbums') }}</span>
            </AFlex>

          </div>
          <div class="header-logo-popover-card" @click="router.push('/main/album/thing')">
            <AFlex :vertical="false" align="center" justify="space-between">
              <AAvatar size="default" shape="square" :src="thingAlbum"/>
              <span class="header-logo-popover-text">{{ t('album.thingsAlbums') }}</span>
            </AFlex>

          </div>
          <div class="header-logo-popover-card" @click="router.push('/main/photo/share')">
            <AFlex :vertical="false" align="center" justify="space-between">
              <AAvatar size="default" shape="square" :src="share"/>
              <span class="header-logo-popover-text">{{ t('album.share') }}</span>
            </AFlex>

          </div>
          <div class="header-logo-popover-card" @click="router.push('/main/photo/recycling')">
            <AFlex :vertical="false" align="center" justify="space-between">
              <AAvatar size="small" shape="square" :src="recyclingbin"/>
              <span class="header-logo-popover-text">{{ t('album.recyclingBin') }}</span>
            </AFlex>

          </div>
          <div class="header-logo-popover-card" @click="router.push('/main/photo/phone')">
            <AFlex :vertical="false" align="center" justify="space-between">
              <AAvatar size="small" shape="square" :src="ai"/>
              <span class="header-logo-popover-text">{{ t('album.phone') }}</span>
            </AFlex>

          </div>
        </div>
      </template>
      <ACard :body-style="{ padding: '0px' }" :hoverable="true"
             @focus="handleCardFocus"
             @blur="handleCardBlur"
             tabindex="0"
             :style="cardStyle">
        <AAvatar :size="50" shape="square" :src="logo"/>
      </ACard>
    </APopover>
    <span class="header-logo-text" @click="router.push('/')">S.Album</span>
  </AFlex>
</template>
<script setup lang="ts">

import logo from "@/assets/svgs/logo-album.svg";
import {useI18n} from 'vue-i18n';
import allPhoto from '@/assets/svgs/all-photo.svg';
import recentUpload from '@/assets/svgs/recent-upload.svg';
import album from '@/assets/svgs/album.svg';
import peopleAlbum from '@/assets/svgs/people-album.svg';
import locationAlbum from '@/assets/svgs/location-album.svg';
import thingAlbum from '@/assets/svgs/thing-album.svg';
import recyclingbin from '@/assets/svgs/recyclingbin.svg';
import ai from '@/assets/svgs/ai.svg';
import share from '@/assets/svgs/share.svg';

const router = useRouter();

const {t} = useI18n();
const cardShadow = ref('none');
/**
 * 监听卡片聚焦事件
 */
const handleCardFocus = () => {
  cardShadow.value = '0 0 10px rgba(0, 123, 255, 0.5)'; // 卡片的阴影
};
/**
 * 监听卡片失焦事件
 */
const handleCardBlur = () => {
  cardShadow.value = 'none'; // 失去焦点时阴影消失
};

// 将卡片样式作为计算属性
const cardStyle = computed(() => ({
  boxShadow: cardShadow.value,
}));
</script>
<style scoped lang="scss">
.header-logo-container {
  min-width: 20%;
  display: flex;
  align-items: center;

  .header-logo-text {
    margin-left: 2%;
    font-size: 1.8rem;
    font-family: "Comic Sans MS", cursive;
    font-weight: bold;
    cursor: pointer;
  }
}

.header-logo-popover {
  width: 450px;
  height: 200px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 10px;

  .header-logo-popover-card {
    width: 25%;
    height: 15%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 15px;
    border: 1px solid #ccc;
    padding: 5px;


    .header-logo-popover-text {
      font-size: 15px;
      margin-left: 10px;
      font-weight: bold;
    }
  }

  .avatar-bounce {
    display: inline-block; /* 必须设置为 inline-block 或 block */
    transition: transform 0.2s ease-in-out; /* 设置变换的过渡效果 */
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0); /* 初始位置 */
    }
    40% {
      transform: translateY(-10px); /* 向上移动 */
    }
    60% {
      transform: translateY(-5px); /* 稍微下移 */
    }
  }

  .header-logo-popover-card:hover {
    cursor: pointer;
    background-color: #EEEEF6;
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
    animation: bounce 0.5s;
  }
}
</style>
