<template>
  <div class="image-share">
    <div class="image-share-left">
      <div class="image-share-left-top">
        <div class="image-share-left-title">
          <h3>数据概览</h3>
        </div>

        <div class="image-share-left-content">
          <ACard class="image-share-left-content-item"
                 type="inner"
                 style="background: linear-gradient(102.74deg, rgb(66, 230, 171) -7.03%, rgb(103, 235, 187) 97.7%);">
            <div class="image-share-left-item-content">
              <span style="font-weight: bolder;font-size: 2.3vh">浏览次数（次）</span>
              <span style="font-weight: bolder;font-size: 5vh">{{ overviewData ? overviewData.visit_count : 0 }}</span>
              <p style="font-size: 2vh;color: hsla(0,0%,100%,.6);">今日浏览
                <span
                    style="font-weight: bolder;font-size: 2.8vh;color: #fff;">+{{
                    overviewData ? overviewData.visit_count_today : 0
                  }}</span>
              </p>
            </div>
          </ACard>
          <ACard class="image-share-left-content-item"
                 type="inner"
                 style="background: linear-gradient(101.63deg, rgb(82, 138, 250) -12.83%, rgb(122, 167, 255) 100%);">
            <div class="image-share-left-item-content">
              <span style="font-weight: bolder;font-size: 2.3vh">浏览人数（人）</span>
              <span style="font-weight: bolder;font-size: 5vh">{{ overviewData ? overviewData.viewer_count : 0 }}</span>
              <p style="font-size: 2vh;color: hsla(0,0%,100%,.6);">今日浏览人数
                <span
                    style="font-weight: bolder;font-size: 2.8vh;color: #fff;">+{{
                    overviewData ? overviewData.viewer_count_today : 0
                  }}</span>
              </p>
            </div>
          </ACard>
          <ACard class="image-share-left-content-item"
                 type="inner"
                 style="background: linear-gradient(102.99deg, rgb(126, 92, 255) 3.18%, rgb(162, 139, 255) 102.52%);">
            <div class="image-share-left-item-content">
              <span style="font-weight: bolder;font-size: 2.3vh">发布次数（次）</span>
              <span style="font-weight: bolder;font-size: 5vh">{{
                  overviewData ? overviewData.publish_count : 0
                }}</span>
              <p style="font-size: 2vh;color: hsla(0,0%,100%,.6);">今日发布
                <span
                    style="font-weight: bolder;font-size: 2.8vh;color: #fff;">+{{
                    overviewData ? overviewData.publish_count_today : 0
                  }}</span>
              </p>
            </div>
          </ACard>
        </div>

      </div>
      <div class="image-share-left-bottom">
        <div class="image-share-left-bottom-title">
          <h3>快传管理</h3>
          <ARangePicker
              :value="selectedDateRange"
              :disabled-date="disabledDate"
              format="YYYY-MM-DD"
              @change="onChange"
              @openChange="onOpenChange"
              @calendarChange="onCalendarChange"
              :bordered="true"
              style="border-radius: 20px"
          />
        </div>
        <div class="image-share-left-bottom-content">
          <ACard style="width: 100%;height: 100%;"
                 :bodyStyle="{padding: 0, overflow: 'auto', display: 'flex', flexDirection: 'column'}">
            <ATable :columns="columns" :data-source="dataSources" size="large"
                    style="flex: 1"
                    :pagination="false"
                    :loading="loading"
                    :scroll="{ y: '40vh',x:true }"
                    :bordered="false" @resizeColumn="handleResizeColumn">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'cover_image'">
                  <AAvatar shape="square" size="large" :src="`data:image/png;base64,`+record.cover_image"/>
                </template>
                <!-- 访问密码 -->
                <template v-else-if="column.key === 'access_password'">
                  <AInputPassword
                      v-if="record.access_password"
                      v-model:value="record.access_password"
                      type="password"
                      :visibilityToggle="true"
                      :bordered="false"
                      size="small"
                      readOnly
                      style="width: 100px;"
                  />
                  <p v-else style="color: #999">无密码</p>
                </template>
                <!-- 有效期 -->
                <template v-else-if="column.key === 'validity_period'">

                </template>
                <template v-else-if="column.key === 'action'">
                  <ATooltip title="复制分享链接">
                    <AButton type="text" size="small"
                             @click="copyToClipboard(record.invite_code)">
                      <LinkOutlined/>
                    </AButton>
                  </ATooltip>
                  <ATooltip title="删除快传记录">
                    <APopconfirm
                        title="确定删除该快传记录?"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="async () => await deleteShareRecord(record.id, record.invite_code, record.album_id)"
                        @cancel="() => {}"
                    >
                      <AButton type="text" size="small" danger>
                        <DeleteOutlined/>
                      </AButton>
                    </APopconfirm>
                  </ATooltip>
                </template>
              </template>

            </ATable>
          </ACard>
        </div>
      </div>
    </div>
    <ShareUpload/>

  </div>
</template>
<script setup lang="ts">
import {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import ShareUpload from "@/views/Share/ImageShare/ShareUpload.vue";
import {deleteShareRecordApi, queryShareOverviewApi, queryShareRecordListApi} from "@/api/share";
import {message} from "ant-design-vue";
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');


type RangeValue = [Dayjs, Dayjs];
const dates = ref<RangeValue>();
const selectedDateRange = ref<RangeValue>();
const hackValue = ref<RangeValue>();

const loading = ref<boolean>(false);
const overviewDataLoading = ref<boolean>(false);


const disabledDate = (current: Dayjs) => {
  if (!dates.value || (dates.value as any).length === 0) {
    return false;
  }
  const tooLate = dates.value[0] && current.diff(dates.value[0], 'days') > 30;
  const tooEarly = dates.value[1] && dates.value[1].diff(current, 'days') > 30;
  return tooEarly || tooLate;
};

const onOpenChange = (open: boolean) => {
  if (open) {
    dates.value = [] as any;
    hackValue.value = [] as any;
  } else {
    hackValue.value = undefined;
  }
};

const onChange = async (val: RangeValue) => {
  selectedDateRange.value = val;

  // 将日期范围处理成一个数组
  if (val && val.length === 2) {
    const startDate = val[0].format('YYYY-MM-DD'); // 格式化开始日期
    const endDate = val[1].format('YYYY-MM-DD'); // 格式化结束日期
    const dateRangeArray = [startDate, endDate]; // 将日期范围存入数组
    await getShareRecords(dateRangeArray);
  } else {
    console.log('No date range selected');
  }
};

const onCalendarChange = (val: RangeValue) => {
  dates.value = val;
};


const columns = [
  {
    title: '快传记录',
    dataIndex: 'cover_image',
    key: 'cover_image',
    ellipsis: true,
    width: 90,
  },
  {
    title: '上传时间',
    dataIndex: 'created_at',
    key: 'created_at',
    ellipsis: true,
    customRender: ({text}) => {
      return dayjs(text).format('YYYY-MM-DD'); // 格式化时间
    },
  },
  {
    title: '访问密码',
    key: 'access_password',
    dataIndex: 'access_password',
    ellipsis: true,
  },
  {
    title: '访问限制',
    key: 'visit_limit',
    dataIndex: 'visit_limit',
    ellipsis: true,
    customRender: ({text}) => {
      return `${text}次`;
    },
  },
  {
    title: '有效期',
    key: 'validity_period',
    dataIndex: 'validity_period',
    ellipsis: true,
    customRender: ({text}) => {
      return formatValidityPeriod(text);
    },
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
  },
];

function handleResizeColumn(w, col) {
  col.width = w;
}

const formatValidityPeriod = (period: number) => {
  return period === 0 ? '永久' : `${period}天`;
};

// 复制功能
function copyToClipboard(text: string) {
  const url: string = import.meta.env.VITE_APP_WEB_URL + '/main/share/list/' + text;
  navigator.clipboard.writeText(url).then(() => {
    message.success('复制成功');
  }).catch(() => {
    message.error('复制失败');
  });
}

const dataSources = ref<any[]>([]);

/**
 * 获取分享记录
 */
async function getShareRecords(dateRange: string[]) {
  loading.value = true;
  const res: any = await queryShareRecordListApi(dateRange);
  if (res && res.code === 200) {
    dataSources.value = res.data.records;
  }
  loading.value = false;
}

const overviewData = ref<any>();

/**
 * 获取分享概览
 */
async function getShareOverview() {
  overviewDataLoading.value = true;
  const res: any = await queryShareOverviewApi();
  if (res && res.code === 200) {
    overviewData.value = res.data;
  }
  overviewDataLoading.value = false;
}

/**
 * 删除分享记录
 * @param id
 * @param invite_code
 * @param album_id
 */
async function deleteShareRecord(id: number, invite_code: string, album_id: number) {
  const res: any = await deleteShareRecordApi(id, invite_code, album_id);
  if (res && res.code === 200) {
    message.success('删除成功');
    const endDate = dayjs().format('YYYY-MM-DD'); // 当前日期
    const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD'); // 30 天前的日期
    await getShareRecords([startDate, endDate]);
  } else {
    message.error('删除失败');
  }
}

onMounted(async () => {
  const endDate = dayjs().format('YYYY-MM-DD'); // 当前日期
  const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD'); // 30 天前的日期
  await getShareRecords([startDate, endDate]);
  await getShareOverview();
});

</script>

<style scoped lang="scss">
.image-share {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  gap: 20px;

  .image-share-left {
    height: 100%;
    width: 65%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    .image-share-left-top {
      width: 100%;
      height: 30%;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .image-share-left-title {
        width: 100%;
        height: 20%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .image-share-left-content {
        width: 100%;
        height: 80%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .image-share-left-content-item {
          height: 100%;
          width: 30%;
          color: #fff;
          overflow: auto;

          .image-share-left-item-content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            overflow: hidden;
          }
        }
      }

    }

    .image-share-left-bottom {
      width: 100%;
      height: 70%;
      display: flex;
      flex-direction: column;

      .image-share-left-bottom-title {
        width: 100%;
        height: 20%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .image-share-left-bottom-content {
        width: 100%;
        height: 80%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        .ant-card {
          height: 100%;

          .ant-table {
            flex: 1;
            height: 100%;
          }
        }
      }
    }
  }

}
</style>
