<template>
  <div class="upscale-container">
    <AFlex class="upscale-content" :vertical="false" align="center" justify="flex-start">
      <div class="upscale-content-left">
        <ACard class="upscale-content-left-container">
          <div class="upscale-content-left-upload">
            <UploadImage/>
          </div>
          <ADivider orientation="center" :plain="true">
            <span class="upscale-divider-title">参数设置</span>
          </ADivider>
          <ParameterSetting/>
        </ACard>
      </div>
      <div class="upscale-content-right">
        <CompareImage style="border-radius: 10px"/>
      </div>
    </AFlex>
  </div>
</template>
<script setup lang="ts">

import useStore from "@/store";

const websocket = useStore().websocket;
const user = useStore().user;
const upscale = useStore().upscale;

const img = new Image();
const wsOptions = {
  url: import.meta.env.VITE_FILE_SOCKET_URL + "?user_id=" + user.user.uid,
  protocols: [user.user.access_token],
};

onMounted(() => {
  websocket.initialize(wsOptions);
  websocket.on("message", async (res: any) => {
    if (res && res.code === 200) {
      const {data} = res;
      img.src = data;
      await upscale.loadImg(img);
      upscale.imageData = data;
    }
  });
});

onUnmounted(() => {
  websocket.close(false);
});
</script>
<style scoped lang="scss">
.upscale-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .upscale-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .upscale-content-left {
      width: 29%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .upscale-content-left-container {
        width: 100%;
        height: 100%;
        overflow: auto;

        .upscale-divider-title {
          font-size: 13px;
          color: rgba(126, 126, 135, 0.99);
        }

      }
    }

    .upscale-content-right {
      width: 70%;
      height: 100%;

    }
  }
}


</style>
