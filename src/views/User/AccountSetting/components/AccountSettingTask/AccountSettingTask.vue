<template>
  <div class="account-setting-task">
    <div class="account-setting-task-header">
      <span>定时任务</span>
      <AButton type="primary" @click="showAddTaskModal">
        <template #icon>
          <PlusOutlined/>
        </template>
        新增任务
      </AButton>
    </div>
    <div class="account-setting-task-body">
      <!-- 任务列表 -->
      <AEmpty v-if="taskList.length === 0" description="暂无定时任务"/>
      <div v-else class="task-list">
        <div v-for="(task, index) in taskList" :key="index" class="task-card" :class="getTaskTypeClass(task.type)">
          <div class="task-card-header">
            <div class="task-card-title">
              <AAvatar shape="square" size="small" :src="getTaskIcon(task.type)" class="task-icon"/>
              <span>{{ getTaskTypeName(task.type) }}</span>
              <ATag :color="getTaskTypeColor(task.type)" class="task-type-tag">{{ getTaskTypeShortName(task.type) }}</ATag>
            </div>
            <div class="task-card-actions">
              <AButton type="text" size="small" @click="editTask(index)" class="action-btn edit-btn">
                <template #icon>
                  <EditOutlined/>
                </template>
                编辑
              </AButton>
              <AButton type="text" size="small" @click="deleteTask(index)" class="action-btn delete-btn">
                <template #icon>
                  <DeleteOutlined/>
                </template>
                删除
              </AButton>
              <ASwitch v-model:checked="task.enabled" @change="(checked) => toggleTaskStatus(index, checked)" class="task-switch"/>
            </div>
          </div>
          <div class="task-card-content" :class="{ 'disabled': !task.enabled }">
            <div class="task-info">
              <div class="task-info-group">
                <div class="task-info-item">
                  <span class="label">执行频率：</span>
                  <span class="value">
                    <ATag :color="getFrequencyColor(task.frequency)" class="info-tag">{{ getFrequencyText(task.frequency) }}</ATag>
                  </span>
                </div>
                <div class="task-info-item">
                  <span class="label">执行时间：</span>
                  <span class="value">
                    <ATag color="blue" class="info-tag time-tag">{{ formatTime(task.time) }}</ATag>
                  </span>
                </div>
              </div>

              <!-- 备份任务特有信息 -->
              <template v-if="task.type === 'backup'">
                <div class="task-info-group backup-info">
                  <div class="group-title">备份配置</div>
                  <div class="task-info-item">
                    <span class="label">备份存储：</span>
                    <span class="value">
                      <AFlex align="center" gap="small" class="storage-info">
                        <AAvatar v-if="getStorageById(task.storageId)" :size="20" shape="circle"
                                :src="ProviderIcon[getStorageById(task.storageId)?.provider]"/>
                        <span>{{
                            getStorageById(task.storageId) ? `${ProviderNameMap[getStorageById(task.storageId)?.provider]} - ${getStorageById(task.storageId)?.bucket}` : '未设置'
                          }}</span>
                      </AFlex>
                    </span>
                  </div>
                  <div class="task-info-item">
                    <span class="label">备份内容：</span>
                    <span class="value content-tags">
                      <template v-if="task.content && task.content.length">
                        <ATag v-for="item in task.content" :key="item" color="cyan" class="content-tag">{{ getContentItemName(item) }}</ATag>
                      </template>
                      <template v-else>无</template>
                    </span>
                  </div>
                </div>
              </template>

              <!-- 清理任务特有信息 -->
              <template v-if="task.type === 'cleanup'">
                <div class="task-info-group cleanup-info">
                  <div class="group-title">清理配置</div>
                  <div class="task-info-item">
                    <span class="label">清理策略：</span>
                    <span class="value">
                      <ATag :color="getCleanupStrategyColor(task.strategy)" class="info-tag">{{ getCleanupStrategyText(task.strategy) }}</ATag>
                    </span>
                  </div>
                  <div v-if="task.strategy !== 'duplicates'" class="task-info-item">
                    <span class="label">未使用阈值：</span>
                    <span class="value">
                      <ATag color="orange" class="info-tag">{{ task.unusedThreshold }}天</ATag>
                    </span>
                  </div>
                </div>
              </template>

              <!-- 回收站任务特有信息 -->
              <template v-if="task.type === 'recycle'">
                <div class="task-info-group recycle-info">
                  <div class="group-title">回收站配置</div>
                  <div class="task-info-item">
                    <span class="label">保留策略：</span>
                    <span class="value">
                      <ATag :color="getRetentionPolicyColor(task.retentionPolicy)" class="info-tag">{{ getRetentionPolicyText(task.retentionPolicy) }}</ATag>
                    </span>
                  </div>
                  <div v-if="task.retentionPolicy === 'time'" class="task-info-item">
                    <span class="label">保留时间：</span>
                    <span class="value">
                      <ATag color="purple" class="info-tag">{{ task.retentionDays }}天</ATag>
                    </span>
                  </div>
                  <div class="task-info-item">
                    <span class="label">清空前通知：</span>
                    <span class="value">
                      <ATag :color="task.notifyBeforeEmpty ? 'success' : 'default'" class="info-tag">{{ task.notifyBeforeEmpty ? '是' : '否' }}</ATag>
                    </span>
                  </div>
                </div>
              </template>
            </div>
            <div class="task-status">
              <ATag :color="task.enabled ? 'success' : 'default'" class="status-tag">
                <template #icon>
                  <span class="status-dot" :class="{'active': task.enabled}"></span>
                </template>
                {{ task.enabled ? '已启用' : '已禁用' }}
              </ATag>
              <div class="task-last-run" v-if="task.lastRun">
                <ATag color="#87878a" bordered class="last-run-tag">
                  <template #icon>
                    <ClockCircleOutlined />
                  </template>
                  {{ formatDate(task.lastRun) }}
                </ATag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加任务模态框 -->
    <AModal
        v-model:open="addTaskModalVisible"
        :title="isEditing ? '编辑任务' : '新增任务'"
        @ok="handleAddTaskOk"
        @cancel="handleAddTaskCancel"
        :okText="isEditing ? '保存' : '添加'"
        cancelText="取消"
        :width="650"
        class="task-modal"
        :maskClosable="false"
        :destroyOnClose="true"
    >
      <!-- 第一步：选择任务类型 -->
      <div v-if="!selectedTaskType && !isEditing" class="task-type-selection">
        <p class="selection-tip">请选择要创建的任务类型：</p>
        <div class="task-type-options">
          <CheckCard
              class="task-type-card"
              value="backup"
              v-model="tempSelectedType"
              selectionMode="single"
              iconPosition="top-right"
              borderRadius="16px"
              :showHoverCircle="true"
              :iconSize="28"
          >
            <div class="task-type-content">
              <AAvatar shape="square" :size="40" :src="backupIcon"/>
              <span>定时备份</span>
              <p>定期备份您的照片和相册数据</p>
            </div>
          </CheckCard>
          <CheckCard
              class="task-type-card"
              value="cleanup"
              v-model="tempSelectedType"
              selectionMode="single"
              iconPosition="top-right"
              borderRadius="16px"
              margin="12px"
              :showHoverCircle="true"
              :iconSize="28"
          >
            <div class="task-type-content">
              <AAvatar shape="square" :size="40" :src="cleanupIcon"/>
              <span>定时清理</span>
              <p>定期清理重复或未使用的文件</p>
            </div>
          </CheckCard>
          <CheckCard
              class="task-type-card"
              value="recycle"
              v-model="tempSelectedType"
              selectionMode="single"
              iconPosition="top-right"
              borderRadius="16px"
              :showHoverCircle="true"
              :iconSize="28"
          >
            <div class="task-type-content">
              <AAvatar shape="square" :size="40" :src="recycleIcon"/>
              <span>回收站管理</span>
              <p>定期清空回收站中的文件</p>
            </div>
          </CheckCard>
        </div>
        <div class="task-type-actions">
          <AButton type="primary" :disabled="!tempSelectedType" @click="confirmTaskType">下一步</AButton>
        </div>
      </div>

      <!-- 第二步：填写任务详情 -->
      <div v-else>
        <!-- 备份任务表单 -->
        <AForm v-if="selectedTaskType === 'backup'" layout="vertical">
          <AFormItem label="备份频率" name="backupFrequency">
            <ASelect
                v-model:value="currentTask.frequency"
                placeholder="请选择备份频率"
            >
              <ASelectOption value="daily">每天</ASelectOption>
              <ASelectOption value="weekly">每周</ASelectOption>
              <ASelectOption value="monthly">每月</ASelectOption>
            </ASelect>
          </AFormItem>

          <AFormItem label="备份时间" name="backupTime">
            <ATimePicker
                v-model:value="currentTask.time"
                format="HH:mm"
                placeholder="请选择备份时间"
                style="width: 100%"
            />
          </AFormItem>

          <AFormItem label="备份存储" name="backupStorage">
            <ASelect
                v-model:value="currentTask.storageId"
                placeholder="请选择备份存储"
            >
              <ASelectOption
                  v-for="item in storageList"
                  :key="item.id"
                  :value="item.id"
              >
                <AFlex align="center" gap="small">
                  <AAvatar :size="20" shape="circle" :src="ProviderIcon[item.provider]"/>
                  <span>{{ ProviderNameMap[item.provider] }} - {{ item.bucket }}</span>
                </AFlex>
              </ASelectOption>
            </ASelect>
          </AFormItem>

          <AFormItem label="备份内容" name="backupContent">
            <ACheckboxGroup
                v-model:value="currentTask.content"
            >
              <ACheckbox value="photos">照片</ACheckbox>
              <ACheckbox value="albums">相册</ACheckbox>
              <ACheckbox value="settings">设置</ACheckbox>
            </ACheckboxGroup>
          </AFormItem>
        </AForm>

        <!-- 清理任务表单 -->
        <AForm v-if="selectedTaskType === 'cleanup'" layout="vertical">
          <AFormItem label="清理频率" name="cleanupFrequency">
            <ASelect
                v-model:value="currentTask.frequency"
                placeholder="请选择清理频率"
            >
              <ASelectOption value="daily">每天</ASelectOption>
              <ASelectOption value="weekly">每周</ASelectOption>
              <ASelectOption value="monthly">每月</ASelectOption>
            </ASelect>
          </AFormItem>

          <AFormItem label="清理时间" name="cleanupTime">
            <ATimePicker
                v-model:value="currentTask.time"
                format="HH:mm"
                placeholder="请选择清理时间"
                style="width: 100%"
            />
          </AFormItem>

          <AFormItem label="清理策略" name="cleanupStrategy">
            <ARadioGroup
                v-model:value="currentTask.strategy"
            >
              <ARadio value="duplicates">仅清理重复文件</ARadio>
              <ARadio value="unused">清理长期未使用文件</ARadio>
              <ARadio value="both">两者都清理</ARadio>
            </ARadioGroup>
          </AFormItem>

          <AFormItem
              label="未使用时间阈值(天)"
              name="unusedThreshold"
              v-if="currentTask.strategy !== 'duplicates'"
          >
            <AInputNumber
                v-model:value="currentTask.unusedThreshold"
                :min="1"
                :max="365"
                style="width: 100%"
            />
          </AFormItem>
        </AForm>

        <!-- 回收站管理表单 -->
        <AForm v-if="selectedTaskType === 'recycle'" layout="vertical">
          <AFormItem label="自动清空频率" name="recycleFrequency">
            <ASelect
                v-model:value="currentTask.frequency"
                placeholder="请选择清空频率"
            >
              <ASelectOption value="weekly">每周</ASelectOption>
              <ASelectOption value="biweekly">每两周</ASelectOption>
              <ASelectOption value="monthly">每月</ASelectOption>
            </ASelect>
          </AFormItem>

          <AFormItem label="执行时间" name="recycleTime">
            <ATimePicker
                v-model:value="currentTask.time"
                format="HH:mm"
                placeholder="请选择执行时间"
                style="width: 100%"
            />
          </AFormItem>

          <AFormItem label="保留策略" name="retentionPolicy">
            <ARadioGroup
                v-model:value="currentTask.retentionPolicy"
            >
              <ARadio value="all">清空所有文件</ARadio>
              <ARadio value="time">按时间清空</ARadio>
            </ARadioGroup>
          </AFormItem>

          <AFormItem
              label="保留时间(天)"
              name="retentionDays"
              v-if="currentTask.retentionPolicy === 'time'"
          >
            <AInputNumber
                v-model:value="currentTask.retentionDays"
                :min="1"
                :max="90"
                style="width: 100%"
            />
          </AFormItem>

          <AFormItem label="清空前通知" name="notifyBeforeEmpty">
            <ASwitch
                v-model:checked="currentTask.notifyBeforeEmpty"
            />
          </AFormItem>
        </AForm>
      </div>
    </AModal>

    <!-- 删除确认对话框 -->
    <AModal
        v-model:open="deleteConfirmVisible"
        title="确认删除"
        @ok="confirmDelete"
        @cancel="cancelDelete"
        okText="删除"
        cancelText="取消"
        :okButtonProps="{ danger: true, size: 'middle' }"
        class="delete-confirm-modal"
        :maskClosable="false"
        :closable="true"
    >
      <template #icon>
        <ExclamationCircleOutlined style="color: #ff4d4f; font-size: 22px;" />
      </template>
      <div class="delete-confirm-content">
        <p>确定要删除这个定时任务吗？</p>
        <p class="warning-text">此操作不可恢复，请谨慎操作。</p>
      </div>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import {message} from 'ant-design-vue';
import {PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined, ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {listUserStorageConfigApi} from "@/api/storage";
import backupIcon from "@/assets/svgs/source-storage.svg";
import cleanupIcon from "@/assets/svgs/cleanup.svg";
import recycleIcon from "@/assets/svgs/recycle.svg";
import {ProviderIcon, ProviderNameMap} from "@/constant/provider_map";
import dayjs from 'dayjs';
import CheckCard from '@/components/CheckCard/CheckCard.vue';

// 存储列表
const storageList = ref<any[]>([]);

// 任务列表
const taskList = ref<any[]>([]);

// 模态框相关
const addTaskModalVisible = ref(false);
const selectedTaskType = ref<any>();
const tempSelectedType = ref([]);
const isEditing = ref(false);
const editingIndex = ref(-1);

// 删除确认
const deleteConfirmVisible = ref(false);
const deletingIndex = ref(-1);

// 当前编辑的任务
const currentTask = reactive<any>({
  type: '',
  enabled: true,
  frequency: '',
  time: null,
  // 备份任务特有
  storageId: '',
  content: [],
  // 清理任务特有
  strategy: 'duplicates',
  unusedThreshold: 30,
  // 回收站任务特有
  retentionPolicy: 'time',
  retentionDays: 30,
  notifyBeforeEmpty: true,
});

// 获取存储列表
const getStorageList = async () => {
  try {
    const res: any = await listUserStorageConfigApi();
    if (res.code === 200) {
      storageList.value = res.data.records;
    }
  } catch (error) {
    console.error('获取存储列表失败', error);
    message.error('获取存储列表失败');
  }
};

// 获取任务列表
const getTaskList = async () => {
  try {
    // 这里应该调用获取任务列表的API
    // 模拟数据
    taskList.value = [
      {
        type: 'backup',
        enabled: true,
        frequency: 'daily',
        time: dayjs('2023-01-01 03:00:00'),
        storageId: '1',
        content: ['photos', 'albums'],
        lastRun: '2023-05-15 03:00:00'
      },
      {
        type: 'cleanup',
        enabled: false,
        frequency: 'weekly',
        time: dayjs('2023-01-01 04:00:00'),
        strategy: 'both',
        unusedThreshold: 60,
        lastRun: '2023-05-10 04:00:00'
      }
    ];
    message.success('获取任务列表成功');
  } catch (error) {
    console.error('获取任务列表失败', error);
    message.error('获取任务列表失败');
  }
};

// 刷新任务列表
const refreshTasks = () => {
  getTaskList();
  getStorageList();
};

// 显示添加任务模态框
const showAddTaskModal = () => {
  isEditing.value = false;
  selectedTaskType.value = '';
  tempSelectedType.value = [];
  resetCurrentTask();
  addTaskModalVisible.value = true;
};

// 确认任务类型
const confirmTaskType = () => {
  selectedTaskType.value = tempSelectedType.value[0];
  currentTask.type = tempSelectedType.value;

  // 设置默认值
  if (selectedTaskType.value === 'backup') {
    currentTask.frequency = 'daily';
    currentTask.content = ['photos'];
  } else if (selectedTaskType.value === 'cleanup') {
    currentTask.frequency = 'weekly';
    currentTask.strategy = 'duplicates';
  } else if (selectedTaskType.value === 'recycle') {
    currentTask.frequency = 'monthly';
    currentTask.retentionPolicy = 'time';
  }
};

// 重置当前任务
const resetCurrentTask = () => {
  Object.assign(currentTask, {
    type: '',
    enabled: true,
    frequency: '',
    time: null,
    storageId: '',
    content: [],
    strategy: 'duplicates',
    unusedThreshold: 30,
    retentionPolicy: 'time',
    retentionDays: 30,
    notifyBeforeEmpty: true,
  });
};

// 处理添加任务确认
const handleAddTaskOk = () => {
  // 验证表单
  if (!currentTask.time) {
    message.warning('请选择执行时间');
    return;
  }

  if (currentTask.type === 'backup') {
    if (!currentTask.storageId) {
      message.warning('请选择备份存储');
      return;
    }
    if (currentTask.content.length === 0) {
      message.warning('请选择备份内容');
      return;
    }
  }

  // 如果是编辑模式
  if (isEditing.value) {
    taskList.value[editingIndex.value] = {...currentTask};
    message.success('任务更新成功');
  } else {
    // 添加新任务
    taskList.value.push({...currentTask});
    message.success('任务添加成功');
  }

  // 关闭模态框
  addTaskModalVisible.value = false;
};

// 处理添加任务取消
const handleAddTaskCancel = () => {
  addTaskModalVisible.value = false;
};

// 编辑任务
const editTask = (index: number) => {
  try {
    isEditing.value = true;
    editingIndex.value = index;
    const task = taskList.value[index];
    selectedTaskType.value = task.type;

    // 重置当前任务对象
    resetCurrentTask();

    // 复制基本属性
    Object.keys(task).forEach(key => {
      if (key === 'time' && task[key]) {
        // 确保时间字段正确处理
        currentTask.time = dayjs(task[key]);
      } else {
        currentTask[key] = task[key];
      }
    });

    // 打开模态框
    addTaskModalVisible.value = true;
  } catch (error) {
    console.error('编辑任务出错', error);
    message.error('编辑任务出错');
  }
};

// 删除任务
const deleteTask = (index: number) => {
  try {
    deletingIndex.value = index;
    deleteConfirmVisible.value = true;
  } catch (error) {
    console.error('删除任务出错', error);
    message.error('删除任务出错');
  }
};

// 确认删除
const confirmDelete = () => {
  if (deletingIndex.value > -1) {
    taskList.value.splice(deletingIndex.value, 1);
    message.success('任务删除成功');
  }
  deleteConfirmVisible.value = false;
};

// 取消删除
const cancelDelete = () => {
  deleteConfirmVisible.value = false;
};

// 切换任务状态
const toggleTaskStatus = (index: number, status: boolean) => {
  try {
    // 更新任务状态
    taskList.value[index].enabled = status;

    // 这里可以添加API调用来更新后端数据
    // 例如: updateTaskStatusApi(taskList.value[index].id, status);

    // 显示成功消息
    message.success(`任务已${status ? '启用' : '禁用'}`);
  } catch (error) {
    console.error('切换任务状态出错', error);
    message.error('切换任务状态出错');
  }
};

// 获取任务图标
const getTaskIcon = (type: string) => {
  switch (type) {
    case 'backup':
      return backupIcon;
    case 'cleanup':
      return cleanupIcon;
    case 'recycle':
      return recycleIcon;
    default:
      return '';
  }
};

// 获取任务类型名称
const getTaskTypeName = (type: string) => {
  switch (type) {
    case 'backup':
      return '定时备份';
    case 'cleanup':
      return '定时清理';
    case 'recycle':
      return '回收站管理';
    default:
      return '未知任务';
  }
};

// 获取任务类型样式类
const getTaskTypeClass = (type: string) => {
  switch (type) {
    case 'backup':
      return 'backup-task';
    case 'cleanup':
      return 'cleanup-task';
    case 'recycle':
      return 'recycle-task';
    default:
      return '';
  }
};

// 获取任务类型颜色
const getTaskTypeColor = (type: string) => {
  switch (type) {
    case 'backup':
      return 'blue';
    case 'cleanup':
      return 'green';
    case 'recycle':
      return 'orange';
    default:
      return 'default';
  }
};

// 获取任务类型简称
const getTaskTypeShortName = (type: string) => {
  switch (type) {
    case 'backup':
      return '备份';
    case 'cleanup':
      return '清理';
    case 'recycle':
      return '回收';
    default:
      return '未知';
  }
};

// 获取频率颜色
const getFrequencyColor = (frequency: string) => {
  switch (frequency) {
    case 'daily':
      return 'magenta';
    case 'weekly':
      return 'purple';
    case 'biweekly':
      return 'geekblue';
    case 'monthly':
      return 'cyan';
    default:
      return 'default';
  }
};

// 获取清理策略颜色
const getCleanupStrategyColor = (strategy: string) => {
  switch (strategy) {
    case 'duplicates':
      return 'green';
    case 'unused':
      return 'orange';
    case 'both':
      return 'volcano';
    default:
      return 'default';
  }
};

// 获取保留策略颜色
const getRetentionPolicyColor = (policy: string) => {
  switch (policy) {
    case 'all':
      return 'red';
    case 'time':
      return 'blue';
    default:
      return 'default';
  }
};

// 获取内容项名称
const getContentItemName = (item: string) => {
  const contentMap: Record<string, string> = {
    photos: '照片',
    albums: '相册',
    settings: '设置'
  };
  return contentMap[item] || item;
};

// 获取频率文本
const getFrequencyText = (frequency: string) => {
  switch (frequency) {
    case 'daily':
      return '每天';
    case 'weekly':
      return '每周';
    case 'biweekly':
      return '每两周';
    case 'monthly':
      return '每月';
    default:
      return '未知';
  }
};

// 格式化时间
const formatTime = (time: any) => {
  try {
    if (!time) return '未设置';
    return dayjs(time).format('HH:mm');
  } catch (error) {
    console.error('格式化时间出错', error);
    return '时间格式错误';
  }
};

// 格式化日期
const formatDate = (date: string) => {
  try {
    if (!date) return '未执行';
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  } catch (error) {
    console.error('格式化日期出错', error);
    return '日期格式错误';
  }
};

// 获取清理策略文本
const getCleanupStrategyText = (strategy: string) => {
  switch (strategy) {
    case 'duplicates':
      return '仅清理重复文件';
    case 'unused':
      return '清理长期未使用文件';
    case 'both':
      return '清理重复和未使用文件';
    default:
      return '未知';
  }
};

// 获取保留策略文本
const getRetentionPolicyText = (policy: string) => {
  switch (policy) {
    case 'all':
      return '清空所有文件';
    case 'time':
      return '按时间清空';
    default:
      return '未知';
  }
};

// 根据ID获取存储信息
const getStorageById = (id: string) => {
  return storageList.value.find(item => item.id === id);
};

onMounted(() => {
  getStorageList();
  getTaskList();
});
</script>

<style scoped lang="scss" src="./index.scss">

</style>
