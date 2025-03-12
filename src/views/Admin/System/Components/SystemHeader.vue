<template>
  <div class="system-header">
    <div class="system-header-left">
      <div class="logo">
        <img src="/public/logo.svg" alt="Logo"/>
        <h1>管理后台系统</h1>
      </div>
      <div class="collapse-btn" @click="toggleCollapse">
        <MenuFoldOutlined v-if="systemStore.isCollapsed"/>
        <MenuUnfoldOutlined v-else/>
      </div>
    </div>
    <div class="system-header-right">
      <div class="search-box">
        <AInput placeholder="搜索..." allowClear>
          <template #prefix>
            <SearchOutlined/>
          </template>
        </AInput>
      </div>
      <div class="header-actions">
        <ATooltip title="消息通知">
          <ABadge :count="5" :dot="false">
            <BellOutlined class="action-icon"/>
          </ABadge>
        </ATooltip>
        <ATooltip title="全屏">
          <ExpandOutlined class="action-icon" @click="toggleFullscreen"/>
        </ATooltip>
        <ADropdown>
          <div class="user-info">
            <AAvatar :size="32" :src="userAvatar || 'https://joeschmoe.io/api/v1/random'"/>
            <span class="username">管理员</span>
          </div>
          <template #overlay>
            <AMenu>
              <AMenuItem key="profile">
                <UserOutlined/>
                <span>个人中心</span>
              </AMenuItem>
              <AMenuItem key="logout">
                <LogoutOutlined/>
                <span>退出登录</span>
              </AMenuItem>
            </AMenu>
          </template>
        </ADropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  ExpandOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue';
import useStore from "@/store";

const userAvatar = ref('');
const systemStore = useStore().system;

const toggleCollapse = () => {
  systemStore.isCollapsed = !systemStore.isCollapsed;
};


const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};
</script>

<style scoped lang="scss">
.system-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;

  .system-header-left {
    display: flex;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;
      margin-right: 24px;

      img {
        height: 32px;
        width: 32px;
        margin-right: 8px;
      }

      h1 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
      }
    }

    .collapse-btn {
      font-size: 18px;
      cursor: pointer;
      padding: 0 12px;
      color: rgba(0, 0, 0, 0.65);
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .system-header-right {
    display: flex;
    align-items: center;

    .search-box {
      margin-right: 16px;
      width: 200px;
    }

    .header-actions {
      display: flex;
      align-items: center;

      .action-icon {
        font-size: 18px;
        padding: 0 12px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.65);
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-left: 12px;

        .username {
          margin-left: 8px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
}
</style>
