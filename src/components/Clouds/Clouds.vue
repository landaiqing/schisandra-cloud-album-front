<template>
  <div class="flex-wrapper">
    <section class="container">
      <img id="cloudOne" class="clouds" src="@/assets/images/clouds.png"
           style="transform: translateY(8.42555px);" alt="">
      <img id="cloudTwo" class="clouds" src="@/assets/images/cloud.png"
           style="transform: translateY(-1.92713px);" alt="">
      <img id="cloudThree" class="clouds" src="@/assets/images/cloud.png"
           style="transform: translateY(-13.9905px);" alt="">
      <img id="cloudFour" class="clouds" src="@/assets/images/cloud.png"
           style="transform: translateY(2.24832px);" alt="">
      <div class="card-content">
        <h1>{{ t("landing.title") }}</h1>
        <p>{{ t("landing.description") }}</p>
        <AButton href="/login" type="primary" size="large" style="width: 150px;border-radius: 30px">
          {{ t("landing.learnMore") }}
        </AButton>
      </div>
      <div class="background-container"></div>
    </section>
  </div>
</template>
<script setup lang="ts">
import {onMounted} from "vue";
import anime from 'animejs/lib/anime.es.js';
import {useI18n} from "vue-i18n";

const {t} = useI18n();
onMounted(() => {
  anime({
    targets: '#cloudOne',
    translateY: '20',
    duration: 2000,
    loop: true,
    direction: 'alternate',
    easing: 'linear'
  });


  anime({
    targets: '#cloudTwo',
    translateY: '-20',
    duration: 2500,
    loop: true,
    direction: 'alternate',
    easing: 'linear'
  });


  anime({
    targets: '#cloudThree',
    translateY: '-30',
    duration: 3000,
    loop: true,
    direction: 'alternate',
    easing: 'linear'
  });


  anime({
    targets: '#cloudFour',
    translateY: '40',
    duration: 5000,
    loop: true,
    direction: 'alternate',
    easing: 'linear'
  });

});
</script>
<style src="./index.scss" scoped lang="scss">

</style>
