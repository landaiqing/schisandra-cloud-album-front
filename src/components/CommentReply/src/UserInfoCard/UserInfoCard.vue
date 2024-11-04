<template>
  <div class="user-info-card-main">
    <AFlex :vertical="true" justify="flex-start">
      <div>
        <img src="@/assets/images/background.jpg" class="user-info-card-image" :width="350" :height="100" alt=""/>
      </div>
      <AFlex :vertical="false" class="user-info-card-name" style="">
        <AFlex :vertical="true" justify="flex-start">
          <AAvatar :size="48" :src="users.user.userInfo.avatar" class="user-info-card-avatar"/>
        </AFlex>
        <AFlex :vertical="true" justify="flex-start" class="user-info-card-content-container">
          <AFlex :vertical="false" align="center">
            <span class="user-info-card-name-text">
              {{ props.user.nickname }}
            </span>
            <img src="/level_icon/icon/lv1.png" class="user-info-card-level-icon" alt="level">
          </AFlex>
          <AFlex :vertical="false" align="center" justify="space-between" style="width: 250px">

              <span class="user-info-card-info-text">
                416关注
              </span>


            <span class="user-info-card-info-text">
              360.0万粉丝
            </span>

            <span class="user-info-card-info-text">
              5466.5万获赞
            </span>

          </AFlex>
          <AFlex :vertical="false" align="center" style="width: 270px">
            <span class="user-info-card-info-text">
             bilibili个人认证：bilibili 2020百大UP主、知名搞笑UP主<br/>
            商务合作WX: 13311286278
            </span>
          </AFlex>
          <AFlex :vertical="false" align="center" justify="flex-start">
            <AButton type="primary">
              <template #icon>
                <PlusOutlined/>
              </template>
              关 注
            </AButton>
            <AButton type="default" style="margin-left: 10px">
              <template #icon>
                <SendOutlined/>
              </template>
              私 信
            </AButton>
          </AFlex>
        </AFlex>
      </AFlex>
    </AFlex>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});
import useStore from "@/store";

const users = useStore().user;
</script>
<style scoped lang="scss" src="./index.scss">

</style>
