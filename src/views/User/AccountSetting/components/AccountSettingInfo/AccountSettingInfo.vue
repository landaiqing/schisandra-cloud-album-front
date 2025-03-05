<template>
  <div class="account-setting-info">
    <div class="account-setting-info-header">
      <span style="font-size: 20px;font-weight: bold;color: #333333;">我的信息</span>
    </div>
    <div class="account-setting-info-body">
      <AForm :model="formState" layout="vertical">
        <AFormItem label="用户名" name="username">
          <AInput v-model:value="formState.username" placeholder="请输入用户名" :clearable="true">
            <template #prefix>
              <UserOutlined/>
            </template>
          </AInput>
        </AFormItem>
        <AFormItem label="昵称" name="nickname">
          <AInput v-model:value="formState.nickname" placeholder="请输入昵称">
            <template #prefix>
              <SmileOutlined/>
            </template>
          </AInput>
        </AFormItem>
        <AFormItem label="邮箱" name="email">
          <AInput v-model:value="formState.email" placeholder="请输入邮箱">
            <template #prefix>
              <MailOutlined/>
            </template>
          </AInput>
        </AFormItem>
        <AFormItem label="电话" name="phone">
          <AInput v-model:value="formState.phone" placeholder="请输入电话">
            <template #prefix>
              <PhoneOutlined/>
            </template>
          </AInput>
        </AFormItem>
        <AFormItem label="性别" name="gender">
          <ASelect v-model:value="formState.gender" placeholder="请选择性别">
            <template #prefix>
              <ManOutlined/>
            </template>
            <ASelectOption :value="0">未知</ASelectOption>
            <ASelectOption :value="1">男</ASelectOption>
            <ASelectOption :value="2">女</ASelectOption>
          </ASelect>
        </AFormItem>
        <AFormItem label="介绍" name="introduce">
          <ATextarea v-model:value="formState.introduce" placeholder="请输入个人介绍" :rows="4">
            <template #prefix>
              <EditOutlined/>
            </template>
          </ATextarea>
        </AFormItem>
        <AFormItem label="博客" name="blog">
          <AInput v-model:value="formState.blog" placeholder="请输入博客地址">
            <template #prefix>
              <GlobalOutlined/>
            </template>
          </AInput>
        </AFormItem>
        <AFormItem label="地址" name="location">
          <AInput v-model:value="formState.location" placeholder="请输入地址">
            <template #prefix>
              <EnvironmentOutlined/>
            </template>
          </AInput>
        </AFormItem>
        <AFormItem label="公司" name="company">
          <AInput v-model:value="formState.company" placeholder="请输入公司">
            <template #prefix>
              <BankOutlined/>
            </template>
          </AInput>
        </AFormItem>
        <AFormItem :wrapper-col="{ span: 24 }">
          <div class="form-actions">
            <AButton type="primary" @click="handleSubmit">保存</AButton>
          </div>
        </AFormItem>
      </AForm>
    </div>
  </div>
  <ADivider/>
</template>

<script setup lang="ts">
import {
  UserOutlined,
  SmileOutlined,
  MailOutlined,
  PhoneOutlined,
  ManOutlined,
  EditOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  BankOutlined,
} from '@ant-design/icons-vue';

const formState = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  gender: 0,
  introduce: '',
  blog: '',
  location: '',
  company: '',
});

const handleSubmit = () => {
  // 提交表单逻辑
  console.log('表单数据：', formState);
};
</script>

<style scoped lang="scss">
.account-setting-info {
  width: 100%;
  height: 100%;
  overflow: auto;

  .account-setting-info-header {
    padding: 0 24px;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
  }

  .account-setting-info-body {
    padding: 24px;
    width: 100%;
    height: calc(100% - 50px);

    :deep(.ant-form) {
      max-width: 800px;

      .ant-form-item {
        margin-bottom: 16px;

        .ant-input,
        .ant-input-password,
        .ant-select-selector {
          border-radius: 8px;
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 24px;

      .ant-btn {
        width: 120px;
        height: 40px;
        border-radius: 8px;
      }
    }
  }
}
</style>
