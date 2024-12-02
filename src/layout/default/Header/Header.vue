<template>
  <header class="header-main">
    <div class="header-container">
      <AFlex :vertical="false" align="center" justify="flex-start" class="header-logo-container">
        <AAvatar :size="50" shape="square" :src="logo" @click="router.push('/')"/>
        <span class="header-logo-text" @click="router.push('/')">S.Album</span>
      </AFlex>
      <AFlex class="header-search-container" :vertical="false" align="center" justify="center">
        <APopover :arrow="false" :overlayInnerStyle="{width: '28vw'}"
                  trigger="click">
          <AInput size="large" class="header-search-input" placeholder="Search">
            <template #suffix>
              <AButton size="small" type="text" shape="circle" @click.prevent>
                <template #icon>
                  <SearchOutlined style="font-size: 16px"/>
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
        <AFlex :vertical="false" align="center" justify="flex-start" class="header-menu-item">
          <ABadge count="5" :numberStyle="{marginTop: '10px', marginRight: '5px'}">
            <AButton type="text" shape="circle" size="large" class="header-menu-item-btn"
                     :icon="h(BellOutlined)"/>
          </ABadge>
        </AFlex>
        <!--        <AFlex :vertical="false" align="center" justify="flex-start" class="header-menu-item">-->
        <!--          <ADropdown>-->
        <!--            <template #overlay>-->
        <!--              <AMenu @click="changeLang">-->
        <!--                <AMenuItem key="zh">{{ t("landing.chinese") }}</AMenuItem>-->
        <!--                <AMenuItem key="en">{{ t("landing.english") }}</AMenuItem>-->
        <!--              </AMenu>-->
        <!--            </template>-->
        <!--            <AButton type="text" shape="circle" size="large" :icon="h(TranslationOutlined)">-->
        <!--            </AButton>-->
        <!--          </ADropdown>-->
        <!--        </AFlex>-->
        <AFlex :vertical="false" align="center" justify="flex-start" class="header-user-container">
          <AAvatar :size="40" class="header-user-avatar" :src="user.user.avatar"/>
        </AFlex>
      </AFlex>
    </div>
  </header>
</template>
<script lang="ts" setup>
import logo from "@/assets/svgs/logo-album.svg";
import useStore from "@/store";
import {BellOutlined} from "@ant-design/icons-vue";
import {h} from "vue";


const user = useStore().user;
// const lang = useStore().lang;
const router = useRouter();

// /**
//  *  切换语言
//  * @param language
//  */
// async function changeLang(language: any) {
//   lang.lang = language.key;
//   locale.value = language.key;
// }
</script>
<style scoped lang="scss" src="./index.scss">

</style>
