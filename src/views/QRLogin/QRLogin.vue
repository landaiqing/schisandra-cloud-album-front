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
              :size="230"
              :error-level="'H'"
              :status="status"
              @refresh="() => {
                getQrCode();
              }"
              :value=qrcode
              :icon="logo"
          />
          <ACheckbox class="qrlogin-card-auto-login">{{ t("login.autoLogin") }}</ACheckbox>
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
  </div>
</template>
<script setup lang="ts">
import {useI18n} from "vue-i18n";
import BoxDog from "@/components/BoxDog/BoxDog.vue";
import QRLoginFooter from "@/views/QRLogin/QRLoginFooter.vue";
import {useRouter} from 'vue-router';
import {closeWebsocket, generateClientId, generateQrCode} from "@/api/oauth/wechat.ts";
import {onMounted, onUnmounted, ref} from "vue";
import logo from "@/assets/svgs/logo-schisandra.svg";
import useWebSocket from "@/utils/websocket/websocket.ts";
import useStore from "@/store";
import {message} from "ant-design-vue";

const {t} = useI18n();

const router = useRouter();

const qrcode = ref<string>('');
const status = ref<string>('loading');

/**
 *  获取client_id
 */
async function getClientId() {
  const id: string | null = localStorage.getItem('client_id');
  if (!id) {
    const res: any = await generateClientId();
    if (res.code === 0 && res.data) {
      localStorage.setItem('client_id', res.data);
    }
  }
}


/**
 *  获取二维码
 */
async function getQrCode() {
  const clientId: string | null = localStorage.getItem('client_id');
  if (!clientId) {
    status.value = 'expired';
    await getClientId();
    return;
  }
  const res: any = await generateQrCode(clientId);
  if (res.code === 0 && res.data) {
    status.value = 'active';
    qrcode.value = res.data;
    localStorage.setItem('qr_code', res.data);
  } else {
    status.value = 'expired';
  }
}

/**
 *  获取本地client_id
 */
function getLocalClientId(): string {
  const clientID: string | null = localStorage.getItem('client_id');
  if (clientID) {
    return clientID;
  } else {
    getClientId();
    return getLocalClientId();
  }

}

const wsOptions = {
  url: import.meta.env.VITE_WEB_SOCKET_URL as string + "?client_id=" + getLocalClientId(),
};

const {open, close, on} = useWebSocket(wsOptions);

onMounted(async () => {
  await getClientId();
  await getQrCode();
  open();

  // 注册消息接收处理函数
  on('message', (data: any) => {
    console.log(data);
    if (data.code === 0 && data.data) {
      const user = useStore().user;
      const {access_token, refresh_token, uid, expires_at} = data.data;
      user.user.accessToken = access_token;
      user.user.refreshToken = refresh_token;
      user.user.uid = uid;
      user.user.expiresAt = expires_at;
      status.value = 'scanned';
      message.success(t('login.loginSuccess'));
    }
  });
});

onUnmounted(async () => {
  await closeWebsocket(getLocalClientId());
  close(true);

});
</script>
<style src="./index.scss" scoped>
@import "@/assets/styles/global.scss";
</style>
