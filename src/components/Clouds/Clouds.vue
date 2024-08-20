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
        <AButton class="button-text" type="primary">{{ t("landing.learnMore") }}</AButton>
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
<style scoped lang="scss">
* {
  box-sizing: border-box;
}

button {
  background: #55B4FB;
  border-radius: 30px;
  border: 2px solid #55B4FB;
  height: 44px;
  width: 165px;
  color: white;
  position: relative;
  cursor: pointer;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.25s;
}

button:hover {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  background: #46adfb;
}

button i {
  background: #75C2FB;
  padding: 10px;
  border-radius: 50px;
  position: absolute;
  border: 1px solid white;
  right: 2px;
  top: 50%;
  transform: translate(0%, -50%);
}

button .button-text {
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
  left: 25px;
}

body {
  background: #F4F5F8;
  padding: 0 30px;
  overflow: hidden;
}

.card-content {
  z-index: 10;
  width: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -65%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-content h1 {
  color: white;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 10px;
  font-family: Lato, sans-serif;
  font-weight: 500;
  text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.15);
}

.card-content p {
  color: white;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 25px;
  margin-top: 0px;
  font-size: 1.2rem;
  font-weight: lighter;
  max-width: 650px;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 300;
  text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.15);
}

.flex-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.container {
  max-width: 800px;
  min-width: 320px;
  width: 100%;
  background: #7A90F6;
  /* fallback for old browsers */
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #7A90F6, #7B6FF6);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  position: relative;
  height: 400px;
  border-radius: 10px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
}

.background-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.background-container:before {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 1;
  width: 2000px;
  height: 100%;
  //background: url("https://www.digitalocean.com/assets/media/products/header-04dcc3be.svg");
  //background-position: bottom;
  //background-repeat: no-repeat;
  content: "";
  transform: translateX(-50%);
}

.clouds {
  width: 225px;
  position: absolute;
}

#cloudOne {
  top: -100px;
  left: -90px;
}

#cloudTwo {
  right: -100px;
  bottom: -90px;
  z-index: 3;
}

#cloudThree {
  left: 150px;
  bottom: -150px;
  z-index: -1;
}

#cloudFour {
  right: 80px;
  top: -100px;
  z-index: -1;
  width: 100px;
}
</style>
