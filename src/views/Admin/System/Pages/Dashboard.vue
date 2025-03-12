<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2>系统仪表盘</h2>
      <div class="dashboard-header-right">
        <ARadioGroup v-model:value="timeRange" button-style="solid">
          <ARadioButton value="today">今日</ARadioButton>
          <ARadioButton value="week">本周</ARadioButton>
          <ARadioButton value="month">本月</ARadioButton>
          <ARadioButton value="year">全年</ARadioButton>
        </ARadioGroup>
        <AButton type="primary" @click="refreshData">
          <template #icon>
            <ReloadOutlined/>
          </template>
          刷新
        </AButton>
      </div>
    </div>

    <div class="stat-cards">
      <ARow :gutter="[16, 16]">
        <ACol :xs="24" :sm="12" :md="12" :lg="6">
          <ACard>
            <template #title>
              <div class="card-title">
                <TeamOutlined class="card-icon user"/>
                <span>用户总数</span>
              </div>
            </template>
            <div class="card-content">
              <div class="card-value">{{ formatNumber(statistics.userCount) }}</div>
              <div class="card-footer">
                <span class="trend up">
                  <ArrowUpOutlined/> {{ statistics.userIncrease }}%
                </span>
                <span class="period">较上期</span>
              </div>
            </div>
          </ACard>
        </ACol>

        <ACol :xs="24" :sm="12" :md="12" :lg="6">
          <ACard>
            <template #title>
              <div class="card-title">
                <FileOutlined class="card-icon content"/>
                <span>内容数量</span>
              </div>
            </template>
            <div class="card-content">
              <div class="card-value">{{ formatNumber(statistics.contentCount) }}</div>
              <div class="card-footer">
                <span class="trend up">
                  <ArrowUpOutlined/> {{ statistics.contentIncrease }}%
                </span>
                <span class="period">较上期</span>
              </div>
            </div>
          </ACard>
        </ACol>

        <ACol :xs="24" :sm="12" :md="12" :lg="6">
          <ACard>
            <template #title>
              <div class="card-title">
                <EyeOutlined class="card-icon visit"/>
                <span>访问量</span>
              </div>
            </template>
            <div class="card-content">
              <div class="card-value">{{ formatNumber(statistics.visitCount) }}</div>
              <div class="card-footer">
                <span class="trend down">
                  <ArrowDownOutlined/> {{ statistics.visitDecrease }}%
                </span>
                <span class="period">较上期</span>
              </div>
            </div>
          </ACard>
        </ACol>

        <ACol :xs="24" :sm="12" :md="12" :lg="6">
          <ACard>
            <template #title>
              <div class="card-title">
                <LikeOutlined class="card-icon like"/>
                <span>好评率</span>
              </div>
            </template>
            <div class="card-content">
              <div class="card-value">{{ statistics.likeRate }}%</div>
              <div class="card-footer">
                <span class="trend up">
                  <ArrowUpOutlined/> {{ statistics.likeIncrease }}%
                </span>
                <span class="period">较上期</span>
              </div>
            </div>
          </ACard>
        </ACol>
      </ARow>
    </div>

    <div class="chart-section">
      <ARow :gutter="[16, 16]">
        <ACol :span="16">
          <ACard title="访问量趋势" :bordered="false">
            <div class="chart-container" style="height: 350px">
              <!-- 这里可以集成图表库，如ECharts或AntV -->
              <div class="chart-placeholder">访问量趋势图表</div>
            </div>
          </ACard>
        </ACol>
        <ACol :span="8">
          <ACard title="用户分布" :bordered="false">
            <div class="chart-container" style="height: 350px">
              <!-- 这里可以集成图表库，如ECharts或AntV -->
              <div class="chart-placeholder">用户分布图表</div>
            </div>
          </ACard>
        </ACol>
      </ARow>
    </div>

    <div class="table-section">
      <ACard title="最近活动" :bordered="false">
        <ATable :columns="columns" :data-source="activities" :pagination="{ pageSize: 5 }"/>
      </ACard>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue';
import {
  TeamOutlined,
  FileOutlined,
  EyeOutlined,
  LikeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined, ReloadOutlined
} from '@ant-design/icons-vue';

// 时间范围选择
const timeRange = ref('today');

// 模拟统计数据
const statistics = reactive({
  userCount: 8846,
  userIncrease: 12.5,
  contentCount: 2356,
  contentIncrease: 8.2,
  visitCount: 132567,
  visitDecrease: 2.8,
  likeRate: 96.8,
  likeIncrease: 1.2
});

// 格式化数字
const formatNumber = (num: number) => {
  return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num.toString();
};

// 表格列定义
const columns = [
  {
    title: '用户',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: '活动类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '详情',
    dataIndex: 'detail',
    key: 'detail',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
];

// 模拟活动数据
const activities = [
  {
    key: '1',
    user: '张三',
    type: '登录',
    detail: '用户登录系统',
    time: '2023-05-20 08:30:00',
  },
  {
    key: '2',
    user: '李四',
    type: '发布',
    detail: '发布了新文章《系统使用指南》',
    time: '2023-05-20 09:15:32',
  },
  {
    key: '3',
    user: '王五',
    type: '评论',
    detail: '评论了文章《产品更新说明》',
    time: '2023-05-20 10:22:15',
  },
  {
    key: '4',
    user: '赵六',
    type: '上传',
    detail: '上传了5张新图片',
    time: '2023-05-20 11:45:03',
  },
  {
    key: '5',
    user: '管理员',
    type: '系统',
    detail: '系统自动备份完成',
    time: '2023-05-20 12:00:00',
  },
];

// 刷新数据
const refreshData = () => {
  // 这里可以根据timeRange的值请求不同时间范围的数据
  console.log('刷新数据，时间范围:', timeRange.value);
  // 模拟数据加载
  // 实际应用中应该调用API获取数据
};

onMounted(() => {
  refreshData();
});
</script>

<style scoped lang="scss">
.dashboard-container {
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .dashboard-header-right {
      display: flex;
      gap: 16px;
    }
  }

  .stat-cards {
    margin-bottom: 24px;

    .card-title {
      display: flex;
      align-items: center;

      .card-icon {
        font-size: 20px;
        margin-right: 8px;

        &.user {
          color: #1890ff;
        }

        &.content {
          color: #52c41a;
        }

        &.visit {
          color: #722ed1;
        }

        &.like {
          color: #fa8c16;
        }
      }
    }

    .card-content {
      .card-value {
        font-size: 28px;
        font-weight: bold;
        margin: 16px 0;
      }

      .card-footer {
        display: flex;
        align-items: center;

        .trend {
          display: flex;
          align-items: center;
          margin-right: 8px;

          &.up {
            color: #52c41a;
          }

          &.down {
            color: #f5222d;
          }
        }

        .period {
          color: rgba(0, 0, 0, 0.45);
          font-size: 12px;
        }
      }
    }
  }

  .chart-section {
    margin-bottom: 24px;

    .chart-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .chart-placeholder {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  }

  .table-section {
    margin-bottom: 24px;
  }
}
</style>
