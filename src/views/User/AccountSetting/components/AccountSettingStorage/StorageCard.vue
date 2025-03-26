<template>
  <div class="account-setting-storage-card" @click="showStorageDetail">
    <div class="account-setting-storage-card-header">
      <div style="width: 40px; height: 40px;">
        <AAvatar :size="40" shape="circle" :src="ProviderIcon[storage.provider]"/>
      </div>
      <AFlex :vertical="true" align="flex-start" justify="space-between"
             style="height: 40px;width: 170px;">
        <div style="width: 170px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
           <span style="font-size: 16px; font-weight: bold;">{{ storage.bucket }}</span>
        </div>
        <AFlex :vertical="false" align="center" justify="flex-start" style="width: 170px;overflow: hidden;">
          <ATag :color="ProviderColorMap[storage.provider]">{{ ProviderNameMap[storage.provider] }}</ATag>
          <ATag v-if="storage.endpoint" style="max-width: 110px;overflow: hidden;text-overflow: ellipsis;">{{ storage.endpoint }}</ATag>
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
        <AButton @click.stop type="text" size="small" class="delete-icon"
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
        <span style="color: #999999; font-size: 13px;">{{ storage.capacity }}GB</span>
      </div>
      <div class="account-setting-storage-card-content-item">
        <AAvatar size="small" shape="circle" :src="location"/>
        <span style="color: #999999; font-size: 13px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 85px;">{{ AliRegionMap[storage.region] }}</span>
      </div>
      <div class="account-setting-storage-card-content-item">
        <AAvatar size="small" shape="circle" :src="time"/>
        <span style="color: #999999; font-size: 13px;">{{ storage.created_at }}</span>
      </div>
    </div>

    <!-- 存储详情模态窗口 -->
    <AModal
      v-model:open="storageDetailVisible"
      title="存储详情"
      :width="600"
      :footer="null"
      @cancel="storageDetailVisible = false"
    >
      <div class="storage-detail-container">
        <!-- 存储基本信息 -->
        <div class="storage-detail-header">
          <AAvatar :size="60" shape="circle" :src="ProviderIcon[storage.provider]"/>
          <div class="storage-detail-title">
            <h2>{{ storage.bucket }}</h2>
            <div class="storage-detail-tags">
              <ATag :color="ProviderColorMap[storage.provider]">{{ ProviderNameMap[storage.provider] }}</ATag>
              <ATag v-if="storage.endpoint">{{ storage.endpoint }}</ATag>
            </div>
          </div>
        </div>

        <!-- 存储详细信息 -->
        <div class="storage-detail-info">
          <div class="storage-detail-info-item">
            <AAvatar size="small" shape="square" :src="bucket"/>
            <span class="storage-detail-label">存储容量:</span>
            <span class="storage-detail-value">{{ storage.capacity }}GB</span>
          </div>
          <div class="storage-detail-info-item">
            <AAvatar size="small" shape="circle" :src="location"/>
            <span class="storage-detail-label">存储区域:</span>
            <span class="storage-detail-value">{{ AliRegionMap[storage.region] }}</span>
          </div>
          <div class="storage-detail-info-item">
            <AAvatar size="small" shape="circle" :src="time"/>
            <span class="storage-detail-label">创建时间:</span>
            <span class="storage-detail-value">{{ storage.created_at }}</span>
          </div>
          <div class="storage-detail-info-item" v-if="storage.access_key">
            <AAvatar size="small" shape="circle" :src="storage"/>
            <span class="storage-detail-label">访问密钥:</span>
            <span class="storage-detail-value">{{ storage.access_key.substring(0, 8) }}****</span>
          </div>
          <div class="storage-detail-info-item" v-if="storage.secret_key">
            <AAvatar size="small" shape="circle" :src="storage"/>
            <span class="storage-detail-label">访问密钥:</span>
            <span class="storage-detail-value">******</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="storage-detail-actions">
          <AButton type="primary" @click="testStorageConnection">
            <template #icon><check-outlined /></template>
            测试连接
          </AButton>
          <AButton type="default" @click="viewStorageFiles">
            <template #icon><folder-outlined /></template>
            查看文件
          </AButton>
          <APopconfirm
            title="确认删除？"
            ok-text="确认"
            cancel-text="取消"
            @confirm="deleteStorage(storage.id, storage.provider, storage.bucket); storageDetailVisible = false"
          >
            <AButton danger>
              <template #icon><delete-outlined /></template>
              删除存储
            </AButton>
          </APopconfirm>
        </div>
      </div>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import bucket from "@/assets/svgs/bucket.svg";
import time from "@/assets/svgs/time.svg";
import location from "@/assets/svgs/location-album.svg";
import deleted from "@/assets/svgs/deleted-circle.svg";
import {message} from "ant-design-vue";
import {CheckOutlined, FolderOutlined, DeleteOutlined} from "@ant-design/icons-vue";
import {deleteStorageConfigApi} from "@/api/storage";
import {AliRegionMap, ProviderColorMap, ProviderIcon, ProviderNameMap} from "@/constant/provider_map.ts";
import {ref} from "vue";

defineProps({
  storage: {
    type: Object,
    required: true
  }
});

// 存储详情模态窗口可见性
const storageDetailVisible = ref(false);

/**
 * 显示存储详情
 */
function showStorageDetail(_event: MouseEvent) {
  storageDetailVisible.value = true;
}

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

/**
 * 测试存储连接
 */
function testStorageConnection() {
  message.info("测试连接功能正在开发中");
}

/**
 * 查看存储文件
 */
function viewStorageFiles() {
  message.info("查看文件功能正在开发中");
}
</script>

<style scoped lang="scss">
.account-setting-storage-card {
  width: 260px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 8px;
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
  padding: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }

  &:hover .delete-icon {
    opacity: 1;
    transform: scale(1);
  }

  .account-setting-storage-card-header {
    width: 100%;
    height: 55px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 6px;
    margin-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 6px;
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
    height: 55px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 6px;
    padding-top: 4px;

    .account-setting-storage-card-content-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 6px;
      height: 25px;
    }
  }
}

// 存储详情模态窗口样式
.storage-detail-container {
  padding: 16px;

  .storage-detail-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;

    .storage-detail-title {
      h2 {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
      }

      .storage-detail-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    }
  }

  .storage-detail-info {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;

    .storage-detail-info-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .storage-detail-label {
        color: #666;
        font-size: 14px;
        width: 80px;
      }

      .storage-detail-value {
        color: #333;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }

  .storage-detail-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
