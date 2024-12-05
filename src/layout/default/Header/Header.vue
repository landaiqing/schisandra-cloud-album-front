<template>
  <header class="header-main">
    <div class="header-container">
      <AFlex :vertical="false" align="center" justify="flex-start" class="header-logo-container">
        <APopover placement="bottomRight" trigger="click" :arrow="false">
          <template #content>
            <div style="width: 500px;height: 300px">
              888
            </div>
          </template>
          <ACard :body-style="{ padding: '0px' }" :hoverable="true"
                 @focus="handleCardFocus"
                 @blur="handleCardBlur"
                 tabindex="0"
                 :style="cardStyle"
          >
            <AAvatar :size="50" shape="square" :src="logo"/>
          </ACard>
        </APopover>
        <span class="header-logo-text" @click="router.push('/')">S.Album</span>
      </AFlex>
      <AFlex class="header-search-container" :vertical="false" align="center" justify="center">
        <APopover :arrow="false" :overlayInnerStyle="{width: '28vw'}"
                  trigger="click">
          <AInput size="large" class="header-search-input"
                  @focus="handleInputFocus"
                  @blur="handleInputBlur"
                  :style="{borderRadius: borderRadius, boxShadow: boxShadow}"
          >
            <template #suffix>
              <AButton size="small" type="text" shape="circle" @click.prevent>
                <template #icon>
                  <AAvatar size="small" shape="circle" :src="search"/>
                </template>
              </AButton>
            </template>
          </AInput>
          <template #content>
            <AFlex :vertical="false" align="center" justify="space-between" class="header-search-content-header">
              <span>搜索历史</span>
              <AButton type="text" size="small" style="color: #707072">清空搜索历史</AButton>
            </AFlex>
            <div class="header-search-content-body">
              <ATag :style="{
                padding: '5px 15px',
                fontSize: '15px',
                marginTop: '20px',
              }" :bordered="false" closable>搜索历史1
              </ATag>
            </div>
          </template>
        </APopover>
      </AFlex>
      <AFlex :vertical="false" align="center" justify="flex-end" class="header-menu-container">
        <AFlex :vertical="false" align="center" justify="flex-start" class="header-menu-item" gap="large">

          <AButton type="text" shape="circle" size="large" class="header-menu-item-btn">
            <template #icon>
              <AAvatar size="default" shape="circle" :src="community"/>
            </template>
          </AButton>

          <ABadge :dot="true" :numberStyle="{
            marginTop: '10px',
            marginRight: '5px',
            backgroundColor: 'rgba(77,167,255,0.89)',
          }">
            <div class="button-wrapper">
              <ADropdown :trigger="['click']">
                <AButton type="text" shape="circle" size="large" class="header-menu-item-btn bouncing-button">
                  <template #icon>
                    <AAvatar size="small" shape="circle" :src="notice"/>
                  </template>
                </AButton>
                <template #overlay>
                  <AMenu>
                    <AMenuItem key="reply">
                      <template #icon>
                        <EnterOutlined/>
                      </template>
                      <span>回复我的</span>
                    </AMenuItem>
                    <AMenuItem key="like">
                      <template #icon>
                        <LikeOutlined/>
                      </template>
                      <span>收到的赞</span>
                    </AMenuItem>
                    <AMenuItem key="message">
                      <template #icon>
                        <NotificationOutlined/>
                      </template>
                      <span>系统消息</span>
                    </AMenuItem>
                  </AMenu>
                </template>
              </ADropdown>
            </div>
          </ABadge>


        </AFlex>
        <AFlex :vertical="false" align="center" justify="flex-start" class="header-user-container">
          <ADropdown :trigger="['click']">
            <div class="avatar-wrapper">
              <AAvatar :size="40" class="header-user-avatar" :src="user.user.avatar"/>
            </div>
            <template #overlay>
              <ACard style="width: 300px;height: 500px;background-color: white;"></ACard>
            </template>
          </ADropdown>
        </AFlex>
      </AFlex>
    </div>
  </header>
</template>
<script lang="ts" setup>
import logo from "@/assets/svgs/logo-album.svg";
import useStore from "@/store";
import notice from '@/assets/svgs/notice.svg';
import community from '@/assets/svgs/community.svg';
import search from '@/assets/svgs/search.svg';
const user = useStore().user;
const router = useRouter();
const borderRadius = ref('20px');
const boxShadow = ref('none');
const cardShadow = ref('none');
/**
 * 监听输入框聚焦事件
 */
const handleInputFocus = () => {
  borderRadius.value = '10px'; // 聚焦时圆角变为0
  boxShadow.value = '0 0 10px rgba(0, 123, 255, 0.5)'; // 聚焦时增加阴影
};
/**
 * 监听输入框失焦事件
 */
const handleInputBlur = () => {
  borderRadius.value = '20px'; // 失去焦点时圆角恢复
  boxShadow.value = 'none'; // 失去焦点时阴影消失
};
/**
 * 监听卡片聚焦事件
 */
const handleCardFocus = () => {
  cardShadow.value = '0 0 10px rgba(0, 123, 255, 0.5)'; // 卡片的阴影
};
/**
 * 监听卡片失焦事件
 */
const handleCardBlur = () => {
  cardShadow.value = 'none'; // 失去焦点时阴影消失
};

// 将卡片样式作为计算属性
const cardStyle = computed(() => ({
  boxShadow: cardShadow.value,
}));
</script>
<style scoped lang="scss" src="./index.scss">

</style>
