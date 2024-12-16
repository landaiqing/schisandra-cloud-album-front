<script setup lang="ts">

</script>

<template>
  <ul class="loading-animation" hidden="" style="display: none;">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>

  <ul class="loading-animation alternate" style="display: block;">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</template>

<style scoped lang="scss">

.loading-animation {
  list-style: none;
  position: relative;
  height: 1px;
  width: 200px;
  border-bottom: 1px dashed #aaa;
}

.loading-animation li {
  margin-top: -3px;
  height: 10px;
  width: 10px;
  border-radius: 10px;
  background-color: #000000;
  opacity: 0;
  box-shadow: 0 0 4px rgba(126, 126, 135, 0.99), 0 0 8px rgba(126, 126, 135, 0.99), 0 0 12px rgba(126, 126, 135, 0.99), 0 0 18px rgba(126, 126, 135, 0.99);
  position: absolute;
  left: -10%;
  animation-name: loading;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: normal;
}

/* alternate animation */
.loading-animation.alternate li {
  animation-name: loading2;
}

.loading-animation li:nth-child(1) {
  animation-delay: 250ms;
}

.loading-animation li:nth-child(2) {
  animation-delay: 500ms;
}

.loading-animation li:nth-child(3) {
  animation-delay: 750ms;
}

.loading-animation li:nth-child(4) {
  animation-delay: 1s;
}

.loading-animation li:nth-child(5) {
  animation-delay: 1.25s;
}

/* fading only */
@keyframes loading {
  0% {
    left: 0;
    opacity: 0;
  }
  20%, 60% {
    left: 50%;
    opacity: 1;
  }
  90% {
    left: 100%;
    opacity: 0;
  }
  100% {
    left: 100%;
  }
}

/* shrinking and fading */
@keyframes loading2 {
  0% {
    left: 0;
    opacity: 0;
    height: 1px;
    width: 1px;
    margin-top: -2px;
  }
  20%, 60% {
    left: 50%;
    opacity: 1;
    height: 10px;
    width: 10px;
    margin-top: -3px;
  }
  90% {
    left: 100%;
    opacity: 0;
    height: 1px;
    width: 1px;
    margin-top: 0;
  }
  100% {
    left: 100%;
  }
}

/* all of this is extra for the demo */
.loading-animation {
  margin: 100px auto 0;
}

.loading-animation:before, .loading-animation:after {
  color: grey;
  font-family: "Merienda One",serif;
}

.loading-animation:before {
  //content: "Loading";
  position: absolute;
  top: -32px;
  left: 39%;
}

.loading-animation:after {
  //content: "Please wait";
  position: absolute;
  top: 12px;
  left: 36%;
}
</style>
