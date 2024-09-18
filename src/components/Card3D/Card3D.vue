<template>
  <div class="cards" style="transform: rotateX(-10.2deg) rotateY(-17.8deg);">
    <h3>Album</h3>
    <h1>Popular</h1>
    <div class="card card__one">
      <div class="card__bg" style="background-position: -8.01px 4.59px;"></div>
      <img class="card__img" src="@/assets/images/3dr_mono.png"
           style="transform: translateX(17.8px) translateY(-10.2px);">
      <div class="card__text">
        <p class="card__title">Princess Mononoke</p>
      </div>
    </div>
    <div class="card card__two">
      <div class="card__bg" style="background-position: -8.01px 4.59px;"></div>
      <img class="card__img" src="@/assets/images/3dr_chihiro.png"
           style="transform: translateX(17.8px) translateY(-10.2px);">
      <div class="card__text">
        <p class="card__title">Spirited Away</p>
      </div>
    </div>
    <div class="card card__three">
      <div class="card__bg" style="background-position: -8.01px 4.59px;"></div>
      <img class="card__img" src="@/assets/images/3dr_howlcastle.png"
           style="transform: translateX(17.8px) translateY(-10.2px);">
      <div class="card__text">
        <p class="card__title">Howl's Moving Castle</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted} from "vue";

onMounted(() => {
  const cards: any = document.querySelector(".cards");
  const images: any = document.querySelectorAll(".card__img");
  const backgrounds: any = document.querySelectorAll(".card__bg");
  const range = 40;

// const calcValue = (a, b) => (((a * 100) / b) * (range / 100) -(range / 2)).toFixed(1);
  const calcValue = (a, b) => (a / b * range - range / 2).toFixed(1); // thanks @alice-mx

  let timeout: any = null;
  document.addEventListener('mousemove', ({x, y}) => {
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }

    timeout = window.requestAnimationFrame(() => {
      const yValue: any = calcValue(y, window.innerHeight);
      const xValue: any = calcValue(x, window.innerWidth);

      cards.style.transform = `rotateX(${yValue}deg) rotateY(${xValue}deg)`;

      [].forEach.call(images, (image: any) => {
        image.style.transform = `translateX(${-xValue}px) translateY(${yValue}px)`;
      });

      [].forEach.call(backgrounds, (background: any) => {
        background.style.backgroundPosition = `${xValue * .45}px ${-yValue * .45}px`;
      });
    });
  }, false);

});

</script>
<style src="./index.scss" scoped lang="scss">


</style>
