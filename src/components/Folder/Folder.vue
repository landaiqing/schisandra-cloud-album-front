<template>
  <div class="folder-wrapper" @click="handleClick">
    <div class="download" style="--scale-pages: 1; --scale-folder: 1;">
      <svg class="folder-back" viewBox="0 0 48 48">
        <path d="
      M  3.50  7.50
      C  3.50  5.29   5.28  3.50   7.49  3.50
      C 13.17  3.50  23.18  3.50  26.00  3.50
      C 30.00  3.50  28.00  6.00  32.00  6.00
      C 34.21  6.00  37.87  6.00  40.71  6.00
      C 42.93  6.00  44.73  7.82  44.71 10.04
      L 44.54 25.04
      C 44.52 27.24  42.74 29.00  40.54 29.00
      H  7.50
      C  5.29 29.00   3.50 27.21   3.50 25.00
      V  7.50
      Z
    " fill="#32AF75"></path>
      </svg>
      <div class="page-1"></div>
      <div class="page-2"></div>
      <svg class="folder-front" viewBox="0 0 48 48">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#47DB99;stop-opacity:1"></stop>
            <stop offset="100%" style="stop-color:#2EA16D;stop-opacity:1"></stop>
          </linearGradient>
        </defs>
        <path d="
      M  2.36 24.31
      C  2.17 23.09   3.11 22.00   4.34 22.00
      H 40.90
      C 41.80 22.00  42.33 23.00  41.83 23.75
      L 41.40 24.40
      C 41.16 24.76  41.16 25.24  41.40 25.60
      V 25.60
      C 41.73 26.10  42.40 26.23  42.90 25.90
      L 43.50 25.50
      V 25.50
      C 44.75 24.88  46.17 25.93  45.94 27.31
      L 43.57 41.17
      C 43.24 43.09  41.57 44.50  39.63 44.50
      H  8.93
      C  6.95 44.50   5.28 43.06   4.97 41.11
      L  2.36 24.31
      Z
    " fill="url(#gradient)"></path>
      </svg>
    </div>
  </div>
</template>
<script setup lang="ts">
import {gsap} from 'gsap';

import {onMounted, ref} from 'vue';

const download = ref<Element | null>(null);
const folderFront = ref<Element | null>(null);

const playspeed = 1;

const keyframes = [
  /*  0 */0.00, //s
  /*  1 */0.20, //s
  /*  2 */0.27, //s
  /*  3 */0.35, //s
  /*  4 */0.55, //s
  /*  5 */2.00 //s
];

const timespan = (start, end) => ({
  delay: keyframes[start] * (1 / playspeed),
  duration: (keyframes[end] - keyframes[start]) * (1 / playspeed)
});

const handleClick = () => {
  const page = document.createElement('div');
  page.classList.add('page-2');

  if (download.value) {
    download.value.insertBefore(page, folderFront.value);
  }

  /* Page */
  // Fall
  gsap.fromTo(page, {
        '--ratio-page-2-offset': 1,
        '--ratio-page-2-height': 1
      },
      {
        '--ratio-page-2-offset': 0.5,
        ...timespan(0, 2),
        onComplete: () => {
          page.remove();
        }
      });

  // Fade in
  gsap.fromTo(page, {
        '--opacity-page-2': 0
      },
      {
        '--opacity-page-2': 1,
        ...timespan(0, 1)
      });

  // Height
  gsap.to(page, {
    '--ratio-page-2-height': 0.5,
    ...timespan(2, 3)
  });

  /* Pages */
  // Scale
  gsap.fromTo(download.value, {
        '--scale-pages': 1
      },
      {
        '--scale-pages': 0.8,
        ...timespan(3, 4)
      });

  gsap.to(download.value, {
    '--scale-pages': 1,
    ease: 'elastic',
    ...timespan(4, 5)
  });

  /* Folder */
  // Scale
  gsap.fromTo(download.value, {
        '--scale-folder': 1
      },
      {
        '--scale-folder': 1.12,
        ...timespan(3, 4)
      });

  gsap.to(download.value, {
    '--scale-folder': 1,
    ease: 'elastic',
    ...timespan(4, 5)
  });
};

onMounted(() => {
  download.value = document.querySelector('.download');
  folderFront.value = document.querySelector('.folder-front');
});
</script>
<style lang="scss">
.folder-wrapper {
  width: var(--size);
  height: var(--size);
  //display: flex;
  //justify-content: center;
  //align-items: center;
}

.download,
.folder-back,
.page-1,
.page-2,
.folder-front {
  position: absolute;
  cursor: pointer;
}

.download {
  width: var(--size);
  height: var(--size);
  cursor: pointer;
  filter: drop-shadow(rgba(0, 0, 0, 0.09) 4px 8px 12px) drop-shadow(rgba(0, 0, 0, 0.06) 2px 4px 6px) drop-shadow(rgba(0, 0, 0, 0.03) 1px 2px 3px);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
}

.folder-back {
  width: var(--size-folder-back);
  height: var(--size-folder-back);
  transform-origin: 50% 100%;
  transform: translate(0%, 0%) scaleY(var(--scale-folder));
}

.page-1 {
  width: calc(var(--size-page-1) * var(--ratio-page-1));
  height: calc(var(--size-page-1) / var(--ratio-page-1));
  border-radius: 8px;
  background-color: #F2EEF7;

  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
  transform-origin: 50% 90%;
  transform: translate(50%, 30%) translateY(calc((1 - var(--scale-pages)) * -65%)) scale(var(--scale-pages));
}

.page-2 {
  width: calc(var(--size-page-2) * var(--ratio-page-2));
  height: calc((var(--size-page-2) * var(--ratio-page-2-height)) / var(--ratio-page-2));
  border-radius: 10px;
  background-color: #FFFEFF;
  opacity: var(--opacity-page-2);
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
  transform: translate(25%, 110%) translateY(17%) translateY(calc((1 - var(--scale-pages)) * -85%)) translateY(calc(var(--size) * -1.2 * var(--ratio-page-2-offset))) translateY(calc((1 - var(--ratio-page-2-height)) * -65%)) scale(var(--scale-pages));
  background-image: url('data:image/svg+xml;charset=utf-8;base64,PHN2ZyB0PSIxNzMzNDEyMzc1MTMzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijg5ODgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMzM4LjU4NTYgMjYyLjE5NTJsLTI4OC4zNTg0IDUwNi44OGMtMjkuMzg4OCA1MS42MDk2IDcuOTM2IDExNS43NjMyIDY3LjMyOCAxMTUuNzYzMkg2OTQuMjcyYzU5LjM5MiAwIDk2LjcxNjgtNjQuMTAyNCA2Ny4zMjgtMTE1Ljc2MzJsLTI4OC4zNTg0LTUwNi44OGMtMjkuNjk2LTUyLjIyNC0xMDQuOTYtNTIuMjI0LTEzNC42NTYgMHoiIGZpbGw9IiM0QkUyQUMiIHAtaWQ9Ijg5ODkiPjwvcGF0aD48cGF0aCBkPSJNNzQ4Ljk1MzYgNTQ3LjEyMzJsLTE1My45MDcyIDI3MC41NDA4Yy0xNy4wNDk2IDI5Ljk1MiA0LjYwOCA2Ny4xNzQ0IDM5LjA2NTYgNjcuMTc0NGgzMDcuODE0NGMzNC40NTc2IDAgNTYuMTE1Mi0zNy4yMjI0IDM5LjA2NTYtNjcuMTc0NGwtMTUzLjkwNzItMjcwLjU0MDhjLTE3LjI1NDQtMzAuMzEwNC02MC45MjgtMzAuMzEwNC03OC4xMzEyIDB6IiBmaWxsPSIjNEJFMkFDIiBwLWlkPSI4OTkwIj48L3BhdGg+PHBhdGggZD0iTTc1OS45MTA0IDc2Ni4xNTY4bC02Ny43ODg4LTExOS4xOTM2LTk2LjEwMjQgMTY4Ljk2Yy0xNy40MDggMzAuNjE3NiA0LjM1MiA2OC44NjQgMzkuMTY4IDY4Ljg2NGg1Ny4yNDE2YzYwLjAwNjQgMC4wNTEyIDk3LjQ4NDgtNjUuODk0NCA2Ny40ODE2LTExOC42MzA0eiIgZmlsbD0iIzA2Q0M3NiIgcC1pZD0iODk5MSI+PC9wYXRoPjxwYXRoIGQ9Ik03MDcuNTMyOCAyOTQuNzU4NGE4Mi41ODU2IDgxLjM1NjggOTAgMSAwIDE2Mi43MTM2IDAgODIuNTg1NiA4MS4zNTY4IDkwIDEgMC0xNjIuNzEzNiAwWiIgZmlsbD0iIzRCRTJBQyIgcC1pZD0iODk5MiI+PC9wYXRoPjxwYXRoIGQ9Ik0yMTcuNzAyNCA3NzEuOTQyNGMtNi43NTg0IDAtMTMuNTY4LTEuNjg5Ni0xOS44NjU2LTUuMTcxMi0xOS43NjMyLTExLjAwOC0yNi44OC0zNS45NDI0LTE1Ljg3Mi01NS43MDU2bDk1LjU5MDQtMTcxLjcyNDhjMTEuMDA4LTE5Ljc2MzIgMzUuOTQyNC0yNi44OCA1NS43MDU2LTE1Ljg3MiAxOS43NjMyIDExLjAwOCAyNi44OCAzNS45NDI0IDE1Ljg3MiA1NS43MDU2bC05NS41OTA0IDE3MS43MjQ4YTQwLjkyOTI4IDQwLjkyOTI4IDAgMCAxLTM1Ljg0IDIxLjA0MzJ6IiBmaWxsPSIjRkZGRkZGIiBwLWlkPSI4OTkzIj48L3BhdGg+PC9zdmc+'); /* 设置背景图片 */
  background-size: cover; /* 确保图片覆盖整个div */
  background-repeat: no-repeat; /* 防止图片重复 */
}

.folder-front {
  width: var(--size-folder-front);
  height: var(--size-folder-front);
  transform-origin: 50% 100%;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
  transform: translate(0%, 0%) scaleY(calc(var(--scale-folder) * var(--scale-folder)));
}

</style>
