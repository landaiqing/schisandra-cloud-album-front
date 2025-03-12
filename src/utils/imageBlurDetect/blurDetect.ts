// blurDetect.ts
import Module from './blur_detect.js';

/**
 * 模糊检测模块 - 使用WebAssembly实现的图像模糊度检测
 */

// 模块初始化状态
let isModuleInitialized = false;
let moduleInstance: any = null;

/**
 * 初始化模糊检测模块
 * @returns Promise<void>
 */
export async function initBlurDetect(): Promise<void> {
  if (isModuleInitialized) return;

  try {
    moduleInstance = await Module();
    isModuleInitialized = true;
    console.log('模糊检测模块初始化成功');
  } catch (error) {
    console.error('模糊检测模块初始化失败:', error);
    throw new Error('模糊检测模块初始化失败');
  }
}

/**
 * 检测图像是否模糊
 * @param imageData - Canvas ImageData对象
 * @param threshold - 模糊度阈值，默认为200，值越小越容易被判定为模糊
 * @returns boolean - true表示图像模糊，false表示图像清晰
 */
export function isBlur(imageData: ImageData, threshold = 200): boolean {
  if (!isModuleInitialized || !moduleInstance) {
    throw new Error('模糊检测模块未初始化，请先调用initBlurDetect()');
  }

  const ptr = moduleInstance._malloc(imageData.data.length);
  if (!ptr) throw new Error('内存分配失败');

  try {
    moduleInstance.HEAPU8.set(imageData.data, ptr);
    const variance = moduleInstance._laplacian_blur_detect(
      ptr,
      imageData.width,
      imageData.height
    );

    if (variance < 0) throw new Error('模糊检测失败');
    return variance < threshold;
  } finally {
    moduleInstance._free(ptr);
  }
}

/**
 * 获取图像的模糊度值
 * @param imageData - Canvas ImageData对象
 * @returns number - 模糊度值，值越小表示图像越模糊
 */
export function getBlurValue(imageData: ImageData): number {
  if (!isModuleInitialized || !moduleInstance) {
    throw new Error('模糊检测模块未初始化，请先调用initBlurDetect()');
  }

  const ptr = moduleInstance._malloc(imageData.data.length);
  if (!ptr) throw new Error('内存分配失败');

  try {
    moduleInstance.HEAPU8.set(imageData.data, ptr);
    const variance = moduleInstance._laplacian_blur_detect(
      ptr,
      imageData.width,
      imageData.height
    );

    if (variance < 0) throw new Error('模糊检测失败');
    return variance;
  } finally {
    moduleInstance._free(ptr);
  }
}

/**
 * 从Image或Canvas元素创建ImageData
 * @param source - HTMLImageElement或HTMLCanvasElement
 * @returns ImageData
 */
export function createImageDataFromSource(source: HTMLImageElement | HTMLCanvasElement): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('无法创建Canvas上下文');
  }

  canvas.width = source.width || (source as HTMLImageElement).naturalWidth || 300;
  canvas.height = source.height || (source as HTMLImageElement).naturalHeight || 200;

  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * 从URL加载图像并检测模糊度
 * @param url - 图像URL
 * @param threshold - 模糊度阈值
 * @returns Promise<{isBlurry: boolean, blurValue: number}>
 */
export async function detectBlurFromUrl(url: string, threshold = 200): Promise<{isBlurry: boolean, blurValue: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const imageData = createImageDataFromSource(img);
        const blurValue = getBlurValue(imageData);
        const isBlurry = blurValue < threshold;

        resolve({
          isBlurry,
          blurValue
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('图像加载失败'));
    };

    img.src = url;
  });
}

/**
 * 从File对象检测模糊度
 * @param file - 图像文件
 * @param threshold - 模糊度阈值
 * @returns Promise<{isBlurry: boolean, blurValue: number}>
 */
export async function detectBlurFromFile(file: File, threshold = 200): Promise<{isBlurry: boolean, blurValue: number}> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('文件不是图像类型'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const url = event.target?.result as string;
      detectBlurFromUrl(url, threshold)
        .then(resolve)
        .catch(reject);
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsDataURL(file);
  });
}
