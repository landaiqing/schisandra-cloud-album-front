<template>
  <AFlex :vertical="true" align="center" justify-content="center" v-cloak>
    <Header style="position: fixed;"/>
    <Content style="margin-top: 100px;z-index: 2;"/>
    <Footer/>
    <div class="area">
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </AFlex>
</template>
<script setup lang="ts">
import Header from "@/layout/Landing/Header/Header.vue";
import Footer from "@/layout/Landing/Footer/Footer.vue";
import Content from "@/layout/Landing/Content/Content.vue";
</script>
<style src="./index.scss" scoped lang="scss">

</style>
