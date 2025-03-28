<template>
  <div class="personal-center">
    <Header :logo-color="'#333'" class="fixed-header" />
    <div class="personal-center-container">
      <!-- 左侧边栏 - 用户信息和导航 -->
      <div class="personal-center-sidebar">
        <div class="user-profile">
          <div class="user-avatar">
            <AAvatar :size="100" :text-size="1.8" :round="true" :src="userStore.user.avatar"/>
            <div class="user-level">
              <img src="/level_icon/icon/lv1.png" alt="level">
            </div>
          </div>
          <div class="user-info">
            <h2 class="user-name">{{ userStore.user.nickname }}</h2>
            <p class="user-description">描述信息</p>
          </div>

          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">128</div>
              <div class="stat-label">照片</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">56</div>
              <div class="stat-label">分享</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">24</div>
              <div class="stat-label">收藏</div>
            </div>
          </div>
        </div>

        <AMenu
          class="sidebar-menu"
          :selectedKeys="[menuStore.userCenterMenu]"
          mode="inline"
          :selectable="true"
          :multiple="false"
          @select="handleClick"
        >
          <AMenuItem key="home" title="主页">
            <template #icon>
              <AAvatar shape="square" size="small" :src="home"/>
            </template>
            <span class="menu-item-title">主页</span>
          </AMenuItem>
          <AMenuItem key="dynamic" title="动态">
            <template #icon>
              <AAvatar shape="square" size="small" :src="dynamic"/>
            </template>
            <span class="menu-item-title">动态</span>
          </AMenuItem>
          <AMenuItem key="setting" title="设置">
            <template #icon>
              <AAvatar shape="square" size="small" :src="setting"/>
            </template>
            <span class="menu-item-title">设置</span>
          </AMenuItem>
        </AMenu>
      </div>

      <!-- 右侧内容区域 -->
      <div class="personal-center-content">
        <div class="content-header">
          <h1>{{ getPageTitle() }}</h1>
        </div>
        <div class="content-container">
          <router-view></router-view>
        </div>
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

// 页面标题映射
const pageTitles = {
  'home': '个人主页',
  'dynamic': '我的动态',
  'setting': '账户设置'
};

// 获取当前页面标题
function getPageTitle() {
  return pageTitles[menuStore.userCenterMenu] || '个人中心';
}

function handleClick({key}) {
  menuStore.userCenterMenu = key;
  router.push(`/main/user/center/${key}`);
}
</script>
<style scoped lang="scss">
.personal-center {
  //min-height: 100vh;
  background-color: #f5f7fa;

  .fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  }

  .personal-center-container {
    display: flex;
    width: calc(100vw - 50px);
    margin: 0 auto;
    padding: 20px;
    gap: 30px;
    margin-top: 70px; /* 为固定的Header腾出空间 */
    position: relative; /* 为绝对定位的子元素提供参考 */
    overflow: visible; /* 允许内容溢出，以便右侧内容可以滚动 */
  }

  /* 左侧边栏样式 */
  .personal-center-sidebar {
    width: 300px;
    flex-shrink: 0;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
    position: sticky;
    top: 90px; /* 为固定的Header腾出空间，比margin-top多一点以确保有足够空间 */
    height: calc(100vh - 110px); /* 设置固定高度，减去header和上下margin的高度 */
    align-self: flex-start; /* 确保在flex容器中靠上对齐 */

    .user-profile {
      padding: 30px 20px;
      text-align: center;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      position: relative;

      .user-avatar {
        position: relative;
        width: 100px;
        height: 100px;
        margin: 0 auto 15px;

        .user-level {
          position: absolute;
          bottom: 0;
          right: 0;
          background: white;
          border-radius: 50%;
          padding: 3px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

          img {
            width: 24px;
            height: 24px;
          }
        }
      }

      .user-info {
        margin-bottom: 20px;

        .user-name {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .user-description {
          font-size: 14px;
          opacity: 0.8;
        }
      }

      .user-stats {
        display: flex;
        justify-content: space-around;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);

        .stat-item {
          text-align: center;

          .stat-value {
            font-size: 18px;
            font-weight: 600;
          }

          .stat-label {
            font-size: 12px;
            opacity: 0.8;
          }
        }
      }
    }

    .sidebar-menu {
      border-right: none;

      :deep(.ant-menu-item) {
        height: 50px;
        line-height: 50px;
        margin: 4px 0;

        &:hover {
          background-color: rgba(99, 102, 241, 0.05);
        }

        &.ant-menu-item-selected {
          background-color: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          border-right: 3px solid #6366f1;
          font-weight: 500;
        }
      }

      .menu-item-title {
        font-size: 15px;
        margin-left: 10px;
      }
    }
  }

  /* 右侧内容区域样式 */
  .personal-center-content {
    flex: 1;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: auto; /* 允许内容区域独立滚动 */
    display: flex;
    flex-direction: column;
    /* 移除最大高度限制，允许内容无限滚动 */

    .content-header {
      padding: 20px 30px;
      border-bottom: 1px solid #eee;

      h1 {
        font-size: 22px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
    }

    .content-container {
      flex: 1;
      padding: 20px 30px;
      overflow: auto;
    }
  }

  /* 响应式设计 */
  @media (max-width: 1024px) {
    .personal-center-container {
      flex-direction: column;
      padding: 10px;
      overflow: auto; /* 在小屏幕上允许整个容器滚动 */
    }

    .personal-center-sidebar {
      width: 100%;
      margin-bottom: 20px;
      position: relative; /* 在小屏幕上取消sticky定位 */
      top: 0;
      height: auto; /* 在小屏幕上高度自适应 */
    }

    .sidebar-menu {
      display: flex;
      overflow-x: auto;

      :deep(.ant-menu-item) {
        flex: 1;
        text-align: center;
      }
    }
  }

  @media (max-width: 768px) {
    .user-profile {
      padding: 20px 15px;
    }

    .content-header {
      padding: 15px 20px;
    }

    .content-container {
      padding: 15px 20px;
    }
  }
}
</style>
