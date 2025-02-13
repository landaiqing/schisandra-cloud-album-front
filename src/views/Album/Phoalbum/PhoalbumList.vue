<template>
  <div class="phoalbum">
    <div class="phoalbum-header">
      <APopover placement="bottom" trigger="click">
        <AButton type="primary" shape="round" size="middle">
          <template #icon>
            <PlusSquareOutlined/>
          </template>
          创建相册
        </AButton>
        <template #content>
          <span style="color: #999; font-size: 15px;">创建相册</span>
          <AInputGroup compact style="display: flex;flex-direction: row;margin-top: 15px">
            <AInput placeholder="请填写相册名称" class="phoalbum-create-input"
                    v-model:value="albumNameValue" size="large">
              <template #suffix>
                <AButton type="text" @click.prevent size="middle" style="color: #0e87cc" @click="createAlbumSubmit">
                  确认
                </AButton>
              </template>
            </AInput>
          </AInputGroup>
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
          <AMenu selectable :selectedKeys="[selecetedKey]" @select="handleSelect">
            <AMenuItem :key="true">按时间排序</AMenuItem>
            <AMenuItem :key="false">按名称排序</AMenuItem>
          </AMenu>
        </template>
      </ADropdown>
      <AInput class="phoalbum-search" placeholder="搜索相册">
        <template #suffix>
          <AButton size="small" type="text" shape="circle" @click.prevent>
            <template #icon>
              <SearchOutlined/>
            </template>
          </AButton>
        </template>
      </AInput>
    </div>
    <div class="phoalbum-content">
      <ATabs size="small" :tabBarGutter="50" type="line" tabPosition="top" :tabBarStyle="{position:'unset'}"
             style="width: 100%;" @change="handleTabChange">
        <template #rightExtra>
          <span
              style="color: #999; font-size: 12px;">已全部加载，共 {{ albumList ? albumList.length : 0 }} 个相册</span>
        </template>
        <ATabPane key="0" tab="全部相册">
          <ASpin tip="Loading..." :spinning="loading" size="large">
            <div class="phoalbum-item-container">
              <div class="phoalbum-item"
                   v-for="(album, index) in albumList"
                   :key="album.id"
                   @click.prevent="handleClick(album.id)"
                   @mouseover="isHovered = index"
                   @mouseleave="isHovered = null">
                <PhotoStack :src="album.cover_image" :default-src="default_cover"/>
                <div class="phoalbum-item-info">
                  <span class="phoalbum-item-name">{{ album.name }}</span>
                  <span class="phoalbum-item-date">{{ album.created_at }}</span>
                </div>
                <div class="phoalbum-item-operation"
                     :class="{ 'fade-in': isHovered === index, 'fade-out': isHovered !== index }">
                  <ADropdown trigger="click" @click.stop>
                    <AButton type="text" shape="circle" size="small" @click.prevent>
                      <template #icon>
                        <AAvatar shape="circle" size="small" :src="more"/>
                      </template>
                    </AButton>
                    <template #overlay>
                      <AMenu>
                        <APopover placement="left" trigger="click">
                          <AMenuItem key="1">重命名相册</AMenuItem>
                          <template #content>
                            <AInput :placeholder="album.name" class="phoalbum-create-input"
                                    v-model:value="albumRenameValue">
                              <template #suffix>
                                <AButton type="text" @click.prevent size="small" style="color: #0e87cc"
                                         @click="renameAlbum(album.id, albumRenameValue)">
                                  确认
                                </AButton>
                              </template>
                            </AInput>
                          </template>
                        </APopover>
                        <AMenuItem key="2">分享相册</AMenuItem>
                        <AMenuItem key="3" @click.prevent="deleteAlbum(album.id)">删除相册</AMenuItem>
                        <AMenuItem key="4">下载相册</AMenuItem>
                      </AMenu>
                    </template>
                  </ADropdown>
                </div>
              </div>
            </div>
          </ASpin>
        </ATabPane>
        <ATabPane key="1" tab="我的相册">

        </ATabPane>
        <ATabPane key="2" tab="收藏相册">

        </ATabPane>
      </ATabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import more from "@/assets/svgs/more.svg";
import {albumListApi, createAlbumApi, deleteAlbumApi, renameAlbumApi} from "@/api/storage";
import {message} from "ant-design-vue";
import default_cover from "@/assets/images/default-cover.png";

const isHovered = ref<number | null>(null);

const albumNameValue = ref<string>("未命名相册");
const albumRenameValue = ref<string>("");

const selecetedKey = ref<boolean>(true);

const albumList = ref<any[]>([]);

const loading = ref<boolean>(false);

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
    await getAlbumList("0", selecetedKey.value);
  } else {
    message.error("创建相册失败");
  }
}

/**
 * 选择排序方式
 * @param key
 */
async function handleSelect({key}) {
  selecetedKey.value = key;
  await getAlbumList("0", key);
}

/**
 * 切换相册列表
 * @param activeKey
 */
async function handleTabChange(activeKey: string) {
  await getAlbumList(activeKey, selecetedKey.value);
}

/**
 * 获取相册列表
 * @param type
 * @param sort
 */
async function getAlbumList(type: string = "0", sort: boolean = true) {
  albumList.value = [];
  loading.value = true;
  const res: any = await albumListApi(type, sort);
  if (res && res.code === 200) {
    albumList.value = res.data.albums;
  }
  loading.value = false;
}

/**
 * 重命名相册
 * @param id
 * @param name
 */
async function renameAlbum(id: number, name: string) {
  if (name.trim() === "") {
    message.warning("相册名称不能为空");
    return;
  }
  const res: any = await renameAlbumApi(id, name);
  if (res && res.code === 200) {
    albumRenameValue.value = "";
    await getAlbumList("0", selecetedKey.value);
  }
}

/**
 * 删除相册
 * @param id
 */
async function deleteAlbum(id: number) {
  const res: any = await deleteAlbumApi(id);
  if (res && res.code === 200) {
    await getAlbumList("0", selecetedKey.value);
  } else {
    message.error("删除相册失败");
  }
}

const route = useRoute();
const router = useRouter();

/**
 *  点击相册跳转到详情页
 * @param id
 */
function handleClick(id: number) {
  router.push({path: route.path + `/${id}`});
}

onMounted(() => {
  getAlbumList("0", selecetedKey.value);
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

    .phoalbum-item-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 40px;
      width: 100%;
      height: 100%;
      overflow-y: auto;

      .phoalbum-item {
        width: 200px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 15px;
        padding: 10px;
        position: relative;
        cursor: pointer;

        .phoalbum-item-info {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;

          .phoalbum-item-name {
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }

          .phoalbum-item-date {
            font-size: 12px;
            color: #999;
          }
        }

        .phoalbum-item-operation {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 10;
          opacity: 0;
          transform: scale(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .fade-in {
          opacity: 1; /* 显示时透明度为1 */
          transform: scale(1); /* 显示时缩放为1 */
          z-index: 10; /* 显示时z-index为10 */
        }

        .fade-out {
          opacity: 0; /* 隐藏时透明度为0 */
          transform: scale(0); /* 隐藏时缩放为0 */
        }
      }
    }

  }
}

.phoalbum-create-popover-text {
  //font-size: 13px;
  color: rgba(102, 102, 102, 0.87);
}
</style>
