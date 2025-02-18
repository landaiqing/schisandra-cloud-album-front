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
              <span style="font-weight: bolder;font-size: 5vh">1</span>
              <p style="font-size: 2vh;color: hsla(0,0%,100%,.6);">今日浏览
                <span style="font-weight: bolder;font-size: 2.8vh;color: #fff;">+0</span>
              </p>
            </div>
          </ACard>
          <ACard class="image-share-left-content-item"
                 type="inner"
                 style="background: linear-gradient(101.63deg, rgb(82, 138, 250) -12.83%, rgb(122, 167, 255) 100%);">
            <div class="image-share-left-item-content">
              <span style="font-weight: bolder;font-size: 2.3vh">浏览人数（人）</span>
              <span style="font-weight: bolder;font-size: 5vh">1</span>
              <p style="font-size: 2vh;color: hsla(0,0%,100%,.6);">今日浏览人数
                <span style="font-weight: bolder;font-size: 2.8vh;color: #fff;">+0</span>
              </p>
            </div>
          </ACard>
          <ACard class="image-share-left-content-item"
                 type="inner"
                 style="background: linear-gradient(102.99deg, rgb(126, 92, 255) 3.18%, rgb(162, 139, 255) 102.52%);">
            <div class="image-share-left-item-content">
              <span style="font-weight: bolder;font-size: 2.3vh">发布次数（次）</span>
              <span style="font-weight: bolder;font-size: 5vh">1</span>
              <p style="font-size: 2vh;color: hsla(0,0%,100%,.6);">今日发布
                <span style="font-weight: bolder;font-size: 2.8vh;color: #fff;">+0</span>
              </p>
            </div>
          </ACard>
        </div>
      </div>
      <div class="image-share-left-bottom">
        <div class="image-share-left-bottom-title">
          <h3>快传管理</h3>
          <ARangePicker
              :value="hackValue || value"
              :disabled-date="disabledDate"
              @change="onChange"
              @openChange="onOpenChange"
              @calendarChange="onCalendarChange"
              :bordered="true"
              style="border-radius: 20px"
          />
        </div>
        <div class="image-share-left-bottom-content">
          <ACard style="width: 100%;height: 100%;" :bodyStyle="{padding: 0}">
            <ATable :columns="columns" size="large" style="width: 100%;height: 100%;" :bordered="false">

            </ATable>
          </ACard>
        </div>
      </div>
    </div>
    <div class="image-share-right">
      <div class="image-share-right-top">
        <h3>照片快传</h3>
      </div>
      <div class="image-share-right-bottom">
        <div class="image-share-right-bottom-content">
          <div class="image-share-right-bottom-upload" ref="qrContainer" v-if="fileList.length<=0">
            <AUploadDragger
                name="file"
                :multiple="true"
                :showUploadList="false"
                :beforeUpload="beforeUpload"
                v-model:fileList="fileList"
                class="image-share-right-upload"
            >
              <div class="image-share-right-upload-item">
                <p class="ant-upload-drag-icon">
                  <ABadge :offset="[-15, 20]" :count="fileList.length">
                    <AAvatar shape="square" :size="folderIconSize" :src="folder"/>
                  </ABadge>
                </p>
                <p class="ant-upload-text" style="font-size: 2.6vh;font-weight: bolder">单击或拖动文件到此区域以上传</p>
                <AButton type="primary" size="large" shape="round" style="width: 70%">上 传 照 片</AButton>

                <div class="qr">
                  <AQrcode :bordered="false" color="rgba(126, 126, 135, 0.48)"
                           :size="qrcodeSize"
                           :value="`git.landaiqing.cneyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjI1MTEyMjE3MzQyMDIxIiwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTczOTg3ODIyOCwibmJmIjoxNzM5ODcxMDI4LCJpYXQiOjE3Mzk4NzEwMjh9.EUiZsVjhGqHx1V5o90S3W5li6nIqucxy9eEY9LWgqXY`"
                           :icon="phone"
                           :iconSize="iconSize"
                           :status="`active`"
                  />
                  <span style="font-size: 2vh;color: #999999">手机扫码上传</span>
                </div>
              </div>
            </AUploadDragger>
          </div>
          <div class="image-share-right-bottom-container" v-else>
            <div class="image-share-right-bottom-container-header">
              <AInput v-model:value="titleName" :bordered="false" size="large" placeholder="给快传起个标题"/>
              <ADropdown placement="bottomLeft" :trigger="['click']">
                <template #overlay>
                  <AMenu>
                    <AMenuItem key="1">
                      <AUpload
                          name="file"
                          :multiple="true"
                          :showUploadList="false"
                          :beforeUpload="beforeUpload"
                          v-model:fileList="fileList"
                      >
                        上传文件
                      </AUpload>
                    </AMenuItem>
                    <AMenuItem key="2">
                      <APopover placement="bottomLeft" trigger="hover">
                        <template #content>
                          <AQrcode :bordered="false" color="rgba(126, 126, 135, 0.48)"
                                   :size="qrcodeSize"
                                   :value="`git.landaiqing.cneyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjI1MTEyMjE3MzQyMDIxIiwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTczOTg3ODIyOCwibmJmIjoxNzM5ODcxMDI4LCJpYXQiOjE3Mzk4NzEwMjh9.EUiZsVjhGqHx1V5o90S3W5li6nIqucxy9eEY9LWgqXY`"
                                   :icon="phone"
                                   :iconSize="iconSize"
                                   :status="`active`"
                          />
                        </template>
                        手机上传
                      </APopover>
                    </AMenuItem>
                  </AMenu>
                </template>
                <AButton size="middle" shape="circle">
                  <template #icon>
                    <PlusOutlined/>
                  </template>
                </AButton>
              </ADropdown>
            </div>
            <div class="image-share-right-bottom-content-list">
              <p style="font-size: 2.0vh;color: #999999;cursor: default">共{{ fileList.length }}个文件
                {{ calculateTotalSize(fileList) }}</p>
              <div class="image-share-right-bottom-content-list-wrapper">
                <div class="image-share-right-bottom-content-list-item" v-for="(item, index) in fileList" :key="index">
                  <div class="file-thumbnail">
                    <AImage :width="50" :height="50" :src="convertFileToUrl(item.originFileObj)">
                      <template #previewMask>
                      </template>
                    </AImage>
                  </div>
                  <div class="file-info">
                    <p style="font-size: 2.0vh;color: #333333;cursor: default;font-weight: bold">{{ item.name }}</p>
                    <p style="font-size: 1.5vh;color: #999999;cursor: default">{{
                        formatByteSize(item.size)
                      }}</p>
                  </div>
                  <div class="file-operation">
                    <AButton size="middle" shape="circle" type="text" @click="removeBase64Image(index)">
                      <template #icon>
                        <CloseOutlined/>
                      </template>
                    </AButton>
                  </div>
                </div>
              </div>
            </div>
            <ADivider/>
            <div class="image-share-right-bottom-operation">
              <div class="image-share-right-operation-select">
                <div class="image-share-right-operation-item">
                  <span class="label-text">访问时效</span>
                  <ASelect style="width: 50%">
                    <ASelectOption value="1">1天</ASelectOption>
                    <ASelectOption value="3">3天</ASelectOption>
                    <ASelectOption value="7">7天</ASelectOption>
                    <ASelectOption value="15">15天</ASelectOption>
                    <ASelectOption value="30">30天</ASelectOption>
                    <ASelectOption value="0">永久</ASelectOption>
                  </ASelect>
                </div>
                <div class="image-share-right-operation-item">
                  <span class="label-text">访问密码</span>
                  <AInputPassword style="width: 50%"></AInputPassword>
                </div>
                <div class="image-share-right-operation-item">
                  <span class="label-text">访问限制</span>
                  <AInputNumber style="width: 50%" :defaultValue="100" :min="1"></AInputNumber>
                </div>
              </div>
              <div class="image-share-right-bottom-operation-btn">
                <AButton type="primary" size="large" shape="default" style="width: 100%">开始上传</AButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Dayjs} from 'dayjs';
import folder from "@/assets/svgs/folder.svg";
import {NSFWJS} from "nsfwjs";
import {initNSFWJs, predictNSFW} from "@/utils/tfjs/nsfw.ts";
import {message} from "ant-design-vue";
import i18n from "@/locales";
import phone from "@/assets/svgs/qr-phone.svg";

type RangeValue = [Dayjs, Dayjs];
const dates = ref<RangeValue>();
const value = ref<RangeValue>();
const hackValue = ref<RangeValue>();
const titleName = ref<string>("");

const qrContainer = ref<HTMLDivElement | null>(null);


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

const onChange = (val: RangeValue) => {
  value.value = val;
};

const onCalendarChange = (val: RangeValue) => {
  dates.value = val;
};

/**
 *  格式化字节大小
 * @param bytes
 */
function formatByteSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} Bytes`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

/**
 *  格式化字节大小
 * @param bytes
 * @param decimals
 */
function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 *  计算文件总大小
 * @param fileDataArray
 */
function calculateTotalSize(fileDataArray: { size: number }[]): string {
  const totalSize = fileDataArray.reduce((acc, file) => acc + file.size, 0);
  return formatBytes(totalSize);
}


const columns = [
  {
    title: '快传记录',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '上传时间',
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: '浏览次数',
    dataIndex: 'views',
    key: 'views',
  },
  {
    title: '浏览人数',
    key: 'viewers',
    dataIndex: 'viewers',
  },
  {
    title: '传输状态',
    key: 'status',
    dataIndex: 'status',
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
  },
];

const qrcodeSize = ref<number>(220);
const iconSize = ref<number>(30);
const folderIconSize = ref<number>(100);

/**
 *  更新二维码大小
 */
const updateQrcodeSize = () => {
  if (qrContainer.value) {
    // 设置 QRCode 大小
    const containerWidth = qrContainer.value.clientWidth;
    qrcodeSize.value = containerWidth * 0.5; // 设置 QRCode 为父盒子宽度的80%
    folderIconSize.value = containerWidth * 0.3; // 设置文件夹图标大小为父盒子宽度的10%
    iconSize.value = Math.min(containerWidth * 0.1, 40); // 设置 icon 大小为父盒子宽度的10%
  }
};

const fileList = ref<any[]>([]);

/**
 * 上传文件前置
 * @param file
 */
async function beforeUpload(file: any) {
  if (!window.FileReader) return false; // 判断是否支持FileReader
  const reader = new FileReader();
  reader.readAsDataURL(file); // 文件转换
  reader.onloadend = async function () {
    const img: HTMLImageElement = document.createElement('img');
    img.src = reader.result as string;
    img.onload = async () => {
      // 图片 NSFW 检测
      const nsfw: NSFWJS = await initNSFWJs();
      const isNSFW: boolean = await predictNSFW(nsfw, img);
      if (isNSFW) {
        message.error(i18n.global.t('comment.illegalImage'));
        return false;
      }
    };
  };
  return true;
}

/**
 *  删除 base64 图片
 * @param index
 */
async function removeBase64Image(index: number) {
  fileList.value.splice(index, 1);
}

/**
 *  转换文件为 URL
 * @param file
 */
function convertFileToUrl(file: any) {
  return URL.createObjectURL(file);
}

onMounted(() => {
  window.addEventListener("resize", updateQrcodeSize);
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
      }
    }
  }

  .image-share-right {
    height: 100%;
    width: 35%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;

    .image-share-right-top {
      width: 100%;
      height: 6%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    .image-share-right-bottom {
      width: 100%;
      height: 94%;
      display: flex;
      flex-direction: column;

      .image-share-right-bottom-content {
        width: 90%;
        height: 100%;
        padding: 20px;
        background: #ffffff;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 10px;

        .image-share-right-bottom-upload {
          width: 100%;
          height: 100%;
          overflow: auto;

          .image-share-right-upload {
            width: 100%;
            height: 100%;

          }
        }

        .image-share-right-bottom-container {
          width: 100%;
          height: 100%;

          .image-share-right-bottom-container-header {
            width: 100%;
            height: 10%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .image-share-right-bottom-content-list {
            width: 95%;
            height: 40%;
            display: flex;
            flex-direction: column;
            align-content: flex-start;
            justify-content: flex-start;
            gap: 15px;
            flex-wrap: nowrap;
            padding: 10px;
            overflow: auto;
            background-color: #f5f5f5;
            border-radius: 10px;

            .image-share-right-bottom-content-list-wrapper {
              width: 100%;
              height: 27vh;
              display: flex;
              flex-direction: column;
              align-content: flex-start;
              justify-content: flex-start;
              overflow: auto;
              gap: 10px;

              .image-share-right-bottom-content-list-item {
                width: 100%;
                height: 50px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                .file-thumbnail {
                  height: 100%;
                  width: 17%;
                }

                .file-info {
                  height: 100%;
                  width: 63%;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  align-items: flex-start;
                }

                .file-operation {
                  height: 100%;
                  width: 20%;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                }
              }
            }
          }


          .image-share-right-bottom-operation {
            width: 100%;
            height: 40%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .image-share-right-operation-select {
              width: 100%;
              height: 75%;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: space-between;
              flex-wrap: nowrap;

              .image-share-right-operation-item {
                width: 100%;
                height: 5vh;
                display: flex;
                flex-direction: row;
                align-items: baseline;
                justify-content: space-between;

                .label-text {
                  width: 50%;
                  color: #999999;
                  font-size: 2.2vh;
                }
              }
            }

            .image-share-right-bottom-operation-btn {
              width: 100%;
              height: 35%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }


      }


    }

  }
}


.image-share-right-upload-item {
  //width: 100% !important;
  //height: 100% !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  //justify-content: center;
  gap: 2vh;
}


</style>
