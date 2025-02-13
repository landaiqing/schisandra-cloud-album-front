<script setup lang="ts">

const props = defineProps({
  selected: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <transition name="slide-fade">
    <div v-show="props.selected.length > 0" class="photo-toolbar-header">
      <div class="photo-toolbar-left">
        <AButton type="text" shape="circle" size="large" class="photo-toolbar-btn">
          <template #icon>
            <CloseOutlined class="photo-toolbar-icon"/>
          </template>
        </AButton>
        <span style="font-size: 16px;font-weight: bold">
          已选择 {{ props.selected.length }} 张照片
        </span>
        <AButton type="text" shape="default" class="photo-toolbar-btn" size="middle">
          全选
        </AButton>
      </div>
      <div class="photo-toolbar-right">
        <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn">
          <template #icon>
            <PlusSquareOutlined class="photo-toolbar-icon"/>
          </template>
          添加到
        </AButton>
        <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn">
          <template #icon>
            <DownloadOutlined class="photo-toolbar-icon"/>
          </template>
          下载原图
        </AButton>
        <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn">
          <template #icon>
            <ShareAltOutlined class="photo-toolbar-icon"/>
          </template>
          分享
        </AButton>
        <AButton type="text" shape="default" size="middle" class="photo-toolbar-btn">
          <template #icon>
            <DeleteOutlined class="photo-toolbar-icon"/>
          </template>
          删除
        </AButton>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.photo-toolbar-header {
  position: fixed;
  width: calc(100% - 220px);
  height: 70px;
  top: 70px;
  z-index: 3;

  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(45deg, #5789ff, #5c7bff 100%);
  color: #fff;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .06);
  padding: 0 20px;


  .photo-toolbar-left {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;

  }

  .photo-toolbar-right {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 30px;
  }

  .photo-toolbar-icon {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
  }

  .photo-toolbar-btn {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to { /* .slide-fade-leave-active 在离开之前 */
  transform: translateY(-20px);
  opacity: 0;
}

.slide-fade-enter-from {
  transform: translateY(-30px);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}
</style>
