<template>
  <div class="upscale-container">
    <AFlex :vertical="false" align="center" justify="flex-start">
      <AAvatar shape="square" :size="30" :src="ai"/>
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
                           v-model:value="type"
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
                           v-model:value="scale"
                           :options="ScaleData.map(item => ({label: item, value: item}))">

                  </ASelect>
                </div>
                <div class="upscale-content-params-item-content">
                  <span class="upscale-content-params-title">分块大小:</span>
                  <ASelect style="width: 100%" size="default"
                           v-model:value="tileSize"
                           :options="tileSizes.map(item => ({label: item, value: item}))">

                  </ASelect>
                </div>
              </div>
              <div class="upscale-content-params-item">
                <div class="upscale-content-params-item-content">
                  <span class="upscale-content-params-title">重复:</span>
                  <ASelect style="width: 100%" size="default"
                           v-model:value="overlap"
                           :options="overlapList.map(item => ({label: item, value: item}))">
                  </ASelect>
                </div>
                <div class="upscale-content-params-item-content">
                  <span class="upscale-content-params-title">运行环境：</span>
                  <ASelect style="width: 100%" size="default"
                           v-model:value="runOn"
                           :options="runOnList.map(item => ({label: item, value: item}))">
                  </ASelect>
                </div>
              </div>
            </div>
            <div class="upscale-content-params-right">
              <AButton type="text" style="width: 60px;height: 60px;">
                <template #icon>
                  <AAvatar shape="square" :size="50" :src="run"/>
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

const TypeData = ['Real-ESRGAN', 'Real-CUGAN'];

const type = ref<string>(TypeData[0]);

const ModelData = {
  'Real-ESRGAN': ['anime_fast', 'anime_plus', 'general_fast', 'general_plus'],
  'Real-CUGAN': ['conservative', 'no-denoise', 'denoise3x'],
};
const model = ref(ModelData[type.value][0]);
const modes = computed(() => {
  return ModelData[type.value];
});
watch(type, val => {
  model.value = ModelData[val][0];
});

// Scale
const ScaleData = [2, 4];
const scale = ref<number>(ScaleData[0]);

//tile size
const tileSizes = [32, 48, 64, 96, 128, 192, 256, 384, 512];
const tileSize = ref<number>(tileSizes[4]);

// overlap
const overlapList = [0, 4, 8, 12, 16, 20];
const overlap = ref<number>(overlapList[3]);

// run on
const runOnList = ['WebGL', 'WebGPU'];
const runOn = [runOnList[0]];
</script>
<style scoped lang="scss" src="./index.scss">

</style>
