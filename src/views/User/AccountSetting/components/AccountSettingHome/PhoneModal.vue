<template>
  <div>
    <!-- 绑定手机模态窗口 -->
    <AModal
      :open="userStore.phoneModalState.bindPhoneVisible"
      title="绑定手机"
      :width="400"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <AForm
        :model="formState"
        name="bindPhoneForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="handleBindPhone"
      >
        <AFormItem
          label="手机号码"
          name="phone"
          :rules="[{ required: true, message: '请输入手机号码' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }]"
        >
          <AInput v-model:value="formState.phone" placeholder="请输入手机号码" />
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

    <!-- 修改手机模态窗口 -->
    <AModal
      :open="userStore.phoneModalState.updatePhoneVisible"
      title="修改手机"
      :width="400"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <AForm
        :model="formState"
        name="updatePhoneForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="handleUpdatePhone"
      >
        <AFormItem label="当前手机">
          <AInput :value="userStore.user.phone" disabled />
        </AFormItem>

        <AFormItem
          label="新手机号码"
          name="phone"
          :rules="[{ required: true, message: '请输入新手机号码' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }]"
        >
          <AInput v-model:value="formState.phone" placeholder="请输入新手机号码" />
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

    <!-- 解绑手机确认模态窗口 -->
    <AModal
      :open="userStore.phoneModalState.unbindPhoneVisible"
      title="解绑手机"
      :width="400"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <p>确定要解绑当前手机吗？解绑后将无法使用手机号登录。</p>
      <p style="color: #ff4d4f; margin-top: 10px;">当前手机: {{ currentPhone }}</p>

      <template #footer>
        <AButton key="back" @click="handleCancel">取消</AButton>
        <AButton key="submit" danger :loading="submitLoading" @click="handleUnbindPhone">确定解绑</AButton>
      </template>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { sendMessage } from '@/api/user';
import useStore from "@/store";

const emit = defineEmits(['success']);

// 获取用户store
const userStore = useStore().user;

// 表单状态
const formState = reactive({
  phone: '',
  captcha: ''
});

// 加载状态
const captchaLoading = ref(false);
const submitLoading = ref(false);
const captchaCountdown = ref(0);

// 监听store中的状态变化并重置表单
watch(() => userStore.phoneModalState.bindPhoneVisible, (val) => {
  if (!val) resetForm();
});

watch(() => userStore.phoneModalState.updatePhoneVisible, (val) => {
  if (!val) resetForm();
});

// 重置表单
const resetForm = () => {
  formState.phone = '';
  formState.captcha = '';
};

// 取消操作
const handleCancel = () => {
  userStore.closeAllPhoneModals();
  resetForm();
};

// 发送验证码
const handleSendCaptcha = async () => {
  // 验证手机号格式
  if (!formState.phone) {
    message.error('请输入手机号码');
    return;
  }

  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(formState.phone)) {
    message.error('请输入有效的手机号码');
    return;
  }

  try {
    captchaLoading.value = true;
    // 这里需要实现获取图形验证码的逻辑，暂时模拟
    const params = {
      phone: formState.phone,
      angle: 0,
      key: ''
    };
    const res: any = await sendMessage(params);
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
  if (userStore.phoneModalState.bindPhoneVisible) {
    handleBindPhone();
  } else if (userStore.phoneModalState.updatePhoneVisible) {
    handleUpdatePhone();
  }
};

// 绑定手机
const handleBindPhone = async () => {
  if (!formState.phone || !formState.captcha) {
    message.error('请填写完整信息');
    return;
  }

  try {
    submitLoading.value = true;
    // 这里需要实现绑定手机的API调用，暂时模拟成功
    setTimeout(() => {
      message.success('手机绑定成功');
      emit('success', 'bind_phone');
      handleCancel();
      submitLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error('绑定手机失败:', error);
    message.error('手机绑定失败，请稍后重试');
    submitLoading.value = false;
  }
};

// 更新手机
const handleUpdatePhone = async () => {
  if (!formState.phone || !formState.captcha) {
    message.error('请填写完整信息');
    return;
  }

  try {
    submitLoading.value = true;
    // 这里需要实现更新手机的API调用，暂时模拟成功
    setTimeout(() => {
      message.success('手机修改成功');
      emit('success', 'update_phone');
      handleCancel();
      submitLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error('修改手机失败:', error);
    message.error('手机修改失败，请稍后重试');
    submitLoading.value = false;
  }
};

// 解绑手机
const handleUnbindPhone = async () => {
  // 移除解绑手机功能，保留函数但不执行任何操作
  handleCancel();
};
</script>
