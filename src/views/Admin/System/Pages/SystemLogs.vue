<template>
  <div class="system-logs">
    <a-card title="系统日志" :bordered="false">
      <!-- 搜索表单 -->
      <div class="table-search-wrapper">
        <a-form layout="inline" :model="searchForm">
          <a-form-item label="日志类型">
            <a-select v-model:value="searchForm.logType" placeholder="请选择日志类型" style="width: 150px" allowClear>
              <a-select-option value="operation">操作日志</a-select-option>
              <a-select-option value="login">登录日志</a-select-option>
              <a-select-option value="error">错误日志</a-select-option>
              <a-select-option value="system">系统日志</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="操作人">
            <a-input v-model:value="searchForm.operator" placeholder="请输入操作人" allowClear />
          </a-form-item>
          <a-form-item label="IP地址">
            <a-input v-model:value="searchForm.ipAddress" placeholder="请输入IP地址" allowClear />
          </a-form-item>
          <a-form-item label="操作时间">
            <a-range-picker v-model:value="searchForm.timeRange" style="width: 240px" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">
              <template #icon>
                <search-outlined />
              </template>
              搜索
            </a-button>
            <a-button style="margin-left: 8px" @click="resetSearch">
              <template #icon>
                <reload-outlined />
              </template>
              重置
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      
      <!-- 操作按钮 -->
      <div class="table-operations">
        <a-button type="primary" @click="handleExportLogs">
          <template #icon>
            <download-outlined />
          </template>
          导出日志
        </a-button>
        <a-button danger style="margin-left: 8px" @click="handleClearLogs">
          <template #icon>
            <delete-outlined />
          </template>
          清空日志
        </a-button>
      </div>
      
      <!-- 日志表格 -->
      <a-table
        :columns="columns"
        :data-source="logList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'logType'">
            <a-tag :color="getLogTypeColor(record.logType)">
              {{ getLogTypeText(record.logType) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'success' ? 'green' : 'red'">
              {{ record.status === 'success' ? '成功' : '失败' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="handleViewLogDetail(record)">详情</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
    
    <!-- 日志详情对话框 -->
    <a-modal
      v-model:visible="logDetailVisible"
      title="日志详情"
      width="700px"
      :footer="null"
    >
      <template v-if="currentLog">
        <a-descriptions bordered :column="1">
          <a-descriptions-item label="日志ID">{{ currentLog.id }}</a-descriptions-item>
          <a-descriptions-item label="日志类型">
            <a-tag :color="getLogTypeColor(currentLog.logType)">
              {{ getLogTypeText(currentLog.logType) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="操作人">{{ currentLog.operator }}</a-descriptions-item>
          <a-descriptions-item label="操作模块">{{ currentLog.module }}</a-descriptions-item>
          <a-descriptions-item label="操作内容">{{ currentLog.operation }}</a-descriptions-item>
          <a-descriptions-item label="操作状态">
            <a-tag :color="currentLog.status === 'success' ? 'green' : 'red'">
              {{ currentLog.status === 'success' ? '成功' : '失败' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="IP地址">{{ currentLog.ipAddress }}</a-descriptions-item>
          <a-descriptions-item label="操作时间">{{ currentLog.operateTime }}</a-descriptions-item>
          <a-descriptions-item label="详细信息" v-if="currentLog.details">
            <div class="log-details">
              <pre>{{ currentLog.details }}</pre>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { SearchOutlined, ReloadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons-vue';

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '日志类型',
    dataIndex: 'logType',
    key: 'logType',
    width: 100,
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
    width: 120,
  },
  {
    title: '操作模块',
    dataIndex: 'module',
    key: 'module',
    width: 120,
  },
  {
    title: '操作内容',
    dataIndex: 'operation',
    key: 'operation',
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    key: 'ipAddress',
    width: 120,
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    key: 'operateTime',
    width: 180,
    sorter: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    fixed: 'right',
  },
];

// 状态数据
const loading = ref(false);
const logList = ref<any[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

// 搜索表单
const searchForm = reactive({
  logType: undefined,
  operator: '',
  ipAddress: '',
  timeRange: [],
});

// 日志详情相关
const logDetailVisible = ref(false);
const currentLog = ref<any>(null);

// 获取日志列表
const fetchLogList = () => {
  loading.value = true;
  // 模拟API调用
  setTimeout(() => {
    // 模拟API响应
    pagination.total = logList.value.length;
    loading.value = false;
  }, 500);
};

// 搜索处理
const handleSearch = () => {
  pagination.current = 1;
  fetchLogList();
};

// 重置搜索
const resetSearch = () => {
  searchForm.logType = undefined;
  searchForm.operator = '';
  searchForm.ipAddress = '';
  searchForm.timeRange = [];
  pagination.current = 1;
  fetchLogList();
};

// 表格变化处理（分页、排序、筛选）
const handleTableChange = (pag: any, _filters: any, sorter: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  
  // 处理排序
  if (sorter.field && sorter.order) {
    // 实际应用中应该将排序参数传递给API
    console.log('排序字段:', sorter.field);
    console.log('排序方式:', sorter.order);
  }
  
  fetchLogList();
};

// 查看日志详情
const handleViewLogDetail = (record: any) => {
  currentLog.value = record;
  logDetailVisible.value = true;
};

// 导出日志
const handleExportLogs = () => {
  loading.value = true;
  // 模拟导出操作
  setTimeout(() => {
    message.success('日志导出成功');
    loading.value = false;
  }, 1000);
};

// 清空日志
const handleClearLogs = () => {
  Modal.confirm({
    title: '确认操作',
    content: '确定要清空所有日志吗？此操作不可恢复！',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      loading.value = true;
      // 模拟清空操作
      setTimeout(() => {
        logList.value = [];
        pagination.total = 0;
        message.success('日志已清空');
        loading.value = false;
      }, 1000);
    },
  });
};

// 获取日志类型颜色
const getLogTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    operation: 'blue',
    login: 'green',
    error: 'red',
    system: 'orange',
  };
  return colorMap[type] || 'default';
};

// 获取日志类型文本
const getLogTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    operation: '操作日志',
    login: '登录日志',
    error: '错误日志',
    system: '系统日志',
  };
  return textMap[type] || '未知类型';
};

// 初始化
onMounted(() => {
  // 模拟日志数据
  logList.value = [
    {
      id: 1,
      logType: 'login',
      operator: 'admin',
      module: '用户认证',
      operation: '用户登录',
      status: 'success',
      ipAddress: '192.168.1.100',
      operateTime: '2023-05-15 10:30:45',
      details: '{"browser":"Chrome","os":"Windows","device":"Desktop"}',
    },
    {
      id: 2,
      logType: 'operation',
      operator: 'admin',
      module: '用户管理',
      operation: '创建新用户：user01',
      status: 'success',
      ipAddress: '192.168.1.100',
      operateTime: '2023-05-15 11:20:15',
      details: '{"userId":101,"username":"user01","email":"user01@example.com"}',
    },
    {
      id: 3,
      logType: 'operation',
      operator: 'admin',
      module: '角色管理',
      operation: '修改角色权限：编辑者',
      status: 'success',
      ipAddress: '192.168.1.100',
      operateTime: '2023-05-15 14:05:30',
      details: '{"roleId":2,"permissions":["view","edit"]}',
    },
    {
      id: 4,
      logType: 'error',
      operator: 'user01',
      module: '文件上传',
      operation: '上传文件失败',
      status: 'failed',
      ipAddress: '192.168.1.101',
      operateTime: '2023-05-16 09:15:22',
      details: '{"error":"文件大小超过限制","fileSize":"15MB","maxSize":"10MB"}',
    },
    {
      id: 5,
      logType: 'system',
      operator: 'system',
      module: '系统维护',
      operation: '系统自动备份',
      status: 'success',
      ipAddress: '127.0.0.1',
      operateTime: '2023-05-16 23:00:00',
      details: '{"backupFile":"backup_20230516.zip","size":"256MB"}',
    },
    {
      id: 6,
      logType: 'login',
      operator: 'user01',
      module: '用户认证',
      operation: '用户登录失败',
      status: 'failed',
      ipAddress: '192.168.1.102',
      operateTime: '2023-05-17 08:45:10',
      details: '{"reason":"密码错误","attempts":3}',
    },
  ];
  
  fetchLogList();
});
</script>

<style scoped lang="scss">
.system-logs {
  .table-search-wrapper {
    margin-bottom: 16px;
  }
  
  .table-operations {
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
  }
  
  .log-details {
    max-height: 300px;
    overflow-y: auto;
    background-color: #f5f5f5;
    padding: 8px;
    border-radius: 4px;
    
    pre {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}
</style>