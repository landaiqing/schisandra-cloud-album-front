<template>
  <a-spin :spinning="loginLoading" tip="Login..." size="large">
    <div class="login-main">
      <div class="login-left">
        <BoxDog/>
      </div>
      <div class="login-right">

      <span class="login-right-title">
        <img src="@/assets/images/logo-schisandra.png" @click="()=>{
          router.push('/')
        }" style="width: 30px; height: 30px;cursor: pointer;" alt="">
        {{ t("login.title") }}
      </span>
        <ACard class="login-card" bordered :hoverable="false">
          <ATabs :centered="false" size="large">
            <!--    短信登录      -->
            <ATabPane key="phoneLogin">
              <template #tab>
                <span class="login-tab-span">
                      {{ t("login.phoneLogin") }}
                 </span>
              </template>
              <AForm ref="phoneLoginFormRef" :rules="rules" :model="phoneLoginForm">
                <AFormItem
                    class="login-form-item"
                    name="phone">
                  <span class="login-card-span">{{ t("login.phone") }}</span>
                  <AInput v-model:value="phoneLoginForm.phone" class="login-form-input" size="large"
                          :placeholder=phoneValidate allow-clear
                          autocomplete="off"
                  >
                    <template #prefix>
                      <TabletOutlined/>
                    </template>
                  </AInput>
                </AFormItem>
                <AFormItem
                    class="login-form-item"
                    name="captcha">
                  <AFlex :vertical="true">
                    <span class="login-card-span">{{ t("login.phoneCaptcha") }}</span>
                    <AFlex :vertical="false" align="center" justify="center">
                      <AInput v-model:value="phoneLoginForm.captcha" size="large" :placeholder=captchaValidate
                              allow-clear>
                        <template #prefix>
                          <SafetyOutlined/>
                        </template>
                      </AInput>
                      <AButton v-if="!state.showCountDown" @click="sendCaptchaThrottle" style="margin-left: 10px"
                               size="large">{{
                          t("login.sendCaptcha")
                        }}
                      </AButton>
                      <AButton v-if="state.showCountDown" disabled style="margin-left: 10px" size="large">
                        {{
                          currentCountDownTime
                        }}s{{ t("login.reSendCaptcha") }}
                      </AButton>
                    </AFlex>
                  </AFlex>

                </AFormItem>
                <AFormItem id="phone_login_auto" name="auto_login">
                  <AFlex :vertical="false" justify="space-between">
                    <ACheckbox id="phone_login_auto_checkbox" v-model:checked="phoneLoginForm.auto_login">
                      {{ t("login.autoLogin") }}
                    </ACheckbox>
                  </AFlex>

                </AFormItem>
                <AFormItem>
                  <AButton @click="phoneLoginSubmitDebounce" type="primary" size="large" class="login-form-button">
                    {{ t("login.loginAndRegister") }}
                  </AButton>
                </AFormItem>
              </AForm>
              <LoginFooter/>
            </ATabPane>
            <!--    账号登录      -->
            <ATabPane key="accountLogin">
              <template #tab>
                <span class="login-tab-span">
                      {{ t("login.accountLogin") }}
                 </span>
              </template>
              <AForm ref="accountLoginFormRef" :rules="rules" :model="accountLoginForm" autocomplete="off">
                <AFormItem
                    class="login-form-item"
                    name="account">
                  <span class="login-card-span">{{ t("login.account") }}</span>
                  <AInput v-model:value="accountLoginForm.account" class="login-form-input" size="large"
                          :placeholder=accountValidate allow-clear autocomplete="off">
                    <template #prefix>
                      <user-outlined/>
                    </template>
                  </AInput>
                </AFormItem>
                <AFormItem
                    class="login-form-item"
                    name="password">
                  <AFlex :vertical="true">
                    <span class="login-card-span">{{ t("login.password") }}</span>
                    <AInputPassword v-model:value="accountLoginForm.password" class="login-form-input" size="large"
                                    :placeholder=passwordValidate allow-clear autocomplete="off">
                      <template #prefix>
                        <SafetyOutlined/>
                      </template>
                    </AInputPassword>
                  </AFlex>
                </AFormItem>
                <AFormItem id="account_login_auto" name="auto_login">
                  <AFlex :vertical="false" justify="space-between">
                    <ACheckbox id="account_login_auto_checkbox" v-model:checked="accountLoginForm.auto_login">
                      {{ t("login.autoLogin") }}
                    </ACheckbox>
                    <a @click="()=>{
                    router.push('/resetpass')
                  }">{{ t("login.forgotPassword") }}</a>
                  </AFlex>

                </AFormItem>
                <AFormItem>
                  <AButton @click="accountLoginSubmitDebounce" type="primary" size="large" class="login-form-button">
                    {{
                      t("login.login")
                    }}
                  </AButton>
                </AFormItem>
              </AForm>
              <LoginFooter/>
            </ATabPane>
          </ATabs>
          <ATooltip placement="left">
            <template #title>
              <span>{{ t("login.qrLogin") }}</span>
            </template>
            <div @click="()=>{
            router.push('/qrlogin');
          }" class="login-right-qrcode"/>
          </ATooltip>
        </ACard>
      </div>
      <AModal v-model:open="showPhoneRotateCaptcha" :footer="null" :closable="false" width="375" :centered="true"
              :maskClosable="false" :bodyStyle="{padding: 0}">
        <!--    滑动验证码 -->
        <gocaptcha-rotate
            class="gocaptcha-rotate"
            v-if="showPhoneRotateCaptcha"
            :data="captchaData"
            :config="{
                  title: t('login.rotateCaptchaTitle'),
                }"
            :events="phoneLoginRotateEvent"
        />
      </AModal>
      <AModal v-model:open="showAccountRotateCaptcha" :footer="null" :closable="false" width="375" :centered="true"
              :maskClosable="false" :bodyStyle="{padding: 0}">
        <!--    滑动验证码 -->
        <gocaptcha-rotate
            class="gocaptcha-rotate"
            v-if="showAccountRotateCaptcha"
            :data="captchaData"
            :config="{
            title: t('login.rotateCaptchaTitle'),
          }"
            :events="accountLoginRotateEvent"
        />
      </AModal>

      <div class="area">
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  </a-spin>
</template>
<script setup lang="ts">
import {Rule} from "ant-design-vue/lib/form";
import {computed, onMounted, reactive, ref, UnwrapRef} from "vue";
import {AccountLogin, PhoneLogin} from "@/types/user";
import {useI18n} from "vue-i18n";
import BoxDog from "@/components/BoxDog/BoxDog.vue";
import LoginFooter from "@/views/Login/LoginFooter.vue";
import {useRouter} from "vue-router";
import {getRotatedCaptchaData} from "@/api/captcha";
import {message} from "ant-design-vue";
import {accountLoginApi, phoneLoginApi, sendMessage} from "@/api/user";
import useStore from "@/store";
import {useDebounceFn, useThrottleFn} from "@vueuse/core";

const router = useRouter();
const {t} = useI18n();
const accountLoginFormRef = ref<any>();
const phoneLoginFormRef = ref<any>();
const showPhoneRotateCaptcha = ref<boolean>(false);
const showAccountRotateCaptcha = ref<boolean>(false);
const captchaData = reactive({angle: 0, image: "", thumb: "", key: ""});
const loginLoading = ref<boolean>(false);
const phoneLoginRotateEvent = {
  confirm: (angle: number) => {
    checkPhoneLoginCaptchaDebounce(angle);
  },
  close: () => {
    showPhoneRotateCaptcha.value = false;
  },
  refresh: () => {
    refreshCaptcha();
  },
};
const accountLoginRotateEvent = {
  confirm: (angle: number) => {
    checkAccountLoginCaptchaDebounce(angle);
  },
  close: () => {
    showAccountRotateCaptcha.value = false;
  },
  refresh: () => {
    refreshCaptcha();
  },
};
// 账号登录表单数据
const accountLoginForm: UnwrapRef<AccountLogin> = reactive({
  account: '',
  password: '',
  auto_login: true,
  angle: 0,
  key: "",
});
// 手机登录表单数据
const phoneLoginForm: UnwrapRef<PhoneLogin> = reactive({
  phone: '',
  captcha: '',
  auto_login: true,
});
// 表单验证提示
const accountValidate = ref<string>(t('login.accountValidate'));
const passwordValidate = ref<string>(t('login.passwordValidate'));
const phoneValidate = ref<string>(t('login.phoneValidate'));
const captchaValidate = ref<string>(t('login.captchaValidate'));
// 表单验证规则
const rules: Record<string, Rule[]> = {
  account: [
    {required: true, message: t('login.accountValidate'), trigger: 'change'},
  ],
  password: [
    {
      required: true, message: t('login.passwordValidate'), trigger: 'change'
    },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,18}$/,
      message: t('login.passwordRule'),
    },
  ],
  phone: [
    {required: true, message: t('login.phoneValidate'), trigger: 'change'},
    {pattern: /^1[2-9]\d{9}$/, message: t('login.phoneValidate')}
  ],
  captcha: [
    {
      required: true, message: t('login.captchaValidate'), trigger: 'change'
    },
  ]
};

interface State {
  countDownTime: number;
  showCountDown: boolean;
}

const state = reactive<State>({
  countDownTime: 60,
  showCountDown: false,
} as State);
const currentCountDownTime = computed(() => state.countDownTime);
/**
 * 验证码发送倒计时
 */
const countDown = () => {
  const startTime = localStorage.getItem('start_time_send_captcha');
  const nowTime = new Date().getTime();
  let surplus: number = 60;
  let timer: any;
  if (startTime) {
    surplus = 60 - Math.floor((nowTime - Number(startTime)) / 1000);
    surplus = surplus <= 0 ? 0 : surplus;
  } else {
    localStorage.setItem('start_time_send_captcha', String(nowTime));
  }
  state.countDownTime = surplus;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (state.countDownTime <= 0) {
      localStorage.removeItem('start_time_send_captcha');
      clearInterval(timer);
      state.countDownTime = 60;
      state.showCountDown = false;
    } else {
      state.countDownTime--;
      state.showCountDown = true;
    }
  }, 1000);
};
onMounted(() => {
  const sendEndTime = localStorage.getItem('start_time_send_captcha');
  if (sendEndTime) {
    state.showCountDown = true;
    countDown();
  }
});

/**
 *  发送验证码节流
 */
const sendCaptchaThrottle = useThrottleFn(sendCaptcha, 3000);

/**
 * 发送验证码
 */
async function sendCaptcha() {
  phoneLoginFormRef.value
      .validateFields("phone")
      .then(() => {
        getRotateCaptcha().then(() => {
          showPhoneRotateCaptcha.value = true;
        });
      })
      .catch((error: any) => {
        console.log('error', error);
      });
}

/**
 *  账号登录  防抖
 */
const accountLoginSubmitDebounce = useDebounceFn(accountLoginSubmit, 1000);

/**
 * 账号登录提交
 */
async function accountLoginSubmit() {
  accountLoginFormRef.value
      .validate()
      .then(() => {
        getRotateCaptcha().then(() => {
          showAccountRotateCaptcha.value = true;
        });
      })
      .catch((error: any) => {
        console.log('error', error);
      });
}

/**
 * 手机登录提交  防抖
 */
const phoneLoginSubmitDebounce = useDebounceFn(phoneLoginSubmit, 1000);

/**
 * 手机登录提交
 */
async function phoneLoginSubmit() {
  loginLoading.value = true;
  phoneLoginFormRef.value
      .validate()
      .then(async () => {
        const res: any = await phoneLoginApi(phoneLoginForm);
        console.log(res);
        if (res.code === 200 && res.success) {
          const userStore = useStore().user;
          const {uid, access_token, refresh_token, expires_at, user_info} = res.data;
          userStore.user.uid = uid;
          userStore.user.accessToken = access_token;
          userStore.user.refreshToken = refresh_token;
          userStore.user.expiresAt = expires_at;
          userStore.user.userInfo = user_info;
          message.success(t('login.loginSuccess'));
          loginLoading.value = false;
          setTimeout(() => {
            router.push('/main');
          }, 1000);
        } else {
          loginLoading.value = false;
          message.error(res.message);
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
}

/**
 * 刷新验证码  节流
 */
const refreshCaptcha = useThrottleFn(getRotateCaptcha, 3000);

/**
 * 获取旋转验证码数据
 */
async function getRotateCaptcha() {
  const data: any = await getRotatedCaptchaData();
  if (data.code === 200 && data.data) {
    const {angle, image, thumb, key} = data.data;
    captchaData.angle = angle;
    captchaData.image = image;
    captchaData.thumb = thumb;
    captchaData.key = key;
  } else {
    message.error(t('login.systemError'));
  }
}

/**
 *  检查手机登录旋转验证码   防抖
 */
const checkPhoneLoginCaptchaDebounce = useDebounceFn(checkPhoneLoginCaptcha, 500);

/**
 * 验证旋转验证码
 * @param angle
 */
async function checkPhoneLoginCaptcha(angle: number) {
  const params = {
    phone: phoneLoginForm.phone,
    angle: angle,
    key: captchaData.key,
  };
  const result: boolean = await sendMessageByPhone(params);
  if (result) {
    showPhoneRotateCaptcha.value = false;
    countDown();
  }
}

/**
 * 检查账户登录旋转验证码  防抖
 */
const checkAccountLoginCaptchaDebounce = useDebounceFn(checkAccountLoginCaptcha, 500);

/**
 * 检查账户登录旋转验证码
 * @param angle
 */
async function checkAccountLoginCaptcha(angle: number) {
  const params = {
    ...accountLoginForm,
    angle: angle,
    key: captchaData.key,
  };
  loginLoading.value = true;
  const res: any = await accountLoginApi(params);
  if (res.code === 200 && res.success) {
    const userStore = useStore().user;
    const {uid, access_token, refresh_token, expires_at, user_info} = res.data;
    userStore.user.uid = uid;
    userStore.user.accessToken = access_token;
    userStore.user.refreshToken = refresh_token;
    userStore.user.expiresAt = expires_at;
    userStore.user.userInfo = user_info;
    message.success(t('login.loginSuccess'));
    loginLoading.value = false;
    showAccountRotateCaptcha.value = false;
    setTimeout(() => {
      router.push('/main');
    }, 1000);
  } else {
    loginLoading.value = false;
    message.error(t('login.loginError'));
  }

}

/**
 * 发送手机验证码
 */
async function sendMessageByPhone(params: any): Promise<boolean> {
  const res: any = await sendMessage(params);
  if (res.code === 200 && res.success) {
    message.success(t('login.sendCaptchaSuccess'));
    return true;
  } else {
    message.error(res.message);
    return false;
  }
}
</script>
<style src="./index.scss" scoped lang="scss">

</style>
