<template>
  <AFlex :vertical="true" align="center" justify-content="center" v-cloak>
    <Header/>
    <Content/>
    <Footer/>
    <BackgroundAnimation/>
  </AFlex>
</template>
<script setup lang="ts">
import Header from "@/layout/Landing/Header/Header.vue";
import Footer from "@/layout/Landing/Footer/Footer.vue";
import Content from "@/layout/Landing/Content/Content.vue";
import BackgroundAnimation from "@/components/BackgroundAnimation/BackgroundAnimation.vue";
</script>
<style src="./index.scss" scoped lang="scss">

</style>
