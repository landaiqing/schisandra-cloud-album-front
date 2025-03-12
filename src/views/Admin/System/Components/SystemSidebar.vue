<template>
  <div class="system-sidebar">
    <AMenu
        :selectedKeys="[selectedKey]"
        :openKeys="openKeys"
        mode="inline"
        :inline-collapsed="systemStore.isCollapsed"
        @select="handleSelect"
        @openChange="handleOpenChange"
    >
      <AMenuItem key="dashboard">
        <template #icon>
          <DashboardOutlined/>
        </template>
        <span>仪表盘</span>
      </AMenuItem>

      <ASubMenu key="user">
        <template #icon>
          <UserOutlined/>
        </template>
        <template #title>用户管理</template>
        <AMenuItem key="user">用户列表</AMenuItem>
        <AMenuItem key="role">角色管理</AMenuItem>
        <AMenuItem key="permission">权限设置</AMenuItem>
      </ASubMenu>

      <ASubMenu key="system">
        <template #icon>
          <SettingOutlined/>
        </template>
        <template #title>系统设置</template>
        <AMenuItem key="basic">基础设置</AMenuItem>
        <AMenuItem key="security">安全设置</AMenuItem>
        <AMenuItem key="log">系统日志</AMenuItem>
      </ASubMenu>

      <ASubMenu key="statistics">
        <template #icon>
          <BarChartOutlined/>
        </template>
        <template #title>统计分析</template>
        <AMenuItem key="visit">访问统计</AMenuItem>
        <AMenuItem key="analysis">用户分析</AMenuItem>
      </ASubMenu>
      <ASubMenu key="storage">
        <template #icon>
          <BarChartOutlined/>
        </template>
        <template #title>存储管理</template>
        <AMenuItem key="storage">存储管理</AMenuItem>
      </ASubMenu>
    </AMenu>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
} from '@ant-design/icons-vue';
import useStore from "@/store";


const router = useRouter();
const route = useRoute();
const systemStore = useStore().system;
const selectedKey = ref('dashboard');
const openKeys = ref<string[]>([]);


// 处理菜单项选择
const handleSelect = ({key}: { key: string }) => {
  selectedKey.value = key;
  // 这里可以根据key进行路由跳转
  router.push(`/admin/system/${key}`);
};

// 处理子菜单展开/收起
const handleOpenChange = (keys: string[]) => {
  // 如果菜单是展开的，则允许多个子菜单同时展开
  if (!systemStore.isCollapsed) {
    openKeys.value = keys;
  }
};

// 根据当前路由设置选中的菜单项
const setMenuByRoute = () => {
  const path = route.path;
  // 从路径中提取菜单key
  const pathSegments = path.split('/');
  if (pathSegments.length > 2) {
    const menuKey = pathSegments[2]; // 假设路径格式为 /system/[menuKey]
    selectedKey.value = menuKey;

    // 设置打开的子菜单
    const parentKey = menuKey.split('-')[0];
    if (parentKey && parentKey !== menuKey) {
      openKeys.value = [parentKey];
    }
  }
};

// 初始化时设置菜单
setMenuByRoute();

// 监听路由变化
watch(() => route.path, setMenuByRoute);
</script>

<style scoped lang="scss">
.system-sidebar {
  height: 100%;
  transition: width 0.3s;
  overflow-y: auto;
  overflow-x: hidden;

  :deep(.ant-menu) {
    height: 100%;
    border-right: 0;
  }

  :deep(.ant-menu-item), :deep(.ant-menu-submenu-title) {
    display: flex;
    align-items: center;
  }
}
</style>
