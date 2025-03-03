<template>
  <AFlex class="header-search-container" :vertical="false" align="center" justify="center">
    <APopover :arrow="false" :overlayInnerStyle="{width: '28vw'}"
              trigger="click">
      <AInput size="large" class="header-search-input"
              v-model:value="searchStore.searchValue"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
              :style="{borderRadius: borderRadius, boxShadow: boxShadow}"
              :placeholder="searchStore.searchOption[0]? '#'+searchStore.searchOption[0] : '搜索...'"
              @pressEnter="search"
      >
        <template #suffix>
          <AButton size="small" type="text" shape="circle" @click.prevent>
            <template #icon>
              <APopover :arrow="false" trigger="click" placement="bottom">
                <template #content>
                  <div class="header-search-params-container">
                    <div class="header-search-params-item" v-for="(item, index) in searchStore.options" :key="index">
                      <CheckCard
                          class="photo-item"
                          margin="10"
                          border-radius="50%"
                          v-model="searchStore.searchOption"
                          :showHoverCircle="true"
                          :iconSize="20"
                          :showSelectedEffect="true"
                          :selection-mode="'single'"
                          :value="item.value">
                        <AAvatar size="large" shape="circle" :src="item.icon"/>
                      </CheckCard>
                      <span class="photo-item-label">{{ item.label }}</span>
                    </div>
                  </div>
                </template>
                <AAvatar size="small" shape="circle"
                         :src="searchStore.getIconByValue(searchStore.searchOption[0])? searchStore.getIconByValue(searchStore.searchOption[0]) : params"/>
              </APopover>
            </template>
          </AButton>
        </template>
      </AInput>
      <template #content>

        <div class="header-search-time" v-if="searchStore.searchOption[0] === 'time'">
          <ARangePicker
              :value="selectedDateRange"
              :disabled-date="disabledDate"
              format="YYYY-MM-DD"
              @change="onChange"
              @openChange="onOpenChange"
              @calendarChange="onCalendarChange"
              :bordered="true"
              size="large"
              style="border-radius: 20px"
          />
        </div>
        <!--          <AFlex :vertical="false" align="center" justify="space-between" class="header-search-content-header">-->
        <!--            <span>搜索历史</span>-->
        <!--            <AButton type="text" size="small" style="color: #707072">清空搜索历史</AButton>-->
        <!--          </AFlex>-->
        <!--          <div class="header-search-content-body">-->
        <!--            <ATag :style="{-->
        <!--                padding: '5px 15px',-->
        <!--                fontSize: '15px',-->
        <!--                cursor: 'pointer',-->
        <!--                marginTop: '20px',-->
        <!--              }" :bordered="false" closable>搜索历史1-->
        <!--            </ATag>-->
        <!--          </div>-->
      </template>
    </APopover>
  </AFlex>
</template>
<script setup lang="ts">

import params from "@/assets/svgs/params.svg";
import useStore from "@/store";
import 'dayjs/locale/zh-cn';
import dayjs, {Dayjs} from 'dayjs';
import {imageSearchApi} from "@/api/storage";

dayjs.locale('zh-cn');
const borderRadius = ref('20px');
const boxShadow = ref('none');
const searchStore = useStore().search;
const uploadStore = useStore().upload;
const router = useRouter();
/**
 * 监听输入框聚焦事件
 */
const handleInputFocus = () => {
  borderRadius.value = '10px'; // 聚焦时圆角变为0
  boxShadow.value = '0 0 10px rgba(0, 123, 255, 0.5)'; // 聚焦时增加阴影
};
/**
 * 监听输入框失焦事件
 */
const handleInputBlur = () => {
  borderRadius.value = '20px'; // 失去焦点时圆角恢复
  boxShadow.value = 'none'; // 失去焦点时阴影消失
};


type RangeValue = [Dayjs, Dayjs];
const dates = ref<RangeValue>();
const selectedDateRange = ref<RangeValue>();
const hackValue = ref<RangeValue>();


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
    searchStore.searchValue = `[${startDate}, ${endDate}]`; // 将日期范围存入数组
  } else {
    console.log('No date range selected');
  }
};

const onCalendarChange = (val: RangeValue) => {
  dates.value = val;
};

/**
 * 搜索事件
 */
async function search() {
  const params: any = {
    type: searchStore.searchOption[0],
    keyword: searchStore.searchValue,
    provider: uploadStore.storageSelected?.[0],
    bucket: uploadStore.storageSelected?.[1],
    input_image: "123"
  };
  const res: any = await imageSearchApi(params);
  if (res && res.code === 200) {
    searchStore.searchResult = res.data.records;
    router.push({
      path: '/main/photo/search/list', query: {
        type: searchStore.searchOption[0],
        keyword: searchStore.searchValue,
      }
    });
  }
}

</script>


<style scoped lang="scss">
.header-search-container {
  width: 30%;

  .header-search-input {
    border-radius: 20px;
  }

  .header-search-content-body {
    margin-top: 10px;
  }
}

.header-search-params-container {
  width: 230px;
  height: 200px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 25px;

  .header-search-params-item {
    width: 100px;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 15px;

    .photo-item-label {
      font-size: 14px;
      font-weight: bolder;
    }
  }
}

.header-search-time {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-search-picture {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;

  .avatar-uploader {
    width: 100px;
    height: 100px;
  }

  .header-search-picture-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
  }
}
</style>
