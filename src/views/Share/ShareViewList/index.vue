<template>

  <div class="share-view-main">
    <div class="main-header">
      <Header/>
    </div>
    <div class="share-view-content">
      <ShareSidebar :share-info="shareInfo"/>
      <div class="share-view-content-container">
        <div class="share-content-header">
          <AButton type="link" size="large" class="share-content-header-button">图片列表</AButton>
          <AAvatar size="small" shape="square" :src="imageList && imageList.length === 0? lock2 : unlock"/>
        </div>
        <div class="share-content-verify"
             v-if="imageList && imageList.length === 0 && !getPassword">
          <AInputPassword size="large" placeholder="请输入访问密码" style="width: 20%"
                          @keyup.enter="(e)=>getShareImages(e.target.value)"/>
          <p style="font-size: 12px;color: #999;">回车后可查看图片列表</p>
        </div>
        <div v-else class="share-content-list">
          <ImageWaterfallList :image-list="imageList"/>
        </div>
      </div>
      <AFloatButton v-if="imageList && imageList.length > 0" tooltip="评论" :badge="{ count: 0, color: 'green' }"
                    @click="shareStore.setOpenCommentDrawer(true)"
      >
        <template #icon>
          <CommentOutlined/>
        </template>
      </AFloatButton>
      <CommentModal :topic-id="getInviteCode"/>
    </div>
  </div>
</template>
<script setup lang="ts">

import Header from "@/layout/default/Header/Header.vue";
import ShareSidebar from "@/views/Share/ShareViewList/ShareSidebar.vue";
import lock2 from "@/assets/svgs/lock-2.svg";
import unlock from "@/assets/svgs/unlock.svg";
import {queryShareImageApi, queryShareInfoApi} from "@/api/share";
import ImageWaterfallList from "@/components/ImageWaterfallList/ImageWaterfallList.vue";
import useStore from "@/store";
import CommentModal from "@/views/Share/ShareViewList/CommentModal.vue";
import {message} from "ant-design-vue";

const imageList = ref<any[]>([]);

const route = useRoute();

const imageStore = useStore().image;
const shareStore = useStore().share;
const shareInfo = ref<any>();


/**
 * 获取分享图片列表
 * @param password
 */
async function getShareImages(password: string) {
  imageStore.imageListLoading = true;
  const invite_code = route.params.id;
  const code = Array.isArray(invite_code) ? invite_code[0] : invite_code;
  const res: any = await queryShareImageApi(code, password);
  if (res && res.code === 200) {
    imageList.value = res.data.records;
    shareStore.addPassword(code, password);
    await getShareInfo(code, password);
  } else {
    imageList.value = [];
    message.warning(res.msg);
  }
  imageStore.imageListLoading = false;
}

async function getShareInfo(invite_code: string, password: string) {
  const res: any = await queryShareInfoApi(invite_code, password);
  if (res && res.code === 200) {
    shareInfo.value = res.data;
  }
}

const getPassword = computed(() => {
  const invite_code = route.params.id;
  const code = Array.isArray(invite_code) ? invite_code[0] : invite_code;
  return shareStore.getPassword(code);
});

const getInviteCode = computed(() => {
  const invite_code = route.params.id;
  return Array.isArray(invite_code) ? invite_code[0] : invite_code;
});

onMounted(() => {
  if (getPassword.value) {
    getShareImages(getPassword.value);
  }

});


</script>
<style scoped lang="scss">
.share-view-main {
  display: flex;
  flex-direction: column;
  background-color: #eaeef6;
  color: var(--text-color);
  width: 100vw;
  height: 100%;

  .share-view-content {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100vh - 70px);

    .share-view-content-container {
      width: calc(100vw - 230px);
      height: calc(100vh - 100px);
      padding: 15px;
      overflow: auto;

      .share-content-header {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        //gap: 10px;
        border-bottom: 1px solid #e2e2e2;

        .share-content-header-button {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
      }

      .share-content-verify {
        width: calc(100vw - 230px);
        height: calc(100vh - 155px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .share-content-list {
        width: calc(100vw - 230px);
        height: calc(100vh - 155px);
      }
    }

  }
}

</style>
