<template>
  <div>
    <ADivider/>
    <AFlex :vertical="false" align="center" justify="space-around">
      <AButton @click="router.push('/login')" class="qrlogin-form-bottom-button" :icon="h(TabletOutlined)">
        {{ t("login.phoneLoginAndRegister") }}
      </AButton>
      <AButton @click="userStore.openQQUrl" class="qrlogin-form-bottom-button" :icon="h(QqOutlined)"></AButton>
      <AButton @click="userStore.openGiteeUrl" class="qrlogin-form-bottom-button"
               style="display: flex; align-items: center;justify-content: center;">
        <template #icon>
          <img :src=gitee alt="gitee" class="gitee-icon" style="width: 16px; height: 16px;"/>
        </template>
      </AButton>
      <AButton @click="userStore.openGithubUrl" class="qrlogin-form-bottom-button" :icon="h(GithubOutlined)"></AButton>
    </AFlex>
  </div>
</template>
<script setup lang="ts">
import {GithubOutlined, QqOutlined, TabletOutlined} from "@ant-design/icons-vue";
import {useI18n} from "vue-i18n";
import {h, onBeforeMount} from "vue";
import useStore from "@/store";

import gitee from "@/assets/svgs/gitee.svg";

const userStore = useStore().user;
const {t} = useI18n();
const router = useRouter();
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
