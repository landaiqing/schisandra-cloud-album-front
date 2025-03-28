<template>
  <div class="basic-settings">
    <a-card title="基础设置" :bordered="false">
      <a-form
          :model="settingsForm"
          :rules="settingsRules"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }"
          ref="settingsFormRef"
      >
        <a-form-item label="系统名称" name="systemName">
          <a-input v-model:value="settingsForm.systemName" placeholder="请输入系统名称"/>
        </a-form-item>

        <a-form-item label="系统Logo" name="logoUrl">
          <div class="logo-upload-wrapper">
            <div class="logo-preview" v-if="settingsForm.logoUrl">
              <img :src="settingsForm.logoUrl" alt="系统Logo"/>
              <a-button type="link" danger @click="removeLogo">移除</a-button>
            </div>
            <a-upload
                v-if="!settingsForm.logoUrl"
                name="logo"
                list-type="picture-card"
                :show-upload-list="false"
                :before-upload="beforeLogoUpload"
                @change="handleLogoChange"
            >
              <div>
                <div style="margin-top: 8px">上传Logo</div>
              </div>
            </a-upload>
          </div>
          <div class="upload-hint">建议尺寸: 200px * 60px，格式: PNG, JPG, SVG</div>
        </a-form-item>

        <a-form-item label="系统主题" name="theme">
          <a-radio-group v-model:value="settingsForm.theme">
            <a-radio value="light">浅色主题</a-radio>
            <a-radio value="dark">深色主题</a-radio>
            <a-radio value="auto">跟随系统</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="主题色" name="primaryColor">
          <div class="color-picker-wrapper">
            <div
                v-for="color in predefinedColors"
                :key="color"
                class="color-block"
                :style="{ backgroundColor: color }"
                :class="{ active: settingsForm.primaryColor === color }"
                @click="settingsForm.primaryColor = color"
            ></div>
          </div>
        </a-form-item>

        <a-form-item label="页面布局" name="layout">
          <a-radio-group v-model:value="settingsForm.layout">
            <a-radio value="side">侧边菜单</a-radio>
            <a-radio value="top">顶部菜单</a-radio>
            <a-radio value="mix">混合菜单</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="系统语言" name="language">
          <a-select v-model:value="settingsForm.language" placeholder="请选择系统语言">
            <a-select-option value="zh-CN">简体中文</a-select-option>
            <a-select-option value="en-US">English</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="版权信息" name="copyright">
          <a-input v-model:value="settingsForm.copyright" placeholder="请输入版权信息"/>
        </a-form-item>

        <a-form-item label="备案信息" name="icp">
          <a-input v-model:value="settingsForm.icp" placeholder="请输入备案信息"/>
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
import {ref, reactive, onMounted} from 'vue';
import {message} from 'ant-design-vue';

// 预定义的主题色
const predefinedColors = [
  '#1890ff', // 蓝色
  '#52c41a', // 绿色
  '#faad14', // 黄色
  '#f5222d', // 红色
  '#722ed1', // 紫色
  '#13c2c2', // 青色
  '#eb2f96', // 粉色
  '#fadb14', // 亮黄色
];

// 表单引用
const settingsFormRef = ref();

// 表单数据
const settingsForm = reactive({
  systemName: '云相册管理系统',
  logoUrl: '',
  theme: 'light',
  primaryColor: '#1890ff',
  layout: 'side',
  language: 'zh-CN',
  copyright: '© 2023 云相册管理系统',
  icp: '粤ICP备XXXXXXXX号',
});

// 表单验证规则
const settingsRules = {
  systemName: [
    {required: true, message: '请输入系统名称', trigger: 'blur'},
    {max: 50, message: '系统名称不能超过50个字符', trigger: 'blur'},
  ],
  copyright: [
    {max: 100, message: '版权信息不能超过100个字符', trigger: 'blur'},
  ],
  icp: [
    {max: 50, message: '备案信息不能超过50个字符', trigger: 'blur'},
  ],
};

// 加载状态
const loading = ref(false);

// 上传Logo前的校验
const beforeLogoUpload = (file: File) => {
  const isJpgOrPngOrSvg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml';
  if (!isJpgOrPngOrSvg) {
    message.error('只能上传JPG/PNG/SVG格式的图片！');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过2MB！');
  }
  return isJpgOrPngOrSvg && isLt2M;
};

// 处理Logo上传变化
const handleLogoChange = (info: any) => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // 这里应该是实际的API响应处理
    // 模拟上传成功后获取URL
    getBase64(info.file.originFileObj, (url: string) => {
      loading.value = false;
      settingsForm.logoUrl = url;
    });
  }
};

// 移除Logo
const removeLogo = () => {
  settingsForm.logoUrl = '';
};

// 将文件转换为Base64
const getBase64 = (img: File, callback: () => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

// 保存设置
const handleSaveSettings = () => {
  settingsFormRef.value.validate().then(() => {
    loading.value = true;
    // 这里应该是实际的API调用
    setTimeout(() => {
      message.success('设置保存成功');
      loading.value = false;
    }, 500);
  }).catch(() => {
    // 表单验证失败
  });
};

// 重置设置
const resetSettings = () => {
  settingsFormRef.value.resetFields();
};

// 初始化
onMounted(() => {
  // 这里应该是获取当前系统设置的API调用
  loading.value = true;
  setTimeout(() => {
    // 模拟API响应，实际应用中应该使用真实数据
    loading.value = false;
  }, 500);
});
</script>

<style scoped lang="scss">
.basic-settings {
  .logo-upload-wrapper {
    display: flex;
    align-items: center;

    .logo-preview {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        max-width: 200px;
        max-height: 60px;
        margin-bottom: 8px;
      }
    }
  }

  .upload-hint {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    margin-top: 8px;
  }

  .color-picker-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .color-block {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      border: 2px solid transparent;

      &.active {
        border-color: #000;
        transform: scale(1.1);
      }

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
