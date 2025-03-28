<template>
  <div class="account-setting-backup">
    <div class="account-setting-backup-header">
      <span>图像备份</span>
      <AButton type="text" size="large" shape="circle" @click="getStorageList">
        <template #icon>
          <RedoOutlined />
        </template>
      </AButton>
    </div>
    <div class="account-setting-backup-body" v-if="storageList && storageList.length > 1">
      <div class="backup-container">
        <div class="backup-section source-section">
          <div class="section-title">
            <AAvatar shape="square" size="small" :src="sourceIcon" />
            <span>源存储</span>
          </div>
          <div class="storage-selection">
            <AForm layout="vertical">
              <AFormItem label="存储商" name="sourceProvider">
                <ASelect
                    v-model:value="sourceStorage.id"
                    placeholder="请选择源存储商"
                    @change="handleSourceProviderChange"
                >
                  <ASelectOption
                      v-for="item in storageList"
                      :key="item.id"
                      :value="item.id"
                  >
                    <AFlex align="center" gap="small">
                      <AAvatar :size="20" shape="circle" :src="ProviderIcon[item.provider]" />
                      <span>{{ ProviderNameMap[item.provider] }} - {{ item.bucket }}</span>
                    </AFlex>
                  </ASelectOption>
                </ASelect>
              </AFormItem>
            </AForm>
            <div class="selected-storage-card" v-if="selectedSourceStorage">
              <div class="storage-card-header">
                <AAvatar :size="40" shape="circle" :src="ProviderIcon[selectedSourceStorage.provider]" />
                <div class="storage-info">
                  <div class="storage-name">{{ selectedSourceStorage.bucket }}</div>
                  <ATag :color="ProviderColorMap[selectedSourceStorage.provider]">
                    {{ ProviderNameMap[selectedSourceStorage.provider] }}
                  </ATag>
                </div>
              </div>
              <div class="storage-card-content">
                <div class="storage-detail">
                  <AAvatar size="small" shape="square" :src="bucket" />
                  <div class="detail-text">
                    <div class="detail-label">存储容量</div>
                    <div class="detail-value">{{ selectedSourceStorage.capacity }}GB</div>
                  </div>
                </div>
                <div class="storage-detail">
                  <AAvatar size="small" shape="circle" :src="location" />
                  <div class="detail-text">
                    <div class="detail-label">存储区域</div>
                    <div class="detail-value">{{ AliRegionMap[selectedSourceStorage.region] || selectedSourceStorage.region }}</div>
                  </div>
                </div>
                <div class="storage-detail">
                  <AAvatar size="small" shape="square" :src="endpointIcon" />
                  <div class="detail-text">
                    <div class="detail-label">访问端点</div>
                    <div class="detail-value">{{ selectedSourceStorage.endpoint }}</div>
                  </div>
                </div>
                <div class="storage-detail">
                  <AAvatar size="small" shape="square" :src="dateIcon" />
                  <div class="detail-text">
                    <div class="detail-label">创建时间</div>
                    <div class="detail-value">{{ formatDate(selectedSourceStorage.created_at) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="backup-arrow">
          <ArrowRightOutlined />
        </div>

        <div class="backup-section target-section">
          <div class="section-title">
            <AAvatar shape="square" size="small" :src="targetIcon" />
            <span>目标存储</span>
          </div>
          <div class="storage-selection">
            <AForm layout="vertical">
              <AFormItem label="存储商" name="targetProvider">
                <ASelect
                    v-model:value="targetStorage.id"
                    placeholder="请选择目标存储商"
                    @change="handleTargetProviderChange"
                    :disabled="!sourceStorage.id"
                >
                  <ASelectOption
                      v-for="item in availableTargetStorages"
                      :key="item.id"
                      :value="item.id"
                  >
                    <AFlex align="center" gap="small">
                      <AAvatar :size="20" shape="circle" :src="ProviderIcon[item.provider]" />
                      <span>{{ ProviderNameMap[item.provider] }} - {{ item.bucket }}</span>
                    </AFlex>
                  </ASelectOption>
                </ASelect>
              </AFormItem>
            </AForm>
            <div class="selected-storage-card" v-if="selectedTargetStorage">
              <div class="storage-card-header">
                <AAvatar :size="40" shape="circle" :src="ProviderIcon[selectedTargetStorage.provider]" />
                <div class="storage-info">
                  <div class="storage-name">{{ selectedTargetStorage.bucket }}</div>
                  <ATag :color="ProviderColorMap[selectedTargetStorage.provider]">
                    {{ ProviderNameMap[selectedTargetStorage.provider] }}
                  </ATag>
                </div>
              </div>
              <div class="storage-card-content">
                <div class="storage-detail">
                  <AAvatar size="small" shape="square" :src="bucket" />
                  <div class="detail-text">
                    <div class="detail-label">存储容量</div>
                    <div class="detail-value">{{ selectedTargetStorage.capacity }}GB</div>
                  </div>
                </div>
                <div class="storage-detail">
                  <AAvatar size="small" shape="circle" :src="location" />
                  <div class="detail-text">
                    <div class="detail-label">存储区域</div>
                    <div class="detail-value">{{ AliRegionMap[selectedTargetStorage.region] || selectedTargetStorage.region }}</div>
                  </div>
                </div>
                <div class="storage-detail">
                  <AAvatar size="small" shape="square" :src="endpointIcon" />
                  <div class="detail-text">
                    <div class="detail-label">访问端点</div>
                    <div class="detail-value">{{ selectedTargetStorage.endpoint }}</div>
                  </div>
                </div>
                <div class="storage-detail">
                  <AAvatar size="small" shape="square" :src="dateIcon" />
                  <div class="detail-text">
                    <div class="detail-label">创建时间</div>
                    <div class="detail-value">{{ formatDate(selectedTargetStorage.created_at) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="backup-action">
        <AButton
            type="primary"
            size="large"
            :disabled="!isBackupReady"
            @click="startBackup"
            :loading="backupInProgress"
        >
          开始备份
        </AButton>
      </div>

      <AModal v-model:open="backupModalVisible" title="备份进度" :footer="null" :closable="!backupInProgress" :maskClosable="false">
        <div class="backup-progress">
          <AProgress :percent="backupProgress" status="active" />
          <div class="backup-status">{{ backupStatus }}</div>
          <div class="backup-actions" v-if="backupInProgress && backupTaskId">
            <AButton danger @click="cancelBackup">取消备份</AButton>
          </div>
        </div>
      </AModal>
    </div>
    <div class="account-setting-backup-empty" v-else>
      <AEmpty description="请先添加至少两个存储策略才能进行备份操作" />
      <AButton type="primary" @click="goToStoragePage">前往添加存储</AButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RedoOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';
import { listUserStorageConfigApi } from "@/api/storage";
import { backupStorageApi, getBackupProgressApi, cancelBackupTaskApi } from "@/api/storage/backup";
import { message } from "ant-design-vue";
import { AliRegionMap, ProviderColorMap, ProviderIcon, ProviderNameMap } from "@/constant/provider_map.ts";
import bucket from "@/assets/svgs/bucket.svg";
import location from "@/assets/svgs/location-album.svg";
import sourceIcon from "@/assets/svgs/source-storage.svg";
import targetIcon from "@/assets/svgs/target-storage.svg";

const router = useRouter();
const storageList = ref<any[]>([]);
const sourceStorage = ref({ id: null });
const targetStorage = ref({ id: null });
const selectedSourceStorage = ref<any>(null);
const selectedTargetStorage = ref<any>(null);
const backupModalVisible = ref(false);
const backupProgress = ref(0);
const backupStatus = ref('准备开始备份...');
const backupInProgress = ref(false);
const backupTaskId = ref('');

import dateIcon from "@/assets/svgs/time.svg";
import endpointIcon from "@/assets/svgs/endpoint.svg";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 获取存储列表
async function getStorageList() {
  const res: any = await listUserStorageConfigApi();
  if (res && res.code === 200) {
    storageList.value = res.data.records;
    // 重置选择
    sourceStorage.value = { id: null };
    targetStorage.value = { id: null };
    selectedSourceStorage.value = null;
    selectedTargetStorage.value = null;
  }
}

// 计算可用的目标存储（排除已选择的源存储）
const availableTargetStorages = computed(() => {
  if (!sourceStorage.value.id) return [];
  return storageList.value.filter(item => item.id !== sourceStorage.value.id);
});

// 判断是否可以开始备份
const isBackupReady = computed(() => {
  return selectedSourceStorage.value && selectedTargetStorage.value;
});

// 处理源存储商选择变化
function handleSourceProviderChange(value) {
  if (!value) {
    selectedSourceStorage.value = null;
    return;
  }

  const selected = storageList.value.find(item => item.id === value);

  if (selected) {
    selectedSourceStorage.value = selected;
    // 如果目标存储与源存储相同，则清空目标存储
    if (targetStorage.value.id === value) {
      targetStorage.value.id = null;
      selectedTargetStorage.value = null;
    }
  } else {
    selectedSourceStorage.value = null;
  }
}

// 处理目标存储商选择变化
function handleTargetProviderChange(value) {
  if (!value) {
    selectedTargetStorage.value = null;
    return;
  }

  const selected = storageList.value.find(item => item.id === value);

  if (selected) {
    selectedTargetStorage.value = selected;
  } else {
    selectedTargetStorage.value = null;
  }
}

// 开始备份
async function startBackup() {
  if (!isBackupReady.value) return;

  backupModalVisible.value = true;
  backupInProgress.value = true;
  backupProgress.value = 0;
  backupStatus.value = '正在准备备份...';

  try {
    const res: any = await backupStorageApi(
        selectedSourceStorage.value.id,
        selectedTargetStorage.value.id
    );

    if (res && res.code === 200) {
      backupTaskId.value = res.data.task_id;
      message.success('备份任务已启动');

      // 定时获取备份进度
      const progressTimer = setInterval(async () => {
        if (backupTaskId.value) {
          const progressRes: any = await getBackupProgressApi(backupTaskId.value);

          if (progressRes && progressRes.code === 200) {
            const { progress, status, message: statusMessage } = progressRes.data;

            backupProgress.value = progress;
            backupStatus.value = statusMessage || status;

            // 备份完成
            if (progress >= 100 || status === 'completed') {
              backupProgress.value = 100;
              backupStatus.value = '备份完成！';
              backupInProgress.value = false;
              backupTaskId.value = '';
              clearInterval(progressTimer);

              message.success('备份成功！');
              setTimeout(() => {
                backupModalVisible.value = false;
              }, 1500);
            }

            // 备份失败
            if (status === 'failed') {
              backupInProgress.value = false;
              backupTaskId.value = '';
              clearInterval(progressTimer);

              message.error(statusMessage || '备份失败');
            }
          }
        } else {
          clearInterval(progressTimer);
        }
      }, 2000);
    } else {
      message.error(res?.message || '启动备份任务失败');
      backupInProgress.value = false;
    }
  } catch (error) {
    console.error('备份错误:', error);
    message.error('备份过程中发生错误');
    backupInProgress.value = false;
  }
}

// 前往存储页面
function goToStoragePage() {
  router.push('/main/user/setting/storage');
}

// 取消备份
async function cancelBackup() {
  if (!backupTaskId.value) return;

  try {
    const res: any = await cancelBackupTaskApi(backupTaskId.value);

    if (res && res.code === 200) {
      message.success('备份任务已取消');
      backupInProgress.value = false;
      backupTaskId.value = '';
      backupStatus.value = '备份已取消';
    } else {
      message.error(res?.message || '取消备份任务失败');
    }
  } catch (error) {
    console.error('取消备份错误:', error);
    message.error('取消备份过程中发生错误');
  }
}

onMounted(() => {
  getStorageList();
});
</script>

<style scoped lang="scss">
/* 样式保持不变 */
.account-setting-backup {
  width: 100%;
  //height: 100%;
  //overflow: auto;

  .account-setting-backup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 16px 20px;
    background-color: var(--white-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    span {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
      position: relative;
      padding-left: 12px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 18px;
        background: #1890ff;
        border-radius: 2px;
      }
    }

    .ant-btn {
      border-radius: 8px;
      height: 40px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }

  .account-setting-backup-body {
    background-color: var(--white-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    padding: 24px;

    .backup-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;

      @media (max-width: 768px) {
        flex-direction: column;
      }

      .backup-section {
        flex: 1;
        background-color: #f9f9f9;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #e8e8e8;

          span {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }
        }

        .storage-selection {
          .selected-storage-card {
            margin-top: 16px;
            background: linear-gradient(145deg, #ffffff, #f5f7fa);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

            .storage-card-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 16px;

              .storage-info {
                .storage-name {
                  font-size: 16px;
                  font-weight: 600;
                  margin-bottom: 4px;
                }
              }
            }

            .storage-card-content {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin-top: 12px;

              .storage-detail {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px;
                background: rgba(245, 245, 245, 0.5);
                border-radius: 8px;

                .detail-text {
                  display: flex;
                  flex-direction: column;

                  .detail-label {
                    font-size: 12px;
                    color: #999;
                  }

                  .detail-value {
                    font-size: 14px;
                    font-weight: 500;
                    color: #333;
                  }
                }
              }
            }
          }
        }
      }

      .source-section {
        border-left: 3px solid #52c41a;
      }

      .target-section {
        border-left: 3px solid #1890ff;
      }

      .backup-arrow {
        font-size: 24px;
        color: #1890ff;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        background-color: #e6f7ff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
        animation: pulse 1.5s infinite;

        @media (max-width: 768px) {
          transform: rotate(90deg);
          margin: 10px 0;
        }
      }
    }

    .backup-action {
      display: flex;
      justify-content: center;
      margin-top: 30px;

      .ant-btn {
        height: 48px;
        padding: 0 40px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 24px;
        background: linear-gradient(135deg, #1890ff, #096dd9);
        border: none;
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(24, 144, 255, 0.4);
        }

        &:disabled {
          background: #f5f5f5;
          color: #bfbfbf;
          box-shadow: none;
        }
      }
    }

    .backup-progress {
      text-align: center;

      .backup-status {
        margin-top: 16px;
        color: #666;
        font-size: 14px;
      }

      .backup-actions {
        margin-top: 20px;
        display: flex;
        justify-content: center;

        .ant-btn {
          border-radius: 20px;
          height: 36px;
          padding: 0 20px;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 77, 79, 0.2);
          }
        }
      }
    }
  }

  .account-setting-backup-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    background-color: var(--white-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .ant-btn {
      margin-top: 20px;
      height: 40px;
      border-radius: 20px;
      padding: 0 24px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
