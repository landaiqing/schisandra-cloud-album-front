<template>
  <div class="security-settings">
    <a-card title="安全设置" :bordered="false">
      <a-form
        :model="securityForm"
        :rules="securityRules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        ref="securityFormRef"
      >
        <!-- 密码策略设置 -->
        <a-divider orientation="left">密码策略</a-divider>
        
        <a-form-item label="密码最小长度" name="passwordMinLength">
          <a-input-number 
            v-model:value="securityForm.passwordMinLength" 
            :min="6" 
            :max="20" 
            style="width: 100%" 
          />
        </a-form-item>
        
        <a-form-item label="密码复杂度要求" name="passwordComplexity">
          <a-checkbox-group v-model:value="securityForm.passwordComplexity">
            <a-checkbox value="uppercase">必须包含大写字母</a-checkbox>
            <a-checkbox value="lowercase">必须包含小写字母</a-checkbox>
            <a-checkbox value="numbers">必须包含数字</a-checkbox>
            <a-checkbox value="special">必须包含特殊字符</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        
        <a-form-item label="密码过期时间" name="passwordExpireDays">
          <a-input-number 
            v-model:value="securityForm.passwordExpireDays" 
            :min="0" 
            :max="365" 
            style="width: 100%" 
            placeholder="0表示永不过期" 
          />
          <div class="form-item-hint">单位：天，0表示永不过期</div>
        </a-form-item>
        
        <a-form-item label="禁止使用历史密码" name="passwordHistoryCount">
          <a-input-number 
            v-model:value="securityForm.passwordHistoryCount" 
            :min="0" 
            :max="10" 
            style="width: 100%" 
            placeholder="0表示不限制" 
          />
          <div class="form-item-hint">禁止重复使用最近N次使用过的密码，0表示不限制</div>
        </a-form-item>
        
        <!-- 登录安全设置 -->
        <a-divider orientation="left">登录安全</a-divider>
        
        <a-form-item label="登录失败锁定" name="loginLockThreshold">
          <a-input-number 
            v-model:value="securityForm.loginLockThreshold" 
            :min="0" 
            :max="10" 
            style="width: 100%" 
            placeholder="0表示不锁定" 
          />
          <div class="form-item-hint">连续登录失败N次后锁定账号，0表示不锁定</div>
        </a-form-item>
        
        <a-form-item label="锁定时间" name="loginLockDuration">
          <a-input-number 
            v-model:value="securityForm.loginLockDuration" 
            :min="1" 
            :max="1440" 
            style="width: 100%" 
            :disabled="securityForm.loginLockThreshold === 0" 
          />
          <div class="form-item-hint">账号锁定持续时间，单位：分钟</div>
        </a-form-item>
        
        <a-form-item label="会话超时时间" name="sessionTimeout">
          <a-input-number 
            v-model:value="securityForm.sessionTimeout" 
            :min="5" 
            :max="1440" 
            style="width: 100%" 
          />
          <div class="form-item-hint">用户无操作超过此时间后自动退出登录，单位：分钟</div>
        </a-form-item>
        
        <a-form-item label="启用验证码" name="enableCaptcha">
          <a-switch v-model:checked="securityForm.enableCaptcha" />
          <div class="form-item-hint">登录时是否需要输入验证码</div>
        </a-form-item>
        
        <!-- IP访问控制 -->
        <a-divider orientation="left">IP访问控制</a-divider>
        
        <a-form-item label="IP白名单" name="ipWhitelist">
          <a-textarea 
            v-model:value="securityForm.ipWhitelist" 
            placeholder="每行输入一个IP地址或IP段，例如：192.168.1.1或192.168.1.0/24，留空表示不限制" 
            :rows="4" 
          />
          <div class="form-item-hint">只允许列表中的IP地址访问系统，留空表示不限制</div>
        </a-form-item>
        
        <a-form-item label="IP黑名单" name="ipBlacklist">
          <a-textarea 
            v-model:value="securityForm.ipBlacklist" 
            placeholder="每行输入一个IP地址或IP段，例如：192.168.1.1或192.168.1.0/24" 
            :rows="4" 
          />
          <div class="form-item-hint">禁止列表中的IP地址访问系统</div>
        </a-form-item>
        
        <a-form-item :wrapper-col="{ span: 16, offset: 4 }">
          <a-button type="primary" @click="handleSaveSettings">保存设置</a-button>
          <a-button style="margin-left: 10px" @click="resetSettings">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';

// 表单引用
const securityFormRef = ref();

// 表单数据
const securityForm = reactive({
  // 密码策略
  passwordMinLength: 8,
  passwordComplexity: ['lowercase', 'numbers'],
  passwordExpireDays: 90,
  passwordHistoryCount: 3,
  
  // 登录安全
  loginLockThreshold: 5,
  loginLockDuration: 30,
  sessionTimeout: 30,
  enableCaptcha: true,
  
  // IP访问控制
  ipWhitelist: '',
  ipBlacklist: '',
});

// 表单验证规则
const securityRules = {
  passwordMinLength: [
    { required: true, message: '请设置密码最小长度', trigger: 'change' },
  ],
  passwordExpireDays: [
    { required: true, message: '请设置密码过期时间', trigger: 'change' },
  ],
  loginLockThreshold: [
    { required: true, message: '请设置登录失败锁定阈值', trigger: 'change' },
  ],
  sessionTimeout: [
    { required: true, message: '请设置会话超时时间', trigger: 'change' },
  ],
};

// 加载状态
const loading = ref(false);

// 保存设置
const handleSaveSettings = () => {
  securityFormRef.value.validate().then(() => {
    loading.value = true;
    // 这里应该是实际的API调用
    setTimeout(() => {
      message.success('安全设置保存成功');
      loading.value = false;
    }, 500);
  }).catch(() => {
    // 表单验证失败
  });
};

// 重置设置
const resetSettings = () => {
  securityFormRef.value.resetFields();
};

// 初始化
onMounted(() => {
  // 这里应该是获取当前安全设置的API调用
  loading.value = true;
  setTimeout(() => {
    // 模拟API响应，实际应用中应该使用真实数据
    loading.value = false;
  }, 500);
});
</script>

<style scoped lang="scss">
.security-settings {
  .form-item-hint {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    margin-top: 4px;
  }
  
  .ant-divider {
    margin: 16px 0;
    
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>