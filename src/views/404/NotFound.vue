<template>
  <body translate="no">
  <div class="text"><p>404</p></div>
  <div class="container">
    <!-- caveman left -->
    <div class="caveman">
      <div class="leg">
        <div class="foot">
          <div class="fingers"></div>
        </div>
      </div>
      <div class="leg">
        <div class="foot">
          <div class="fingers"></div>
        </div>
      </div>
      <div class="shape">
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
      <div class="head">
        <div class="eye">
          <div class="nose"></div>
        </div>
        <div class="mouth"></div>
      </div>
      <div class="arm-right">
        <div class="club"></div>
      </div>
    </div>
    <!-- caveman right -->
    <div class="caveman">
      <div class="leg">
        <div class="foot">
          <div class="fingers"></div>
        </div>
      </div>
      <div class="leg">
        <div class="foot">
          <div class="fingers"></div>
        </div>
      </div>
      <div class="shape">
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
      <div class="head">
        <div class="eye">
          <div class="nose"></div>
        </div>
        <div class="mouth"></div>
      </div>
      <div class="arm-right">
        <div class="club"></div>
      </div>
    </div>
  </div>
  </body>
</template>
<script setup lang="ts">

import {useRouter} from "vue-router";

const router = useRouter();

/**
 *  Redirect to home page after 3 seconds
 */
async function backHome() {
  setTimeout(() => {
    router.go(-1);
  }, 3000);
}

onMounted(async () => {
  await backHome();
});
</script>
<style src="./index.scss" lang="scss" scoped>

</style>
