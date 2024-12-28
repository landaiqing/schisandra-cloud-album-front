<template>
  <div class="recent-upload">
    <div class="photo-header">
      <AButton type="primary" shape="round" size="middle">
        <template #icon>
          <PlusOutlined/>
        </template>
        上传照片
      </AButton>
      <AButton type="default" shape="round" size="middle">
        <template #icon>
          <PlusSquareOutlined/>
        </template>
        创建相册
      </AButton>
    </div>
    <div class="photo-list">
      <CheckCard style="margin-top: 20px;" v-for="item in items" :key="item.id" :value="item.id" v-model="selectedItems">
        {{ item.name }}
      </CheckCard>
      <div>Selected Items: {{ selectedItems }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
]);

const selectedItems = ref<(string | number)[]>([]);

</script>
<style scoped lang="scss" src="./index.scss">

</style>
