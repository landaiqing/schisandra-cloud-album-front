<template>
  <div class="privacy-photo">
    <div class="privacy-photo-header">
      <AButton type="link" size="large" class="privacy-photo-title">
        <template #icon>
          <AAvatar size="small" shape="square" :src="privacy"/>
        </template>
        隐私空间
      </AButton>
      <AButton type="default" danger shape="round" size="middle" @click="goBack">
        <template #icon>
          <LogoutOutlined/>
        </template>
        退出
      </AButton>
    </div>
    <div class="photo-list" v-if="imageList && imageList.length > 0">
      <PrivacyImageList :image-list="imageList"/>
    </div>
    <div v-else class="password-verify">
      <AInputPassword status="warning" size="large" placeholder="请输入密码" style="width: 20%"
                      v-model:value="password"
                      @keyup.enter="getTextCaptcha"
      />
      <p style="font-size: 12px;color: #999;">回车后可查看隐私图片列表</p>
      <AModal v-model:open="showTextCaptcha" :footer="null" :closable="false" width="375" :centered="true"
              :maskClosable="false" :bodyStyle="{padding: 0}">
        <gocaptcha-click
            :config="{}"
            :data="{
              image: captchaData.image,
              thumb: captchaData.thumb,
          }"
            :events="textCaptchaEvent"
            ref="captcha"
        />
      </AModal>
    </div>
  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
import {getPrivateImageListApi} from "@/api/storage";
import {message} from "ant-design-vue";
import privacy from "@/assets/svgs/privacy.svg";
import {getTextCaptchaDataApi} from "@/api/captcha";
import PrivacyImageList from "@/views/Photograph/PrivacySpace/PrivacyImageList.vue";

const uploadStore = useStore().upload;
// const imageStore = useStore().image;
const router = useRouter();

const imageList = ref<any[]>([]);

const captcha = ref<any>(null);
const captchaData = ref<any>({});
const showTextCaptcha = ref(false);
const password = ref<string>("");
const sysStroe = useStore().system;

const textCaptchaEvent: any = {
  confirm: (dots: any, reset: () => void) => {
    getPrivateImageList(dots, reset);
  },
  close: () => {
    showTextCaptcha.value = false;
  },
  refresh: () => {
    getTextCaptcha();
  },
};


async function getTextCaptcha() {
  if (!password.value) return;
  const res: any = await getTextCaptchaDataApi();
  if (res && res.code === 200) {
    captchaData.value = {
      key: res.data.key,
      image: res.data.image,
      thumb: res.data.thumb,
    };
    showTextCaptcha.value = true;
  }
}

async function getPrivateImageList(dots: any, reset: () => void) {
  if (!uploadStore.storageSelected?.[0] || !uploadStore.storageSelected?.[1]) {
    return;
  }
  if (!captchaData.value.key || !password.value) return;
  const dotArr: any[] = [];
  for (let i = 0; i < dots.length; i++) {
    const dot: any = dots[i];
    dotArr.push(dot.x, dot.y);
  }
  const res: any = await getPrivateImageListApi(uploadStore.storageSelected?.[0], uploadStore.storageSelected?.[1], password.value, captchaData.value.key, dotArr.join(','));
  if (res && res.code === 200) {
    imageList.value = res.data.records;
    sysStroe.privacyPassword = password.value;
  } else {
    message.warning(res.msg);
    sysStroe.privacyPassword = "";
    showTextCaptcha.value = false;
    reset();
  }
}

function goBack() {
  router.go(-1);
  sysStroe.privacyPassword = "";
}

onBeforeUnmount(() => {
  sysStroe.privacyPassword = "";
});
</script>
<style scoped lang="scss">
.privacy-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  position: relative;

  .privacy-photo-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    border-bottom: 1px solid #e2e2e2;

    .privacy-photo-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
      color: #333;
    }
  }

  .photo-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: calc(100% - 65px);
  }

  .password-verify {
    width: calc(100vw - 230px);
    height: calc(100vh - 155px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
}
</style>
