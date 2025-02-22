<template>
  <div class="people-album">
    <div class="people-album-header">
      <ADropdown trigger="click">
        <AButton type="text" size="large" class="people-album-button">
          {{ selectedKey === '0' ? '人 物' : '已隐藏' }}
          <DownOutlined class="people-album-icon"/>
        </AButton>
        <template #overlay>
          <AMenu selectable :selectedKeys="[selectedKey]" @select="handleSelect">
            <AMenuItem key="0">人 物</AMenuItem>
            <AMenuItem key="1">已隐藏</AMenuItem>
          </AMenu>
        </template>
      </ADropdown>
      <span class="people-album-count">共<span style="color: #0e87cc">{{ faceList.length }}</span>位</span>
    </div>
    <transition name="fade">
      <div class="people-album-toolbar" v-show="selected.length !== 0">
        <div class="people-album-toolbar-left">
          <AButton type="text" shape="circle" size="large" class="people-album-toolbar-btn" @click="cancelSelectPeople">
            <template #icon>
              <CloseOutlined class="people-album-toolbar-icon"/>
            </template>
          </AButton>
          <span style="font-size: 16px;font-weight: bold">
          已选择 {{ selected.length }} 个人物
        </span>
          <AButton type="text" shape="default" class="people-album-toolbar-btn" size="middle" @click="selectAllPeople">
            全选
          </AButton>
        </div>
        <div class="people-album-toolbar-right">

          <AButton type="text" shape="default" size="middle" class="people-album-toolbar-btn"
                   :disabled="selected.length !== 2" v-if="selectedKey === '0'">
            <template #icon>
              <BlockOutlined class="people-album-toolbar-icon"/>
            </template>
            合并人物
          </AButton>

          <AButton type="text" shape="default" size="middle" class="people-album-toolbar-btn" @click="hiddenFace">
            <template #icon>
              <EyeInvisibleOutlined class="people-album-toolbar-icon"/>
            </template>
            {{ selectedKey === '0' ? '隐藏人物' : '取消隐藏' }}
          </AButton>
        </div>
      </div>
    </transition>
    <div class="people-album-container">
      <ASpin :spinning="loading" size="large" wrapperClassName="people-album-container">
        <div class="people-album-content">
          <CheckCard
              v-for="(item, index) in faceList"
              :key="index"
              @click="handleClick(item.id, item.face_name)"
              class="photo-item"
              margin="0"
              border-radius="0"
              v-model="selected"
              :showHoverCircle="true"
              :background-color="'transparent'"
              :iconSize="20"
              :showSelectedEffect="false"
              :value="item.id">
            <div class="people-album-item"
                 :class="{ 'selected-item': selected.includes(item.id) }"
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
                        class="people-album-add-input">
                  <template #suffix>
                    <AButton type="link" style="font-size: 12px;" size="small" @mousedown.prevent
                             @click.stop="modifyFaceName(item.id,index)">完成
                    </AButton>
                  </template>
                </AInput>
              </div>
              <div class="people-album-item-name" v-show="item.face_name">
                <AButton @click="showAddNameInput(index)" class="people-album-add-name" v-show="!item.showInput"
                         type="link"
                         size="small">
                  {{ item.face_name }}
                </AButton>
                <AInput v-model:value="addNameInputValue" autofocus v-show="item.showInput"
                        @blur="hideAddNameInput(index)" size="small"
                        :maxlength="10"
                        :placeholder="item.face_name"
                        class="people-album-add-input">
                  <template #suffix>
                    <AButton type="link" style="font-size: 12px;" size="small" @mousedown.prevent
                             @click="modifyFaceName(item.id,index)">完成
                    </AButton>
                  </template>
                </AInput>
              </div>
            </div>

          </CheckCard>

        </div>
      </ASpin>
    </div>
  </div>
</template>
<script setup lang="ts">
import {getFaceSamplesList, modifyFaceSampleName, modifyFaceTypeBatch} from "@/api/storage";


const faceList = ref<any[]>([]);
const addNameInputValue = ref<string>('');
const selectedKey = ref<string>('0');
const loading = ref<boolean>(false);
const selected = ref<any[]>([]);

/**
 * 获取人脸列表
 */
async function getFaceList(type: number = 0) {
  loading.value = true;
  faceList.value = [];
  const res: any = await getFaceSamplesList(type);
  if (res && res.code === 200 && res.data.faces) {
    faceList.value = res.data.faces.map(face => ({
      ...face,
      showButton: false,
      showInput: false,
    }));
  }
  loading.value = false;
}

function showAddNameInput(index: number) {
  if (faceList.value[index]) {
    faceList.value[index].showInput = true;
    faceList.value[index].showButton = false;
  }
}

function hideAddNameInput(index: number) {
  if (faceList.value[index]) {
    faceList.value[index].showInput = false;
    faceList.value[index].showButton = false;
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
    faceList.value[index].face_name = res.data.face_name;
    addNameInputValue.value = '';
    hideAddNameInput(index);
  }
}

/**
 * 选择分类
 * @param key
 */
function handleSelect({key}) {
  selectedKey.value = key;
  getFaceList(parseInt(key));
}

/**
 * 全选
 */
function selectAllPeople() {
  selected.value = faceList.value.map((item) => item.id);
}

/**
 * 取消选择
 */
function cancelSelectPeople() {
  selected.value = [];
}

/**
 * 隐藏人物
 */
async function hiddenFace() {
  if (selected.value.length === 0) return;
  const res: any = await modifyFaceTypeBatch(selected.value, selectedKey.value === '0' ? 1 : 0);
  if (res && res.code === 200) {
    await getFaceList();
    selected.value = [];
  }
}

const route = useRoute();
const router = useRouter();

/**
 *     点击人物跳转到详情页
 * @param id
 * @param name
 */
function handleClick(id: number, name: string | null) {
  router.push({path: route.path + `/${id}`, query: {name: name}});
}

onMounted(() => {
  getFaceList();
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

  .people-album-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;

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
