<template>
  <div class="account-setting-home">
    <div class="account-setting-home-info">
      <div class="account-setting-home-info-avatar">
        <AAvatar :size="80" :src="userStore.user.avatar"/>
      </div>
      <div class="account-setting-home-info-content">
        <AFlex :vertical="false" align="center" justify="space-between" gap="small">
          <span class="account-setting-home-info-content-name">{{ userStore.user.nickname }}</span>
          <ATag color="success" :bordered="false">正式会员</ATag>
          <img src="/level_icon/icon/lv1.png" style="width: 40px" alt="level">
        </AFlex>
        <AProgress :percent="50" :stroke-color="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }" :showInfo="false" style="width: 500px" :size="15"/>
        <AFlex :vertical="false" align="flex-start" justify="space-between" style="width: 500px">
          <img src="/level_icon/icon/lv1.png" class="avatar-level-icon" alt="level">
          <img src="/level_icon/icon/lv2.png" class="avatar-level-icon" alt="level">
        </AFlex>
      </div>
    </div>
    <ADivider/>
    <div class="account-setting-home-content">
      <div class="account-setting-home-content-header">
        <AAvatar size="default" :src="accountSecurity"/>
        <span style="font-size: 20px; font-weight: bold;color: #333">账号安全</span>
      </div>
      <div class="account-setting-home-content-section" v-if="securityStatus">
        <AFlex :vertical="false" align="center" justify="space-between" :gap="50">
          <div class="account-setting-home-content-section-item">
            <div class="account-setting-home-content-section-item-avatar">
              <AAvatar shape="circle" :size="80" :src="emailSecurity"/>
            </div>
            <div class="account-setting-home-content-section-item-content">
              <span style="font-size: 18px; font-weight: bold;color: #333;margin-top: 10px">我的邮箱</span>
              <span style="font-size: 14px; color: #666;">绑定邮箱后即可使用邮箱登录</span>
              <AFlex :vertical="false" align="center" justify="space-between" gap="large">
                <AButton type="primary" size="small" :disabled="securityStatus.bind_email">
                  {{ securityStatus.bind_email ? "已绑定邮箱" : "绑定邮箱" }}
                </AButton>
                <AButton type="link" size="small">{{ securityStatus.bind_email ? "修改邮箱" : "绑定邮箱" }}</AButton>
              </AFlex>
            </div>
          </div>
          <div class="account-setting-home-content-section-item">
            <div class="account-setting-home-content-section-item-avatar">
              <AAvatar shape="circle" :size="80" :src="phoneSecurity"/>
            </div>
            <div class="account-setting-home-content-section-item-content">
              <span style="font-size: 18px; font-weight: bold;color: #333;margin-top: 10px">我的手机</span>
              <span style="font-size: 14px; color: #666;">绑定手机后即可使用手机号登录</span>
              <AFlex :vertical="false" align="center" justify="space-between" gap="large">
                <AButton type="primary" size="small" :disabled="true">已绑定手机</AButton>
                <AButton type="link" size="small">更改手机</AButton>
              </AFlex>
            </div>
          </div>
        </AFlex>
        <AFlex :vertical="false" align="center" justify="space-between" :gap="50">
          <div class="account-setting-home-content-section-item">
            <div class="account-setting-home-content-section-item-avatar">
              <AAvatar shape="circle" :size="80" :src="passwordSecurity"/>
            </div>
            <div class="account-setting-home-content-section-item-content">
              <span style="font-size: 18px; font-weight: bold;color: #333;margin-top: 10px">我的密保</span>
              <span style="font-size: 14px; color: #666;">设置密保，账号更安全</span>
              <AFlex :vertical="false" align="center" justify="space-between" gap="large">
                <AButton type="primary" size="small" :disabled="securityStatus.set_password">
                  {{ securityStatus.set_password ? "已设置密保" : "设置密保" }}
                </AButton>
                <AButton type="link" size="small">{{ securityStatus.set_password ? "修改密保" : "设置密保" }}</AButton>
              </AFlex>
            </div>
          </div>
          <div class="account-setting-home-content-section-item">
            <div class="account-setting-home-content-section-item-avatar">
              <AAvatar shape="circle" :size="80" :src="loginSecurity"/>
            </div>
            <div class="account-setting-home-content-section-item-content">
              <span style="font-size: 18px; font-weight: bold;color: #333;margin-top: 10px">三方登录</span>
              <span style="font-size: 14px; color: #666;">绑定三方账号，安全登录</span>
              <AFlex :vertical="false" align="center" justify="space-between" gap="large">
                <AButton type="primary" size="small" :disabled="securityStatus.bind_wechet">
                  {{ securityStatus.bind_wechet ? "已绑定" : "绑定" }}
                </AButton>
                <AButton type="link" size="small">{{ securityStatus.bind_wechet ? "管理" : "" }}</AButton>
              </AFlex>
            </div>
          </div>
        </AFlex>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import useStore from "@/store";
import accountSecurity from "@/assets/svgs/account_security.svg";
import emailSecurity from "@/assets/svgs/email_security.svg";
import phoneSecurity from "@/assets/svgs/phone_security.svg";
import passwordSecurity from "@/assets/svgs/password_security.svg";
import loginSecurity from "@/assets/svgs/login_security.svg";
import {checkSecuritySettingApi} from "@/api/auth";

const userStore = useStore().user;

const securityStatus = ref<any>();

async function checkStatus() {
  const res: any = await checkSecuritySettingApi();
  console.log(res);
  if (res && res.code === 200) {
    securityStatus.value = res.data;
  }
}

onMounted(() => {
  checkStatus();
});

</script>

<style scoped lang="scss">
.account-setting-home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .account-setting-home-info {
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 40px;

    .account-setting-home-info-avatar {
      width: 130px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: flex-start;

    }

    .account-setting-home-info-content {
      width: calc(100% - 100px);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 10px;

      .account-setting-home-info-content-name {
        font-size: 24px;
        font-weight: bold;
      }

      .avatar-level-icon {
        width: 40px;
      }
    }
  }

  .account-setting-home-content {
    width: 100%;
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;

    .account-setting-home-content-header {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
    }

    .account-setting-home-content-section {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 20px;

      .account-setting-home-content-section-item {
        width: 330px;
        height: 100px;
        background-color: #fff;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 10px;

        .account-setting-home-content-section-item-avatar {
          width: 100px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .account-setting-home-content-section-item-content {
          width: 300px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 10px;
        }
      }
    }
  }
}
</style>
