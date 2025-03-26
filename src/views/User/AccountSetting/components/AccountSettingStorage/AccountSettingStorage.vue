<template>
  <div class="account-setting-storage">
    <div class="account-setting-storage-header">
      <span>存储管理</span>
      <AButton type="text" size="large" shape="circle" @click="getStorageList">
        <template #icon>
          <RedoOutlined />
        </template>
      </AButton>
    </div>
    <div class="account-setting-storage-body" v-if="storageList && storageList.length>0">
      <div class="storage-cards-container">
        <StorageCard v-for="(item, index) in storageList" :key="index" :storage="item"/>
      </div>
      <div class="storage-action">
        <AButton type="primary" size="large" @click="drawerVisible = true">
          新增存储
        </AButton>
      </div>
    </div>
    <div class="account-setting-storage-empty" v-else>
      <AEmpty description="暂无存储策略"/>
      <AButton type="primary" @click="drawerVisible = true">添加存储</AButton>
    </div>
    <ADrawer v-model:open="drawerVisible" placement="right" width="40%" title="新增存储策略">
      <AForm :model="formState" layout="vertical" @finish="onFinish" :rules="rules" ref="formRef"
             class="two-col-form">
        <AFormItem label="存储商" name="provider" class="form-item">
          <ASelect v-model:value="formState.provider" placeholder="请选择存储商">
            <ASelectOption v-for="provider in providers" :key="provider.value" :value="provider.value">
              {{ provider.label }}
            </ASelectOption>
          </ASelect>
        </AFormItem>

        <AFormItem label="地址" name="endpoint" class="form-item">
          <AInput v-model:value="formState.endpoint" placeholder="请输入地址">
            <template #addonBefore>
              <ASelect v-model:value="protocol" style="width: 90px">
                <ASelectOption value="http://">Http://</ASelectOption>
                <ASelectOption value="https://">Https://</ASelectOption>
              </ASelect>
            </template>
          </AInput>
        </AFormItem>
        <AFormItem label="密钥Key" name="access_key" class="form-item">
          <AInput v-model:value="formState.access_key" placeholder="请输入密钥Key"/>
        </AFormItem>
        <AFormItem label="密钥Secret" name="secret_key" class="form-item">
          <AInputPassword v-model:value="formState.secret_key" placeholder="请输入密钥Secret"/>
        </AFormItem>

        <AFormItem label="存储桶" name="bucket" class="form-item">
          <AInput v-model:value="formState.bucket" placeholder="请输入存储桶名称"/>
        </AFormItem>
        <AFormItem label="地域" name="region" class="form-item">
          <ASelect v-model:value="formState.region" placeholder="请选择地域" :disabled="!formState.provider">
            <ASelectOption
                v-for="region in regionsByProvider[formState.provider] || []"
                :key="region.value"
                :value="region.value"
            >
              {{ region.label }}
            </ASelectOption>
          </ASelect>
        </AFormItem>
        <AFormItem label="容量" name="capacity" class="form-item">
          <AInputNumber style="width: 100%;" v-model:value="formState.capacity" placeholder="请输入容量"/>
        </AFormItem>
      </AForm>
      <template #footer>
        <AFlex :vertical="false" align="center" justify="end" gap="large">
          <AButton type="default" @click="cancel">取消</AButton>
          <AButton type="primary" @click="onFinish()">提交</AButton>
        </AFlex>
      </template>
    </ADrawer>
  </div>
</template>
<script setup lang="ts">

import StorageCard from "@/views/User/AccountSetting/components/AccountSettingStorage/StorageCard.vue";
import {addStorageConfigApi, listUserStorageConfigApi} from "@/api/storage";
import {message} from "ant-design-vue";

const drawerVisible = ref(false);
const protocol = ref('https://');
const rules = {
  provider: [{required: true, message: '存储商不能为空'}],
  bucket: [{required: true, message: '存储桶不能为空'}],
  endpoint: [{required: true, message: '地址不能为空'}],
  access_key: [{required: true, message: '密钥Key不能为空'}],
  secret_key: [{required: true, message: '密钥Secret不能为空'}],
  region: [{required: true, message: '地域不能为空'}],
  capacity: [{required: true, message: '容量不能为空'}],
};
const providers = [
  {value: 'ali', label: '阿里云OSS'},
  {value: 'tencent', label: '腾讯云COS'},
  {value: 'minio', label: 'Minio'},
  {value: 'huawei', label: '华为云OBS'},
];

const regionsByProvider = {
  ali: [
    {value: 'oss-cn-hangzhou', label: '华东1（杭州）'},
    {value: 'oss-cn-shanghai', label: '华东2（上海）'},
    {value: 'oss-cn-qingdao', label: '华北1（青岛）'},
    {value: 'oss-cn-shenzhen', label: '华南1（深圳）'},
  ],
  tencent: [
    {value: 'ap-beijing', label: '北京'},
    {value: 'ap-shanghai', label: '上海'},
    {value: 'ap-guangzhou', label: '广州'},
    {value: 'ap-chengdu', label: '成都'},
  ],
  huawei: [
    {value: 'cn-north-1', label: '华北-北京一'},
    {value: 'cn-east-3', label: '华东-上海一'},
    {value: 'cn-south-1', label: '华南-广州'},
  ],
  minio: [
    {value: 'us-east-1', label: '默认地域'},
    {value: 'custom', label: '自定义地域'},
  ],
};
const formRef = ref();
const formState = ref({
  provider: '',
  bucket: '',
  endpoint: '',
  access_key: '',
  secret_key: '',
  region: '',
  capacity: null,
});

const onFinish = async () => {
  const valid = await formRef.value.validate();
  if (!valid) {
    return;
  }
  const res: any = await addStorageConfigApi(formState.value);
  if (res && res.code === 200) {
    await getStorageList();
    drawerVisible.value = false;
    formRef.value.resetFields();
  } else {
    message.warn("新增存储策略失败");
  }
};

function cancel() {
  formRef.value.resetFields();
  drawerVisible.value = false;
};
const storageList = ref<any[]>([]);

// 获取存储列表
async function getStorageList() {
  const res: any = await listUserStorageConfigApi();
  if (res && res.code === 200) {
    storageList.value = res.data.records;
  }
}

onMounted(() => {
  getStorageList();
});
</script>
<style scoped lang="scss">
.account-setting-storage {
  width: 100%;

  .account-setting-storage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 16px 20px;
    background-color: var(--white-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    span {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
      position: relative;
      padding-left: 12px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 18px;
        background: #1890ff;
        border-radius: 2px;
      }
    }

    .ant-btn {
      border-radius: 8px;
      height: 40px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }

  .account-setting-storage-body {
    background-color: var(--white-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    padding: 24px;

    .storage-cards-container {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      margin-bottom: 30px;
    }

    .storage-action {
      display: flex;
      justify-content: center;
      margin-top: 30px;

      .ant-btn {
        height: 48px;
        padding: 0 40px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 24px;
        background: linear-gradient(135deg, #1890ff, #096dd9);
        border: none;
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(24, 144, 255, 0.4);
        }
      }
    }
  }

  .account-setting-storage-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    background-color: var(--white-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .ant-btn {
      margin-top: 20px;
      height: 40px;
      border-radius: 20px;
      padding: 0 24px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
      }
    }
  }
}

.two-col-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  .form-item {
    margin-bottom: 16px;
  }
}
</style>
