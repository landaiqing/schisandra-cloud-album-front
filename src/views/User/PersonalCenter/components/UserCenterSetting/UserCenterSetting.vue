<template>
  <div class="user-center-setting">
    <div class="setting-header">
      <h2>用户设置</h2>
      <p class="setting-description">您可以在这里管理您的账户设置和偏好</p>
    </div>

    <div class="setting-section">
      <div class="section-title">账户安全</div>
      <div class="user-center-setting-content">
        <div class="user-center-setting-item">
          <div class="setting-item-left">
            <img src="@/assets/svgs/account_security.svg" alt="AI识别" class="setting-icon" />
            <div class="setting-text">
              <span class="user-center-setting-item-title">开启AI识别</span>
              <span class="setting-description">允许系统使用AI技术识别您的照片内容</span>
            </div>
          </div>
          <ASwitch v-model:checked="userStore.settings.enableAI">
            <template #checkedChildren>
              <check-outlined />
            </template>
            <template #unCheckedChildren>
              <close-outlined />
            </template>
          </ASwitch>
        </div>

        <div class="user-center-setting-item">
          <div class="setting-item-left">
            <img src="@/assets/svgs/login_security.svg" alt="手机上传" class="setting-icon" />
            <div class="setting-text">
              <span class="user-center-setting-item-title">开启手机上传</span>
              <span class="setting-description">允许从移动设备上传照片到您的相册</span>
            </div>
          </div>
          <ASwitch v-model:checked="userStore.settings.enableMobileUpload">
            <template #checkedChildren>
              <check-outlined />
            </template>
            <template #unCheckedChildren>
              <close-outlined />
            </template>
          </ASwitch>
        </div>
      </div>
    </div>

    <div class="setting-section">
      <div class="section-title">隐私设置</div>
      <div class="user-center-setting-content">
        <div class="user-center-setting-item">
          <div class="setting-item-left">
            <img src="@/assets/svgs/privacy.svg" alt="个人资料" class="setting-icon" />
            <div class="setting-text">
              <span class="user-center-setting-item-title">公开个人资料</span>
              <span class="setting-description">允许其他用户查看您的个人资料信息</span>
            </div>
          </div>
          <ASwitch v-model:checked="userStore.settings.publicProfile">
            <template #checkedChildren>
              <check-outlined />
            </template>
            <template #unCheckedChildren>
              <close-outlined />
            </template>
          </ASwitch>
        </div>

        <div class="user-center-setting-item">
          <div class="setting-item-left">
            <img src="@/assets/svgs/community.svg" alt="评论" class="setting-icon" />
            <div class="setting-text">
              <span class="user-center-setting-item-title">开启评论功能</span>
              <span class="setting-description">允许其他用户在您的照片下方评论</span>
            </div>
          </div>
          <ASwitch v-model:checked="userStore.settings.enableComment">
            <template #checkedChildren>
              <check-outlined />
            </template>
            <template #unCheckedChildren>
              <close-outlined />
            </template>
          </ASwitch>
        </div>

        <div class="user-center-setting-item">
          <div class="setting-item-left">
            <img src="@/assets/svgs/search.svg" alt="搜索记录" class="setting-icon" />
            <div class="setting-text">
              <span class="user-center-setting-item-title">保存搜索记录</span>
              <span class="setting-description">保存您的搜索历史以提供更好的推荐</span>
            </div>
          </div>
          <ASwitch v-model:checked="userStore.settings.saveSearchHistory">
            <template #checkedChildren>
              <check-outlined />
            </template>
            <template #unCheckedChildren>
              <close-outlined />
            </template>
          </ASwitch>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
import useStore from "@/store";

const userStore = useStore().user;


// const saveSettings = () => {
//   // 保存设置到后端
// };
</script>
<style scoped lang="scss">
.user-center-setting {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;

  .setting-header {
    margin-bottom: 30px;

    h2 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--text-color, #333);
    }

    .setting-description {
      color: #666;
      font-size: 14px;
    }
  }

  .setting-section {
    width: calc(100% - 80px);
    margin-bottom: 30px;
    background-color: var(--white-color, #fff);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    padding: 20px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: var(--text-color, #333);
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
  }

  .user-center-setting-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .user-center-setting-item {
      width: 100%;
      min-height: 60px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.03);

      &:last-child {
        border-bottom: none;
      }

      .setting-item-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .setting-icon {
          width: 28px;
          height: 28px;
        }

        .setting-text {
          display: flex;
          flex-direction: column;

          .user-center-setting-item-title {
            display: inline-block;
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
            color: var(--text-color, #333);
            margin-bottom: 4px;
          }

          .setting-description {
            font-size: 12px;
            color: #999;
            line-height: 1.5;
          }
        }
      }

      :deep(.ant-switch) {
        background-color: rgba(0, 0, 0, 0.25);

        &.ant-switch-checked {
          background-color: var(--blue, rgba(96,165,250,.9));
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 10px;

    .setting-section {
      padding: 15px;
    }

    .user-center-setting-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;

      .setting-item-left {
        width: 100%;
      }
    }
  }
}
</style>
