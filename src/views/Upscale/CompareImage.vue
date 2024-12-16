<template>
  <div
      ref="canvasContainer"
      class="canvas-container bg drag-over  dark"
      @mousedown="startDragging"
      @mouseup="stopDragging"
      @mouseleave="stopDragging"
      @mousemove="dragImage"
      @wheel="resizeImage"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
  >
    <div v-if="store.isProcessing" class="canvas-progressbar">
      <span class="canvas-progressbar-text">
        {{ store.msg }}
      </span>
      <AProgress
          :stroke-color="{
          '0%': '#108ee9',
          '100%': '#87d068',
      }"
          :percent="store.progressBar"
          :showInfo="false"
      />
    </div>
    <canvas ref="canvas" v-if="store.imageData || store.processedImg"></canvas>
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
    <div class="canvas-qr" v-if="!store.isDone && !store.imageData">
      <AQrcode :bordered="false" color="rgba(126, 126, 135, 0.48)" :size="200"
               :value="'https://git.landaiqing.cn'"
               :icon="phone"
               :iconSize="40"
      />
      <span class="canvas-qr-text">手机扫码上传</span>
    </div>

  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
import phone from '@/assets/svgs/qr-phone.svg';

const canvasContainer = ref<HTMLDivElement | null>(null);
const dragging = ref<boolean>(false);
const linePosition = ref(0);
const dpr = window.devicePixelRatio || 1;
const canvas = ref<HTMLCanvasElement | null>(null);
const draggingLine = ref(false);
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
const img = ref<HTMLImageElement>(new Image());
const processedImg = ref<HTMLImageElement>(new Image());

/**
 * 开始拖动
 * @param event
 */
function startDragging(event: any) {
  if (canvas.value) {
    const rect = canvas.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    if (Math.abs(mouseX - linePosition.value / dpr) < 12) {
      startDraggingLine(event);
      return;
    }
    dragging.value = true;
  }
}

/**
 *  停止拖动
 */
function stopDragging() {
  if (draggingLine.value) {
    stopDraggingLine();
    return;
  }
  dragging.value = false;
}

/**
 * 拖动图片
 * @param event
 */
function dragImage(event: any) {
  if (dragging.value) {
    imgX.value += event.movementX * dpr;
    imgY.value += event.movementY * dpr;
    drawImage();
  }
  if (draggingLine.value) {
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
        Math.abs(event.touches[0].clientX - linePosition.value / dpr) < 12
    ) {
      draggingLine.value = true;
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
    if (draggingLine.value) {
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
  draggingLine.value = false;
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
  draggingLine.value = true;
}

/**
 * 停止拖动线
 */
function stopDraggingLine() {
  draggingLine.value = false;
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
                (linePosition.value - imgX.value)) /
            imgScale.value,
            0,
            processedImg.value.width -
            ((processedImg.value.width / img.value.width) *
                (linePosition.value - imgX.value)) /
            imgScale.value,
            processedImg.value.height,
            linePosition.value,
            imgY.value,
            imgX.value + img.value.width * imgScale.value - linePosition.value,
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
    linePosition.value = newPosition * dpr;
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
  if (draggingLine.value) {
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
    linePosition.value = (linePosition.value / canvas.value.width) * container.offsetWidth * dpr;
    // dragLine.value.style.left = linePosition.value / dpr + "px";
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
        img.value.onload = () => {
          initCanvasSize();
        };
      }
    }
);
watch(
    () => store.processedImg,
    (newValue) => {
      if (newValue) {
        processedImg.value.src = newValue;
        processedImg.value.onload = () => {
          initCanvasSize();
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
}

.canvas-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  //left: 50%;
  //transform: translate(-50%, -50%);
  width: 300px;
  //height: 100px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  //background-color: rgba(255, 255, 255, 0.5);
  //padding: 10px;
}

.canvas-progressbar-text {
  font-size: 16px;
  font-weight: bold;
  color: white;
}
</style>
