<template>
  <div class="account-setting-info">
    <div class="account-setting-info-header">
      <span>我的信息</span>
    </div>
    <div class="account-setting-info-body">
      <div class="layout-container">
        <AForm :model="formState" layout="vertical" class="form-container">
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <div class="form-grid">
            <AFormItem label="用户名" name="username" class="form-item">
              <AInput v-model:value="formState.username" placeholder="请输入用户名" :clearable="true" class="custom-input">
                <template #prefix>
                  <UserOutlined class="input-icon"/>
                </template>
              </AInput>
            </AFormItem>
            <AFormItem label="昵称" name="nickname" class="form-item">
              <AInput v-model:value="formState.nickname" placeholder="请输入昵称" class="custom-input">
                <template #prefix>
                  <SmileOutlined class="input-icon"/>
                </template>
              </AInput>
            </AFormItem>
            <AFormItem label="邮箱" name="email" class="form-item">
              <AInput v-model:value="formState.email" placeholder="请输入邮箱" class="custom-input">
                <template #prefix>
                  <MailOutlined class="input-icon"/>
                </template>
              </AInput>
            </AFormItem>
            <AFormItem label="电话" name="phone" class="form-item">
              <AInput v-model:value="formState.phone" placeholder="请输入电话" class="custom-input">
                <template #prefix>
                  <PhoneOutlined class="input-icon"/>
                </template>
              </AInput>
            </AFormItem>
            <AFormItem label="性别" name="gender" class="form-item">
              <ASelect v-model:value="formState.gender" placeholder="请选择性别" class="custom-select">
                <template #prefix>
                  <ManOutlined class="input-icon"/>
                </template>
                <ASelectOption :value="0">未知</ASelectOption>
                <ASelectOption :value="1">男</ASelectOption>
                <ASelectOption :value="2">女</ASelectOption>
              </ASelect>
            </AFormItem>
          </div>
        </div>
        <div class="form-section">
          <div class="section-title">详细信息</div>
          <AFormItem label="介绍" name="introduce" class="form-item full-width">
            <ATextarea v-model:value="formState.introduce" placeholder="请输入个人介绍" :rows="4" class="custom-textarea">
              <template #prefix>
                <EditOutlined class="input-icon"/>
              </template>
            </ATextarea>
          </AFormItem>
          <div class="form-grid">
            <AFormItem label="博客" name="blog" class="form-item">
              <AInput v-model:value="formState.blog" placeholder="请输入博客地址" class="custom-input">
                <template #prefix>
                  <GlobalOutlined class="input-icon"/>
                </template>
              </AInput>
            </AFormItem>
            <AFormItem label="地址" name="location" class="form-item">
              <AInput v-model:value="formState.location" placeholder="请输入地址" class="custom-input">
                <template #prefix>
                  <EnvironmentOutlined class="input-icon"/>
                </template>
              </AInput>
            </AFormItem>
            <AFormItem label="公司" name="company" class="form-item">
              <AInput v-model:value="formState.company" placeholder="请输入公司" class="custom-input">
                <template #prefix>
                  <BankOutlined class="input-icon"/>
                </template>
              </AInput>
            </AFormItem>
          </div>
        </div>
        <AFormItem :wrapper-col="{ span: 24 }">
          <div class="form-actions">
            <AButton class="cancel-btn" @click="handleCancel">取消</AButton>
            <AButton type="primary" class="submit-btn" @click="handleSubmit">保存</AButton>
          </div>
        </AFormItem>
      </AForm>
      <div class="info-sidebar">
        <div class="sidebar-section">
          <div class="sidebar-title">个人资料完整度</div>
          <div class="profile-completion">
            <div class="completion-bar">
              <div class="completion-progress" style="width: 65%"></div>
            </div>
            <div class="completion-text">65% 已完成</div>
          </div>
          <div class="completion-tips">
            <div class="tip-item">
              <CheckCircleOutlined class="tip-icon complete" />
              <span>基本信息已填写</span>
            </div>
            <div class="tip-item">
              <CloseCircleOutlined class="tip-icon incomplete" />
              <span>请完善个人介绍</span>
            </div>
            <div class="tip-item">
              <CloseCircleOutlined class="tip-icon incomplete" />
              <span>请添加联系方式</span>
            </div>
          </div>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-title">填写说明</div>
          <div class="sidebar-tips">
            <div class="tip-item">
              <InfoCircleOutlined class="tip-icon" />
              <span>用户名一旦设置不可更改</span>
            </div>
            <div class="tip-item">
              <InfoCircleOutlined class="tip-icon" />
              <span>邮箱用于接收重要通知</span>
            </div>
            <div class="tip-item">
              <InfoCircleOutlined class="tip-icon" />
              <span>个人介绍将展示在您的个人主页</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue';

import { useAuthStore } from '@/store/modules/userStore';
import { message } from 'ant-design-vue';

const authStore = useAuthStore();
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

// 初始化表单数据
onMounted(() => {
  // 从用户存储中获取数据
  if (authStore.user) {
    formState.username = authStore.user.username || '';
    formState.nickname = authStore.user.nickname || '';
    // 假设其他字段也可以从用户存储中获取
    // 如果不能，这里只是示例
  }
});

const handleSubmit = () => {
  // 提交表单逻辑
  console.log('表单数据：', formState);
  message.success('个人信息保存成功！');
};

const handleCancel = () => {
  // 取消操作，可以重置表单或返回上一页
  console.log('取消操作');
};
</script>

<style scoped lang="scss">
.account-setting-info {
  width: calc(100% - 72px);
  background-color: var(--white-color);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  }

  .account-setting-info-header {
    padding: 0 36px;
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eaeaea;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9f2ff 100%);
    border-radius: 16px 16px 0 0;
    //position: sticky;
    //top: 0;
    //z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    span {
      font-size: 22px;
      font-weight: 600;
      color: #222222;
      position: relative;
      padding-left: 16px;
      letter-spacing: 0.5px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 5px;
        height: 24px;
        background: linear-gradient(to bottom, #1890ff, #36cfc9);
        border-radius: 3px;
      }
    }
  }

  .account-setting-info-body {
    padding: 36px;
    width: 100%;
    background-color: var(--white-color);
    border-radius: 0 0 16px 16px;

    .layout-container {
      display: flex;
      gap: 30px;
    }

    .form-container {
      flex: 1;
      max-width: 650px;
    }

    .form-section {
      background-color: #fafafa;
      border-radius: 12px;
      padding: 24px 28px;
      margin-bottom: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transform: translateY(-3px);
      }

      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px dashed #e8e8e8;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 40px;
          height: 3px;
          background: linear-gradient(to right, #1890ff, #36cfc9);
          border-radius: 3px;
        }
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }

      .form-item {
        margin-bottom: 20px;
        transition: all 0.3s ease;

        &.full-width {
          grid-column: 1 / -1;
        }

        &:hover {
          transform: translateY(-2px);
        }

        .ant-form-item-label > label {
          font-weight: 500;
          color: #444;
          font-size: 15px;
        }

        .custom-input,
        .custom-select,
        .custom-textarea {
          border-radius: 10px;
          border: 1px solid #e0e0e0;
          transition: all 0.3s;
          background-color: #fff;

          &:hover {
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.08);
          }

          &:focus {
            border-color: #1890ff;
            box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.12);
          }
        }

        .ant-input-affix-wrapper {
          padding: 0 14px;
          height: 44px;

          .ant-input {
            padding: 8px 0;
            border: none;
            box-shadow: none;

            &:hover, &:focus {
              border: none;
              box-shadow: none;
            }
          }
        }

        .ant-select-selector {
          height: 44px;
          display: flex;
          align-items: center;
          padding: 0 14px;
        }

        .input-icon {
          margin-right: 10px;
          color: #1890ff;
          font-size: 16px;
          opacity: 0.8;
          transition: all 0.3s;
        }

        &:hover .input-icon {
          opacity: 1;
          transform: scale(1.1);
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-start;
      gap: 16px;
      margin-top: 40px;

      .submit-btn, .cancel-btn {
        min-width: 140px;
        height: 46px;
        border-radius: 10px;
        font-weight: 500;
        font-size: 16px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          transform: translateY(-3px);
        }
      }

      .submit-btn {
        background: linear-gradient(to right, #1890ff, #36cfc9);
        border: none;
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);

        &:hover {
          box-shadow: 0 6px 16px rgba(24, 144, 255, 0.3);
        }
      }

      .cancel-btn {
        background: #f5f5f5;
        color: #666;
        border: 1px solid #e0e0e0;

        &:hover {
          background: #f0f0f0;
          color: #333;
          border-color: #d0d0d0;
        }
      }
    }
  }
}

:deep(.ant-divider) {
  margin: 32px 0;
  opacity: 0.6;
}

.info-sidebar {
  width: 300px;
  flex-shrink: 0;

  .sidebar-section {
    background-color: #fafafa;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .sidebar-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
      position: relative;
      padding-left: 12px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background: linear-gradient(to bottom, #1890ff, #36cfc9);
        border-radius: 2px;
      }
    }

    .profile-completion {
      margin-bottom: 16px;

      .completion-bar {
        height: 8px;
        background-color: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;

        .completion-progress {
          height: 100%;
          background: linear-gradient(to right, #1890ff, #36cfc9);
          border-radius: 4px;
        }
      }

      .completion-text {
        font-size: 14px;
        color: #1890ff;
        font-weight: 500;
        text-align: right;
      }
    }

    .completion-tips, .sidebar-tips {
      .tip-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-size: 14px;

        .tip-icon {
          margin-right: 8px;
          font-size: 16px;

          &.complete {
            color: #52c41a;
          }

          &.incomplete {
            color: #ff4d4f;
          }
        }

        span {
          color: #666;
        }
      }
    }

    .sidebar-tips {
      .tip-item {
        .tip-icon {
          color: #1890ff;
        }
      }
    }
  }
}
</style>
