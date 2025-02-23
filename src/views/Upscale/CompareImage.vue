<template>
  <div
      ref="canvasContainer"
      class="canvas-container bg"
      :class="{
      'drag-over':false,
      'dark':false
      }"
      @mousedown="startDragging"
      @mouseup="stopDragging"
      @mouseleave="stopDragging"
      @mousemove="dragImage"
      @wheel="resizeImage"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
  >
    <!--  进度条   -->
    <div class="canvas-progressbar">
      <span class="canvas-progressbar-text">
        {{ store.msg }}
      </span>
      <AProgress
          v-if="store.isProcessing"
          :stroke-color="{
          '0%': '#108ee9',
          '100%': '#87d068',}"
          :percent="store.progressBar"
          :showInfo="false"
          status="active"
      />
    </div>
    <!--      图片   -->
    <canvas ref="canvas"></canvas>
    <!--      拖动条   -->
    <div
        class="dragLine"
        v-if="store.isDone"
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
    <!--      二维码  -->
    <div class="canvas-qr">
      <AQrcode :bordered="false" color="rgba(126, 126, 135, 0.48)"
               :size="qrcodeSize"
               :value="generateQrCodeUrl()"
               :icon="phone"
               :iconSize="iconSize"
               :status="store.status"

      />
      <span class="canvas-qr-text">手机扫码上传</span>
    </div>
    <!--      菜单  -->
    <div class="floating-menu" @mousedown.stop v-if="store.isDone && store.processedImg">
      <AFlex :vertical="false" align="center" justify="space-between" :gap="12">
        <ATooltip placement="top" title="下载图片">
          <AButton type="text" size="large" @click="downloadImage" class="menu-btn">
            <template #icon>
              <AAvatar :src="download" class="menu-icon"/>
            </template>
          </AButton>
        </ATooltip>
        <ATooltip placement="top" title="分享图片">
          <AButton type="text" size="large" class="menu-btn">
            <template #icon>
              <AAvatar :src="share" :size="28" class="menu-icon"/>
            </template>
          </AButton>
        </ATooltip>
        <ATooltip placement="top" title="保存图片">
          <AButton type="text" size="large" class="menu-btn">
            <template #icon>
              <AAvatar :src="save" :size="30" class="menu-icon"/>
            </template>
          </AButton>
        </ATooltip>
        <ATooltip placement="top" title="删除图片">
          <AButton type="text" size="large" danger class="menu-btn" @click="deletedImage">
            <template #icon>
              <AAvatar :src="deleted" :size="28" class="menu-icon"/>
            </template>
          </AButton>
        </ATooltip>
      </AFlex>
    </div>
    <!--    图片信息 -->
    <div class="image-info">
      <ATag color="cyan" :bordered="false" v-if="store.imageData">修复前: {{ originalImageSize }}</ATag>
      <ATag color="purple" :bordered="false" v-if="store.processedImg">修复后: {{ processedImageSize }}</ATag>
    </div>
  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
import phone from '@/assets/svgs/qr-phone.svg';
import download from '@/assets/svgs/download.svg';
import share from '@/assets/svgs/share.svg';
import save from '@/assets/svgs/save.svg';
import deleted from '@/assets/svgs/deleted.svg';
import getImageSizeWithUnit from "@/utils/imageUtils/getImageSizeWithUnit.ts";

const canvasContainer = ref<HTMLDivElement | null>(null);
const dpr = window.devicePixelRatio || 1;
const canvas = ref<HTMLCanvasElement | null>(null);
const imgX = ref(0);
const imgY = ref(0);
const imgScale = ref(1);
const dragLine = ref<HTMLDivElement | null>(null);
const imgInitScale = ref(1);
const touching = ref(false);
const touchStartImgX = ref(0);
const touchStartImgY = ref(0);

const touchStartX = ref(0);
const touchStartY = ref(0);
const touchStartDistance = ref(0);
const imgScaleStart = ref(1);

const store = useStore().upscale;
const user = useStore().user;
const img = ref<HTMLImageElement>(new Image());
const processedImg = ref<HTMLImageElement>(new Image());

const qrcodeSize = ref<number>(250);
const iconSize = ref<number>(30);

const originalImageSize = ref<string>('');
const processedImageSize = ref<string>('');


/**
 *  更新二维码大小
 */
const updateQrcodeSize = () => {
  if (canvasContainer.value) {
    // 设置 QRCode 大小
    const containerWidth = canvasContainer.value.clientWidth;
    qrcodeSize.value = containerWidth * 0.3; // 设置 QRCode 为父盒子宽度的80%
    iconSize.value = Math.min(containerWidth * 0.1, 40); // 设置 icon 大小为父盒子宽度的10%
  }
};

function generateQrCodeUrl(): string {
  return import.meta.env.VITE_APP_WEB_URL + "/main/upscale/phone/app?user_id=" + user.user.uid + "&token=" + user.token.accessToken;
}

/**
 *  下载图片
 */
function downloadImage() {
  if (!store.processedImg) return;
  const a = document.createElement("a");
  a.href = store.processedImg;
  if (store.hasAlpha) a.download = store.model_type +
      "_" + store.model +
      "_" + store.factor +
      "_" + store.tile_size +
      "_" + store.min_lap +
      "_" + store.backend +
      "_" +
      "output.png";
  else a.download = store.model_type +
      "_" + store.model +
      "_" + store.factor +
      "_" + store.tile_size +
      "_" + store.min_lap +
      "_" + store.backend +
      "_" +
      "output.jpg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 *  删除图片
 */
function deletedImage() {
  if (store.processedImg && store.imageData) {
    store.imageData = '';
    store.processedImg = '';
  }
  store.isDone = false;
  store.isProcessing = false;
  store.progressBar = 0;
  store.msg = "";
  store.draggingLine = false;
  store.dragging = false;
  imgX.value = 0;
  imgY.value = 0;
  imgScale.value = 1;
  imgInitScale.value = 1;
  img.value = new Image();
  processedImg.value = new Image();
  initCanvasSize();
}


/**
 * 开始拖动
 * @param event
 */
function startDragging(event: any) {
  if (canvas.value) {
    const rect = canvas.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    if (Math.abs(mouseX - store.linePosition / dpr) < 12) {
      startDraggingLine(event);
      return;
    }
    store.dragging = true;
  }
}

/**
 *  停止拖动
 */
function stopDragging() {
  if (store.draggingLine) {
    stopDraggingLine();
    return;
  }
  store.dragging = false;
}

/**
 * 拖动图片
 * @param event
 */
function dragImage(event: any) {
  if (store.dragging) {
    imgX.value += event.movementX * dpr;
    imgY.value += event.movementY * dpr;
    drawImage();
  }
  if (store.draggingLine) {
    updateLinePosition(event);
    drawImage();
  }
}

/**
 *  重置图片大小
 * @param event
 */
function resizeImage(event: any) {
  event.preventDefault();
  if (canvas.value) {
    const rect = canvas.value.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) * dpr;
    const mouseY = (event.clientY - rect.top) * dpr;
    const prevScale = imgScale.value;
    const maxSize = 20 * imgInitScale.value;
    const minSize = 0.05 * imgInitScale.value;
    if (event.deltaY > 0) {
      const newScale = imgScale.value * 0.8;
      imgScale.value = Math.min(Math.max(minSize, newScale), maxSize);
    } else {
      const newScale = imgScale.value * 1.2;
      imgScale.value = Math.min(Math.max(minSize, newScale), maxSize);
    }

    const scaleRatio = imgScale.value / prevScale;
    imgX.value = mouseX - (mouseX - imgX.value) * scaleRatio;
    imgY.value = mouseY - (mouseY - imgY.value) * scaleRatio;
    drawImage();
  }
}

/**
 * 开始拖动
 * @param event
 */
function touchStart(event: any) {
  touching.value = true;
  touchStartImgX.value = imgX.value;
  touchStartImgY.value = imgY.value;
  if (event.touches.length == 1) {
    if (
        Math.abs(event.touches[0].clientX - store.linePosition / dpr) < 12
    ) {
      store.draggingLine = true;
      return;
    }
    touchStartX.value = event.touches[0].clientX * dpr;
    touchStartY.value = event.touches[0].clientY * dpr;
  } else {
    imgScaleStart.value = imgScale.value;
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    touchStartDistance.value =
        Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        ) * dpr;
    touchStartX.value = ((touch1.clientX + touch2.clientX) / 2) * dpr;
    touchStartY.value = ((touch1.clientY + touch2.clientY) / 2) * dpr;
  }
}

/**
 *  移动
 * @param event
 */
function touchMove(event: any) {
  event.preventDefault();
  if (!touching.value) {
    return;
  }
  if (event.touches.length == 1) {
    const touch = event.touches[0];
    const movementX =
        touch.clientX * dpr -
        touchStartX.value +
        touchStartImgX.value -
        imgX.value;
    const movementY =
        touch.clientY * dpr -
        touchStartY.value +
        touchStartImgY.value -
        imgY.value;
    if (store.draggingLine) {
      updateLinePosition(event.touches[0]);
      drawImage();
      return;
    }
    if (touching.value) {
      imgX.value += movementX;
      imgY.value += movementY;
      drawImage();
    }
  } else {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance =
        Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        ) * dpr;
    if (canvas.value) {
      const rect = canvas.value.getBoundingClientRect();
      const mouseX = touchStartX.value - rect.left;
      const mouseY = touchStartY.value - rect.top;
      const scaleChange = distance / touchStartDistance.value;
      const prevScale = imgScale.value;
      const maxSize = 20 * imgInitScale.value;
      const minSize = 0.05 * imgInitScale.value;
      const newScale = imgScaleStart.value * scaleChange;
      imgScale.value = Math.min(Math.max(minSize, newScale), maxSize);

      const scaleRatio = imgScale.value / prevScale;
      const movementX =
          ((touch1.clientX + touch2.clientX) / 2) * dpr - touchStartX.value;
      const movementY =
          ((touch1.clientY + touch2.clientY) / 2) * dpr - touchStartY.value;
      imgX.value = mouseX - (mouseX - imgX.value) * scaleRatio + movementX;
      imgY.value = mouseY - (mouseY - imgY.value) * scaleRatio + movementY;
      touchStartX.value = ((touch1.clientX + touch2.clientX) / 2) * dpr;
      touchStartY.value = ((touch1.clientY + touch2.clientY) / 2) * dpr;
      drawImage();
    }
  }
}

/**
 * 结束移动
 * @param event
 */
function touchEnd(event: any) {
  if (event.touches.length == 2) {
    touchStartImgX.value = imgX.value;
    touchStartImgY.value = imgY.value;
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    touchStartDistance.value =
        Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        ) * dpr;
    touchStartX.value = ((touch1.clientX + touch2.clientX) / 2) * dpr;
    touchStartY.value = ((touch1.clientY + touch2.clientY) / 2) * dpr;
    return;
  }
  if (event.touches.length == 1) {
    touchStartImgX.value = imgX.value;
    touchStartImgY.value = imgY.value;
    touchStartX.value = event.touches[0].clientX * dpr;
    touchStartY.value = event.touches[0].clientY * dpr;
    return;
  }
  touching.value = false;
  store.draggingLine = false;
  touchStartImgX.value = 0;
  touchStartImgY.value = 0;
  touchStartX.value = 0;
  touchStartY.value = 0;
  touchStartDistance.value = 0;
}

/**
 *  开始拖动线
 * @param event
 */
function startDraggingLine(event: any) {
  event.preventDefault();
  store.draggingLine = true;
}

/**
 * 停止拖动线
 */
function stopDraggingLine() {
  store.draggingLine = false;
}

/**
 *  绘制图片
 */
function drawImage() {
  requestAnimationFrame(() => drawImage_());
}

/**
 * 渲染图片
 */
function drawImage_() {
  if (canvas.value) {
    const ctx = canvas.value.getContext("2d");
    if (ctx && img.value) {
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

      ctx.drawImage(
          img.value,
          imgX.value,
          imgY.value,
          img.value.width * imgScale.value,
          img.value.height * imgScale.value
      );

      if (processedImg.value) {
        ctx.drawImage(
            processedImg.value,
            ((processedImg.value.width / img.value.width) *
                (store.linePosition - imgX.value)) /
            imgScale.value,
            0,
            processedImg.value.width -
            ((processedImg.value.width / img.value.width) *
                (store.linePosition - imgX.value)) /
            imgScale.value,
            processedImg.value.height,
            store.linePosition,
            imgY.value,
            imgX.value + img.value.width * imgScale.value - store.linePosition,
            img.value.height * imgScale.value
        );
      }
    }
  }
}

/**
 * 更新线位置
 * @param event
 */
function updateLinePosition(event: any) {
  if (canvas.value && canvasContainer.value) {
    const containerRect = canvasContainer.value.getBoundingClientRect();
    const lineWidth = 5 * dpr; // 线的宽度为 5px

    // 计算线的新位置，确保线的中心在鼠标位置
    let newPosition = event.clientX - containerRect.left;

    // 确保线不会超出 canvasContainer 的边界
    newPosition = Math.max(0, Math.min(newPosition, containerRect.width - lineWidth));

    // 更新线的位置
    store.linePosition = newPosition * dpr;
    const line: any = dragLine.value;
    line.style.left = Math.floor(newPosition) + "px";
  }
}

/**
 * 拖动线
 * @param event
 */
function dragLineFn(event: any) {
  event.preventDefault();
  if (store.draggingLine) {
    requestAnimationFrame(() => {
      updateLinePosition(event);
      drawImage();
    });
  }
}

/**
 * 更新图片位置
 */
function updateCanvasSize() {
  const container: any = canvasContainer.value;
  if (container && canvas.value && img.value) {
    // imgX.value =
    //     ((imgX.value + (img.value.width * imgScale.value) / 2) / canvas.value.width) *
    //     container.offsetWidth * dpr - (img.value.width * imgScale.value) / 2;
    // imgY.value =
    //     ((imgY.value + (img.value.height * imgScale.value) / 2) /
    //         canvas.value.height) * container.offsetHeight * dpr - (img.value.height * imgScale.value) / 2;
    imgX.value = (container.offsetWidth * dpr - img.value.width * imgScale.value) / 2;
    imgY.value = (container.offsetHeight * dpr - img.value.height * imgScale.value) / 2;
    store.linePosition = (store.linePosition / canvas.value.width) * container.offsetWidth * dpr;
    // dragLine.value.style.left = store.linePosition / dpr + "px";
  }
  if (canvas.value) {
    canvas.value.width = container.offsetWidth * dpr;
    canvas.value.height = container.offsetHeight * dpr;
    canvas.value.style.width = `${container.offsetWidth}px`;
    canvas.value.style.height = `${container.offsetHeight}px`;
    drawImage();
  }
}

/**
 *  监听大小变化
 */
function handleResize() {
  updateCanvasSize();
  updateQrcodeSize();
}

/**
 * 初始化 canvas 大小
 */
function initCanvasSize() {
  updateCanvasSize();
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

watch(
    () => store.imageData,
    (newValue) => {
      if (newValue) {
        img.value.src = newValue;
        img.value.onload = async () => {
          initCanvasSize();
          originalImageSize.value = await getImageSizeWithUnit(newValue);
        };
      }
    }
);
watch(
    () => store.processedImg,
    (newValue) => {
      if (newValue) {
        processedImg.value.src = newValue;
        processedImg.value.onload = async () => {
          initCanvasSize();
          processedImageSize.value = await getImageSizeWithUnit(newValue);
        };
      }
    }
);
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  store.isDone = false;
  store.imageData = "";
  store.processedImg = "";
  store.isProcessing = false;
  store.msg = "";
  store.progressBar = 0;
});

</script>
<style scoped lang="scss">
.canvas-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0;
  border-radius: 10px;
  overflow: hidden;
}

.bg {
  background-color: #ffffff;
  background-image: linear-gradient(
          45deg,
          #f3f3f3 25%,
          transparent 25%,
          transparent 75%,
          #f3f3f3 75%,
          #f3f3f3
  ),
  linear-gradient(
          45deg,
          #f3f3f3 25%,
          #ffffff 25%,
          #ffffff 75%,
          #f3f3f3 75%,
          #f3f3f3
  );
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  transition: all 0.5s ease;
  width: 100%;
  height: 100%;
}

.bg.dark {
  background-color: #313131;
  background-image: linear-gradient(
          45deg,
          #333333 25%,
          transparent 25%,
          transparent 75%,
          #333333 75%,
          #333333
  ),
  linear-gradient(
          45deg,
          #333333 25%,
          #313131 25%,
          #313131 75%,
          #333333 75%,
          #333333
  );
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

.drag-over {
  background-image: linear-gradient(
          45deg,
          #333333 25%,
          transparent 25%,
          transparent 75%,
          #333333 75%,
          #333333
  ),
  linear-gradient(
          45deg,
          #333333 25%,
          #313131 25%,
          #313131 75%,
          #333333 75%,
          #333333
  );
  transition: all 0.5s ease;
}

canvas {
  height: 100%;
  width: 100%;
  z-index: 2;
  border-radius: 10px;
}

.canvas-qr {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.canvas-qr-text {
  font-size: 16px;
  color: rgba(126, 126, 135, 0.48);
}

.dragLine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 5px;
  height: 100%;
  transform: translate(-100%, 0);
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 3;
}

.dragLine:hover {
  cursor: ew-resize;
}

.dragBall {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ew-resize;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.canvas-progressbar {
  position: absolute;
  top: 0;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.canvas-progressbar-text {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
}

.floating-menu {
  position: absolute;
  background-color: rgb(255, 255, 255);
  opacity: 0.8;
  border-radius: 10px;
  color: white;
  width: 200px;
  height: 50px;
  padding: 10px;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 4;
  display: flex;
  justify-content: center;
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
