<template>
  <div ref="containerRef" class="contribution-container">
    <!-- 颜色图例 -->
    <div class="legend">
      <span style="color: #999999">低</span>
      <div v-for="(color, index) in colorLevels" :key="index" class="legend-item">
        <a-tooltip :title="color.description">
          <div class="legend-block" :style="{ backgroundColor: color.color }"/>
        </a-tooltip>
      </div>
      <span style="color: #999999">高</span>
    </div>

    <!-- 主图表区域 -->
    <div class="chart-wrapper">
      <!-- 月份坐标轴 -->
      <div class="month-axis" v-if="monthLabels.length">
        <div
            v-for="(month, index) in monthLabels"
            :key="index"
            class="month-label"
            :style="{ left: month.position + '%' }"
        >
          {{ month.name }}
        </div>
      </div>

      <!-- 贡献图主体 -->
      <div class="chart-body">
        <!-- 星期坐标轴 -->
        <div class="weekday-axis">
          <div v-for="(weekday, index) in weekdays" :key="index">{{ weekday }}</div>
        </div>

        <!-- 贡献格子 -->
        <div class="weeks-container" :style="{ gap: cellGap + 'px' }">
          <div
              v-for="(week, wi) in visibleWeeks"
              :key="wi"
              class="week-column"
              :style="{ gap: cellGap + 'px' }"
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
                  width: cellSize + 'px',
                  height: cellSize + 'px',
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
import {ref, computed, onMounted, onBeforeUnmount, nextTick} from 'vue';
import {
  format,
  startOfWeek,
  addDays,
  eachDayOfInterval,
  getMonth,
  parseISO,
  getYear
} from 'date-fns';
import type {PropType} from 'vue';
import {zhCN} from 'date-fns/locale';

interface Contribution {
  date: string
  count: number
}

interface ColorLevel {
  color: string
  min: number
  max: number
  description: string
}

interface MonthLabel {
  name: string
  position: number
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
  }
});

const containerRef = ref<HTMLElement>();
// 设置固定的初始值，避免从小到大的变化
const cellSize = ref(12);
const cellGap = ref(3);
const weekdays = ['Mon', 'Wed', 'Fri'];
const visibleWeeks = ref<Array<Array<{ date: Date; count: number }>>>([]);

// 响应式变量，用于控制图表宽度
const chartMaxWidth = ref(0);

// 优化updateSize函数，移除debounce，避免延迟导致的动画效果
const updateSize = () => {
  if (!containerRef.value) return;

  const container = containerRef.value;
  const containerWidth = container.offsetWidth - 60; // 增加边距
  const containerHeight = container.offsetHeight - 80;

  // 动态计算最大宽度
  chartMaxWidth.value = containerWidth - 40;

  // 计算单元格尺寸，确保合理的显示效果
  const maxCellSize = Math.min(
      (containerWidth - 40) / 54, // 更精确的计算
      containerHeight / 7 - 3 // 使用固定的间距值，避免循环依赖
  );

  // 设置单元格大小和间距
  cellSize.value = Math.max(8, Math.min(14, maxCellSize));
  cellGap.value = Math.max(2, Math.min(4, cellSize.value * 0.15));
};

// 日期有效性检查
const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

// 生成标准的GitHub风格日期网格
const generateDateGrid = () => {
  const today = new Date();
  const startDate = startOfWeek(addDays(today, -358)); // 52周前
  const endDate = today;

  const weeksArray: Date[][] = [];
  let currentWeekStart = startOfWeek(startDate, {weekStartsOn: 0}); // 从周日开始

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

  return weeksArray.slice(-52); // 严格52周
};

// 处理贡献数据
const processContributions = () => {
  const contributionMap = new Map(
      props.contributions
          .filter(c => {
            try {
              const date = parseISO(c.date);
              return isValidDate(date);
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

// 生成月份标签
const monthLabels = computed(() => {
  const labels = new Map<string, MonthLabel>();
  const totalWeeks = visibleWeeks.value.length;

  visibleWeeks.value.forEach((week, weekIndex) => {
    if (week.length === 0) return;

    const firstDate = week[0].date;
    if (!isValidDate(firstDate)) return;

    const monthYear = `${getYear(firstDate)}-${getMonth(firstDate)}`;
    if (!labels.has(monthYear)) {
      labels.set(monthYear, {
        name: format(firstDate, 'MMM'),
        position: (weekIndex / totalWeeks) * 100
      });
    }
  });

  return Array.from(labels.values());
});

// 颜色匹配逻辑
const getColor = (count: number) => {
  return (
      props.colorLevels.find(l => count >= l.min && count <= l.max)?.color ||
      '#ebedf0'
  );
};

// 格式化工具提示
const formatTooltip = (date: Date) => {
  return format(date, 'yyyy年MM月dd日 EEEE', {locale: zhCN});
};

// 初始化
onMounted(() => {
  // 先处理数据，再更新尺寸，避免不必要的重新计算
  visibleWeeks.value = processContributions();

  // 立即执行一次更新尺寸，确保初始渲染正确
  nextTick(() => {
    updateSize();
  });

  // 使用ResizeObserver监听容器大小变化
  const observer = new ResizeObserver(() => {
    // 直接调用updateSize，不使用debounce，避免动画效果
    updateSize();
    // 不需要重新处理贡献数据，因为数据不会因为大小变化而改变
  });

  if (containerRef.value) observer.observe(containerRef.value);
  onBeforeUnmount(() => observer.disconnect());
});
</script>

<style scoped>
.contribution-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 300px;
  padding: 20px 15px;
  box-sizing: border-box;
  overflow-x: auto; /* 允许横向滚动 */
  /* 防止内容溢出 */
  overflow-y: hidden;
}

.legend {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2; /* 确保在图上层级 */
}

.legend-item {
  display: flex;
}

.legend-item + .legend-item {
  margin-left: 4px; /* 增加色块间距 */
}

.legend-block {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.chart-wrapper {
  position: relative;
  margin-top: 45px; /* 增加顶部间距 */
  margin-left: 40px;
  /* 移除固定最小宽度，使用更灵活的方式 */
  width: fit-content;
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

.weekday-axis {
  position: absolute;
  left: -35px;
  top: 0;
  bottom: 0;
  width: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10px;
  color: #586069;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

.weeks-container {
  display: flex;
  flex-wrap: nowrap;
  padding-right: 20px; /* 增加右侧padding */
}

/* 移动端适配 */
@media (max-width: 768px) {
  .contribution-container {
    padding: 15px 10px;
  }

  .legend {
    top: 5px;
    padding: 6px;
    gap: 4px;
  }

  .legend-block {
    width: 14px;
    height: 14px;
  }

  .legend-text {
    font-size: 0.8em;
  }

  .chart-wrapper {
    margin-top: 35px;
    margin-left: 30px;
  }
}

.week-column {
  display: flex;
  flex-direction: column;
}

.day-cell {
  border-radius: 15%;
  /* 移除过渡效果，避免加载时的动画 */
  flex-shrink: 0;
  cursor: pointer;
}

.day-cell:hover {
  transform: scale(1.15);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
  /* 只在悬停时添加过渡效果 */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
</style>
