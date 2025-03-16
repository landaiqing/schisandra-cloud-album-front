<template>
  <div class="enhancer-container">
    <AFlex class="enhancer-content" :vertical="false" align="center" justify="flex-start">
      <div class="enhancer-content-left">
        <ACard class="enhancer-content-left-container">
          <!-- 上传区域 -->
          <div class="enhancer-content-left-upload">
            <div class="enhancer-upload-container" ref="containerRef">
              <div class="enhancer-upload-content" ref="uploadDraggerRef">
                <Spin :spinning="enhancer.uploading" indicator="magic-ring">
                  <AUploadDragger
                      name="image"
                      accept="image/*"
                      :multiple="false"
                      :directory="false"
                      :maxCount="1"
                      :beforeUpload="enhancer.beforeUpload"
                      :custom-request="enhancer.customUploadRequest"
                      :disabled="enhancer.uploading || enhancer.isProcessing"
                      :showUploadList="false">
                    <div class="enhancer-upload-content-main">
                      <ABadge :offset="[-10, 10]">
                        <template #count>
                          <AAvatar :size="25" :src="successIcon" v-if="enhancer.imageData"/>
                          <AAvatar :size="25" :src="warnIcon" v-if="!enhancer.imageData"/>
                        </template>
                        <AAvatar shape="square" :size="70" :src="fileIcon"/>
                      </ABadge>
                      <span class="enhancer-upload-text">
                        点击或拖拽上传图片
                      </span>
                    </div>
                  </AUploadDragger>
                </Spin>
              </div>
            </div>
          </div>

          <!-- 功能选择区 -->
          <ADivider orientation="center" :plain="true">
            <span class="enhancer-divider-title">增强功能</span>
          </ADivider>

          <div class="enhancer-function-selector">
            <ARadioGroup v-model:value="enhancer.selectedFunction" button-style="solid" size="small"
                         style="width: 100%">
              <ARadioButton value="upscale">图像升级</ARadioButton>
              <ARadioButton value="deblur">去模糊</ARadioButton>
              <ARadioButton value="denoise">去噪</ARadioButton>
              <ARadioButton value="lowlight">弱光增强</ARadioButton>
              <ARadioButton value="beautify">修饰</ARadioButton>
              <ARadioButton value="derain">除雨</ARadioButton>
              <ARadioButton value="defog">除雾</ARadioButton>
            </ARadioGroup>
          </div>

          <!-- 参数设置区 -->
          <ADivider orientation="center" :plain="true">
            <span class="enhancer-divider-title">参数设置</span>
          </ADivider>

          <!-- 图像升级参数 -->
          <div v-if="enhancer.selectedFunction === 'upscale'" class="enhancer-params">
            <div class="enhancer-params-item">
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">模型:</span>
                <ASelect style="width: 100%" size="large"
                         v-model:value="enhancer.upscaleParams.model"
                         :options="enhancer.upscaleModels">
                </ASelect>
              </div>
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">比例:</span>
                <ASelect style="width: 100%" size="large"
                         v-model:value="enhancer.upscaleParams.scale"
                         :options="enhancer.upscaleScales">
                </ASelect>
              </div>
            </div>
          </div>

          <!-- 去模糊参数 -->
          <div v-if="enhancer.selectedFunction === 'deblur'" class="enhancer-params">
            <div class="enhancer-params-item">
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">强度:</span>
                <ASlider v-model:value="enhancer.deblurParams.strength" :min="0" :max="100" :step="1"/>
              </div>
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">半径:</span>
                <ASlider v-model:value="enhancer.deblurParams.radius" :min="1" :max="20" :step="1"/>
              </div>
            </div>
          </div>

          <!-- 去噪参数 -->
          <div v-if="enhancer.selectedFunction === 'denoise'" class="enhancer-params">
            <div class="enhancer-params-item">
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">强度:</span>
                <ASlider v-model:value="enhancer.denoiseParams.strength" :min="0" :max="100" :step="1"/>
              </div>
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">保留细节:</span>
                <ASlider v-model:value="enhancer.denoiseParams.preserveDetail" :min="0" :max="100" :step="1"/>
              </div>
            </div>
          </div>

          <!-- 弱光增强参数 -->
          <div v-if="enhancer.selectedFunction === 'lowlight'" class="enhancer-params">
            <div class="enhancer-params-item">
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">亮度:</span>
                <ASlider v-model:value="enhancer.lowlightParams.brightness" :min="0" :max="100" :step="1"/>
              </div>
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">对比度:</span>
                <ASlider v-model:value="enhancer.lowlightParams.contrast" :min="0" :max="100" :step="1"/>
              </div>
            </div>
          </div>

          <!-- 修饰参数 -->
          <div v-if="enhancer.selectedFunction === 'beautify'" class="enhancer-params">
            <div class="enhancer-params-item">
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">平滑度:</span>
                <ASlider v-model:value="enhancer.beautifyParams.smoothness" :min="0" :max="100" :step="1"/>
              </div>
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">饱和度:</span>
                <ASlider v-model:value="enhancer.beautifyParams.saturation" :min="0" :max="100" :step="1"/>
              </div>
            </div>
          </div>

          <!-- 除雨参数 -->
          <div v-if="enhancer.selectedFunction === 'derain'" class="enhancer-params">
            <div class="enhancer-params-item">
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">强度:</span>
                <ASlider v-model:value="enhancer.derainParams.strength" :min="0" :max="100" :step="1"/>
              </div>
            </div>
          </div>

          <!-- 除雾参数 -->
          <div v-if="enhancer.selectedFunction === 'defog'" class="enhancer-params">
            <div class="enhancer-params-item">
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">强度:</span>
                <ASlider v-model:value="enhancer.defogParams.strength" :min="0" :max="100" :step="1"/>
              </div>
              <div class="enhancer-params-item-content">
                <span class="enhancer-params-title">色彩恢复:</span>
                <ASlider v-model:value="enhancer.defogParams.colorRecovery" :min="0" :max="100" :step="1"/>
              </div>
            </div>
          </div>

          <!-- 处理按钮 -->
          <ADivider></ADivider>
          <AButton style="width: 100%;" size="large" shape="default" type="default" :loading="enhancer.isProcessing"
                   :disabled="!enhancer.imageData"
                   @click="startEnhance">
            <template #icon>
              <AAvatar shape="square" :size="25" :src="runIcon"/>
            </template>
            <span class="enhancer-params-btn">开始处理</span>
          </AButton>
        </ACard>
      </div>

      <!-- 图像预览区 -->
      <div class="enhancer-content-right">
        <div
            ref="canvasContainer"
            class="canvas-container bg"
            @mousedown="startDragging"
            @mouseup="stopDragging"
            @mouseleave="stopDragging"
            @mousemove="dragImage"
            @wheel="resizeImage"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
        >
          <!-- 进度条 -->
          <div class="canvas-progressbar">
            <span class="canvas-progressbar-text">
              {{ enhancer.msg }}
            </span>
            <AProgress
                v-if="enhancer.isProcessing"
                :stroke-color="{
                '0%': '#108ee9',
                '100%': '#87d068',}"
                :percent="enhancer.progressBar"
                :showInfo="false"
                status="active"
            />
          </div>

          <!-- 图片 -->
          <canvas ref="canvas"></canvas>

          <!-- 拖动条 -->
          <div
              class="dragLine"
              v-if="enhancer.isDone"
              ref="dragLine">
            <div class="dragBall"
                 @mousedown.stop="startDraggingLine"
                 @mousemove.stop="dragLineFn"
                 @mouseup.stop="stopDraggingLine"
            >
              <svg width="30" viewBox="0 0 27 20">
                <path fill="#ff3484" d="M9.6 0L0 9.6l9.6 9.6z"></path>
                <path fill="#5fb3e5" d="M17 19.2l9.5-9.6L16.9 0z"></path>
              </svg>
            </div>
          </div>

          <!-- 菜单 -->
          <div class="floating-menu" @mousedown.stop v-if="enhancer.isDone && enhancer.processedImg">
            <AFlex :vertical="false" align="center" justify="space-between" :gap="12">
              <ATooltip placement="top" title="下载图片">
                <AButton type="text" size="large" @click="downloadImage" class="menu-btn">
                  <template #icon>
                    <AAvatar :src="downloadIcon" class="menu-icon"/>
                  </template>
                </AButton>
              </ATooltip>
              <ATooltip placement="top" title="分享图片">
                <AButton type="text" size="large" class="menu-btn">
                  <template #icon>
                    <AAvatar :src="shareIcon" :size="28" class="menu-icon"/>
                  </template>
                </AButton>
              </ATooltip>
              <ATooltip placement="top" title="保存图片">
                <AButton type="text" size="large" class="menu-btn">
                  <template #icon>
                    <AAvatar :src="saveIcon" :size="30" class="menu-icon"/>
                  </template>
                </AButton>
              </ATooltip>
              <ATooltip placement="top" title="删除图片">
                <AButton type="text" size="large" danger class="menu-btn" @click="deleteImage">
                  <template #icon>
                    <AAvatar :src="deleteIcon" :size="28" class="menu-icon"/>
                  </template>
                </AButton>
              </ATooltip>
            </AFlex>
          </div>

          <!-- 图片信息 -->
          <div class="image-info">
            <ATag color="cyan" :bordered="false" v-if="enhancer.imageData">原图: {{ originalImageSize }}</ATag>
            <ATag color="purple" :bordered="false" v-if="enhancer.processedImg">处理后: {{ processedImageSize }}</ATag>
          </div>
        </div>
      </div>
    </AFlex>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, onUnmounted} from 'vue';
import {message} from "ant-design-vue";
import Spin from "@/components/MyUI/Spin/Spin.vue";
import Upscaler from 'upscaler';
import {initNSFWJs, predictNSFW} from "@/utils/tfjs/nsfw.ts";
import {NSFWJS} from "nsfwjs";

// 图标导入
import fileIcon from "@/assets/svgs/file.svg";
import successIcon from '@/assets/svgs/success.svg';
import warnIcon from '@/assets/svgs/warn.svg';
import runIcon from '@/assets/svgs/run.svg';
import downloadIcon from '@/assets/svgs/download.svg';
import shareIcon from '@/assets/svgs/share.svg';
import saveIcon from '@/assets/svgs/save.svg';
import deleteIcon from '@/assets/svgs/deleted.svg';

// DOM引用
const containerRef = ref<HTMLDivElement | null>(null);
const uploadDraggerRef = ref<HTMLDivElement | null>(null);
const canvasContainer = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const dragLine = ref<HTMLDivElement | null>(null);

// 图像处理实例
let upscaler: any = null;

// 状态管理
const enhancer = reactive({
  // 基本状态
  uploading: false,
  isProcessing: false,
  isDone: false,
  msg: "",
  progressBar: 0,

  // 图像数据
  imageData: "",
  fileData: "",
  processedImg: "",
  input: null as any,

  // 拖拽状态
  dragging: false,
  linePosition: 0,
  draggingLine: false,

  // 功能选择
  selectedFunction: "upscale",

  // 图像升级参数
  upscaleParams: {
    model: "x4",
    scale: 4
  },
  upscaleModels: [
    {label: "通用模型 x2", value: "x2"},
    {label: "通用模型 x4", value: "x4"},
    {label: "照片增强", value: "photo"},
    {label: "动漫风格", value: "anime"}
  ],
  upscaleScales: [
    {label: "2x", value: 2},
    {label: "4x", value: 4}
  ],

  // 去模糊参数
  deblurParams: {
    strength: 50,
    radius: 5
  },

  // 去噪参数
  denoiseParams: {
    strength: 50,
    preserveDetail: 70
  },

  // 弱光增强参数
  lowlightParams: {
    brightness: 60,
    contrast: 50
  },

  // 修饰参数
  beautifyParams: {
    smoothness: 30,
    saturation: 50
  },

  // 除雨参数
  derainParams: {
    strength: 70
  },

  // 除雾参数
  defogParams: {
    strength: 70,
    colorRecovery: 60
  },

  // 图片上传前的校验
  async beforeUpload(file: File) {
    enhancer.uploading = true;
    const urlData = URL.createObjectURL(file);
    const image = new Image();
    image.src = urlData;

    // 等待图片加载完成
    await new Promise(resolve => {
      image.onload = resolve;
    });

    // 图片 NSFW 检测
    try {
      const nsfw: NSFWJS = await initNSFWJs();
      const isNSFW: boolean = await predictNSFW(nsfw, image);
      if (isNSFW) {
        message.error("检测到不适当的图片内容，请更换图片");
        enhancer.fileData = '';
        enhancer.uploading = false;
        return false;
      }
    } catch (error) {
      console.error("NSFW检测失败", error);
    }

    await clear();
    enhancer.fileData = urlData;
    enhancer.uploading = false;
    return true;
  },

  // 自定义上传图片请求
  async customUploadRequest(_file: any) {
    enhancer.imageData = enhancer.fileData;
    await loadImage();
  }
});

// 图片尺寸信息
const originalImageSize = computed(() => {
  if (!enhancer.imageData) return "";
  const img = new Image();
  img.src = enhancer.imageData;
  return `${img.width}x${img.height}`;
});

const processedImageSize = computed(() => {
  if (!enhancer.processedImg) return "";
  const img = new Image();
  img.src = enhancer.processedImg;
  return `${img.width}x${img.height}`;
});

// 清空数据
async function clear() {
  enhancer.imageData = "";
  enhancer.processedImg = "";
  enhancer.isDone = false;
  enhancer.msg = "";
  enhancer.progressBar = 0;
  enhancer.isProcessing = false;
  enhancer.dragging = false;
  enhancer.linePosition = 0;
  enhancer.draggingLine = false;
  enhancer.input = null;
}

// 加载图片
async function loadImage() {
  if (!canvas.value || !enhancer.imageData) return;

  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.src = enhancer.imageData;

  await new Promise(resolve => {
    img.onload = resolve;
  });

  canvas.value.width = img.width;
  canvas.value.height = img.height;
  ctx.drawImage(img, 0, 0);

  // 初始化拖动线位置
  enhancer.linePosition = img.width / 2;

  // 初始化Upscaler
  if (!upscaler) {
    upscaler = new Upscaler();
  }
}

// 开始图像增强处理
async function startEnhance() {
  if (!enhancer.imageData || !canvas.value) {
    message.warning("请先上传图片");
    return;
  }

  enhancer.isProcessing = true;
  enhancer.msg = "正在处理图片...";
  const start = Date.now();

  try {
    const img = new Image();
    img.src = enhancer.imageData;

    await new Promise(resolve => {
      img.onload = resolve;
    });

    let processedImage;

    // 根据选择的功能进行不同的处理
    switch (enhancer.selectedFunction) {
      case 'upscale':
        enhancer.msg = "正在进行图像升级...";
        processedImage = await upscaler.upscale(img, {
          model: enhancer.upscaleParams.model,
          scale: enhancer.upscaleParams.scale,
          progress: (progress: number) => {
            enhancer.progressBar = Math.round(progress * 100);
          }
        });
        break;

      case 'deblur':
        enhancer.msg = "正在进行去模糊处理...";
        // 这里使用模拟进度，实际应使用UpscalerJS的去模糊功能
        simulateProgress();
        processedImage = await simulateImageProcessing(img, 'deblur');
        break;

      case 'denoise':
        enhancer.msg = "正在进行去噪处理...";
        simulateProgress();
        processedImage = await simulateImageProcessing(img, 'denoise');
        break;

      case 'lowlight':
        enhancer.msg = "正在进行弱光增强...";
        simulateProgress();
        processedImage = await simulateImageProcessing(img, 'lowlight');
        break;

      case 'beautify':
        enhancer.msg = "正在进行图像修饰...";
        simulateProgress();
        processedImage = await simulateImageProcessing(img, 'beautify');
        break;

      case 'derain':
        enhancer.msg = "正在进行除雨处理...";
        simulateProgress();
        processedImage = await simulateImageProcessing(img, 'derain');
        break;

      case 'defog':
        enhancer.msg = "正在进行除雾处理...";
        simulateProgress();
        processedImage = await simulateImageProcessing(img, 'defog');
        break;
    }

    if (processedImage) {
      enhancer.processedImg = processedImage.src || processedImage;
      enhancer.isDone = true;
      enhancer.msg = `处理完成! 用时: ${((Date.now() - start) / 1000).toFixed(2)}秒`;

      // 更新画布显示处理后的图片
      updateCanvasWithProcessedImage();
    }
  } catch (error) {
    console.error("图像处理失败", error);
    message.error("图像处理失败，请重试");
    enhancer.msg = "处理失败";
  } finally {
    enhancer.isProcessing = false;
  }
}

// 模拟进度更新
function simulateProgress() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 5;
    enhancer.progressBar = Math.min(Math.round(progress), 99);
    if (progress >= 100) {
      clearInterval(interval);
    }
  }, 200);
}

// 模拟图像处理（在实际实现中应替换为真实的处理逻辑）
async function simulateImageProcessing(img: HTMLImageElement, _type: string) {
  // 这里应该是实际的图像处理逻辑
  // 目前使用模拟的方式返回原图
  return new Promise<string>(resolve => {
    setTimeout(() => {
      resolve(img.src);
    }, 2000);
  });
}

// 更新画布显示处理后的图片
function updateCanvasWithProcessedImage() {
  if (!canvas.value || !enhancer.processedImg) return;

  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.src = enhancer.processedImg;

  img.onload = () => {
    canvas.value!.width = img.width;
    canvas.value!.height = img.height;
    ctx.drawImage(img, 0, 0);

    // 重置拖动线位置
    enhancer.linePosition = img.width / 2;

    // 绘制对比效果
    drawComparisonView();
  };
}

// 绘制对比视图
function drawComparisonView() {
  if (!canvas.value || !enhancer.imageData || !enhancer.processedImg || !enhancer.isDone) return;

  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;

  const originalImg = new Image();
  originalImg.src = enhancer.imageData;

  const processedImg = new Image();
  processedImg.src = enhancer.processedImg;

  originalImg.onload = () => {
    processedImg.onload = () => {
      // 清除画布
      ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);

      // 绘制处理后的图片
      ctx.drawImage(processedImg, 0, 0, canvas.value!.width, canvas.value!.height);

      // 绘制原图（左侧部分）
      ctx.drawImage(
          originalImg,
          0, 0, originalImg.width, originalImg.height,
          0, 0, enhancer.linePosition, canvas.value!.height
      );

      // 绘制分割线
      ctx.beginPath();
      ctx.moveTo(enhancer.linePosition, 0);
      ctx.lineTo(enhancer.linePosition, canvas.value!.height);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    };
  };
}

// 拖动相关函数
function startDragging(_e: MouseEvent) {
  enhancer.dragging = true;
}

function stopDragging() {
  enhancer.dragging = false;
}

function dragImage(_e: MouseEvent) {
  if (!enhancer.dragging || !canvasContainer.value) return;

  // 实现图像拖动逻辑
}

function startDraggingLine(e: MouseEvent) {
  e.preventDefault();
  enhancer.draggingLine = true;
}

function stopDraggingLine() {
  enhancer.draggingLine = false;
}

function dragLineFn(e: MouseEvent) {
  if (!enhancer.draggingLine || !canvas.value || !canvasContainer.value) return;

  const rect = canvasContainer.value.getBoundingClientRect();
  const x = e.clientX - rect.left;

  // 限制拖动范围在画布内
  enhancer.linePosition = Math.max(0, Math.min(canvas.value.width, x));

  // 重新绘制对比视图
  drawComparisonView();
}

// 缩放相关函数
function resizeImage(e: WheelEvent) {
  e.preventDefault();
  // 实现图像缩放逻辑
}

// 触摸事件处理
function touchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    enhancer.dragging = true;
  }
}

function touchMove(e: TouchEvent) {
  if (!enhancer.dragging || !canvasContainer.value || e.touches.length !== 1) return;

  const touch = e.touches[0];
  const rect = canvasContainer.value.getBoundingClientRect();
  const x = touch.clientX - rect.left;

  if (enhancer.isDone) {
    // 更新拖动线位置
    enhancer.linePosition = Math.max(0, Math.min(canvas.value?.width || 0, x));
    drawComparisonView();
  }
}

function touchEnd() {
  enhancer.dragging = false;
}

// 下载图片
function downloadImage() {
  if (!enhancer.processedImg) return;

  const link = document.createElement('a');
  link.href = enhancer.processedImg;
  link.download = `enhanced_image_${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  message.success('图片下载成功');
}

// 删除图片
function deleteImage() {
  clear();
  message.success('图片已删除');
}

// 组件挂载和卸载
onMounted(() => {
  // 初始化Upscaler
  upscaler = new Upscaler();
});

onUnmounted(() => {
  // 清理资源
  if (enhancer.processedImg) {
    URL.revokeObjectURL(enhancer.processedImg);
  }
  if (enhancer.imageData) {
    URL.revokeObjectURL(enhancer.imageData);
  }
});
</script>

<style scoped lang="scss">
.enhancer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .enhancer-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .enhancer-content-left {
      width: 29%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .enhancer-content-left-container {
        width: 100%;
        height: 100%;
        overflow: auto;

        .enhancer-divider-title {
          font-size: 13px;
          color: rgba(126, 126, 135, 0.99);
        }
      }
    }

    .enhancer-content-right {
      width: 70%;
      height: 100%;
      border-radius: 10px;
    }
  }
}

.enhancer-upload-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .enhancer-upload-content {
    width: 100%;
    height: 30vh;

    .enhancer-upload-content-main {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      overflow: scroll;

      .enhancer-upload-text {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}

.enhancer-function-selector {
  margin-bottom: 15px;
}

.enhancer-params {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 15px;

  .enhancer-params-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .enhancer-params-item-content {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;

      .enhancer-params-title {
        width: 20%;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  .enhancer-params-btn {
    font-size: 16px;
    font-weight: bold;
  }
}

.canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px;
  background-color: #f0f2f5;

  canvas {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.canvas-progressbar {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;

  .canvas-progressbar-text {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
  }
}

.dragLine {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 2px;
  background-color: #ffffff;
  z-index: 5;
  transform: translateX(var(--line-position));

  .dragBall {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    background-color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ew-resize;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}

.floating-menu {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  transition: all 0.5s ease;
  user-select: none;
}

.menu-btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.menu-btn:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.menu-icon {
  transition: transform 0.2s ease;
}

.menu-icon:hover {
  transform: scale(1.1);
}

.image-info {
  position: absolute;
  opacity: 0.8;
  border-radius: 10px;
  top: 0;
  right: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
  transition: all 0.5s ease;
  user-select: none;
  z-index: 3;
}
</style>
