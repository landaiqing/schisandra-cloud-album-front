<template>
  <div>
    <div class="sidebar">
      <AMenu
          :selectedKeys="[router.currentRoute.value.path.split('/').slice(-2).join('/')]"
          :selectable="true"
          :multiple="false"
          mode="vertical"
          :inlineIndent="24"
          :inlineCollapsed="false"
          @select="handleClick"
      >
        <AMenuItemGroup :title="t('album.photo')" type="group" key="photo">
          <AMenuItem :title="t('album.allAlbums')" key="photo/all">
            <template #icon>
              <AAvatar shape="square" size="small" :src="allPhoto"/>
            </template>
            <span class="ant-menu-item-title">{{ t('album.allAlbums') }}</span>
          </AMenuItem>
          <AMenuItem :title="t('album.recentUploads')" key="photo/recent">
            <template #icon>
              <AAvatar shape="square" size="small" :src="recentUpload"/>
            </template>
            <span class="ant-menu-item-title">{{ t('album.recentUploads') }}</span>
          </AMenuItem>
        </AMenuItemGroup>
        <AMenuItemGroup :title="t('album.albums')" key="album">
          <AMenuItem :title="t('album.albums')" key="album/albums">
            <template #icon>
              <AAvatar shape="square" size="small" :src="album"/>
            </template>
            <span class="ant-menu-item-title">{{ t('album.albums') }}</span>
          </AMenuItem>
          <AMenuItem :title="t('album.peopleAlbums')" key="album/people">
            <template #icon>
              <AAvatar shape="square" size="small" :src="peopleAlbum"/>
            </template>
            <span class="ant-menu-item-title">{{ t('album.peopleAlbums') }}</span>
          </AMenuItem>
          <AMenuItem :title="t('album.locationAlbums')" key="album/location">
            <template #icon>
              <AAvatar shape="square" size="small" :src="loactionAlbum"/>
            </template>
            <span class="ant-menu-item-title">{{ t('album.locationAlbums') }}</span>
          </AMenuItem>
          <AMenuItem :title="t('album.thingsAlbums')" key="album/thing">
            <template #icon>
              <AAvatar shape="square" size="small" :src="thingAlbum"/>
            </template>
            <span class="ant-menu-item-title">{{ t('album.thingsAlbums') }}</span>
          </AMenuItem>
        </AMenuItemGroup>
        <ADivider/>
        <AMenuItem :title="t('album.recyclingBin')" key="photo/share">
          <template #icon>
            <AAvatar shape="square" size="small" :src="share"/>
          </template>
          <span class="ant-menu-item-title">{{ t('album.share') }}</span>
        </AMenuItem>
        <AMenuItem :title="t('album.recyclingBin')" key="photo/recycling">
          <template #icon>
            <AAvatar shape="square" size="small" :src="recyclingbin"/>
          </template>
          <span class="ant-menu-item-title">{{ t('album.recyclingBin') }}</span>
        </AMenuItem>
        <AMenuItem :title="t('album.recyclingBin')" key="photo/upscale">
          <template #icon>
            <AAvatar shape="square" size="small" :src="ai"/>
          </template>
          <span class="ant-menu-item-title">{{ t('album.upscale') }}</span>
        </AMenuItem>
      </AMenu>
    </div>
    <div class="sidebar-bottom">
      <ACard :bordered="false" style="box-shadow: none">
        <Folder/>
        <span class="sidebar-folder-text-title">30% In-used</span>
        <AProgress :percent="30" size="small" :showInfo="false" style="width: 150px"/>
        <AFlex :vertical="false" align="center" justify="space-between" style="width: 150px">
          <span class="sidebar-folder-info-text1">500G</span>
          <span class="sidebar-folder-info-text2">500G</span>
        </AFlex>
      </ACard>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import allPhoto from '@/assets/svgs/all-photo.svg';
import recentUpload from '@/assets/svgs/recent-upload.svg';
import album from '@/assets/svgs/album.svg';
import peopleAlbum from '@/assets/svgs/people-album.svg';
import loactionAlbum from '@/assets/svgs/location-album.svg';
import thingAlbum from '@/assets/svgs/thing-album.svg';
import recyclingbin from '@/assets/svgs/recyclingbin.svg';
import Folder from "@/components/Folder/Folder.vue";
import ai from '@/assets/svgs/ai.svg';
import share from '@/assets/svgs/share.svg';
const {t} = useI18n();
const router = useRouter();


/**
 * handle click event of menu item
 * @param key
 */
function handleClick({key}) {
  router.push(`/main/${key}`);
}

</script>
<style scoped lang="scss" src="./index.scss">

</style>
