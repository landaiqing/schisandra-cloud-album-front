<template>
  <div>
    <ASteps :current="current" :status="current==2?'finish':'process'" @change="handleCurrentChange">
      <AStep title="类型">
      </AStep>
      <AStep title="说明">
      </AStep>
      <AStep title="材料">
      </AStep>
    </ASteps>
    <div class="steps-content">
      <div v-if="current === 0">
        <a-radio-group v-model:value="value">
          <a-radio :style="radioStyle" :value="1">Option A</a-radio>
          <a-radio :style="radioStyle" :value="2">Option B</a-radio>
          <a-radio :style="radioStyle" :value="3">Option C</a-radio>
          <a-radio :style="radioStyle" :value="4">
            More...
            <a-input v-if="value === 4" style="width: 100px; margin-left: 10px"/>
          </a-radio>
        </a-radio-group>
      </div>
      <div v-if="current === 1">
        <a-textarea :rows="8" placeholder="maxlength is 6" :maxlength="6"/>
      </div>
      <div v-if="current === 2">
        <a-upload-dragger
            v-model:fileList="fileList"
            name="file"
            :multiple="true"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            @change="handleChange"
            @drop="handleDrop"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">Click or drag file to this area to upload</p>
          <p class="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p>
        </a-upload-dragger>
      </div>
    </div>
    <div class="steps-action">
      <AButton v-if="current > 0 && current <= 2" @click="prev">上一步</AButton>
      <AButton v-if="current >= 0 && current < 2" type="primary" style="margin-left: 8px" @click="next">下一步</AButton>
      <AButton
          style="margin-left: 8px"
          v-if="current == 2"
          type="primary"
          @click="message.success('Processing complete!')"
      >
        完成
      </AButton>

    </div>
  </div>
</template>
<script lang="ts" setup>
import {reactive, ref} from 'vue';
import type {UploadChangeParam} from 'ant-design-vue';
import {message} from 'ant-design-vue';

const current = ref<number>(0);
const next = () => {
  current.value++;
};
const prev = () => {
  current.value--;
};
function handleCurrentChange(index: number) {
  current.value = index;
}
const value = ref<number>(1);
const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
});


const fileList = ref([]);
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};

function handleDrop(e: DragEvent) {
  console.log(e);
}
</script>
<style scoped lang="less" src="./index.scss">

</style>
