<template>
  <div class="upscale-params">
    <div class="upscale-params-item">
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">类型:</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="upscale.model_type"
                 :options="upscale.TypeData.map(item => ({label: item, value: item}))">
        </ASelect>
      </div>
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">模型:</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="upscale.model"
                 :options="upscale.modes.map((item: any) => ({label: item, value: item}))">
        </ASelect>
      </div>
    </div>
    <div class="upscale-params-item">
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">比列:</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="upscale.factor"
                 :options="upscale.scales.map((item: any) => ({label: item, value: item}))">

        </ASelect>
      </div>
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">分块大小:</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="upscale.tile_size"
                 :options="upscale.tileSize.map((item: any) => ({label: item, value: item}))">

        </ASelect>
      </div>
    </div>
    <div class="upscale-params-item">
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">重复:</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="upscale.min_lap"
                 :options="upscale.overlapList.map((item: any) => ({label: item, value: item}))">
        </ASelect>
      </div>
      <div class="upscale-params-item-content">
        <span class="upscale-params-title">运行环境：</span>
        <ASelect style="width: 100%" size="large"
                 v-model:value="upscale.backend"
                 :options="upscale.backendList.map((item: any) => ({label: item, value: item}))">
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
              upscale.factor * upscale.input.width,
              upscale.factor * upscale.input.height,
              new Uint8Array(output)
          );
        }
      }
      upscale.msg = "Processing Image...";
      if (upscale.inputAlpha) {
        worker.postMessage(
            {
              input: upscale.inputAlpha.data.buffer,
              factor: upscale.factor,
              tile_size: upscale.tile_size,
              min_lap: upscale.min_lap,
              model_type: upscale.model_type,
              width: upscale.inputAlpha.width,
              height: upscale.inputAlpha.height,
              model: upscale.model,
              backend: upscale.backend,
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
          factor: upscale.factor,
          tile_size: upscale.tile_size,
          min_lap: upscale.min_lap,
          model_type: upscale.model_type,
          width: upscale.input.width,
          height: upscale.input.height,
          model: upscale.model,
          backend: upscale.backend,
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
