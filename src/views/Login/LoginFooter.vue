<template>
  <div>
    <ADivider/>
    <AFlex :vertical="false" align="center" justify="space-around">
      <AButton href="/qrlogin" class="login-form-bottom-button" :icon="h(QrcodeOutlined)">{{ t("login.qrLogin") }}
      </AButton>
      <AButton @click="userStore.openQQUrl" class="login-form-bottom-button" :icon="h(QqOutlined)"></AButton>
      <AButton @click="userStore.openGithubUrl" class="login-form-bottom-button"
               style="display: flex; align-items: center;justify-content: center;">
        <template #icon>
          <img :src=gitee alt="gitee" class="gitee-icon" style="width: 16px; height: 16px;"/>
        </template>
      </AButton>
      <AButton @click="userStore.openGiteeUrl" class="login-form-bottom-button" :icon="h(GithubOutlined)"></AButton>
    </AFlex>
  </div>
</template>
<script setup lang="ts">
import {GithubOutlined, QqOutlined, QrcodeOutlined} from "@ant-design/icons-vue";
import {useI18n} from "vue-i18n";
import {h, onBeforeMount} from "vue";
import useStore from "@/store";
import gitee from "@/assets/svgs/gitee.svg";

const {t} = useI18n();

const userStore = useStore().user;


onBeforeMount(() => {
  userStore.getClientId().then(() => {
    userStore.getGithubRedirectUrl();
    userStore.getGiteeRedirectUrl();
    userStore.getQQRedirectUrl();
  });
});
</script>
<style src="./index.scss" lang="scss" scoped>

</style>
