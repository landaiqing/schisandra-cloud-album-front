<template>
  <div class="account-setting-home">
    <div class="account-setting-home-info">
      <div class="account-setting-home-info-avatar">
        <AAvatar :size="90" :src="userStore.user.avatar"/>
        <div class="user-level-badge">
          <img src="/level_icon/icon/lv1.png" alt="level">
        </div>
      </div>
      <div class="account-setting-home-info-content">
        <AFlex :vertical="false" align="center" justify="flex-start" gap="small" class="user-info-header">
          <span class="account-setting-home-info-content-name">{{ userStore.user.nickname }}</span>
          <ATag color="success" :bordered="false">正式会员</ATag>
          <ATag color="processing" :bordered="false">活跃用户</ATag>
        </AFlex>
        <div class="level-progress-container">
          <span class="level-label">等级进度</span>
          <AProgress :percent="50" :stroke-color="{
            '0%': '#108ee9',
            '100%': '#87d068',
          }" :showInfo="false" :size="12"/>
          <AFlex :vertical="false" align="center" justify="space-between" class="level-icons">
            <div class="level-icon-wrapper current">
              <img src="/level_icon/icon/lv1.png" class="avatar-level-icon" alt="level">
              <span>当前</span>
            </div>
            <div class="level-icon-wrapper next">
              <img src="/level_icon/icon/lv2.png" class="avatar-level-icon" alt="level">
              <span>下一级</span>
            </div>
          </AFlex>
        </div>
      </div>
    </div>
    <div class="account-setting-home-stats">
      <div class="stat-item">
        <AAvatar size="small" :src="storage" />
        <div class="stat-content">
          <span class="stat-value">2.5GB</span>
          <span class="stat-label">已用存储</span>
        </div>
      </div>
      <ADivider type="vertical" class="stat-divider" />
      <div class="stat-item">
        <AAvatar size="small" :src="image" />
        <div class="stat-content">
          <span class="stat-value">128</span>
          <span class="stat-label">照片数量</span>
        </div>
      </div>
      <ADivider type="vertical" class="stat-divider" />
      <div class="stat-item">
        <AAvatar size="small" :src="album" />
        <div class="stat-content">
          <span class="stat-value">12</span>
          <span class="stat-label">相册数量</span>
        </div>
      </div>
    </div>

    <div class="account-setting-home-content">
      <div class="account-setting-home-content-header">
        <AAvatar size="large" :src="accountSecurity"/>
        <span class="section-title">账号安全</span>
        <ATag color="warning" class="security-score">安全评分: 85分</ATag>
      </div>
      <div class="account-setting-home-content-section" v-if="securityStatus">
        <div class="security-card">
          <div class="security-card-avatar">
            <AAvatar shape="circle" :size="60" :src="emailSecurity"/>
          </div>
          <div class="security-card-content">
            <div class="security-card-header">
              <span class="security-card-title">我的邮箱</span>
              <ATag :color="securityStatus.bind_email ? 'success' : 'error'" class="status-tag">
                {{ securityStatus.bind_email ? "已绑定" : "未绑定" }}
              </ATag>
            </div>
            <p class="security-card-desc">绑定邮箱后即可使用邮箱登录</p>
            <div class="security-card-actions">
              <AButton type="primary" size="small" :disabled="securityStatus.bind_email" @click="handleBindEmail">
                {{ securityStatus.bind_email ? "已绑定邮箱" : "绑定邮箱" }}
              </AButton>
              <AButton type="link" size="small" @click="securityStatus.bind_email ? handleUpdateEmail() : handleBindEmail()">{{ securityStatus.bind_email ? "修改邮箱" : "绑定邮箱" }}</AButton>
              <AButton v-if="securityStatus.bind_email" type="link" size="small" danger @click="handleUnbindEmail">解绑邮箱</AButton>
            </div>
          </div>
        </div>

        <div class="security-card">
          <div class="security-card-avatar">
            <AAvatar shape="circle" :size="60" :src="phoneSecurity"/>
          </div>
          <div class="security-card-content">
            <div class="security-card-header">
              <span class="security-card-title">我的手机</span>
              <ATag color="success" class="status-tag">已绑定</ATag>
            </div>
            <p class="security-card-desc">绑定手机后即可使用手机号登录</p>
            <div class="security-card-actions">
              <AButton type="primary" size="small" :disabled="securityStatus.bind_phone" @click="handleBindPhone">
                {{ securityStatus.bind_phone ? "已绑定手机" : "绑定手机" }}
              </AButton>
              <AButton type="link" size="small" @click="securityStatus.bind_phone ? handleUpdatePhone() : handleBindPhone()">{{ securityStatus.bind_phone ? "修改手机" : "绑定手机" }}</AButton>
            </div>
          </div>
        </div>

        <div class="security-card">
          <div class="security-card-avatar">
            <AAvatar shape="circle" :size="60" :src="passwordSecurity"/>
          </div>
          <div class="security-card-content">
            <div class="security-card-header">
              <span class="security-card-title">我的密保</span>
              <ATag :color="securityStatus.set_password ? 'success' : 'error'" class="status-tag">
                {{ securityStatus.set_password ? "已设置" : "未设置" }}
              </ATag>
            </div>
            <p class="security-card-desc">设置密保，账号更安全</p>
            <div class="security-card-actions">
              <AButton type="primary" size="small" :disabled="securityStatus.set_password" @click="handleSetPassword">
                {{ securityStatus.set_password ? "已设置密保" : "设置密保" }}
              </AButton>
              <AButton type="link" size="small" @click="securityStatus.set_password ? handleUpdatePassword() : handleSetPassword()">{{ securityStatus.set_password ? "修改密保" : "设置密保" }}</AButton>
            </div>
          </div>
        </div>

        <div class="security-card">
          <div class="security-card-avatar">
            <AAvatar shape="circle" :size="60" :src="loginSecurity"/>
          </div>
          <div class="security-card-content">
            <div class="security-card-header">
              <span class="security-card-title">三方登录</span>
              <ATag :color="securityStatus.bind_wechet ? 'success' : 'error'" class="status-tag">
                {{ securityStatus.bind_wechet ? "已绑定" : "未绑定" }}
              </ATag>
            </div>
            <p class="security-card-desc">绑定三方账号，安全登录</p>
            <div class="security-card-actions">
              <AButton type="primary" size="small" :disabled="securityStatus.bind_wechet" @click="handleBindThirdParty">
                {{ securityStatus.bind_wechet ? "已绑定" : "绑定" }}
              </AButton>
              <AButton type="link" size="small" @click="handleManageThirdParty">{{ securityStatus.bind_wechet ? "管理" : "绑定" }}</AButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 邮箱操作模态窗口 -->
  <EmailModal
    :currentEmail="securityStatus?.email || ''"
    @success="handleEmailSuccess"
  />

  <!-- 手机操作模态窗口 -->
  <PhoneModal
    :currentPhone="securityStatus?.phone || ''"
    @success="handlePhoneSuccess"
  />

  <!-- 密码操作模态窗口 -->
  <PasswordModal
    @success="handlePasswordSuccess"
  />

  <!-- 第三方登录操作模态窗口 -->
  <ThirdPartyLoginModal
    @success="handleThirdPartySuccess"
  />
</template>
<script setup lang="ts">
import useStore from "@/store";
import accountSecurity from "@/assets/svgs/account_security.svg";
import emailSecurity from "@/assets/svgs/email_security.svg";
import phoneSecurity from "@/assets/svgs/phone_security.svg";
import passwordSecurity from "@/assets/svgs/password_security.svg";
import loginSecurity from "@/assets/svgs/login_security.svg";
import storage from "@/assets/svgs/storage.svg";
import image from "@/assets/svgs/image.svg";
import album from "@/assets/svgs/album.svg";
import {checkSecuritySettingApi} from "@/api/auth";
import EmailModal from "./EmailModal.vue";
import PhoneModal from "./PhoneModal.vue";
import PasswordModal from "./PasswordModal.vue";
import ThirdPartyLoginModal from "./ThirdPartyLoginModal.vue";
import { message } from 'ant-design-vue';

const userStore = useStore().user;

const securityStatus = ref<any>();

// 使用store中的邮箱模态窗口状态
// 不再需要本地状态变量，直接使用userStore.emailModalState

async function checkStatus() {
  const res: any = await checkSecuritySettingApi();
  if (res && res.code === 200) {
    securityStatus.value = res.data;
  }
}

onMounted(() => {
  checkStatus();
});

// 绑定邮箱
const handleBindEmail = () => {
  userStore.openBindEmailModal();
};

// 修改邮箱
const handleUpdateEmail = () => {
  userStore.openUpdateEmailModal();
};

// 解绑邮箱
const handleUnbindEmail = () => {
  userStore.openUnbindEmailModal();
};

// 处理邮箱操作成功后的回调
const handleEmailSuccess = (type: string) => {
  if (type === 'bind_email') {
    message.success('邮箱绑定成功');
  } else if (type === 'update_email') {
    message.success('邮箱修改成功');
  } else if (type === 'unbind_email') {
    message.success('邮箱解绑成功');
  }
  // 刷新安全状态
  checkStatus();
};

// 绑定手机
const handleBindPhone = () => {
  userStore.openBindPhoneModal();
};

// 修改手机
const handleUpdatePhone = () => {
  userStore.openUpdatePhoneModal();
};


// 处理手机操作成功后的回调
const handlePhoneSuccess = (type: string) => {
  if (type === 'bind_phone') {
    message.success('手机绑定成功');
  } else if (type === 'update_phone') {
    message.success('手机修改成功');
  } else if (type === 'unbind_phone') {
    message.success('手机解绑成功');
  }
  // 刷新安全状态
  checkStatus();
};

// 设置密码
const handleSetPassword = () => {
  userStore.openSetPasswordModal();
};

// 修改密码
const handleUpdatePassword = () => {
  userStore.openUpdatePasswordModal();
};

// 处理密码操作成功后的回调
const handlePasswordSuccess = (type: string) => {
  if (type === 'set_password') {
    message.success('密码设置成功');
  } else if (type === 'update_password') {
    message.success('密码修改成功');
  }
  // 刷新安全状态
  checkStatus();
};

// 绑定第三方账号
const handleBindThirdParty = () => {
  userStore.openThirdPartyModal();
};

// 管理第三方账号
const handleManageThirdParty = () => {
  userStore.openThirdPartyModal();
};

// 处理第三方账号操作成功后的回调
const handleThirdPartySuccess = (_type: string) => {
  // 刷新安全状态
  checkStatus();
};
</script>

<style scoped lang="scss">
.account-setting-home {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 16px;
  gap: 20px;

  .account-setting-home-info {
    width: 100%;
    height: auto;
    min-height: 140px;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      bottom: -30px;
      right: -30px;
      width: 150px;
      height: 150px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      z-index: 0;
    }

    .account-setting-home-info-avatar {
      width: 110px;
      height: 110px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      :deep(.ant-avatar) {
        border: 4px solid white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .user-level-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 40px;
        height: 40px;
        background-color: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        z-index: 2;

        img {
          width: 32px;
          height: 32px;
        }
      }
    }

    .account-setting-home-info-content {
      width: calc(100% - 110px);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 14px;
      padding-left: 20px;
      z-index: 1;

      .user-info-header {
        width: 100%;
      }

      .account-setting-home-info-content-name {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-right: 12px;
      }

      .level-progress-container {
        width: 100%;
        max-width: 450px;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .level-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .level-icons {
          width: 100%;
          margin-top: 5px;

          .level-icon-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;

            span {
              font-size: 12px;
              color: #999;
            }

            &.current span {
              color: #108ee9;
              font-weight: 500;
            }

            &.next span {
              color: #87d068;
            }

            .avatar-level-icon {
              width: 32px;
              transition: transform 0.3s ease;

              &:hover {
                transform: scale(1.1);
              }
            }
          }
        }
      }
    }
  }

  .account-setting-home-stats {
    width: 100%;
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    //padding: 0 20px;

    .stat-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 12px;

      .stat-content {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .stat-value {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .stat-divider {
      height: 40px;
    }
  }

  .account-setting-home-content {
    width: calc(100% - 40px);
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;
    background-color: white;
    border-radius: 16px;
    padding: 20px;
    //box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .account-setting-home-content-header {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      //border-bottom: 1px solid #f0f0f0;
      //padding-bottom: 14px;
      //margin-bottom: 14px;
      position: relative;

      .section-title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }

      .security-score {
        position: absolute;
        right: 0;
      }
    }

    .account-setting-home-content-section {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;

      .security-card {
        height: 160px;
        background-color: #fff;
        border-radius: 16px;
        padding: 16px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border: 1px solid #f0f0f0;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          transform: translateY(-3px);
        }

        .security-card-avatar {
          width: 80px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 10px;

          :deep(.ant-avatar) {
            background-color: #f5f7fa;
            transition: transform 0.3s ease;

            &:hover {
              transform: scale(1.05);
            }
          }
        }

        .security-card-content {
          width: calc(100% - 80px);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;

          .security-card-header {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .security-card-title {
              font-size: 16px;
              font-weight: bold;
              color: #333;
            }

            .status-tag {
              margin-left: auto;
            }
          }

          .security-card-desc {
            font-size: 14px;
            color: #666;
            margin: 0;
          }

          .security-card-actions {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: auto;
          }
        }
      }
    }
  }
}
</style>
