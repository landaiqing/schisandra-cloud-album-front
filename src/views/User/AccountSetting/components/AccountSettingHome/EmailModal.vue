<template>
  <div>
    <!-- 绑定邮箱模态窗口 -->
    <AModal
      :open="userStore.emailModalState.bindEmailVisible"
      title="绑定邮箱"
      :width="400"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <AForm
        :model="formState"
        name="bindEmailForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="handleBindEmail"
      >
        <AFormItem
          label="邮箱地址"
          name="email"
          :rules="[{ required: true, message: '请输入邮箱地址' }, { type: 'email', message: '请输入有效的邮箱地址' }]"
        >
          <AInput v-model:value="formState.email" placeholder="请输入邮箱地址" />
        </AFormItem>

        <AFormItem label="验证码" name="captcha" :rules="[{ required: true, message: '请输入验证码' }]">
          <div style="display: flex; gap: 8px;">
            <AInput v-model:value="formState.captcha" placeholder="请输入验证码" style="width: 70%" />
            <AButton
              type="primary"
              :disabled="captchaLoading || captchaCountdown > 0"
              :loading="captchaLoading"
              @click="handleSendCaptcha"
              style="width: 30%"
            >
              {{ captchaCountdown > 0 ? `${captchaCountdown}s` : '获取验证码' }}
            </AButton>
          </div>
        </AFormItem>
      </AForm>

      <template #footer>
        <AButton key="back" @click="handleCancel">取消</AButton>
        <AButton key="submit" type="primary" :loading="submitLoading" @click="handleSubmit" html-type="submit">确定</AButton>
      </template>
    </AModal>

    <!-- 修改邮箱模态窗口 -->
    <AModal
      :open="userStore.emailModalState.updateEmailVisible"
      title="修改邮箱"
      :width="400"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <AForm
        :model="formState"
        name="updateEmailForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="handleUpdateEmail"
      >
        <AFormItem label="当前邮箱">
          <AInput :value="currentEmail" disabled />
        </AFormItem>

        <AFormItem
          label="新邮箱地址"
          name="email"
          :rules="[{ required: true, message: '请输入新邮箱地址' }, { type: 'email', message: '请输入有效的邮箱地址' }]"
        >
          <AInput v-model:value="formState.email" placeholder="请输入新邮箱地址" />
        </AFormItem>

        <AFormItem label="验证码" name="captcha" :rules="[{ required: true, message: '请输入验证码' }]">
          <div style="display: flex; gap: 8px;">
            <AInput v-model:value="formState.captcha" placeholder="请输入验证码" style="width: 70%" />
            <AButton
              type="primary"
              :disabled="captchaLoading || captchaCountdown > 0"
              :loading="captchaLoading"
              @click="handleSendCaptcha"
              style="width: 30%"
            >
              {{ captchaCountdown > 0 ? `${captchaCountdown}s` : '获取验证码' }}
            </AButton>
          </div>
        </AFormItem>
      </AForm>

      <template #footer>
        <AButton key="back" @click="handleCancel">取消</AButton>
        <AButton key="submit" type="primary" :loading="submitLoading" @click="handleSubmit" html-type="submit">确定</AButton>
      </template>
    </AModal>

    <!-- 解绑邮箱确认模态窗口 -->
    <AModal
      :open="userStore.emailModalState.unbindEmailVisible"
      title="解绑邮箱"
      :width="400"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <p>确定要解绑当前邮箱吗？解绑后将无法使用邮箱登录。</p>
      <p style="color: #ff4d4f; margin-top: 10px;">当前邮箱: {{ currentEmail }}</p>

      <template #footer>
        <AButton key="back" @click="handleCancel">取消</AButton>
        <AButton key="submit" danger :loading="submitLoading" @click="handleUnbindEmail">确定解绑</AButton>
      </template>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { sendEmailCaptchaApi, bindEmailApi, unbindEmailApi, updateEmailApi } from '@/api/user/email';
import useStore from "@/store";

defineProps({
  currentEmail: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['success']);

// 获取用户store
const userStore = useStore().user;

// 表单状态
const formState = reactive({
  email: '',
  captcha: ''
});

// 加载状态
const captchaLoading = ref(false);
const submitLoading = ref(false);
const captchaCountdown = ref(0);

// 监听store中的状态变化并重置表单
watch(() => userStore.emailModalState.bindEmailVisible, (val) => {
  if (!val) resetForm();
});

watch(() => userStore.emailModalState.updateEmailVisible, (val) => {
  if (!val) resetForm();
});

// 重置表单
const resetForm = () => {
  formState.email = '';
  formState.captcha = '';
};

// 取消操作
const handleCancel = () => {
  userStore.closeAllEmailModals();
  resetForm();
};

// 发送验证码
const handleSendCaptcha = async () => {
  // 验证邮箱格式
  if (!formState.email) {
    message.error('请输入邮箱地址');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formState.email)) {
    message.error('请输入有效的邮箱地址');
    return;
  }

  try {
    captchaLoading.value = true;
    const res: any = await sendEmailCaptchaApi(formState.email);
    if (res && res.code === 200) {
      message.success('验证码已发送，请查收');
      // 开始倒计时
      captchaCountdown.value = 60;
      const timer = setInterval(() => {
        captchaCountdown.value--;
        if (captchaCountdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    } else {
      message.error(res?.message || '验证码发送失败');
    }
  } catch (error) {
    console.error('发送验证码失败:', error);
    message.error('验证码发送失败，请稍后重试');
  } finally {
    captchaLoading.value = false;
  }
};

// 提交表单
const handleSubmit = () => {
  // 根据当前打开的模态窗口类型调用相应的处理函数
  if (userStore.emailModalState.bindEmailVisible) {
    handleBindEmail();
  } else if (userStore.emailModalState.updateEmailVisible) {
    handleUpdateEmail();
  }
};

// 绑定邮箱
const handleBindEmail = async () => {
  if (!formState.email || !formState.captcha) {
    message.error('请填写完整信息');
    return;
  }

  try {
    submitLoading.value = true;
    const res: any = await bindEmailApi(formState.email, formState.captcha);
    if (res && res.code === 200) {
      message.success('邮箱绑定成功');
      emit('success', 'bind_email');
      handleCancel();
    } else {
      message.error(res?.message || '邮箱绑定失败');
    }
  } catch (error) {
    console.error('绑定邮箱失败:', error);
    message.error('邮箱绑定失败，请稍后重试');
  } finally {
    submitLoading.value = false;
  }
};

// 更新邮箱
const handleUpdateEmail = async () => {
  if (!formState.email || !formState.captcha) {
    message.error('请填写完整信息');
    return;
  }

  try {
    submitLoading.value = true;
    const res: any = await updateEmailApi(formState.email, formState.captcha);
    if (res && res.code === 200) {
      message.success('邮箱修改成功');
      emit('success', 'update_email');
      handleCancel();
    } else {
      message.error(res?.message || '邮箱修改失败');
    }
  } catch (error) {
    console.error('修改邮箱失败:', error);
    message.error('邮箱修改失败，请稍后重试');
  } finally {
    submitLoading.value = false;
  }
};

// 解绑邮箱
const handleUnbindEmail = async () => {
  try {
    submitLoading.value = true;
    const res: any = await unbindEmailApi();
    if (res && res.code === 200) {
      message.success('邮箱解绑成功');
      emit('success', 'unbind_email');
      handleCancel();
    } else {
      message.error(res?.message || '邮箱解绑失败');
    }
  } catch (error) {
    console.error('解绑邮箱失败:', error);
    message.error('邮箱解绑失败，请稍后重试');
  } finally {
    submitLoading.value = false;
  }
};
</script>
