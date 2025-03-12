<template>
  <div class="visit-statistics">
    <a-card title="访问统计" :bordered="false">
      <!-- 搜索表单 -->
      <div class="table-search-wrapper">
        <a-form layout="inline" :model="searchForm">
          <a-form-item label="时间范围">
            <a-range-picker v-model:value="searchForm.timeRange" style="width: 240px" />
          </a-form-item>
          <a-form-item label="访问来源">
            <a-select v-model:value="searchForm.source" placeholder="请选择访问来源" style="width: 150px" allowClear>
              <a-select-option value="all">全部来源</a-select-option>
              <a-select-option value="direct">直接访问</a-select-option>
              <a-select-option value="search">搜索引擎</a-select-option>
              <a-select-option value="social">社交媒体</a-select-option>
              <a-select-option value="referral">外部链接</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="设备类型">
            <a-select v-model:value="searchForm.device" placeholder="请选择设备类型" style="width: 150px" allowClear>
              <a-select-option value="all">全部设备</a-select-option>
              <a-select-option value="desktop">桌面端</a-select-option>
              <a-select-option value="mobile">移动端</a-select-option>
              <a-select-option value="tablet">平板设备</a-select-option>
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
                  <eye-outlined class="card-icon visits"/>
                  <span>总访问量</span>
                </div>
              </template>
              <div class="card-content">
                <div class="card-value">{{ formatNumber(statistics.totalVisits) }}</div>
                <div class="card-footer">
                  <span class="trend up">
                    <arrow-up-outlined/> {{ statistics.visitsIncrease }}%
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
                  <user-outlined class="card-icon visitors"/>
                  <span>访客数</span>
                </div>
              </template>
              <div class="card-content">
                <div class="card-value">{{ formatNumber(statistics.uniqueVisitors) }}</div>
                <div class="card-footer">
                  <span class="trend up">
                    <arrow-up-outlined/> {{ statistics.visitorsIncrease }}%
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
                  <clock-circle-outlined class="card-icon duration"/>
                  <span>平均停留时间</span>
                </div>
              </template>
              <div class="card-content">
                <div class="card-value">{{ statistics.avgDuration }}分钟</div>
                <div class="card-footer">
                  <span class="trend up">
                    <arrow-up-outlined/> {{ statistics.durationIncrease }}%
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
                  <percentage-outlined class="card-icon bounce"/>
                  <span>跳出率</span>
                </div>
              </template>
              <div class="card-content">
                <div class="card-value">{{ statistics.bounceRate }}%</div>
                <div class="card-footer">
                  <span class="trend down">
                    <arrow-down-outlined/> {{ statistics.bounceDecrease }}%
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
            <a-card title="访问量趋势" :bordered="false">
              <div class="chart-container" style="height: 350px">
                <!-- 这里可以集成图表库，如ECharts或AntV -->
                <div class="chart-placeholder">访问量趋势图表</div>
              </div>
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12">
            <a-card title="访问来源分布" :bordered="false">
              <div class="chart-container" style="height: 350px">
                <!-- 这里可以集成图表库，如ECharts或AntV -->
                <div class="chart-placeholder">访问来源分布图表</div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <!-- 访问记录表格 -->
      <a-card title="访问记录分析" :bordered="false" style="margin-top: 16px">
        <a-table
          :columns="visitColumns"
          :data-source="visitRecords"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          rowKey="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'source'">
              <a-tag :color="getSourceColor(record.source)">
                {{ getSourceText(record.source) }}
              </a-tag>
            </template>
            <template v-if="column.key === 'device'">
              <span>
                <template v-if="record.device === 'desktop'">
                  <laptop-outlined /> 桌面端
                </template>
                <template v-else-if="record.device === 'mobile'">
                  <mobile-outlined /> 移动端
                </template>
                <template v-else-if="record.device === 'tablet'">
                  <tablet-outlined /> 平板设备
                </template>
                <template v-else>
                  <question-circle-outlined /> 未知
                </template>
              </span>
            </template>
            <template v-if="column.key === 'action'">
              <a-button type="link" @click="handleViewVisitDetail(record)">详情</a-button>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-card>

    <!-- 访问详情对话框 -->
    <a-modal
      v-model:visible="visitDetailVisible"
      title="访问详情"
      width="700px"
      :footer="null"
    >
      <template v-if="currentVisit">
        <a-descriptions bordered :column="1">
          <a-descriptions-item label="访问ID">{{ currentVisit.id }}</a-descriptions-item>
          <a-descriptions-item label="IP地址">{{ currentVisit.ipAddress }}</a-descriptions-item>
          <a-descriptions-item label="访问时间">{{ currentVisit.visitTime }}</a-descriptions-item>
          <a-descriptions-item label="停留时间">{{ currentVisit.duration }}分钟</a-descriptions-item>
          <a-descriptions-item label="访问来源">
            <a-tag :color="getSourceColor(currentVisit.source)">
              {{ getSourceText(currentVisit.source) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="设备信息">{{ currentVisit.deviceInfo }}</a-descriptions-item>
          <a-descriptions-item label="浏览器">{{ currentVisit.browser }}</a-descriptions-item>
          <a-descriptions-item label="操作系统">{{ currentVisit.os }}</a-descriptions-item>
          <a-descriptions-item label="地域">{{ currentVisit.location }}</a-descriptions-item>
          <a-descriptions-item label="访问页面">{{ currentVisit.visitedPage }}</a-descriptions-item>
          <a-descriptions-item label="访问路径">
            <div class="chart-container" style="height: 200px">
              <!-- 这里可以集成图表库，如ECharts或AntV -->
              <div class="chart-placeholder">用户访问路径图表</div>
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
  EyeOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PercentageOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LaptopOutlined,
  MobileOutlined,
  TabletOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons-vue';

// 搜索表单
const searchForm = reactive<any>({
  timeRange: [],
  source: undefined,
  device: undefined,
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
  totalVisits: 125678,
  visitsIncrease: 15.3,
  uniqueVisitors: 45890,
  visitorsIncrease: 12.8,
  avgDuration: 4.5,
  durationIncrease: 8.2,
  bounceRate: 35.7,
  bounceDecrease: 5.4,
});

// 访问记录表格列定义
const visitColumns = [
  {
    title: '访问ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    key: 'ipAddress',
    width: 120,
  },
  {
    title: '访问时间',
    dataIndex: 'visitTime',
    key: 'visitTime',
    width: 180,
    sorter: true,
  },
  {
    title: '停留时间(分钟)',
    dataIndex: 'duration',
    key: 'duration',
    width: 120,
    sorter: true,
  },
  {
    title: '访问来源',
    dataIndex: 'source',
    key: 'source',
    width: 120,
  },
  {
    title: '设备类型',
    dataIndex: 'device',
    key: 'device',
    width: 100,
  },
  {
    title: '地域',
    dataIndex: 'location',
    key: 'location',
    width: 100,
  },
  {
    title: '访问页面',
    dataIndex: 'visitedPage',
    key: 'visitedPage',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    fixed: 'right',
  },
];

// 访问记录数据
const visitRecords = ref<any[]>([]);

// 访问详情相关
const visitDetailVisible = ref(false);
const currentVisit = ref<any>(null);

// 格式化数字
const formatNumber = (num: number) => {
  return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num.toString();
};

// 获取来源颜色
const getSourceColor = (source: string) => {
  const colorMap: Record<string, string> = {
    direct: 'blue',
    search: 'green',
    social: 'purple',
    referral: 'orange',
  };
  return colorMap[source] || 'default';
};

// 获取来源文本
const getSourceText = (source: string) => {
  const textMap: Record<string, string> = {
    direct: '直接访问',
    search: '搜索引擎',
    social: '社交媒体',
    referral: '外部链接',
  };
  return textMap[source] || '未知';
};

// 表格变化处理
const handleTableChange = (pag: any, _filters: any, sorter: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;

  // 处理排序
  const sortField = sorter.field;
  const sortOrder = sorter.order;

  // 重新加载数据
  loadVisitRecordsData(sortField, sortOrder);
};

// 加载访问记录数据
const loadVisitRecordsData = (sortField?: string, sortOrder?: string) => {
  loading.value = true;

  // 构建查询参数
  const params: any = {
    page: pagination.current,
    pageSize: pagination.pageSize,
    sortField,
    sortOrder,
  };

  // 添加搜索条件
  if (searchForm.timeRange && searchForm.timeRange.length === 2) {
    params.startTime = searchForm.timeRange[0]?.format('YYYY-MM-DD');
    params.endTime = searchForm.timeRange[1]?.format('YYYY-MM-DD');
  }

  if (searchForm.source && searchForm.source !== 'all') {
    params.source = searchForm.source;
  }

  if (searchForm.device && searchForm.device !== 'all') {
    params.device = searchForm.device;
  }

  // 模拟API请求
  setTimeout(() => {
    // 模拟数据，实际项目中应该通过API获取
    const mockData = Array.from({ length: 50 }, (_, index) => ({
      id: `VIS${100000 + index}`,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      visitTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleString(),
      duration: Math.floor(Math.random() * 30) + 1,
      source: ['direct', 'search', 'social', 'referral'][Math.floor(Math.random() * 4)],
      device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
      location: ['北京', '上海', '广州', '深圳', '杭州', '成都'][Math.floor(Math.random() * 6)],
      visitedPage: ['/home', '/album', '/photo', '/user', '/about'][Math.floor(Math.random() * 5)],
      browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
      os: ['Windows', 'MacOS', 'iOS', 'Android', 'Linux'][Math.floor(Math.random() * 5)],
      deviceInfo: `${['iPhone', 'Samsung', 'Huawei', 'Xiaomi'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 10) + 10}`,
    }));

    // 过滤数据
    let filteredData = [...mockData];

    // 根据搜索条件过滤
    if (params.source) {
      filteredData = filteredData.filter(item => item.source === params.source);
    }

    if (params.device) {
      filteredData = filteredData.filter(item => item.device === params.device);
    }

    // 排序
    if (sortField && sortOrder) {
      filteredData.sort((a, b) => {
        const factor = sortOrder === 'ascend' ? 1 : -1;
        if (sortField === 'duration') {
          return (a.duration - b.duration) * factor;
        } else if (sortField === 'visitTime') {
          return (new Date(a.visitTime).getTime() - new Date(b.visitTime).getTime()) * factor;
        }
        return 0;
      });
    }

    // 分页
    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;
    const paginatedData = filteredData.slice(start, end);

    visitRecords.value = paginatedData;
    pagination.total = filteredData.length;
    loading.value = false;
  }, 500);
};

// 搜索处理
const handleSearch = () => {
  pagination.current = 1; // 重置到第一页
  loadVisitRecordsData();
};

// 重置搜索
const resetSearch = () => {
  searchForm.timeRange = [];
  searchForm.source = undefined;
  searchForm.device = undefined;
  pagination.current = 1;
  loadVisitRecordsData();
};

// 导出数据
const handleExportData = () => {
  loading.value = true;

  // 模拟导出过程
  setTimeout(() => {
    message.success('数据导出成功');
    loading.value = false;
  }, 1000);

  // 实际项目中，这里应该调用后端API导出数据
  // 可以使用window.open或创建一个隐藏的form提交来触发文件下载
};

// 查看访问详情
const handleViewVisitDetail = (record: any) => {
  currentVisit.value = record;
  visitDetailVisible.value = true;
};

// 初始化加载数据
onMounted(() => {
  loadVisitRecordsData();
});

// 添加样式
</script>

<style scoped>
.visit-statistics {
  padding: 16px;
}

.table-search-wrapper {
  margin-bottom: 16px;
}

.table-operations {
  margin-bottom: 16px;
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

.card-icon.visits {
  color: #1890ff;
}

.card-icon.visitors {
  color: #52c41a;
}

.card-icon.duration {
  color: #722ed1;
}

.card-icon.bounce {
  color: #fa8c16;
}

.card-content {
  padding: 8px 0;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card-footer {
  display: flex;
  align-items: center;
  font-size: 14px;
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
  color: rgba(0, 0, 0, 0.45);
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
  color: rgba(0, 0, 0, 0.45);
}
</style>
