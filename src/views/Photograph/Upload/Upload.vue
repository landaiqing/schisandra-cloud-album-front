<template>
  <ADrawer v-model:open="upload.openUploadDrawer" width="40%" placement="right" title="上传照片">
    <template #extra>
      <AFlex :vertical="false" justify="center" align="center" gap="large">
        <ASelect size="middle" style="width: 150px">

        </ASelect>
        <ASelect size="middle" style="width: 150px">

        </ASelect>
      </AFlex>
    </template>
    <div>
      <AUploadDragger
          v-model:fileList="fileList"
          accept="image/*"
          name="file"
          :directory="false"
          :multiple="true"
          @drop="handleDrop"
          :beforeUpload="upload.beforeUpload"
          :customRequest="upload.customUploadRequest"
          :progress="progress"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">Click or drag file to this area to upload</p>
        <p class="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
          band files
        </p>
      </AUploadDragger>
    </div>
  </ADrawer>
</template>
<script setup lang="ts">
import useStore from "@/store";
import {InboxOutlined} from '@ant-design/icons-vue';
import type {UploadProps} from 'ant-design-vue';

const upload = useStore().upload;


const fileList = ref([]);
// const handleChange = (info: UploadChangeParam) => {
//   const status = info.file.status;
//   if (status !== 'uploading') {
//     console.log(info.file, info.fileList);
//   }
//   if (status === 'done') {
//     message.success(`${info.file.name} file uploaded successfully.`);
//   } else if (status === 'error') {
//     message.error(`${info.file.name} file upload failed.`);
//   }
// };

function handleDrop(e: DragEvent) {
  console.log(e);
}

const progress: UploadProps['progress'] = {
  strokeColor: {
    '0%': '#108ee9',
    '100%': '#87d068',
  },
  strokeWidth: 3,
  format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
  class: 'progress-bar',
};
</script>
<style scoped lang="less">

</style>
