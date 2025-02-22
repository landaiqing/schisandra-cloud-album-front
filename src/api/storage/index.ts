import {service} from "@/utils/alova/service.ts";

/**
 * 上传文件
 * @param formData
 */
export const uploadFile = (formData) => {
    return service.Post('/api/auth/storage/uploads', formData, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "upload-file",
    });
};

/**
 * 获取用户人脸样本列表
 * @param type
 */
export const getFaceSamplesList = (type: number) => {
    return service.Post('/api/auth/storage/face/sample/list', {
        type: type,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["modify-face-sample-name", "modify-face-sample-type", "delete-images"],
    });
};
/**
 * 获取人脸样本详情列表
 * @param face_id
 * @param provider
 * @param bucket
 */
export const getFaceSamplesDetailList = (face_id: number, provider: string, bucket: string) => {
    return service.Post('/api/auth/storage/face/detail/list', {
        face_id: face_id,
        provider: provider,
        bucket: bucket,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["modify-face-sample-name", "modify-face-sample-type"],
    });
};
/**
 * 修改人脸样本名称
 * @param id
 * @param face_name
 */
export const modifyFaceSampleName = (id: number, face_name: string) => {
    return service.Post('/api/auth/storage/face/sample/modify/name', {
        id: id,
        face_name: face_name,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "modify-face-sample-name",
    });
};
/**
 * 批量修改人脸样本类型
 * @param ids
 * @param face_type
 */
export const modifyFaceTypeBatch = (ids: number[], face_type: number) => {
    return service.Post('/api/auth/storage/face/sample/modify/type', {
        ids: ids,
        face_type: face_type,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "modify-face-sample-type"
    });
};
/**
 * 创建相册
 * @param name
 */
export const createAlbumApi = (name: string) => {
    return service.Post('/api/auth/storage/album/create', {
        name: name,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "create-album",
    });
};
/**
 * 获取相册列表
 * @param type
 * @param sort
 */
export const albumListApi = (type: number, sort: boolean) => {
    return service.Post('/api/auth/storage/album/list', {
        type: type,
        sort: sort,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["create-album", "rename-album", "delete-album"],
    });
};
/**
 * 获取相册详情列表
 * @param id
 * @param provider
 * @param bucket
 */
export const queryAlbumDetailListApi = (id: number, provider: string, bucket: string) => {
    return service.Post('/api/auth/storage/album/detail/list', {
        id: id,
        provider: provider,
        bucket: bucket,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "album-detail-list",
        hitSource: ["upload-file", "delete-images"],
    });
};

/**
 *  重命名相册
 * @param id
 * @param name
 */
export const renameAlbumApi = (id: number, name: string) => {
    return service.Post('/api/auth/storage/album/rename', {
        id: id,
        name: name,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "rename-album",
    });
};
/**
 * 删除相册
 * @param id
 */
export const deleteAlbumApi = (id: number) => {
    return service.Post('/api/auth/storage/album/delete', {
        id: id,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "delete-album",
    });
};
/**
 * 获取所有照片列表
 * @param type
 * @param sort
 * @param provider
 * @param bucket
 */
export const queryAllImagesApi = (type: string, sort: boolean, provider: string, bucket: string) => {
    return service.Post('/api/auth/storage/image/all/list', {
        type: type,
        sort: sort,
        provider: provider,
        bucket: bucket,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["upload-file", "delete-images"],
    });
};


/**
 * 获取最近照片列表
 */
export const queryRecentImagesApi = () => {
    return service.Post('/api/auth/storage/image/recent/list', {}, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["upload-file", "delete-images"],
    });
};
/**
 *  获取地址相册列表
 */
export const queryLocationAlbumApi = (provider: string, bucket: string) => {
    return service.Post('/api/auth/storage/image/location/list', {
        provider: provider,
        bucket: bucket,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["upload-file", "delete-images"],
    });
};
/**
 * 获取地址相册列表详情
 * @param id
 * @param provider
 * @param bucket
 */
export const queryLocationDetailListApi = (id: number, provider: string, bucket: string) => {
    return service.Post('/api/auth/storage/image/location/detail/list', {
        provider: provider,
        bucket: bucket,
        id: id,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["upload-file", "delete-images"],
    });
};

/**
 *  获取标签相册列表
 */
export const queryThingAlbumApi = (provider: string, bucket: string) => {
    return service.Post('/api/auth/storage/image/thing/list', {
        provider: provider,
        bucket: bucket,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["upload-file", "delete-images"],
    });
};

/**
 * 获取事物标签列表详情
 * @param tag_name
 * @param provider
 * @param bucket
 */
export const queryThingDetailListApi = (tag_name: string, provider: string, bucket: string) => {
    return service.Post('/api/auth/storage/image/thing/detail/list', {
        provider: provider,
        bucket: bucket,
        tag_name: tag_name,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["upload-file", "delete-images"],
    });
};

/**
 * 获取单个照片url
 * @param id
 */
export const getSingleImageApi = (id: number) => {
    return service.Post('/api/auth/storage/image/url/single', {
        id: id,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "single-image-url",
    });
};
/**
 *  获取用户配置列表
 */
export const getStorageConfigListApi = () => {
    return service.Post('/api/auth/storage/user/config/list', {}, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "storage-config-list",
    });
};
/**
 * 查询删除记录
 * @param provider
 * @param bucket
 */
export const getDeletedRecordApi = (provider: string, bucket: string) => {
    return service.Post('/api/auth/storage/delete/record', {
        provider: provider,
        bucket: bucket,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "deleted-record",
        hitSource: ["upload-file", "delete-images"],
    });
};
/**
 * 删除照片
 * @param ids
 * @param provider
 * @param bucket
 */
export const deletedImagesApi = (ids: number[], provider: string, bucket: string) => {
    return service.Post('/api/auth/storage/image/delete', {
        ids: ids,
        provider: provider,
        bucket: bucket,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "delete-images",
    });
};
/**
 * 获取存储桶容量
 * @param provider
 * @param bucket
 */
export const getBucketCapacityApi = (provider: string, bucket: string) => {
    return service.Post('/api/auth/storage/bucket/capacity', {
        provider: provider,
        bucket: bucket,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "delete-images",
    });
};
