<template>
  <div class="stack rotated">
    <img :src="imageSrc" alt="">
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  src?: string;
  defaultSrc: string;
}>();

const imageSrc = computed(() => props.src || props.defaultSrc);
</script>

<style scoped lang="scss">
.stack {
  position: relative;
  z-index: 10;
  float: left;
}

.stack img {
  width: 200px;
  height: 180px;
  vertical-align: bottom;
  border: 5px #fff solid;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.stack:before,
.stack:after {
  content: "";
  border-radius: 10px;
  width: 100%;
  height: 100%;
  position: absolute;
  border: 10px solid #fff;
  left: 0;
  box-sizing: border-box;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  transition: 0.3s all ease-out;
}

.stack:before {
  top: 4px;
  z-index: -10;
}

.stack:after {
  top: 8px;
  z-index: -20;
}

.stack.rotated:before {
  transform-origin: bottom left;
  transform: rotate(2deg);
}

.stack.rotated:after {
  transform-origin: bottom left;
  transform: rotate(4deg);
}

.stack.twisted:before {
  transform: rotate(4deg);
}

.stack.twisted:after {
  transform: rotate(-4deg);
}

.stack.rotated-left:before {
  transform-origin: bottom left;
  transform: rotate(-3deg);
}

.stack.rotated-left:after {
  transform-origin: bottom left;
  transform: rotate(-6deg);
}

.stack:hover:before,
.stack:hover:after {
  transform: rotate(0deg);
}
</style>
