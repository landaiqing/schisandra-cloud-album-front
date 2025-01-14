export interface UploadedFile {
    id: string; // 唯一标识符
    fileName: string; // 文件名
    file: File | Blob; // 图片数据
    type: string; // 文件类型
    detectionResults: {
        isAnime: boolean;
        hasFace: boolean;
        objectArray: string[] | unknown[];
        landscape: string | null;
    };
}
