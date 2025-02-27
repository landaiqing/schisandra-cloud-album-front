<template>
  <transition name="fade">
    <div class="people-album-toolbar" v-show="imageStore.faceSelected.length !== 0">
      <div class="people-album-toolbar-left">
        <AButton type="text" shape="circle" size="large" class="people-album-toolbar-btn" @click="cancelSelectPeople">
          <template #icon>
            <CloseOutlined class="people-album-toolbar-icon"/>
          </template>
        </AButton>
        <span style="font-size: 16px;font-weight: bold">
          已选择 {{ imageStore.faceSelected.length }} 个人物
        </span>
        <AButton type="text" shape="default" class="people-album-toolbar-btn" size="middle" @click="selectAllPeople">
          全选
        </AButton>
      </div>
      <div class="people-album-toolbar-right">

        <AButton type="text" shape="default" size="middle" class="people-album-toolbar-btn"
                 :disabled="imageStore.faceSelected.length !== 2" v-if="imageStore.faceSelectedKey === '0'">
          <template #icon>
            <BlockOutlined class="people-album-toolbar-icon"/>
          </template>
          合并人物
        </AButton>

        <AButton type="text" shape="default" size="middle" class="people-album-toolbar-btn" @click="hiddenFace">
          <template #icon>
            <EyeInvisibleOutlined class="people-album-toolbar-icon"/>
          </template>
          {{ imageStore.faceSelectedKey === '0' ? '隐藏人物' : '取消隐藏' }}
        </AButton>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import useStore from "@/store";
import {modifyFaceTypeBatch} from "@/api/storage";

const props = defineProps({
  faceList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
});

const imageStore = useStore().image;

/**
 * 全选
 */
function selectAllPeople() {
  imageStore.faceSelected = props.faceList.map((item) => item.id);
}

/**
 * 取消选择
 */
function cancelSelectPeople() {
  imageStore.faceSelected = [];
}

/**
 * 隐藏人物
 */
async function hiddenFace() {
  if (imageStore.faceSelected.length === 0) return;
  const res: any = await modifyFaceTypeBatch(imageStore.faceSelected, imageStore.faceSelectedKey === '0' ? 1 : 0);
  if (res && res.code === 200) {
    await  imageStore.getFaceList();
    imageStore.faceSelected= [];
  }
}
</script>
<style scoped lang="scss">
.people-album-toolbar {
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

  .people-album-toolbar-left {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
  }

  .people-album-toolbar-right {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 30px;
  }

  .people-album-toolbar-icon {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
  }

  .people-album-toolbar-btn {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
