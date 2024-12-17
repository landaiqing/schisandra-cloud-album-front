<template>
  <div class="upscale-params">
    <div class="upscale-params-item">
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">类型:</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="model_type"
                 :options="TypeData.map(item => ({label: item, value: item}))">
        </ASelect>
      </div>
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">模型:</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="model"
                 :options="modes.map((item: any) => ({label: item, value: item}))">
        </ASelect>
      </div>
    </div>
    <div class="upscale-params-item">
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">比列:</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="factor"
                 :options="scales.map((item: any) => ({label: item, value: item}))">

        </ASelect>
      </div>
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">分块大小:</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="tile_size"
                 :options="tileSize.map((item: any) => ({label: item, value: item}))">

        </ASelect>
      </div>
    </div>
    <div class="upscale-params-item">
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">重复:</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="min_lap"
                 :options="overlapList.map((item: any) => ({label: item, value: item}))">
        </ASelect>
      </div>
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">运行环境：</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="backend"
                 :options="backendList.map((item: any) => ({label: item, value: item}))">
        </ASelect>
      </div>
    </div>
    <ADivider></ADivider>
    <AButton style="width: 100%;" size="large" shape="default" type="default" :loading="upscale.isProcessing"
             :disabled="!upscale.input"
             @click="startTask">
      <template #icon>
        <AAvatar shape="square" :size="25" :src="run"/>
      </template>
      <span class="upscale-params-btn">开始</span>
    </AButton>
  </div>
</template>
<script setup lang="ts">

import {message} from "ant-design-vue";
import Img from "@/workers/image.ts";
import useStore from "@/store";
import run from '@/assets/svgs/run.svg';

const upscale = useStore().upscale;
// ***************参数设置***************
const TypeData = ['realesrgan', 'realcugan'];

const model_type = ref<string>(TypeData[0]);

const ModelConfig = reactive({
  realesrgan: {
    model: ["anime_fast", "anime_plus", "general_fast", "general_plus"],
    factor: [4],
    tile_size: [32, 48, 64, 96, 128, 192, 256],
  },
  realcugan: {
    factor: [2, 4],
    denoise: {
      2: [
        "conservative",
        "no-denoise",
        "denoise1x",
        "denoise2x",
        "denoise3x",
      ],
      3: ["conservative", "denoise3x"],
      4: ["conservative", "no-denoise", "denoise3x"],
    },
    tile_size: [32, 48, 64, 96, 128, 192, 256, 384, 512],
  }
});
const factor = ref<number>(4);
const model = ref(ModelConfig[model_type.value].model[0]);
const modes = computed(() => {
  if (model_type.value === "realesrgan") {
    return ModelConfig[model_type.value].model;
  } else {
    return ModelConfig[model_type.value].denoise[factor.value];
  }
});

watch(model_type, val => {
  if (model_type.value === "realesrgan") {
    model.value = ModelConfig[val].model[0];
  } else {
    model.value = ModelConfig[val].denoise[factor.value][0];
  }
});


// Scale
const scales = computed(() => {
  return ModelConfig[model_type.value].factor;
});

//tile size
const tile_size = ref<number>(128);
const tileSize = computed(() => {
  return ModelConfig[model_type.value].tile_size;
});

// overlap
const overlapList = [0, 4, 8, 12, 16, 20];
const min_lap = ref<number>(overlapList[3]);

// run on
const backendList = ['webgl', 'webgpu'];
const backend = ref<string>(backendList[0]);

// ********************处理图片*******************
const outputData = ref<any>();
const imgCanvas = document.createElement("canvas");


/**
 *  WebWorker 处理图片
 */
async function startTask() {
  if (upscale.input === null) return;
  upscale.isProcessing = true;
  const start = Date.now();
  const worker = new Worker(new URL("@/workers/upscale.worker.ts", import.meta.url), {
    type: "module",
  });
  worker.onmessage = (e: MessageEvent<any>) => {
    const {progress, done, output, error, info} = e.data;
    if (info) {
      upscale.msg = info;
    }
    if (error) {
      message.error(error);
      upscale.isProcessing = false;
      worker.terminate();
      return;
    }
    upscale.progressBar = progress;

    if (done) {
      if (!upscale.hasAlpha || (upscale.hasAlpha && upscale.inputAlpha)) {
        if (upscale.input) {
          outputData.value = new Img(
              factor.value * upscale.input.width,
              factor.value * upscale.input.height,
              new Uint8Array(output)
          );
        }
      }
      upscale.msg = "Processing Image...";
      if (upscale.inputAlpha) {
        worker.postMessage(
            {
              input: upscale.inputAlpha.data.buffer,
              factor: factor.value,
              tile_size: tile_size.value,
              min_lap: min_lap.value,
              model_type: model_type.value,
              width: upscale.inputAlpha.width,
              height: upscale.inputAlpha.height,
              model: model.value,
              backend: backend.value,
              hasAlpha: true,
            },
            [upscale.inputAlpha.data.buffer]
        );
        upscale.inputAlpha = null;
        return;
      }
      if (upscale.hasAlpha && upscale.wasmModule) {
        const outputArray = new Uint8Array(output);
        const sourcePtr = upscale.wasmModule._malloc(outputArray.length);
        const targetPtr = upscale.wasmModule._malloc(outputArray.length);
        const numPixels = outputArray.length / 4;
        upscale.wasmModule.HEAPU8.set(outputArray, sourcePtr);
        upscale.wasmModule.HEAPU8.set(outputData.value.data, targetPtr);
        upscale.wasmModule._copy_alpha_channel(sourcePtr, targetPtr, numPixels);
        outputData.value.data.set(
            upscale.wasmModule.HEAPU8.subarray(
                targetPtr,
                targetPtr + outputArray.length
            )
        );
        upscale.wasmModule._free(sourcePtr);
        upscale.wasmModule._free(targetPtr);
        upscale.wasmModule = null;
      }

      const imgCtx = imgCanvas.getContext("2d");
      if (imgCtx) {
        imgCtx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
        imgCanvas.width = outputData.value.width;
        imgCanvas.height = outputData.value.height;
        let outImg = imgCtx.createImageData(
            outputData.value.width,
            outputData.value.height
        );
        outImg.data.set(outputData.value.data);
        upscale.input = null;
        upscale.inputAlpha = null;
        outputData.value = null;
        imgCtx.putImageData(outImg, 0, 0);
        let type = "image/jpeg";
        const quality = 1.0;
        if (upscale.hasAlpha) type = "image/png";

        imgCanvas.toBlob(
            (blob: any) => {
              upscale.processedImg = URL.createObjectURL(blob);
            },
            type,
            quality
        );
        upscale.msg = "Done! Time used: " + (Date.now() - start) / 1000 + "s";
        upscale.isProcessing = false;
        upscale.isDone = true;
        worker.terminate();
      }
    }
  };
  if (upscale.input) {
    worker.postMessage(
        {
          input: upscale.input.data.buffer,
          factor: factor.value,
          tile_size: tile_size.value,
          min_lap: min_lap.value,
          model_type: model_type.value,
          width: upscale.input.width,
          height: upscale.input.height,
          model: model.value,
          backend: backend.value,
          hasAlpha: false,
        },
        [upscale.input.data.buffer]
    );
  }
}
</script>
<style scoped lang="scss">
.upscale-params {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;


  .upscale-params-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;

    .upscale-params-item-content {
      width: 49%;

      .upscale-params-title {
        font-size: 13px;
        color: rgba(126, 126, 135, 0.99);
      }
    }

  }

  .upscale-params-btn {
    margin-left: 10px;
    font-size: 16px;
    font-weight: bold;
  }

}
</style>
