<template>
  <div class="role-management">
    <a-card title="角色管理" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="handleAddRole">新增角色</a-button>
      </template>
      <a-table
        :columns="columns"
        :data-source="roleList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'green' : 'red'">
              {{ record.statusText }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleEditRole(record)">编辑</a-button>
              <a-button type="link" @click="handleSetPermissions(record)">权限设置</a-button>
              <a-popconfirm
                title="确定要删除此角色吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDeleteRole(record)"
              >
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 角色表单对话框 -->
    <a-modal
      v-model:visible="roleModalVisible"
      :title="modalTitle"
      :confirm-loading="modalLoading"
      @ok="handleRoleModalOk"
      @cancel="handleRoleModalCancel"
    >
      <a-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="角色名称" name="name">
          <a-input v-model:value="roleForm.name" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item label="角色编码" name="code">
          <a-input v-model:value="roleForm.code" placeholder="请输入角色编码" />
        </a-form-item>
        <a-form-item label="角色描述" name="description">
          <a-textarea v-model:value="roleForm.description" placeholder="请输入角色描述" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="roleForm.status">
            <a-radio value="active">启用</a-radio>
            <a-radio value="inactive">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 权限设置对话框 -->
    <a-modal
      v-model:visible="permissionModalVisible"
      title="权限设置"
      :confirm-loading="permissionModalLoading"
      @ok="handlePermissionModalOk"
      @cancel="handlePermissionModalCancel"
      width="800px"
    >
      <template v-if="currentRole">
        <p>为角色 <strong>{{ currentRole.name }}</strong> 设置权限：</p>
        <a-table
          :columns="permissionColumns"
          :data-source="permissionList"
          :row-selection="{
            selectedRowKeys: selectedPermissions,
            onChange: onPermissionSelectionChange
          }"
          rowKey="id"
          size="small"
        ></a-table>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '角色编码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
];

// 权限表格列定义
const permissionColumns = [
  {
    title: '权限名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '权限编码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
];

// 状态数据
const loading = ref(false);
const roleList = ref<any[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

// 角色表单相关
const roleModalVisible = ref(false);
const modalLoading = ref(false);
const modalTitle = ref('新增角色');
const roleFormRef = ref();
const roleForm = reactive({
  id: null,
  name: '',
  code: '',
  description: '',
  status: 'active',
  permissions: [] as number[],
});

const roleRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

// 权限设置相关
const permissionModalVisible = ref(false);
const permissionModalLoading = ref(false);
const currentRole = ref<any>(null);
const selectedPermissions = ref<number[]>([]);
const permissionList = ref<any[]>([]);

// 获取角色列表
const fetchRoleList = () => {
  loading.value = true;
  // 模拟API调用
  setTimeout(() => {
    // 模拟API响应
    pagination.total = roleList.value.length;
    loading.value = false;
  }, 500);
};

// 新增角色
const handleAddRole = () => {
  modalTitle.value = '新增角色';
  roleForm.id = null;
  roleForm.name = '';
  roleForm.code = '';
  roleForm.description = '';
  roleForm.status = 'active';
  roleForm.permissions = [];
  roleModalVisible.value = true;
};

// 表格变化处理（分页、排序、筛选）
const handleTableChange = (pag: any, _filters: any, _sorter: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchRoleList();
};

// 编辑角色
const handleEditRole = (record: any) => {
  modalTitle.value = '编辑角色';
  roleForm.id = record.id;
  roleForm.name = record.name;
  roleForm.code = record.code;
  roleForm.description = record.description;
  roleForm.status = record.status;
  roleForm.permissions = record.permissions;
  roleModalVisible.value = true;
};

// 删除角色
const handleDeleteRole = (record: any) => {
  message.success(`删除角色：${record.name}`);
  // 实际应用中应该调用删除API
  roleList.value = roleList.value.filter(item => item.id !== record.id);
};

// 设置角色权限
const handleSetPermissions = (record: any) => {
  currentRole.value = record;
  selectedPermissions.value = [...record.permissions];
  permissionModalVisible.value = true;
};

// 权限选择变更
const onPermissionSelectionChange = (selectedRowKeys: number[]) => {
  selectedPermissions.value = selectedRowKeys;
};

// 角色表单提交
const handleRoleModalOk = () => {
  roleFormRef.value.validate().then(() => {
    modalLoading.value = true;
    // 这里应该是实际的API调用
    setTimeout(() => {
      if (roleForm.id) {
        // 编辑现有角色
        const index = roleList.value.findIndex(item => item.id === roleForm.id);
        if (index !== -1) {
          const statusText = roleForm.status === 'active' ? '启用' : '禁用';
          roleList.value[index] = {
            ...roleList.value[index],
            ...roleForm,
            statusText
          };
          message.success('角色编辑成功');
        }
      } else {
        // 新增角色
        const newId = Math.max(...roleList.value.map(item => item.id)) + 1;
        const statusText = roleForm.status === 'active' ? '启用' : '禁用';
        const now = new Date().toLocaleString();
        roleList.value.push({
          id: newId,
          ...roleForm,
          statusText,
          createTime: now,
          permissions: []
        });
        message.success('角色添加成功');
      }
      roleModalVisible.value = false;
      modalLoading.value = false;
    }, 500);
  }).catch(() => {
    // 表单验证失败
  });
};

// 取消角色表单
const handleRoleModalCancel = () => {
  roleModalVisible.value = false;
};

// 权限设置对话框确认
const handlePermissionModalOk = () => {
  permissionModalLoading.value = true;
  // 这里应该是实际的API调用
  setTimeout(() => {
    // 更新角色的权限
    const index = roleList.value.findIndex(item => item.id === currentRole.value.id);
    if (index !== -1) {
      roleList.value[index].permissions = [...selectedPermissions.value];
      message.success(`角色 ${currentRole.value.name} 的权限设置已更新`);
    }
    permissionModalVisible.value = false;
    permissionModalLoading.value = false;
  }, 500);
};

// 取消权限设置
const handlePermissionModalCancel = () => {
  permissionModalVisible.value = false;
};

// 初始化
onMounted(() => {
  fetchRoleList();
});

// 模拟角色数据
roleList.value = [
  {
    id: 1,
    name: '超级管理员',
    code: 'super_admin',
    description: '系统最高权限角色',
    status: 'active',
    statusText: '启用',
    createTime: '2023-01-01 12:00:00',
    permissions: [1, 2, 3, 4, 5]
  },
  {
    id: 2,
    name: '内容管理员',
    code: 'content_admin',
    description: '负责内容审核和管理',
    status: 'active',
    statusText: '启用',
    createTime: '2023-01-15 10:20:00',
    permissions: [2, 3]
  },
  {
    id: 3,
    name: '用户管理员',
    code: 'user_admin',
    description: '负责用户管理',
    status: 'active',
    statusText: '启用',
    createTime: '2023-02-05 09:30:00',
    permissions: [4, 5]
  },
  {
    id: 4,
    name: '只读角色',
    code: 'readonly',
    description: '只有查看权限',
    status: 'inactive',
    statusText: '禁用',
    createTime: '2023-03-10 14:50:00',
    permissions: [1]
  }
];

// 模拟权限数据
permissionList.value = [
  {
    id: 1,
    name: '查看数据',
    code: 'view_data',
    description: '查看系统数据的权限'
  },
  {
    id: 2,
    name: '编辑内容',
    code: 'edit_content',
    description: '编辑系统内容的权限'
  },
  {
    id: 3,
    name: '审核内容',
    code: 'review_content',
    description: '审核系统内容的权限'
  },
  {
    id: 4,
    name: '用户管理',
    code: 'manage_users',
    description: '管理系统用户的权限'
  },
  {
    id: 5,
    name: '系统设置',
    code: 'system_settings',
    description: '修改系统设置的权限'
  }
];
</script>

<style scoped lang="scss">
.role-management {
  .role-header {
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
