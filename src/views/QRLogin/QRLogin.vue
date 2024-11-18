<template>
  <div class="qrlogin-main">
    <div class="qrlogin-left">
      <BoxDog/>
    </div>
    <div class="qrlogin-right">
      <span class="qrlogin-right-title">{{ t("login.title") }}</span>
      <ACard class="qrlogin-card" bordered :hoverable="false">
        <AFlex :vertical="true" align="center">
          <span class="qrlogin-card-item-span">{{ t("login.qrLogin") }}</span>
          <span class="qrlogin-card-item-info">
            {{ t("login.open") }}
            <span class="qrlogin-card-wechat">{{ t("login.wechat") }}</span>
            {{ t("login.scan") }}
            </span>
          <AQrcode
              class="qrlogin-card-qr"
              :size="280"
              :error-level="'H'"
              :status="status"
              @refresh="getQrCode"
              :value=qrcode
              :icon="logo"
          />
        </AFlex>
        <QRLoginFooter/>
        <ATooltip placement="left">
          <template #title>
            <span>{{ t("login.phoneLogin") }}</span>
          </template>
          <div @click="()=>{
            router.push('/login')
          }" class="qrlogin-right-qrcode"/>
        </ATooltip>
      </ACard>
    </div>
    <div class="area">
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useI18n} from "vue-i18n";
import BoxDog from "@/components/BoxDog/BoxDog.vue";
import QRLoginFooter from "@/views/QRLogin/QRLoginFooter.vue";
import {useRouter} from 'vue-router';
import {generateQrCode} from "@/api/oauth/wechat.ts";
import {onBeforeUnmount, onMounted, ref} from "vue";
import logo from "@/assets/svgs/logo-schisandra.svg";

import useStore from "@/store";
import {message} from "ant-design-vue";
import {generateClientId} from "@/api/client";
import {getUserDevice} from "@/api/user";

const {t} = useI18n();

const router = useRouter();
const client = useStore().client;
const qrcode = ref<string>('');
const status = ref<string>('loading');
const websocket = useStore().websocket;
const userStore = useStore().user;

/**
 *  获取client_id
 */
async function getClientId() {
  const res: any = await generateClientId();
  if (res.code === 200 && res.data) {
    client.setClientId(res.data);
  }
}


/**
 *  获取二维码
 */
async function getQrCode() {
  const res: any = await generateQrCode(client.getClientId() || "");
  if (res.code === 200 && res.data) {
    status.value = 'active';
    qrcode.value = res.data;
    await handleListenMessage();
  } else {
    status.value = 'expired';
  }
}


const wsOptions = {
  url: import.meta.env.VITE_QR_SOCKET_URL + "?client_id=" + client.getClientId(),
};


/**
 *  监听消息
 */
async function handleListenMessage() {
  websocket.initialize(wsOptions);
  // 注册消息接收处理函数
  websocket.on('message', async (res: any) => {
    if (res.code === 200 && res.data) {
      userStore.user.uid = res.data.uid;
      userStore.user.access_token = res.data.access_token;
      userStore.user.username = res.data.username;
      userStore.user.avatar = res.data.avatar;
      userStore.user.nickname = res.data.nickname;
      userStore.user.status = res.data.status;
      status.value = 'scanned';
      await getUserDevice();
      message.success(t('login.loginSuccess'));
      setTimeout(() => {
        router.push('/main');
      }, 1000);
    }
  });
}

onMounted(async () => {
  getClientId().then(async () => {
    await getQrCode();
  });
});
onBeforeUnmount(() => {
  websocket.close(false);
});
</script>
<style src="./index.scss" lang="scss" scoped>

</style>
