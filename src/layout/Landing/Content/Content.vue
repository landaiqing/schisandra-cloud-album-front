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
