<template>
  <div class="user-list-container">
    <div class="user-list-header">
      <h2>用户列表</h2>
      <div class="user-list-header-right">
        <AButton type="primary" @click="handleAddUser">
          <template #icon>
            <PlusOutlined/>
          </template>
          新增用户
        </AButton>
      </div>
    </div>

    <ACard>
      <div class="table-search-wrapper">
        <AForm layout="inline" :model="searchForm">
          <AFormItem label="用户名">
            <AInput v-model:value="searchForm.username" placeholder="请输入用户名" allowClear/>
          </AFormItem>
          <AFormItem label="手机号">
            <AInput v-model:value="searchForm.phone" placeholder="请输入手机号" allowClear/>
          </AFormItem>
          <AFormItem label="状态">
            <ASelect v-model:value="searchForm.status" placeholder="请选择状态" style="width: 120px" allowClear>
              <ASelectOption value="active">正常</ASelectOption>
              <ASelectOption value="inactive">禁用</ASelectOption>
              <ASelectOption value="pending">待审核</ASelectOption>
            </ASelect>
          </AFormItem>
          <AFormItem label="角色">
            <ASelect v-model:value="searchForm.role" placeholder="请选择角色" style="width: 120px" allowClear>
              <ASelectOption value="admin">管理员</ASelectOption>
              <ASelectOption value="user">普通用户</ASelectOption>
              <ASelectOption value="vip">VIP用户</ASelectOption>
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
          :data-source="userList"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <ATag :color="record.status === 'active' ? 'green' : (record.status === 'inactive' ? 'red' : 'orange')">
              {{ record.statusText }}
            </ATag>
          </template>
          <template v-else-if="column.key === 'action'">
            <ASpace>
              <AButton type="link" size="small" @click="handleEditUser(record)">编辑</AButton>
              <AButton type="link" size="small" @click="handleViewUser(record)">查看</AButton>
              <APopconfirm
                  title="确定要删除此用户吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDeleteUser(record)"
              >
                <AButton type="link" danger size="small">删除</AButton>
              </APopconfirm>
            </ASpace>
          </template>
        </template>
      </ATable>
    </ACard>

    <!-- 用户编辑对话框 -->
    <AModal
        v-model:visible="userModalVisible"
        :title="modalTitle"
        @ok="handleUserModalOk"
        @cancel="handleUserModalCancel"
        :confirmLoading="modalLoading"
    >
      <AForm :model="userForm" :rules="userFormRules" ref="userFormRef" :label-col="{ span: 6 }"
             :wrapper-col="{ span: 16 }">
        <AFormItem label="用户名" name="username">
          <AInput v-model:value="userForm.username" placeholder="请输入用户名"/>
        </AFormItem>
        <AFormItem label="手机号" name="phone">
          <AInput v-model:value="userForm.phone" placeholder="请输入手机号"/>
        </AFormItem>
        <AFormItem label="邮箱" name="email">
          <AInput v-model:value="userForm.email" placeholder="请输入邮箱"/>
        </AFormItem>
        <AFormItem label="角色" name="role">
          <ASelect v-model:value="userForm.role" placeholder="请选择角色">
            <ASelectOption value="admin">管理员</ASelectOption>
            <ASelectOption value="user">普通用户</ASelectOption>
            <ASelectOption value="vip">VIP用户</ASelectOption>
          </ASelect>
        </AFormItem>
        <AFormItem label="状态" name="status">
          <ASelect v-model:value="userForm.status" placeholder="请选择状态">
            <ASelectOption value="active">正常</ASelectOption>
            <ASelectOption value="inactive">禁用</ASelectOption>
            <ASelectOption value="pending">待审核</ASelectOption>
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
  username: '',
  phone: '',
  status: undefined,
  role: undefined
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
    title: '用户名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '角色',
    dataIndex: 'roleText',
    key: 'role'
  },
  {
    title: '状态',
    dataIndex: 'statusText',
    key: 'status'
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true
  },
  {
    title: '最后登录',
    dataIndex: 'lastLoginTime',
    key: 'lastLoginTime',
    sorter: true
  },
  {
    title: '操作',
    key: 'action',
    width: 200
  }
];

// 模拟用户数据
const userList = ref<any[]>([
  {
    id: 1,
    username: 'admin',
    phone: '13800138000',
    email: 'admin@example.com',
    role: 'admin',
    roleText: '管理员',
    status: 'active',
    statusText: '正常',
    createTime: '2023-01-01 12:00:00',
    lastLoginTime: '2023-05-20 08:30:00'
  },
  {
    id: 2,
    username: 'zhangsan',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    role: 'user',
    roleText: '普通用户',
    status: 'active',
    statusText: '正常',
    createTime: '2023-01-05 10:20:00',
    lastLoginTime: '2023-05-19 15:40:00'
  },
  {
    id: 3,
    username: 'lisi',
    phone: '13800138002',
    email: 'lisi@example.com',
    role: 'vip',
    roleText: 'VIP用户',
    status: 'inactive',
    statusText: '禁用',
    createTime: '2023-02-15 09:30:00',
    lastLoginTime: '2023-04-10 11:20:00'
  },
  {
    id: 4,
    username: 'wangwu',
    phone: '13800138003',
    email: 'wangwu@example.com',
    role: 'user',
    roleText: '普通用户',
    status: 'pending',
    statusText: '待审核',
    createTime: '2023-03-20 14:50:00',
    lastLoginTime: '2023-03-20 14:50:00'
  }
]);

// 用户表单相关
const userModalVisible = ref(false);
const modalTitle = ref('新增用户');
const modalLoading = ref(false);
const userFormRef = ref();
const userForm = reactive({
  id: undefined,
  username: '',
  phone: '',
  email: '',
  role: 'user',
  status: 'active'
});

// 表单验证规则
const userFormRules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur'}
  ],
  phone: [
    {required: true, message: '请输入手机号', trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
  ],
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur'}
  ],
  role: [
    {required: true, message: '请选择角色', trigger: 'change'}
  ],
  status: [
    {required: true, message: '请选择状态', trigger: 'change'}
  ]
};

// 搜索处理
const handleSearch = () => {
  pagination.current = 1;
  fetchUserList();
};

// 重置搜索
const resetSearch = () => {
  searchForm.username = '';
  searchForm.phone = '';
  searchForm.status = undefined;
  searchForm.role = undefined;
  handleSearch();
};

// 表格变化处理（分页、排序、筛选）
const handleTableChange = (pag: any, _filters: any, _sorter: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchUserList();
};

// 获取用户列表数据
const fetchUserList = () => {
  loading.value = true;
  // 这里应该是实际的API调用
  setTimeout(() => {
    // 模拟API响应
    pagination.total = userList.value.length;
    loading.value = false;
  }, 500);
};

// 新增用户
const handleAddUser = () => {
  modalTitle.value = '新增用户';
  userForm.id = undefined;
  userForm.username = '';
  userForm.phone = '';
  userForm.email = '';
  userForm.role = 'user';
  userForm.status = 'active';
  userModalVisible.value = true;
};

// 编辑用户
const handleEditUser = (record: any) => {
  modalTitle.value = '编辑用户';
  userForm.id = record.id;
  userForm.username = record.username;
  userForm.phone = record.phone;
  userForm.email = record.email;
  userForm.role = record.role;
  userForm.status = record.status;
  userModalVisible.value = true;
};

// 查看用户详情
const handleViewUser = (record: any) => {
  message.info(`查看用户：${record.username}`);
  // 这里可以跳转到用户详情页或打开详情对话框
};

// 删除用户
const handleDeleteUser = (record: any) => {
  message.success(`删除用户：${record.username}`);
  // 实际应用中应该调用删除API
  userList.value = userList.value.filter(item => item.id !== record.id);
};

// 用户表单提交
const handleUserModalOk = () => {
  userFormRef.value.validate().then(() => {
    modalLoading.value = true;
    // 这里应该是实际的API调用
    setTimeout(() => {
      if (userForm.id) {
        // 编辑现有用户
        const index = userList.value.findIndex(item => item.id === userForm.id);
        if (index !== -1) {
          const roleText = userForm.role === 'admin' ? '管理员' : (userForm.role === 'vip' ? 'VIP用户' : '普通用户');
          const statusText = userForm.status === 'active' ? '正常' : (userForm.status === 'inactive' ? '禁用' : '待审核');
          userList.value[index] = {
            ...userList.value[index],
            ...userForm,
            roleText,
            statusText
          };
          message.success('用户编辑成功');
        }
      } else {
        // 新增用户
        const id: any = Math.max(...userList.value.map(item => item.id)) + 1;
        const roleText = userForm.role === 'admin' ? '管理员' : (userForm.role === 'vip' ? 'VIP用户' : '普通用户');
        const statusText = userForm.status === 'active' ? '正常' : (userForm.status === 'inactive' ? '禁用' : '待审核');
        const now = new Date().toLocaleString();
        userForm.id = id;
        userList.value.push({
          ...userForm,
          roleText,
          statusText,
          createTime: now,
          lastLoginTime: now
        });
        message.success('用户添加成功');
      }
      userModalVisible.value = false;
      modalLoading.value = false;
    }, 500);
  }).catch(() => {
    // 表单验证失败
  });
};

// 取消用户表单
const handleUserModalCancel = () => {
  userModalVisible.value = false;
};

// 初始化
onMounted(() => {
  fetchUserList();
});
</script>

<style scoped lang="scss">
.user-list-container {
  .user-list-header {
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
