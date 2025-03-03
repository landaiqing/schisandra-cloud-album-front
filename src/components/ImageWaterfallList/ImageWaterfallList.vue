<template>
  <Spin size="middle" :spinning="imageStore.imageListLoading" indicator="spin-dot" tip="loading..." :rotate="true">
    <div style="width:100%;height:100%;" v-if="props.imageList">
      <div v-for="(itemList, indexList) in props.imageList" :key="indexList" class="group-container"
           :class="{ 'has-selected': hasSelected(itemList) }">
        <div class="date-header">
          <img :src="getGroupIcon(itemList)" alt="Hover" class="custom-checkbox"
               :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
               @click.stop="toggleGroup(itemList)"
          />
          <span class="date-text">{{ itemList.date }}</span>
        </div>
        <AImagePreviewGroup>
          <div class="photo-list">
            <div v-for="(item, index) in itemList.list" :key="index"
                 :class="{'photo-item': true, 'animate': true, [`animate-delay-${index}`]: true}">
              <CheckCard :key="index"
                         class="photo-item"
                         margin="0"
                         border-radius="0"
                         v-model="imageStore.selected"
                         :showHoverCircle="true"
                         :iconSize="20"
                         :showSelectedEffect="true"
                         :value="item.id">
                <AImage :src="item.thumbnail"
                        :alt="item.file_name"
                        :key="index"
                        :height="200"
                        style="height: 200px;max-width: 800px;object-fit: cover;"
                        :preview="{
                                src: item.url,
                               }"
                        loading="lazy">
                  <template #previewMask>
                  </template>
                </AImage>
              </CheckCard>
            </div>
          </div>
        </AImagePreviewGroup>
      </div>
    </div>
    <div v-if="!imageStore.imageListLoading && !props.imageList" class="empty-content">
      <AEmpty :image="empty"
              :image-style="{
                   height: '100%',
                   width: '100%',
                 }">
        <template #description>
                <span style="color: #999999;font-size: 16px;font-weight: 500;line-height: 1.5;">
                  还没检测到任何图片，快去上传吧！
                </span>
        </template>
      </AEmpty>
    </div>
  </Spin>
</template>
<script setup lang="ts">
import empty from "@/assets/svgs/empty.svg";
import useStore from "@/store";
import complete from '@/assets/svgs/complete.svg';
import stop from '@/assets/svgs/stop.svg';
import greyComplete from '@/assets/svgs/grey-complete.svg';

const props = defineProps({
  imageList: {
    type: Array as () => any[],
    default: () => []
  }
});
const iconSize = ref(23);
const imageStore = useStore().image;


const toggleGroup = (group: any) => {
  const currentIds = group.list.map((item: any) => item.id);
  const allSelected = currentIds.every(id =>
      imageStore.selected.includes(id)
  );

  // 创建新数组保证响应式更新
  imageStore.selected = allSelected
      ? imageStore.selected.filter(id => !currentIds.includes(id))
      : [...new Set([...imageStore.selected, ...currentIds])];
};

// 新增计算分组状态
const groupState = computed(() => (group: any) => {
  const currentIds = group.list.map((item: any) => item.id);
  if (currentIds.length === 0) return 'empty';

  const selectedCount = currentIds.filter(id =>
      imageStore.selected.includes(id)
  ).length;

  if (selectedCount === currentIds.length) return 'all';
  if (selectedCount > 0) return 'partial';
  return 'none';
});

// 动态获取图标
const getGroupIcon = (group: any) => {
  switch (groupState.value(group)) {
    case 'all':
      return complete;
    case 'partial':
      return stop;
    default:
      return greyComplete;
  }
};

// 新增计算属性判断是否有选中
const hasSelected = computed(() => (group: any) => {
  return group.list.some((item: any) =>
      imageStore.selected.includes(item.id)
  );
});


</script>


<style scoped lang="scss">
.photo-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px;
  gap: 15px;
}

.animate {
  opacity: 0;
  transform: translateX(-50px);
  animation: fadeInRight 0.5s forwards;
}

@for $i from 0 through 30 { // 假设最多有20张图片，你可以根据实际情况调整
  .animate-delay-#{$i} {
    animation-delay: #{$i * 0.1}s; // 每张图片延迟0.1秒显示
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.date-text {
  position: relative;
  font-size: 13px;
  color: #666;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;

  /* 新增固定位置规则 */
  .has-selected & {
    transform: translateX(28px) !important;
    transition: none !important;
  }
}


.group-container {
  position: relative;
  margin-bottom: 16px;

  // 有选中时的常显逻辑
  &.has-selected {
    .custom-checkbox {
      opacity: 1 !important;
      transform: translateX(8px) scale(1) !important;
    }

    // 保持日期位移效果
    &:hover .date-text {
      transform: translateX(28px);
    }
  }

  // 无选中时的悬停逻辑
  &:not(.has-selected) {
    .custom-checkbox {
      opacity: 0;
      transform: translateX(8px) scale(0);

      // 悬停显示
      &:hover {
        opacity: 1;
        transform: translateX(8px) scale(1);
      }
    }

    // 分组悬停时的日期位移
    &:hover {
      .date-text {
        transform: translateX(28px);
      }

      .custom-checkbox {
        opacity: 1;
        transform: translateX(8px) scale(1);
      }
    }
  }

}

@keyframes checkScale {
  0% {
    transform: translateX(8px) scale(0);
  }
  50% {
    transform: translateX(8px) scale(1.2);
  }
  100% {
    transform: translateX(8px) scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: translateX(8px) scale(1);
  }
  50% {
    transform: translateX(8px) scale(1.1);
  }
  100% {
    transform: translateX(8px) scale(1);
  }
}

.date-header {
  position: relative;
  height: 24px;
  margin: 8px 0;
  padding-left: 10px;
  display: flex;
  align-items: center;
}

.date-text {
  position: relative;
  font-size: 13px;
  color: #666;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.custom-checkbox {
  position: absolute;
  left: 0;
  width: 24px;
  height: 24px;
  border: 1px solid #ffffff;
  border-radius: 50%;
  background: transparent;
  opacity: 0;
  transform: translateX(8px) scale(0);
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
  transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 分开定义过渡属性 */
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background: #1890ff;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.2s ease 0.1s;
  }
}

.date-checkbox:checked + .custom-checkbox::after {
  transform: translate(-50%, -50%) scale(1);
}

</style>
