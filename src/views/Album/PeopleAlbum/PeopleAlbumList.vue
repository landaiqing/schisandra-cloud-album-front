<template>
  <div class="people-album">
    <div class="people-album-header">
      <ADropdown>
        <AButton type="text" size="large" class="people-album-button">
          人物
          <DownOutlined class="people-album-icon"/>
        </AButton>
        <template #overlay>
          <AMenu>
            <AMenuItem>人 物</AMenuItem>
            <AMenuItem>已隐藏</AMenuItem>
          </AMenu>
        </template>

      </ADropdown>
    </div>
    <div class="people-album-content">
      <div class="people-album-item" @mouseover="showButton = true" @mouseleave="showButton = false">
        <div class="people-album-item-avatar">
          <AAvatar :size="86" shape="circle" src="/test/4.png"/>
        </div>
        <div class="people-album-item-name">
          <AButton @click="showAddNameInput" class="people-album-add-name" v-show="showButton && !showInput" type="link"
                   size="small">
            添加名字
          </AButton>
          <AInput v-show="showInput" @blur="hideAddNameInput" size="small" class="people-album-add-input">
            <template #suffix>
              <AButton type="link" size="small">完成</AButton>
            </template>
          </AInput>
        </div>
      </div>

      <div class="people-album-item" @mouseover="showButton = true" @mouseleave="showButton = false">
        <div class="people-album-item-avatar">
          <AAvatar :size="86" shape="circle" src="/test/4.png"/>
        </div>
        <div class="people-album-item-name">
          <AButton @click="showAddNameInput" class="people-album-add-name" v-show="showButton && !showInput" type="link"
                   size="small">
            添加名字
          </AButton>
          <AInput v-show="showInput" @blur="hideAddNameInput" size="small" class="people-album-add-input">
            <template #suffix>
              <AButton type="link" size="small">完成</AButton>
            </template>
          </AInput>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const showButton = ref(false);
const showInput = ref(false);

function showAddNameInput() {
  showInput.value = true;
  showButton.value = false;
}

function hideAddNameInput() {
  showInput.value = false;
  showButton.value = false;
}


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
  }

  .people-album-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 20px;
    padding-left: 20px;
    gap: 20px;

    .people-album-item {
      width: 130px;
      height: 160px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      transition: all 0.3s ease-in-out;
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
        color: rgba(126, 126, 135, 0.99);
        font-size: 12px;
      }

      .people-album-add-name:hover {
        color: #0e87cc;
      }
    }

    .people-album-item:hover {
      background-color: rgba(248, 248, 248, 0.74);
      opacity: 1;
      transform: scale(1.05);
    }
  }
}
</style>
