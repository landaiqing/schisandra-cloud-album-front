<template>
  <div class="account-setting-log">
    <div class="account-setting-log-header">
      <span>执行记录</span>
      <AButton type="text" size="large" shape="circle" @click="refreshLogs">
        <template #icon>
          <RedoOutlined/>
        </template>
      </AButton>
    </div>
    <div class="account-setting-log-body">
      <!-- 筛选和搜索区域 -->
      <div class="log-filter-section">
        <ARow :gutter="18">
          <ACol :span="4">
            <AFormItem label="记录类型">
              <ASelect
                  v-model:value="filterType"
                  placeholder="选择记录类型"
                  style="width: 100%"
                  @change="handleFilterChange"
              >
                <ASelectOption value="all">全部记录</ASelectOption>
                <ASelectOption value="backup">备份记录</ASelectOption>
                <ASelectOption value="task">任务记录</ASelectOption>
              </ASelect>
            </AFormItem>
          </ACol>
          <ACol :span="4">
            <AFormItem label="执行状态">
              <ASelect
                  v-model:value="filterStatus"
                  placeholder="选择执行状态"
                  style="width: 100%"
                  @change="handleFilterChange"
              >
                <ASelectOption value="all">全部状态</ASelectOption>
                <ASelectOption value="success">成功</ASelectOption>
                <ASelectOption value="failed">失败</ASelectOption>
                <ASelectOption value="running">执行中</ASelectOption>
              </ASelect>
            </AFormItem>
          </ACol>
          <ACol :span="8">
            <AFormItem label="执行时间">
              <ARangePicker
                  v-model:value="dateRange"
                  format="YYYY-MM-DD"
                  style="width: 100%"
                  @change="handleFilterChange"
              />
            </AFormItem>
          </ACol>
          <ACol :span="6">
            <AFormItem label="" :colon="false">
              <AInput
                  v-model:value="searchKeyword"
                  placeholder="搜索关键词"
                  allowClear
                  @change="handleFilterChange"
              >
                <template #suffix>
                  <SearchOutlined/>
                </template>
              </AInput>
            </AFormItem>
          </ACol>
        </ARow>
      </div>

      <!-- 备份记录卡片 -->
      <ACard title="备份执行记录" v-if="filterType === 'all' || filterType === 'backup'" class="log-card">
        <template #extra>
          <ATag color="blue">{{ filteredBackupLogs.length }}条记录</ATag>
        </template>
        <AEmpty v-if="filteredBackupLogs.length === 0" description="暂无备份执行记录"/>
        <ATable
            v-else
            :dataSource="filteredBackupLogs"
            :columns="backupColumns"
            :pagination="{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }"
            :rowKey="record => record.id"
        >
          <!-- 备份任务ID -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'task_id'">
              <ATag color="purple">{{ record.task_id }}</ATag>
            </template>
            <!-- 备份源和目标 -->
            <template v-if="column.dataIndex === 'source_target'">
              <div class="storage-info">
                <AFlex align="center" gap="small">
                  <AAvatar v-if="getStorageById(record.source_storage_id)" :size="20" shape="circle"
                           :src="ProviderIcon[getStorageById(record.source_storage_id)?.provider]"/>
                  <span>{{
                      getStorageById(record.source_storage_id) ?
                          `${ProviderNameMap[getStorageById(record.source_storage_id)?.provider]} - ${getStorageById(record.source_storage_id)?.bucket}` : '未知'
                    }}</span>
                </AFlex>
                <ArrowRightOutlined style="margin: 0 8px"/>
                <AFlex align="center" gap="small">
                  <AAvatar v-if="getStorageById(record.target_storage_id)" :size="20" shape="circle"
                           :src="ProviderIcon[getStorageById(record.target_storage_id)?.provider]"/>
                  <span>{{
                      getStorageById(record.target_storage_id) ?
                          `${ProviderNameMap[getStorageById(record.target_storage_id)?.provider]} - ${getStorageById(record.target_storage_id)?.bucket}` : '未知'
                    }}</span>
                </AFlex>
              </div>
            </template>
            <!-- 备份内容 -->
            <template v-if="column.dataIndex === 'content'">
              <div class="content-tags">
                <ATag v-for="item in record.content" :key="item" color="cyan">{{ getContentItemName(item) }}</ATag>
              </div>
            </template>
            <!-- 备份状态 -->
            <template v-if="column.dataIndex === 'status'">
              <ATag :color="getStatusColor(record.status)">
                <template #icon>
                  <span class="status-dot"
                        :class="{'active': record.status === 'success' || record.status === 'running'}"></span>
                </template>
                {{ getStatusText(record.status) }}
              </ATag>
            </template>
            <!-- 备份时间 -->
            <template v-if="column.dataIndex === 'time'">
              <div class="time-info">
                <div>开始：{{ formatDateTime(record.start_time) }}</div>
                <div v-if="record.end_time">结束：{{ formatDateTime(record.end_time) }}</div>
                <div v-if="record.status === 'success'">
                  耗时：{{ calculateDuration(record.start_time, record.end_time) }}
                </div>
              </div>
            </template>
            <!-- 操作 -->
            <template v-if="column.dataIndex === 'action'">
              <AButton type="link" size="small" @click="viewBackupDetail(record)">
                <template #icon>
                  <EyeOutlined/>
                </template>
                查看详情
              </AButton>
            </template>
          </template>
        </ATable>
      </ACard>

      <!-- 任务记录卡片 -->
      <ACard title="定时任务执行记录" v-if="filterType === 'all' || filterType === 'task'" class="log-card">
        <template #extra>
          <ATag color="blue">{{ filteredTaskLogs.length }}条记录</ATag>
        </template>
        <AEmpty v-if="filteredTaskLogs.length === 0" description="暂无任务执行记录"/>
        <ATable
            v-else
            :dataSource="filteredTaskLogs"
            :columns="taskColumns"
            :pagination="{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }"
            :rowKey="record => record.id"
        >
          <!-- 任务类型 -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'task_type'">
              <AFlex align="center" gap="small">
                <AAvatar shape="square" size="small" :src="getTaskIcon(record.task_type)"/>
                <ATag :color="getTaskTypeColor(record.task_type)">{{ getTaskTypeName(record.task_type) }}</ATag>
              </AFlex>
            </template>
            <!-- 任务详情 -->
            <template v-if="column.dataIndex === 'task_detail'">
              <div class="task-detail-info">
                <!-- 备份任务详情 -->
                <template v-if="record.task_type === 'backup'">
                  <div class="detail-item">
                    <span class="label">备份存储：</span>
                    <AFlex align="center" gap="small">
                      <AAvatar v-if="getStorageById(record.storage_id)" :size="20" shape="circle"
                               :src="ProviderIcon[getStorageById(record.storage_id)?.provider]"/>
                      <span>{{
                          getStorageById(record.storage_id) ?
                              `${ProviderNameMap[getStorageById(record.storage_id)?.provider]} - ${getStorageById(record.storage_id)?.bucket}` : '未知'
                        }}</span>
                    </AFlex>
                  </div>
                  <div class="detail-item">
                    <span class="label">备份内容：</span>
                    <div class="content-tags">
                      <ATag v-for="item in record.content" :key="item" color="cyan">{{
                          getContentItemName(item)
                        }}
                      </ATag>
                    </div>
                  </div>
                </template>
                <!-- 清理任务详情 -->
                <template v-if="record.task_type === 'cleanup'">
                  <div class="detail-item">
                    <span class="label">清理策略：</span>
                    <ATag :color="getCleanupStrategyColor(record.strategy)">{{
                        getCleanupStrategyText(record.strategy)
                      }}
                    </ATag>
                  </div>
                  <div v-if="record.strategy !== 'duplicates'" class="detail-item">
                    <span class="label">未使用阈值：</span>
                    <ATag color="orange">{{ record.unused_threshold }}天</ATag>
                  </div>
                </template>
                <!-- 回收站任务详情 -->
                <template v-if="record.task_type === 'recycle'">
                  <div class="detail-item">
                    <span class="label">保留策略：</span>
                    <ATag :color="getRetentionPolicyColor(record.retention_policy)">
                      {{ getRetentionPolicyText(record.retention_policy) }}
                    </ATag>
                  </div>
                  <div v-if="record.retention_policy === 'time'" class="detail-item">
                    <span class="label">保留时间：</span>
                    <ATag color="purple">{{ record.retention_days }}天</ATag>
                  </div>
                </template>
              </div>
            </template>
            <!-- 任务状态 -->
            <template v-if="column.dataIndex === 'status'">
              <ATag :color="getStatusColor(record.status)">
                <template #icon>
                  <span class="status-dot"
                        :class="{'active': record.status === 'success' || record.status === 'running'}"></span>
                </template>
                {{ getStatusText(record.status) }}
              </ATag>
            </template>
            <!-- 执行结果 -->
            <template v-if="column.dataIndex === 'result'">
              <div v-if="record.status === 'success'">
                <template v-if="record.task_type === 'backup'">
                  <div>备份文件：{{ record.files_count || 0 }}个</div>
                  <div>总大小：{{ formatFileSize(record.total_size || 0) }}</div>
                </template>
                <template v-if="record.task_type === 'cleanup'">
                  <div>清理文件：{{ record.files_count || 0 }}个</div>
                  <div>释放空间：{{ formatFileSize(record.freed_space || 0) }}</div>
                </template>
                <template v-if="record.task_type === 'recycle'">
                  <div>清空文件：{{ record.files_count || 0 }}个</div>
                  <div>释放空间：{{ formatFileSize(record.freed_space || 0) }}</div>
                </template>
              </div>
              <div v-else-if="record.status === 'failed'" class="error-message">
                {{ record.error_message || '执行失败' }}
              </div>
              <div v-else>
                {{ record.status === 'running' ? '执行中...' : '未知' }}
              </div>
            </template>
            <!-- 执行时间 -->
            <template v-if="column.dataIndex === 'time'">
              <div class="time-info">
                <div>开始：{{ formatDateTime(record.start_time) }}</div>
                <div v-if="record.end_time">结束：{{ formatDateTime(record.end_time) }}</div>
                <div v-if="record.status === 'success'">
                  耗时：{{ calculateDuration(record.start_time, record.end_time) }}
                </div>
              </div>
            </template>
            <!-- 操作 -->
            <template v-if="column.dataIndex === 'action'">
              <AButton type="link" size="small" @click="viewTaskDetail(record)">
                <template #icon>
                  <EyeOutlined/>
                </template>
                查看详情
              </AButton>
            </template>
          </template>
        </ATable>
      </ACard>
    </div>

    <!-- 详情抽屉 -->
    <ADrawer
        :title="drawerTitle"
        :open="drawerVisible"
        @close="closeDrawer"
        width="600"
        placement="right"
    >
      <div v-if="currentLogDetail" class="log-detail">
        <!-- 备份记录详情 -->
        <template v-if="currentLogType === 'backup'">
          <ADescriptions bordered :column="1">
            <ADescriptionsItem label="备份ID">{{ currentLogDetail.id }}</ADescriptionsItem>
            <ADescriptionsItem label="任务ID">{{ currentLogDetail.task_id }}</ADescriptionsItem>
            <ADescriptionsItem label="源存储">
              <AFlex align="center" gap="small">
                <AAvatar v-if="getStorageById(currentLogDetail.source_storage_id)" :size="20" shape="circle"
                         :src="ProviderIcon[getStorageById(currentLogDetail.source_storage_id)?.provider]"/>
                <span>{{
                    getStorageById(currentLogDetail.source_storage_id) ?
                        `${ProviderNameMap[getStorageById(currentLogDetail.source_storage_id)?.provider]} - ${getStorageById(currentLogDetail.source_storage_id)?.bucket}` : '未知'
                  }}</span>
              </AFlex>
            </ADescriptionsItem>
            <ADescriptionsItem label="目标存储">
              <AFlex align="center" gap="small">
                <AAvatar v-if="getStorageById(currentLogDetail.target_storage_id)" :size="20" shape="circle"
                         :src="ProviderIcon[getStorageById(currentLogDetail.target_storage_id)?.provider]"/>
                <span>{{
                    getStorageById(currentLogDetail.target_storage_id) ?
                        `${ProviderNameMap[getStorageById(currentLogDetail.target_storage_id)?.provider]} - ${getStorageById(currentLogDetail.target_storage_id)?.bucket}` : '未知'
                  }}</span>
              </AFlex>
            </ADescriptionsItem>
            <ADescriptionsItem label="备份内容">
              <div class="content-tags">
                <ATag v-for="item in currentLogDetail.content" :key="item" color="cyan">{{
                    getContentItemName(item)
                  }}
                </ATag>
              </div>
            </ADescriptionsItem>
            <ADescriptionsItem label="备份状态">
              <ATag :color="getStatusColor(currentLogDetail.status)">
                {{ getStatusText(currentLogDetail.status) }}
              </ATag>
            </ADescriptionsItem>
            <ADescriptionsItem label="开始时间">{{ formatDateTime(currentLogDetail.start_time) }}</ADescriptionsItem>
            <ADescriptionsItem label="结束时间" v-if="currentLogDetail.end_time">
              {{ formatDateTime(currentLogDetail.end_time) }}
            </ADescriptionsItem>
            <ADescriptionsItem label="执行耗时" v-if="currentLogDetail.status === 'success'">
              {{ calculateDuration(currentLogDetail.start_time, currentLogDetail.end_time) }}
            </ADescriptionsItem>
            <ADescriptionsItem label="备份文件数" v-if="currentLogDetail.status === 'success'">
              {{ currentLogDetail.files_count || 0 }}个
            </ADescriptionsItem>
            <ADescriptionsItem label="总大小" v-if="currentLogDetail.status === 'success'">
              {{ formatFileSize(currentLogDetail.total_size || 0) }}
            </ADescriptionsItem>
            <ADescriptionsItem label="错误信息" v-if="currentLogDetail.status === 'failed'">
              <div class="error-message">{{ currentLogDetail.error_message || '未知错误' }}</div>
            </ADescriptionsItem>
          </ADescriptions>

          <!-- 备份文件列表 -->
          <div
              v-if="currentLogDetail.status === 'success' && currentLogDetail.files && currentLogDetail.files.length > 0"
              class="files-list">
            <div class="section-title">备份文件列表</div>
            <ATable
                :dataSource="currentLogDetail.files"
                :columns="fileColumns"
                :pagination="{ pageSize: 10 }"
                :rowKey="record => record.path"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'size'">
                  {{ formatFileSize(record.size) }}
                </template>
                <template v-if="column.dataIndex === 'time'">
                  {{ formatDateTime(record.backup_time) }}
                </template>
              </template>
            </ATable>
          </div>
        </template>

        <!-- 任务记录详情 -->
        <template v-if="currentLogType === 'task'">
          <ADescriptions bordered :column="1">
            <ADescriptionsItem label="任务ID">{{ currentLogDetail.id }}</ADescriptionsItem>
            <ADescriptionsItem label="任务类型">
              <AFlex align="center" gap="small">
                <AAvatar shape="square" size="small" :src="getTaskIcon(currentLogDetail.task_type)"/>
                <ATag :color="getTaskTypeColor(currentLogDetail.task_type)">
                  {{ getTaskTypeName(currentLogDetail.task_type) }}
                </ATag>
              </AFlex>
            </ADescriptionsItem>

            <!-- 备份任务特有信息 -->
            <template v-if="currentLogDetail.task_type === 'backup'">
              <ADescriptionsItem label="备份存储">
                <AFlex align="center" gap="small">
                  <AAvatar v-if="getStorageById(currentLogDetail.storage_id)" :size="20" shape="circle"
                           :src="ProviderIcon[getStorageById(currentLogDetail.storage_id)?.provider]"/>
                  <span>{{
                      getStorageById(currentLogDetail.storage_id) ?
                          `${ProviderNameMap[getStorageById(currentLogDetail.storage_id)?.provider]} - ${getStorageById(currentLogDetail.storage_id)?.bucket}` : '未知'
                    }}</span>
                </AFlex>
              </ADescriptionsItem>
              <ADescriptionsItem label="备份内容">
                <div class="content-tags">
                  <ATag v-for="item in currentLogDetail.content" :key="item" color="cyan">{{
                      getContentItemName(item)
                    }}
                  </ATag>
                </div>
              </ADescriptionsItem>
            </template>

            <!-- 清理任务特有信息 -->
            <template v-if="currentLogDetail.task_type === 'cleanup'">
              <ADescriptionsItem label="清理策略">
                <ATag :color="getCleanupStrategyColor(currentLogDetail.strategy)">
                  {{ getCleanupStrategyText(currentLogDetail.strategy) }}
                </ATag>
              </ADescriptionsItem>
              <ADescriptionsItem v-if="currentLogDetail.strategy !== 'duplicates'" label="未使用阈值">
                {{ currentLogDetail.unused_threshold }}天
              </ADescriptionsItem>
            </template>

            <!-- 回收站任务特有信息 -->
            <template v-if="currentLogDetail.task_type === 'recycle'">
              <ADescriptionsItem label="保留策略">
                <ATag :color="getRetentionPolicyColor(currentLogDetail.retention_policy)">
                  {{ getRetentionPolicyText(currentLogDetail.retention_policy) }}
                </ATag>
              </ADescriptionsItem>
              <ADescriptionsItem v-if="currentLogDetail.retention_policy === 'time'" label="保留时间">
                {{ currentLogDetail.retention_days }}天
              </ADescriptionsItem>
            </template>

            <ADescriptionsItem label="执行状态">
              <ATag :color="getStatusColor(currentLogDetail.status)">
                {{ getStatusText(currentLogDetail.status) }}
              </ATag>
            </ADescriptionsItem>
            <ADescriptionsItem label="开始时间">{{ formatDateTime(currentLogDetail.start_time) }}</ADescriptionsItem>
            <ADescriptionsItem label="结束时间" v-if="currentLogDetail.end_time">
              {{ formatDateTime(currentLogDetail.end_time) }}
            </ADescriptionsItem>
            <ADescriptionsItem label="执行耗时" v-if="currentLogDetail.status === 'success'">
              {{ calculateDuration(currentLogDetail.start_time, currentLogDetail.end_time) }}
            </ADescriptionsItem>

            <!-- 执行结果 -->
            <template v-if="currentLogDetail.status === 'success'">
              <template v-if="currentLogDetail.task_type === 'backup'">
                <ADescriptionsItem label="备份文件数">{{ currentLogDetail.files_count || 0 }}个</ADescriptionsItem>
                <ADescriptionsItem label="总大小">{{
                    formatFileSize(currentLogDetail.total_size || 0)
                  }}
                </ADescriptionsItem>
              </template>
              <template v-if="currentLogDetail.task_type === 'cleanup'">
                <ADescriptionsItem label="清理文件数">{{ currentLogDetail.files_count || 0 }}个</ADescriptionsItem>
                <ADescriptionsItem label="释放空间">{{
                    formatFileSize(currentLogDetail.freed_space || 0)
                  }}
                </ADescriptionsItem>
              </template>
              <template v-if="currentLogDetail.task_type === 'recycle'">
                <ADescriptionsItem label="清空文件数">{{ currentLogDetail.files_count || 0 }}个</ADescriptionsItem>
                <ADescriptionsItem label="释放空间">{{
                    formatFileSize(currentLogDetail.freed_space || 0)
                  }}
                </ADescriptionsItem>
              </template>
            </template>

            <ADescriptionsItem label="错误信息" v-if="currentLogDetail.status === 'failed'">
              <div class="error-message">{{ currentLogDetail.error_message || '未知错误' }}</div>
            </ADescriptionsItem>
          </ADescriptions>

          <!-- 任务执行日志 -->
          <div v-if="currentLogDetail.logs && currentLogDetail.logs.length > 0" class="task-logs">
            <div class="section-title">执行日志</div>
            <ATimeline>
              <ATimelineItem v-for="(log, index) in currentLogDetail.logs" :key="index" :color="getLogColor(log.level)">
                <template #dot>
                  <component :is="getLogIcon(log.level)"/>
                </template>
                <div class="log-item">
                  <div class="log-time">{{ formatDateTime(log.timestamp) }}</div>
                  <div class="log-message" :class="`log-${log.level}`">{{ log.message }}</div>
                </div>
              </ATimelineItem>
            </ATimeline>
          </div>
        </template>
      </div>
    </ADrawer>
  </div>
</template>

<script setup lang="ts">
import {message} from 'ant-design-vue';
import {
  RedoOutlined,
  SearchOutlined,
  EyeOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined
} from '@ant-design/icons-vue';
import {listUserStorageConfigApi} from "@/api/storage";
import {ProviderIcon, ProviderNameMap} from "@/constant/provider_map";


import backupIcon from "@/assets/svgs/source-storage.svg";
import cleanupIcon from "@/assets/svgs/cleanup.svg";
import recycleIcon from "@/assets/svgs/deleted.svg";


// 存储列表
const storageList = ref<any>([]);

// 筛选条件
const filterType = ref<any>('all');
const filterStatus = ref<any>('all');
const dateRange = ref<any>([]);
const searchKeyword = ref<any>('');

// 备份执行记录
const backupLogs = ref<any>([]);
// 定时任务执行记录
const taskLogs = ref<any>([]);

// 抽屉相关
const drawerVisible = ref<any>(false);
const drawerTitle = ref<any>('');
const currentLogDetail = ref<any>(null);
const currentLogType = ref<any>('');

// 备份记录表格列定义
const backupColumns = [
  {
    title: '备份ID',
    dataIndex: 'task_id',
    key: 'task_id',
    width: 100,
  },
  {
    title: '备份源和目标',
    dataIndex: 'source_target',
    key: 'source_target',
  },
  {
    title: '备份内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '执行时间',
    dataIndex: 'time',
    key: 'time',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 100,
  },
];

// 任务记录表格列定义
const taskColumns = [
  {
    title: '任务类型',
    dataIndex: 'task_type',
    key: 'task_type',
    width: 120,
  },
  {
    title: '任务详情',
    dataIndex: 'task_detail',
    key: 'task_detail',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '执行结果',
    dataIndex: 'result',
    key: 'result',
    width: 150,
  },
  {
    title: '执行时间',
    dataIndex: 'time',
    key: 'time',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 100,
  },
];

// 文件列表表格列定义
const fileColumns = [
  {
    title: '文件路径',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    key: 'size',
    width: 120,
  },
  {
    title: '备份时间',
    dataIndex: 'time',
    key: 'time',
    width: 120,
  },
];

// 筛选后的备份日志
const filteredBackupLogs = computed(() => {
  return backupLogs.value.filter((log:any) => {
    // 状态筛选
    if (filterStatus.value !== 'all' && log.status !== filterStatus.value) {
      return false;
    }

    // 日期范围筛选
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = dateRange.value[0];
      const endDate = dateRange.value[1];
      const logDate:any = new Date(log.start_time);
      if (logDate < startDate || logDate > endDate) {
        return false;
      }
    }

    // 关键词搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      const sourceStorage:any = getStorageById(log.source_storage_id);
      const targetStorage = getStorageById(log.target_storage_id);
      const sourceText = sourceStorage ? `${ProviderNameMap[sourceStorage.provider]} - ${sourceStorage.bucket}` : '';
      const targetText = targetStorage ? `${ProviderNameMap[targetStorage.provider]} - ${targetStorage.bucket}` : '';

      return log.task_id.toLowerCase().includes(keyword) ||
          sourceText.toLowerCase().includes(keyword) ||
          targetText.toLowerCase().includes(keyword);
    }

    return true;
  });
});

// 筛选后的任务日志
const filteredTaskLogs = computed(() => {
  return taskLogs.value.filter((log:any) => {
    // 状态筛选
    if (filterStatus.value !== 'all' && log.status !== filterStatus.value) {
      return false;
    }

    // 日期范围筛选
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = dateRange.value[0];
      const endDate = dateRange.value[1];
      const logDate:any = new Date(log.start_time);
      if (logDate < startDate || logDate > endDate) {
        return false;
      }
    }

    // 关键词搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      const taskTypeName = getTaskTypeName(log.task_type).toLowerCase();

      return taskTypeName.includes(keyword) ||
          (log.error_message && log.error_message.toLowerCase().includes(keyword));
    }

    return true;
  });
});

// 获取存储信息
const getStorageById = (id) => {
  if (!id) return null;
  return storageList.value.find((item:any) => item.id === id) || null;
};

// 获取内容项名称
const getContentItemName = (item:any) => {
  const contentMap = {
    'photos': '照片',
    'albums': '相册',
    'settings': '设置'
  };
  return contentMap[item] || item;
};

// 获取任务类型图标
const getTaskIcon = (type) => {
  const iconMap = {
    'backup': backupIcon,
    'cleanup': cleanupIcon,
    'recycle': recycleIcon
  };
  return iconMap[type] || backupIcon;
};

// 获取任务类型名称
const getTaskTypeName = (type) => {
  const typeMap = {
    'backup': '定时备份',
    'cleanup': '定时清理',
    'recycle': '回收站管理'
  };
  return typeMap[type] || '未知任务';
};

// 获取任务类型颜色
const getTaskTypeColor = (type) => {
  const colorMap = {
    'backup': '#1890ff',
    'cleanup': '#52c41a',
    'recycle': '#722ed1'
  };
  return colorMap[type] || 'default';
};

// 获取清理策略文本
const getCleanupStrategyText = (strategy) => {
  const strategyMap = {
    'duplicates': '仅清理重复文件',
    'unused': '清理长期未使用文件',
    'both': '两者都清理'
  };
  return strategyMap[strategy] || '未知策略';
};

// 获取清理策略颜色
const getCleanupStrategyColor = (strategy) => {
  const colorMap = {
    'duplicates': 'cyan',
    'unused': 'orange',
    'both': 'green'
  };
  return colorMap[strategy] || 'default';
};

// 获取保留策略文本
const getRetentionPolicyText = (policy) => {
  const policyMap = {
    'all': '清空所有文件',
    'time': '按时间清空'
  };
  return policyMap[policy] || '未知策略';
};

// 获取保留策略颜色
const getRetentionPolicyColor = (policy) => {
  const colorMap = {
    'all': 'red',
    'time': 'purple'
  };
  return colorMap[policy] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'success': '成功',
    'failed': '失败',
    'running': '执行中',
    'pending': '等待中'
  };
  return statusMap[status] || '未知';
};

// 获取状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    'success': 'success',
    'failed': 'error',
    'running': 'processing',
    'pending': 'default'
  };
  return colorMap[status] || 'default';
};

// 获取日志级别颜色
const getLogColor = (level) => {
  const colorMap = {
    'info': 'blue',
    'success': 'green',
    'warning': 'orange',
    'error': 'red'
  };
  return colorMap[level] || 'blue';
};

// 获取日志级别图标
const getLogIcon = (level) => {
  const iconMap = {
    'info': InfoCircleOutlined,
    'success': CheckCircleOutlined,
    'warning': WarningOutlined,
    'error': CloseCircleOutlined
  };
  return iconMap[level] || InfoCircleOutlined;
};

// 格式化日期时间
const formatDateTime = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

// 格式化日期
// const formatDate = (timestamp) => {
//   if (!timestamp) return '-';
//   const date = new Date(timestamp);
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
// };

// 计算时间差
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '-';
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diff = end - start;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}秒`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分${seconds % 60}秒`;

  const hours = Math.floor(minutes / 60);
  return `${hours}小时${minutes % 60}分${seconds % 60}秒`;
};

// 格式化文件大小
const formatFileSize = (size) => {
  if (size === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
};

// 刷新日志
const refreshLogs = async () => {
  try {
    await getBackupLogs();
    await getTaskLogs();
    message.success('刷新成功');
  } catch (error:any) {
    message.error('刷新失败：' + error.message);
  }
};

// 获取备份日志
const getBackupLogs = async () => {
  try {
    // 这里应该调用实际的API获取备份日志
    // 由于API尚未实现，这里使用模拟数据
    backupLogs.value = getMockBackupLogs();
  } catch (error) {
    console.error('获取备份日志失败', error);
    message.error('获取备份日志失败');
  }
};

// 获取任务日志
const getTaskLogs = async () => {
  try {
    // 这里应该调用实际的API获取任务日志
    // 由于API尚未实现，这里使用模拟数据
    taskLogs.value = getMockTaskLogs();
  } catch (error) {
    console.error('获取任务日志失败', error);
    message.error('获取任务日志失败');
  }
};

// 获取存储列表
const getStorageList = async () => {
  try {
    const res: any = await listUserStorageConfigApi();
    if (res.code === 200) {
      storageList.value = res.data.records;
    }
  } catch (error) {
    console.error('获取存储列表失败', error);
  }
};

// 筛选条件变更处理
const handleFilterChange = () => {
  // 筛选条件变更时的处理逻辑
  console.log('筛选条件变更', {
    type: filterType.value,
    status: filterStatus.value,
    dateRange: dateRange.value,
    keyword: searchKeyword.value
  });
};

// 查看备份详情
const viewBackupDetail = (record) => {
  currentLogDetail.value = record;
  currentLogType.value = 'backup';
  drawerTitle.value = '备份执行详情';
  drawerVisible.value = true;
};

// 查看任务详情
const viewTaskDetail = (record) => {
  currentLogDetail.value = record;
  currentLogType.value = 'task';
  drawerTitle.value = '任务执行详情';
  drawerVisible.value = true;
};

// 关闭抽屉
const closeDrawer = () => {
  drawerVisible.value = false;
  currentLogDetail.value = null;
};

// 模拟备份日志数据
const getMockBackupLogs = () => {
  return [
    {
      id: 'backup-001',
      task_id: 'task-001',
      source_storage_id: 'storage-001',
      target_storage_id: 'storage-002',
      content: ['photos', 'albums'],
      status: 'success',
      start_time: '2023-06-01T10:00:00Z',
      end_time: '2023-06-01T10:15:30Z',
      files_count: 120,
      total_size: 1024 * 1024 * 500, // 500MB
      files: [
        {path: '/photos/2023/06/img001.jpg', size: 1024 * 1024 * 2, backup_time: '2023-06-01T10:05:10Z'},
        {path: '/photos/2023/06/img002.jpg', size: 1024 * 1024 * 3, backup_time: '2023-06-01T10:07:20Z'},
        {path: '/albums/summer/cover.jpg', size: 1024 * 1024 * 1, backup_time: '2023-06-01T10:10:30Z'}
      ]
    },
    {
      id: 'backup-002',
      task_id: 'task-002',
      source_storage_id: 'storage-001',
      target_storage_id: 'storage-003',
      content: ['photos'],
      status: 'failed',
      start_time: '2023-06-08T14:00:00Z',
      end_time: '2023-06-08T14:02:10Z',
      error_message: '目标存储空间不足'
    },
    {
      id: 'backup-003',
      task_id: 'task-003',
      source_storage_id: 'storage-002',
      target_storage_id: 'storage-003',
      content: ['photos', 'albums', 'settings'],
      status: 'running',
      start_time: '2023-06-15T09:00:00Z',
      files_count: 45,
      total_size: 1024 * 1024 * 200 // 200MB
    }
  ];
};

// 模拟任务日志数据
const getMockTaskLogs = () => {
  return [
    {
      id: 'task-exec-001',
      task_type: 'backup',
      storage_id: 'storage-002',
      content: ['photos', 'albums'],
      status: 'success',
      start_time: '2023-06-01T10:00:00Z',
      end_time: '2023-06-01T10:15:30Z',
      files_count: 120,
      total_size: 1024 * 1024 * 500, // 500MB
      logs: [
        {level: 'info', message: '开始备份任务', timestamp: '2023-06-01T10:00:00Z'},
        {level: 'info', message: '正在备份照片...', timestamp: '2023-06-01T10:05:00Z'},
        {level: 'info', message: '照片备份完成', timestamp: '2023-06-01T10:10:00Z'},
        {level: 'info', message: '正在备份相册...', timestamp: '2023-06-01T10:10:30Z'},
        {level: 'success', message: '备份任务完成', timestamp: '2023-06-01T10:15:30Z'}
      ]
    },
    {
      id: 'task-exec-002',
      task_type: 'cleanup',
      strategy: 'duplicates',
      status: 'success',
      start_time: '2023-06-05T02:00:00Z',
      end_time: '2023-06-05T02:30:45Z',
      files_count: 35,
      freed_space: 1024 * 1024 * 150, // 150MB
      logs: [
        {level: 'info', message: '开始清理任务', timestamp: '2023-06-05T02:00:00Z'},
        {level: 'info', message: '扫描重复文件...', timestamp: '2023-06-05T02:05:00Z'},
        {level: 'warning', message: '发现35个重复文件', timestamp: '2023-06-05T02:15:00Z'},
        {level: 'info', message: '正在清理重复文件...', timestamp: '2023-06-05T02:20:00Z'},
        {level: 'success', message: '清理任务完成，释放了150MB空间', timestamp: '2023-06-05T02:30:45Z'}
      ]
    },
    {
      id: 'task-exec-003',
      task_type: 'recycle',
      retention_policy: 'time',
      retention_days: 30,
      status: 'failed',
      start_time: '2023-06-10T03:00:00Z',
      end_time: '2023-06-10T03:01:15Z',
      error_message: '无法连接到回收站服务',
      logs: [
        {level: 'info', message: '开始回收站清理任务', timestamp: '2023-06-10T03:00:00Z'},
        {level: 'warning', message: '连接回收站服务超时', timestamp: '2023-06-10T03:00:30Z'},
        {level: 'error', message: '无法连接到回收站服务', timestamp: '2023-06-10T03:01:15Z'}
      ]
    }
  ];
};

// 页面加载时获取数据
onMounted(async () => {
  await getStorageList();
  await getBackupLogs();
  await getTaskLogs();
});
</script>

<style scoped lang="scss" src="./index.scss">

</style>
