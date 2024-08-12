<template>
  <div>
    <ADivider/>
    <AFlex :vertical="false" align="center" justify="space-around">
      <AButton @click="()=>{
          router.push('/qrlogin')
      }" class="login-form-bottom-button" :icon="h(QrcodeOutlined)">{{ t("login.qrLogin") }}
      </AButton>
      <AButton class="login-form-bottom-button" :icon="h(QqOutlined)"></AButton>
      <AButton class="login-form-bottom-button" :icon="h(GithubOutlined)"></AButton>
    </AFlex>
  </div>
</template>
<script setup lang="ts">
import {GithubOutlined, QqOutlined, QrcodeOutlined} from "@ant-design/icons-vue";
import {useI18n} from "vue-i18n";
import {h} from "vue";
import {useRouter} from 'vue-router';

const router = useRouter();
const {t} = useI18n();
</script>
<style src="./index.scss" scoped>

</style>
