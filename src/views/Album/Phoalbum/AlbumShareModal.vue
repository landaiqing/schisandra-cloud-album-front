<template>
  <AModal v-model:open="imageStore.openAlbumShareDialog" :footer="null" width="25%"
          @cancel="imageStore.openAlbumShareDialogHandler(false, '', 0)">
    <div class="share-modal">
      <div class="share-modal-title">
        <h3>分享相册</h3>
      </div>
      <AAvatar shape="square" :size="200">
        <template #icon>
          <AImage :preview="false" width="100%" height="100%"
                  :src="imageStore.albumShareCoverImage?imageStore.albumShareCoverImage:default_cover"/>
        </template>
      </AAvatar>
      <div class="album-share-select">
        <div class="album-share-select-item">
          <span class="label-text">访问时效</span>
          <ASelect style="width: 50%" placeholder="请选择" :defaultValue="1" v-model:value="expire_date">
            <ASelectOption value="1">1天</ASelectOption>
            <ASelectOption value="3">3天</ASelectOption>
            <ASelectOption value="7">7天</ASelectOption>
            <ASelectOption value="15">15天</ASelectOption>
            <ASelectOption value="30">30天</ASelectOption>
            <ASelectOption value="0">永久</ASelectOption>
          </ASelect>
        </div>
        <div class="album-share-select-item">
          <span class="label-text">访问密码</span>
          <AInputPassword style="width: 50%" v-model:value="access_password" :maxlength="10"
                          :showCount="true"></AInputPassword>
        </div>
        <div class="album-share-select-item">
          <span class="label-text">访问限制</span>
          <AInputNumber style="width: 50%" :defaultValue="100" :min="1"
                        v-model:value="access_limit"></AInputNumber>
        </div>
      </div>
      <AButton type="primary" size="large" shape="round" style="width: 100%" @click="createShare">
        <template #icon>
          <PlusSquareOutlined/>
        </template>
        创建分享
      </AButton>
    </div>
  </AModal>
</template>
<script setup lang="ts">
import useStore from "@/store";
import default_cover from "@/assets/images/default-cover.png";
import {albumShareApi} from "@/api/storage";
import {message} from "ant-design-vue";

const imageStore = useStore().image;
const upload = useStore().upload;

const expire_date = ref<string>("1");

const access_limit = ref<number>(100);

const access_password = ref<string>("");

/**
 * 创建分享
 */
async function createShare() {
  const res: any = await albumShareApi(
      imageStore.albumShareId,
      expire_date.value,
      access_limit.value,
      access_password.value,
      upload.storageSelected?.[0],
      upload.storageSelected?.[1]
  );
  if (res && res.code === 200) {
    imageStore.openAlbumShareDialogHandler(false, '', 0);
    message.success("分享成功");
  } else {
    message.error("分享失败");
  }
}

</script>
<style scoped lang="scss">
.share-modal {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  .album-share-select {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: nowrap;

    .album-share-select-item {
      width: 100%;
      height: 5vh;
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;

      .label-text {
        width: 50%;
        color: #999999;
        font-size: 2.2vh;
      }
    }
  }
}
</style>
