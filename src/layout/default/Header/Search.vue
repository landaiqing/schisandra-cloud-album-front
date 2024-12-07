<template>
  <AFlex class="header-search-container" :vertical="false" align="center" justify="center">
    <APopover :arrow="false" :overlayInnerStyle="{width: '28vw'}"
              trigger="click">
      <AInput size="large" class="header-search-input"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
              :style="{borderRadius: borderRadius, boxShadow: boxShadow}"
      >
        <template #suffix>
          <AButton size="small" type="text" shape="circle" @click.prevent>
            <template #icon>
              <AAvatar size="small" shape="circle" :src="search"/>
            </template>
          </AButton>
        </template>
      </AInput>
      <template #content>
        <AFlex :vertical="false" align="center" justify="space-between" class="header-search-content-header">
          <span>搜索历史</span>
          <AButton type="text" size="small" style="color: #707072">清空搜索历史</AButton>
        </AFlex>
        <div class="header-search-content-body">
          <ATag :style="{
                padding: '5px 15px',
                fontSize: '15px',
                cursor: 'pointer',
                marginTop: '20px',
              }" :bordered="false" closable>搜索历史1
          </ATag>
        </div>
      </template>
    </APopover>
  </AFlex>
</template>
<script setup lang="ts">

import search from "@/assets/svgs/search.svg";

const borderRadius = ref('20px');
const boxShadow = ref('none');

/**
 * 监听输入框聚焦事件
 */
const handleInputFocus = () => {
  borderRadius.value = '10px'; // 聚焦时圆角变为0
  boxShadow.value = '0 0 10px rgba(0, 123, 255, 0.5)'; // 聚焦时增加阴影
};
/**
 * 监听输入框失焦事件
 */
const handleInputBlur = () => {
  borderRadius.value = '20px'; // 失去焦点时圆角恢复
  boxShadow.value = 'none'; // 失去焦点时阴影消失
};
</script>


<style scoped lang="scss">
.header-search-container {
  width: 30%;

  .header-search-input {
    border-radius: 20px;
  }

  .header-search-content-body {
    margin-top: 10px;
  }
}
</style>
