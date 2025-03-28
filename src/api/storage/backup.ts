import {service} from "@/utils/alova/service.ts";

/**
 * 从一个存储桶备份到另一个存储桶
 * @param sourceStorage 源存储商
 * @param targetStorage 目标存储商
 */
export const backupStorageApi = (sourceStorage: string,  targetStorage: string) => {
    return service.Post('/api/auth/storage/backup', {
        source_storage: sourceStorage,
        target_storage: targetStorage,

    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "backup-storage",
    });
};

/**
 * 获取备份进度
 * @param taskId 备份任务ID
 */
export const getBackupProgressApi = (taskId: string) => {
    return service.Post('/api/auth/storage/backup/progress', {
        task_id: taskId,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "get-backup-progress",
    });
};

/**
 * 取消备份任务
 * @param taskId 备份任务ID
 */
export const cancelBackupTaskApi = (taskId: string) => {
    return service.Post('/api/auth/storage/backup/cancel', {
        task_id: taskId,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "cancel-backup-task",
    });
};
