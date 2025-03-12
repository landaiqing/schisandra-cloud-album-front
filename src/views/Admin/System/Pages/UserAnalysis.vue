<template>
  <div class="user-analysis">
    <a-card title="用户分析" :bordered="false">
      <!-- 搜索表单 -->
      <div class="table-search-wrapper">
        <a-form layout="inline" :model="searchForm">
          <a-form-item label="时间范围">
            <a-range-picker v-model:value="searchForm.timeRange" style="width: 240px" />
          </a-form-item>
          <a-form-item label="用户类型">
            <a-select v-model:value="searchForm.userType" placeholder="请选择用户类型" style="width: 150px" allowClear>
              <a-select-option value="all">全部用户</a-select-option>
              <a-select-option value="new">新注册用户</a-select-option>
              <a-select-option value="active">活跃用户</a-select-option>
              <a-select-option value="inactive">不活跃用户</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="注册来源">
            <a-select v-model:value="searchForm.registerSource" placeholder="请选择注册来源" style="width: 150px" allowClear>
              <a-select-option value="web">网站</a-select-option>
              <a-select-option value="app">移动应用</a-select-option>
              <a-select-option value="wechat">微信</a-select-option>
              <a-select-option value="invite">邀请注册</a-select-option>
            </a-select>
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
        <a-button type="primary" @click="handleExportData">
          <template #icon>
            <download-outlined />
          </template>
          导出数据
        </a-button>
      </div>

      <!-- 统计卡片 -->
      <div class="stat-cards">
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="12" :md="12" :lg="6">
            <a-card>
              <template #title>
                <div class="card-title">
                  <team-outlined class="card-icon user"/>
                  <span>总用户数</span>
                </div>
              </template>
              <div class="card-content">
                <div class="card-value">{{ formatNumber(statistics.totalUsers) }}</div>
                <div class="card-footer">
                  <span class="trend up">
                    <arrow-up-outlined/> {{ statistics.userIncrease }}%
                  </span>
                  <span class="period">较上期</span>
                </div>
              </div>
            </a-card>
          </a-col>

          <a-col :xs="24" :sm="12" :md="12" :lg="6">
            <a-card>
              <template #title>
                <div class="card-title">
                  <user-add-outlined class="card-icon new"/>
                  <span>新增用户</span>
                </div>
              </template>
              <div class="card-content">
                <div class="card-value">{{ formatNumber(statistics.newUsers) }}</div>
                <div class="card-footer">
                  <span class="trend up">
                    <arrow-up-outlined/> {{ statistics.newUserIncrease }}%
                  </span>
                  <span class="period">较上期</span>
                </div>
              </div>
            </a-card>
          </a-col>

          <a-col :xs="24" :sm="12" :md="12" :lg="6">
            <a-card>
              <template #title>
                <div class="card-title">
                  <fire-outlined class="card-icon active"/>
                  <span>活跃用户</span>
                </div>
              </template>
              <div class="card-content">
                <div class="card-value">{{ formatNumber(statistics.activeUsers) }}</div>
                <div class="card-footer">
                  <span class="trend up">
                    <arrow-up-outlined/> {{ statistics.activeUserIncrease }}%
                  </span>
                  <span class="period">较上期</span>
                </div>
              </div>
            </a-card>
          </a-col>

          <a-col :xs="24" :sm="12" :md="12" :lg="6">
            <a-card>
              <template #title>
                <div class="card-title">
                  <interaction-outlined class="card-icon retention"/>
                  <span>留存率</span>
                </div>
              </template>
              <div class="card-content">
                <div class="card-value">{{ statistics.retentionRate }}%</div>
                <div class="card-footer">
                  <span class="trend up">
                    <arrow-up-outlined/> {{ statistics.retentionIncrease }}%
                  </span>
                  <span class="period">较上期</span>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <!-- 图表区域 -->
      <div class="chart-section" style="margin-top: 16px">
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="24" :md="12">
            <a-card title="用户增长趋势" :bordered="false">
              <div class="chart-container" style="height: 350px">
                <!-- 这里可以集成图表库，如ECharts或AntV -->
                <div class="chart-placeholder">用户增长趋势图表</div>
              </div>
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12">
            <a-card title="用户设备分布" :bordered="false">
              <div class="chart-container" style="height: 350px">
                <!-- 这里可以集成图表库，如ECharts或AntV -->
                <div class="chart-placeholder">用户设备分布图表</div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <!-- 用户活跃度分析表格 -->
      <a-card title="用户活跃度分析" :bordered="false" style="margin-top: 16px">
        <a-table
          :columns="activityColumns"
          :data-source="userActivity"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          rowKey="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'activityLevel'">
              <a-tag :color="getActivityLevelColor(record.activityLevel)">
                {{ getActivityLevelText(record.activityLevel) }}
              </a-tag>
            </template>
            <template v-if="column.key === 'trend'">
              <span :class="['trend', record.trend > 0 ? 'up' : 'down']">
                <template v-if="record.trend > 0">
                  <arrow-up-outlined /> +{{ record.trend }}%
                </template>
                <template v-else>
                  <arrow-down-outlined /> {{ record.trend }}%
                </template>
              </span>
            </template>
            <template v-if="column.key === 'action'">
              <a-button type="link" @click="handleViewUserDetail(record)">详情</a-button>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-card>

    <!-- 用户详情对话框 -->
    <a-modal
      v-model:visible="userDetailVisible"
      title="用户详情"
      width="700px"
      :footer="null"
    >
      <template v-if="currentUser">
        <a-descriptions bordered :column="1">
          <a-descriptions-item label="用户ID">{{ currentUser.id }}</a-descriptions-item>
          <a-descriptions-item label="用户名">{{ currentUser.username }}</a-descriptions-item>
          <a-descriptions-item label="注册时间">{{ currentUser.registerTime }}</a-descriptions-item>
          <a-descriptions-item label="最近登录">{{ currentUser.lastLoginTime }}</a-descriptions-item>
          <a-descriptions-item label="活跃度">
            <a-tag :color="getActivityLevelColor(currentUser.activityLevel)">
              {{ getActivityLevelText(currentUser.activityLevel) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="登录设备">{{ currentUser.device }}</a-descriptions-item>
          <a-descriptions-item label="地域">{{ currentUser.location }}</a-descriptions-item>
          <a-descriptions-item label="活跃趋势">
            <div class="chart-container" style="height: 200px">
              <!-- 这里可以集成图表库，如ECharts或AntV -->
              <div class="chart-placeholder">用户活跃趋势图表</div>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  TeamOutlined,
  UserAddOutlined,
  FireOutlined,
  InteractionOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons-vue';

// 搜索表单
const searchForm = reactive({
  timeRange: [],
  userType: undefined,
  registerSource: undefined,
});

// 状态数据
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

// 统计数据
const statistics = reactive({
  totalUsers: 98765,
  userIncrease: 12.5,
  newUsers: 2345,
  newUserIncrease: 18.2,
  activeUsers: 45678,
  activeUserIncrease: 8.7,
  retentionRate: 76.3,
  retentionIncrease: 5.2,
});

// 用户活跃度表格列定义
const activityColumns = [
  {
    title: '用户ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
    key: 'registerTime',
    width: 180,
    sorter: true,
  },
  {
    title: '最近登录',
    dataIndex: 'lastLoginTime',
    key: 'lastLoginTime',
    width: 180,
    sorter: true,
  },
  {
    title: '活跃度',
    dataIndex: 'activityLevel',
    key: 'activityLevel',
    width: 100,
  },
  {
    title: '登录次数',
    dataIndex: 'loginCount',
    key: 'loginCount',
    width: 100,
    sorter: true,
  },
  {
    title: '趋势',
    dataIndex: 'trend',
    key: 'trend',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    fixed: 'right',
  },
];

// 用户活跃度数据
const userActivity = ref<any[]>([]);

// 用户详情相关
const userDetailVisible = ref(false);
const currentUser = ref<any>(null);

// 格式化数字
const formatNumber = (num: number) => {
  return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num.toString();
};

// 获取活跃度颜色
const getActivityLevelColor = (level: string) => {
  const colorMap: Record<string, string> = {
    high: 'green',
    medium: 'blue',
    low: 'orange',
    inactive: 'red',
  };
  return colorMap[level] || 'default';
};

// 获取活跃度文本
const getActivityLevelText = (level: string) => {
  const textMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低',
    inactive: '不活跃',
  };
  return textMap[level] || '未知';
};

// 表格变化处理
const handleTableChange = (pag: any, filters: any, sorter: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;

  // 处理排序
  const sortField = sorter.field;
  const sortOrder = sorter.order;

  // 重新加载数据
  loadUserActivityData(sortField, sortOrder, filters);
};

// 搜索处理
const handleSearch = () => {
  pagination.current = 1;
  loadUserActivityData();
  message.success('搜索成功');
};

// 重置搜索
const resetSearch = () => {
  searchForm.timeRange = [];
  searchForm.userType = undefined;
  searchForm.registerSource = undefined;
  pagination.current = 1;
  loadUserActivityData();
  message.success('已重置搜索条件');
};

// 导出数据
const handleExportData = () => {
  loading.value = true;

  // 模拟导出数据过程
  setTimeout(() => {
    loading.value = false;
    message.success('数据导出成功');
    // 实际项目中这里应该调用后端API获取导出文件
  }, 1000);
};

// 查看用户详情
const handleViewUserDetail = (record: any) => {
  currentUser.value = record;
  userDetailVisible.value = true;
};

// 加载用户活跃度数据
const loadUserActivityData = (sortField?: string, sortOrder?: string, filters?: any) => {
  loading.value = true;

  // 构建查询参数
  const params: any = {
    page: pagination.current,
    pageSize: pagination.pageSize,
    sortField,
    sortOrder,
    ...filters
  };

  // 添加搜索条件
  if (searchForm.timeRange && searchForm.timeRange.length === 2) {
    params.startTime = searchForm.timeRange[0]?.format('YYYY-MM-DD');
    params.endTime = searchForm.timeRange[1]?.format('YYYY-MM-DD');
  }

  if (searchForm.userType) {
    params.userType = searchForm.userType;
  }

  if (searchForm.registerSource) {
    params.registerSource = searchForm.registerSource;
  }

  // 模拟API请求
  setTimeout(() => {
    // 模拟数据
    const mockData = Array.from({ length: 50 }, (_, index) => {
      const id = index + 1;
      const activityLevels = ['high', 'medium', 'low', 'inactive'];
      const activityLevel = activityLevels[Math.floor(Math.random() * activityLevels.length)];
      const trend = Math.floor(Math.random() * 40) - 20; // -20到20之间的随机数

      return {
        id,
        username: `用户${id}`,
        registerTime: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        lastLoginTime: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1} ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
        activityLevel,
        loginCount: Math.floor(Math.random() * 100),
        trend,
        device: Math.random() > 0.5 ? '移动端' : '桌面端',
        location: ['北京', '上海', '广州', '深圳', '杭州'][Math.floor(Math.random() * 5)]
      };
    });

    // 应用排序
    if (sortField && sortOrder) {
      mockData.sort((a, b) => {
        const compareResult = a[sortField] > b[sortField] ? 1 : -1;
        return sortOrder === 'ascend' ? compareResult : -compareResult;
      });
    }

    // 应用筛选
    let filteredData = [...mockData];
    if (params.userType && params.userType !== 'all') {
      if (params.userType === 'active') {
        filteredData = filteredData.filter(item => ['high', 'medium'].includes(item.activityLevel));
      } else if (params.userType === 'inactive') {
        filteredData = filteredData.filter(item => ['low', 'inactive'].includes(item.activityLevel));
      } else if (params.userType === 'new') {
        // 假设最近30天注册的为新用户
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filteredData = filteredData.filter(item => new Date(item.registerTime) >= thirtyDaysAgo);
      }
    }

    // 更新数据和分页
    userActivity.value = filteredData.slice(
      (pagination.current - 1) * pagination.pageSize,
      pagination.current * pagination.pageSize
    );
    pagination.total = filteredData.length;
    loading.value = false;
  }, 500);
};

// 页面加载时获取数据
onMounted(() => {
  loadUserActivityData();
});
</script>

<style scoped>
.user-analysis {
  padding: 16px;
}

.table-search-wrapper {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 4px;
}

.table-operations {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.stat-cards {
  margin-bottom: 16px;
}

.card-title {
  display: flex;
  align-items: center;
}

.card-icon {
  margin-right: 8px;
  font-size: 20px;
}

.card-icon.user {
  color: #1890ff;
}

.card-icon.new {
  color: #52c41a;
}

.card-icon.active {
  color: #fa8c16;
}

.card-icon.retention {
  color: #722ed1;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card-footer {
  display: flex;
  align-items: center;
}

.trend {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.trend.up {
  color: #52c41a;
}

.trend.down {
  color: #f5222d;
}

.period {
  color: #8c8c8c;
  font-size: 12px;
}

.chart-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.chart-placeholder {
  color: #8c8c8c;
  font-size: 14px;
}
</style>
