<template>
  <div class="system-admin">
    <SystemHeader/>
    <div class="system-container">
      <SystemSidebar/>
      <div class="system-content">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.system-admin {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;

  .system-container {
    display: flex;
    flex: 1;
    overflow: hidden;

    .system-content {
      flex: 1;
      padding: 24px;
      overflow: auto;
    }
  }
}
</style>
