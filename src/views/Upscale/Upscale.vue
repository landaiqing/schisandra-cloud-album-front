<template>
  <div class="upscale-container">
    <AFlex :vertical="false" align="center" justify="flex-start">
      <AAvatar shape="square" :size="22" :src="ai"/>
      <span class="upscale-title">图像修复</span>
    </AFlex>
    <AFlex class="upscale-content" :vertical="false" align="center" justify="flex-start">
      <div class="upscale-content-left">
        <ACard class="upscale-content-left-container">
          <UploadImage/>
          <ADivider orientation="center" :plain="true"><span class="upscale-divider-title">参数设置</span></ADivider>
          <div class="upscale-content-left-params">
            <div class="upscale-content-params-left">
              <div class="upscale-content-params-item">
                <div class="upscale-content-params-item-content">
                  <span class="upscale-content-params-title">类型:</span>
                  <ASelect style="width: 100%" size="default"
                           v-model:value="model_type"
                           :options="TypeData.map(item => ({label: item, value: item}))">
                  </ASelect>
                </div>
                <div class="upscale-content-params-item-content">
                  <span class="upscale-content-params-title">模型:</span>
                  <ASelect style="width: 100%" size="default"
                           v-model:value="model"
                           :options="modes.map(item => ({label: item, value: item}))">
                  </ASelect>
                </div>
              </div>
              <div class="upscale-content-params-item">
                <div class="upscale-content-params-item-content">
                  <span class="upscale-content-params-title">比列:</span>
                  <ASelect style="width: 100%" size="default"
                           v-model:value="factor"
                           :options="scales.map(item => ({label: item, value: item}))">

                  </ASelect>
                </div>
                <div class="upscale-content-params-item-content">
                  <span class="upscale-content-params-title">分块大小:</span>
                  <ASelect style="width: 100%" size="default"
                           v-model:value="tile_size"
                           :options="tileSize.map(item => ({label: item, value: item}))">

                  </ASelect>
                </div>
              </div>
              <div class="upscale-content-params-item">
                <div class="upscale-content-params-item-content">
                  <span class="upscale-content-params-title">重复:</span>
                  <ASelect style="width: 100%" size="default"
                           v-model:value="min_lap"
                           :options="overlapList.map(item => ({label: item, value: item}))">
                  </ASelect>
                </div>
                <div class="upscale-content-params-item-content">
                  <span class="upscale-content-params-title">运行环境：</span>
                  <ASelect style="width: 100%" size="default"
                           v-model:value="backend"
                           :options="backendList.map(item => ({label: item, value: item}))">
                  </ASelect>
                </div>
              </div>
            </div>
            <div class="upscale-content-params-right">
              <AButton type="text" style="width: 60px;height: 60px;">
                <template #icon>
                  <AAvatar shape="square" :size="50" :src="run" @click="startTask()"/>
                </template>
              </AButton>
            </div>
          </div>
        </ACard>
      </div>
      <div class="upscale-content-right">
        <ACard class="upscale-content-right-container">
          <CompareResult/>
        </ACard>
      </div>
    </AFlex>
  </div>
</template>
<script setup lang="ts">
import UploadImage from "@/views/Upscale/UploadImage.vue";
import ai from "@/assets/svgs/ai.svg";
import run from "@/assets/svgs/run.svg";
import CompareResult from "@/views/Upscale/CompareResult.vue";
import useStore from "@/store";
import {message} from "ant-design-vue";
import Img from "@/workers/image.ts";


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
/**
 *  函数写法：已废弃，改用WebWorker
 */
// const output = ref<any>();
// const resultUrl = ref<string>();
//
// async function startTask() {
//   if (!upscale.input) return;
//   let outputData: any;
//   if (upscale.hasAlpha && upscale.inputAlpha) {
//     outputData = await processImage(
//         {
//           input: upscale.inputAlpha.data.buffer,
//           factor: factor.value,
//           tile_size: tile_size.value,
//           min_lap: min_lap.value,
//           model_type: model_type.value,
//           width: upscale.inputAlpha.width,
//           height: upscale.inputAlpha.height,
//           model: model.value,
//           backend: backend.value,
//           hasAlpha: true,
//         }
//     );
//   } else {
//     outputData = await processImage({
//       input: upscale.input.data.buffer,
//       factor: factor.value,
//       tile_size: tile_size.value,
//       min_lap: min_lap.value,
//       model_type: model_type.value,
//       width: upscale.input.width,
//       height: upscale.input.height,
//       model: model.value,
//       backend: backend.value,
//       hasAlpha: false
//     });
//   }
//
//   if (outputData) {
//     if (!upscale.hasAlpha || (upscale.hasAlpha && upscale.inputAlpha)) {
//       if (upscale.input) {
//         output.value = new Img(
//             factor.value * upscale.input.width,
//             factor.value * upscale.input.height,
//             new Uint8Array(outputData)
//         );
//       }
//     }
//     if (upscale.hasAlpha && upscale.wasmModule) {
//       const outputArray = new Uint8Array(outputData);
//       const sourcePtr = upscale.wasmModule._malloc(outputArray.length);
//       const targetPtr = upscale.wasmModule._malloc(outputArray.length);
//       const numPixels = outputArray.length / 4;
//       upscale.wasmModule.HEAPU8.set(outputArray, sourcePtr);
//       upscale.wasmModule.HEAPU8.set(output.value.data, targetPtr);
//       upscale.wasmModule._copy_alpha_channel(sourcePtr, targetPtr, numPixels);
//       output.value.data.set(
//           upscale.wasmModule.HEAPU8.subarray(
//               targetPtr,
//               targetPtr + outputArray.length
//           )
//       );
//       upscale.wasmModule._free(sourcePtr);
//       upscale.wasmModule._free(targetPtr);
//       upscale.wasmModule = null;
//     }
//
//     const imgCanvas = document.createElement("canvas");
//     const imgCtx = imgCanvas.getContext("2d");
//     imgCanvas.width = output.value.width;
//     imgCanvas.height = output.value.height;
//     if (imgCtx) {
//       let outImg = imgCtx.createImageData(output.value.width, output.value.height);
//       outImg.data.set(output.value.data);
//       imgCtx.putImageData(outImg, 0, 0);
//       let type = "image/jpeg";
//       let quality = 0.92;
//       if (upscale.hasAlpha) type = "image/png";
//       resultUrl.value = imgCanvas.toDataURL(type, quality);
//       console.log(resultUrl.value);
//     }
//   }
// }

const isProcessing = ref<boolean>(false);
const msg = ref<string>("");
const progressBar = ref<number>(0);
const outputData = ref<any>();
const processedImg = ref<HTMLImageElement>(new Image());
const isDone = ref<boolean>(false);
const imgCanvas = document.createElement("canvas");

const worker = new Worker(new URL("@/workers/upscale.worker.ts", import.meta.url), {
  type: "module",
});

/**
 *  WebWorker写法：使用workerStore
 */
async function startTask() {
  if (upscale.input === null) return;
  isProcessing.value = true;
  const start = Date.now();
  worker.onmessage = (e: MessageEvent<any>) => {
    const {progress, done, output, error, info} = e.data;
    if (info) {
      message.info(info);
      msg.value = info;
    }
    if (error) {
      message.error(error);
      isProcessing.value = false;
      worker.terminate();
      return;
    }
    progressBar.value = progress;

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
      msg.value = "Processing Image...";
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
        let quality = 0.92;
        if (upscale.hasAlpha) type = "image/png";
        if (processedImg.value) {
          imgCanvas.toBlob(
              (blob: any) => {
                processedImg.value.src = URL.createObjectURL(blob);
              },
              type,
              quality
          );
          processedImg.value.onload = () => {
            msg.value = "Done! Time used: " + (Date.now() - start) / 1000 + "s";
          };
        }
        isProcessing.value = false;
        isDone.value = true;
        console.log(processedImg.value);
        console.log(msg.value);
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
<style scoped lang="scss" src="./index.scss">

</style>
