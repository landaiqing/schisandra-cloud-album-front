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
              @refresh="async () => await getQrCode()"
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
import {generateClientId, generateQrCode} from "@/api/oauth";
import {ref} from "vue";
import logo from "@/assets/svgs/logo-schisandra.svg";

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

getClientId();

/**
 *  获取二维码
 */
async function getQrCode() {
  const clientId: any = localStorage.getItem('client_id');
  const res: any = await generateQrCode(clientId);
  console.log(res);
  if (res.code === 0 && res.data) {
    status.value = 'active';
    qrcode.value = res.data;
    localStorage.setItem('qr_code', res.data);
  } else {
    status.value = 'expired';
  }
}

getQrCode();
</script>
<style src="./index.scss" scoped>
@import "@/assets/styles/global.scss";
</style>
