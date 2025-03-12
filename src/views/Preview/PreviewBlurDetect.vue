<template>
  <div class="blur-detection-test">
    <a-card class="main-card">
      <template #title>
        <div class="card-title">
          <experiment-outlined />
          <span>图像模糊检测</span>
        </div>
      </template>

      <a-row :gutter="[16, 16]">
        <a-col :span="24">
          <a-alert type="info" show-icon>
            <template #message>上传图片进行模糊度检测，系统将自动分析图片清晰度</template>
            <template #description>支持JPG、PNG等常见图片格式</template>
          </a-alert>
        </a-col>

        <a-col :span="24">
          <a-form layout="inline" class="threshold-form">
            <a-form-item label="模糊度阈值">
              <a-input-number
                v-model:value="threshold"
                :min="50"
                :max="500"
                style="width: 120px"
                @change="handleThresholdChange"
              />
            </a-form-item>
            <a-form-item>
              <a-tooltip title="值越小越容易被判定为模糊图片">
                <info-circle-outlined />
              </a-tooltip>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>

      <div class="upload-container">
        <a-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :before-upload="beforeUpload"
          @preview="handlePreview"
          @remove="handleRemove"
        >
          <div v-if="fileList.length < 5">
            <plus-outlined />
            <div style="margin-top: 8px">上传图片</div>
          </div>
        </a-upload>
        <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
          <img alt="预览图片" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>

      <div v-if="detectionResults.length > 0" class="results-container">
        <a-divider>检测结果</a-divider>
        <a-table :dataSource="detectionResults" :columns="columns" :pagination="false" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="record.isBlurry ? 'red' : 'green'">
                {{ record.isBlurry ? '模糊' : '清晰' }}
              </a-tag>
            </template>
            <template v-if="column.key === 'performance'">
              <a-statistic
                :value="record.processTime"
                :precision="2"
                suffix="ms"
                :value-style="{ fontSize: '14px', color: record.processTime > 200 ? '#cf1322' : '#3f8600' }"
              />
            </template>
            <template v-if="column.key === 'blurValue'">
              <a-progress
                :percent="Math.min(100, Math.round(record.blurValue / 5))"
                :stroke-color="record.isBlurry ? '#ff4d4f' : '#52c41a'"
                size="small"
              />
              <div>{{ record.blurValue }}</div>
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlusOutlined, ExperimentOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadProps } from 'ant-design-vue';
import { initBlurDetect, detectBlurFromFile } from '@/utils/imageBlurDetect/blurDetect';

// 初始化模糊检测模块
onMounted(async () => {
  try {
    await initBlurDetect();
    message.success('模糊检测模块初始化成功');
  } catch (error) {
    message.error('模糊检测模块初始化失败');
    console.error(error);
  }
});

// 文件列表
const fileList = ref<any[]>([]);

// 预览相关状态
const previewVisible = ref<boolean>(false);
const previewImage = ref<string>('');
const previewTitle = ref<string>('');

// 阈值设置
const threshold = ref<number>(200); // 默认阈值

// 检测结果
interface DetectionResult {
  key: string;
  fileName: string;
  blurValue: number;
  isBlurry: boolean;
  threshold: number;
  processTime: number; // 处理时间（毫秒）
  fileSize: number; // 文件大小（字节）
}

const detectionResults = ref<DetectionResult[]>([]);

// 表格列定义
const columns = [
  {
    title: '文件名',
    dataIndex: 'fileName',
    key: 'fileName',
    width: '20%',
  },
  {
    title: '模糊度值',
    dataIndex: 'blurValue',
    key: 'blurValue',
    sorter: (a: DetectionResult, b: DetectionResult) => a.blurValue - b.blurValue,
    width: '20%',
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: '15%',
    sorter: (a: DetectionResult, b: DetectionResult) => a.fileSize - b.fileSize,
    customRender: ({ text }: { text: number }) => {
      if (text < 1024) {
        return `${text} B`;
      } else if (text < 1024 * 1024) {
        return `${(text / 1024).toFixed(2)} KB`;
      } else {
        return `${(text / (1024 * 1024)).toFixed(2)} MB`;
      }
    }
  },
  {
    title: '阈值',
    dataIndex: 'threshold',
    key: 'threshold',
    width: '10%',
  },
  {
    title: '状态',
    key: 'status',
    width: '15%',
  },
  {
    title: '处理时间',
    key: 'performance',
    width: '20%',
  }
];

// 处理阈值变化
const handleThresholdChange = (value: number) => {
  threshold.value = value;
  message.info(`阈值已更新为: ${value}`);
};

// 上传前检查文件
const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('只能上传图片文件!');
    return false;
  }

  try {
    message.loading('正在检测图片模糊度...');
    const startTime = performance.now();
    const result = await detectBlurFromFile(file, threshold.value);
    const endTime = performance.now();
    const processTime = endTime - startTime;

    // 添加检测结果
    detectionResults.value.push({
      key: file.uid,
      fileName: file.name,
      blurValue: Math.round(result.blurValue),
      isBlurry: result.isBlurry,
      threshold: threshold.value,
      processTime: Math.round(processTime * 100) / 100,
      fileSize: file.size
    });

    message.success(`检测完成: ${result.isBlurry ? '图片模糊' : '图片清晰'}`);
    return false; // 阻止默认上传行为，我们只是预览和检测
  } catch (error) {
    message.error('模糊检测失败');
    console.error(error);
    return false;
  }
};

// 处理图片预览
const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

// 关闭预览
const handleCancel = () => {
  previewVisible.value = false;
};

// 将文件转换为Base64
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// 处理图片删除
const handleRemove = (file: any) => {
  // 从检测结果中删除对应项
  const index = detectionResults.value.findIndex(item => item.key === file.uid);
  if (index !== -1) {
    detectionResults.value.splice(index, 1);
    message.success('已删除图片及其检测结果');
  }
  return true; // 允许删除操作继续
};
</script>

<style scoped lang="scss">
.blur-detection-test {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;

  .main-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    color: var(--primary-color);
  }

  .threshold-form {
    margin: 16px 0;
  }

  .upload-container {
    margin: 20px 0;
    background-color: #fafafa;
    padding: 20px;
    border-radius: 4px;
    border: 1px dashed #d9d9d9;
  }

  .results-container {
    margin-top: 30px;

    h2 {
      margin-bottom: 15px;
    }
  }
}
</style>
