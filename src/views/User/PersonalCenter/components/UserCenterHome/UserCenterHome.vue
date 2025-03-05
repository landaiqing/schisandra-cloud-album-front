<template>
  <div class="user-center-home">
    <div class="user-center-home-left">
      <div class="user-center-home-left-top" v-if="chartData">
        <div class="user-center-home-left-top-card"
             style="background: linear-gradient(102.74deg, rgb(66, 230, 171) -7.03%, rgb(103, 235, 187) 97.7%);">
          <div class="user-center-home-left-top-card-top">
            <div class="user-center-home-left-top-card-top-avatar">
              <AAvatar :size="60" shape="square" :src="imageIcon"/>
            </div>
            <div class="user-center-home-left-top-card-top-name">
              <span style="font-size: 2.8vh;color: rgba(255, 255, 255, 0.6); font-weight: bold;">图片总数</span>
              <span style="font-size: 3.8vh;font-weight: bold;color: #ffffff">{{ chartData.image_count }}</span>
            </div>
          </div>
          <div class="user-center-home-left-top-card-bottom">
            <span style="font-size: 2.3vh;color: rgba(255, 255, 255, 0.6); font-weight: bold;">今日上传</span>
            <span style="font-size: 3vh;font-weight: bold;color: #ffffff">+{{ chartData.today_upload_count }}</span>
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
              <span style="font-size: 3.8vh;font-weight: bold;color: white">{{ chartData.share_count }}</span>
            </div>
          </div>
          <div class="user-center-home-left-top-card-bottom">
            <span style="font-size: 2.3vh;color: rgba(255, 255, 255, 0.6); font-weight: bold;">今日上传</span>
            <span style="font-size: 2.8vh;font-weight: bold;color: white">+{{ chartData.today_share_count }}</span>
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
              <span
                  style="font-size: 3.8vh;font-weight: bold;color: white">{{
                  bytesToSize(chartData.file_size_count)
                }}</span>
            </div>
          </div>
          <div class="user-center-home-left-top-card-bottom">
            <span style="font-size: 2.3vh;color: rgba(255, 255, 255, 0.6);font-weight: bold;">今日上传</span>
            <span
                style="font-size: 2.8vh;font-weight: bold;color: white">+{{
                bytesToSize(chartData.today_file_size_count)
              }}</span>
          </div>
        </div>
      </div>
      <div class="user-center-home-left-bottom" v-if="chartData">
        <span style="font-size: 16px; font-weight: bold; margin-left: 20px;">文件上传热力图</span>
        <HeatmapPro :contributions="chartData.heatmap"/>
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
import {getUserUploadInfoApi} from "@/api/storage";
import bytesToSize from "@/utils/imageUtils/bytesToSize";

const chartData = ref<any>();

async function getData() {
  const res: any = await getUserUploadInfoApi();
  if (res && res.code === 200) {
    chartData.value = res.data;
  }
}

onMounted(() => {
  getData();
});
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
