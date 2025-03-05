<template>
  <div class="user-center-home">
    <div class="user-center-home-left">
      <div class="user-center-home-left-top">
        <div class="user-center-home-left-top-card"
             style="background: linear-gradient(102.74deg, rgb(66, 230, 171) -7.03%, rgb(103, 235, 187) 97.7%);">
          <div class="user-center-home-left-top-card-top">
            <div class="user-center-home-left-top-card-top-avatar">
              <AAvatar :size="60" shape="square" :src="imageIcon"/>
            </div>
            <div class="user-center-home-left-top-card-top-name">
              <span style="font-size: 2.8vh;color: rgba(255, 255, 255, 0.6); font-weight: bold;">图片总数</span>
              <span style="font-size: 3.8vh;font-weight: bold;color: #ffffff">50</span>
            </div>
          </div>
          <div class="user-center-home-left-top-card-bottom">
            <span style="font-size: 2.3vh;color: rgba(255, 255, 255, 0.6); font-weight: bold;">今日上传</span>
            <span style="font-size: 3vh;font-weight: bold;color: #ffffff">+10</span>
          </div>
        </div>
        <div class="user-center-home-left-top-card"
             style="background: linear-gradient(101.63deg, rgb(82, 138, 250) -12.83%, rgb(122, 167, 255) 100%);">
          <div class="user-center-home-left-top-card-top">
            <div class="user-center-home-left-top-card-top-avatar">
              <AAvatar :size="60" shape="square" :src="shareIcon"/>
            </div>
            <div class="user-center-home-left-top-card-top-name">
              <span style="font-size: 2.8vh;color: rgba(255, 255, 255, 0.6); font-weight: bold;">分享总数</span>
              <span style="font-size: 3.8vh;font-weight: bold;color: white">50</span>
            </div>
          </div>
          <div class="user-center-home-left-top-card-bottom">
            <span style="font-size: 2.3vh;color: rgba(255, 255, 255, 0.6); font-weight: bold;">今日上传</span>
            <span style="font-size: 2.8vh;font-weight: bold;color: white">+10</span>
          </div>
        </div>
        <div class="user-center-home-left-top-card"
             style="background: linear-gradient(102.99deg, rgb(126, 92, 255) 3.18%, rgb(162, 139, 255) 102.52%);">
          <div class="user-center-home-left-top-card-top">
            <div class="user-center-home-left-top-card-top-avatar">
              <AAvatar :size="60" shape="square" :src="fileSize"/>
            </div>
            <div class="user-center-home-left-top-card-top-name">
              <span style="font-size: 2.8vh;color: rgba(255, 255, 255, 0.6); font-weight: bold;">文件总量</span>
              <span style="font-size: 3.8vh;font-weight: bold;color: white">50</span>
            </div>
          </div>
          <div class="user-center-home-left-top-card-bottom">
            <span style="font-size: 2.3vh;color: rgba(255, 255, 255, 0.6);font-weight: bold;">今日上传</span>
            <span style="font-size: 2.8vh;font-weight: bold;color: white">+10</span>
          </div>
        </div>
      </div>
      <div class="user-center-home-left-bottom">
        <span style="font-size: 16px; font-weight: bold; margin-left: 20px;">文件上传热力图</span>
        <HeatmapPro :contributions="timeValue" :width="'100%'" :height="'100%'"/>
      </div>
    </div>
    <div class="user-center-home-right">
      <ACard class="user-center-home-right-card" :hoverable="false">

      </ACard>
    </div>
  </div>
</template>
<script setup lang="ts">

import HeatmapPro from "@/components/HeatmapPro/HeatmapPro.vue";
import imageIcon from "@/assets/svgs/image-icon.svg";
import shareIcon from "@/assets/svgs/share-icon.svg";
import fileSize from "@/assets/svgs/file-size.svg";

const timeValue = [
  {date: "2024-08-02", count: 1},
  {date: "2024-08-03", count: 2},
  {date: "2024-08-04", count: 3},
  {date: "2024-08-05", count: 4},
  {date: "2024-08-06", count: 5},
  {date: "2024-08-07", count: 6},
  {date: "2024-08-08", count: 5},
  {date: "2024-08-15", count: 8},
  {date: "2024-08-22", count: 3},
  {date: "2024-08-29", count: 4},
  {date: "2024-09-05", count: 6},
  {date: "2024-09-28", count: 6},
  {date: "2024-09-22", count: 6},
  {date: "2024-09-23", count: 6},
  {date: "2024-09-24", count: 6},
  {date: "2024-10-04", count: 6},
  {date: "2024-10-02", count: 6},
  {date: "2024-10-10", count: 6},
  {date: "2024-10-11", count: 6},
  {date: "2024-10-17", count: 6},
  {date: "2024-10-19", count: 6},
  {date: "2024-10-23", count: 6},
  {date: "2024-10-27", count: 6},
  {date: "2024-10-28", count: 6},
  {date: "2024-10-29", count: 6},
  {date: "2024-11-22", count: 6},
  {date: "2024-11-30", count: 6},
  {date: "2024-12-08", count: 6},
  {date: "2024-12-16", count: 6},
  {date: "2024-12-24", count: 6},
  {date: "2025-01-01", count: 6},
  {date: "2025-01-09", count: 6},
  {date: "2025-01-16", count: 6},
  {date: "2025-01-22", count: 6},
  {date: "2025-01-28", count: 6},
  {date: "2025-02-03", count: 6},
  {date: "2025-02-09", count: 6},
  {date: "2025-02-15", count: 6},
  {date: "2025-02-21", count: 6},
  {date: "2025-03-21", count: 6},
  {date: "2025-03-22", count: 6},
  {date: "2025-03-23", count: 6},
  {date: "2025-03-24", count: 6},
  {date: "2025-03-25", count: 6},
  {date: "2025-03-26", count: 6},
  {date: "2025-03-27", count: 6},
  {date: "2025-03-28", count: 6},
  {date: "2025-03-31", count: 6},
  {date: "2025-04-03", count: 6},
  {date: "2025-04-07", count: 6},
  {date: "2025-04-04", count: 6},
  {date: "2025-04-10", count: 6},
  {date: "2025-04-11", count: 6},
  {date: "2025-04-14", count: 6},
  {date: "2025-04-17", count: 6},
  {date: "2025-04-18", count: 6},
  {date: "2025-04-21", count: 6},
  {date: "2025-04-24", count: 6},
  {date: "2025-04-25", count: 6},
  {date: "2025-04-28", count: 6},
  {date: "2025-05-01", count: 6},
  {date: "2025-05-02", count: 6},
  {date: "2025-05-05", count: 6},
  {date: "2025-05-08", count: 6},
  {date: "2025-05-09", count: 6},
  {date: "2025-05-12", count: 6},
  {date: "2025-05-15", count: 6},
];
</script>
<style scoped lang="scss">
.user-center-home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 40px;

  .user-center-home-left {
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 20px;

    .user-center-home-left-top {
      width: 100%;
      height: 25vh;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;


      .user-center-home-left-top-card {
        width: 28%;
        height: 90%;
        background-color: #fff;
        border-radius: 1.8vh;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding-inline: 10px;
        padding-block: 10px;
        gap: 10px;
        border: 1px solid #eee;

        &:hover {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .user-center-home-left-top-card-top {
          width: 100%;
          height: 60%;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 10px;

          .user-center-home-left-top-card-top-avatar {
            width: 60px;
            height: 60px;
          }

          .user-center-home-left-top-card-top-name {
            width: 100%;
            height: 60px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
          }
        }

        .user-center-home-left-top-card-bottom {
          width: 100%;
          height: 40%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
        }
      }
    }

    .user-center-home-left-bottom {
      width: 100%;
      height: 58%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      background-color: #fff;
      border-radius: 1.8vh;
      border: 1px solid #eee;
      padding-block: 20px;

    }
  }

  .user-center-home-right {
    width: 39%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;


    .user-center-home-right-card {
      width: 100%;
      height: 100%;
      background-color: #fff;
      //margin-top: 20px;
    }
  }
}
</style>
