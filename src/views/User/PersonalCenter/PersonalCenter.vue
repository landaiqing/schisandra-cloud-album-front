<template>
  <div class="personal-center">
    <div class="personal-center-header">
      <Header :logo-color="'#fff'" style="background: transparent;box-shadow: none;backdrop-filter: none;"/>
      <div class="personal-center-header-info">
        <div class="personal-center-header-info-container">
          <div class="personal-center-header-info-container-avatar">
            <AAvatar :size="80" :text-size="1.5" :round="true" :src="userStore.user.avatar"/>
          </div>
          <div class="personal-center-header-info-container-description">
            <div class="personal-center-header-info-container-description-name">
              <span>{{ userStore.user.nickname }}</span>
              <img src="/level_icon/icon/lv1.png" class="personal-level" alt="level">
            </div>
            <div class="personal-center-header-info-container-description-introduce">
              <span>描述信息</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="personal-center-content">
      <AMenu :selectedKeys="[menuStore.userCenterMenu]" mode="horizontal" :selectable="true" :multiple="false"
             @select="handleClick">
        <AMenuItem key="home" :style="menuCSSStyle" title="主页">
          <template #icon>
            <AAvatar shape="square" size="small" :src="home"/>
          </template>
          <span class="ant-menu-item-title">主页</span>
        </AMenuItem>
        <AMenuItem key="dynamic" :style="menuCSSStyle" title="动态">
          <template #icon>
            <AAvatar shape="square" size="small" :src="dynamic"/>
          </template>
          <span class="ant-menu-item-title">动态</span>
        </AMenuItem>
        <AMenuItem key="setting" :style="menuCSSStyle" title="设置">
          <template #icon>
            <AAvatar shape="square" size="small" :src="setting"/>
          </template>
          <span class="ant-menu-item-title">设置</span>
        </AMenuItem>
      </AMenu>
      <div class="personal-center-content-container">
        <router-view>
        </router-view>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Header from "@/layout/default/Header/Header.vue";
import useStore from "@/store";
import home from "@/assets/svgs/home.svg";
import dynamic from "@/assets/svgs/dynamic.svg";
import setting from "@/assets/svgs/setting.svg";


const userStore = useStore().user;
const menuStore = useStore().menu;
const router = useRouter();
const menuCSSStyle: any = reactive({
  display: 'flex',
  alignItems: 'center',
});

function handleClick({key}) {
  menuStore.userCenterMenu = key;
  router.push(`/main/user/center/${key}`);

}
</script>
<style scoped lang="scss">
.personal-center {
  //background-color: #eaeef6;

  .personal-center-header {
    width: 100%;
    height: 200px;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), url("@/assets/images/bg.webp");
    background-size: cover;
    background-position: center;
    position: relative;

    .personal-center-header-info {
      width: 100%;
      height: 130px;
      display: flex;
      flex-direction: row;

      .personal-center-header-info-container {
        width: 95%;
        height: 110px;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: flex-start;
        gap: 20px;

        .personal-center-header-info-container-avatar {
          height: 80px;
          width: 80px;
          border: 2px solid #fff;
          border-radius: 50%;
        }

        .personal-center-header-info-container-description {
          height: 70px;
          width: 80%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;

          .personal-center-header-info-container-description-name {
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            text-shadow: 0px 1px 2px rgba(0, 0, 0, .4);
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 20px;

            .personal-level {
              width: auto;
              height: 20px;
            }
          }

          .personal-center-header-info-container-description-introduce {
            font-size: 16px;
            color: #fff;
            background-color: rgba(255, 255, 255, .2);
            box-shadow: 0 0 0 1px rgba(255, 255, 255, .5)
          }
        }

      }
    }
  }

  .personal-center-content {

    .ant-menu-item-title {
      font-size: 16px;
      font-weight: bold;
    }

    .personal-center-content-container {
      width: calc(100% - 40px);
      height: calc(100vh - 290px);
      padding: 20px;
      overflow: auto;
    }
  }
}

</style>
