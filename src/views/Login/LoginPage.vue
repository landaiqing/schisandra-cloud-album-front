<template>
  <div class="login-main">
    <div class="login-left">
      <BoxDog/>
    </div>
    <div class="login-right">
      <span class="login-right-title">{{ t("login.title") }}</span>
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
                    <AButton v-if="!state.showCountDown" @click="sendCaptcha" style="margin-left: 10px" size="large">{{
                        t("login.sendCaptcha")
                      }}
                    </AButton>
                    <AButton v-if="state.showCountDown" disabled style="margin-left: 10px" size="large">{{
                        state.countDownTime
                      }}s{{ t("login.reSendCaptcha") }}
                    </AButton>
                  </AFlex>
                </AFlex>

              </AFormItem>
              <AFormItem>
                <AFlex :vertical="false" justify="space-between">
                  <ACheckbox @change="(e: any)=>{
                    autoLoginChang(e.target.checked);
                  }" v-model:checked="autoLoginChecked">{{ t("login.autoLogin") }}
                  </ACheckbox>
                </AFlex>

              </AFormItem>
              <AFormItem>
                <AButton @click="phoneLoginSubmit" type="primary" size="large" class="login-form-button">
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
              <AFormItem>
                <AFlex :vertical="false" justify="space-between">
                  <ACheckbox v-model:checked="autoLoginChecked" @change="(e: any)=>{
                    autoLoginChang(e.target.checked);
                  }">{{ t("login.autoLogin") }}
                  </ACheckbox>
                  <a @click="()=>{
                    router.push('/resetpass')
                  }">{{ t("login.forgotPassword") }}</a>
                </AFlex>

              </AFormItem>
              <AFormItem>
                <AButton @click="accountLoginSubmit" type="primary" size="large" class="login-form-button">
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
    <div v-if="showRotateCaptcha" class="mask">
      <!--    滑动验证码 -->
      <gocaptcha-rotate
          class="gocaptcha-rotate"
          v-if="showRotateCaptcha"
          :data="captchaData"
          :config="{
            title: t('login.rotateCaptchaTitle'),
          }"
          :events="rotateEvent"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {Rule} from "ant-design-vue/lib/form";
import {onMounted, reactive, ref, UnwrapRef} from "vue";
import {AccountLogin, PhoneLogin} from "@/types/user";
import {useI18n} from "vue-i18n";
import BoxDog from "@/components/BoxDog/BoxDog.vue";
import LoginFooter from "@/views/Login/LoginFooter.vue";
import {useRouter} from "vue-router";
import {checkRotatedCaptcha, getRotatedCaptchaData} from "@/api/captcha";
import {message} from "ant-design-vue";
import {phoneLoginApi, sendMessage} from "@/api/user";
import useStore from "@/store";

const router = useRouter();
const {t} = useI18n();
const accountLoginFormRef = ref<any>();
const phoneLoginFormRef = ref<any>();
const showRotateCaptcha = ref<boolean>(false);
const captchaData = reactive({angle: 0, image: "", thumb: "", key: ""});
const captchaErrorCount = ref<number>(0);
const autoLoginChecked = ref<boolean>(localStorage.getItem('auto_login') === 'true');
const rotateEvent = {
  confirm: (angle: number) => {
    checkCaptcha(angle);
  },
  close: () => {
    closeRotateCaptcha();
  },
  refresh: () => {
    getRotateCaptcha();
  },
};
// 账号登录表单数据
const accountLoginForm: UnwrapRef<AccountLogin> = reactive({
  account: '',
  password: '',
});
// 手机登录表单数据
const phoneLoginForm: UnwrapRef<PhoneLogin> = reactive({
  phone: '',
  captcha: '',
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

const state = reactive({
  countDownTime: 60,
  showCountDown: false,
});

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
 * 发送验证码
 */
async function sendCaptcha() {
  phoneLoginFormRef.value
      .validateFields("phone")
      .then(() => {
        getRotateCaptcha().then(() => {
          showRotateCaptcha.value = true;
        });
      })
      .catch((error: any) => {
        console.log('error', error);
      });
}

/**
 * 账号登录提交
 */
async function accountLoginSubmit() {
  accountLoginFormRef.value
      .validate()
      .then(() => {
        console.log('values', accountLoginForm);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
}

/**
 * 手机登录提交
 */
async function phoneLoginSubmit() {
  phoneLoginFormRef.value
      .validate()
      .then(async () => {
        const res: any = await phoneLoginApi(phoneLoginForm);
        if (res.code === 0 && res.success) {
          const userStore = useStore().user;
          const {uid, access_token, refresh_token, expires_at} = res.data;
          userStore.user.userId = uid;
          userStore.user.accessToken = access_token;
          userStore.user.refreshToken = refresh_token;
          userStore.user.expiresAt = expires_at;
          message.success(t('login.loginSuccess'));
        } else {
          message.error(res.message);
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
}

/**
 * 获取旋转验证码数据
 */
async function getRotateCaptcha() {
  const data: any = await getRotatedCaptchaData();
  if (data.code === 0 && data.data) {
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
 * 验证旋转验证码
 * @param angle
 */
async function checkCaptcha(angle: number) {
  if (captchaErrorCount.value >= 2) {
    message.error(t('login.captchaError'));
    getRotateCaptcha().then(() => {
      captchaErrorCount.value = 0;
    });
  } else {
    const result: any = await checkRotatedCaptcha(angle, captchaData.key);
    if (result.code === 0 && result.success) {
      showRotateCaptcha.value = false;
      const result: boolean = await sendMessageByPhone();
      if (result) {
        countDown();
      }
    } else if (result.code === 1011) {
      message.error(t('login.captchaExpired'));
      getRotateCaptcha().then(() => {
        captchaErrorCount.value = 0;
      });

    } else {
      captchaErrorCount.value++;
      message.error(t('login.captchaError'));
    }
  }
}

/**
 * 关闭旋转验证码
 */
async function closeRotateCaptcha() {
  showRotateCaptcha.value = false;
}

/**
 * 发送手机验证码
 */
async function sendMessageByPhone(): Promise<boolean> {
  const phone: string = phoneLoginForm.phone as string;
  const res: any = await sendMessage(phone);
  if (res.code === 0 && res.success) {
    message.success(t('login.sendCaptchaSuccess'));
    return true;
  } else {
    message.error(res.data);
    return false;
  }
}

async function autoLoginChang(checkedValue: boolean) {
  return localStorage.setItem('auto_login', String(checkedValue));
}
</script>
<style src="./index.scss" scoped>
@import "@/assets/styles/global.scss";
</style>
