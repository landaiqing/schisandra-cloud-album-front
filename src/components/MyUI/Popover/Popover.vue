<script setup lang="ts">
import type {CSSProperties} from 'vue';
import {computed} from 'vue';
import {useSlotsExist} from '../Utils';

interface Props {
  title?: string // 卡片标题 string | slot
  titleStyle?: CSSProperties // 卡片标题样式
  content?: string // 卡片内容 string | slot
  contentStyle?: CSSProperties // 卡片内容样式
  tooltipStyle?: CSSProperties // 设置弹出提示的样式
  offsetX?: number // 水平偏移量
  padding?: string | number // 弹出提示的内边距
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  titleStyle: () => ({}),
  content: undefined,
  contentStyle: () => ({}),
  tooltipStyle: () => ({}),
  offsetX: 0, // 默认偏移量为0
  padding: '0px' // 默认内边距为0
});
const slotsExist = useSlotsExist(['title', 'content']);
const showTitle = computed(() => {
  return slotsExist.title || props.title;
});
const showContent = computed(() => {
  return slotsExist.content || props.content;
});
</script>

<template>
  <Tooltip
      max-width="auto"
      bg-color="#fff"
      :tooltip-style="{
        padding: props.padding, // 使用传入的 padding
        borderRadius: '8px',
        textAlign: 'start',
        transform: `translate(${props.offsetX}px, 0)`,
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-color)',
        border: '1px solid var(--white-color)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        ...tooltipStyle
      }"
      :transition-duration="200"
      v-bind="$attrs"
  >
    <template #tooltip>
      <div class="arrow" :style="{ transform: `translateX(${props.offsetX - 10}px)` }"></div>
      <div v-if="showTitle" class="popover-title" :class="{ mb8: showContent }" :style="titleStyle">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="showContent" class="popover-content" :style="contentStyle">
        <slot name="content">{{ content }}</slot>
      </div>
    </template>
    <slot></slot>
  </Tooltip>
</template>

<style lang="less" scoped>
.popover-title {
  min-width: 176px;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
}

.mb8 {
  margin-bottom: 8px;
}

.popover-content {
  color: rgba(0, 0, 0, 0.88);
}

.arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #fff; /* 箭头的颜色 */
  left: 50%; /* 使箭头在中间 */
  transform: translateX(-50%); /* 向左移动箭头宽度的一半 */
}
</style>


