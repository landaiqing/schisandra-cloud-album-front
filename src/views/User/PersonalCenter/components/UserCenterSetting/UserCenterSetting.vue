<template>
  <div class="user-center-setting">
    <div class="setting-header">
      <h2>用户设置</h2>
      <p class="setting-description">您可以在这里管理您的账户设置和偏好</p>
    </div>

    <div class="settings-container">
      <!-- 左侧导航 -->
      <div class="settings-nav">
        <div
          class="nav-item"
          :class="{ active: activeSection === 'account' }"
          @click="activeSection = 'account'"
        >
          <div class="nav-icon account"></div>
          <span>账户安全</span>
        </div>
        <div
          class="nav-item"
          :class="{ active: activeSection === 'privacy' }"
          @click="activeSection = 'privacy'"
        >
          <div class="nav-icon privacy"></div>
          <span>隐私设置</span>
        </div>
        <div
          class="nav-item"
          :class="{ active: activeSection === 'notification' }"
          @click="activeSection = 'notification'"
        >
          <div class="nav-icon notification"></div>
          <span>通知设置</span>
        </div>
        <div
          class="nav-item"
          :class="{ active: activeSection === 'appearance' }"
          @click="activeSection = 'appearance'"
        >
          <div class="nav-icon appearance"></div>
          <span>外观设置</span>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="settings-content">
        <!-- 账户安全设置 -->
        <div v-if="activeSection === 'account'" class="settings-section">
          <div class="section-title">账户安全</div>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-item-left">
                <div class="setting-icon account-ai"></div>
                <div class="setting-text">
                  <span class="setting-item-title">开启AI识别</span>
                  <span class="setting-item-desc">允许系统使用AI技术识别您的照片内容</span>
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

            <div class="setting-item">
              <div class="setting-item-left">
                <div class="setting-icon account-mobile"></div>
                <div class="setting-text">
                  <span class="setting-item-title">开启手机上传</span>
                  <span class="setting-item-desc">允许从移动设备上传照片到您的相册</span>
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

            <div class="setting-item">
              <div class="setting-item-left">
                <div class="setting-icon account-password"></div>
                <div class="setting-text">
                  <span class="setting-item-title">修改密码</span>
                  <span class="setting-item-desc">定期更改密码可以提高账户安全性</span>
                </div>
              </div>
              <AButton type="primary" size="small">修改</AButton>
            </div>
          </div>
        </div>

        <!-- 隐私设置 -->
        <div v-if="activeSection === 'privacy'" class="settings-section">
          <div class="section-title">隐私设置</div>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-item-left">
                <div class="setting-icon privacy-profile"></div>
                <div class="setting-text">
                  <span class="setting-item-title">公开个人资料</span>
                  <span class="setting-item-desc">允许其他用户查看您的个人资料信息</span>
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

            <div class="setting-item">
              <div class="setting-item-left">
                <div class="setting-icon privacy-comment"></div>
                <div class="setting-text">
                  <span class="setting-item-title">开启评论功能</span>
                  <span class="setting-item-desc">允许其他用户在您的照片下方评论</span>
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

            <div class="setting-item">
              <div class="setting-item-left">
                <div class="setting-icon privacy-search"></div>
                <div class="setting-text">
                  <span class="setting-item-title">保存搜索记录</span>
                  <span class="setting-item-desc">保存您的搜索历史以提供更好的推荐</span>
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

        <!-- 通知设置 -->
        <div v-if="activeSection === 'notification'" class="settings-section">
          <div class="section-title">通知设置</div>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-item-left">
                <div class="setting-icon notification-email"></div>
                <div class="setting-text">
                  <span class="setting-item-title">邮件通知</span>
                  <span class="setting-item-desc">接收重要活动和更新的邮件通知</span>
                </div>
              </div>
              <ASwitch v-model:checked="notificationSettings.email">
                <template #checkedChildren>
                  <check-outlined />
                </template>
                <template #unCheckedChildren>
                  <close-outlined />
                </template>
              </ASwitch>
            </div>

            <div class="setting-item">
              <div class="setting-item-left">
                <div class="setting-icon notification-comment"></div>
                <div class="setting-text">
                  <span class="setting-item-title">评论通知</span>
                  <span class="setting-item-desc">当有人评论您的照片时接收通知</span>
                </div>
              </div>
              <ASwitch v-model:checked="notificationSettings.comment">
                <template #checkedChildren>
                  <check-outlined />
                </template>
                <template #unCheckedChildren>
                  <close-outlined />
                </template>
              </ASwitch>
            </div>

            <div class="setting-item">
              <div class="setting-item-left">
                <div class="setting-icon notification-system"></div>
                <div class="setting-text">
                  <span class="setting-item-title">系统通知</span>
                  <span class="setting-item-desc">接收系统更新和维护信息</span>
                </div>
              </div>
              <ASwitch v-model:checked="notificationSettings.system">
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

        <!-- 外观设置 -->
        <div v-if="activeSection === 'appearance'" class="settings-section">
          <div class="section-title">外观设置</div>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-item-left">
                <div class="setting-icon appearance-theme"></div>
                <div class="setting-text">
                  <span class="setting-item-title">主题模式</span>
                  <span class="setting-item-desc">选择您喜欢的界面主题</span>
                </div>
              </div>
              <ARadioGroup v-model:value="appearanceSettings.theme">
                <ARadioButton value="light">浅色</ARadioButton>
                <ARadioButton value="dark">深色</ARadioButton>
                <ARadioButton value="system">跟随系统</ARadioButton>
              </ARadioGroup>
            </div>

            <div class="setting-item">
              <div class="setting-item-left">
                <div class="setting-icon appearance-layout"></div>
                <div class="setting-text">
                  <span class="setting-item-title">布局密度</span>
                  <span class="setting-item-desc">调整界面元素的紧凑程度</span>
                </div>
              </div>
              <ASelect v-model:value="appearanceSettings.density" style="width: 120px">
                <ASelectOption value="compact">紧凑</ASelectOption>
                <ASelectOption value="default">默认</ASelectOption>
                <ASelectOption value="comfortable">宽松</ASelectOption>
              </ASelect>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-actions">
      <AButton type="primary" @click="saveSettings">保存设置</AButton>
      <AButton @click="resetSettings">重置</AButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
import useStore from "@/store";
import { ref } from 'vue';
import { message as AMessage } from 'ant-design-vue';

const userStore = useStore().user;
const activeSection = ref('account');

// 通知设置（模拟数据）
const notificationSettings = ref({
  email: true,
  comment: true,
  system: false
});

// 外观设置（模拟数据）
const appearanceSettings = ref({
  theme: 'light',
  density: 'default'
});

// 保存设置
const saveSettings = () => {
  // 这里可以添加保存到后端的逻辑
  // 模拟保存成功
  AMessage.success('设置已保存');
};

// 重置设置
const resetSettings = () => {
  // 重置为默认值
  notificationSettings.value = {
    email: true,
    comment: true,
    system: false
  };

  appearanceSettings.value = {
    theme: 'light',
    density: 'default'
  };

  // 模拟重置成功
  AMessage.success('设置已重置');
};
</script>
<style scoped lang="scss">
/* 图标样式 */
.setting-icon {
  &.account-ai {
    background-image: url('@/assets/svgs/ai-icon.svg');
  }

  &.account-mobile {
    background-image: url('@/assets/svgs/qr-phone.svg');
  }

  &.account-password {
    background-image: url('@/assets/svgs/lock.svg');
  }

  &.privacy-profile {
    background-image: url('@/assets/svgs/personal-center.svg');
  }

  &.privacy-comment {
    background-image: url('@/assets/svgs/community.svg');
  }

  &.privacy-search {
    background-image: url('@/assets/svgs/search.svg');
  }

  &.notification-email {
    background-image: url('@/assets/svgs/email_security.svg');
  }

  &.notification-comment {
    background-image: url('@/assets/svgs/community.svg');
  }

  &.notification-system {
    background-image: url('@/assets/svgs/setting.svg');
  }

  &.appearance-theme {
    background-image: url('@/assets/svgs/thing-album.svg');
  }

  &.appearance-layout {
    background-image: url('@/assets/svgs/thing-album.svg');
  }
}

.nav-icon {
  &.account {
    background-image: url('@/assets/svgs/account_security.svg');
  }

  &.privacy {
    background-image: url('@/assets/svgs/privacy.svg');
  }

  &.notification {
    background-image: url('@/assets/svgs/notice.svg');
  }

  &.appearance {
    background-image: url('@/assets/svgs/thing-album.svg');
  }
}
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

  .settings-container {
    display: flex;
    width: 100%;
    gap: 30px;

    .settings-nav {
      width: 200px;
      flex-shrink: 0;
      background-color: #f9fafb;
      border-radius: 12px;
      overflow: hidden;

      .nav-item {
        display: flex;
        align-items: center;
        padding: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        border-left: 3px solid transparent;

        &:hover {
          background-color: rgba(99, 102, 241, 0.05);
        }

        &.active {
          background-color: rgba(99, 102, 241, 0.1);
          border-left-color: #6366f1;
          color: #6366f1;
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          margin-right: 12px;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.7;
        }

        &.active .nav-icon {
          opacity: 1;
        }

        span {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .settings-content {
      flex: 1;
    }
  }

  .settings-section {
    width: calc(100% - 50px);
    margin-bottom: 30px;
    background-color: #fff;
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
      color: #333;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.03);

        &:last-child {
          border-bottom: none;
        }

        .setting-item-left {
          display: flex;
          align-items: center;
          gap: 15px;

          .setting-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background-color: rgba(99, 102, 241, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6366f1;
          }

          .setting-text {
            display: flex;
            flex-direction: column;

            .setting-item-title {
              font-size: 15px;
              font-weight: 500;
              color: #333;
              margin-bottom: 4px;
            }

            .setting-item-desc {
              font-size: 13px;
              color: #666;
            }
          }
        }
      }
    }
  }

  .settings-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
    width: 100%;
  }

  @media (max-width: 768px) {
    padding: 10px;

    .settings-container {
      flex-direction: column;

      .settings-nav {
        width: 100%;
        display: flex;
        overflow-x: auto;
        margin-bottom: 20px;

        .nav-item {
          flex: 1;
          justify-content: center;
          padding: 12px 8px;
          border-left: none;
          border-bottom: 3px solid transparent;

          &.active {
            border-left-color: transparent;
            border-bottom-color: #6366f1;
          }

          .nav-icon {
            margin-right: 8px;
          }
        }
      }
    }

    .settings-section {
      padding: 15px;
    }

    .setting-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;

      .setting-item-left {
        width: 100%;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
