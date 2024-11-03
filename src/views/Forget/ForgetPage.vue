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
              <AInput v-model:value="ResetPasswordForm.phone" :placeholder=phoneValidate size="large" allow-clear
                      autocomplete="off">
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
                          allow-clear autocomplete="off">
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
              <AInputPassword v-model:value="ResetPasswordForm.password" :placeholder=passwordValidate size="large"
                              allow-clear autocomplete="password">
                <template #prefix>
                  <LockOutlined/>
                </template>
              </AInputPassword>
            </AFormItem>
            <AFormItem name="repassword">
              <span class="forget-card-span">{{ t("login.repassword") }}</span>
              <AInputPassword v-model:value="ResetPasswordForm.repassword" :placeholder=repasswordValidate size="large"
                              allow-clear autocomplete="password">
                <template #prefix>
                  <LockOutlined/>
                </template>
              </AInputPassword>
            </AFormItem>
            <AFormItem>
              <AButton @click="resetPassword" style="width: 100%;" type="primary" size="large">{{
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
    <AModal v-model:open="showRotateCaptcha" :footer="null" :closable="false" width="375" :centered="true"
            :maskClosable="false" :bodyStyle="{padding: 0}">
      <!--    滑动验证码 -->
      <gocaptcha-rotate
          class="gocaptcha-rotate"
          v-if="showRotateCaptcha"
          :data="captchaData"
          :config="{
            title: t('login.rotateCaptchaTitle'),
          }"
          :events="resetPasswordRotateEvent"
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
</template>
<script setup lang="ts">
import {useI18n} from "vue-i18n";
import BoxDog from "@/components/BoxDog/BoxDog.vue";
import {useRouter} from "vue-router";
import {onMounted, reactive, ref, UnwrapRef} from "vue";
import {ResetPassword} from "@/types/user";
import {Rule} from "ant-design-vue/lib/form";
import {getRotatedCaptchaData} from "@/api/captcha";
import {message} from "ant-design-vue";
import {resetPasswordApi, sendMessage} from "@/api/user";
import {useDebounceFn} from "@vueuse/core";

const router = useRouter();
const {t} = useI18n();
const resetPasswordRef = ref();
const captchaData = reactive({angle: 0, image: "", thumb: "", key: ""});
const showRotateCaptcha = ref<boolean>(false);
const resetPasswordRotateEvent = {
  confirm: (angle: number) => {
    checkPhoneLoginCaptcha(angle);
  },
  close: () => {
    showRotateCaptcha.value = false;
  },
  refresh: () => {
    refreshCaptcha();
  },
};
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
/**
 * 表单验证规则
 * @param _rule
 * @param value
 */
const validateRepassword = async (_rule: Rule, value: string) => {
  if (value !== ResetPasswordForm.password) {
    return Promise.reject(t('login.twoPasswordNotSame'));
  } else {
    return Promise.resolve();
  }
};
// 表单验证规则
const rules: Record<string, Rule[]> = {
  password: [
    {
      required: true, message: t('login.passwordValidate'), trigger: 'blur'
    },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,18}$/,
      message: t('login.passwordRule'),
      trigger: 'blur'
    },
  ],
  repassword: [
    {required: true,validator: validateRepassword, trigger: 'blur'}
  ],
  phone: [
    {required: true, message: t('login.phoneValidate'), trigger: 'blur'},
    {pattern: /^1[2-9]\d{9}$/, message: t('login.phoneValidate')}
  ],
  captcha: [
    {
      required: true, message: t('login.captchaValidate'), trigger: 'blur'
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
        getRotateCaptcha().then(() => {
          showRotateCaptcha.value = true;
        });
      })
      .catch((error: any) => {
        console.log('error', error);
      });
}

/**
 * 重置密码表单提交  防抖
 */
const resetPassword = useDebounceFn(resetPasswordSubmit, 1000);

/**
 * 重置密码表单提交
 */
async function resetPasswordSubmit() {
  resetPasswordRef.value
      .validate()
      .then(async () => {
        const res: any = await resetPasswordApi(ResetPasswordForm);
        if (res.code === 200 && res.success) {
          message.success(t('login.resetPasswordSuccess'));
          await router.push('/login');
        } else {
          message.error(t('login.resetPasswordError'));
        }
      })
      .catch((error: any) => {
        console.log('error', error);
      });
}

/**
 * 刷新验证码 防抖
 */
const refreshCaptcha = useDebounceFn(getRotateCaptcha, 3000);

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
 * 发送手机验证码
 */
async function sendMessageByPhone(param: any): Promise<boolean> {
  const res: any = await sendMessage(param);
  if (res.code === 200 && res.success) {
    message.success(t('login.sendCaptchaSuccess'));
    return true;
  } else {
    message.error(res.message);
    return false;
  }
}

/**
 * 验证旋转验证码
 * @param angle
 */
async function checkPhoneLoginCaptcha(angle: number) {
  const param = {
    key: captchaData.key,
    angle: angle,
    phone: ResetPasswordForm.phone,
  };
  const result: boolean = await sendMessageByPhone(param);
  if (result) {
    showRotateCaptcha.value = false;
    countDown();
  }
}
</script>
<style src="./index.scss" lang="scss" scoped>

</style>
