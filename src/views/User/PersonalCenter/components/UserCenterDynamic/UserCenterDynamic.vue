<template>
  <div class="user-center-dynamic">
    <div class="section-header">

    </div>

    <div class="chart-container" ref="chartRef">
      <!-- 图表将在这里渲染 -->
    </div>

    <div class="stats-summary">
      <div class="summary-item">
        <div class="summary-icon visits"></div>
        <div class="summary-content">
          <div class="summary-value">{{ totalVisits }}</div>
          <div class="summary-label">总访问量</div>
        </div>
      </div>

      <div class="summary-item">
        <div class="summary-icon visitors"></div>
        <div class="summary-content">
          <div class="summary-value">{{ totalVisitors }}</div>
          <div class="summary-label">总访客数</div>
        </div>
      </div>

      <div class="summary-item">
        <div class="summary-icon publishes"></div>
        <div class="summary-content">
          <div class="summary-value">{{ totalPublishes }}</div>
          <div class="summary-label">总发布数</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts';
import {getShareStatisticsInfoApi} from "@/api/storage";

interface DataItem {
  date: string;
  visit_count: number;
  visitor_count: number;
  publish_count: number;
}

const chartRef = ref<any>(null);
const dates = ref<string[]>([]);
const visitCounts = ref<number[]>([]);
const visitorCounts = ref<number[]>([]);
const publishCounts = ref<number[]>([]);
// 移除时间范围选择
let chartInstance: echarts.ECharts | null = null;

// 计算总访问量、总访客数和总发布数
const totalVisits = computed(() => {
  return visitCounts.value.reduce((sum, count) => sum + count, 0);
});

const totalVisitors = computed(() => {
  return visitorCounts.value.reduce((sum, count) => sum + count, 0);
});

const totalPublishes = computed(() => {
  return publishCounts.value.reduce((sum, count) => sum + count, 0);
});

async function getData() {
  try {
    const res: any = await getShareStatisticsInfoApi();
    if (res && res.code === 200) {
      const data: DataItem[] = res.data.records;
      dates.value = data.map((item: DataItem) => item.date);
      visitCounts.value = data.map((item: DataItem) => item.visit_count);
      visitorCounts.value = data.map((item: DataItem) => item.visitor_count);
      publishCounts.value = data.map((item: DataItem) => item.publish_count);

      // 数据加载完成后初始化或更新图表
      initChart();
    }
  } catch (error) {
    console.error('获取分享统计数据失败:', error);
  }
}

// 初始化图表
function initChart() {
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

  // 设置图表配置
  updateChartOption();
}

// 更新图表配置
function updateChartOption() {
  if (!chartInstance) return;

  const colorList = ["#6366f1", "#22c55e", "#f97316"];

  const option = {
    backgroundColor: "#fff",
    title: {
      text: "分享统计概览",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#333'
      },
      left: "center",
      top: "5%",
    },
    legend: {
      icon: "circle",
      bottom: "0%",
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 20,
      textStyle: {
        color: "#333",
        fontSize: 12
      }
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
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#6366f1',
          width: 1,
          type: 'dashed'
        }
      }
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
        data: dates.value,
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
          rotate: dates.value.length > 10 ? 45 : 0
        },
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "数量",
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
        name: "浏览次数",
        type: "line",
        data: visitCounts.value,
        symbolSize: 1,
        symbol: "circle",
        smooth: true,
        yAxisIndex: 0,
        showSymbol: false,
        lineStyle: {
          width: 5,
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: "#9effff",
            },
            {
              offset: 1,
              color: "#9E87FF",
            },
          ]),
          shadowColor: "rgba(158,135,255, 0.3)",
          shadowBlur: 10,
          shadowOffsetY: 20,
        },
        itemStyle: {
          color: colorList[0],
          borderColor: colorList[0],
        },
      },
      {
        name: "浏览人数",
        type: "line",
        data: visitorCounts.value,
        symbolSize: 1,
        symbol: "circle",
        smooth: true,
        yAxisIndex: 0,
        showSymbol: false,
        lineStyle: {
          width: 5,
          color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
            {
              offset: 0,
              color: "#73DD39",
            },
            {
              offset: 1,
              color: "#73DDFF",
            },
          ]),
          shadowColor: "rgba(115,221,255, 0.3)",
          shadowBlur: 10,
          shadowOffsetY: 20,
        },
        itemStyle: {
          color: colorList[1],
          borderColor: colorList[1],
        },
      },
      {
        name: "发布次数",
        type: "line",
        data: publishCounts.value,
        symbolSize: 1,
        yAxisIndex: 0,
        symbol: "circle",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 5,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "#fe9a8b",
            },
            {
              offset: 1,
              color: "#fe9a8b",
            },
          ]),
          shadowColor: "rgba(254,154,139, 0.3)",
          shadowBlur: 10,
          shadowOffsetY: 20,
        },
        itemStyle: {
          color: colorList[2],
          borderColor: colorList[2],
        },
      },
    ],
  };
  chartInstance.setOption(option);
}

onBeforeMount(() => {
  getData();
});

onBeforeUnmount(() => {
  if (chartRef.value) {
    const chartInstance = echarts.getInstanceByDom(chartRef.value);
    if (chartInstance) {
      chartInstance.dispose();
    }
  }
});

</script>

<style scoped lang="scss">
.user-center-dynamic {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
  }

  .chart-container {
    flex: 1;
    width: 100%;
    min-height: 350px;
    margin-bottom: 20px;
  }

  .stats-summary {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 10px;

    .summary-item {
      flex: 1;
      background-color: #f9fafb;
      border-radius: 10px;
      padding: 15px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .summary-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        &::before {
          font-family: "Font Awesome 5 Free";
          font-weight: 900;
          font-size: 18px;
          color: white;
        }

        &.visits {
          background-color: #6366f1;
          &::before { content: '\f201'; } /* chart line icon */
        }

        &.visitors {
          background-color: #22c55e;
          &::before { content: '\f007'; } /* user icon */
        }

        &.publishes {
          background-color: #f97316;
          &::before { content: '\f093'; } /* upload icon */
        }
      }

      .summary-content {
        flex: 1;

        .summary-value {
          font-size: 20px;
          font-weight: 700;
          color: #333;
          margin-bottom: 4px;
        }

        .summary-label {
          font-size: 13px;
          color: #666;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .stats-summary {
      flex-direction: column;
      gap: 10px;
    }

    .chart-container {
      min-height: 250px;
    }
  }
}
</style>
