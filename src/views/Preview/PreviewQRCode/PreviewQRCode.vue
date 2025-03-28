<template>
  <div class="qrcode-detection">
    <a-card class="main-card">
      <template #title>
        <div class="card-title">
          <scan-outlined/>
          <span>二维码识别</span>
          <a-tag color="blue" class="version-tag">增强版</a-tag>
        </div>
      </template>

      <a-row :gutter="[16, 16]">
        <a-col :span="24">
          <a-alert type="info" show-icon>
            <template #message>上传图片进行二维码识别</template>
            <template #description>支持JPG、PNG等常见图片格式，将自动识别图片中的二维码内容</template>
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
              <!-- 图片预览区域 -->
              <div class="image-preview-controls">
                <div class="zoom-controls">
                  <a-button type="text" @click="zoomOut" :disabled="zoomLevel <= 10">
                    <template #icon><minus-outlined /></template>
                  </a-button>
                  <span class="zoom-level">{{ zoomLevel }}%</span>
                  <a-button type="text" @click="zoomIn" :disabled="zoomLevel >= 200">
                    <template #icon><plus-outlined /></template>
                  </a-button>
                </div>
                <a-tooltip title="使用鼠标滚轮缩放图片，按住鼠标拖动移动图片">
                  <info-circle-outlined />
                </a-tooltip>
              </div>
              <div
                class="canvas-container"
                ref="canvasContainerRef"
                @wheel="handleWheel"
                @mousedown="startDrag"
                @mousemove="onDrag"
                @mouseup="stopDrag"
                @mouseleave="stopDrag"
              >
                <canvas ref="canvasRef" :style="`transform: scale(${zoomLevel / 100}) translate(${dragOffset.x}px, ${dragOffset.y}px); transform-origin: top left;`"></canvas>
              </div>
            </div>
          </a-col>
          <a-col :span="12">
            <a-card title="识别结果" :bordered="false" class="result-card">
              <template #extra>
                <a-button type="primary" :loading="recognizing" @click="handleRecognize">
                  {{ recognizing ? '识别中...' : '开始识别' }}
                </a-button>
              </template>
              <div class="result-content">
                <a-empty v-if="!qrCodeResult" description="暂无识别结果"/>
                <div v-else class="qrcode-result">
                  <div class="result-header">
                    <div class="result-stats">
                      <a-tag color="blue">二维码类型: {{ qrCodeType }}</a-tag>
                    </div>
                    <div class="result-actions">
                      <a-button type="link" size="small" @click="copyQRCodeResult">
                        <template #icon><copy-outlined /></template>
                        复制内容
                      </a-button>
                    </div>
                  </div>
                  <div class="result-detail">
                    <a-typography-paragraph>
                      <template v-if="isUrl(qrCodeResult)">
                        <a-alert type="success" show-icon>
                          <template #message>识别到网址</template>
                          <template #description>
                            <a :href="qrCodeResult" target="_blank">{{ qrCodeResult }}</a>
                          </template>
                        </a-alert>
                      </template>
                      <template v-else>
                        <a-alert type="info" show-icon>
                          <template #message>识别到文本内容</template>
                          <template #description>
                            <div class="qrcode-text">{{ qrCodeResult }}</div>
                          </template>
                        </a-alert>
                      </template>
                    </a-typography-paragraph>
                  </div>
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
import {
  PlusOutlined,
  ScanOutlined,
  MinusOutlined,
  CopyOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadProps } from 'ant-design-vue';
import { ready, scan } from 'qr-scanner-wechat';

// 状态变量
const fileList = ref<any[]>([]);
const imageUrl = ref<string>('');
const recognizing = ref<boolean>(false);
const qrCodeResult = ref<string>('');
const qrCodeType = ref<string>('未知');
const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainerRef = ref<HTMLDivElement | null>(null);
const zoomLevel = ref<number>(100); // 默认缩放级别为100%

// 拖动相关状态
const isDragging = ref<boolean>(false);
const dragOffset = ref<{x: number, y: number}>({x: 0, y: 0});
const dragStart = ref<{x: number, y: number}>({x: 0, y: 0});

// 初始化二维码扫描模块
onMounted(async () => {
  try {
    await ready();
    message.success('二维码识别模块初始化成功');
  } catch (error) {
    message.error('二维码识别模块初始化失败');
    console.error(error);
  }
});

// 判断是否为URL
const isUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

// 复制二维码结果
const copyQRCodeResult = () => {
  if (qrCodeResult.value) {
    navigator.clipboard.writeText(qrCodeResult.value)
      .then(() => {
        message.success('复制成功');
      })
      .catch(() => {
        message.error('复制失败');
      });
  }
};

// 图片上传前的处理
const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('只能上传图片文件!');
    return false;
  }

  // 清除之前的结果
  qrCodeResult.value = '';
  qrCodeType.value = '未知';

  // 创建图片URL
  imageUrl.value = URL.createObjectURL(file);

  // 在Canvas上绘制图片
  const img = new Image();
  img.onload = () => {
    if (canvasRef.value) {
      const canvas = canvasRef.value;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);
      }
    }
  };
  img.src = imageUrl.value;

  return false; // 阻止默认上传行为
};

// 移除图片
const handleRemove = () => {
  imageUrl.value = '';
  qrCodeResult.value = '';
  qrCodeType.value = '未知';
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    }
  }
  // 重置拖动和缩放
  zoomLevel.value = 100;
  dragOffset.value = { x: 0, y: 0 };
};

// 识别二维码
const handleRecognize = async () => {
  if (!imageUrl.value) {
    message.warning('请先上传图片');
    return;
  }

  recognizing.value = true;
  try {
    const img = new Image();
    img.src = imageUrl.value;

    // 等待图片加载完成
    await new Promise((resolve) => {
      if (img.complete) {
        resolve(true);
      } else {
        img.onload = () => resolve(true);
      }
    });

    // 使用qr-scanner-wechat进行识别
    const result:any = await scan(img);

    if (result.text) {
      qrCodeResult.value = result.text;
      qrCodeType.value = result.type || '标准二维码';
      message.success('二维码识别成功');
    } else {
      message.warning('未检测到二维码');
    }
  } catch (error) {
    console.error('二维码识别失败:', error);
    message.error('二维码识别失败');
  } finally {
    recognizing.value = false;
  }
};

// 缩放相关函数
const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 10, 200);
};

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 10, 10);
};

const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
};

// 拖动相关函数
const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  dragStart.value = {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y
  };
};

const onDrag = (e: MouseEvent) => {
  if (isDragging.value) {
    dragOffset.value = {
      x: e.clientX - dragStart.value.x,
      y: e.clientY - dragStart.value.y
    };
  }
};

const stopDrag = () => {
  isDragging.value = false;
};
</script>

<style scoped lang="scss">
.qrcode-detection {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .main-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;

    .card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: 600;

      .version-tag {
        margin-left: 10px;
        font-size: 12px;
        font-weight: normal;
      }
    }
  }

  .upload-container {
    margin: 20px 0;
    display: flex;
    justify-content: center;
  }

  .preview-container {
    margin-top: 20px;

    .canvas-wrapper {
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
      height: 400px;
      position: relative;

      .image-preview-controls {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(255, 255, 255, 0.8);
        padding: 5px 10px;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 5px;

          .zoom-level {
            min-width: 50px;
            text-align: center;
            font-size: 14px;
          }
        }
      }

      .canvas-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        background: #f5f5f5;
        display: flex;
        justify-content: center;
        align-items: center;

        canvas {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      }
    }

    .result-card {
      min-height: 400px;
      display: flex;
      flex-direction: column;

      .result-content {
        flex: 1;
        overflow-y: auto;
        padding: 10px 0;

        .qrcode-result {
          .result-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .result-detail {
            margin-top: 15px;

            .qrcode-text {
              word-break: break-all;
              white-space: pre-wrap;
              font-size: 14px;
              line-height: 1.6;
              padding: 10px;
              background: #f9f9f9;
              border-radius: 4px;
              max-height: 200px;
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>
