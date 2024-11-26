<template>
  <div class="landing-content">
    <div class="landing-content-first">
      <AFlex class="landing-content-first-container">
        <div class="landing-content-first-left">
          <GradientText>
            <span class="landing-content-first-title">S.Album</span>
          </GradientText>
          <h1 class="landing-content-first-subtitle">
            {{ t('landing.firstTitle') }}
          </h1>
          <span style="width: 500px;line-height:200%;font-size: 14px;">
              {{ t('landing.firstDesc') }}
          </span>
          <AFlex :vertical="false" justify="space-between" align="center" style="width: 350px">
            <AButton type="primary" size="large" href="/login" :style="{width: '150px'}">{{
                t('landing.immediatelyUse')
              }}
            </AButton>
            <AButton type="default" size="large" :style="{width: '150px'}">{{ t('landing.learnMore') }}</AButton>
          </AFlex>
          <AFlex :vertical="false" justify="space-between" align="center" style="width: 300px">
            <a-avatar-group size="large">
              <a-avatar :src="avatar1"/>
              <a-avatar :src="avatar2"/>
              <a-avatar :src="avatar3"/>
              <a-avatar style="background-color: #87d068">
                <template #icon>
                  99+
                </template>
              </a-avatar>
            </a-avatar-group>
            <AFlex :vertical="true">
              <Rate :value="5" disabled :size="12"/>
              <span style="font-size: 13px;">
                from 99+ happy users
              </span>
            </AFlex>
          </AFlex>
        </div>
        <div class="landing-content-first-right">
          <AnimatedNature/>
        </div>
      </AFlex>
    </div>
    <div class="landing-content-second">
      <div class="landing-content-second-container">
        <div class="landing-content-second-left">
          <ACard :hoverable="true">
            <img style="border-radius: 10px;" src="@/assets/images/landing_image1.png" :width="450" :height="450"
                 alt=""/>
          </ACard>
        </div>
        <div class="landing-content-second-right">
          <AFlex :vertical="true" justify="space-between" align="flex-start">
            <h1 style="font-size: 2.5rem;">{{ t('landing.secondTitle') }}</h1>
            <p style="font-size: 16px; line-height: 2">{{ t('landing.secondDesc') }}</p>
          </AFlex>
          <AFlex class="landing-content-second-right-item" :vertical="true" justify="flex-start" align="flex-start">
            <div>
              <div style="font-size: 16px;">
                <CheckOutlined class="landing-content-second-icon"/>
                <span class="landing-content-second-icon-text">{{ t('landing.secondFeature1') }}</span>
                {{ t('landing.secondFeature1Desc') }}
              </div>
            </div>
            <div>
              <div style="font-size: 16px;">
                <CheckOutlined class="landing-content-second-icon"/>
                <span class="landing-content-second-icon-text">{{ t('landing.secondFeature2') }}</span>
                {{ t('landing.secondFeature2Desc') }}
              </div>
            </div>
            <div>
              <div style="font-size: 16px;">
                <CheckOutlined class="landing-content-second-icon"/>
                <span class="landing-content-second-icon-text">{{ t('landing.secondFeature3') }}</span>
                {{ t('landing.secondFeature3Desc') }}
              </div>
            </div>
          </AFlex>
        </div>
      </div>
    </div>
    <div class="landing-content-third">
      <div class="landing-content-third-container">
        <div class="landing-content-third-left">
          <AFlex :vertical="true" justify="space-between" align="flex-start">
            <h1 style="font-size: 2.5rem;">{{ t('landing.thirdTitle') }}</h1>
            <p style="font-size: 16px;">{{ t('landing.thirdDesc') }}</p>
          </AFlex>
          <AFlex class="landing-content-third-right-item" :vertical="true" justify="flex-start" align="flex-start">
            <div>
              <div style="font-size: 16px;">
                <CheckOutlined class="landing-content-third-icon"/>
                <span class="landing-content-third-icon-text">{{ t('landing.thirdFeature1') }}</span>
                {{ t('landing.thirdFeature1Desc') }}
              </div>
            </div>
            <div>
              <div style="font-size: 16px;">
                <CheckOutlined class="landing-content-third-icon"/>
                <span class="landing-content-third-icon-text">{{ t('landing.thirdFeature2') }}</span>
                {{ t('landing.thirdFeature2Desc') }}
              </div>
            </div>
            <div>
              <div style="font-size: 16px;">
                <CheckOutlined class="landing-content-third-icon"/>
                <span class="landing-content-third-icon-text">{{ t('landing.thirdFeature3') }}</span>
                {{ t('landing.thirdFeature3Desc') }}
              </div>
            </div>
          </AFlex>
        </div>
        <div class="landing-content-third-right">
          <ACard :hoverable="true">
            <img style="border-radius: 10px;" src="@/assets/images/landing_image2.png" :width="450" :height="450"
                 alt=""/>
          </ACard>
        </div>
      </div>
    </div>
    <div class="landing-content-fourth">
      <div class="landing-content-fourth-container">
        <div class="landing-content-fourth-top">
          <h1 style="font-size: 3rem;">{{ t('landing.fourthTitle') }}</h1>
        </div>
        <div class="landing-content-fourth-bottom">
          <div class="landing-content-fourth-bottom-item">
            <ACard class="landing-content-fourth-bottom-item-card" :hoverable="true">
              <UngroupOutlined class="landing-content-fourth-bottom-item-icon"/>
            </ACard>
            <span class="landing-content-fourth-bottom-item-title">
              {{ t('landing.fourthFeature1') }}
            </span>
            <p>
              自动识别和分类您的照片，让查找和管理变得更智能。
            </p>
          </div>
          <div class="landing-content-fourth-bottom-item">
            <ACard class="landing-content-fourth-bottom-item-card" :hoverable="true">
              <LockOutlined class="landing-content-fourth-bottom-item-icon"/>
            </ACard>
            <span class="landing-content-fourth-bottom-item-title">
              隐私加密
            </span>
            <p>
              确保您的数据安全，通过先进的隐私保护技术保障用户隐私。
            </p>
          </div>
          <div class="landing-content-fourth-bottom-item">
            <ACard class="landing-content-fourth-bottom-item-card" :hoverable="true">
              <CloudServerOutlined class="landing-content-fourth-bottom-item-icon"/>
            </ACard>
            <span class="landing-content-fourth-bottom-item-title">
              云存储服务
            </span>
            <p>
              安全存储您的照片，实现随时随地访问与管理。
            </p>
          </div>
          <div class="landing-content-fourth-bottom-item">
            <ACard class="landing-content-fourth-bottom-item-card" :hoverable="true">
              <CommentOutlined class="landing-content-fourth-bottom-item-icon"/>
            </ACard>
            <span class="landing-content-fourth-bottom-item-title">
             社区分享
            </span>
            <p>
              简单快速地与朋友分享您的照片，享受社交乐趣。
            </p>
          </div>
          <div class="landing-content-fourth-bottom-item">
            <ACard class="landing-content-fourth-bottom-item-card" :hoverable="true">
              <PictureOutlined class="landing-content-fourth-bottom-item-icon"/>
            </ACard>
            <span class="landing-content-fourth-bottom-item-title">
             照片增强工具
            </span>
            <p>
              多种编辑功能帮助您提升照片质量，展现最佳效果。
            </p>
          </div>
          <div class="landing-content-fourth-bottom-item">
            <ACard class="landing-content-fourth-bottom-item-card" :hoverable="true">
              <SwapOutlined class="landing-content-fourth-bottom-item-icon"/>
            </ACard>
            <span class="landing-content-fourth-bottom-item-title">
             多端同步
            </span>
            <p>
              轻松管理您的照片，随时随地访问，无缝同步。
            </p>
          </div>
        </div>
      </div>
    </div>
    <Clouds/>
  </div>
</template>
<script setup lang="ts">

import Clouds from "@/components/Clouds/Clouds.vue";
import AnimatedNature from "@/components/AnimatedNature/AnimatedNature.vue";
import GradientText from "@/components/MyUI/GradientText/GradientText.vue";
import Rate from "@/components/MyUI/Rate/Rate.vue";
import avatar1 from "@/assets/images/1.png";
import avatar2 from "@/assets/images/2.png";
import avatar3 from "@/assets/images/3.png";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
</script>
<style scoped lang="scss" src="./index.scss">

</style>
