<template>
  <header class="header-main">
    <div class="header-container">
      <Logo :logo-color="props.logoColor"/>
      <Search/>
      <Menu/>
    </div>
  </header>
</template>
<script lang="ts" setup>
import Logo from "@/layout/default/Header/Logo.vue";
import Search from "@/layout/default/Header/Search.vue";
import Menu from "@/layout/default/Header/Menu.vue";

const props = defineProps({
  logoColor: {
    type: String,
    default: "black",
  },
});
</script>
<style scoped lang="scss">
.header-main {
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(20px);
  transition: background-color 0.3s;
  z-index: 3;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);

  .header-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 0 2%;
  }
}
</style>
