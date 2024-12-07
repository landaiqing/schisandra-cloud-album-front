<template>
  <AFlex :vertical="false" align="center" justify="flex-end" class="header-menu-container">
    <AFlex :vertical="false" align="center" justify="flex-start" class="header-menu-item" gap="large">
      <!--  社区按钮 -->
      <div class="button-wrapper">
        <AButton type="text" shape="circle" size="large" class="header-menu-item-btn">
          <template #icon>
            <AAvatar size="default" shape="circle" :src="community"/>
          </template>
        </AButton>
      </div>
      <!--  上传按钮 -->
      <div class="button-wrapper">
        <AButton type="text" shape="circle" size="large" class="header-menu-item-btn">
          <template #icon>
            <AAvatar size="default" shape="circle" :src="upload"/>
          </template>
        </AButton>
      </div>

      <!--  通知按钮 -->
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
                    <AAvatar size="small" shape="circle" :src="atme"/>
                  </template>
                  <span style="font-weight: bold">回复我的</span>
                </AMenuItem>
                <AMenuItem key="like">
                  <template #icon>
                    <AAvatar size="small" shape="circle" :src="like"/>
                  </template>
                  <span style="font-weight: bold">收到的赞</span>
                </AMenuItem>
                <AMenuItem key="message">
                  <template #icon>
                    <AAvatar size="small" shape="circle" :src="systemMessage"/>
                  </template>
                  <span style="font-weight: bold">系统消息</span>
                </AMenuItem>
              </AMenu>
            </template>
          </ADropdown>
        </div>
      </ABadge>
    </AFlex>
    <!--    头像 -->
    <AFlex :vertical="false" align="center" justify="flex-start" class="header-user-container">
      <APopover :arrow="false" trigger="click" placement="bottomRight">
        <div class="avatar-wrapper">
          <AAvatar :size="40" class="header-user-avatar" :src="user.user.avatar"/>
        </div>
        <template #content>
          <div class="avatar-content">
            <AFlex :vertical="true" align="flex-start" justify="center">
              <AFlex class="avatar-content-header" :vertical="false" align="center" justify="space-between">
                <AAvatar :size="70" class="card-avatar" :src="user.user.avatar"/>
                <AFlex class="avatar-content-header-info" :vertical="true" align="flex-start" justify="flex-start">
                  <span class="avatar-name">{{ user.user.nickname }}</span>
                  <AProgress :show-info="false" :percent="30"/>
                  <AFlex class="avatar-content-header-level" :vertical="false" align="center" justify="space-between">
                    <img src="/level_icon/icon/lv1.png" class="avatar-level-icon" alt="level">
                    <img src="/level_icon/icon/lv2.png" class="avatar-level-icon" alt="level">
                  </AFlex>
                </AFlex>
              </AFlex>
              <AFlex class="avatar-content-body" :vertical="false" align="center" justify="space-around">
                <ACard :hoverable="true" class="avatar-content-body-card">

                </ACard>
                <ACard :hoverable="true" class="avatar-content-body-card">

                </ACard>
                <ACard :hoverable="true" class="avatar-content-body-card">

                </ACard>
              </AFlex>
              <ADivider/>
              <div class="avatar-content-menu">
                <AMenu>
                  <AMenuItem key="1">
                    <template #icon>
                      <AAvatar size="small" shape="circle" :src="personalCenter"/>
                    </template>
                    <span class="avatar-content-menu-item">个人中心</span>
                  </AMenuItem>
                  <AMenuItem key="2">
                    <template #icon>
                      <AAvatar size="small" shape="circle" :src="accountSetting"/>
                    </template>
                    <span class="avatar-content-menu-item">账号设置</span>
                  </AMenuItem>
                  <AMenuItem key="3">
                    <template #icon>
                      <AAvatar size="small" shape="circle" :src="logout"/>
                    </template>
                    <span class="avatar-content-menu-logout">退出登录</span>
                  </AMenuItem>
                </AMenu>
              </div>
            </AFlex>
          </div>
        </template>
      </APopover>
    </AFlex>
  </AFlex>
</template>
<script setup lang="ts">

import community from "@/assets/svgs/community.svg";
import upload from "@/assets/svgs/upload.svg";
import notice from "@/assets/svgs/notice.svg";
import atme from "@/assets/svgs/atme.svg";
import like from "@/assets/svgs/like.svg";
import systemMessage from "@/assets/svgs/sys-msg.svg";
import personalCenter from "@/assets/svgs/personal-center.svg";
import accountSetting from "@/assets/svgs/setting.svg";
import logout from "@/assets/svgs/logout.svg";
import useStore from "@/store";

const user = useStore().user;
</script>


<style scoped lang="scss">
.header-menu-container {
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-menu-item {
    width: 85%;
    display: flex;
    justify-content: flex-end;

    .header-menu-item-btn {
      display: block;
    }

    .button-wrapper {
      position: relative;
      display: inline-block;
      border-radius: 50%;
      overflow: hidden;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }

    .button-wrapper:hover {
      transform: scale(1.1);
      //border: 2px solid #707072;
    }

    @keyframes bounce {
      0% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(-10deg);
      }
      /* 向左倾斜 */
      50% {
        transform: rotate(10deg);
      }
      /* 向右倾斜 */
      75% {
        transform: rotate(-10deg);
      }
      /* 向左倾斜 */
      100% {
        transform: rotate(0deg);
      }
    }

    .bouncing-button:hover {
      animation: bounce 0.5s ease infinite; /* 鼠标悬浮时左右摇摆 */
    }

  }

  .header-user-container {
    .header-user-avatar {
      display: block;
      cursor: pointer;
    }

    .avatar-wrapper {
      display: inline-block;
      border-radius: 50%;
      overflow: hidden;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }

    .avatar-wrapper:hover {
      box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
      transform: scale(1.1);
    }
  }
}

.avatar-content {
  width: 250px;
  height: 350px;

  .avatar-content-header {
    width: 100%;

    .card-avatar {
      width: 30%;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(112, 112, 114, 0.82);
    }

    .card-avatar:hover {
      box-shadow: 0 0 10px rgba(77, 167, 255, 0.89);
      transform: scale(1.1);
    }

    .avatar-content-header-info {
      width: 68%;

      .avatar-name {
        font-size: 14px;
        font-weight: bold;
      }

      .avatar-content-header-level {
        width: 100%;

        .avatar-level-icon {
          width: 30px;
        }
      }
    }
  }

  .avatar-content-body {
    width: 100%;
    margin-top: 20px;

    .avatar-content-body-card {
      width: 70px;
      height: 60px;
      background: #EEEEF6;
    }

  }

  .avatar-content-menu {
    width: 100%;

    .avatar-content-menu-item {
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      margin-left: 10px;
    }

    .avatar-content-menu-logout {
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      margin-left: 10px;
      color: rgba(248, 35, 35, 0.62);
    }
  }

}


</style>
