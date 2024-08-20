<template>
  <div class="landing-footer">
    <div class="landing-footer-content">
      <div class="landing-footer-content-left">
        <div class="landing-footer-content-left-top">
          <a href="#" class="landing-footer-content-a">{{t('landing.userAgreement')}}</a>

          <a class="landing-footer-content-a">{{t('landing.privacyPolicy')}}</a>

          <a class="landing-footer-content-a">{{t('landing.termsOfService')}}</a>

          <a class="landing-footer-content-a">{{t('landing.contactUs')}}</a>

          <a class="landing-footer-content-a">{{t('landing.friends')}}</a>

          <a class="landing-footer-content-a">{{ t('landing.helpCenter')}}</a>
        </div>
        <div class="landing-footer-content-left-bottom">
          <p class="landing-footer-content-p">{{t('landing.copyright')}}</p>
          <p class="landing-footer-content-p">京ICP备19053963号-1</p>
          <p class="landing-footer-content-p">京公网安备11010502037888号</p>
        </div>
      </div>
      <div class="landing-footer-content-right">
        <div style="width: 200px; display: flex; justify-content: space-between; align-items: center;">
          <GithubOutlined class="landing-footer-content-icon"/>
          <QqOutlined class="landing-footer-content-icon"/>
          <WechatOutlined class="landing-footer-content-icon"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useI18n} from "vue-i18n";

const { t } = useI18n();
</script>
<style src="./index.scss" scoped>

</style>
