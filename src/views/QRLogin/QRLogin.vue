<template>
  <div class="qrlogin-main">
    <div class="qrlogin-left">
      <AFlex style="margin-left: 20px;" :vertical="false" align="center" justify="flex-start">
        <img class="qrlogin-header-logo" src="@/assets/svgs/logo-album.svg" alt="logo" @click="router.push('/')">
        <span class="qrlogin-header-logo-text" @click="router.push('/')">S.Album</span>
      </AFlex>
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
    <BackgroundAnimation/>
  </div>
</template>
<script setup lang="ts">
import {useI18n} from "vue-i18n";
import BoxDog from "@/components/BoxDog/BoxDog.vue";
import QRLoginFooter from "@/views/QRLogin/QRLoginFooter.vue";
import {useRouter} from 'vue-router';
import {generateQrCode} from "@/api/oauth/wechat.ts";
import logo from "@/assets/svgs/logo-album.svg";

import useStore from "@/store";
import {message} from "ant-design-vue";
import {getUserDevice} from "@/api/user";
import BackgroundAnimation from "@/components/BackgroundAnimation/BackgroundAnimation.vue";

const {t} = useI18n();

const router = useRouter();

const qrcode = ref<string>('');
const status = ref<string>('loading');
const websocket = useStore().websocket;
const userStore = useStore().user;


/**
 *  获取二维码
 */
async function getQrCode() {
  const res: any = await generateQrCode(userStore.clientId);
  if (res && res.code === 200) {
    qrcode.value = res.data;
    await handleListenMessage();
  } else {
    status.value = 'expired';
  }
}


const wsOptions = {
  url: import.meta.env.VITE_QR_SOCKET_URL + "?client_id=" + userStore.clientId,
  reconnectTimeout: 10000,
};


/**
 *  监听消息
 */
async function handleListenMessage() {
  websocket.initialize(wsOptions);
  // 注册消息接收处理函数
  websocket.on('message', async (res: any) => {
    if (res && res.code === 200) {
      status.value = 'scanned';
      const {data} = res;
      userStore.user.uid = data.uid;
      userStore.user.access_token = data.access_token;
      userStore.user.username = data.username;
      userStore.user.avatar = data.avatar;
      userStore.user.nickname = data.nickname;
      userStore.user.status = data.status;
      await getUserDevice(data.access_token);
      message.success(t('login.loginSuccess'));
      setTimeout(() => {
        router.push('/main/photo/all');
      }, 1000);
    }
  });
}

onMounted(async () => {
  userStore.getClientId().then(async () => {
    await getQrCode();
  });
});
onBeforeUnmount(() => {
  websocket.close(false);
});

watch(
    () => websocket.readyState,
    (newStatus) => {
      if (newStatus === WebSocket.OPEN) {
        status.value = 'active';
      } else {
        status.value = 'expired';
      }
    }
);
</script>
<style src="./index.scss" lang="scss" scoped>

</style>
