<template>
  <div class="ocr-detection">
    <a-card class="main-card">
      <template #title>
        <div class="card-title">
          <scan-outlined/>
          <span>OCR文字识别</span>
        </div>
      </template>

      <a-row :gutter="[16, 16]">
        <a-col :span="24">
          <a-alert type="info" show-icon>
            <template #message>上传图片进行OCR文字识别</template>
            <template #description>支持JPG、PNG等常见图片格式，将自动识别图片中的文字内容</template>
          </a-alert>
        </a-col>
      </a-row>

      <div class="upload-container">
        <a-upload
            v-model:file-list="fileList"
            list-type="picture-card"
            :before-upload="beforeUpload"
            :multiple="false"
            @remove="handleRemove"
        >
          <div v-if="!fileList.length">
            <plus-outlined/>
            <div style="margin-top: 8px">上传图片</div>
          </div>
        </a-upload>
      </div>

      <div class="preview-container" v-if="imageUrl">
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <div class="canvas-wrapper">
              <canvas ref="canvasRef" style="max-width: 100%; height: auto;"></canvas>
            </div>
          </a-col>
          <a-col :span="12">
            <a-card title="识别结果" :bordered="false">
              <template #extra>
                <a-button type="primary" :loading="recognizing" @click="handleRecognize">
                  {{ recognizing ? '识别中...' : '开始识别' }}
                </a-button>
              </template>
              <div class="result-content">
                <a-empty v-if="!recognizedText" description="暂无识别结果"/>
                <div v-else class="text-result">
                  <p>{{ recognizedText }}</p>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {PlusOutlined, ScanOutlined} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';
import type {UploadProps} from 'ant-design-vue';
import * as ocr from '@paddlejs-models/ocr';

// 状态变量
const fileList = ref<any[]>([]);
const imageUrl = ref<string>('');
const recognizing = ref<boolean>(false);
const recognizedText = ref<string>('');
const canvasRef = ref<HTMLCanvasElement | null>(null);

// 初始化OCR模型
onMounted(async () => {
  try {
    // '/tfjs/ocr/ch_PP-OCRv2_det_fuse_activation/model.json', '/tfjs/ocr/ch_PP-OCRv2_rec_fuse_activation/model.json'
    await ocr.init();
    message.success('OCR模型初始化成功');
  } catch (error) {
    message.error('OCR模型初始化失败');
    console.error(error);
  }
});

// 上传前检查文件
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('只能上传图片文件!');
    return false;
  }

  // 创建图片URL
  imageUrl.value = URL.createObjectURL(file);
  return false; // 阻止自动上传
};

// 处理文件移除
const handleRemove = () => {
  imageUrl.value = '';
  recognizedText.value = '';
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d');
    ctx?.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
  return true;
};

// 执行OCR识别
const handleRecognize = async () => {
  if (!imageUrl.value) {
    message.warning('请先上传图片');
    return;
  }

  recognizing.value = true;
  try {
    const img = new Image();
    img.src = imageUrl.value;
    await new Promise((resolve) => (img.onload = resolve));

    // 设置canvas尺寸
    if (canvasRef.value) {
      canvasRef.value.width = img.width;
      canvasRef.value.height = img.height;
      const ctx = canvasRef.value.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      // 执行OCR识别
      const result = await ocr.recognize(img, {
        canvas: canvasRef.value,
        style: {
          strokeStyle: '#FF4D4F',
          lineWidth: 2,
          fillStyle: 'rgba(255, 77, 79, 0.1)'
        }
      });

      recognizedText.value = result.text;
      message.success('识别完成');
    }
  } catch (error) {
    console.error(error);
    message.error('识别失败，请重试');
  } finally {
    recognizing.value = false;
  }
};
</script>

<style scoped lang="scss">
.ocr-detection {
  padding: 20px;
  max-width: 1200px;
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

  .upload-container {
    margin: 20px 0;
    background-color: #fafafa;
    padding: 20px;
    border-radius: 4px;
    border: 1px dashed #d9d9d9;
  }

  .preview-container {
    margin-top: 20px;
  }

  .canvas-wrapper {
    background-color: #fafafa;
    padding: 16px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
  }

  .result-content {
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
  }

  .text-result {
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
