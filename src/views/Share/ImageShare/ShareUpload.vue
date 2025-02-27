<template>
  <div class="image-share-right">
    <div class="image-share-right-top">
      <h3>照片快传</h3>
    </div>
    <div class="image-share-right-bottom">
      <div class="image-share-right-bottom-content">
        <div class="image-share-right-bottom-upload" ref="qrContainer"
             v-if="fileList.length <= 0 && !uploadSuccess">
          <AUploadDragger
              name="file"
              :multiple="true"
              :showUploadList="false"
              :beforeUpload="beforeUpload"
              v-model:fileList="fileList"
              :customRequest="customRequest"
              class="image-share-right-upload"
          >
            <div class="image-share-right-upload-item">
              <p class="ant-upload-drag-icon">
                <ABadge :offset="[-15, 20]" :count="fileList.length">
                  <AAvatar shape="square" :size="folderIconSize" :src="folder"/>
                </ABadge>
              </p>
              <p class="ant-upload-text" style="font-size: 2.6vh;font-weight: bolder">单击或拖动文件到此区域以上传</p>
              <AButton type="primary" size="large" shape="round" style="width: 70%">
                <template #icon>
                  <CloudUploadOutlined/>
                </template>
                上 传 照 片
              </AButton>
              <APopover placement="top" trigger="click">
                <template #content>
                  <AQrcode :bordered="false" color="rgba(126, 126, 135, 0.48)"
                           :size="qrcodeSize"
                           :value="generateQrCodeUrl()"
                           :icon="phone"
                           :iconSize="iconSize"
                           :status="qrStatus"
                  />
                </template>
                <AButton type="default" size="large" shape="round" style="width: 70%"
                         @click.stop="initWebSocket">
                  <template #icon>
                    <QrcodeOutlined/>
                  </template>
                  手 机 上 传
                </AButton>
              </APopover>

            </div>
          </AUploadDragger>
        </div>
        <div class="image-share-right-bottom-container" v-if="fileList.length > 0 && !loading">
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
              <div class="image-share-right-bottom-content-list-item"
                   v-for="(item, index) in fileList" :key="index">
                <div class="file-thumbnail" ref="fileContainer">
                  <AImage :width="50" :height="50"
                          :src="convertFileToUrl(item.originFileObj)">
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
                  <AButton size="middle" shape="circle" type="text" @click="removeImage(index)">
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
                <ASelect style="width: 50%" placeholder="请选择" :defaultValue="1" v-model:value="expire_date">
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
                <AInputPassword style="width: 50%" v-model:value="access_password" :maxlength="10"
                                :showCount="true"></AInputPassword>
              </div>
              <div class="image-share-right-operation-item">
                <span class="label-text">访问限制</span>
                <AInputNumber style="width: 50%" :defaultValue="100" :min="1"
                              v-model:value="access_limit"></AInputNumber>
              </div>
            </div>
            <div class="image-share-right-bottom-operation-btn">
              <AButton type="primary" size="middle" shape="round" style="width: 100%"
                       :loading="loading"
                       @click="customUploader">
                开始上传
              </AButton>
            </div>
          </div>
        </div>
        <div v-if="loading && !uploadSuccess" class="image-share-right-bottom-loading">
          <div class="image-share-right-bottom-loading-content">
            <AProgress
                type="circle"
                :stroke-color="{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }"
                :percent="percent"
                :size="180"
            />
            <p>{{ fileList.length }} 个文件 / {{ calculateTotalSize(fileList) }}</p>
          </div>
          <div class="image-share-right-bottom-loading-footer">
            <AButton type="primary" size="large" shape="round" style="width: 80%" @click="abort">
              取 消
            </AButton>
          </div>
        </div>
        <div v-if="uploadSuccess" class="image-share-right-bottom-success">
          <div class="image-share-right-bottom-success-header">
            <div class="image-share-right-bottom-success-header-title">
              <CheckCircleOutlined style="font-size: 3vh;color: #52c41a"/>
              <h3>上 传 成 功</h3>
            </div>
            <div class="image-share-right-bottom-success-header-close">
              <AButton type="text" size="middle" shape="circle" @click="uploadSuccess = false">
                <CloseOutlined/>
              </AButton>
            </div>
          </div>
          <div class="image-share-right-bottom-success-content">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import folder from "@/assets/svgs/folder.svg";
import phone from "@/assets/svgs/qr-phone.svg";
import useStore from "@/store";
import {NSFWJS} from "nsfwjs";
import {initNSFWJs, predictNSFW} from "@/utils/tfjs/nsfw.ts";
import {message} from "ant-design-vue";
import i18n from "@/locales";
import {useRequest} from "alova/client";
import {shareImageUploadApi} from "@/api/share";
import imageCompression from "browser-image-compression";
import {generateThumbnail} from "@/utils/imageUtils/generateThumb.ts";

const titleName = ref<string>("");

const upload = useStore().upload;
const percent = ref<number>(0);
const uploadSuccess = ref<boolean>(false);
const qrContainer = ref<HTMLDivElement | null>(null);

/**
 *  格式化字节大小
 * @param bytes
 */
function formatByteSize(bytes: number) {
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

const qrcodeSize = ref<number>(220);
const iconSize = ref<number>(30);
const folderIconSize = ref<number>(100);
const loading = ref<boolean>(false);


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

const expire_date = ref<string>("1");

const access_limit = ref<number>(100);

const access_password = ref<string>("");

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
 *  自定义请求
 * @param _file
 * @param _fileList
 */
function customRequest(_file: any, _fileList: any) {
  return;
}

const {uploading, send: submitFile, abort} = useRequest(shareImageUploadApi, {
  immediate: false,
  debounce: 500,
});

/**
 *  自定义上传器
 */
async function customUploader() {
  if (fileList.value.length <= 0) return;
  loading.value = true;
  uploadSuccess.value = false;
  // 存储所有图片信息的数组
  const images: any[] = [];
  for (const file of fileList.value) {
    // 压缩图片
    const compressedFile = await imageCompression(file.originFileObj, {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 750,
      maxIteration: 10,
      useWebWorker: true,
      initialQuality: 0.6,
    });

    // 生成缩略图
    const {binaryData, width, height, size} = await generateThumbnail(compressedFile);
    // 将文件转换为 Base64 编码
    const base64Thumbnail = binaryData ? await toBase64(binaryData) : '';
    const base64Image = await toBase64(file.originFileObj);
    // 创建文件的元数据对象
    const fileObj = {
      file_name: file.name,            // 文件名
      origin_image: base64Image,       // 原始图片的 base64 数据
      file_type: file.type,            // 文件类型
      thumbnail: base64Thumbnail,      // 缩略图的 base64 数据
      thumb_w: width,                  // 缩略图宽度
      thumb_h: height,                 // 缩略图高度
      thumb_size: size,                // 缩略图文件大小
    };

    // 将文件对象添加到图片数组
    images.push(fileObj);
  }

  // 准备发送给后端的请求数据
  const requestData = {
    title: titleName.value,
    expire_date: expire_date.value,
    access_limit: access_limit.value,
    access_password: access_password.value,
    images: images,
  };
  watch(
      () => uploading.value,
      (upload) => {
        if (upload && upload.loaded && upload.total) {
          percent.value = Number(Math.round((upload.loaded / upload.total) * 100).toFixed(2));
        }
      },
  );
  const res: any = await submitFile(requestData);
  if (res && res.code === 200) {
    uploadSuccess.value = true;
    fileList.value = [];
  }
  loading.value = false;
}

/**
 * 将文件转换为 Base64 编码
 * @param file
 */
function toBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      // 确保 reader.result 是字符串类型
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);  // 只获取 base64 部分
      } else {
        reject(new Error('FileReader result is not a string.'));
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


/**
 *  删除图片
 * @param index
 */
async function removeImage(index: number) {
  fileList.value.splice(index, 1);
}

/**
 *  转换文件为 URL
 * @param file
 */
function convertFileToUrl(file: any) {
  return URL.createObjectURL(file);
}

const user = useStore().user;
const websocket = useStore().websocket;
const wsOptions = {
  url: import.meta.env.VITE_FILE_SOCKET_URL + "?user_id=" + user.user.uid,
  protocols: [user.token.accessToken],
};

function generateQrCodeUrl(): string {
  console.log(import.meta.env.VITE_APP_WEB_URL + "/main/share/phone/app?user_id=" + user.user.uid + "&token=" + user.token.accessToken);
  return import.meta.env.VITE_APP_WEB_URL + "/main/share/phone/app?user_id=" + user.user.uid + "&token=" + user.token.accessToken;
}

/**
 *  初始化 WebSocket
 */
function initWebSocket() {
  websocket.initialize(wsOptions);
  websocket.on("message", async (res: any) => {
    if (res && res.code === 200) {
      const {data} = res;
      const file: File = base64ToFile(data.origin_file_obj, data.name, data.type);
      fileList.value.push({
        originFileObj: file,
        name: data.name,
        type: data.type,
        size: data.size,
      });
    }
  });
}

/**
 *  将 Base64 字符串转换为 File 对象
 * @param base64
 * @param filename
 * @param mimeType
 */
function base64ToFile(base64, filename, mimeType): File {
  // 检查并移除Base64前缀（如果有）
  const base64Data = base64.split(',')[1] || base64;

  // 将Base64字符串解码为二进制字符串
  const binaryString = atob(base64Data);

  // 将二进制字符串转换为ArrayBuffer
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  // 创建Blob对象
  const blob = new Blob([arrayBuffer], {type: mimeType});

  // 创建File对象
  return new File([blob], filename, {type: mimeType});
}

const qrStatus = ref<string>('loading');
watch(
    () => websocket.readyState,
    (newStatus) => {
      if (newStatus === WebSocket.OPEN) {
        qrStatus.value = 'active';
      } else {
        qrStatus.value = 'expired';
      }
    }
);

onMounted(() => {
  window.addEventListener("resize", updateQrcodeSize);
});
onBeforeUnmount(() => {
  websocket.close(false);
});
</script>
<style scoped lang="scss">
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
              gap: 10px;

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

      .image-share-right-bottom-loading {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        .image-share-right-bottom-loading-content {
          width: 100%;
          height: 80%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .image-share-right-bottom-loading-footer {
          width: 100%;
          height: 20%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
      }

      .image-share-right-bottom-success {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        .image-share-right-bottom-success-header {
          width: 100%;
          height: 10%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          .image-share-right-bottom-success-header-title {
            height: 100%;
            width: 90%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .image-share-right-bottom-success-header-close {
            height: 100%;
            width: 10%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }
        }

        .image-share-right-bottom-success-content {
          width: 100%;
          height: 90%;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

      }
    }
  }
}

.image-share-right-upload-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5vh;
}
</style>
