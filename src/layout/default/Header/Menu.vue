<template>
  <AFlex :vertical="false" align="center" justify="flex-end" class="header-menu-container">
    <AFlex :vertical="false" align="center" justify="flex-start" class="header-menu-item" gap="large">
      <!--   存储选择    -->
      <div class="button-wrapper">
        <APopover :arrow="false" trigger="click" placement="right">
          <template #content>
            <ACascader v-model:value="uploadStore.storageSelected"
                       :options="configList"
                       :bordered="false"
                       style="width: 100%"
                       :field-names="{ label: 'name', value: 'value', children: 'children' }"
                       placeholder="选择存储桶">
            </ACascader>
          </template>
          <ABadge dot
                  color="green"
                  :offset="[-9, 12]">
            <ATooltip title="选择存储桶" color="orange">
              <AButton type="text" shape="circle" size="large" class="header-menu-item-btn"
                       :class="{'breathing': !uploadStore.storageSelected?.length}">
                <template #icon>
                  <AAvatar size="default" shape="circle"
                           :src="ProviderIcon[uploadStore.storageSelected?.[0]] ? ProviderIcon[uploadStore.storageSelected?.[0]] : wenhao"/>
                </template>
              </AButton>
            </ATooltip>
            <template #count>
              <ExclamationCircleOutlined style="color: red" v-if="!uploadStore.storageSelected?.length"/>
            </template>
          </ABadge>

        </APopover>
      </div>

      <div class="button-wrapper">
        <ATooltip title="图床" color="#f56c6c">
          <AButton type="text" shape="circle" size="large" class="header-menu-item-btn"
                   @click="router.push('/main/photo/image-bed')">
            <template #icon>
              <AAvatar size="default" shape="circle" :src="imgBed"/>
            </template>
          </AButton>
        </ATooltip>
      </div>

      <!--  工具箱按钮 -->
      <div class="button-wrapper">
        <ATooltip title="工具箱" color="cyan">
          <APopover placement="bottom" trigger="click">
            <template #content>
              <div class="tool-box-content">
                <ACard hoverable class="tool-box-card" @click="router.push('/preview/blur-detect')">
                  <AFlex :vertical="false" align="center" justify="flex-start" gap="small">
                    <AAvatar size="large" shape="square" :src="blur"/>
                    <span class="tool-box-card-title">模糊检测</span>
                  </AFlex>
                </ACard>
                <ACard hoverable class="tool-box-card" @click="router.push('/preview/ocr')">
                  <AFlex :vertical="false" align="center" justify="flex-start" gap="small">
                    <AAvatar size="large" shape="square" :src="scanIcon"/>
                    <span class="tool-box-card-title">OCR文字识别</span>
                  </AFlex>
                </ACard>
                <ACard hoverable class="tool-box-card" @click="router.push('/preview/qrcode')">
                  <AFlex :vertical="false" align="center" justify="flex-start" gap="small">
                    <AAvatar size="large" shape="square" :src="qr"/>
                    <span class="tool-box-card-title">二维码识别</span>
                  </AFlex>
                </ACard>
              </div>
            </template>
            <AButton type="text" shape="circle" size="large" class="header-menu-item-btn">
              <template #icon>
                <AAvatar size="default" shape="circle" :src="toolBox"/>
              </template>
            </AButton>
          </APopover>
        </ATooltip>
      </div>
      <!--  上传按钮 -->

      <div class="button-wrapper">
        <ATooltip title="隐私空间" color="geekblue">
          <AButton type="text" shape="circle" size="large" class="header-menu-item-btn"
                   @click="router.push('/main/photo/privacy/space')">
            <template #icon>
              <AAvatar size="default" shape="circle" :src="privacy"/>
            </template>
          </AButton>
        </ATooltip>
      </div>

      <div class="button-wrapper">
        <ATooltip title="上传" color="cyan">
          <AButton type="text" shape="circle" size="large" class="header-menu-item-btn"
                   @click="uploadStore.openUploadDrawerFn">
            <template #icon>
              <AAvatar size="default" shape="circle" :src="upload"/>
            </template>
          </AButton>
        </ATooltip>
      </div>

      <!--  通知按钮 -->
      <ABadge :dot="true" :numberStyle="{
            marginTop: '10px',
            marginRight: '5px',
            backgroundColor: 'rgba(77,167,255,0.89)',
          }">
        <div class="button-wrapper">
          <ADropdown :trigger="['click']">
            <ATooltip title="通知" color="lime">
              <AButton type="text" shape="circle" size="large" class="header-menu-item-btn bouncing-button">
                <template #icon>
                  <AAvatar size="small" shape="circle" :src="notice"/>
                </template>
              </AButton>
            </ATooltip>
            <template #overlay>
              <AMenu>
                <AMenuItem key="reply" :style="menuCSSStyle">
                  <template #icon>
                    <AAvatar size="small" shape="circle" :src="atme"/>
                  </template>
                  <span style="font-weight: bold">回复我的</span>
                </AMenuItem>
                <AMenuItem key="like" :style="menuCSSStyle">
                  <template #icon>
                    <AAvatar size="small" shape="circle" :src="like"/>
                  </template>
                  <span style="font-weight: bold">收到的赞</span>
                </AMenuItem>
                <AMenuItem key="message" :style="menuCSSStyle">
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
          <ATooltip :title="user.user.nickname" color="#108ee9">
            <AAvatar :size="40" class="header-user-avatar" :src="user.user.avatar"/>
          </ATooltip>
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
                  <AMenuItem key="1" @click="router.push('/main/user/center/home')" :style="menuCSSStyle">
                    <template #icon>
                      <AAvatar size="small" shape="circle" :src="personalCenter"/>
                    </template>
                    <span class="avatar-content-menu-item">个人中心</span>
                  </AMenuItem>
                  <AMenuItem key="2" @click="router.push('/main/user/setting')" :style="menuCSSStyle">
                    <template #icon>
                      <AAvatar size="small" shape="circle" :src="accountSetting"/>
                    </template>
                    <span class="avatar-content-menu-item">账号设置</span>
                  </AMenuItem>
                  <AMenuItem key="3" :style="menuCSSStyle">
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
    <ImageUpload/>
  </AFlex>
</template>
<script setup lang="ts">

import upload from "@/assets/svgs/upload.svg";
import notice from "@/assets/svgs/notice.svg";
import atme from "@/assets/svgs/atme.svg";
import like from "@/assets/svgs/like.svg";
import systemMessage from "@/assets/svgs/sys-msg.svg";
import personalCenter from "@/assets/svgs/personal-center.svg";
import accountSetting from "@/assets/svgs/setting.svg";
import logout from "@/assets/svgs/logout.svg";
import wenhao from "@/assets/svgs/wenhao.svg";
import privacy from "@/assets/svgs/privacy.svg";
import useStore from "@/store";
import ImageUpload from "@/components/ImageUpload/ImageUpload.vue";
import {getStorageConfigListApi} from "@/api/storage";
import {ProviderIcon} from "@/constant/provider_map.ts";
import toolBox from "@/assets/svgs/tool-box.svg";
import blur from "@/assets/svgs/blur.svg";
import scanIcon from "@/assets/svgs/scan.svg";
import qr from "@/assets/svgs/qr.svg";
import imgBed from "@/assets/svgs/img_bed.svg";

const router = useRouter();


const uploadStore = useStore().upload;
const user = useStore().user;

const configList = ref<any[]>([]);

async function getUserConfigList() {
  const res: any = await getStorageConfigListApi();
  if (res && res.code === 200) {
    configList.value = res.data.records;
  }
}

const menuCSSStyle: any = reactive({
  display: 'flex',
  alignItems: 'center',
});


onMounted(() => {
  getUserConfigList();
});

</script>


<style scoped lang="scss">
.header-menu-container {
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-menu-item {
    width: 85%;
    display: flex;
    justify-content: flex-end;

    .header-select-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      //gap: 20px;
    }

    .header-menu-item-btn {
      display: block;
    }

    .button-wrapper {
      position: relative;
      display: inline-block;
      border-radius: 50%;
      overflow: hidden;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
      border: 1px solid rgb(255, 255, 255);
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
      border: 1px solid rgb(255, 255, 255);
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

    //.card-avatar:hover {
    //  box-shadow: 0 0 10px rgba(77, 167, 255, 0.89);
    //  transform: scale(1.1);
    //}

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

.tool-box-content {
  width: 220px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;

  .tool-box-card {
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;
    overflow: hidden;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .tool-box-card-title {
      font-size: 14px;
      font-weight: bolder;
      margin-left: 5px;
    }
  }
}
.breathing {
  animation: breathing 2s ease-in-out infinite;
}

@keyframes breathing {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

</style>
