 <template>
  <div class="image-bed-container">
    <AFlex class="image-bed-content" :vertical="false" align="center" justify="flex-start">
      <div class="image-bed-content-left">
        <ACard class="image-bed-content-left-container">
          <div class="image-bed-content-left-upload">
            <div class="image-bed-upload-container" ref="containerRef">
              <div class="image-bed-upload-content" ref="uploadDraggerRef">
                <Spin :spinning="imageBed.uploading" indicator="magic-ring">
                  <AUploadDragger
                    v-model:fileList="imageBed.fileList"
                    :beforeUpload="imageBed.beforeUpload"
                    :customRequest="imageBed.customUploadRequest"
                    :directory="false"
                    :maxCount="10"
                    :multiple="true"
                    :disabled="imageBed.uploading || imageBed.isProcessing"
                    :showUploadList="false">
                    <div class="image-bed-upload-content-main">
                      <p class="image-bed-upload-icon">
                        <FileImageOutlined />
                      </p>
                      <p class="image-bed-upload-text">
                        点击或拖拽图片到此处上传
                      </p>
                      <p class="image-bed-upload-hint">
                        支持JPG、PNG、GIF等格式，单张图片不超过10MB
                      </p>
                    </div>
                  </AUploadDragger>
                </Spin>
              </div>
            </div>
          </div>
          <ADivider orientation="center" :plain="true">
            <span class="image-bed-divider-title">上传设置</span>
          </ADivider>
          <div class="image-bed-setting">
            <div class="image-bed-setting-item">
              <AFlex align="center" justify="space-between">
                <span class="image-bed-setting-item-name">自动复制链接</span>
                <ASwitch v-model:checked="imageBed.settings.autoCopy" />
              </AFlex>
            </div>
            <div class="image-bed-setting-item">
              <AFlex align="center" justify="space-between">
                <span class="image-bed-setting-item-name">生成缩略图</span>
                <ASwitch v-model:checked="imageBed.settings.generateThumb" />
              </AFlex>
            </div>
            <div class="image-bed-setting-item">
              <AFlex align="center" justify="space-between">
                <span class="image-bed-setting-item-name">链接格式</span>
                <ASelect v-model:value="imageBed.settings.linkType" style="width: 120px">
                  <ASelectOption value="url">URL</ASelectOption>
                  <ASelectOption value="markdown">Markdown</ASelectOption>
                  <ASelectOption value="html">HTML</ASelectOption>
                  <ASelectOption value="bbcode">BBCode</ASelectOption>
                </ASelect>
              </AFlex>
            </div>
            <div class="image-bed-setting-item">
              <AFlex align="center" justify="space-between">
                <span class="image-bed-setting-item-name">存储位置</span>
                <ASelect
                  v-model:value="imageBed.storageSelected"
                  style="width: 180px"
                  :options="storageOptions"
                  :field-names="{label: 'name', value: 'id'}"
                />
              </AFlex>
            </div>
          </div>
        </ACard>
      </div>
      <div class="image-bed-content-right">
        <ACard class="image-bed-content-right-container">
          <template #title>
            <AFlex align="center" justify="space-between">
              <span>图片列表</span>
              <ARadioGroup v-model:value="imageBed.viewMode" button-style="solid">
                <ARadioButton value="grid">
                  <template #icon><AppstoreOutlined /></template>
                  网格
                </ARadioButton>
                <ARadioButton value="list">
                  <template #icon><BarsOutlined /></template>
                  列表
                </ARadioButton>
              </ARadioGroup>
            </AFlex>
          </template>
          <div class="image-bed-list">
            <div v-if="imageBed.imageList.length === 0" class="image-bed-empty">
              <AEmpty description="暂无图片，请上传" />
            </div>
            <div v-else-if="imageBed.viewMode === 'grid'" class="image-bed-grid">
              <div
                v-for="(item, index) in imageBed.imageList"
                :key="index"
                class="image-bed-grid-item"
                @click="imageBed.selectImage(item)"
              >
                <div class="image-bed-grid-item-container">
                  <img :src="item.url" :alt="item.name" />
                  <div class="image-bed-grid-item-overlay">
                    <AFlex align="center" justify="center" gap="small">
                      <AButton type="primary" shape="circle" size="small" @click.stop="imageBed.copyLink(item)">
                        <template #icon><CopyOutlined /></template>
                      </AButton>
                      <AButton type="primary" shape="circle" size="small" @click.stop="imageBed.showImageDetail(item)">
                        <template #icon><EyeOutlined /></template>
                      </AButton>
                      <AButton type="primary" danger shape="circle" size="small" @click.stop="imageBed.deleteImage(item)">
                        <template #icon><DeleteOutlined /></template>
                      </AButton>
                    </AFlex>
                  </div>
                </div>
                <div class="image-bed-grid-item-info">
                  <div class="image-bed-grid-item-name" :title="item.name">{{ item.name }}</div>
                  <div class="image-bed-grid-item-size">{{ item.size }}</div>
                </div>
              </div>
            </div>
            <div v-else class="image-bed-table">
              <ATable :dataSource="imageBed.imageList" :columns="columns" :pagination="false">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'preview'">
                    <img :src="record.url" :alt="record.name" class="image-bed-table-preview" />
                  </template>
                  <template v-if="column.key === 'action'">
                    <AFlex align="center" justify="center" gap="small">
                      <AButton type="primary" shape="circle" size="small" @click="imageBed.copyLink(record)">
                        <template #icon><CopyOutlined /></template>
                      </AButton>
                      <AButton type="primary" shape="circle" size="small" @click="imageBed.showImageDetail(record)">
                        <template #icon><EyeOutlined /></template>
                      </AButton>
                      <AButton type="primary" danger shape="circle" size="small" @click="imageBed.deleteImage(record)">
                        <template #icon><DeleteOutlined /></template>
                      </AButton>
                    </AFlex>
                  </template>
                </template>
              </ATable>
            </div>
          </div>
        </ACard>
      </div>
    </AFlex>

    <!-- 图片详情弹窗 -->
    <AModal
      v-model:open="imageBed.detailModalVisible"
      :title="imageBed.currentImage?.name || '图片详情'"
      width="800px"
      :footer="null"
      centered
    >
      <div class="image-bed-detail">
        <div class="image-bed-detail-preview">
          <!-- 图片预览 -->
          <div class="image-preview-container">
            <img
              v-if="imageBed.currentImage"
              :src="imageBed.currentImage.url"
              :alt="imageBed.currentImage.name"
              class="preview-image"
              width="200"
              height="300"
            />
          </div>
        </div>
        <div class="image-bed-detail-info">
          <div class="image-bed-detail-item">
            <span class="image-bed-detail-label">文件名：</span>
            <span class="image-bed-detail-value">{{ imageBed.currentImage?.name }}</span>
          </div>
          <div class="image-bed-detail-item">
            <span class="image-bed-detail-label">大小：</span>
            <span class="image-bed-detail-value">{{ imageBed.currentImage?.size }}</span>
          </div>
          <div class="image-bed-detail-item">
            <span class="image-bed-detail-label">上传时间：</span>
            <span class="image-bed-detail-value">{{ imageBed.currentImage?.uploadTime }}</span>
          </div>
          <div class="image-bed-detail-item">
            <span class="image-bed-detail-label">图片链接：</span>
            <div class="image-bed-detail-link">
              <AInput :value="imageBed.getFormattedLink(imageBed.currentImage)" readonly>
                <template #addonAfter>
                  <CopyOutlined @click="imageBed.copyLink(imageBed.currentImage)" />
                </template>
              </AInput>
            </div>
          </div>
          <div class="image-bed-detail-item" v-if="imageBed.currentImage?.thumbUrl">
            <span class="image-bed-detail-label">缩略图链接：</span>
            <div class="image-bed-detail-link">
              <AInput :value="imageBed.getFormattedLink(imageBed.currentImage, true)" readonly>
                <template #addonAfter>
                  <CopyOutlined @click="imageBed.copyLink(imageBed.currentImage, true)" />
                </template>
              </AInput>
            </div>
          </div>
        </div>
      </div>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { FileImageOutlined, CopyOutlined, EyeOutlined, DeleteOutlined, AppstoreOutlined, BarsOutlined} from '@ant-design/icons-vue';


// 存储选项
const storageOptions = ref<any[]>([]);

// 表格列定义
const columns = [
  {
    title: '预览',
    key: 'preview',
    width: 100,
  },
  {
    title: '文件名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    width: 120,
  },
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
    key: 'uploadTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center',
  },
];

// 图床状态和方法
const imageBed = reactive<any>({
  fileList: [],
  imageList: [],
  uploading: false,
  isProcessing: false,
  viewMode: 'grid',
  detailModalVisible: false,
  currentImage: null,
  storageSelected: null,
  settings: {
    autoCopy: true,
    generateThumb: true,
    linkType: 'url',
  },

  // 上传前处理
  async beforeUpload(file) {
    // 检查文件类型
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }

    // 检查文件大小
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('图片大小不能超过10MB！');
      return false;
    }

    imageBed.uploading = true;
    return true;
  },

  // 自定义上传请求
  async customUploadRequest(options) {
    const { file, onSuccess, onError, onProgress } = options;

    try {
      // 这里预留API接口调用
      // 模拟上传进度
      const mockUpload = () => {
        let percent = 0;
        const interval = setInterval(() => {
          percent += 10;
          onProgress({ percent });

          if (percent >= 100) {
            clearInterval(interval);

            // 模拟上传成功
            const mockResult = {
              url: URL.createObjectURL(file),
              name: file.name,
              size: (file.size / 1024).toFixed(2) + ' KB',
              uploadTime: new Date().toLocaleString(),
              thumbUrl: imageBed.settings.generateThumb ? URL.createObjectURL(file) : null,
            };

            imageBed.imageList.unshift(mockResult);
            onSuccess(mockResult);

            // 自动复制链接
            if (imageBed.settings.autoCopy) {
              imageBed.copyLink(mockResult);
            }

            imageBed.uploading = false;
            message.success('上传成功！');
          }
        }, 200);
      };

      mockUpload();
    } catch (error) {
      onError(error);
      imageBed.uploading = false;
      message.error('上传失败！');
    }
  },

  // 复制链接
  copyLink(image, isThumb = false) {
    const link = imageBed.getFormattedLink(image, isThumb);
    navigator.clipboard.writeText(link).then(() => {
      message.success('链接已复制到剪贴板！');
    }).catch(() => {
      message.error('复制失败，请手动复制！');
    });
  },

  // 获取格式化的链接
  getFormattedLink(image, isThumb = false) {
    const url = isThumb ? image.thumbUrl : image.url;
    if (!url) return '';

    switch (imageBed.settings.linkType) {
      case 'markdown':
        return `![${image.name}](${url})`;
      case 'html':
        return `<img src="${url}" alt="${image.name}" />`;
      case 'bbcode':
        return `[img]${url}[/img]`;
      default:
        return url;
    }
  },

  // 显示图片详情
  showImageDetail(image) {
    imageBed.currentImage = image;
    imageBed.detailModalVisible = true;
  },

  // 选择图片
  selectImage(image) {
    imageBed.currentImage = image;
  },

  // 删除图片
  deleteImage(image) {
    // 这里预留API接口调用
    // 模拟删除
    const index = imageBed.imageList.findIndex(item => item.url === image.url);
    if (index !== -1) {
      imageBed.imageList.splice(index, 1);
      message.success('删除成功！');
    }
  },
});

// 获取存储配置列表
const getStorageConfigList = async () => {
  // 这里预留API接口调用
  // 模拟数据
  storageOptions.value = [
    { id: 'aliyun-default', name: 'OSS默认存储' },
    { id: 'qiniu-default', name: '七牛云存储' },
    { id: 'tencent-default', name: '腾讯云存储' },
  ];

  // 默认选择第一个存储
  if (storageOptions.value.length > 0) {
    imageBed.storageSelected = storageOptions.value[0].id;
  }
};

onMounted(() => {
  getStorageConfigList();
});
</script>

<style scoped lang="scss">
.image-bed-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .image-bed-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;

    .image-bed-content-left {
      width: 30%;
      height: 100%;

      .image-bed-content-left-container {
        width: 100%;
        height: 100%;
        overflow: auto;

        .image-bed-divider-title {
          font-size: 14px;
          color: rgba(126, 126, 135, 0.99);
        }

        .image-bed-upload-container {
          width: 100%;
          //padding: 10px;
        }

        .image-bed-upload-content {
          width: 100%;
          border: 2px dashed #d9d9d9;
          border-radius: 8px;
          transition: border-color 0.3s;

          &:hover {
            border-color: #1890ff;
          }
        }

        .image-bed-upload-content-main {
          padding: 20px;
          text-align: center;
        }

        .image-bed-upload-icon {
          font-size: 48px;
          color: #1890ff;
        }

        .image-bed-upload-text {
          margin-top: 10px;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
        }

        .image-bed-upload-hint {
          margin-top: 5px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
        }

        .image-bed-setting {
          padding: 0 10px;

          .image-bed-setting-item {
            margin-bottom: 16px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 6px;

            .image-bed-setting-item-name {
              font-size: 14px;
              color: rgba(0, 0, 0, 0.65);
            }
          }
        }
      }
    }

    .image-bed-content-right {
      width: 70%;
      height: 100%;

      .image-bed-content-right-container {
        width: 100%;
        height: 100%;
        overflow: auto;

        .image-bed-list {
          min-height: 400px;
        }

        .image-bed-empty {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .image-bed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
          padding: 10px;

          .image-bed-grid-item {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s;
            cursor: pointer;

            &:hover {
              transform: translateY(-5px);

              .image-bed-grid-item-overlay {
                opacity: 1;
              }
            }

            .image-bed-grid-item-container {
              position: relative;
              width: 100%;
              height: 150px;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              .image-bed-grid-item-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s;
              }
            }

            .image-bed-grid-item-info {
              padding: 8px;
              background-color: #fff;

              .image-bed-grid-item-name {
                font-size: 14px;
                color: rgba(0, 0, 0, 0.85);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .image-bed-grid-item-size {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.45);
                margin-top: 4px;
              }
            }
          }
        }

        .image-bed-table {
          .image-bed-table-preview {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
          }
        }
      }
    }
  }

  .image-bed-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .image-bed-detail-preview {
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      .image-preview-container {
        width: 100%;
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        border-radius: 4px;
        overflow: hidden;

        .preview-image {
          object-fit: contain;
        }
      }
    }

    .image-bed-detail-info {
      .image-bed-detail-item {
        margin-bottom: 16px;

        .image-bed-detail-label {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          margin-right: 8px;
          display: inline-block;
          width: 80px;
        }

        .image-bed-detail-value {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.85);
        }

        .image-bed-detail-link {
          margin-top: 8px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .image-bed-content {
    flex-direction: column !important;

    .image-bed-content-left,
    .image-bed-content-right {
      width: 100% !important;
    }

    .image-bed-content-left {
      margin-bottom: 20px;
    }
  }
}
</style>
