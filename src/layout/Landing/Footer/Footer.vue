<template>
  <div class="landing-footer">
    <div class="landing-footer-content">
      <div class="landing-footer-content-left">
        <AFlex align="center">
          <img src="@/assets/svgs/logo-album.svg" :width="50" alt="" class="landing-logo">
          <span class="landing-footer-title">S.Album</span>
        </AFlex>
        <p class="landing-footer-text">
          S.Album ，{{ t('landing.footerDesc')}}
        </p>

      </div>
      <div class="landing-footer-content-right">
        <div class="landing-footer-content-right-left">
          <AQrcode :value="'https://git.landaiqing.cn'" :size="120" :bordered="false"
                   :icon="qq"
                   :iconSize="20"
          />
          <AQrcode :value="'https://git.landaiqing.cn'" :size="120" :bordered="false" :icon="wechat" :iconSize="20"/>
        </div>
        <div class="landing-footer-content-right-right">
          <AFlex :vertical="true" style="width: 300px;height: 150px;" align="flex-start" justify="space-evenly">
            <span class="landing-footer-text">
            京ICP备19053591号-1
            </span>
            <span class="landing-footer-text">
            京ICP备19053591号-1
            </span>
            ©2024 Schisandra All Rights Reserved
          </AFlex>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import qq from "@/assets/svgs/icon-qq.svg";
import wechat from "@/assets/svgs/icon-wechat.svg";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
</script>
<style src="./index.scss" scoped>

</style>
