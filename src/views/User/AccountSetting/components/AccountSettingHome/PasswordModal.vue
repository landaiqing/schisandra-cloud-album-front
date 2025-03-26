<template>
  <div>
    <!-- 设置密码模态窗口 -->
    <AModal
      :open="userStore.passwordModalState.setPasswordVisible"
      title="设置密码"
      :width="400"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <AForm
        :model="formState"
        name="setPasswordForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="handleSetPassword"
      >
        <AFormItem
          label="新密码"
          name="password"
          :rules="[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码长度不能少于6个字符' }]"
        >
          <AInputPassword v-model:value="formState.password" placeholder="请输入新密码" />
        </AFormItem>

        <AFormItem
          label="确认密码"
          name="confirmPassword"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword }
          ]"
        >
          <AInputPassword v-model:value="formState.confirmPassword" placeholder="请确认密码" />
        </AFormItem>
      </AForm>

      <template #footer>
        <AButton key="back" @click="handleCancel">取消</AButton>
        <AButton key="submit" type="primary" :loading="submitLoading" @click="handleSubmit" html-type="submit">确定</AButton>
      </template>
    </AModal>

    <!-- 修改密码模态窗口 -->
    <AModal
      :open="userStore.passwordModalState.updatePasswordVisible"
      title="修改密码"
      :width="400"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <AForm
        :model="formState"
        name="updatePasswordForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="handleUpdatePassword"
      >
        <AFormItem
          label="当前密码"
          name="oldPassword"
          :rules="[{ required: true, message: '请输入当前密码' }]"
        >
          <AInputPassword v-model:value="formState.oldPassword" placeholder="请输入当前密码" />
        </AFormItem>

        <AFormItem
          label="新密码"
          name="password"
          :rules="[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码长度不能少于6个字符' }]"
        >
          <AInputPassword v-model:value="formState.password" placeholder="请输入新密码" />
        </AFormItem>

        <AFormItem
          label="确认密码"
          name="confirmPassword"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword }
          ]"
        >
          <AInputPassword v-model:value="formState.confirmPassword" placeholder="请确认密码" />
        </AFormItem>
      </AForm>

      <template #footer>
        <AButton key="back" @click="handleCancel">取消</AButton>
        <AButton key="submit" type="primary" :loading="submitLoading" @click="handleSubmit" html-type="submit">确定</AButton>
      </template>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import useStore from "@/store";

const emit = defineEmits(['success']);

// 获取用户store
const userStore = useStore().user;

// 表单状态
const formState = reactive({
  oldPassword: '',
  password: '',
  confirmPassword: ''
});

// 加载状态
const submitLoading = ref(false);

// 监听store中的状态变化并重置表单
watch(() => userStore.passwordModalState.setPasswordVisible, (val) => {
  if (!val) resetForm();
});

watch(() => userStore.passwordModalState.updatePasswordVisible, (val) => {
  if (!val) resetForm();
});

// 重置表单
const resetForm = () => {
  formState.oldPassword = '';
  formState.password = '';
  formState.confirmPassword = '';
};

// 验证确认密码
const validateConfirmPassword = async (_rule: any, value: string) => {
  if (value !== formState.password) {
    return Promise.reject('两次输入的密码不一致');
  }
  return Promise.resolve();
};

// 取消操作
const handleCancel = () => {
  userStore.closeAllPasswordModals();
  resetForm();
};

// 提交表单
const handleSubmit = () => {
  // 根据当前打开的模态窗口类型调用相应的处理函数
  if (userStore.passwordModalState.setPasswordVisible) {
    handleSetPassword();
  } else if (userStore.passwordModalState.updatePasswordVisible) {
    handleUpdatePassword();
  }
};

// 设置密码
const handleSetPassword = async () => {
  if (!formState.password || !formState.confirmPassword) {
    message.error('请填写完整信息');
    return;
  }

  try {
    submitLoading.value = true;
    // 这里需要实现设置密码的API调用，暂时模拟成功
    setTimeout(() => {
      message.success('密码设置成功');
      emit('success', 'set_password');
      handleCancel();
      submitLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error('设置密码失败:', error);
    message.error('密码设置失败，请稍后重试');
    submitLoading.value = false;
  }
};

// 修改密码
const handleUpdatePassword = async () => {
  if (!formState.oldPassword || !formState.password || !formState.confirmPassword) {
    message.error('请填写完整信息');
    return;
  }

  try {
    submitLoading.value = true;
    // 这里需要实现修改密码的API调用，暂时模拟成功
    setTimeout(() => {
      message.success('密码修改成功');
      emit('success', 'update_password');
      handleCancel();
      submitLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error('修改密码失败:', error);
    message.error('密码修改失败，请稍后重试');
    submitLoading.value = false;
  }
};
</script>