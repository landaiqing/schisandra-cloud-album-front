<template>
  <div class="user-center-home">
    <!-- 数据卡片区域 -->
    <div class="stats-cards" v-if="chartData">
      <div class="stats-card" data-type="images">
        <div class="stats-card-icon">
          <AAvatar :size="50" shape="square" :src="imageIcon"/>
        </div>
        <div class="stats-card-content">
          <div class="stats-card-title">图片总数</div>
          <div class="stats-card-value">{{ chartData.image_count }}</div>
          <div class="stats-card-footer">
            <span class="stats-card-label">今日上传</span>
            <span class="stats-card-change">+{{ chartData.today_upload_count }}</span>
          </div>
        </div>
      </div>

      <div class="stats-card" data-type="shares">
        <div class="stats-card-icon">
          <AAvatar :size="50" shape="square" :src="shareIcon"/>
        </div>
        <div class="stats-card-content">
          <div class="stats-card-title">分享总数</div>
          <div class="stats-card-value">{{ chartData.share_count }}</div>
          <div class="stats-card-footer">
            <span class="stats-card-label">今日分享</span>
            <span class="stats-card-change">+{{ chartData.today_share_count }}</span>
          </div>
        </div>
      </div>

      <div class="stats-card" data-type="storage">
        <div class="stats-card-icon">
          <AAvatar :size="50" shape="square" :src="fileSize"/>
        </div>
        <div class="stats-card-content">
          <div class="stats-card-title">文件总量</div>
          <div class="stats-card-value">{{ bytesToSize(chartData.file_size_count) }}</div>
          <div class="stats-card-footer">
            <span class="stats-card-label">今日上传</span>
            <span class="stats-card-change">+{{ bytesToSize(chartData.today_file_size_count) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-grid">
      <!-- 月度上传图表区域 -->
      <div class="monthly-chart-section" v-if="chartData">
        <div class="section-header">
          <h3>月度上传数量统计</h3>
        </div>
        <div class="section-body" ref="chartRef">
          <!-- ECharts将在这里渲染 -->
        </div>
      </div>

      <!-- 最近活动区域 -->
      <div class="recent-activity-section">
        <div class="section-header">
          <h3>最近活动</h3>
          <div class="section-actions">
            <AButton type="link">查看全部</AButton>
          </div>
        </div>
        <div class="section-body">
          <div class="activity-list">
            <div class="activity-item" v-for="(item, index) in recentActivities" :key="index">
              <div class="activity-icon" :class="item.type"></div>
              <div class="activity-content">
                <div class="activity-title">{{ item.title }}</div>
                <div class="activity-time">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import imageIcon from "@/assets/svgs/image-icon.svg";
import shareIcon from "@/assets/svgs/share-icon.svg";
import fileSize from "@/assets/svgs/file-size.svg";
import {getUserUploadInfoApi} from "@/api/storage";
import bytesToSize from "@/utils/imageUtils/bytesToSize";
import * as echarts from 'echarts';

const chartData = ref<any>();

// 模拟最近活动数据
const recentActivities = ref([
  {
    type: 'upload',
    title: '上传了5张照片到「旅行相册」',
    time: '今天 14:30'
  },
  {
    type: 'share',
    title: '分享了相册「家庭聚会」',
    time: '昨天 18:45'
  },
  {
    type: 'like',
    title: '收藏了「风景摄影」',
    time: '3天前'
  },
  {
    type: 'comment',
    title: '评论了照片「日落」',
    time: '上周'
  },
  {
    type: 'system',
    title: '系统自动备份了您的照片',
    time: '2周前'
  }
]);

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 处理热力图数据，转换为月度上传数量
const processMonthlyData = (heatmapData: any[]) => {
  if (!heatmapData || !Array.isArray(heatmapData)) return { months: [], counts: [] };

  // 创建一个对象来存储每个月的上传数量
  const monthlyUploads: Record<string, number> = {};

  // 遍历热力图数据，按月份汇总上传数量
  heatmapData.forEach(item => {
    if (item && item.date) {
      // 从日期中提取年月，格式为YYYY-MM
      const date = new Date(item.date);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      // 累加该月份的上传数量
      if (!monthlyUploads[yearMonth]) {
        monthlyUploads[yearMonth] = 0;
      }
      monthlyUploads[yearMonth] += item.count || 0;
    }
  });

  // 获取所有月份并排序
  const sortedMonths = Object.keys(monthlyUploads).sort();

  // 提取排序后的月份和对应的上传数量
  const months = sortedMonths.map(month => {
    // 将YYYY-MM格式转换为更友好的显示格式，如"2023年1月"
    const [year, month2] = month.split('-');
    return `${year}年${parseInt(month2)}月`;
  });
  const counts = sortedMonths.map(month => monthlyUploads[month]);

  return { months, counts };
};

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;

  // 如果图表实例已存在，销毁它
  if (chartInstance) {
    chartInstance.dispose();
  }

  // 创建新的图表实例
  chartInstance = echarts.init(chartRef.value);

  // 使用防抖函数处理resize事件
  const resizeHandler = () => {
    if (chartInstance) {
      nextTick(() => {
        chartInstance.resize();
      });
    }
  };

  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', resizeHandler);

  // 更新图表配置
  updateChartOption();
};

// 更新图表配置
const updateChartOption = () => {
  if (!chartInstance || !chartData.value || !chartData.value.heatmap) return;

  // 处理数据，获取月度上传数量
  const { months, counts } = processMonthlyData(chartData.value.heatmap);

  // 设置图表配置
  const option = {
    backgroundColor: "#fff",
    title: {
      text: "月度上传数量统计",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#333'
      },
      left: "center",
      top: "5%",
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderRadius: 4,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowBlur: 10,
      textStyle: {
        color: "#333",
      },
      padding: [10, 15],
      formatter: '{b}: {c} 次上传'
    },
    grid: {
      top: "15%",
      left: "3%",
      right: "3%",
      bottom: "12%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: months,
        axisLine: {
          lineStyle: {
            color: "#e0e0e0",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          color: "#666",
          fontSize: 12,
          margin: 15,
          rotate: months.length > 6 ? 45 : 0
        },
        boundaryGap: true,
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "上传数量",
        nameTextStyle: {
          color: "#666",
          fontSize: 12,
          padding: [0, 0, 0, 5]
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#e0e0e0",
          },
        },
        axisLabel: {
          color: "#666",
          fontSize: 12
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#f5f5f5",
            type: "dashed"
          }
        },
      }
    ],
    series: [
      {
        name: "上传数量",
        type: "bar",
        barWidth: '40%',
        data: counts,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#42e6ab' },
            { offset: 1, color: '#67ebbb' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3ad598' },
              { offset: 1, color: '#5ae9a9' }
            ])
          }
        }
      }
    ]
  };

  // 应用配置
  chartInstance.setOption(option);
};

async function getData() {
  const res: any = await getUserUploadInfoApi();
  if (res && res.code === 200) {
    chartData.value = res.data;
    // 数据加载完成后初始化图表
    nextTick(() => {
      initChart();
    });
  }
}

onMounted(() => {
  getData();
});

// 组件卸载时清理图表实例和事件监听
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener('resize', () => {});
});
</script>
<style scoped lang="scss">
.user-center-home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  /* 数据卡片区域 */
  .stats-cards {
    display: flex;
    gap: 20px;
    width: 100%;

    .stats-card {
      flex: 1;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      padding: 20px;
      display: flex;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.8;
        z-index: 0;
      }

      &[data-type="images"]::before {
        background: linear-gradient(135deg, rgba(66, 230, 171, 0.1) 0%, rgba(103, 235, 187, 0.1) 100%);
      }

      &[data-type="shares"]::before {
        background: linear-gradient(135deg, rgba(82, 138, 250, 0.1) 0%, rgba(122, 167, 255, 0.1) 100%);
      }

      &[data-type="storage"]::before {
        background: linear-gradient(135deg, rgba(126, 92, 255, 0.1) 0%, rgba(162, 139, 255, 0.1) 100%);
      }

      .stats-card-icon {
        width: 50px;
        height: 50px;
        margin-right: 16px;
        z-index: 1;

        &::after {
          content: '';
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          left: -15px;
          top: -15px;
          z-index: -1;
          opacity: 0.1;
        }
      }

      &[data-type="images"] .stats-card-icon::after {
        background-color: #42e6ab;
      }

      &[data-type="shares"] .stats-card-icon::after {
        background-color: #528afa;
      }

      &[data-type="storage"] .stats-card-icon::after {
        background-color: #7e5cff;
      }

      .stats-card-content {
        flex: 1;
        z-index: 1;

        .stats-card-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .stats-card-value {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin-bottom: 16px;
        }

        .stats-card-footer {
          display: flex;
          align-items: center;
          gap: 8px;

          .stats-card-label {
            font-size: 13px;
            color: #888;
          }

          .stats-card-change {
            font-size: 14px;
            font-weight: 600;
            color: #42e6ab;
          }
        }
      }
    }
  }

  /* 内容网格区域 */
  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    width: 100%;
    flex: 1;

    /* 通用区块样式 */
    .monthly-chart-section,
    .recent-activity-section {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      padding: 20px;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }
      }

      .section-body {
        flex: 1;
      }
    }

    /* 月度上传图表区域特定样式 */
    .monthly-chart-section {
      overflow: hidden;

      .section-body {
        height: 300px; /* 设置固定高度以确保图表正确渲染 */
      }
    }

    /* 最近活动区域特定样式 */
    .recent-activity-section {
      .activity-list {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .activity-item {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f5f5f5;

          &:last-child {
            border-bottom: none;
          }

          .activity-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            margin-right: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            &::before {
              font-family: "Font Awesome 5 Free";
              font-weight: 900;
              font-size: 16px;
              color: white;
            }

            &.upload {
              background-color: #42e6ab;
              &::before { content: '\f093'; } /* upload icon */
            }

            &.share {
              background-color: #528afa;
              &::before { content: '\f064'; } /* share icon */
            }

            &.like {
              background-color: #ff6b6b;
              &::before { content: '\f004'; } /* heart icon */
            }

            &.comment {
              background-color: #ffc107;
              &::before { content: '\f075'; } /* comment icon */
            }

            &.system {
              background-color: #6c757d;
              &::before { content: '\f013'; } /* gear icon */
            }
          }

          .activity-content {
            flex: 1;

            .activity-title {
              font-size: 14px;
              color: #333;
              margin-bottom: 4px;
            }

            .activity-time {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
  }

  /* 响应式设计 */
  @media (max-width: 1024px) {
    .stats-cards {
      flex-direction: column;

      .stats-card {
        width: 100%;
      }
    }

    .content-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    gap: 16px;

    .stats-cards {
      gap: 16px;
    }

    .content-grid {
      gap: 16px;
    }
  }
}
</style>
