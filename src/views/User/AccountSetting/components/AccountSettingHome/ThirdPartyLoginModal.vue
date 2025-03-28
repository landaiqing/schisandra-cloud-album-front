<template>
  <div>
    <!-- 第三方登录管理模态窗口 -->
    <AModal
      :open="userStore.thirdPartyModalState.visible"
      title="第三方账号管理"
      :width="500"
      :maskClosable="false"
      @cancel="handleCancel"
      :footer="null"
    >
      <div class="third-party-container">
        <div class="third-party-item">
          <div class="third-party-icon">
            <img src="@/assets/svgs/icon-wechat.svg" alt="微信" />
          </div>
          <div class="third-party-info">
            <div class="third-party-name">微信</div>
            <div class="third-party-status">
              <ATag :color="thirdPartyStatus.wechat ? 'success' : 'default'">
                {{ thirdPartyStatus.wechat ? '已绑定' : '未绑定' }}
              </ATag>
            </div>
          </div>
          <div class="third-party-action">
            <AButton
              type="primary"
              size="small"
              :disabled="thirdPartyStatus.wechat"
              @click="handleBindThirdParty('wechat')"
            >
              {{ thirdPartyStatus.wechat ? '已绑定' : '绑定' }}
            </AButton>
            <AButton
              v-if="thirdPartyStatus.wechat"
              type="link"
              danger
              size="small"
              @click="handleUnbindThirdParty('wechat')"
            >
              解绑
            </AButton>
          </div>
        </div>

        <div class="third-party-item">
          <div class="third-party-icon">
            <img src="@/assets/svgs/icon-qq.svg" alt="QQ" />
          </div>
          <div class="third-party-info">
            <div class="third-party-name">QQ</div>
            <div class="third-party-status">
              <ATag :color="thirdPartyStatus.qq ? 'success' : 'default'">
                {{ thirdPartyStatus.qq ? '已绑定' : '未绑定' }}
              </ATag>
            </div>
          </div>
          <div class="third-party-action">
            <AButton
              type="primary"
              size="small"
              :disabled="thirdPartyStatus.qq"
              @click="handleBindThirdParty('qq')"
            >
              {{ thirdPartyStatus.qq ? '已绑定' : '绑定' }}
            </AButton>
            <AButton
              v-if="thirdPartyStatus.qq"
              type="link"
              danger
              size="small"
              @click="handleUnbindThirdParty('qq')"
            >
              解绑
            </AButton>
          </div>
        </div>

        <div class="third-party-item">
          <div class="third-party-icon">
            <img src="@/assets/svgs/github.svg" alt="GitHub" />
          </div>
          <div class="third-party-info">
            <div class="third-party-name">GitHub</div>
            <div class="third-party-status">
              <ATag :color="thirdPartyStatus.github ? 'success' : 'default'">
                {{ thirdPartyStatus.github ? '已绑定' : '未绑定' }}
              </ATag>
            </div>
          </div>
          <div class="third-party-action">
            <AButton
              type="primary"
              size="small"
              :disabled="thirdPartyStatus.github"
              @click="handleBindThirdParty('github')"
            >
              {{ thirdPartyStatus.github ? '已绑定' : '绑定' }}
            </AButton>
            <AButton
              v-if="thirdPartyStatus.github"
              type="link"
              danger
              size="small"
              @click="handleUnbindThirdParty('github')"
            >
              解绑
            </AButton>
          </div>
        </div>

        <div class="third-party-item">
          <div class="third-party-icon">
            <img src="@/assets/svgs/gitee.svg" alt="Gitee" />
          </div>
          <div class="third-party-info">
            <div class="third-party-name">Gitee</div>
            <div class="third-party-status">
              <ATag :color="thirdPartyStatus.gitee ? 'success' : 'default'">
                {{ thirdPartyStatus.gitee ? '已绑定' : '未绑定' }}
              </ATag>
            </div>
          </div>
          <div class="third-party-action">
            <AButton
              type="primary"
              size="small"
              :disabled="thirdPartyStatus.gitee"
              @click="handleBindThirdParty('gitee')"
            >
              {{ thirdPartyStatus.gitee ? '已绑定' : '绑定' }}
            </AButton>
            <AButton
              v-if="thirdPartyStatus.gitee"
              type="link"
              danger
              size="small"
              @click="handleUnbindThirdParty('gitee')"
            >
              解绑
            </AButton>
          </div>
        </div>
      </div>
    </AModal>

    <!-- 解绑确认模态窗口 -->
    <AModal
      v-model:open="confirmUnbindVisible"
      title="确认解绑"
      :width="400"
      :maskClosable="false"
      @cancel="cancelUnbind"
    >
      <p>确定要解绑 <span style="font-weight: bold;">{{ currentUnbindPlatform }}</span> 账号吗？解绑后将无法使用该账号登录。</p>

      <template #footer>
        <AButton key="back" @click="cancelUnbind">取消</AButton>
        <AButton key="submit" danger :loading="submitLoading" @click="confirmUnbind">确定解绑</AButton>
      </template>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import useStore from "@/store";

const emit = defineEmits(['success']);

// 获取用户store
const userStore = useStore().user;

// 第三方账号绑定状态
const thirdPartyStatus = reactive({
  wechat: false,
  qq: false,
  github: false,
  gitee: false
});

// 解绑确认相关状态
const confirmUnbindVisible = ref(false);
const currentUnbindPlatform = ref('');
const currentUnbindType = ref('');
const submitLoading = ref(false);

// 监听store中的状态变化
watch(() => userStore.thirdPartyModalState.visible, (val) => {
  if (val) {
    // 当模态窗口打开时，获取最新的绑定状态
    updateThirdPartyStatus();
  }
});

// 更新第三方账号绑定状态
const updateThirdPartyStatus = () => {
  // 这里应该从API获取最新状态，暂时使用模拟数据
  // 实际项目中应该调用相应的API获取绑定状态
  thirdPartyStatus.wechat = Math.random() > 0.5;
  thirdPartyStatus.qq = Math.random() > 0.5;
  thirdPartyStatus.github = Math.random() > 0.5;
  thirdPartyStatus.gitee = Math.random() > 0.5;
};

// 取消操作
const handleCancel = () => {
  userStore.closeThirdPartyModal();
};

// 绑定第三方账号
const handleBindThirdParty = (type: string) => {
  // 根据不同的平台类型调用不同的绑定方法
  switch (type) {
    case 'wechat':
      // 调用微信绑定API
      message.info('正在跳转到微信授权页面...');
      break;
    case 'qq':
      // 调用QQ绑定API
      userStore.getQQRedirectUrl();
      userStore.openQQUrl();
      break;
    case 'github':
      // 调用GitHub绑定API
      userStore.getGithubRedirectUrl();
      userStore.openGithubUrl();
      break;
    case 'gitee':
      // 调用Gitee绑定API
      userStore.getGiteeRedirectUrl();
      userStore.openGiteeUrl();
      break;
    default:
      break;
  }
};

// 解绑第三方账号（显示确认窗口）
const handleUnbindThirdParty = (type: string) => {
  currentUnbindType.value = type;

  // 设置平台名称
  switch (type) {
    case 'wechat':
      currentUnbindPlatform.value = '微信';
      break;
    case 'qq':
      currentUnbindPlatform.value = 'QQ';
      break;
    case 'github':
      currentUnbindPlatform.value = 'GitHub';
      break;
    case 'gitee':
      currentUnbindPlatform.value = 'Gitee';
      break;
    default:
      currentUnbindPlatform.value = '';
      break;
  }

  // 显示确认窗口
  confirmUnbindVisible.value = true;
};

// 取消解绑
const cancelUnbind = () => {
  confirmUnbindVisible.value = false;
  currentUnbindType.value = '';
  currentUnbindPlatform.value = '';
};

// 确认解绑
const confirmUnbind = async () => {
  if (!currentUnbindType.value) return;

  try {
    submitLoading.value = true;
    // 这里需要实现解绑第三方账号的API调用，暂时模拟成功
    setTimeout(() => {
      message.success(`${currentUnbindPlatform.value}账号解绑成功`);

      // 更新状态
      switch (currentUnbindType.value) {
        case 'wechat':
          thirdPartyStatus.wechat = false;
          break;
        case 'qq':
          thirdPartyStatus.qq = false;
          break;
        case 'github':
          thirdPartyStatus.github = false;
          break;
        case 'gitee':
          thirdPartyStatus.gitee = false;
          break;
        default:
          break;
      }

      emit('success', `unbind_${currentUnbindType.value}`);
      cancelUnbind();
      submitLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error('解绑第三方账号失败:', error);
    message.error('解绑失败，请稍后重试');
    submitLoading.value = false;
  }
};
</script>

<style scoped>
.third-party-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.third-party-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.third-party-item:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.third-party-icon {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.third-party-icon img {
  width: 28px;
  height: 28px;
}

.third-party-info {
  flex: 1;
  margin-left: 12px;
}

.third-party-name {
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 4px;
}

.third-party-action {
  display: flex;
  gap: 8px;
}
</style>
