<template>
  <div>
    <ADivider/>
    <AFlex :vertical="false" align="center" justify="space-around">
      <AButton @click="()=>{
          router.push('/login')
      }" class="qrlogin-form-bottom-button" :icon="h(TabletOutlined)">{{ t("login.phoneLoginAndRegister") }}
      </AButton>
      <AButton @click="openQQUrl" class="qrlogin-form-bottom-button" :icon="h(QqOutlined)"></AButton>
      <AButton @click="openGiteeUrl" class="qrlogin-form-bottom-button"
               style="display: flex; align-items: center;justify-content: center;">
        <template #icon>
          <img :src=gitee alt="gitee" class="gitee-icon" style="width: 16px; height: 16px;"/>
        </template>
      </AButton>
      <AButton @click="openGithubUrl" class="qrlogin-form-bottom-button" :icon="h(GithubOutlined)"></AButton>
    </AFlex>
  </div>
</template>
<script setup lang="ts">
import {GithubOutlined, QqOutlined, TabletOutlined} from "@ant-design/icons-vue";
import {useI18n} from "vue-i18n";
import {h, onBeforeMount, ref} from "vue";
import {useRouter} from 'vue-router';
import {getGithubUrl} from "@/api/oauth/github.ts";
import {getGiteeUrl} from "@/api/oauth/gitee.ts";
import useStore from "@/store";
import {message} from "ant-design-vue";
import gitee from "@/assets/svgs/gitee.svg";
import {generateClientId} from "@/api/oauth/wechat.ts";
import {getQQUrl} from "@/api/oauth/qq.ts";

const router = useRouter();
const {t} = useI18n();

const githubRedirectUrl = ref<string>('');
const giteeRedirectUrl = ref<string>('');
const qqRedirectUrl = ref<string>('');

/**
 * Get the redirect url of Github OAuth
 */
async function getGithubRedirectUrl() {
  const clientId: string = getLocalClientId() as string;
  const res: any = await getGithubUrl(clientId);
  if (res.code === 0 && res.data) {
    githubRedirectUrl.value = res.data;
  }
}

/**
 * Get the redirect url of Gitee OAuth
 */
async function getGiteeRedirectUrl() {
  const res: any = await getGiteeUrl();
  if (res.code === 0 && res.data) {
    giteeRedirectUrl.value = res.data;
  }
}

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
 * Get the redirect url of QQ OAuth
 */
async function getQQRedirectUrl() {
  const clientId: string = getLocalClientId() as string;
  const res: any = await getQQUrl(clientId);
  if (res.code === 0 && res.data) {
    qqRedirectUrl.value = res.data;
  }
}

/**
 *  获取本地client_id
 */
function getLocalClientId(): string | null {
  const clientID: string | null = localStorage.getItem('client_id');
  if (clientID) {
    return clientID;
  } else {
    getClientId();
    return localStorage.getItem('client_id');
  }
}

/**
 * Open the Github OAuth page in a new window
 */
const openGithubUrl = () => {
  const iWidth = 800;                         //弹出窗口的宽度;
  const iHeight = 500;                        //弹出窗口的高度;
  //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
  const iTop = (window.screen.height - 30 - iHeight) / 2;       //获得窗口的垂直位置;
  const iLeft = (window.screen.width - 10 - iWidth) / 2;        //获得窗口的水平位置;
  window.open(githubRedirectUrl.value, 'newwindow', 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');

  const messageHandler = (e: any) => {
    if (typeof e.data === 'string') {
      const data: any = JSON.parse(e.data);
      if (data.code === 0 && data.data) {
        const user = useStore().user;
        const {access_token, refresh_token, uid, expires_at} = data.data;
        user.user.accessToken = access_token;
        user.user.refreshToken = refresh_token;
        user.user.uid = uid;
        user.user.expiresAt = expires_at;
        message.success(t('login.loginSuccess'));
        window.removeEventListener("message", messageHandler);
        setTimeout(() => {
          router.push('/main');
        }, 1000);
      }
    }
  };
  window.addEventListener("message", messageHandler);
};
/**
 * Open the Gitee OAuth page in a new window
 */
const openGiteeUrl = () => {
  const iWidth = 800;                         //弹出窗口的宽度;
  const iHeight = 500;                        //弹出窗口的高度;
  //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
  const iTop = (window.screen.height - 30 - iHeight) / 2;       //获得窗口的垂直位置;
  const iLeft = (window.screen.width - 10 - iWidth) / 2;        //获得窗口的水平位置;
  window.open(giteeRedirectUrl.value, '_blank', 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');


  const messageHandler = (e: any) => {
    if (typeof e.data === 'string') {
      const data: any = JSON.parse(e.data);
      if (data.code === 0 && data.data) {
        const user = useStore().user;
        const {access_token, refresh_token, uid, expires_at} = data.data;
        user.user.accessToken = access_token;
        user.user.refreshToken = refresh_token;
        user.user.uid = uid;
        user.user.expiresAt = expires_at;
        message.success(t('login.loginSuccess'));
        window.removeEventListener("message", messageHandler);
        setTimeout(() => {
          router.push('/main');
        }, 1000);
      }
    }
  };
  window.addEventListener("message", messageHandler);
};


/**
 * Open the QQ OAuth page in a new window
 */
const openQQUrl = () => {
  const iWidth = 800;                         //弹出窗口的宽度;
  const iHeight = 500;                        //弹出窗口的高度;
  //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
  const iTop = (window.screen.height - 30 - iHeight) / 2;       //获得窗口的垂直位置;
  const iLeft = (window.screen.width - 10 - iWidth) / 2;        //获得窗口的水平位置;
  window.open(qqRedirectUrl.value, 'newwindow', 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');

  const messageHandler = (e: any) => {
    if (typeof e.data === 'string') {
      const data: any = JSON.parse(e.data);
      if (data.code === 0 && data.data) {
        const user = useStore().user;
        const {access_token, refresh_token, uid, expires_at} = data.data;
        user.user.accessToken = access_token;
        user.user.refreshToken = refresh_token;
        user.user.uid = uid;
        user.user.expiresAt = expires_at;
        message.success(t('login.loginSuccess'));
        window.removeEventListener("message", messageHandler);
        setTimeout(() => {
          router.push('/main');
        }, 1000);
      }
    }
  };
  window.addEventListener("message", messageHandler);
};
onBeforeMount(() => {
  getGithubRedirectUrl();
  getGiteeRedirectUrl();
  getQQRedirectUrl();
});
</script>
<style src="./index.scss" scoped>

</style>
