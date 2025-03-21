<template>
  <div class="login-container">
    <div class="main">
      <div class="main-container">
        <div class="main-header">
          <div class="title">
            <img
                src="@/assets/svgs/logo-album.svg"
                class="logo"
                alt="logo"
            >
            <span>系统管理</span>
          </div>
          <div class="description">
            <span>欢迎使用系统管理</span>
          </div>
        </div>

        <div class="main-content">
          <AForm>
            <div style="padding: 1px; margin: 5px 0">
              <AFormItem v-bind="formUse.validateInfos.account">
                <AInput
                    v-model:value="formModel.account"
                    placeholder="请输入账号"
                    size="large"
                    type="text"
                    @pressEnter="doLogin"
                >
                  <template #prefix>
                    <UserOutlined :style="formStates.account ? { color: '#c0c0c0' } : {}"/>
                  </template>
                </AInput>
              </AFormItem>
            </div>

            <div style="padding: 1px">
              <AFormItem v-bind="formUse.validateInfos.password">
                <AInput
                    v-model:value="formModel.password"
                    placeholder="请输入密码"
                    size="large"
                    type="password"
                    @pressEnter="doLogin"
                >
                  <template #prefix>
                    <LockOutlined :style="formStates.password ? { color: '#c0c0c0' } : {}"/>
                  </template>
                </AInput>
              </AFormItem>
            </div>

            <AFormItem style="margin: 30px 0 0">
              <AButton
                  size="large"
                  type="primary"
                  class="login-button"
                  :loading="loading"
                  :disabled="loading"
                  @click="doLogin"
              >
                登录
              </AButton>
            </AFormItem>
          </AForm>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="copyright">
        Copyright &copy; 2025 Schisandra Cloud Album Admin. All Rights Reserved.
      </div>
    </div>
  </div>
  <AModal v-model:open="showTextCaptcha" :footer="null" :closable="false" width="375" :centered="true"
          :maskClosable="false" :bodyStyle="{padding: 0}">
    <gocaptcha-click
        :config="{}"
        :data="{
        image: captchaData.image,
        thumb: captchaData.thumb,
      }"
        :events="textCaptchaEvent"
        ref="captcha"
    />
  </AModal>
</template>

<script setup lang="ts">
import {UserOutlined, LockOutlined} from '@ant-design/icons-vue';
import {notification} from 'ant-design-vue';
import Form from 'ant-design-vue/es/form';
import {getTextCaptchaDataApi} from "@/api/captcha";
import {useThrottleFn} from "@vueuse/core";
import {adminAccountLoginApi} from "@/api/admin";
import useStore from "@/store";


defineOptions({name: 'Login'});

const loading = ref(false);
// const router = useRouter();
const captcha = ref(null);
const captchaData = ref<any>({});
const showTextCaptcha = ref(false);
const systemStore = useStore().system;
const formModel = reactive({
  account: '',
  password: '',
});
const textCaptchaEvent: any = {
  confirm: (dots: any, reset: () => void) => {
    confirmTextCaptcha(dots, reset);
  },
  close: () => {
    showTextCaptcha.value = false;
    loading.value = false;
  },
  refresh: () => {
    refreshCaptcha();
  },
};

const formRules = reactive({
  account: [
    {
      required: true,
      message: '请输入用户名',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
});

const formStates = reactive({
  account: computed(() => formUse.validateInfos.account.validateStatus !== 'error'),
  password: computed(() => formUse.validateInfos.password.validateStatus !== 'error'),
});

const formUse = Form.useForm(
    formModel,
    formRules,
);

const doLogin = async () => {
  try {
    await formUse.validate();
    getTextCaptcha().then(() => {
      showTextCaptcha.value = true;
    });
    loading.value = true;
  } catch (err) {
    showTextCaptcha.value = false;
    loading.value = false;
    console.warn(err);
  }
};

async function getTextCaptcha() {
  const res: any = await getTextCaptchaDataApi();
  if (res && res.code === 200) {
    captchaData.value = {
      key: res.data.key,
      image: res.data.image,
      thumb: res.data.thumb,
    };
  }
}

const refreshCaptcha = useThrottleFn(getTextCaptcha, 3000);

async function confirmTextCaptcha(dots: any, reset: () => void) {
  const dotArr: any[] = [];
  for (let i = 0; i < dots.length; i++) {
    const dot: any = dots[i];
    dotArr.push(dot.x, dot.y);
  }
  const params: any = {
    dots: dotArr.join(','),
    account: formModel.account,
    password: formModel.password,
    key: captchaData.value.key,
  };
  const res: any = await adminAccountLoginApi(params);
  if (res && res.code === 200) {
    const {uid, access_token, expire_at, username, avatar, nickname, status} = res.data;
    systemStore.admin.uid = uid;
    systemStore.admin.username = username;
    systemStore.admin.avatar = avatar;
    systemStore.admin.nickname = nickname;
    systemStore.admin.status = status;
    systemStore.token.accessToken = access_token;
    systemStore.token.expire_at = expire_at;
    notification.success({
      message: `系统提示`,
      duration: 2,
      description: "欢迎回来！",
      onClose: () => {
        loading.value = false;
      },
    });
  } else {
    notification.warning({
      message: `系统提示`,
      duration: 2,
      description: res.msg,
      onClose: () => {
        loading.value = false;
      },
    });
    await refreshCaptcha();
  }
  reset();
  showTextCaptcha.value = false;
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  background: #f0f2f5 url(@/assets/svgs/background.svg);

  & > .main {
    width: 420px;
    height: 100%;
    flex: 0 0 auto;
    position: relative;

    & > .main-container {
      height: 450px;
      margin: auto 0;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 45px;
      right: 45px;
      bottom: 90px;

      & > .main-header {
        width: calc(100% - 64px);
        height: auto;
        margin: 0 auto 48px;

        & > .title {
          font-size: 33px;
          color: rgba(0, 0, 0, 0.85);
          text-align: center;
          font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
          font-weight: 600;

          & > .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }
        }

        & > .description {
          font-size: 15px;
          color: rgba(0, 0, 0, 0.45);
          text-align: center;
          margin-top: 10px;
        }
      }

      & > .main-content {
        button.login-button {
          padding: 0 15px;
          width: calc(100% - 6px);
          margin: 0 3px;
        }
      }
    }
  }

  & > .footer {
    width: 100%;
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;
    position: fixed;
    bottom: 0;

    .copyright {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
  }
}
</style>
