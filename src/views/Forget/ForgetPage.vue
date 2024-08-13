<template>
  <div class="forget-main">
    <div class="forget-left">
      <BoxDog/>
    </div>
    <div class="forget-right">
      <span class="forget-right-title">{{ t("login.title") }}</span>
      <ACard class="forget-card" bordered :hoverable="false">
        <AFlex :vertical="true">
          <span class="forget-card-title">{{ t("login.forgetPassword") }}</span>
          <AForm
              ref="resetPasswordRef"
              :model="ResetPasswordForm"
              :rules="rules"
          >
            <AFormItem name="phone">
              <span class="forget-card-span">{{ t("login.phone") }}</span>
              <AInput v-model:value="ResetPasswordForm.phone" :placeholder=phoneValidate size="large" allow-clear>
                <template #prefix>
                  <TabletOutlined/>
                </template>
              </AInput>
            </AFormItem>
            <AFormItem name="captcha">
              <AFlex :vertical="true">
                <span class="forget-card-span">{{ t("login.phoneCaptcha") }}</span>
                <AFlex :vertical="false" align="center" justify="center">
                  <AInput v-model:value="ResetPasswordForm.captcha" :placeholder=captchaValidate size="large"
                          allow-clear>
                    <template #prefix>
                      <SafetyOutlined/>
                    </template>
                  </AInput>
                  <AButton v-if="!state.showCountDown" @click="sendCaptcha" size="large" style="margin-left: 10px">{{
                      t("login.sendCaptcha")
                    }}
                  </AButton>
                  <AButton v-if="state.showCountDown" disabled size="large" style="margin-left: 10px">{{
                      state.countDownTime
                    }}s{{ t("login.reSendCaptcha") }}
                  </AButton>
                </AFlex>
              </AFlex>
            </AFormItem>
            <AFormItem name="password">
              <span class="forget-card-span">{{ t("login.password") }}</span>
              <AInput v-model:value="ResetPasswordForm.password" :placeholder=passwordValidate size="large" allow-clear>
                <template #prefix>
                  <LockOutlined/>
                </template>
              </AInput>
            </AFormItem>
            <AFormItem name="repassword">
              <span class="forget-card-span">{{ t("login.repassword") }}</span>
              <AInput v-model:value="ResetPasswordForm.repassword" :placeholder=repasswordValidate size="large"
                      allow-clear>
                <template #prefix>
                  <LockOutlined/>
                </template>
              </AInput>
            </AFormItem>
            <AFormItem>
              <AButton @click="resetPasswordSubmit" style="width: 100%;" type="primary" size="large">{{
                  t("login.resetPassword")
                }}
              </AButton>
            </AFormItem>
          </AForm>
        </AFlex>
        <ATooltip placement="left">
          <template #title>
            <span>{{ t("login.phoneLogin") }}</span>
          </template>
          <div @click="()=>{
            router.push('/login');
          }" class="forget-right-qrcode"/>
        </ATooltip>
      </ACard>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useI18n} from "vue-i18n";
import BoxDog from "@/components/BoxDog/BoxDog.vue";
import {useRouter} from "vue-router";
import {onMounted, reactive, ref, UnwrapRef} from "vue";
import {ResetPassword} from "@/types/user";
import {Rule} from "ant-design-vue/lib/form";


const router = useRouter();
const {t} = useI18n();
const resetPasswordRef = ref();
const ResetPasswordForm: UnwrapRef<ResetPassword> = reactive({
  phone: '',
  captcha: '',
  password: '',
  repassword: '',
});
// 表单验证提示
const passwordValidate = ref<string>(t('login.passwordValidate'));
const phoneValidate = ref<string>(t('login.phoneValidate'));
const captchaValidate = ref<string>(t('login.captchaValidate'));
const repasswordValidate = ref<string>(t('login.repasswordValidate'));

// 表单验证规则
const rules: Record<string, Rule[]> = {
  password: [
    {
      required: true, message: t('login.passwordValidate'), trigger: 'change'
    },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,18}$/,
      message: t('login.passwordRule'),
    },
  ],
  repassword: [
    {
      required: true, message: t('login.repasswordValidate'), trigger: 'change'
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
  resetPasswordRef.value
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
 * 重置密码表单提交
 */
async function resetPasswordSubmit() {
  resetPasswordRef.value
      .validate()
      .then(() => {
        console.log('values', ResetPasswordForm);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
}
</script>
<style src="./index.scss" scoped>
@import "@/assets/styles/global.scss";
</style>
