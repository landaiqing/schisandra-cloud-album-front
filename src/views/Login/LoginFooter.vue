<template>
  <div>
    <ADivider/>
    <AFlex :vertical="false" align="center" justify="space-around">
      <AButton @click="()=>{
          router.push('/qrlogin')
      }" class="login-form-bottom-button" :icon="h(QrcodeOutlined)">{{ t("login.qrLogin") }}
      </AButton>
      <AButton @click="openQQbUrlDebounce" class="login-form-bottom-button" :icon="h(QqOutlined)"></AButton>
      <AButton @click="openGiteebUrlDebounce" class="login-form-bottom-button"
               style="display: flex; align-items: center;justify-content: center;">
        <template #icon>
          <img :src=gitee alt="gitee" class="gitee-icon" style="width: 16px; height: 16px;"/>
        </template>
      </AButton>
      <AButton @click="openGithubUrlDebounce" class="login-form-bottom-button" :icon="h(GithubOutlined)"></AButton>
    </AFlex>
  </div>
</template>
<script setup lang="ts">
import {GithubOutlined, QqOutlined, QrcodeOutlined} from "@ant-design/icons-vue";
import {useI18n} from "vue-i18n";
import {h, onBeforeMount, ref} from "vue";
import {useRouter} from 'vue-router';
import {getGithubUrl} from "@/api/oauth/github.ts";
import {getGiteeUrl} from "@/api/oauth/gitee.ts";
import useStore from "@/store";
import {message} from "ant-design-vue";
import gitee from "@/assets/svgs/gitee.svg";
import {getQQUrl} from "@/api/oauth/qq.ts";
import {useDebounceFn} from "@vueuse/core";
import {generateClientId} from "@/api/oauth";
import {getUserDevice} from "@/api/user";

const router = useRouter();
const {t} = useI18n();
const githubRedirectUrl = ref<string>('');
const giteeRedirectUrl = ref<string>('');
const qqRedirectUrl = ref<string>('');
const client = useStore().client;

/**
 * Get the redirect url of Github OAuth
 */
async function getGithubRedirectUrl() {
  const res: any = await getGithubUrl(client.getClientId() as string);
  if (res.code === 200 && res.data) {
    githubRedirectUrl.value = res.data;
  }
}

/**
 * Get the redirect url of Gitee OAuth
 */
async function getGiteeRedirectUrl() {
  const res: any = await getGiteeUrl();
  if (res.code === 200 && res.data) {
    giteeRedirectUrl.value = res.data;
  }
}

/**
 * Get the redirect url of QQ OAuth
 */
async function getQQRedirectUrl() {
  const res: any = await getQQUrl(client.getClientId() as string);
  if (res.code === 200 && res.data) {
    qqRedirectUrl.value = res.data;
  }
}

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
 * Open the Github OAuth page in a new window with debounce
 */
const openGithubUrlDebounce = useDebounceFn(openGithubUrl, 1000);

/**
 * Open the Github OAuth page in a new window
 */
function openGithubUrl() {
  const iWidth = 800;                         //弹出窗口的宽度;
  const iHeight = 500;                        //弹出窗口的高度;
  //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
  const iTop = (window.screen.height - 30 - iHeight) / 2;       //获得窗口的垂直位置;
  const iLeft = (window.screen.width - 10 - iWidth) / 2;        //获得窗口的水平位置;
  window.open(githubRedirectUrl.value, 'newwindow', 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');

  const messageHandler = async (e: any) => {
    if (typeof e.data === 'string') {
      const data: any = JSON.parse(e.data);
      if (data.code === 200 && data.data) {
        const user = useStore().user;
        const {access_token, refresh_token, uid, expires_at, user_info} = data.data;
        user.user.accessToken = access_token;
        user.user.refreshToken = refresh_token;
        user.user.uid = uid;
        user.user.expiresAt = expires_at;
        user.user.userInfo = user_info;
        await getUserDevice(uid);
        message.success(t('login.loginSuccess'));
        window.removeEventListener("message", messageHandler);
        setTimeout(() => {
          router.push('/main');
        }, 1000);
      } else {
        message.error(t('login.loginError'));
        window.removeEventListener("message", messageHandler);
      }

    }
  };
  window.addEventListener("message", messageHandler);
}

/**
 * Open the Gitee OAuth page in a new window with debounce
 */
const openGiteebUrlDebounce = useDebounceFn(openGiteeUrl, 1000);

/**
 * Open the Gitee OAuth page in a new window
 */
function openGiteeUrl() {
  const iWidth = 800;                         //弹出窗口的宽度;
  const iHeight = 500;                        //弹出窗口的高度;
  //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
  const iTop = (window.screen.height - 30 - iHeight) / 2;       //获得窗口的垂直位置;
  const iLeft = (window.screen.width - 10 - iWidth) / 2;        //获得窗口的水平位置;
  window.open(giteeRedirectUrl.value, '_blank', 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');


  const messageHandler = async (e: any) => {
    if (typeof e.data === 'string') {
      const data: any = JSON.parse(e.data);
      if (data.code === 200 && data.data) {
        const user = useStore().user;
        const {access_token, refresh_token, uid, expires_at, user_info} = data.data;
        user.user.accessToken = access_token;
        user.user.refreshToken = refresh_token;
        user.user.uid = uid;
        user.user.expiresAt = expires_at;
        user.user.userInfo = user_info;
        await getUserDevice(uid);
        message.success(t('login.loginSuccess'));
        window.removeEventListener("message", messageHandler);
        setTimeout(() => {
          router.push('/main');
        }, 1000);
      } else {
        message.error(t('login.loginError'));
        window.removeEventListener("message", messageHandler);
      }
    }
  };
  window.addEventListener("message", messageHandler);
}

/**
 * Open the QQ OAuth page in a new window with debounce
 */
const openQQbUrlDebounce = useDebounceFn(openQQUrl, 1000);

/**
 * Open the QQ OAuth page in a new window
 */
function openQQUrl() {
  const iWidth = 800;                         //弹出窗口的宽度;
  const iHeight = 500;                        //弹出窗口的高度;
  //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
  const iTop = (window.screen.height - 30 - iHeight) / 2;       //获得窗口的垂直位置;
  const iLeft = (window.screen.width - 10 - iWidth) / 2;        //获得窗口的水平位置;
  window.open(qqRedirectUrl.value, 'newwindow', 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');

  const messageHandler = async (e: any) => {
    if (typeof e.data === 'string') {
      const data: any = JSON.parse(e.data);
      if (data.code === 200 && data.data) {
        const user = useStore().user;
        const {access_token, refresh_token, uid, expires_at, user_info} = data.data;
        user.user.accessToken = access_token;
        user.user.refreshToken = refresh_token;
        user.user.uid = uid;
        user.user.expiresAt = expires_at;
        user.user.userInfo = user_info;
        await getUserDevice(uid);
        message.success(t('login.loginSuccess'));
        window.removeEventListener("message", messageHandler);
        setTimeout(() => {
          router.push('/main');
        }, 1000);
      } else {
        message.error(t('login.loginError'));
        window.removeEventListener("message", messageHandler);
      }

    }
  };
  window.addEventListener("message", messageHandler);
}

onBeforeMount(() => {
  getClientId().then(() => {
    getGithubRedirectUrl();
    getGiteeRedirectUrl();
    getQQRedirectUrl();
  });
});
</script>
<style src="./index.scss" scoped>

</style>
