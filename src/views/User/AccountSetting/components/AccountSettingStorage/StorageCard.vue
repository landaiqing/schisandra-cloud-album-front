<template>
  <div class="account-setting-storage-card">
    <div class="account-setting-storage-card-header">
      <div style="width: 60px; height: 60px;">
        <AAvatar :size="60" shape="circle" :src="ProviderIcon[storage.provider]"/>
      </div>
      <AFlex :vertical="true" align="flex-start" justify="space-between"
             style="height: 60px;width: 230px;">
        <div style="height: 60px;width: 230px;overflow: auto">
           <span
               style="font-size: 18px; font-weight: bold;">{{ storage.bucket }}</span>
        </div>
        <AFlex :vertical="false" align="center" justify="flex-start" style="height: 60px;width: 230px;overflow: auto">
          <ATag :color="ProviderColorMap[storage.provider]">{{ ProviderNameMap[storage.provider] }}</ATag>
          <ATag v-if="storage.endpoint">{{ storage.endpoint }}</ATag>
        </AFlex>
      </AFlex>
      <APopconfirm
          title="确认删除？"
          ok-text="确认"
          cancel-text="取消"
          placement="bottomRight"
          @confirm="deleteStorage(storage.id, storage.provider, storage.bucket)"
      >
        <template #icon>
          <question-circle-outlined style="color: red"/>
        </template>
        <AButton type="text" size="small" class="delete-icon"
        >
          <template #icon>
            <AAvatar size="small" shape="circle" :src="deleted"/>
          </template>
        </AButton>
      </APopconfirm>
    </div>
    <div class="account-setting-storage-card-content">
      <div class="account-setting-storage-card-content-item">
        <AAvatar size="small" shape="square" :src="bucket"/>
        <span style="color: #999999; font-size: 14px;">{{ storage.capacity }}GB</span>
      </div>
      <div class="account-setting-storage-card-content-item">
        <AAvatar size="small" shape="circle" :src="location"/>
        <span style="color: #999999; font-size: 14px;">{{ AliRegionMap[storage.region] }}</span>
      </div>
      <div class="account-setting-storage-card-content-item">
        <AAvatar size="small" shape="circle" :src="time"/>
        <span style="color: #999999; font-size: 14px;">{{ storage.created_at }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import bucket from "@/assets/svgs/bucket.svg";
import time from "@/assets/svgs/time.svg";
import location from "@/assets/svgs/location-album.svg";
import deleted from "@/assets/svgs/deleted-circle.svg";

import {message} from "ant-design-vue";
import {deleteStorageConfigApi} from "@/api/storage";
import {AliRegionMap, ProviderColorMap, ProviderIcon, ProviderNameMap} from "@/constant/provider_map.ts";

defineProps({
  storage: {
    type: Object,
    required: true
  }
});

/**
 * 删除存储配置
 */
async function deleteStorage(id: number, provider: string, bucket: string) {
  const res: any = await deleteStorageConfigApi(id, provider, bucket);
  if (res && res.code === 200) {
    message.success("删除成功");
  } else {
    message.error("删除失败");
  }
}
</script>

<style scoped lang="scss">
.account-setting-storage-card {
  width: 300px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }

  &:hover .delete-icon {
    opacity: 1;
    transform: scale(1);
  }

  .account-setting-storage-card-header {
    width: 100%;
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
  }

  .delete-icon {
    transform: scale(0);
    transition: all 0.3s ease-in-out;
    opacity: 0;
    position: absolute;
    border-radius: 50%;
    top: -10px;
    right: -10px;
    font-size: 15px;
    cursor: pointer;

  }

  .account-setting-storage-card-content {
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;

    .account-setting-storage-card-content-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
  }
}
</style>
