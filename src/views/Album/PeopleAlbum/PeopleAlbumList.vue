<template>
  <div class="people-album">
    <div class="people-album-header">
      <ADropdown trigger="click">
        <AButton type="text" size="large" class="people-album-button">
          {{ imageStore.faceSelectedKey === '0' ? '人 物' : '已隐藏' }}
          <DownOutlined class="people-album-icon"/>
        </AButton>
        <template #overlay>
          <AMenu selectable :selectedKeys="[imageStore.faceSelectedKey]" @select="handleSelect">
            <AMenuItem key="0">人 物</AMenuItem>
            <AMenuItem key="1">已隐藏</AMenuItem>
          </AMenu>
        </template>
      </ADropdown>
      <span class="people-album-count">共<span style="color: #0e87cc">{{ imageStore.faceList.length }}</span>位</span>
    </div>
    <PeopleAlbumToolbar :face-list="imageStore.faceList"/>
    <div class="people-album-container">
      <Spin :spinning="imageStore.faceListLoading" size="large" indicator="spin-dot">
        <div class="people-album-content"
             v-if="imageStore.faceList.length !== 0 && upload.storageSelected?.[0] && upload.storageSelected?.[1]">
          <CheckCard
              v-for="(item, index) in imageStore.faceList"
              :key="index"
              @click="handleClick(item.id, item.face_name, item.face_image)"
              class="photo-item"
              margin="0"
              border-radius="0"
              v-model="imageStore.faceSelected"
              :showHoverCircle="true"
              :background-color="'transparent'"
              :iconSize="20"
              :showSelectedEffect="false"
              :value="item.id">
            <div class="people-album-item"
                 :class="{ 'selected-item': imageStore.faceSelected.includes(item.id) }"
                 @mouseover="item.showButton = true"
                 @mouseleave="item.showButton = false">
              <div class="people-album-item-avatar">
                <AAvatar :size="86" shape="circle" :src="item.face_image"/>
              </div>
              <div class="people-album-item-name" v-show="!item.face_name">
                <AButton @click.stop="showAddNameInput(index)" class="people-album-add-name"
                         v-show="item.showButton && !item.showInput"
                         type="link"
                         size="small">
                  添加名字
                </AButton>
                <AInput v-model:value="addNameInputValue" v-show="item.showInput"
                        @blur="hideAddNameInput(index)" size="small"
                        :maxlength="10"
                        @click.stop
                        :placeholder="item.face_name"
                        autofocus
                        class="people-album-add-input">
                  <template #suffix>
                    <AButton type="link" style="font-size: 12px;" size="small" @mousedown.prevent
                             @click.stop="modifyFaceName(item.id,index)">完成
                    </AButton>
                  </template>
                </AInput>
              </div>
              <div class="people-album-item-name" v-show="item.face_name">
                <AButton @click.stop="showAddNameInput(index)" class="people-album-add-name" v-show="!item.showInput"
                         type="link"
                         size="small">
                  {{ item.face_name }}
                </AButton>
                <AInput v-model:value="addNameInputValue" autofocus @click.stop v-show="item.showInput"
                        @blur="hideAddNameInput(index)" size="small"
                        :maxlength="10"
                        :placeholder="item.face_name"
                        class="people-album-add-input">
                  <template #suffix>
                    <AButton type="link" style="font-size: 12px;" size="small" @mousedown.prevent
                             @click.stop="modifyFaceName(item.id,index)">完成
                    </AButton>
                  </template>
                </AInput>
              </div>
            </div>

          </CheckCard>

        </div>
        <div v-if="!imageStore.imageListLoading&& imageStore.faceList.length === 0" class="empty-content">
          <AEmpty :image="empty" :image-style="{width: '100%', height: '100%'}">
            <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  暂无照片，快去上传吧
                </span>
            </template>
          </AEmpty>
        </div>
      </Spin>
    </div>
  </div>
</template>
<script setup lang="ts">
import {modifyFaceSampleName} from "@/api/storage";
import empty from "@/assets/svgs/empty.svg";
import useStore from "@/store";
import PeopleAlbumToolbar from "@/views/Album/PeopleAlbum/PeopleAlbumToolbar.vue";


const addNameInputValue = ref<string>('');

const imageStore = useStore().image;
const upload =useStore().upload;

function showAddNameInput(index: number) {
  if (imageStore.faceList[index]) {
    imageStore.faceList[index].showInput = true;
    imageStore.faceList[index].showButton = false;
  }
}

function hideAddNameInput(index: number) {
  if (imageStore.faceList[index]) {
    imageStore.faceList[index].showInput = false;
    imageStore.faceList[index].showButton = false;
  }
}

/**
 * 修改人脸名称
 * @param id
 * @param index
 */
async function modifyFaceName(id: number, index: number) {
  if (!addNameInputValue.value.trim()) return;
  const res: any = await modifyFaceSampleName(id, addNameInputValue.value);
  if (res && res.code === 200) {
    imageStore.faceList[index].face_name = res.data.face_name;
    addNameInputValue.value = '';
    hideAddNameInput(index);
  }
}

/**
 * 选择分类
 * @param key
 */
function handleSelect({key}) {
  imageStore.faceSelectedKey = key;
  imageStore.getFaceList();
}


const route = useRoute();
const router = useRouter();

/**
 *     点击人物跳转到详情页
 * @param id
 * @param name
 * @param thumb
 */
function handleClick(id: number, name: string | null, thumb: string | null) {
  router.push({path: route.path + `/${id}`, query: {name: name, thumb: thumb}});
}

onMounted(() => {
  imageStore.getFaceList();
});


</script>
<style scoped lang="scss">
.people-album {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  position: relative;

  .people-album-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .people-album-button {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: #333;

      .people-album-icon {
        font-size: 12px;
        font-weight: bold;
        color: #999;
      }

    }

    .people-album-count {
      width: 100%;
      font-size: 13px;
      color: rgba(129, 129, 138, 0.99);
    }
  }


  .people-album-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;

    .spin-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .people-album-content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
      padding-top: 20px;
      padding-left: 20px;
      padding-right: 20px;
      gap: 20px;


      .people-album-item {
        width: 130px;
        height: 160px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        transition: all 0.3s ease;
        position: relative;
        cursor: pointer;

        .people-album-item-avatar {
          width: 100%;
          height: 75%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .people-album-item-name {
          width: 100%;
          height: 25%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;

          .people-album-add-input {
            width: 80%;
          }
        }


        .people-album-add-name {
          color: rgba(110, 110, 113, 0.99);
          font-size: 13px;
        }

        .people-album-add-name:hover {
          color: #0e87cc;
        }
      }

      .people-album-item:hover,
      .people-album-item.selected-item {
        background-color: rgba(248, 248, 248, 0.74);
        opacity: 1;
        transform: scale(1.05);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
    }

  }
}


.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from, .fade-leave-to { /* .slide-fade-leave-active 在离开之前 */
  transform: translateY(-20px);
  opacity: 0;
}

.fade-enter-from {
  transform: translateY(-30px);
  opacity: 0;
}

.fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}
</style>
