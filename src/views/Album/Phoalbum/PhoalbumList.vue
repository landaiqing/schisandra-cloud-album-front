<template>
  <div class="phoalbum">
    <div class="phoalbum-header">
      <AButton type="primary" shape="round" size="middle">
        <template #icon>
          <PlusSquareOutlined/>
        </template>
        创建相册
      </AButton>
      <ADropdown>
        <AButton type="default" shape="round" size="middle">
          <template #icon>
            <OrderedListOutlined/>
          </template>
          排序
        </AButton>
        <template #overlay>
          <AMenu>
            <AMenuItem key="1">按时间排序</AMenuItem>
            <AMenuItem key="2">按名称排序</AMenuItem>
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
             style="width: 100%;">
        <template #rightExtra>
          <span style="color: #999; font-size: 12px;">已全部加载，共 0 个相册</span>
        </template>
        <ATabPane key="1" tab="全部相册">
          <div class="phoalbum-item-container">
            <div class="phoalbum-item" @mouseover="isHovered = true" @mouseleave="isHovered = false">
              <PhotoStack :src="'/test/1.png'" default-src=""/>
              <div class="phoalbum-item-info">
                <span class="phoalbum-item-name">我的相册</span>
                <span class="phoalbum-item-date">2022-01-01</span>
              </div>
              <div class="phoalbum-item-operation" :class="{ 'fade-in': isHovered, 'fade-out': !isHovered }">
                <ADropdown trigger="click">
                  <AButton type="text" shape="circle" size="small">
                    <template #icon>
                      <AAvatar shape="circle" size="small" :src="more"/>
                    </template>
                  </AButton>
                  <template #overlay>
                    <AMenu>
                      <AMenuItem key="1">重命名相册</AMenuItem>
                      <AMenuItem key="2">分享相册</AMenuItem>
                      <AMenuItem key="3">删除相册</AMenuItem>
                      <AMenuItem key="4">下载相册</AMenuItem>
                    </AMenu>
                  </template>
                </ADropdown>
              </div>
            </div>
          </div>
        </ATabPane>
        <ATabPane key="2" tab="我的相册">

        </ATabPane>
        <ATabPane key="3" tab="收藏相册">
        </ATabPane>
      </ATabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import more from "@/assets/svgs/more.svg";


const isHovered = ref<boolean>(false);



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
      align-items: flex-start;
      justify-content: flex-start;
      gap: 20px;
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
</style>
