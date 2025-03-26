<template>
  <div class="permission-list-container">
    <div class="permission-list-header">
      <h2>权限列表</h2>
      <div class="permission-list-header-right">
        <AButton type="primary" @click="handleAddPermission">
          <template #icon>
            <PlusOutlined/>
          </template>
          新增权限
        </AButton>
      </div>
    </div>

    <ACard>
      <div class="table-search-wrapper">
        <AForm layout="inline" :model="searchForm">
          <AFormItem label="权限名称">
            <AInput v-model:value="searchForm.name" placeholder="请输入权限名称" allowClear/>
          </AFormItem>
          <AFormItem label="权限代码">
            <AInput v-model:value="searchForm.code" placeholder="请输入权限代码" allowClear/>
          </AFormItem>
          <AFormItem label="状态">
            <ASelect v-model:value="searchForm.status" placeholder="请选择状态" style="width: 120px" allowClear>
              <ASelectOption value="active">启用</ASelectOption>
              <ASelectOption value="inactive">禁用</ASelectOption>
            </ASelect>
          </AFormItem>
          <AFormItem>
            <AButton type="primary" @click="handleSearch">
              <template #icon>
                <SearchOutlined/>
              </template>
              搜索
            </AButton>
            <AButton style="margin-left: 8px" @click="resetSearch">
              <template #icon>
                <ReloadOutlined/>
              </template>
              重置
            </AButton>
          </AFormItem>
        </AForm>
      </div>

      <ATable
          :columns="columns"
          :data-source="permissionList"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <ATag :color="record.status === 'active' ? 'green' : 'red'">
              {{ record.statusText }}
            </ATag>
          </template>
          <template v-else-if="column.key === 'action'">
            <ASpace>
              <AButton type="link" size="small" @click="handleEditPermission(record)">编辑</AButton>
              <APopconfirm
                  title="确定要删除此权限吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDeletePermission(record)"
              >
                <AButton type="link" danger size="small">删除</AButton>
              </APopconfirm>
            </ASpace>
          </template>
        </template>
      </ATable>
    </ACard>

    <!-- 权限编辑对话框 -->
    <AModal
        v-model:visible="permissionModalVisible"
        :title="modalTitle"
        @ok="handlePermissionModalOk"
        @cancel="handlePermissionModalCancel"
        :confirmLoading="modalLoading"
    >
      <AForm :model="permissionForm" :rules="permissionFormRules" ref="permissionFormRef" :label-col="{ span: 6 }"
             :wrapper-col="{ span: 16 }">
        <AFormItem label="权限名称" name="name">
          <AInput v-model:value="permissionForm.name" placeholder="请输入权限名称"/>
        </AFormItem>
        <AFormItem label="权限代码" name="code">
          <AInput v-model:value="permissionForm.code" placeholder="请输入权限代码"/>
        </AFormItem>
        <AFormItem label="权限描述" name="description">
          <ATextarea v-model:value="permissionForm.description" placeholder="请输入权限描述" :rows="4"/>
        </AFormItem>
        <AFormItem label="状态" name="status">
          <ASelect v-model:value="permissionForm.status" placeholder="请选择状态">
            <ASelectOption value="active">启用</ASelectOption>
            <ASelectOption value="inactive">禁用</ASelectOption>
          </ASelect>
        </AFormItem>
      </AForm>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue';
import {message} from 'ant-design-vue';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue';

// 搜索表单
const searchForm = reactive({
  name: '',
  code: '',
  status: undefined
});

// 表格加载状态
const loading = ref(false);

// 表格分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`
});

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: '权限名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '权限代码',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '权限描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'statusText',
    key: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true
  },
  {
    title: '操作',
    key: 'action',
    width: 150
  }
];

// 模拟权限数据
const permissionList = ref<any[]>([
  {
    id: 1,
    name: '用户管理',
    code: 'user:manage',
    description: '用户的增删改查权限',
    status: 'active',
    statusText: '启用',
    createTime: '2023-01-01 12:00:00'
  },
  {
    id: 2,
    name: '角色管理',
    code: 'role:manage',
    description: '角色的增删改查权限',
    status: 'active',
    statusText: '启用',
    createTime: '2023-01-05 10:20:00'
  },
  {
    id: 3,
    name: '权限管理',
    code: 'permission:manage',
    description: '权限的增删改查权限',
    status: 'active',
    statusText: '启用',
    createTime: '2023-02-15 09:30:00'
  },
  {
    id: 4,
    name: '系统设置',
    code: 'system:setting',
    description: '系统参数设置权限',
    status: 'inactive',
    statusText: '禁用',
    createTime: '2023-03-20 14:50:00'
  }
]);

// 权限表单相关
const permissionModalVisible = ref(false);
const modalTitle = ref('新增权限');
const modalLoading = ref(false);
const permissionFormRef = ref();
const permissionForm = reactive({
  id: undefined,
  name: '',
  code: '',
  description: '',
  status: 'active'
});

// 表单验证规则
const permissionFormRules = {
  name: [
    {required: true, message: '请输入权限名称', trigger: 'blur'},
    {min: 2, max: 50, message: '权限名称长度应为2-50个字符', trigger: 'blur'}
  ],
  code: [
    {required: true, message: '请输入权限代码', trigger: 'blur'},
    {pattern: /^[a-z]+:[a-z]+$/, message: '权限代码格式应为xxx:xxx', trigger: 'blur'}
  ],
  description: [
    {max: 200, message: '描述最多200个字符', trigger: 'blur'}
  ],
  status: [
    {required: true, message: '请选择状态', trigger: 'change'}
  ]
};

// 搜索处理
const handleSearch = () => {
  pagination.current = 1;
  fetchPermissionList();
};

// 重置搜索
const resetSearch = () => {
  searchForm.name = '';
  searchForm.code = '';
  searchForm.status = undefined;
  handleSearch();
};

// 表格变化处理（分页、排序、筛选）
const handleTableChange = (pag: any, _filters: any, _sorter: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchPermissionList();
};

// 获取权限列表数据
const fetchPermissionList = () => {
  loading.value = true;
  // 这里应该是实际的API调用
  setTimeout(() => {
    // 模拟API响应
    pagination.total = permissionList.value.length;
    loading.value = false;
  }, 500);
};

// 新增权限
const handleAddPermission = () => {
  modalTitle.value = '新增权限';
  permissionForm.id = undefined;
  permissionForm.name = '';
  permissionForm.code = '';
  permissionForm.description = '';
  permissionForm.status = 'active';
  permissionModalVisible.value = true;
};

// 编辑权限
const handleEditPermission = (record: any) => {
  modalTitle.value = '编辑权限';
  permissionForm.id = record.id;
  permissionForm.name = record.name;
  permissionForm.code = record.code;
  permissionForm.description = record.description;
  permissionForm.status = record.status;
  permissionModalVisible.value = true;
};

// 删除权限
const handleDeletePermission = (record: any) => {
  message.success(`删除权限：${record.name}`);
  // 实际应用中应该调用删除API
  permissionList.value = permissionList.value.filter(item => item.id !== record.id);
};

// 权限表单提交
const handlePermissionModalOk = () => {
  permissionFormRef.value.validate().then(() => {
    modalLoading.value = true;
    // 这里应该是实际的API调用
    setTimeout(() => {
      if (permissionForm.id) {
        // 编辑现有权限
        const index = permissionList.value.findIndex(item => item.id === permissionForm.id);
        if (index !== -1) {
          const statusText = permissionForm.status === 'active' ? '启用' : '禁用';
          permissionList.value[index] = {
            ...permissionList.value[index],
            ...permissionForm,
            statusText
          };
          message.success('权限编辑成功');
        }
      } else {
        // 新增权限
        const newId: any = Math.max(...permissionList.value.map(item => item.id)) + 1;
        const statusText = permissionForm.status === 'active' ? '启用' : '禁用';
        const now = new Date().toLocaleString();
        permissionList.value.push({
          newId,
          ...permissionForm,
          statusText,
          createTime: now
        });
        message.success('权限添加成功');
      }
      permissionModalVisible.value = false;
      modalLoading.value = false;
    }, 500);
  }).catch(() => {
    // 表单验证失败
  });
};

// 取消权限表单
const handlePermissionModalCancel = () => {
  permissionModalVisible.value = false;
};

// 初始化
onMounted(() => {
  fetchPermissionList();
});
</script>

<style scoped lang="scss">
.permission-list-container {
  .permission-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .table-search-wrapper {
    margin-bottom: 16px;
  }
}
</style>
