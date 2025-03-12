<template>
  <div class="storage-management">
    <a-card title="存储管理" :bordered="false">
      <!-- 搜索和操作按钮区域 -->
      <div class="table-operations">
        <a-space>
          <a-input-search
              v-model:value="searchKeyword"
              placeholder="搜索用户ID或存储桶名称"
              style="width: 250px"
              @search="handleSearch"
          />
          <a-button type="primary" @click="showAddModal">
            <template #icon>
              <plus-outlined/>
            </template>
            添加存储配置
          </a-button>
          <a-button @click="refreshTable">
            <template #icon>
              <reload-outlined/>
            </template>
            刷新
          </a-button>
        </a-space>
      </div>

      <!-- 存储配置表格 -->
      <a-table
          :columns="columns"
          :data-source="tableData"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          row-key="id"
      >
        <!-- 供应商列 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'provider'">
            <a-tag :color="getProviderColor(record.provider)">
              {{ getProviderName(record.provider) }}
            </a-tag>
          </template>

          <!-- 容量列 -->
          <template v-if="column.key === 'capacity'">
            {{ record.capacity }} GB
          </template>

          <!-- 密钥列 -->
          <template v-if="column.key === 'access_key' || column.key === 'secret_key'">
            <a-button type="link" @click="showVerifyModal(record, column.key)">
              <eye-outlined/>
              查看
            </a-button>
          </template>

          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="primary" size="small" @click="handleEdit(record)">
                <template #icon>
                  <edit-outlined/>
                </template>
                编辑
              </a-button>
              <a-popconfirm
                  title="确定要删除此存储配置吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDelete(record)"
              >
                <a-button type="primary" danger size="small">
                  <template #icon>
                    <delete-outlined/>
                  </template>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加/编辑存储配置的对话框 -->
    <a-modal
        v-model:visible="modalVisible"
        :title="modalTitle"
        @ok="handleModalOk"
        @cancel="handleModalCancel"
        :confirm-loading="modalLoading"
    >
      <a-form
          :model="formState"
          :rules="rules"
          ref="formRef"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="用户ID" name="user_id">
          <a-input v-model:value="formState.user_id" placeholder="请输入用户ID"/>
        </a-form-item>

        <a-form-item label="存储商" name="provider">
          <a-select v-model:value="formState.provider" placeholder="请选择存储商">
            <a-select-option v-for="provider in providers" :key="provider.value" :value="provider.value">
              {{ provider.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="地址" name="endpoint">
          <a-input v-model:value="formState.endpoint" placeholder="请输入地址">
            <template #addonBefore>
              <a-select v-model:value="protocol" style="width: 90px">
                <a-select-option value="http://">Http://</a-select-option>
                <a-select-option value="https://">Https://</a-select-option>
              </a-select>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="密钥Key" name="access_key">
          <a-input v-model:value="formState.access_key" placeholder="请输入密钥Key"/>
        </a-form-item>

        <a-form-item label="密钥Secret" name="secret_key">
          <a-input-password v-model:value="formState.secret_key" placeholder="请输入密钥Secret"/>
        </a-form-item>

        <a-form-item label="存储桶" name="bucket">
          <a-input v-model:value="formState.bucket" placeholder="请输入存储桶名称"/>
        </a-form-item>

        <a-form-item label="地域" name="region">
          <a-select v-model:value="formState.region" placeholder="请选择地域" :disabled="!formState.provider">
            <a-select-option
                v-for="region in regionsByProvider[formState.provider] || []"
                :key="region.value"
                :value="region.value"
            >
              {{ region.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="容量(GB)" name="capacity">
          <a-input-number style="width: 100%" v-model:value="formState.capacity" placeholder="请输入容量"/>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 验证身份查看敏感信息的对话框 -->
    <a-modal
        v-model:visible="verifyModalVisible"
        title="身份验证"
        @ok="handleVerifyOk"
        @cancel="() => verifyModalVisible = false"
        :confirm-loading="verifyLoading"
    >
      <a-tabs v-model:activeKey="verifyType">
        <a-tab-pane key="phone" tab="手机验证">
          <a-form layout="vertical">
            <a-form-item label="手机号码">
              <a-input v-model:value="verifyPhone" placeholder="请输入管理员手机号码"/>
            </a-form-item>
            <a-form-item label="验证码">
              <a-input-search
                  v-model:value="verifyCode"
                  placeholder="请输入验证码"
                  :loading="sendingCode"
                  @search="sendVerifyCode"
                  enter-button="获取验证码"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="email" tab="邮箱验证">
          <a-form layout="vertical">
            <a-form-item label="邮箱地址">
              <a-input v-model:value="verifyEmail" placeholder="请输入管理员邮箱地址"/>
            </a-form-item>
            <a-form-item label="验证码">
              <a-input-search
                  v-model:value="verifyCode"
                  placeholder="请输入验证码"
                  :loading="sendingCode"
                  @search="sendVerifyCode"
                  enter-button="获取验证码"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <!-- 显示敏感信息的对话框 -->
    <a-modal
        v-model:visible="sensitiveInfoVisible"
        title="敏感信息"
        @ok="() => sensitiveInfoVisible = false"
        :footer="null"
    >
      <a-result status="success" :title="`${sensitiveInfoType === 'access_key' ? '密钥Key' : '密钥Secret'}`">
        <template #extra>
          <a-typography>
            <a-typography-paragraph copyable>
              {{ sensitiveInfoValue }}
            </a-typography-paragraph>
          </a-typography>
          <a-button type="primary" @click="() => sensitiveInfoVisible = false">关闭</a-button>
        </template>
      </a-result>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue';
import {message} from 'ant-design-vue';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons-vue';
import {ProviderColorMap, ProviderNameMap} from '@/constant/provider_map.ts';

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '用户ID',
    dataIndex: 'user_id',
    key: 'user_id',
    width: 120,
  },
  {
    title: '供应商',
    dataIndex: 'provider',
    key: 'provider',
    width: 120,
  },
  {
    title: '存储桶',
    dataIndex: 'bucket',
    key: 'bucket',
    width: 150,
  },
  {
    title: '地址',
    dataIndex: 'endpoint',
    key: 'endpoint',
    width: 200,
    ellipsis: true,
  },
  {
    title: '地域',
    dataIndex: 'region',
    key: 'region',
    width: 150,
  },
  {
    title: '容量',
    dataIndex: 'capacity',
    key: 'capacity',
    width: 100,
  },
  {
    title: '密钥Key',
    dataIndex: 'access_key',
    key: 'access_key',
    width: 120,
  },
  {
    title: '密钥Secret',
    dataIndex: 'secret_key',
    key: 'secret_key',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 180,
  },
];

// 存储供应商列表
const providers = [
  {value: 'ali', label: '阿里云OSS'},
  {value: 'tencent', label: '腾讯云COS'},
  {value: 'minio', label: 'Minio'},
  {value: 'huawei', label: '华为云OBS'},
];

// 各供应商的地域列表
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

// 表格数据和加载状态
const tableData = ref<any[]>([]);
const loading = ref(false);
const searchKeyword = ref('');

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
});

// 表单相关
const formRef = ref();
const protocol = ref('https://');
const modalVisible = ref(false);
const modalLoading = ref(false);
const modalTitle = ref('添加存储配置');
const isEdit = ref(false);
const currentRecord = ref(null);

// 表单状态和验证规则
const formState = reactive({
  user_id: '',
  provider: '',
  endpoint: '',
  access_key: '',
  secret_key: '',
  bucket: '',
  region: '',
  capacity: null,
});

const rules = {
  user_id: [{required: true, message: '用户ID不能为空'}],
  provider: [{required: true, message: '存储商不能为空'}],
  bucket: [{required: true, message: '存储桶不能为空'}],
  endpoint: [{required: true, message: '地址不能为空'}],
  access_key: [{required: true, message: '密钥Key不能为空'}],
  secret_key: [{required: true, message: '密钥Secret不能为空'}],
  region: [{required: true, message: '地域不能为空'}],
  capacity: [{required: true, message: '容量不能为空'}],
};

// 验证相关
const verifyModalVisible = ref(false);
const verifyLoading = ref(false);
const sendingCode = ref(false);
const verifyType = ref('phone');
const verifyPhone = ref('');
const verifyEmail = ref('');
const verifyCode = ref('');
const sensitiveInfoVisible = ref(false);
const sensitiveInfoType = ref('');
const sensitiveInfoValue = ref('');
const verifyingRecord = ref<any>(null);

// 获取供应商名称和颜色
const getProviderName = (provider: string) => {
  return ProviderNameMap[provider] || provider;
};

const getProviderColor = (provider: string) => {
  return ProviderColorMap[provider] || 'blue';
};

// 加载存储配置列表
const fetchStorageList = async () => {
  loading.value = true;
  try {
    // 使用模拟数据替代API调用
    // const res: any = await listUserStorageConfigApi();

    // 模拟API响应数据
    const mockData = {
      code: 200,
      data: {
        records: [
          {
            id: 1,
            user_id: '10001',
            provider: 'ali',
            bucket: 'user-photos-10001',
            endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
            region: 'oss-cn-hangzhou',
            capacity: 100,
            access_key: 'LTAI4G2KxxxxxxxxxxxxxxxJZC',
            secret_key: 'PkT4FxxxxxxxxxxxxxxxxxxxxxxRLh',
            created_at: '2023-05-15 10:23:45'
          },
          {
            id: 2,
            user_id: '10002',
            provider: 'tencent',
            bucket: 'cloud-album-10002',
            endpoint: 'https://cos.ap-shanghai.myqcloud.com',
            region: 'ap-shanghai',
            capacity: 200,
            access_key: 'AKIDQq7xxxxxxxxxxxxxxxx1Ic',
            secret_key: 'VtBcXxxxxxxxxxxxxxxxxxxxxxxxQ',
            created_at: '2023-06-20 14:35:12'
          },
          {
            id: 3,
            user_id: '10003',
            provider: 'huawei',
            bucket: 'photos-storage-10003',
            endpoint: 'https://obs.cn-north-1.myhuaweicloud.com',
            region: 'cn-north-1',
            capacity: 150,
            access_key: 'HWOBTJ1xxxxxxxxxxxxxxxxxxxx',
            secret_key: 'WpC9Dxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            created_at: '2023-07-05 09:12:30'
          },
          {
            id: 4,
            user_id: '10001',
            provider: 'minio',
            bucket: 'private-photos-10001',
            endpoint: 'http://minio.example.com:9000',
            region: 'us-east-1',
            capacity: 50,
            access_key: 'minioadmin',
            secret_key: 'minioadmin123',
            created_at: '2023-08-10 16:45:22'
          },
          {
            id: 5,
            user_id: '10004',
            provider: 'ali',
            bucket: 'backup-photos-10004',
            endpoint: 'https://oss-cn-shenzhen.aliyuncs.com',
            region: 'oss-cn-shenzhen',
            capacity: 300,
            access_key: 'LTAI4G3Bxxxxxxxxxxxxxxxc',
            secret_key: 'ZpR7Fxxxxxxxxxxxxxxxxxxxxxxx',
            created_at: '2023-09-01 11:30:15'
          },
          {
            id: 6,
            user_id: '10005',
            provider: 'tencent',
            bucket: 'album-storage-10005',
            endpoint: 'https://cos.ap-guangzhou.myqcloud.com',
            region: 'ap-guangzhou',
            capacity: 250,
            access_key: 'AKIDZq8xxxxxxxxxxxxxxxx2Jd',
            secret_key: 'BtDcYxxxxxxxxxxxxxxxxxxxxxxxR',
            created_at: '2023-09-15 13:20:40'
          },
          {
            id: 7,
            user_id: '10002',
            provider: 'huawei',
            bucket: 'album-backup-10002',
            endpoint: 'https://obs.cn-east-3.myhuaweicloud.com',
            region: 'cn-east-3',
            capacity: 120,
            access_key: 'HWOBTJ2xxxxxxxxxxxxxxxxxxxx',
            secret_key: 'KpL8Dxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            created_at: '2023-10-05 15:40:18'
          },
          {
            id: 8,
            user_id: '10006',
            provider: 'minio',
            bucket: 'test-photos-10006',
            endpoint: 'http://localhost:9000',
            region: 'custom',
            capacity: 80,
            access_key: 'testadmin',
            secret_key: 'testpassword',
            created_at: '2023-11-20 08:55:33'
          }
        ],
        total: 8
      }
    };

    const res = mockData;

    if (res && res.code === 200) {
      // 如果有搜索关键词，进行过滤
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        tableData.value = res.data.records.filter(item =>
            item.user_id.toLowerCase().includes(keyword) ||
            item.bucket.toLowerCase().includes(keyword)
        );
        pagination.total = tableData.value.length;
      } else {
        tableData.value = res.data.records || [];
        pagination.total = res.data.total || 0;
      }
    } else {
      message.error('获取存储配置列表失败');
    }
  } catch (error) {
    console.error('获取存储配置列表出错:', error);
    message.error('获取存储配置列表出错');
  } finally {
    loading.value = false;
  }
};

// 表格变化处理
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchStorageList();
};

// 搜索处理
const handleSearch = () => {
  pagination.current = 1;
  fetchStorageList();
};

// 刷新表格
const refreshTable = () => {
  searchKeyword.value = '';
  pagination.current = 1;
  fetchStorageList();
};

// 显示添加模态框
const showAddModal = () => {
  isEdit.value = false;
  modalTitle.value = '添加存储配置';
  resetForm();
  modalVisible.value = true;
};

// 编辑处理
const handleEdit = (record: any) => {
  isEdit.value = true;
  currentRecord.value = {...record};
  modalTitle.value = '编辑存储配置';

  // 填充表单数据
  Object.keys(formState).forEach(key => {
    if (key in record) {
      formState[key] = record[key];
    }
  });

  // 处理协议前缀
  if (formState.endpoint && formState.endpoint.startsWith('http://')) {
    protocol.value = 'http://';
    formState.endpoint = formState.endpoint.substring(7);
  } else if (formState.endpoint && formState.endpoint.startsWith('https://')) {
    protocol.value = 'https://';
    formState.endpoint = formState.endpoint.substring(8);
  }

  modalVisible.value = true;
};

// 删除处理
const handleDelete = async (record: any) => {
  loading.value = true;
  try {
    // 使用模拟数据替代API调用
    // const res: any = await deleteStorageConfigApi(record.id, record.provider, record.bucket);

    // 模拟API响应
    const res = {
      code: 200,
      message: '删除成功',
      data: null
    };

    if (res && res.code === 200) {
      message.success('删除成功');
      // 模拟删除操作，从tableData中移除该记录
      tableData.value = tableData.value.filter((item: any) => item.id !== record.id);
      pagination.total -= 1;
    } else {
      message.error('删除失败');
    }
  } catch (error) {
    console.error('删除存储配置出错:', error);
    message.error('删除存储配置出错');
  } finally {
    loading.value = false;
  }
};

// 模态框确认
const handleModalOk = () => {
  formRef.value.validate().then(async () => {
    modalLoading.value = true;

    // 处理endpoint，添加协议前缀
    const formData = {...formState};
    formData.endpoint = protocol.value + formData.endpoint;

    try {
      // 使用模拟数据替代API调用
      // const res: any = await addStorageConfigApi(formData);

      // 模拟API响应
      const res = {
        code: 200,
        message: '操作成功',
        data: null
      };

      if (res && res.code === 200) {
        message.success(isEdit.value ? '编辑成功' : '添加成功');
        modalVisible.value = false;
        resetForm();
        fetchStorageList();
      } else {
        message.error(isEdit.value ? '编辑失败' : '添加失败');
      }
    } catch (error) {
      console.error(isEdit.value ? '编辑存储配置出错:' : '添加存储配置出错:', error);
      message.error(isEdit.value ? '编辑存储配置出错' : '添加存储配置出错');
    } finally {
      modalLoading.value = false;
    }
  });
};

// 模态框取消
const handleModalCancel = () => {
  modalVisible.value = false;
  resetForm();
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
  protocol.value = 'https://';
};

// 显示验证模态框
const showVerifyModal = (record: any, type: string) => {
  verifyingRecord.value = record;
  sensitiveInfoType.value = type;
  verifyModalVisible.value = true;
  verifyType.value = 'phone';
  verifyPhone.value = '';
  verifyEmail.value = '';
  verifyCode.value = '';
};

// 发送验证码
const sendVerifyCode = () => {
  if (verifyType.value === 'phone' && !verifyPhone.value) {
    message.error('请输入手机号码');
    return;
  }
  if (verifyType.value === 'email' && !verifyEmail.value) {
    message.error('请输入邮箱地址');
    return;
  }

  sendingCode.value = true;

  // 模拟发送验证码
  setTimeout(() => {
    sendingCode.value = false;
    message.success('验证码已发送');
  }, 1000);
};

// 验证确认
const handleVerifyOk = () => {
  if (!verifyCode.value) {
    message.error('请输入验证码');
    return;
  }

  verifyLoading.value = true;

  // 模拟验证过程
  setTimeout(() => {
    verifyLoading.value = false;
    verifyModalVisible.value = false;

    // 显示敏感信息
    sensitiveInfoValue.value = verifyingRecord.value[sensitiveInfoType.value];
    sensitiveInfoVisible.value = true;
  }, 1000);
};

// 初始化
onMounted(() => {
  fetchStorageList();
});
</script>

<style scoped lang="scss">
.storage-management {
  .table-operations {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
  }

  .ant-table {
    margin-top: 8px;
  }

  .ant-tag {
    margin-right: 0;
  }
}
</style>
