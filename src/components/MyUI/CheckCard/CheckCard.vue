<template>
  <div
      class="check-card"
      :class="{ 'selected': isSelected && props.showSelectedEffect }"
      @click="handleClick"
      :style="cardStyle">
    <div class="hover-circle" @click.stop="toggleSelection"
         v-if="showHoverCircle"
         :style="{ width: iconSize + 'px', height: iconSize + 'px' }">
      <img :src="greyComplete" alt="Hover" class="hover-icon"
           :style="{ width: iconSize + 'px', height: iconSize + 'px' }"/>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
    <div class="card-selected-icon" v-if="isSelected" :class="iconPositionClass"
         :style="{ width: iconSize + 'px', height: iconSize + 'px' }">
      <img :src="icon" alt="Selected" class="selected-icon"
           @click.stop="toggleSelection"
           :style="{ width: iconSize + 'px', height: iconSize + 'px' }"/>
      <img :src="cancel" alt="Delete" class="delete-icon" @click.stop="toggleSelection"
           :style="{ width: iconSize + 'px', height: iconSize + 'px' }"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import complete from '@/assets/svgs/complete.svg';
import cancel from '@/assets/svgs/cancle.svg';
import greyComplete from '@/assets/svgs/grey-complete.svg';

interface Props {
  value: string | number;
  modelValue?: (string | number)[];
  icon?: string;
  iconPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  margin?: string;
  borderRadius?: string;
  backgroundColor?: string;
  showHoverCircle?: boolean; // 控制是否显示悬停圆环
  iconSize?: number; // 控制图标大小
  showSelectedEffect?: boolean; // 控制是否显示选中效果
}

const props = withDefaults(defineProps<Props>(), {
  icon: complete,
  iconPosition: 'top-left',
  margin: '16px',
  borderRadius: '8px',
  backgroundColor: '#e5eeff',
  showHoverCircle: true, // 默认显示悬停圆环
  iconSize: 24, // 默认图标大小
  showSelectedEffect: true, // 默认显示选中效果
});

const emits = defineEmits(['update:modelValue']);

const isSelected = computed(() => {
  return props.modelValue?.includes(props.value);
});

const iconPositionClass = computed(() => {
  return `icon-${props.iconPosition}`;
});

const cardStyle = computed(() => {
  return {
    margin: props.margin,
    borderRadius: props.borderRadius,
    backgroundColor: props.backgroundColor,
  };
});

function handleClick() {
  if (!props.showHoverCircle) {
    toggleSelection();
  }
}

function toggleSelection() {
  if (isSelected.value) {
    emits('update:modelValue', props.modelValue?.filter((val) => val !== props.value));
  } else {
    emits('update:modelValue', [...(props.modelValue || []), props.value]);
  }
}
</script>

<style scoped lang="scss">
.check-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s;
  overflow: visible; /* Ensure the icon is not cut off */
}

.check-card.selected {
  border: 1px solid rgba(125, 167, 255, 0.68);
  box-shadow: 0 0 2px rgba(77, 167, 255, 0.89);
  padding: 10px;
}

.card-content {
  flex: 1;
}

.card-selected-icon {
  position: absolute;
  background-color: white;
  border-radius: 50%; /* Optional: Make it circular */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc; /* Optional: Add a border */
}

.icon-top-left {
  top: 3px;
  left: 3px;
}

.icon-top-right {
  top: 3px;
  right: 3px;
}

.icon-bottom-left {
  bottom: 3px;
  left: 3px;
}

.icon-bottom-right {
  bottom: 3px;
  right: 3px;
}

.card-selected-icon img {
  z-index: 3; /* Ensure the icon is on top */
}

.selected-icon {
  display: block;
}

.delete-icon {
  display: none;
  cursor: pointer;
}

.card-selected-icon:hover .selected-icon {
  display: none;
}

.card-selected-icon:hover .delete-icon {
  display: block;
}

.hover-circle {
  position: absolute;
  top: 3px; /* 与 .card-selected-icon 的 top 值相同 */
  left: 3px; /* 与 .card-selected-icon 的 left 值相同 */
  border: 2px solid white; /* 与 .card-selected-icon 的 border 值相同 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: transparent;
  z-index: 1; /* Ensure the hover circle is on top */
  opacity: 0;
  transform: scale(0); /* 初始状态为0 */
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; /* 添加动画效果 */
}

.hover-circle .hover-icon {
  display: none;
}

.check-card:hover .hover-circle {
  opacity: 1; /* 鼠标悬停时变为可见 */
  transform: scale(1); /* 鼠标悬停时放大到1倍 */
}

.check-card:hover .hover-circle .hover-icon {
  display: block;
}

.check-card.selected:hover .hover-circle {
  display: none;
}
</style>
