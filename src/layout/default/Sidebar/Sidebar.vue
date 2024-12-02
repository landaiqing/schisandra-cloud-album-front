<template>
  <div>
    <AMenu
        v-model:selectedKeys="state.selectedKeys"
        class="sidebar"
        :selectable="true"
        :multiple="false"
        mode="vertical"
        v-model:openKeys="state.openKeys"
        :inlineIndent="30"
        :inlineCollapsed="false"
        :items="items"
        @click="handleClick"
    >
    </AMenu>
  </div>
</template>
<script lang="ts" setup>
import {VueElement, h, reactive} from 'vue';
import {
  PictureOutlined,
  TagsOutlined,
  AppstoreOutlined,
  UploadOutlined,
  RestOutlined,
  TagOutlined,
  SmileOutlined,
  EnvironmentOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons-vue';
import {ItemType} from 'ant-design-vue';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const router = useRouter();
const state = reactive({
  openKeys: [router.currentRoute.value.path.split('/').slice(-1)],
  selectedKeys: [router.currentRoute.value.path.split('/').slice(-1)],
});

function getItem(
    label: VueElement | string,
    key: string,
    icon?: any,
    children?: ItemType[],
    type?: 'group',
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}

const items: ItemType[] = reactive([
  getItem(t('album.photo'), 'photo', () => h(AppstoreOutlined), [
    getItem(t('album.allAlbums'), 'all', () => h(PictureOutlined)),
    getItem(t('album.recentUploads'), 'recent', () => h(UploadOutlined)),
  ]),
  getItem(t('album.albums'), 'album', () => h(TagsOutlined), [
    getItem(t('album.albums'), 'albums', () => h(TagOutlined)),
    getItem(t('album.peopleAlbums'), 'people', () => h(SmileOutlined)),
    getItem(t('album.locationAlbums'), 'location', () => h(EnvironmentOutlined)),
    getItem(t('album.thingsAlbums'), 'thing', () => h(AppstoreAddOutlined)),
  ]),
  getItem(t('album.recyclingBin'), 'recycling', () => h(RestOutlined)),
  getItem('网盘导入', '10'),
]);

function handleClick({keyPath}) {
  const path = keyPath.join('/');
  router.push(`/main/${path}`);
}

</script>
<style scoped lang="scss" src="./index.scss">

</style>
