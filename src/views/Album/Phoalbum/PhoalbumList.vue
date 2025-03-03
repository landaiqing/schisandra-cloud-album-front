<template>
  <div class="phoalbum">
    <div class="phoalbum-header">
      <APopover placement="right" trigger="click">
        <AButton type="primary" shape="round" size="middle">
          <template #icon>
            <PlusSquareOutlined/>
          </template>
          创建相册
        </AButton>
        <template #content>
          <span style="color: #999; font-size: 15px;">创建相册</span>
          <AInput placeholder="请填写相册名称" class="phoalbum-create-input"
                  style="margin-top: 15px"
                  v-model:value="albumNameValue" size="large">
            <template #suffix>
              <AButton type="text" @click.prevent size="middle" style="color: #0e87cc" @click="createAlbumSubmit">
                确认
              </AButton>
            </template>
          </AInput>
        </template>

      </APopover>
      <ADropdown>
        <AButton type="default" shape="round" size="middle">
          <template #icon>
            <OrderedListOutlined/>
          </template>
          排序
        </AButton>
        <template #overlay>
          <AMenu selectable :selectedKeys="[imageStore.sortSelectedKey]" @select="handleSelect">
            <AMenuItem :key="true">按时间排序</AMenuItem>
            <AMenuItem :key="false">按名称排序</AMenuItem>
          </AMenu>
        </template>
      </ADropdown>
      <AInput class="phoalbum-search" placeholder="搜索相册" v-model:value="searchValue"
              @pressEnter="(e)=>searchAlbum(e.target.value)">
        <template #suffix>
          <AButton size="small" type="text" shape="circle" @click.stop="searchAlbum(searchValue)">
            <template #icon>
              <SearchOutlined/>
            </template>
          </AButton>
        </template>
      </AInput>
    </div>
    <div class="phoalbum-content">
      <ATabs size="small" :tabBarGutter="50" type="line" tabPosition="top" :tabBarStyle="{position:'unset'}"
             style="width: 100%;"
             v-model:activeKey="imageStore.tabActiveKey"
             @change="handleTabChange">
        <template #rightExtra>
          <span
              style="color: #999; font-size: 12px;">已全部加载，共 {{
              imageStore.albumList ? imageStore.albumList.length : 0
            }} 个相册</span>
        </template>
        <ATabPane key="-1" :tab="imageStore.tabMap[-1]">
          <AlbumCard/>
        </ATabPane>
        <ATabPane key="0" :tab="imageStore.tabMap[0]">
          <AlbumCard/>
        </ATabPane>
        <ATabPane key="1" :tab="imageStore.tabMap[1]">
          <AlbumCard/>
        </ATabPane>
        <ATabPane key="2" :tab="imageStore.tabMap[2]">
          <AlbumCard/>
        </ATabPane>
      </ATabs>
    </div>
    <AlbumShareModal/>
  </div>
</template>
<script setup lang="ts">
import {albumSearchApi, createAlbumApi} from "@/api/storage";
import {message} from "ant-design-vue";

import useStore from "@/store";

import AlbumShareModal from "@/views/Album/Phoalbum/AlbumShareModal.vue";
import AlbumCard from "@/views/Album/Phoalbum/AlbumCard.vue";


const albumNameValue = ref<string>("未命名相册");


const imageStore = useStore().image;

/**
 * 创建相册
 */
async function createAlbumSubmit() {
  if (albumNameValue.value.trim() === "") {
    message.error("相册名称不能为空");
    return;
  }
  const res: any = await createAlbumApi(albumNameValue.value);
  if (res && res.code === 200) {
    albumNameValue.value = "未命名相册";
    await imageStore.getAlbumList();
  } else {
    message.error("创建相册失败");
  }
}

/**
 * 选择排序方式
 * @param key
 */
async function handleSelect({key}) {
  imageStore.sortSelectedKey = key;
  await imageStore.getAlbumList();
}

/**
 * 切换相册列表
 * @param activeKey
 */
async function handleTabChange(activeKey: string) {
  imageStore.tabActiveKey = activeKey;
  await imageStore.getAlbumList();
}

const searchValue = ref<string>("");

/**
 * 搜索相册
 * @param keyword
 */
async function searchAlbum(keyword: string) {
  if (keyword.trim() === "") {
    return;
  }
  const res: any = await albumSearchApi(keyword);
  if (res && res.code === 200) {
    imageStore.albumList = res.data.albums;
  }
}




onMounted(() => {
  imageStore.getAlbumList();
});

</script>
<style scoped lang="scss">
.phoalbum {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  position: relative;

  .phoalbum-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .phoalbum-search {
      width: 300px;
      border-radius: 20px;
    }
  }

  .phoalbum-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: calc(100% - 65px);
  }
}

.phoalbum-create-popover-text {
  //font-size: 13px;
  color: rgba(102, 102, 102, 0.87);
}
</style>
