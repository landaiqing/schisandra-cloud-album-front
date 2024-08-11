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
                        :placeholder=phoneValidate
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
                    <AInput v-model:value="phoneLoginForm.captcha" size="large" :placeholder=captchaValidate>
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
                  <ACheckbox>{{ t("login.autoLogin") }}</ACheckbox>
                  <a>{{ t("login.forgotPassword") }}</a>
                </AFlex>

              </AFormItem>
              <AFormItem>
                <AButton @click="phoneLoginSubmit" type="primary" size="large" class="login-form-button">
                  {{ t("login.login") }}
                </AButton>
              </AFormItem>
            </AForm>
            <ADivider/>
            <AFlex :vertical="false" align="center" justify="space-around">
              <AButton class="login-form-bottom-button" :icon="h(QrcodeOutlined)">{{ t("login.qrLogin") }}</AButton>
              <AButton class="login-form-bottom-button" :icon="h(QqOutlined)"></AButton>
              <AButton class="login-form-bottom-button" :icon="h(GithubOutlined)"></AButton>
            </AFlex>
          </ATabPane>
          <!--    账号登录      -->
          <ATabPane key="accountLogin">
            <template #tab>
                <span class="login-tab-span">
                      {{ t("login.accountLogin") }}
                 </span>
            </template>
            <AForm ref="accountLoginFormRef" :rules="rules" :model="accountLoginForm">
              <AFormItem
                  class="login-form-item"
                  name="account">
                <span class="login-card-span">{{ t("login.account") }}</span>
                <AInput v-model:value="accountLoginForm.account" class="login-form-input" size="large"
                        :placeholder=accountValidate>
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
                                  :placeholder=passwordValidate>
                    <template #prefix>
                      <SafetyOutlined/>
                    </template>
                  </AInputPassword>
                </AFlex>
              </AFormItem>
              <AFormItem>
                <AFlex :vertical="false" justify="space-between">
                  <ACheckbox>{{ t("login.autoLogin") }}</ACheckbox>
                  <a>{{ t("login.forgotPassword") }}</a>
                </AFlex>

              </AFormItem>
              <AFormItem>
                <AButton @click="accountLoginSubmit" type="primary" size="large" class="login-form-button">
                  {{
                    t("login.loginAndRegister")
                  }}
                </AButton>
              </AFormItem>
            </AForm>
            <ADivider/>
            <AFlex :vertical="false" align="center" justify="space-around">
              <AButton class="login-form-bottom-button" :icon="h(QrcodeOutlined)">{{ t("login.qrLogin") }}</AButton>
              <AButton class="login-form-bottom-button" :icon="h(QqOutlined)"></AButton>
              <AButton class="login-form-bottom-button" :icon="h(GithubOutlined)"></AButton>
            </AFlex>
          </ATabPane>

        </ATabs>
        <ATooltip placement="left">
          <template #title>
            <span>{{ t("login.qrLogin") }}</span>
          </template>
          <div class="login-right-qrcode"/>
        </ATooltip>
      </ACard>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Rule} from "ant-design-vue/lib/form";
import {h, onMounted, reactive, ref, UnwrapRef} from "vue";
import {AccountLogin, PhoneLogin} from "@/types/user";
import {GithubOutlined, QqOutlined, QrcodeOutlined} from "@ant-design/icons-vue";
import {useI18n} from "vue-i18n";
import BoxDog from "@/components/BoxDog/BoxDog.vue";

const {t} = useI18n();
const accountLoginFormRef = ref();
const phoneLoginFormRef = ref<any>();
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
    }
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
  const startTime = localStorage.getItem('startTimeSendCaptcha');
  const nowTime = new Date().getTime();
  let surplus: number = 60;
  let timer: any;
  if (startTime) {
    surplus = 60 - Math.floor((nowTime - Number(startTime)) / 1000);
    surplus = surplus <= 0 ? 0 : surplus;
  } else {
    localStorage.setItem('startTimeSendCaptcha', String(nowTime));
  }

  state.countDownTime = surplus;

  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (state.countDownTime <= 0) {
      localStorage.removeItem('startTimeSendCaptcha');
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
  const sendEndTime = localStorage.getItem('startTimeSendCaptcha');
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
        countDown();
        console.log('values');
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
      .then(() => {
        console.log('values', phoneLoginForm);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
}

</script>
<style src="./index.scss" scoped>
@import "@/assets/styles/global.scss";
</style>
