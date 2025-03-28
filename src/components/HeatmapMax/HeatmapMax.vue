<template>
  <div ref="containerRef" class="heatmap-container">
    <!-- 标题和颜色图例 -->
    <div class="header">
      <h3 class="month-title">{{ currentMonthTitle }}</h3>
      <div class="legend">
        <span class="legend-text">低</span>
        <div v-for="(color, index) in colorLevels" :key="index" class="legend-item">
          <a-tooltip :title="color.description">
            <div class="legend-block" :style="{ backgroundColor: color.color }" />
          </a-tooltip>
        </div>
        <span class="legend-text">高</span>
      </div>
    </div>

    <!-- 主图表区域 -->
    <div class="chart-wrapper">

      <!-- 贡献图主体 -->
      <div class="chart-body">
        <!-- 星期坐标轴 -->
        <div class="weekday-axis">
          <div v-for="(weekday, index) in weekdays" :key="index" class="weekday-label">{{ weekday }}</div>
        </div>

        <!-- 贡献格子 -->
        <div class="weeks-container" :style="{ gap: `${cellGap}px` }">
          <div
            v-for="(week, wi) in visibleWeeks"
            :key="wi"
            class="week-column"
            :style="{ gap: `${cellGap}px` }"
          >
            <a-tooltip
              v-for="(day, di) in week"
              :key="di"
              :mouseEnterDelay="0.3"
              :title="`${formatTooltip(day.date)}: ${day.count} 次上传`"
            >
              <div
                class="day-cell"
                :style="{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  backgroundColor: getColor(day.count)
                }"
              />
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import {
  format,
  startOfWeek,
  addDays,
  eachDayOfInterval,
  getMonth,
  parseISO,
  getYear,
  subDays
} from 'date-fns';
import type { PropType } from 'vue';
import { zhCN } from 'date-fns/locale';

interface Contribution {
  date: string;
  count: number;
}

interface ColorLevel {
  color: string;
  min: number;
  max: number;
  description: string;
}

interface MonthLabel {
  name: string;
  position: number;
}

const props = defineProps({
  contributions: {
    type: Array as PropType<Contribution[]>,
    required: true
  },
  colorLevels: {
    type: Array as PropType<ColorLevel[]>,
    default: () => [
      {
        color: '#ebedf0',
        min: 0,
        max: 0,
        description: '没有上传'
      },
      {
        color: '#9be9a8',
        min: 1,
        max: 3,
        description: '1-3 上传'
      },
      {
        color: '#40c463',
        min: 4,
        max: 5,
        description: '4-5 上传'
      },
      {
        color: '#30a14e',
        min: 6,
        max: 7,
        description: '6-7 上传'
      },
      {
        color: '#216e39',
        min: 8,
        max: Infinity,
        description: '8+ 上传'
      }
    ]
  },
  // 新增：可配置显示的周数
  weeksToShow: {
    type: Number,
    default: 52 // 默认显示52周，一年
  },
  // 新增：可配置星期标签
  weekdayLabels: {
    type: Array as PropType<string[]>,
    default: () => ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  }
});

const containerRef = ref<HTMLElement | null>(null);
const cellSize = ref(12); // 初始单元格大小
const cellGap = ref(3); // 初始单元格间距
// 使用可配置的星期标签，并确保正确显示7天
const weekdays = computed(() => {
  // 如果用户提供了自定义标签，使用用户提供的标签
  // 否则使用默认的7天标签
  return props.weekdayLabels;
});
const visibleWeeks = ref<Array<Array<{ date: Date; count: number }>>>([]);

// 响应式变量，用于控制图表尺寸
const chartWidth = ref(0);
const chartHeight = ref(0);

// 当前月份标题
const currentMonthTitle = computed(() => {
  const today = new Date();
  return format(today, 'yyyy年MM月', { locale: zhCN });
});

// 更新尺寸函数
const updateSize = () => {
  if (!containerRef.value) return;

  const container = containerRef.value;
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // 保留边距空间，考虑到星期标签的空间
  const availableWidth = containerWidth - 70; // 左右边距，增加左侧星期标签的空间
  const availableHeight = containerHeight - 110; // 上下边距，考虑标题和底部空间

  // 更新图表尺寸
  chartWidth.value = availableWidth;
  chartHeight.value = availableHeight;

  // 计算单元格尺寸，确保合理的显示效果
  // 对于单月视图，周数通常为4-6周
  const weeksCount = visibleWeeks.value.length || 6; // 默认按6周计算
  const daysCount = 7; // 一周7天

  // 计算单元格的最大可能尺寸
  const maxCellWidth = Math.max(1, (availableWidth - 50) / weeksCount); // 水平方向，确保至少为1
  const maxCellHeight = Math.max(1, availableHeight / daysCount); // 垂直方向，确保至少为1
  
  // 取较小值确保单元格是正方形，但为单月视图增加单元格大小
  const maxCellSize = Math.min(maxCellWidth, maxCellHeight);

  // 设置单元格大小和间距，单月视图可以使用更大的单元格
  cellSize.value = Math.max(8, Math.min(18, maxCellSize - 2)); // 减去2给间距留空间，最小值改为8，最大值增加到18
  cellGap.value = Math.max(2, Math.min(4, cellSize.value * 0.15)); // 最小间距改为2

  // 强制下一帧更新DOM
  nextTick(() => {
    // 确保星期标签正确分布
    const weekdayAxis = container.querySelector('.weekday-axis');
    if (weekdayAxis) {
      const weekdayLabels = weekdayAxis.querySelectorAll('.weekday-label');
      const totalLabels = weekdayLabels.length;
      
      if (totalLabels > 0) {
        // 计算每个标签应该的位置
        weekdayLabels.forEach((label, index) => {
          const element = label as HTMLElement;
          // 平均分布标签
          element.style.height = `${100 / totalLabels}%`;
          element.style.display = 'flex';
          element.style.alignItems = 'center';
        });
      }
    }
  });
};

// 日期有效性检查
const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

// 生成当前月份的日期网格
const generateDateGrid = () => {
  const today = new Date();
  
  // 获取当前月份的第一天
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  
  // 获取当前月份的最后一天
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
  // 获取第一天所在周的周一
  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }); // 从周一开始
  
  // 获取最后一天（或今天，取较早的日期）
  const endDate = today > lastDayOfMonth ? lastDayOfMonth : today;

  const weeksArray: Date[][] = [];
  let currentWeekStart = startDate;

  while (currentWeekStart <= endDate) {
    const weekEnd = addDays(currentWeekStart, 6);
    const weekDays = eachDayOfInterval({
      start: currentWeekStart,
      end: weekEnd > endDate ? endDate : weekEnd
    }).filter(date => isValidDate(date));

    if (weekDays.length > 0) {
      weeksArray.push(weekDays);
    }

    currentWeekStart = addDays(currentWeekStart, 7);
  }

  return weeksArray;
};

// 处理贡献数据，只显示当前月份的数据
const processContributions = () => {
  // 获取当前月份
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const contributionMap = new Map(
    props.contributions
      .filter(c => {
        try {
          const date = parseISO(c.date);
          // 只保留当前月份的数据
          return isValidDate(date) && 
                 date.getMonth() === currentMonth && 
                 date.getFullYear() === currentYear;
        } catch {
          return false;
        }
      })
      .map(c => [format(parseISO(c.date), 'yyyy-MM-dd'), c.count])
  );

  return generateDateGrid()
    .map(week =>
      week.map(date => ({
        date,
        count: contributionMap.get(format(date, 'yyyy-MM-dd')) || 0
      }))
    )
    .filter(week => week.length > 0);
};

// 不再需要月份标签，因为只显示当前月份
const monthLabels = computed(() => []);

// 颜色匹配逻辑
const getColor = (count: number) => {
  return (
    props.colorLevels.find(l => count >= l.min && count <= l.max)?.color ||
    '#ebedf0'
  );
};

// 格式化工具提示
const formatTooltip = (date: Date) => {
  return format(date, 'yyyy年MM月dd日 EEEE', { locale: zhCN });
};

// 监听贡献数据变化
watch(
  () => props.contributions,
  () => {
    visibleWeeks.value = processContributions();
    nextTick(() => {
      updateSize();
    });
  },
  { deep: true }
);

// 初始化
onMounted(() => {
  // 先处理数据
  visibleWeeks.value = processContributions();

  // 立即执行一次更新尺寸，确保初始渲染正确
  nextTick(() => {
    updateSize();
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', updateSize);
  });

  // 使用ResizeObserver监听容器大小变化
  const observer = new ResizeObserver(() => {
    updateSize();
  });

  if (containerRef.value) {
    observer.observe(containerRef.value);
    
    // 同时监听父容器的大小变化
    const parentElement = containerRef.value.parentElement;
    if (parentElement) {
      observer.observe(parentElement);
    }
  }
  
  // 清理函数
  onBeforeUnmount(() => {
    if (observer) observer.disconnect();
    window.removeEventListener('resize', updateSize);
  });
});
</script>

<style scoped>
.heatmap-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  padding: 20px 15px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.month-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #24292e;
}

.legend {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
  font-size: 12px;
}

.legend-text {
  color: #999999;
  font-size: 12px;
}

.legend-item {
  display: flex;
}

.legend-item + .legend-item {
  margin-left: 2px;
}

.legend-block {
  width: 14px;
  height: 14px;
  border-radius: 2px;
}

.chart-wrapper {
  position: relative;
  margin-top: 40px;
  margin-left: 40px;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.month-axis {
  position: absolute;
  top: -25px;
  left: 0;
  right: 0;
  height: 20px;
  white-space: nowrap;
}

.month-label {
  position: absolute;
  font-size: 11px;
  color: #586069;
  transform: translateX(-50%);
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

.chart-body {
  display: flex;
  flex: 1;
}

.weekday-axis {
  position: absolute;
  left: -35px;
  top: 0;
  bottom: 0;
  width: 30px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.weekday-label {
  font-size: 10px;
  color: #586069;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  height: calc(100% / 7); /* 确保7个标签均匀分布 */
  display: flex;
  align-items: center;
}

.weeks-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  padding-right: 20px;
  width: 100%;
  height: 100%;
}

.weeks-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.week-column {
  display: flex;
  flex-direction: column;
}

.day-cell {
  border-radius: 2px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.day-cell:hover {
  transform: scale(1.15);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .heatmap-container {
    padding: 15px 10px;
  }

  .legend {
    top: 5px;
    right: 5px;
    padding: 3px 6px;
    gap: 2px;
  }

  .legend-block {
    width: 12px;
    height: 12px;
  }

  .legend-text {
    font-size: 10px;
  }

  .chart-wrapper {
    margin-top: 35px;
    margin-left: 30px;
  }

  .weekday-axis {
    left: -25px;
    width: 20px;
  }

  .weekday-label {
    font-size: 9px;
  }
}
</style>