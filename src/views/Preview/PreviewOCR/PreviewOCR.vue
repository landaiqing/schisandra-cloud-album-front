<template>
  <div class="ocr-detection">
    <a-card class="main-card">
      <template #title>
        <div class="card-title">
          <scan-outlined/>
          <span>OCR文字识别</span>
          <a-tag color="blue" class="version-tag">增强版</a-tag>
        </div>
      </template>

      <!-- 模型加载状态提示 -->
      <a-row :gutter="[16, 16]" v-if="modelLoading">
        <a-col :span="24">
          <a-alert type="warning" show-icon>
            <template #message>模型加载中</template>
            <template #description>
              <div class="loading-description">
                <a-spin size="small" />
                <span>OCR模型正在加载中，请稍候...</span>
              </div>
            </template>
          </a-alert>
        </a-col>
      </a-row>

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
                <a-button type="primary" :loading="recognizing" @click="handleRecognize" :disabled="modelLoading">
                  {{ recognizing ? '识别中...' : '开始识别' }}
                </a-button>
              </template>
              <div class="result-content">
                <a-empty v-if="!recognizedLines.length" description="暂无识别结果"/>
                <div v-else class="text-result">
                  <div class="result-header">
                    <div class="result-stats">
                      <a-tag color="blue">共 {{ recognizedLines.length }} 行文本</a-tag>
                      <a-tag v-if="selectedLines.size > 0" color="green">已选择 {{ selectedLines.size }} 行</a-tag>
                    </div>
                    <div class="result-actions">
                      <a-checkbox :checked="selectAll" @change="toggleSelectAll">全选</a-checkbox>
                      <a-button type="link" size="small" @click="copySelectedLines" :disabled="selectedLines.size === 0">
                        <template #icon><copy-outlined /></template>
                        复制选中
                      </a-button>
                      <a-button type="link" size="small" @click="copyAllText">
                        <template #icon><copy-outlined /></template>
                        复制全部
                      </a-button>
                    </div>
                  </div>
                  <a-list
                    class="result-list"
                    :data-source="recognizedLines"
                    :bordered="false"
                    size="small"
                  >
                    <template #renderItem="{ item, index }">
                      <a-list-item class="result-item">
                        <div class="result-line">
                          <a-checkbox
                            :checked="selectedLines.has(index)"
                            @change="() => toggleLineSelection(index)"
                            class="line-checkbox"
                          />
                          <a-tag class="line-number">{{ index + 1 }}</a-tag>
                          <div class="line-content" :class="{'selected-line': selectedLines.has(index)}">
                            {{ item }}
                          </div>
                          <a-tooltip title="复制此行">
                            <a-button
                              type="text"
                              size="small"
                              class="copy-btn"
                              @click="copyLine(item)"
                            >
                              <template #icon><copy-outlined /></template>
                            </a-button>
                          </a-tooltip>
                        </div>
                      </a-list-item>
                    </template>
                  </a-list>
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
import {ref, onMounted, computed} from 'vue';
import {
  PlusOutlined,
  ScanOutlined,
  MinusOutlined,
  CopyOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';
import type {UploadProps} from 'ant-design-vue';

// 状态变量
const fileList = ref<any[]>([]);
const imageUrl = ref<string>('');
const recognizing = ref<boolean>(false);
const recognizedText = ref<string>('');
const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainerRef = ref<HTMLDivElement | null>(null);
const zoomLevel = ref<number>(100); // 默认缩放级别为100%
const modelLoading = ref<boolean>(true); // 模型加载状态
const modelLoaded = ref<boolean>(false); // 模型是否已加载

// 多选复制相关状态
const selectedLines = ref<Set<number>>(new Set()); // 已选择的行索引集合
const selectAll = ref<boolean>(false); // 是否全选

// 拖动相关状态
const isDragging = ref<boolean>(false);
const dragOffset = ref<{x: number, y: number}>({x: 0, y: 0});
const dragStart = ref<{x: number, y: number}>({x: 0, y: 0});

// 防抖函数，用于优化拖动性能
const debounce = (fn: any, delay: number) => {
  let timer: number | null = null;
  return (...args: any[]) => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// 计算属性：将识别文本按行分割
const recognizedLines = computed(() => {
  if (!recognizedText.value) return [];
  // 改进文本分割逻辑，处理多种分隔符
  // 先按换行符分割，然后对每行检查是否包含逗号、句号等分隔符
  const lines = recognizedText.value.split('\n');
  let result: string[] = [];

  lines.forEach(line => {
    if (line.trim() === '') return;

    // 检查行长度，如果超过50个字符且包含常见分隔符，则进一步分割
    if (line.length > 50) {
      // 使用正则表达式匹配常见中文分隔符（逗号、句号、分号等）
      const segments = line.split(/([,，。；;])/g);
      let currentSegment = '';

      segments.forEach((segment, index) => {
        // 如果是分隔符，添加到当前段落并处理
        if (segment.match(/[,，。；;]/)) {
          currentSegment += segment;
          if (currentSegment.trim()) {
            result.push(currentSegment.trim());
          }
          currentSegment = '';
        } else {
          // 如果当前段落加上新内容会过长，先添加当前段落
          if (currentSegment.length + segment.length > 50 && currentSegment.trim()) {
            result.push(currentSegment.trim());
            currentSegment = segment;
          } else {
            currentSegment += segment;
          }

          // 处理最后一个片段
          if (index === segments.length - 1 && currentSegment.trim()) {
            result.push(currentSegment.trim());
          }
        }
      });
    } else {
      result.push(line.trim());
    }
  });

  return result;
});

// 懒加载OCR模型
let ocrModule: any = null;

const loadOCRModel = async () => {
  if (modelLoaded.value) return;

  try {
    modelLoading.value = true;
    // 动态导入OCR模块
    const ocr = await import('@paddlejs-models/ocr');
    ocrModule = ocr;

    // 使用requestAnimationFrame确保UI渲染完成后再初始化模型，避免页面重影
    await new Promise(resolve => requestAnimationFrame(resolve));

    // 初始化OCR模型 - 移除初始化参数，使用默认配置
    await ocr.init();

    modelLoaded.value = true;
    message.success('OCR模型初始化成功');
  } catch (error) {
    console.error('OCR模型加载失败:', error);
    message.error('OCR模型初始化失败');
  } finally {
    modelLoading.value = false;
  }
};

// 组件挂载时开始加载模型，但不阻塞页面渲染
onMounted(() => {
  // 使用setTimeout将模型加载放到下一个事件循环，避免阻塞页面渲染
  setTimeout(() => {
    loadOCRModel();
  }, 100);
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

  // 如果模型还未加载，开始加载
  if (!modelLoaded.value && !modelLoading.value) {
    loadOCRModel();
  }

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

// 缩放控制函数
const zoomIn = () => {
  if (zoomLevel.value < 200) {
    zoomLevel.value += 10;
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 10) {
    zoomLevel.value -= 10;
  }
};

// 鼠标滚轮缩放 - 以鼠标位置为中心点
const handleWheel = (e: WheelEvent) => {
  e.preventDefault(); // 阻止默认滚动行为

  // 获取鼠标相对于canvas容器的位置
  const rect = canvasContainerRef.value?.getBoundingClientRect();
  if (!rect) return;

  // 计算鼠标在缩放前的相对位置（相对于容器）
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // 计算鼠标在图像上的相对位置（考虑当前缩放和偏移）
  const imageX = (mouseX - dragOffset.value.x) / (zoomLevel.value / 100);
  const imageY = (mouseY - dragOffset.value.y) / (zoomLevel.value / 100);


  // 向上滚动放大，向下滚动缩小
  if (e.deltaY < 0 && zoomLevel.value < 200) {
    zoomLevel.value += 10;
  } else if (e.deltaY > 0 && zoomLevel.value > 10) {
    zoomLevel.value -= 10;
  } else {
    return; // 如果缩放级别没有变化，直接返回
  }

  // 计算新的偏移量，使鼠标位置保持在图像的同一点上
  const newOffsetX = mouseX - imageX * (zoomLevel.value / 100);
  const newOffsetY = mouseY - imageY * (zoomLevel.value / 100);

  // 更新偏移量
  dragOffset.value = {
    x: newOffsetX,
    y: newOffsetY
  };
};

// 拖动相关方法
const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  dragStart.value = {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y
  };
};

// 创建防抖版本的拖动处理函数
const debouncedDragUpdate = debounce((clientX: number, clientY: number) => {
  dragOffset.value = {
    x: clientX - dragStart.value.x,
    y: clientY - dragStart.value.y
  };
}, 5); // 5ms的防抖延迟，平衡响应性和性能

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  // 使用requestAnimationFrame和防抖函数结合优化拖动性能
  requestAnimationFrame(() => {
    debouncedDragUpdate(e.clientX, e.clientY);
  });
};

const stopDrag = () => {
  isDragging.value = false;
};

// 复制单行文本
const copyLine = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      message.success('已复制到剪贴板');
    })
    .catch(() => {
      message.error('复制失败');
    });
};

// 复制全部文本
const copyAllText = () => {
  if (!recognizedText.value) {
    message.warning('没有可复制的文本');
    return;
  }

  navigator.clipboard.writeText(recognizedText.value)
    .then(() => {
      message.success('已复制全部文本到剪贴板');
    })
    .catch(() => {
      message.error('复制失败');
    });
};

// 切换行选择状态
const toggleLineSelection = (index: number) => {
  if (selectedLines.value.has(index)) {
    selectedLines.value.delete(index);
    selectAll.value = false;
  } else {
    selectedLines.value.add(index);
    // 检查是否已全选
    if (selectedLines.value.size === recognizedLines.value.length) {
      selectAll.value = true;
    }
  }
};

// 切换全选状态
const toggleSelectAll = () => {
  selectAll.value = !selectAll.value;

  if (selectAll.value) {
    // 全选所有行
    selectedLines.value = new Set(
      recognizedLines.value.map((_, index) => index)
    );
  } else {
    // 取消全选
    selectedLines.value.clear();
  }
};

// 复制选中的行
const copySelectedLines = () => {
  if (selectedLines.value.size === 0) {
    message.warning('请先选择要复制的文本行');
    return;
  }

  // 按行索引排序，确保复制的文本顺序正确
  const sortedIndices = Array.from(selectedLines.value).sort((a, b) => a - b);
  const textToCopy = sortedIndices
    .map(index => recognizedLines.value[index])
    .join('\n');

  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      message.success(`已复制${selectedLines.value.size}行文本到剪贴板`);
    })
    .catch(() => {
      message.error('复制失败');
    });
};

// 执行OCR识别
const handleRecognize = async () => {
  if (!imageUrl.value) {
    message.warning('请先上传图片');
    return;
  }

  // 如果模型未加载，先加载模型
  if (!modelLoaded.value) {
    message.warning('OCR模型正在加载中，请稍候...');
    if (!modelLoading.value) {
      await loadOCRModel();
    } else {
      return; // 如果正在加载，直接返回
    }
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
      ctx?.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      ctx?.drawImage(img, 0, 0);

      // 重置拖动状态和缩放级别，使图片居中显示
      dragOffset.value = {x: 0, y: 0};
      zoomLevel.value = 100;

      // 执行OCR识别
      const result = await ocrModule.recognize(img, {
        canvas: canvasRef.value,
        style: {
          strokeStyle: '#FF4D4F',
          lineWidth: 2,
          fillStyle: 'rgba(255, 77, 79, 0.1)'
        }
      });

      // 确保result.text是字符串类型
      recognizedText.value = typeof result.text === 'string' ? result.text : String(result.text || '');

      // 如果识别结果为空，显示提示
      if (!recognizedText.value.trim()) {
        message.warning('未能识别出文字内容，请尝试更清晰的图片');
      } else {
        message.success(`识别完成，共识别出${recognizedLines.value.length}行文本`);
      }
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
}

.main-card {
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.version-tag {
  margin-left: 8px;
}

.loading-description {
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-container {
  margin: 16px 0;
}

.preview-container {
  margin-top: 16px;
}

.canvas-wrapper {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.image-preview-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.zoom-level {
  min-width: 50px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.canvas-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-container:active {
  cursor: grabbing;
}

.result-card {
  height: 100%;
}

.result-content {
  overflow-y: auto;
  padding-right: 4px; /* 添加一点右侧内边距，避免滚动条贴边 */
}

.text-result {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.result-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-line {
  background-color: rgba(24, 144, 255, 0.1);
  border-radius: 4px;
  padding: 2px 4px;
}

.line-checkbox {
  margin-right: 4px;
}

.result-list {
  overflow-y: auto;
}

.result-item {
  padding: 4px 0;
}

.result-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}

.line-number {
  flex-shrink: 0;
  margin-right: 8px;
}

.line-content {
  flex: 1;
  word-break: break-all;
}

.copy-btn {
  opacity: 0.5;
  transition: opacity 0.2s;
}

.result-line:hover .copy-btn {
  opacity: 1;
}
</style>
